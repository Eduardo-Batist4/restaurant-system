
# Restaurant System

Este backend simula um sistema de restaurante desenvolvido para otimizar e controlar eficientemente todas as operações do estabelecimento. O sistema oferece funcionalidades completas para o cadastro e gestão de clientes, pedidos, mesas, cardápio de comidas e funcionários, proporcionando uma gestão integrada e eficiente.
## Funcionalidades do Sistema 
- **Autenticação Segura:** Implementa autenticação de usuários para garantir que apenas pessoas autorizadas tenham acesso.
- **Rotas Protegidas:** Acesso controlado às rotas, garantindo a segurança e integridade dos dados.
- **Segurança dos Dados dos Funcionários:** Proteção avançada para informações sensíveis dos funcionários.
- **Operações CRUD Completas:** Funções de criar, ler, atualizar e deletar (CRUD) para clientes, mesas, cardápio de comidas, pedidos e funcionários.
- **Arquitetura MVC:** Organização do código utilizando o padrão de arquitetura Model-View-Controller (MVC) para melhor manutenção e escalabilidade.
- **Gerenciamento de Tokens Inválidos:** Armazenamento e controle de tokens inválidos para garantir segurança nas sessões de usuários. **(Para armazenar os tokens ja ultilizado, preferi armazenar em uma array porque é um projeto pessoal e de aprendizado, mas poderia usar uma tabela no banco)**

## Instalação


**Para rodar os teste:**

- Node instalado

```bash
    # Clone o Projeto
    $ git clone https://github.com/Eduardo-Batist4/restaurant-system.git
```
```bash
    # Instalação das dependencias
    npm install
```
```bash
    # Rodar todos os Teste
    npm run test
```
```bash
    # Para rodar um teste especifico 
    npm run test -- path/caminho/do/arquivo
```
## Endpoints

**CUSTOMERS**   
- POST: /customers
- GET: /customers
- GET: /customer/id
- PATCH: /customer/id
- DELETE: /customer/id

**TABLES**
- POST: /tables
- GET: /tables
- GET: /table/id
- PATCH: /table/id
- DELETE: /table/id

**MENU**
- POST: /menus (Protegida)
- GET: /menus
- PATCH: /menu/id (Protegida)
- DELETE: /menu/id (Protegida)

**ORDERS**
- POST: /orders (Protegida)
- GET: /orders (Protegida)
- GET: /order/id (Protegida)
- PATCH: /order/id (Protegida)
- DELETE: /order/id (Protegida)

**EMPLOYEES**
- POST: /employees
- GET: /employees   (Protegida)
- GET: /employee/id (Protegida)
- DELETE: /employee/id  (Protegida)

**LOGIN E LOGOUT**
- POST: /login (Conta do funcionário)
- POST: /logout




## Tecnologias Utilizada

<img align="center" alt="Js" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img align="center" alt="Js" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white">
<img align="center" alt="Js" src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white"> <img align="center" alt="Js" src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge">
<img align="center" alt="Js" src="https://img.shields.io/badge/sequelize-323330?style=for-the-badge&logo=sequelize&logoColor=blue"> <img align="center" alt="Js" src="https://img.shields.io/badge/json%20web%20tokens-323330?style=for-the-badge&logo=json-web-tokens&logoColor=pink"> <img align="center" alt="Js" src="https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white">



