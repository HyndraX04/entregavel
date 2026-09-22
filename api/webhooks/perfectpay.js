/**
 * Vercel Serverless Function: Webhook PerfectPay -> Firebase Admin
 * Endpoint: POST /api/webhooks/perfectpay
 */

const admin = require('firebase-admin');

// Inicializa o Firebase Admin como singleton
function getFirebaseAdmin() {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      console.warn('[Firebase Admin] Variáveis de ambiente incompletas');
    }
  }
  return admin;
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
  // Configura CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-perfectpay-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
  }

  try {
    let data = req.body;

    // Tratamento caso o body venha como string bruta
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

    // 1. Validação de Token de Segurança
    const receivedToken =
      data.token ||
      data.security_token ||
      req.headers['x-perfectpay-token'];

    if (PERFECTPAY_SECURITY_TOKEN && receivedToken !== PERFECTPAY_SECURITY_TOKEN) {
      console.warn('[Webhook PerfectPay] Token de segurança inválido ou ausente.');
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
      data.sale_status_enum ?? data.statusPagamento ?? data.status
    );

    console.log(`[Webhook PerfectPay] Processando Venda: ${saleId} | Status: ${saleStatus} | Email: ${customerEmail}`);

    const fb = getFirebaseAdmin();
    const auth = fb.auth();
    const db = fb.firestore();

    const APPROVED_STATUSES = [2, 7, 10]; // 2: Aprovado, 7: Faturado, 10: Completo
    const REVOKED_STATUSES = [3, 4, 6, 11]; // 3: Recusado, 4: Cancelado, 6: Reembolsado, 11: Chargeback

    // 3. Status Aprovado: Cria/Ativa Conta
    if (APPROVED_STATUSES.includes(saleStatus)) {
      if (!customerEmail || !customerEmail.includes('@')) {
        return res.status(400).json({ success: false, error: 'E-mail do comprador inválido' });
      }

      let userId = null;

      // 3.1 Criação ou busca no Firebase Authentication
      try {
        const newUser = await auth.createUser({
          email: customerEmail,
          password: DEFAULT_USER_PASSWORD,
          displayName: customerName,
          emailVerified: true,
        });
        userId = newUser.uid;
        console.log(`[Webhook] Novo usuário criado no Auth: ${userId} (${customerEmail})`);
      } catch (authError) {
        if (
          authError.code === 'auth/email-already-exists' ||
          authError.code === 'auth/email-already-in-use' ||
          authError.message?.includes('already in use') ||
          authError.message?.includes('already exists')
        ) {
          try {
            const existing = await auth.getUserByEmail(customerEmail);
            userId = existing.uid;
            console.log(`[Webhook] Usuário existente recuperado: ${userId}`);
          } catch (getErr) {
            console.error('[Webhook] Erro ao recuperar usuário existente:', getErr);
          }
        } else {
          console.error('[Webhook] Erro no Firebase Auth:', authError);
        }
      }

      // 3.2 Atualização no Cloud Firestore
      const now = admin.firestore.FieldValue.serverTimestamp();
      const purchaseRecord = {
        userId,
        customerEmail,
        customerName,
        customerPhone,
        saleId,
        referenceId: referenceId || null,
        status: 'approved',
        saleStatus,
        productName: data.product_name || data.produto || 'Método Canal Dark',
        updatedAt: now,
      };

      await db.collection('purchases').doc(saleId).set(purchaseRecord, { merge: true });

      if (userId) {
        await db.collection('users').doc(userId).set({
          email: customerEmail,
          name: customerName,
          phone: customerPhone,
          hasActiveAccess: true,
          status: 'active',
          tier: 'premium',
          role: 'student',
          updatedAt: now,
        }, { merge: true });
      }

      // 3.3 Disparo de E-mail de Boas-Vindas
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://metodocanaldark.com.br';
      await sendWelcomeEmail({
        to: customerEmail,
        name: customerName,
        password: DEFAULT_USER_PASSWORD,
        loginUrl: `${appUrl}/login.html`,
      });

      return res.status(200).json({
        success: true,
        message: 'Acesso liberado no Firebase com sucesso!',
        userId,
        customerEmail,
      });
    }

    // 4. Status Cancelado/Reembolsado: Revoga Acesso
    if (REVOKED_STATUSES.includes(saleStatus)) {
      console.log(`[Webhook] Revogando acesso para ${customerEmail} (Status ${saleStatus})`);
      const now = admin.firestore.FieldValue.serverTimestamp();

      await db.collection('purchases').doc(saleId).set({
        status: 'blocked',
        saleStatus,
        revokedAt: now,
      }, { merge: true });

      if (customerEmail) {
        try {
          const user = await auth.getUserByEmail(customerEmail);
          if (user) {
            await db.collection('users').doc(user.uid).set({
              hasActiveAccess: false,
              status: 'blocked',
              tier: 'revoked',
              revokedAt: now,
            }, { merge: true });
          }
        } catch (e) {
          // Usuário pode não existir
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Acesso revogado com sucesso.',
      });
    }

    // 5. Outros status (pendente, etc.)
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
