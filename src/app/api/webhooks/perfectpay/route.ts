import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendWelcomeEmail } from '@/lib/mailService';

/**
 * Webhook Route Handler - PerfectPay para Next.js (App Router)
 * Endpoint: POST /api/webhooks/perfectpay
 */

const PERFECTPAY_SECURITY_TOKEN = process.env.PERFECTPAY_SECURITY_TOKEN;
const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD || 'CANALDARK123';

// Códigos de status de venda da PerfectPay
const APPROVED_STATUSES = [2, 7, 10]; // 2: Aprovado, 7: Faturado, 10: Completo
const REVOKED_STATUSES = [3, 4, 6, 11]; // 3: Recusado, 4: Cancelado, 6: Reembolsado, 11: Chargeback

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let data: Record<string, any> = {};

    // 1. Tratamento flexível: suporta application/json e application/x-www-form-urlencoded (FormData)
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const rawText = await request.text();
      const params = new URLSearchParams(rawText);
      data = Object.fromEntries(params.entries());
    } else {
      try {
        const formData = await request.formData();
        data = Object.fromEntries(formData.entries());
      } catch {
        const rawText = await request.text();
        try {
          data = JSON.parse(rawText);
        } catch {
          const params = new URLSearchParams(rawText);
          data = Object.fromEntries(params.entries());
        }
      }
    }

    // 2. Validação de Segurança do Token
    const receivedToken =
      data.token ||
      data.security_token ||
      request.headers.get('x-perfectpay-token');

    if (!PERFECTPAY_SECURITY_TOKEN || receivedToken !== PERFECTPAY_SECURITY_TOKEN) {
      console.warn('[Webhook PerfectPay] Não autorizado: Token incorreto ou ausente.');
      return NextResponse.json(
        { success: false, error: 'Token de segurança inválido' },
        { status: 401 }
      );
    }

    // 3. Captura e normalização dos dados essenciais do cliente e do pedido
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

    // Identificador vindo do parâmetro de rastreio (?src=...)
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

    console.log(`[Webhook PerfectPay] Venda: ${saleId} | Status: ${saleStatus} | Email: ${customerEmail} | Ref: ${referenceId}`);

    // 4. Fluxo de Compra Aprovada (2 = Aprovado, 7 = Faturado, 10 = Completo)
    if (APPROVED_STATUSES.includes(saleStatus)) {
      if (!customerEmail || !customerEmail.includes('@')) {
        return NextResponse.json(
          { success: false, error: 'E-mail do comprador inválido ou não fornecido' },
          { status: 400 }
        );
      }

      let userId: string | null = null;

      // 4.1 Criação ou busca de conta automática no Firebase Auth
      try {
        const newUser = await adminAuth.createUser({
          email: customerEmail,
          password: DEFAULT_USER_PASSWORD,
          displayName: customerName,
          emailVerified: true,
        });
        userId = newUser.uid;
        console.log(`[Webhook PerfectPay] Novo usuário criado no Auth: ${userId} (${customerEmail})`);
      } catch (authError: any) {
        // Se o e-mail já existir, recuperamos o UID existente sem travar o processo
        if (
          authError.code === 'auth/email-already-exists' ||
          authError.code === 'auth/email-already-in-use' ||
          authError.message?.includes('already in use') ||
          authError.message?.includes('already exists')
        ) {
          try {
            const existingUser = await adminAuth.getUserByEmail(customerEmail);
            userId = existingUser.uid;
            console.log(`[Webhook PerfectPay] Usuário já existia no Auth. UID recuperado: ${userId}`);
          } catch (getUserErr) {
            console.error('[Webhook PerfectPay] Erro ao buscar usuário existente:', getUserErr);
          }
        } else {
          console.error('[Webhook PerfectPay] Erro inesperado no Firebase Auth:', authError);
        }
      }

      // 4.2 Liberação do acesso e registro da compra no Firebase Firestore
      const purchaseData = {
        userId: userId || null,
        customerEmail,
        customerName,
        customerPhone,
        referenceId: referenceId || null,
        saleId,
        status: 'approved', // ou 'published', conforme sua regra
        saleStatus,
        productName: data.product_name || data.produto || 'Produto Digital',
        paymentType: data.payment_type || data.forma_pagamento || 'perfectpay',
        updatedAt: FieldValue.serverTimestamp(),
        approvedAt: FieldValue.serverTimestamp(),
      };

      // Se passou um ?src=ID_DO_PEDIDO, atualiza o documento existente desse pedido
      if (referenceId) {
        const orderRef = adminDb.collection('orders').doc(referenceId);
        await orderRef.set(
          {
            ...purchaseData,
            status: 'approved', // ou 'published'
          },
          { merge: true }
        );

        // Opcional: Se seu projeto usa uma coleção de "sites" ou "projects":
        const siteRef = adminDb.collection('sites').doc(referenceId);
        const siteDoc = await siteRef.get();
        if (siteDoc.exists) {
          await siteRef.update({
            userId: userId || siteDoc.data()?.userId,
            customerEmail,
            status: 'published',
            isPaid: true,
            updatedAt: FieldValue.serverTimestamp(),
          });
        }
      }

      // Também registra na coleção geral de compras (purchases) vinculada ao cliente
      await adminDb.collection('purchases').doc(saleId).set(purchaseData, { merge: true });

      // Atualiza ou cria o documento do perfil do usuário em /users/{userId}
      if (userId) {
        await adminDb.collection('users').doc(userId).set(
          {
            email: customerEmail,
            name: customerName,
            phone: customerPhone,
            hasActiveAccess: true,
            tier: 'premium',
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }

      // 4.3 Envio do e-mail automático com os dados de acesso para o comprador
      try {
        await sendWelcomeEmail({
          to: customerEmail,
          name: customerName,
          password: DEFAULT_USER_PASSWORD,
          loginUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://seusite.com.br',
        });
        console.log(`[Webhook PerfectPay] E-mail de acesso disparado para ${customerEmail}!`);
      } catch (emailErr) {
        console.error('[Webhook PerfectPay] Erro no envio do e-mail (não bloqueante):', emailErr);
      }

      console.log(`[Webhook PerfectPay] Acesso liberado no Firestore com sucesso para ${customerEmail}!`);

      return NextResponse.json({
        success: true,
        message: 'Acesso liberado e e-mail de boas-vindas enviado com sucesso',
        userId,
        customerEmail,
      });
    }

    // 5. Fluxo de Cancelamento / Reembolso / Chargeback (3, 4, 6, 11)
    if (REVOKED_STATUSES.includes(saleStatus)) {
      console.log(`[Webhook PerfectPay] Bloqueando acesso para venda ${saleId} (Status: ${saleStatus})`);

      // Bloqueia o registro do pedido pelo referenceId (se informado)
      if (referenceId) {
        await adminDb.collection('orders').doc(referenceId).set(
          {
            status: 'blocked',
            saleStatus,
            revokedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        const siteRef = adminDb.collection('sites').doc(referenceId);
        const siteDoc = await siteRef.get();
        if (siteDoc.exists) {
          await siteRef.update({
            status: 'blocked',
            isPaid: false,
            updatedAt: FieldValue.serverTimestamp(),
          });
        }
      }

      // Atualiza a compra na coleção de purchases
      await adminDb.collection('purchases').doc(saleId).set(
        {
          status: 'blocked',
          saleStatus,
          revokedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      // Bloqueia acesso do usuário se aplicável
      if (customerEmail) {
        try {
          const user = await adminAuth.getUserByEmail(customerEmail);
          if (user) {
            await adminDb.collection('users').doc(user.uid).set(
              {
                hasActiveAccess: false,
                tier: 'revoked',
                updatedAt: FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          }
        } catch (err) {
          // Ignora se não achar usuário
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Acesso bloqueado por cancelamento/reembolso',
      });
    }

    // 6. Outros status (1 = Aguardando pagamento, etc.)
    return NextResponse.json({
      success: true,
      message: `Status ${saleStatus} recebido e registrado. Nenhuma ação necessária.`,
    });

  } catch (error: any) {
    console.error('[Webhook PerfectPay Error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro interno no webhook' },
      { status: 500 }
    );
  }
}
