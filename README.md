# 📱 GreenLink Marketplace — App (Mobile & Web)

Este repositório contém o aplicativo multiplataforma da plataforma **GreenLink Marketplace**, desenvolvido com **React Native**. O app tem como objetivo conectar pessoas, empresas e recicladores para promover trocas, vendas ou doações de materiais reutilizáveis, fortalecendo a economia circular e a sustentabilidade.

---

## 🚀 Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Web](https://necolas.github.io/react-native-web/)
- [Axios](https://axios-http.com/)
- [TypeScript](https://www.typescriptlang.org/) (opcional, se usado)
- Integração com API Django (repositório backend)

---

## ⚙️ Como rodar o projeto localmente

### 1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/greenlink-marketplace-app.git
cd greenlink-marketplace-app
```

### 2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

### 3. Inicie o projeto:

```bash
npx expo start
```
O comando abrirá o Expo Dev Tools no navegador. A partir dele, você pode rodar o app:

Em um emulador Android ou iOS;

Em um dispositivo físico (com o app Expo Go);

No navegador (modo web).


## 📦 Estrutura do Projeto

```bash
greenlink-marketplace-app/
├── assets/             # Imagens e fontes
├── components/         # Componentes reutilizáveis
├── screens/            # Telas principais do app
├── services/           # Configuração de chamadas à API
├── navigation/         # Navegação do app
├── App.js              # Entrada principal
└── app.json            # Configuração do Expo
```

## 🔗 Integração com o Backend

O app se comunica com a API Django disponível no repositório greenlink-marketplace-backend.

Certifique-se de ajustar a URL base no serviço de API (services/api.js ou similar).

## 📱 Funcionalidades planejadas

Cadastro e autenticação de usuários

Listagem e busca de materiais

Criação de anúncios

Sistema de trocas e recompensas verdes

Perfil do usuário e histórico de interações

## 🧪 Testes

Testes automatizados e testes E2E serão adicionados em versões futuras.

## 👥 Contribuidores

Rodrigo Cruz (@rodrig-crzz) — Desenvolvedor principal
Mariana Moura (@ma-ar1) — Desenvolvedor principal
