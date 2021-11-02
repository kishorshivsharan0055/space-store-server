# Space Store server

## Server to handle request from mobile app.

> Made with Node.js using Typescript

- [Expressjs](https://expressjs.com/) for server
- [TypeGraphQL](https://typegraphql.com/) for building GraphQL APIs
- [Typeorm](https://typeorm.io/) for Object Relation mapping
- [Typescript](https://www.typescriptlang.org/)
- Formatting with [Prettier](https://prettier.io/)
- [`husky`](https://github.com/typicode/husky) for commit hooks
- [Razorpay](https://razorpay.com/docs/payment-gateway/server-integration/nodejs/) for online payments.
- Protgres SQL database

### Server is deployed on Heroku

Server Link: https://sheltered-river-88745.herokuapp.com/

### Tables:

- Users
- Products
- Orders

### Features

- After starting the server Typeorm will automatically create the above tables.
- Used GraphQL which allows making multiple resources request in a single query call, which saves a lot of time and bandwidth by reducing the number of network round trips to the server.
- Mutations and Queries are developed for various operations on database.

## Development

### Install Dependencies

```bash
npm install
# or
yarn install
```

```
Don't start the server right away. First ensure you have postgresql setup and have start the postgresql server.
```

### Start Watch:

```bash
npm watch
# or
yarn watch
```

### Start Development Server:

```bash
npm dev
# or
yarn dev
```
