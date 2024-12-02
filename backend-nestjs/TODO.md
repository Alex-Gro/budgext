# ToDo list for budgext backend

## To Do's
- [x] Integrate NestJS as backend framework
- [x] Prisma database schema
  - [x] User
  - [x] Balance
  - [x] Transaction
- [x] SignIn & logIn for user
- [ ] DeleteUser
  - [x] functionality
  - [ ] Database trigger after deletion or separate req's?
- [x] Balance functionality
  - [x] getBalanceByUserId(userId)
- [x] Balance test cases
- [x] Transaction functionality
  - [x] createTransaction
  - [x] editTransaction
  - [x] deleteTransaction
  - [x] getAllTransactions
  - [x] getTransactionById
- [x] Transaction test cases
- [ ] Dynamically update current balance after transaction CRUD

## Ideas for future features
- [ ] Add recurring transactions
  - [ ] RecurringTransaction in prisma
  - [ ] CRUD for RecurringTransaction
- [ ] Budgets for managing income & expenses you want to have max available
- [ ] Multilanguage German/English
- [ ] Currency (at first just €€€)
- [ ] Monthly Balance
- [ ] Later, being able to create transactions in the future?
- [ ] Database, Transaction.type 'income' || 'expense' refactor as enum? TypeTable?