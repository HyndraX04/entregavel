/**
 * Vercel Serverless Function: Webhook PerfectPay -> Firebase
 * Endpoint: POST /api/webhooks/perfectpay
 */

const admin = require('firebase-admin');

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyBMAHm1NsA46HRtiIzobd8QgYPhETqY92w';
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'metodo-canal-dark';

// Inicializa o Firebase Admin como singleton (se credenciais estiverem no ambiente)
function getFirebaseAdmin() {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    if (projectId && clientEmail && privateKey) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      } catch (e) {
        console.warn('[Firebase Admin Init Error]:', e.message);
      }
    }
  }
  return admin;
}

// Garante usuário no Firebase Auth (tenta Admin primeiro, fallback para Identity Toolkit REST)
async function ensureAuthUser({ email, password, name }) {
  if (admin.apps.length > 0) {
    try {
      const newUser = await admin.auth().createUser({
        email,
        password,
        displayName: name,
        emailVerified: true,
      });
      return { uid: newUser.uid, created: true };
    } catch (authErr) {
      if (
        authErr.code === 'auth/email-already-exists' ||
        authErr.code === 'auth/email-already-in-use' ||
        authErr.message?.includes('already exists')
      ) {
        const existing = await admin.auth().getUserByEmail(email);
        return { uid: existing.uid, created: false };
      }
      throw authErr;
    }
  }

  // Fallback REST API
  try {
    const signupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
    const res = await fetch(signupUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await res.json();
    if (data.localId) {
      return { uid: data.localId, idToken: data.idToken, created: true };
    }
    if (data.error?.message === 'EMAIL_EXISTS') {
      const signinUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
      const signinRes = await fetch(signinUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      });
      const signinData = await signinRes.json();
      return { uid: signinData.localId, idToken: signinData.idToken, created: false };
    }
  } catch (restErr) {
    console.warn('[REST Auth Fallback Error]:', restErr.message);
  }
  return { uid: null, created: false };
}

// Atualiza perfil no Firestore (tenta Admin primeiro, fallback para Firestore REST)
async function syncFirestoreUser({ uid, email, name, phone, idToken, status = 'active', hasActiveAccess = true }) {
  if (admin.apps.length > 0 && uid) {
    const now = admin.firestore.FieldValue.serverTimestamp();
    await admin.firestore().collection('users').doc(uid).set({
      email,
      name,
      phone,
      hasActiveAccess,
      status,
      tier: 'premium',
      role: 'student',
      updatedAt: now,
    }, { merge: true });
    return;
  }

  if (uid && idToken) {
    try {
      const fsUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${uid}`;
      await fetch(fsUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          fields: {
            email: { stringValue: email },
            name: { stringValue: name || '' },
            phone: { stringValue: phone || '' },
            hasActiveAccess: { booleanValue: hasActiveAccess },
            status: { stringValue: status },
            role: { stringValue: 'student' },
            tier: { stringValue: 'premium' },
          },
        }),
      });
    } catch (e) {
      console.warn('[REST Firestore Fallback Error]:', e.message);
    }
  }
}

// Disparo de e-mail via Resend (se chave configurada)
async function sendWelcomeEmail({ to, name, password, loginUrl }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const fromEmail = process.env.EMAIL_FROM || 'Metodo Canal Dark <onboarding@resend.dev>';
  const body = {
    from: fromEmail,
    to: [to],
    subject: '🔥 Seu acesso ao Método Canal Dark está liberado!',
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Acesso Liberado | Método Canal Dark</title>
      </head>
      <body style="margin: 0; padding: 20px; background-color: #07070a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #0e0e15; border-radius: 20px; border: 1px solid rgba(234, 179, 8, 0.25); overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
          
          <!-- Topo com Logo e Marca -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px; background: linear-gradient(180deg, rgba(234, 179, 8, 0.12) 0%, rgba(14, 14, 21, 0) 100%);">
              <div style="display: inline-block; width: 56px; height: 56px; line-height: 56px; border-radius: 16px; background-color: rgba(234, 179, 8, 0.15); border: 1px solid rgba(234, 179, 8, 0.4); text-align: center; margin-bottom: 12px;">
                <span style="font-size: 26px;">👑</span>
              </div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;">MÉTODO CANAL DARK</h1>
              <p style="margin: 4px 0 0; font-size: 11px; font-weight: 700; letter-spacing: 3px; color: #eab308; text-transform: uppercase;">Dark Channel Academy</p>
            </td>
          </tr>

          <!-- Mensagem Principal -->
          <tr>
            <td style="padding: 10px 35px 25px;">
              <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 50px; padding: 6px 16px; display: inline-block; margin-bottom: 16px;">
                <span style="font-size: 12px; font-weight: 700; color: #34d399;">✓ Pagamento Confirmado com Sucesso</span>
              </div>

              <h2 style="margin: 0 0 12px; font-size: 24px; font-weight: 700; color: #ffffff;">
                Parabéns pela decisão, <span style="color: #facc15;">${name || 'Membro'}</span>!
              </h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #9ca3af;">
                Seu acesso à plataforma exclusiva do <strong>Método Canal Dark</strong> já foi criado e liberado. A partir de agora, você tem tudo o que precisa para construir e escalar seus canais sem aparecer.
              </p>

              <!-- Card de Credenciais -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #14141f; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 25px;">
                <tr>
                  <td style="padding: 22px;">
                    <p style="margin: 0 0 16px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #eab308;">
                      🔑 Seus Dados de Acesso
                    </p>
                    
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 12px; font-size: 13px; color: #9ca3af;" width="40%">Link da Plataforma:</td>
                        <td style="padding-bottom: 12px; font-size: 13px; font-weight: 600; color: #facc15;" width="60%">
                          <a href="${loginUrl}" style="color: #facc15; text-decoration: underline;">${loginUrl}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px; font-size: 13px; color: #9ca3af;">Seu E-mail:</td>
                        <td style="padding-bottom: 12px; font-size: 13px; font-weight: 700; color: #ffffff;">${to}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af;">Senha Inicial:</td>
                        <td style="font-size: 14px; font-weight: 800; font-family: monospace; color: #facc15; background-color: rgba(234, 179, 8, 0.1); padding: 4px 8px; border-radius: 6px; display: inline-block;">
                          ${password}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Botão Principal de Acesso -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" style="display: block; width: 100%; box-sizing: border-box; background: linear-gradient(135deg, #f59e0b 0%, #eab308 50%, #facc15 100%); color: #000000; text-decoration: none; font-size: 15px; font-weight: 900; letter-spacing: 0.5px; padding: 18px 24px; border-radius: 14px; text-align: center; box-shadow: 0 6px 25px rgba(234, 179, 8, 0.35);">
                      ACESSAR ÁREA DE MEMBROS AGORA →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Dicas de Acesso -->
              <div style="background-color: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; color: #ffffff;">📌 Como começar agora mesmo:</p>
                <ol style="margin: 0; padding-left: 20px; font-size: 12px; color: #9ca3af; line-height: 1.6;">
                  <li>Clique no botão dourado acima para abrir a tela de login.</li>
                  <li>Insira o seu e-mail (<strong>${to}</strong>) e a senha (<strong>${password}</strong>).</li>
                  <li>Inicie imediatamente pelo <strong>Módulo 01: Fundamentos do Canal Dark</strong>.</li>
                </ol>
              </div>

              <!-- Suporte -->
              <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center; line-height: 1.5;">
                Dúvidas ou precisa de ajuda com o seu login?<br>
                Nossa equipe de suporte está à sua disposição. Responda a este e-mail ou fale conosco no suporte.
              </p>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td align="center" style="padding: 20px 30px; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 11px; color: #4b5563;">
              © ${new Date().getFullYear()} Método Canal Dark • Dark Channel Academy. Todos os direitos reservados.
            </td>
          </tr>

        </table>
      </body>
      </html>
    `,
  };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    console.log('[Email Resend] Resposta:', result);
  } catch (err) {
    console.error('[Email Resend] Erro ao enviar:', err);
  }
}

// Handler da função Serverless da Vercel
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-perfectpay-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'active',
      service: 'PerfectPay Webhook - Método Canal Dark',
      endpoint: '/api/webhooks/perfectpay',
      ready: true
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
  }

  try {
    let data = req.body;

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        const params = new URLSearchParams(data);
        data = Object.fromEntries(params.entries());
      }
    }

    data = data || {};

    const PERFECTPAY_SECURITY_TOKEN = process.env.PERFECTPAY_SECURITY_TOKEN;
    const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD || 'CANALDARK123';

    // 1. Validação de Token de Segurança (se configurado)
    const receivedToken =
      data.token ||
      data.security_token ||
      req.headers['x-perfectpay-token'];

    if (PERFECTPAY_SECURITY_TOKEN && receivedToken && receivedToken !== PERFECTPAY_SECURITY_TOKEN) {
      console.warn('[Webhook PerfectPay] Token de segurança divergente.');
      return res.status(401).json({ success: false, error: 'Token de segurança inválido' });
    }

    // 2. Extração dos dados do comprador
    const customerEmail = String(
      data.clienteEmail ||
      data.customer_email ||
      data.customer?.email ||
      data.email ||
      ''
    ).toLowerCase().trim();

    const customerName = String(
      data.clienteNome ||
      data.customer_name ||
      data.customer?.full_name ||
      data.customer?.name ||
      data.name ||
      'Cliente'
    ).trim();

    const customerPhone = String(
      data.clienteTelefone ||
      data.customer_phone ||
      data.customer?.phone_number ||
      data.phone ||
      ''
    ).trim();

    const referenceId = String(
      data.src ||
      data.tracking_parameters?.src ||
      data.reference ||
      data.reference_id ||
      data.code ||
      ''
    ).trim();

    const saleId = String(
      data.sale_id ||
      data.transaction_id ||
      data.codigo ||
      referenceId ||
      Date.now()
    );

    const saleStatus = Number(
      data.sale_status_enum ?? data.statusPagamento ?? data.status ?? 2
    );

    console.log(`[Webhook PerfectPay] Venda: ${saleId} | Status: ${saleStatus} | Email: ${customerEmail}`);

    // Inicializa Admin se possível
    getFirebaseAdmin();

    const APPROVED_STATUSES = [2, 7, 10]; // 2: Aprovado, 7: Faturado, 10: Completo
    const REVOKED_STATUSES = [3, 4, 6, 11]; // 3: Recusado, 4: Cancelado, 6: Reembolsado, 11: Chargeback

    // Se for teste do PerfectPay sem email válido, responde com sucesso
    if (!customerEmail || !customerEmail.includes('@')) {
      return res.status(200).json({
        success: true,
        message: 'Teste de Webhook PerfectPay recebido com sucesso!',
      });
    }

    // 3. Status Aprovado: Cria/Ativa Conta
    if (APPROVED_STATUSES.includes(saleStatus)) {
      const { uid, idToken } = await ensureAuthUser({
        email: customerEmail,
        password: DEFAULT_USER_PASSWORD,
        name: customerName,
      });

      if (uid) {
        await syncFirestoreUser({
          uid,
          email: customerEmail,
          name: customerName,
          phone: customerPhone,
          idToken,
          status: 'active',
          hasActiveAccess: true,
        });
      }

      // Registro de compra no Firestore (se admin ativo)
      if (admin.apps.length > 0) {
        const now = admin.firestore.FieldValue.serverTimestamp();
        await admin.firestore().collection('purchases').doc(saleId).set({
          userId: uid,
          customerEmail,
          customerName,
          customerPhone,
          saleId,
          referenceId: referenceId || null,
          status: 'approved',
          saleStatus,
          productName: data.product_name || data.produto || 'Método Canal Dark',
          updatedAt: now,
        }, { merge: true });
      }

      // Disparo de E-mail de Boas-Vindas
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://metodo-canal-dark-ia.vercel.app';
      await sendWelcomeEmail({
        to: customerEmail,
        name: customerName,
        password: DEFAULT_USER_PASSWORD,
        loginUrl: `${appUrl}/login`,
      });

      return res.status(200).json({
        success: true,
        message: 'Acesso liberado no Firebase com sucesso!',
        userId: uid,
        customerEmail,
      });
    }

    // 4. Status Cancelado/Reembolsado: Revoga Acesso
    if (REVOKED_STATUSES.includes(saleStatus)) {
      console.log(`[Webhook] Revogando acesso para ${customerEmail}`);
      if (admin.apps.length > 0) {
        const now = admin.firestore.FieldValue.serverTimestamp();
        await admin.firestore().collection('purchases').doc(saleId).set({
          status: 'blocked',
          saleStatus,
          revokedAt: now,
        }, { merge: true });

        try {
          const user = await admin.auth().getUserByEmail(customerEmail);
          if (user) {
            await admin.firestore().collection('users').doc(user.uid).set({
              hasActiveAccess: false,
              status: 'blocked',
              tier: 'revoked',
              revokedAt: now,
            }, { merge: true });
          }
        } catch (e) {}
      }

      return res.status(200).json({
        success: true,
        message: 'Acesso revogado com sucesso.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Status ${saleStatus} registrado. Nenhuma alteração de acesso necessária.`,
    });

  } catch (error) {
    console.error('[Webhook PerfectPay Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno no servidor',
    });
  }
};
