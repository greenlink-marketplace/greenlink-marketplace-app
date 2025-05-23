# 📱 GreenLink Marketplace — Aplicativo Mobile & Web

Bem-vindo ao repositório do **GreenLink Marketplace App**, uma aplicação **multiplataforma** (Android, iOS e Web) desenvolvida com **React Native e Expo**. O GreenLink promove conexões entre pessoas, empresas e recicladores, incentivando **trocas, vendas e doações de materiais reutilizáveis**, fortalecendo a **economia circular** e a **sustentabilidade**.

---

## 🚀 Tecnologias Utilizadas

* [React Native](https://reactnative.dev/)
* [Expo](https://expo.dev/)
* [React Navigation](https://reactnavigation.org/)
* [React Native Web](https://necolas.github.io/react-native-web/)
* [Axios](https://axios-http.com/)
* [TypeScript](https://www.typescriptlang.org/) *(opcional)*
* Integração com backend em **Django REST Framework**

---

## ⚙️ Como rodar o projeto localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/greenlink-marketplace-app.git
cd greenlink-marketplace-app
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Inicie o projeto

```bash
npx expo start
```

A partir do Expo Dev Tools, é possível executar o app:

* Em um emulador Android ou iOS;
* Em um dispositivo físico com o app **Expo Go**;
* No navegador (modo web).

---

## 📦 Estrutura do Projeto

```bash
greenlink-marketplace-app/
├── assets/             # Imagens e fontes
├── components/         # Componentes reutilizáveis
├── screens/            # Telas principais do app
├── services/           # Chamadas à API e configurações
├── navigation/         # Sistema de navegação
├── App.js              # Entrada principal
└── app.json            # Configuração do Expo
```

---

## 🔗 Integração com o Backend

Este app se conecta com a **API Django** disponível em:

[greenlink-marketplace-backend](https://github.com/seu-usuario/greenlink-marketplace-backend)

Certifique-se de atualizar a URL base em `services/api.js` (ou `api.ts`) conforme o ambiente (desenvolvimento, homologação, produção).

---

## 📱 Funcionalidades Planejadas

* Cadastro e autenticação de usuários
* Listagem e busca de materiais disponíveis
* Criação e gerenciamento de anúncios
* Sistema de trocas e recompensas verdes
* Perfil de usuário e histórico de interações

---

## 🧪 Testes

Testes unitários e E2E serão adicionados em versões futuras.

---

## 👥 Contribuidores

* **Rodrigo Cruz** ([@rodrig-crzz](https://github.com/rodrig-crzz)) — Desenvolvedor principal
* **Mariana Moura** ([@ma-ar1](https://github.com/ma-ar1)) — Desenvolvedora principal

---

## 📚 Recursos Úteis

* [Documentação do Expo](https://docs.expo.dev/)
* [Documentação do React Native](https://reactnative.dev/docs/getting-started)
* [Tutorial Expo: Criando um app do zero](https://docs.expo.dev/tutorial/introduction/)

---

Vamos construir um futuro mais sustentável juntos! 🌱
