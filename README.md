# 🎟️ Event Management Platform

Aplicação Full Stack desenvolvida para gerenciamento de eventos, participantes e assinaturas, utilizando uma arquitetura moderna baseada em **NestJS**, **Next.js**, **React**, **TypeScript** e **PostgreSQL**.

O sistema oferece autenticação segura, controle de acesso por perfis, gerenciamento completo de eventos, integração com pagamentos, webhooks e comunicação por e-mail, seguindo boas práticas de desenvolvimento e escalabilidade.

---

## 🚀 Tecnologias Utilizadas

### Backend

* NestJS
* Node.js
* TypeScript
* TypeORM
* PostgreSQL
* JWT Authentication
* Passport
* Bcrypt
* Class Validator
* Docker
* Jest

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS v4
* Shadcn/UI
* Radix UI
* Lucide React
* Sonner

### Ferramentas

* Git
* GitHub
* Docker Compose
* ESLint
* Prettier

---

## ✨ Principais Funcionalidades

### 🔐 Autenticação e Segurança

* Cadastro de usuários
* Login com JWT
* Proteção de rotas
* Controle de acesso baseado em permissões (RBAC)
* Criptografia de senhas com Bcrypt

### 👤 Gerenciamento de Conta

* Ativação de conta por token
* Recuperação de senha
* Alteração de e-mail
* Gerenciamento de perfil

### 🎫 Gestão de Eventos

* Criação e edição de eventos
* Exclusão de eventos
* Controle de status
* Cadastro de endereços
* Gerenciamento de imagens

### 🙋 Participantes

* Inscrição em eventos
* Controle de participantes
* Associação entre usuários e eventos

### 💳 Assinaturas e Pagamentos

* Gerenciamento de planos de assinatura
* Controle de assinaturas ativas
* Processamento de pagamentos
* Atualização automática de status

### 📊 Relatórios

* Relatórios administrativos
* Indicadores relacionados aos eventos

### 📧 Comunicação

* Envio de e-mails transacionais
* Ativação de conta
* Recuperação de senha
* Alteração de e-mail

### 🔄 Webhooks

* Recebimento de eventos externos
* Sincronização automática de dados

---

## 🏗️ Estrutura do Projeto

```text
apps/
├── api/
│   ├── auth
│   ├── user
│   ├── person
│   ├── person-profile
│   ├── person-role
│   ├── account-activation-token
│   ├── password-reset-token
│   ├── email-change-token
│   ├── events
│   ├── event-participants
│   ├── event-reports
│   ├── subscription
│   ├── subscription-plans
│   ├── payments
│   ├── webhooks
│   ├── admin
│   └── mail
│
└── web/
    ├── app
    ├── components
    ├── hooks
    ├── services
    └── lib
```

---

## 🗄️ Modelagem Principal

O sistema é baseado nas seguintes entidades:

* Person
* PersonProfile
* PersonRole
* Event
* EventParticipant
* EventReport
* Subscription
* SubscriptionPlan
* Payment
* AccountActivationToken
* PasswordResetToken
* EmailChangeToken

---

## ⚙️ Como Executar o Projeto

### Backend

```bash
cd apps/api

npm install
npm run migration:run
npm run start:dev
```

### Frontend

```bash
cd apps/web

npm install
npm run dev
```

---

## 🧪 Testes

```bash
npm run test
npm run test:cov
npm run test:e2e
```

---

## 📚 Conceitos Aplicados

* Desenvolvimento Full Stack
* Arquitetura Modular
* REST APIs
* JWT Authentication
* Role-Based Access Control (RBAC)
* TypeORM Migrations
* Dependency Injection
* DTO Validation
* Webhooks
* Modelagem Relacional
* Segurança de Aplicações
* Integração entre Serviços

---

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido com o objetivo de consolidar conhecimentos em desenvolvimento Full Stack moderno, explorando conceitos de arquitetura de software, autenticação, autorização, integração com serviços externos, persistência de dados e construção de interfaces web escaláveis.

---

## 👨‍💻 Autor

**Allisson Felipe**

GitHub: https://github.com/AllissonFelipe

LinkedIn: https://linkedin.com/in/allissonfelipe
