# Express Login System

Este é um projeto de implementação de autenticação de login utilizando Node.js, Express, Sequelize, JSON Web Tokens (JWT) e banco de dados mySQL.

## Funcionalidades

- Cadastro de usuário com nome, e-mail e senha
- Autenticação de usuário com validação de e-mail e senha
- Geração de token de autenticação usando JWT
- Proteção de rotas restritas usando token de autenticação
- Criptografia de senha com bcrypt

## Ferramentas utilizadas
- Node.js
- Express
- Sequelize
- JSON Web Tokens (JWT)
- bcrypt
- Handlebars
- body-parser
- express-session
- cookie-parser

## Requisitos

Certifique-se de ter as seguintes ferramentas instaladas no seu sistema:

- Node.js
- npm ou yarn
- MySQL (ou outro banco de dados compatível)

## Instalação

1. Clone este repositório para o seu sistema. `git clone https://github.com/HttpFelipe/express-login-system.git`.
2. Navegue até o diretório do projeto: `cd express-login-system`.
3. Instale as dependências: `npm install` ou `yarn install`.
4. Configure as informações de conexão com o banco de dados no arquivo `models/db.js`.
5. Inicie o servidor.
6. Acesse o aplicativo em seu navegador: `http://localhost:3000`.

## Licença

Este projeto está licenciado sob a MIT License.
