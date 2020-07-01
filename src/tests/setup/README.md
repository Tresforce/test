# Postman

https://medium.com/@gururajhm/contract-api-testing-with-postman-node-js-express-newman-d91f3cd51fd4
https://jsonschema.net/home

# Tests

Using QueryRunner to create and control state of single database connection

QueryRunner provides a single database connection.

Transactions are organized using query runners.

Single transactions can only be established on a single query runner.

You can manually create a query runner instance and use it to manually control transaction state. Example:

##

```javascript
import { getConnection } from 'typeorm';
import { getConnection } from 'typeorm';

// get a connection and create a new query runner

const connection = getConnection();
const queryRunner = connection.createQueryRunner();

// establish real database connection using our new query runner

await queryRunner.connect();

// now we can execute any queries on a query runner, for example:
await queryRunner.query('SELECT * FROM users');

// we can also access entity manager that works with connection created by a query runner:
const users = await queryRunner.manager.find(User);

// lets now open a new transaction:
await queryRunner.startTransaction();

try {
  // execute some operations on this transaction:
  await queryRunner.manager.save(user1);
  await queryRunner.manager.save(user2);
  await queryRunner.manager.save(photos);

  // commit transaction now:
  await queryRunner.commitTransaction();
} catch (err) {
  // since we have errors let's rollback changes we made
  await queryRunner.rollbackTransaction();
} finally {
  // you need to release query runner which is manually created:
  await queryRunner.release();
}
```

There are 3 methods to control transactions in QueryRunner:

    startTransaction - starts a new transaction inside the query runner instance.
    commitTransaction - commits all changes made using the query runner instance.
    rollbackTransaction - rolls all changes made using the query runner instance back.

Learn more about Query Runner.
