/**
 * CONFIGURAÇÃO DO FUNIL DE VENDAS (WHATSAPP CLONE)
 * Altere as informações abaixo conforme sua necessidade.
 */

window.FUNIL_CONFIG = {
  // Informações do Perfil do WhatsApp
  profile: {
    name: "Chapéu Preto",
    avatar: "/chatfn/assets/avatar.png",
    verified: true, // Exibe o selo verde de verificado
    statusOnline: "Online",
    statusTyping: "digitando...",
    businessMessage: "Esta é uma conta comercial",
    notificationSound: "" // Deixe vazio para desativar o som (ou "/chatfn/assets/notification.mp3" para ativar)
  },

  // Link de Redirecionamento Final (Checkout / Oferta)
  checkoutUrl: "https://go.perfectpay.com.br/PPU38CQFR7A",

  // Configuração de Pixels e Rastreamento
  pixels: {
    facebookPixelId: "1078683300595174", // Insira seu ID do Pixel do Meta ou deixe vazio
    tiktokPixelId: "CTBQM53C77U9RNPHKQA0",   // Insira seu ID do Pixel do TikTok ou deixe vazio
    gtmId: "GTM-WKB2FH6K"                    // Insira seu ID do Google Tag Manager ou deixe vazio
  },

  // Configuração de Velocidade e Delays (em milissegundos)
  delays: {
    initialDelay: 1000,      // Tempo antes da primeira mensagem
    typingSpeed: 30,         // Velocidade de digitação simulada por caractere
    minTypingTime: 1200,     // Tempo mínimo de digitação
    maxTypingTime: 2400,     // Tempo máximo de digitação
    afterUserChoice: 600,    // Delay após o clique do usuário
    redirectDelay: 1500      // Delay antes de abrir o link de checkout
  },

  // Estrutura Completa de Passos e Mensagens do Funil
  steps: [
    // --- ETAPA 1 ---
    {
      stepId: 1,
      messages: [
        { type: "text", text: "Opa! tudo bem?" },
        { type: "text", text: "Se você está aqui é por causa do método de lucrar com <b>canais dark sem aparecer</b>, estou certo?" }
      ],
      input: {
        type: "buttons",
        options: [
          { text: "Sim!", nextStep: 2 }
        ]
      }
    },

    // --- ETAPA 2 ---
    {
      stepId: 2,
      messages: [
        { type: "text", text: "Boa!" },
        { type: "text", text: "Esse método já ajudou muitas pessoas a <b>ganhar dinheiro com canais dark</b> totalmente do zero e sem precisar mostrar o rosto! 🤑" },
        { type: "text", text: "Olha só as pessoas que lucraram! 👀" },
        { type: "image", src: "/chatfn/assets/print1.jpg", alt: "Comprovante de Lucro 1" },
        { type: "image", src: "/chatfn/assets/print2.jpg", alt: "Comprovante de Lucro 2" },
        { type: "text", text: "E aí, quer aprender esse método de canal dark?" }
      ],
      input: {
        type: "buttons",
        options: [
          { text: "SIM", nextStep: 3 }
        ]
      }
    },

    // --- ETAPA 3 (Aviso de Perguntas) ---
    {
      stepId: 3,
      messages: [
        { type: "text", text: "Antes de continuarmos vou fazer algumas perguntas" }
      ],
      input: {
        type: "buttons",
        options: [
          { text: "Certo", nextStep: 4 }
        ]
      }
    },

    // --- ETAPA 4 (Pergunta 1) ---
    {
      stepId: 4,
      messages: [
        { type: "text", text: "1. Você tem acesso a um celular ou computador conectado à internet?" }
      ],
      input: {
        type: "buttons",
        options: [
          { text: "Sim", nextStep: 5 }
        ]
      }
    },

    // --- ETAPA 5 (Pergunta 2) ---
    {
      stepId: 5,
      messages: [
        { type: "text", text: "2. Você está disposto a ganhar mais de R$5.000 por mês criando canais dark começando do zero e sem aparecer?" }
      ],
      input: {
        type: "buttons",
        options: [
          { text: "Estou!", nextStep: 6 }
        ]
      }
    },

    // --- ETAPA 6 (Pitch e Fechamento) ---
    {
      stepId: 6,
      messages: [
        { type: "text", text: "Muitas pessoas cobram uns R$150 para ensinar, eu acho esse preço muito caro." },
        { type: "text", text: "Eu vou estar disponibilizando esse método só hoje, depois nunca mais ensino de novo!" },
        { type: "text", text: "Vou te passar o link do método." },
        { type: "text", text: "Mas quando lucrar me manda print lá pelo TikTok, ok?" }
      ],
      input: {
        type: "buttons",
        options: [
          { text: "OK!", nextStep: "REDIRECT" }
        ]
      }
    }
  ]
};
