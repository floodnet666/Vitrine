# Guia de Instalação Local - ENTITY_CREATOR (Vitrine das Almas)

Este documento descreve os passos necessários para configurar e executar o projeto localmente em seu ambiente de desenvolvimento.

## 1. Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:
- **Node.js** (Versão 18.0 ou superior recomendada)
- **npm** (Vem instalado com o Node.js) ou **yarn**

## 2. Inicialização do Projeto

Como este projeto utiliza módulos ES6 e JSX/TSX, recomenda-se o uso do **Vite** para um ambiente de desenvolvimento rápido e moderno.

```bash
# Crie um diretório para o projeto e entre nele
mkdir entity-creator
cd entity-creator

# Inicialize o npm
npm init -y
```

## 3. Instalação de Dependências

Instale o React 19, o SDK da Gemini API e as ferramentas de desenvolvimento necessárias.

### Dependências de Produção
```bash
npm install react@^19.2.0 react-dom@^19.2.0 @google/genai
```

### Dependências de Desenvolvimento
```bash
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom
```

## 4. Configuração do Ambiente

### Variáveis de Ambiente
O projeto exige uma chave de API para as funcionalidades das Entidades Digitais.
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_KEY=SUA_CHAVE_AQUI
```
*Nota: No código, utilize `process.env.API_KEY` ou `import.meta.env.VITE_API_KEY` conforme as diretrizes do seu bundler.*

### Configuração do TypeScript
Crie um arquivo `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["./**/*.ts", "./**/*.tsx"]
}
```

### Configuração do Vite
Crie um arquivo `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY)
  }
});
```

## 5. Estrutura de Arquivos

Certifique-se de que os arquivos fornecidos estejam na raiz ou na pasta `src/` conforme configurado no seu servidor de desenvolvimento. A estrutura atual sugerida é:

```
/
├── index.html
├── index.tsx
├── App.tsx
├── types.ts
├── constants.ts
├── components/
│   ├── Atmosphere.tsx
│   ├── DecisionButton.tsx
│   ├── FadeIn.tsx
│   ├── FundingScreen.tsx
│   ├── ManifestoScreen.tsx
│   └── ScrollReveal.tsx
├── metadata.json
├── .env
├── vite.config.ts
└── tsconfig.json
```

## 6. Executando o Projeto

Adicione os seguintes scripts ao seu `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`.

## 7. Notas Adicionais

- **Tailwind CSS:** O projeto utiliza o Tailwind via CDN no `index.html`. Para produção, recomenda-se a instalação via npm e configuração do `tailwind.config.js`.
- **Google Gemini API:** Certifique-se de que sua chave de API tenha as permissões necessárias para os modelos da série `gemini-3-flash-preview` ou `gemini-2.5`.
- **Estética:** O projeto utiliza fontes do Google Fonts (`Cormorant` e `Space Grotesk`) que são carregadas automaticamente via link no `index.html`.
