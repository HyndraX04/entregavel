import { Module, Offer, UserProfile } from '../types';

export const userProfile: UserProfile = {
  name: 'Membro VIP',
  role: 'Criador Dark',
  tier: 'Acesso premium',
  lastLessonId: 'aula-fund-1',
};

export const modulesData: Module[] = [
  {
    id: 'modulo-1',
    number: 1,
    title: 'Fundamentos do Canal Dark',
    description: 'Construa as bases de um canal que gera receita sem aparecer.',
    badge: 'Módulo 01',
    level: 'Iniciante ao Avançado',
    iconName: 'Compass',
    lessons: [
      {
        id: 'aula-fund-1',
        moduleId: 'modulo-1',
        title: 'Como o modelo de negócio funciona',
        duration: '18 min',
        description: 'Entenda os pilares fundamentais da monetização sem rosto, algoritmos de recomendação do YouTube e como canais anônimos faturam alto.',
        summaryPoints: [
          'A mecânica de retenção e CTR para vídeos sem apresentador',
          'Monetização passiva via AdSense + esteira de afiliados',
          'Mentalidade de longo prazo e escala de múltiplos canais'
        ],
        resources: [
          { title: 'Checklist de Início Rápido (PDF)', url: '#', type: 'PDF' },
          { title: 'Mapa Mental da Operação Dark', url: '#', type: 'MINDMAP' }
        ]
      },
      {
        id: 'aula-fund-2',
        moduleId: 'modulo-1',
        title: 'Arquitetura de um canal de sucesso',
        duration: '22 min',
        description: 'Configuração correta da conta, branding anônimo memorável, banners estratégicos e otimização inicial para o algoritmo.',
        summaryPoints: [
          'Criação de identidade visual sem expor imagem pessoal',
          'Tags e metadados estruturados para o nicho certo',
          'Segurança e gerenciamento seguro de canais'
        ]
      },
      {
        id: 'aula-fund-3',
        moduleId: 'modulo-1',
        title: 'Ferramentas de Inteligência Artificial indispensáveis',
        duration: '25 min',
        description: 'As principais ferramentas de geração de voz neural, geração de imagens, edição automatizada e pesquisa de tendências.',
        summaryPoints: [
          'Vozes neurais ultra-realistas com entonação humana',
          'Geração de B-roll e imagens com Midjourney/Leonardo',
          'Extensões de browser para mineração de tags concorrentes'
        ]
      },
      {
        id: 'aula-fund-4',
        moduleId: 'modulo-1',
        title: 'Direitos autorais e monetização garantida',
        duration: '16 min',
        description: 'Como utilizar o Fair Use (Uso Aceitável) com segurança jurídica absoluta e nunca tomar strike ou desmonetização.',
        summaryPoints: [
          'Regras de ouro de transformação e valor agregado',
          'Fontes de áudio e trilhas sonoras 100% livres de royalties',
          'Como proceder em disputas de Content ID'
        ]
      }
    ]
  },
  {
    id: 'modulo-2',
    number: 2,
    title: 'Nichos Lucrativos e Validação',
    description: 'Encontre oportunidades com demanda real e baixa concorrência.',
    badge: 'Módulo 02',
    level: 'Estratégico',
    iconName: 'TrendingUp',
    lessons: [
      {
        id: 'aula-nicho-1',
        moduleId: 'modulo-2',
        title: 'Matriz de Nichos com Alto RPM',
        duration: '20 min',
        description: 'Os nichos que pagam de 3 a 10 vezes mais por cada mil visualizações no YouTube nacional e internacional.',
        summaryPoints: [
          'Finanças, negócios, tecnologia e mistérios de alta rentabilidade',
          'Diferença entre visualizações de entretenimento vs nichadas',
          'Cálculo de RPM estimado por audiência'
        ]
      },
      {
        id: 'aula-nicho-2',
        moduleId: 'modulo-2',
        title: 'Espionagem e mineração de canais em alta',
        duration: '24 min',
        description: 'Método prático passo a passo para encontrar canais novos que estão explodindo em views e replicar a estratégia com originalidade.',
        summaryPoints: [
          'Filtros ocultos do YouTube para detectar novos vencedores',
          'Análise de outliers (vídeos com mais views que inscritos)',
          'Planilha de validação de demanda'
        ]
      },
      {
        id: 'aula-nicho-3',
        moduleId: 'modulo-2',
        title: 'Validação de ideias antes de gravar',
        duration: '15 min',
        description: 'Evite gastar horas produzindo vídeos que ninguém quer ver: teste títulos e temas antes de produzir uma linha sequer.',
        summaryPoints: [
          'Validação por volume de buscas e tendências do Google Trends',
          'O teste do clique em comunidades e fóruns',
          'Fórmula de validação rápida em 15 minutos'
        ]
      }
    ]
  },
  {
    id: 'modulo-3',
    number: 3,
    title: 'Roteiros que Prendem Atenção',
    description: 'Transforme ideias em histórias que ninguém consegue abandonar.',
    badge: 'Módulo 03',
    level: 'Produção',
    iconName: 'PenTool',
    lessons: [
      {
        id: 'aula-rot-1',
        moduleId: 'modulo-3',
        title: 'A anatomia do gancho perfeito (Hooks nos 10s)',
        duration: '21 min',
        description: 'Como prender o espectador nos primeiros segundos do vídeo para garantir mais de 70% de retenção no início.',
        summaryPoints: [
          'Estrutura Hook -> Open Loop -> Promessa de Resolução',
          'Gatilhos psicológicos de curiosidade extrema',
          'Exemplos práticos analisados quadro a quadro'
        ]
      },
      {
        id: 'aula-rot-2',
        moduleId: 'modulo-3',
        title: 'Storytelling Dark e Ritmo Hipnótico',
        duration: '28 min',
        description: 'Técnicas de narrativa inspiradas em documentários da Netflix e canais internacionais de sucesso estrondoso.',
        summaryPoints: [
          'Open loops contínuos ao longo de todo o roteiro',
          'Variação de cadência e quebras de padrão para combater o drop de retenção',
          'Criação de momentos de clímax e payoffs recompensadores'
        ]
      },
      {
        id: 'aula-rot-3',
        moduleId: 'modulo-3',
        title: 'Prompts avançados de IA para roteiros de alta retenção',
        duration: '27 min',
        description: 'Comandos prontos e afinados para ChatGPT e Claude que escrevem roteiros envolventes em minutos com voz humana.',
        summaryPoints: [
          'Engenharia de prompt para evitar clichês de IA',
          'Alimentando a IA com transcrições de referência',
          'Revisão humanizada de 5 minutos'
        ]
      }
    ]
  },
  {
    id: 'modulo-4',
    number: 4,
    title: 'Escala, Monetização e Automação',
    description: 'Crie sistemas para publicar mais e crescer de forma previsível.',
    badge: 'Módulo 04',
    level: 'Escala',
    iconName: 'Zap',
    lessons: [
      {
        id: 'aula-esc-1',
        moduleId: 'modulo-4',
        title: 'Esteira de produção acelerada',
        duration: '23 min',
        description: 'Como organizar seu fluxo de trabalho para produzir de 3 a 5 vídeos semanais dedicando apenas poucas horas por dia.',
        summaryPoints: [
          'Divisão em lotes: pesquisa, roteiro, voz, edição',
          'Organização de pastas e biblioteca de assets reutilizáveis',
          'Uso de Notion e Trello para fluxo produtivo à prova de falhas'
        ]
      },
      {
        id: 'aula-esc-2',
        moduleId: 'modulo-4',
        title: 'Monetização multicanal além do AdSense',
        duration: '26 min',
        description: 'Multiplique seu faturamento vendendo produtos digitais, patrocínios ocultos e links de afiliados altamente contextuais.',
        summaryPoints: [
          'Estrutura de links na descrição e comentários fixados',
          'Criação de micro-produtos rápidos para seu canal',
          'Contatos com marcas para patrocínios em canais dark'
        ]
      },
      {
        id: 'aula-esc-3',
        moduleId: 'modulo-4',
        title: 'Terceirização e construção de um império anônimo',
        duration: '31 min',
        description: 'O método exato para contratar roteiristas, editores e designers freelancers a baixo custo para você atuar como CEO.',
        summaryPoints: [
          'Onde encontrar profissionais de qualidade a preços justos',
          'SOPs (Procedimentos Operacionais Padrão) para treinamento rápido',
          'Gerenciamento de múltiplos canais simultâneos'
        ]
      }
    ]
  }
];

export const offersData: Offer[] = [
  {
    id: 'pack-roteiros',
    title: 'Pack de 1000 Vídeos e Roteiros Virais',
    tagline: 'Mais escolhido',
    badge: 'Mais escolhido',
    description: 'Estruturas prontas para adaptar aos nichos mais rentáveis e acelerar sua produção.',
    price: 'R$ 9,90',
    originalPrice: 'R$ 197',
    isPopular: true,
    accentColor: 'from-amber-500 to-yellow-400',
    features: [
      '1.000 vídeos e roteiros validados em nichos de alto RPM',
      'Estrutura com retenção média superior a 65%',
      'Prompts de adaptação instantânea no ChatGPT',
      'Modelos de ganchos (hooks) testados e aprovados',
      'Acesso imediato e vitalício à biblioteca de roteiros',
      'Atualizações mensais de novas tendências'
    ],
    ctaText: 'Desbloquear Pack de 1000 Vídeos'
  },
  {
    id: 'kit-visual',
    title: 'Kit Visual Canal Dark',
    tagline: 'Biblioteca premium',
    badge: 'Biblioteca premium',
    description: 'Templates de thumbnails, identidade visual e checklists para publicar com padrão profissional.',
    price: 'R$ 27,90',
    originalPrice: 'R$ 247',
    isPopular: false,
    accentColor: 'from-zinc-300 to-amber-200',
    features: [
      'Mais de 150 templates de thumbnails com alto CTR no Canva & PSD',
      'Identidade visual pronta (banners, avatares, paletas)',
      'Pacote com mais de 500 sound effects (SFX) premium',
      'Banco de texturas, overlays e transições dinâmicas',
      'Checklist definitivo pré e pós-publicação',
      'Guia de psicologia de cores para thumbnails irresistíveis'
    ],
    ctaText: 'Garantir Kit Visual Completo'
  }
];
