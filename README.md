# Kaue 4 Gamer — Dark Channel Academy (Clone)

Clone fiel e interativo da plataforma de membros **Kaue 4 Gamer — Dark Channel Academy** (`https://golden-modules-hub.lovable.app`).

---

## 🚀 Como Visualizar Agora Mesmo (Sem Instalar Nada)

Você pode abrir o projeto **imediatamente** no seu navegador sem precisar de Node.js ou comandos:

1. Acesse a pasta `entregavel` no seu Desktop:
   ```text
   C:\Users\kauem\Desktop\entregavel
   ```
2. Dê um duplo clique no arquivo:
   ```text
   preview.html
   ```
3. O aplicativo abrirá instantaneamente no seu navegador com todo o visual, animações, vídeos, módulos e ofertas interativas funcionando 100%!

---

## 🛠️ Estrutura do Código React + TypeScript + Tailwind (Para Desenvolvimento)

O repositório foi construído de forma modularizada:

```text
entregavel/
├── preview.html              # Versão standalone pronta para abrir no navegador
├── index.html                # Ponto de entrada SPA Vite
├── package.json              # Dependências (React 18, Tailwind, Lucide React)
├── vite.config.ts            # Configuração do Vite
├── tailwind.config.js        # Paleta dark gamer com acentos dourados (gold/amber)
├── tsconfig.json             # Configurações TypeScript
└── src/
    ├── main.tsx              # Bootstrap React
    ├── App.tsx               # Gerenciamento de estado global e navegação
    ├── index.css             # Estilos globais e efeitos de brilho dourado
    ├── types/
    │   └── index.ts          # Tipagem TypeScript (Module, Lesson, Offer, etc.)
    ├── data/
    │   └── courseData.ts     # Conteúdo completo dos 4 módulos e ofertas
    └── components/
        ├── Navbar.tsx        # Topbar com status do membro e acesso premium
        ├── HeroSection.tsx   # Banner motivacional, progresso e card "Última aula"
        ├── ModulesSection.tsx# Grid dos 4 módulos com expansão e checklist
        ├── OffersSection.tsx # Ofertas exclusivas (Vídeos Virais & Kit Visual)
        ├── LessonModal.tsx   # Player interativo de aula com progresso e notas
        ├── CheckoutModal.tsx # Checkout com simulação PIX e Cartão
        └── Footer.tsx        # Rodapé oficial da academia
```

---

## 💻 Para Rodar com Vite (Após Instalar Node.js)

Se desejar rodar o ambiente de desenvolvimento Vite com Hot-Reload:

1. Instale o [Node.js](https://nodejs.org/) (ou execute no terminal: `winget install OpenJS.NodeJS.LTS`).
2. Abra o terminal nesta pasta e execute:
   ```powershell
   npm install
   npm run dev
   ```
3. Acesse `http://localhost:5173`.
