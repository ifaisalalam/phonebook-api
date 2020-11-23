## Phonebook API

[![Build Status](https://travis-ci.com/ifaisalalam/phonebook-api.svg?branch=master)](https://travis-ci.com/ifaisalalam/phonebook-api)
[![codecov](https://codecov.io/gh/ifaisalalam/phonebook-api/branch/master/graph/badge.svg?token=97PSQYQKPA)](https://codecov.io/gh/ifaisalalam/phonebook-api)

A phonebook app API written in NestJS.

### Features

1. Add new contact
2. Update an existing contact
3. Delete a contact
4. Search contacts by either name or email
5. List all contacts

### Installation

Install the dependencies by running

```bash
npm install
```

Copy `.env.example` file to `.env` file. Update the `MONGO_URL` value with your MongoDB URL. Optionally, update the `AUTH_TOKEN` value.

### Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

### Test

```bash
# unit tests with coverage
npm run test

# e2e tests
npm run test:e2e
```
