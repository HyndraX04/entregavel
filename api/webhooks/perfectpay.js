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
    subject: 'Seu acesso ao Método Canal Dark está liberado! 🚀',
    html: `
      <div style="font-family: Arial, sans-serif; background: #0c0c11; color: #fff; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #facc15; font-size: 22px; text-transform: uppercase;">MÉTODO CANAL DARK</h1>
        <p style="color: #bbb; font-size: 14px;">Dark Channel Academy</p>
        <hr style="border: 0; border-top: 1px solid #232336; margin: 20px 0;" />
        <p>Olá, <strong>${name || 'Membro'}</strong>!</p>
        <p>Seu pagamento foi confirmado com sucesso. Aqui estão seus dados de acesso exclusivos:</p>
        <div style="background: #161622; border: 1px solid #ca8a04; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Link da Área de Membros:</strong> <a href="${loginUrl}" style="color: #facc15;">${loginUrl}</a></p>
          <p style="margin: 5px 0;"><strong>E-mail:</strong> ${to}</p>
          <p style="margin: 5px 0;"><strong>Senha Inicial:</strong> <code style="background: #000; padding: 3px 6px; border-radius: 4px; color: #facc15;">${password}</code></p>
        </div>
        <p style="color: #999; font-size: 12px;">Recomendamos alterar sua senha após o primeiro acesso.</p>
      </div>
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
