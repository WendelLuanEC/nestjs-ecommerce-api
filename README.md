````markdown

# 🛒 NestJS E-commerce API

API de e-commerce desenvolvida com [NestJS](https://nestjs.com), PostgreSQL e Docker.  
Inclui autenticação com JWT, cadastro com confirmação via e-mail (Mailtrap), gerenciamento de produtos, carrinho persistido e documentação via Swagger.



## 🚀 Funcionalidades

- Cadastro de usuários com confirmação por e-mail.
- Autenticação e autorização via JWT.
- Usuário administrador pré-criado (via migrations).
- CRUD de produtos (restrito a administradores).
- Carrinho de compras persistente no banco.
- Documentação da API com Swagger.



## ⚙️ Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)



## 📦 Rodando a aplicação

```bash
# subir aplicação + banco
docker compose up --build
````

Isso já:

* Sobe o Postgres.
* Executa migrations automaticamente.
* Insere o usuário **admin** no banco.



## 👤 Usuário administrador

Credenciais criadas via migration:

```bash
email: admin@example.com
senha: admin123
```

---

## 📜 Documentação da API

Após rodar a aplicação, acesse:

👉 [http://localhost:3000/api](http://localhost:3000/api)

---

## 🔑 Variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
# Banco
POSTGRES_USER=nestuser
POSTGRES_PASSWORD=nestpass
POSTGRES_DB=nestdb

# JWT
JWT_SECRET=mysecret

# Mailtrap
MAILTRAP_USER=seu-user
MAILTRAP_PASS=sua-senha
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
```

---

## 🧪 Testes

Rodar todos os testes:

```bash
npm run test
```

Rodar testes de uma área específica, exemplo carrinho:

```bash
npm run test src/cart/cart.service.spec.ts
```

---

## 📂 Estrutura do projeto

```
src/
├── auth/         # Autenticação e autorização
├── cart/         # Carrinho de compras
├── mail/         # Serviço de envio de emails
├── migrations/   # Migrations TypeORM
├── products/     # Produtos
├── users/        # Usuários
└── main.ts       # Bootstrap da aplicação
```
```

---
```
