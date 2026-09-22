/**
 * Serviço de envio de e-mails transacionais de boas-vindas
 * Suporta Resend (API REST sem dependências) ou Log simulado
 */

interface SendAccessEmailParams {
  to: string;
  name: string;
  loginUrl?: string;
  password?: string;
}

export async function sendWelcomeEmail({
  to,
  name,
  loginUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seusite.com.br',
  password = process.env.DEFAULT_USER_PASSWORD || 'CANALDARK123',
}: SendAccessEmailParams) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'Método Canal Dark <suporte@metodocanaldark.com>';

  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #09090d; color: #f3f4f6; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #111118; border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #181824 0%, #0c0c12 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .header h1 { color: #facc15; margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase; font-weight: 800; }
    .header p { color: #9ca3af; margin-top: 6px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }
    .content { padding: 32px 24px; }
    .greeting { font-size: 18px; font-weight: bold; color: #ffffff; margin-bottom: 16px; }
    .text { font-size: 14px; line-height: 1.6; color: #d1d5db; margin-bottom: 24px; }
    .credentials-card { background: #161622; border: 1px solid rgba(234, 179, 8, 0.4); border-radius: 12px; padding: 20px; margin: 24px 0; }
    .cred-item { margin-bottom: 12px; }
    .cred-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; font-weight: bold; }
    .cred-value { font-size: 16px; color: #facc15; font-weight: bold; margin-top: 4px; font-family: monospace; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #eab308 100%); color: #000000 !important; font-weight: 800; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 20px rgba(234, 179, 8, 0.3); }
    .footer { padding: 20px 24px; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid rgba(255, 255, 255, 0.05); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MÉTODO CANAL DARK</h1>
      <p>Dark Channel Academy</p>
    </div>
    <div class="content">
      <div class="greeting">Olá, ${name || 'Membro'}! 👋</div>
      <div class="text">
        Parabéns pela sua decisão! Seu pagamento foi confirmado e seu acesso completo à área de membros do <strong>Método Canal Dark</strong> já foi liberado com sucesso.
      </div>

      <div class="credentials-card">
        <div class="cred-item">
          <div class="cred-label">Link de Acesso à Plataforma:</div>
          <div class="cred-value" style="font-size: 14px;"><a href="${loginUrl}" style="color: #60a5fa; text-decoration: none;">${loginUrl}</a></div>
        </div>
        <div class="cred-item">
          <div class="cred-label">Seu E-mail de Login:</div>
          <div class="cred-value">${to}</div>
        </div>
        <div class="cred-item" style="margin-bottom: 0;">
          <div class="cred-label">Sua Senha Provisória:</div>
          <div class="cred-value" style="color: #34d399; font-size: 18px;">${password}</div>
        </div>
      </div>

      <div class="btn-container">
        <a href="${loginUrl}" class="btn" target="_blank">ACESSAR MEUS CONTEÚDOS AGORA ➔</a>
      </div>

      <div class="text" style="font-size: 12px; color: #9ca3af;">
        💡 <em>Dica de Segurança:</em> Recomendamos que você altere sua senha no primeiro acesso caso deseje uma senha personalizada.
      </div>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Método Canal Dark. Todos os direitos reservados.<br>
      Se tiver qualquer dúvida, responda a este e-mail para falar com nosso suporte.
    </div>
  </div>
</body>
</html>
`;

  // Se tiver a chave da Resend configurada, envia via API REST da Resend
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject: 'Seu acesso ao Método Canal Dark foi liberado! 🚀',
          html: htmlContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[MailService] Erro na API Resend:', errorData);
        return { success: false, error: errorData };
      }

      const resData = await response.json();
      console.log(`[MailService] E-mail enviado com sucesso via Resend para ${to} (ID: ${resData.id})`);
      return { success: true, id: resData.id };
    } catch (err: any) {
      console.error('[MailService] Falha ao enviar e-mail via Resend:', err);
      return { success: false, error: err?.message };
    }
  } else {
    // Modo simulação / Desenvolvimento
    console.log(`[MailService SIMULADO] Nenhum RESEND_API_KEY configurado. E-mail de acesso gerado para: ${to}`);
    console.log(`[MailService SIMULADO] Login: ${to} | Senha: ${password} | URL: ${loginUrl}`);
    return { success: true, simulated: true };
  }
}
