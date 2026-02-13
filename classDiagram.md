# Class Diagram – Mini Digital Banking

User
- userId
- name
- email
- password
- phone
+ register()
+ login()

Admin
- adminId
- name
- email
- password
+ freezeAccount()
+ activateAccount()

Account
- accountId
- accountNumber
- balance
- status
- userId
+ deposit(amount)
+ withdraw(amount)

SavingsAccount (extends Account)

Transaction
- transactionId
- senderAccountId
- receiverAccountId
- amount
- type
- timestamp

-------------------------------------

UserController
AccountController
TransactionController

UserService
AccountService
TransactionService

UserRepository
AccountRepository
TransactionRepository

AccountFactory
+ createAccount(type)
