# Class Diagram – Mini Digital Banking System

This class diagram represents the core domain structure of the Mini Digital Banking System.
It follows OOP principles including inheritance, encapsulation, and proper relationships.

-------------------------------------------------------------
User (Base Class)
-------------------------------------------------------------

User
-------------------------
- userId : String
- name : String
- email : String
- password : String
-------------------------
+ login() : boolean
+ logout() : void


-------------------------------------------------------------
Customer (Inherits User)
-------------------------------------------------------------

Customer
-------------------------
-------------------------
+ createAccount() : Account
+ viewAccounts() : List<Account>

Relationship:
Customer  --------|>  User


-------------------------------------------------------------
Admin (Inherits User)
-------------------------------------------------------------

Admin
-------------------------
-------------------------
+ freezeAccount(accountId : String) : void
+ activateAccount(accountId : String) : void
+ viewAllUsers() : List<User>

Relationship:
Admin  --------|>  User


-------------------------------------------------------------
Account (Core Domain Class)
-------------------------------------------------------------

Account
-------------------------
- accountId : String
- accountNumber : String
- balance : Number
- status : AccountStatus
-------------------------
+ deposit(amount : Number) : void
+ withdraw(amount : Number) : void


-------------------------------------------------------------
SavingsAccount (Inherits Account)
-------------------------------------------------------------

SavingsAccount
-------------------------
- interestRate : Number
-------------------------
+ calculateInterest() : Number

Relationship:
SavingsAccount  --------|>  Account


-------------------------------------------------------------
Transaction
-------------------------------------------------------------

Transaction
-------------------------
- transactionId : String
- amount : Number
- timestamp : Date
- type : String
-------------------------
+ execute() : void


-------------------------------------------------------------
FixedDeposit
-------------------------------------------------------------

FixedDeposit
-------------------------
- fdId : String
- amount : Number
- interestRate : Number
- duration : Number
- maturityDate : Date
-------------------------
+ calculateMaturity() : Number



-------------------------------------------------------------
Relationships & Multiplicity
-------------------------------------------------------------

Customer and Account

Customer (1)  -----------  (1..*) Account

• One Customer can own multiple Accounts
• Each Account belongs to exactly one Customer


Account and Transaction (Sender)

Account (1)  -----------  (0..*) Transaction

Label: sender


Account and Transaction (Receiver)

Account (1)  -----------  (0..*) Transaction

Label: receiver


Account and FixedDeposit

Account (1)  -----------  (0..*) FixedDeposit

• One Account can have multiple Fixed Deposits


-------------------------------------------------------------
OOP Concepts Used
-------------------------------------------------------------

• Inheritance → Customer & Admin inherit from User

• Inheritance → SavingsAccount inherits from Account

• Encapsulation → Balance managed via deposit/withdraw methods

• Abstraction → Core banking behaviors defined in Account

• Enum usage → AccountStatus improves modeling clarity

<img width="900" height="847" alt="image" src="https://github.com/user-attachments/assets/f033b2e3-952c-4329-8eda-688570fadbc4" />




