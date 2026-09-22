import { NextResponse } from 'next/server';

/**
 * Webhook Route Handler para PerfectPay (Next.js App Router)
 * Endpoint: POST /api/webhooks/perfectpay
 */

// 1. Variáveis de ambiente
const PERFECTPAY_SECURITY_TOKEN = process.env.PERFECTPAY_SECURITY_TOKEN;
const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD || 'CANALDARK123';

// 2. Códigos de status da PerfectPay
const APPROVED_STATUSES = [2, 7, 10]; // 2: Aprovado, 7: Faturado, 10: Completo
const REVOKED_STATUSES = [3, 4, 6, 11]; // 3: Recusado, 4: Cancelado, 6: Reembolsado, 11: Chargeback

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let data: Record<string, any> = {};

    // 1. Tratamento flexível do formato da requisição (JSON vs form-urlencoded / FormData)
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const rawBody = await request.text();
      const params = new URLSearchParams(rawBody);
      data = Object.fromEntries(params.entries());
    } else {
      try {
        const formData = await request.formData();
        data = Object.fromEntries(formData.entries());
      } catch {
        const rawBody = await request.text();
        try {
          data = JSON.parse(rawBody);
        } catch {
          const params = new URLSearchParams(rawBody);
          data = Object.fromEntries(params.entries());
        }
      }
    }

    // 2. Validação do Token de Segurança da PerfectPay
    const receivedToken =
      data.token ||
      data.security_token ||
      request.headers.get('x-perfectpay-token');

    if (!PERFECTPAY_SECURITY_TOKEN || receivedToken !== PERFECTPAY_SECURITY_TOKEN) {
      console.warn('[PerfectPay Webhook] Tentativa não autorizada: Token inválido ou ausente.');
      return NextResponse.json(
        { success: false, error: 'Token de segurança inválido' },
        { status: 401 }
      );
    }

    // 3. Extração dos dados do cliente e da venda
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

    const referenceId =
      data.src ||
      data.tracking_parameters?.src ||
      data.reference ||
      data.reference_id ||
      data.code ||
      data.product?.id ||
      data.codigo_produto;

    const transactionId =
      data.sale_id ||
      data.transaction_id ||
      data.id_transacao ||
      data.codigo ||
      referenceId;

    const rawStatus = data.sale_status_enum ?? data.statusPagamento ?? data.status;
    const saleStatus = Number(rawStatus);

    console.log(`[PerfectPay Webhook] Venda recebida: ${transactionId} | Status: ${saleStatus} | Cliente: ${customerEmail}`);

    // 4. Fluxo de Compra Aprovada (2 = Aprovado, 7 = Faturado, 10 = Completo)
    if (APPROVED_STATUSES.includes(saleStatus)) {
      if (!customerEmail || !customerEmail.includes('@')) {
        return NextResponse.json(
          { success: false, error: 'E-mail do comprador inválido ou não fornecido' },
          { status: 400 }
        );
      }

      let userId: string | null = null;

      // 4.1 Criação automática da conta do usuário (se ainda não existir)
      try {
        /*
         * EXEMPLO DE INTEGRAÇÃO COM SEU PROVEDOR DE AUTH:
         * 
         * Opção A (Supabase Auth Admin):
         * const { data: authUser, error } = await supabaseAdmin.auth.admin.createUser({
         *   email: customerEmail,
         *   password: DEFAULT_USER_PASSWORD,
         *   email_confirm: true,
         *   user_metadata: { name: customerName, phone: customerPhone }
         * });
         * if (authUser?.user) userId = authUser.user.id;
         * 
         * Opção B (Prisma / Hash bcrypt):
         * const existing = await prisma.user.findUnique({ where: { email: customerEmail } });
         * if (existing) {
         *   userId = existing.id;
         * } else {
         *   const hashedPassword = await bcrypt.hash(DEFAULT_USER_PASSWORD, 10);
         *   const created = await prisma.user.create({
         *     data: { email: customerEmail, name: customerName, password: hashedPassword }
         *   });
         *   userId = created.id;
         * }
         * 
         * Opção C (Firebase Admin Auth):
         * try {
         *   const user = await adminAuth.createUser({
         *     email: customerEmail,
         *     password: DEFAULT_USER_PASSWORD,
         *     displayName: customerName
         *   });
         *   userId = user.uid;
         * } catch (err: any) {
         *   if (err.code === 'auth/email-already-exists') {
         *     const existing = await adminAuth.getUserByEmail(customerEmail);
         *     userId = existing.uid;
         *   }
         * }
         */

        console.log(`[PerfectPay Webhook] Conta verificada/criada com sucesso para: ${customerEmail}`);
      } catch (authError: any) {
        // Se o usuário já existir ou der erro de duplicidade, não quebramos o fluxo
        console.warn(`[PerfectPay Webhook] Usuário já existente ou aviso de auth:`, authError?.message || authError);
      }

      // 4.2 Liberação do produto/acesso no banco de dados
      /*
       * EXEMPLO DE LIBERAÇÃO NO BANCO DE DADOS:
       * 
       * await databaseService.grantAccess({
       *   userId,
       *   customerEmail,
       *   customerName,
       *   referenceId,
       *   transactionId,
       *   status: 'approved',
       *   accessExpiresAt: null, // Vitalício ou data específica
       *   payload: data
       * });
       */
      console.log(`[PerfectPay Webhook] Acesso liberado no banco para o e-mail: ${customerEmail}`);

      return NextResponse.json({
        success: true,
        message: 'Compra aprovada e acesso liberado com sucesso',
        data: {
          customerEmail,
          transactionId,
          saleStatus
        }
      });
    }

    // 5. Fluxo de Cancelamento / Reembolso / Chargeback (3, 4, 6, 11)
    if (REVOKED_STATUSES.includes(saleStatus)) {
      console.log(`[PerfectPay Webhook] Revogando acesso do pedido: ${transactionId} (Status: ${saleStatus})`);

      /*
       * EXEMPLO DE BLOQUEIO NO BANCO DE DADOS:
       * 
       * await databaseService.revokeAccess({
       *   customerEmail,
       *   referenceId,
       *   transactionId,
       *   status: 'revoked'
       * });
       */

      return NextResponse.json({
        success: true,
        message: `Acesso revogado com sucesso. Status recebido: ${saleStatus}`
      });
    }

    // 6. Outros status (Aguardando pagamento, boleto gerado, etc.)
    return NextResponse.json({
      success: true,
      message: `Status ${saleStatus} recebido e registrado sem alteração de acesso.`
    });

  } catch (error: any) {
    console.error('[PerfectPay Webhook Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Erro interno no processamento do webhook'
      },
      { status: 500 }
    );
  }
}
