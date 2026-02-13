# ER Diagram – Mini Digital Banking

Entities:

User
------
user_id (PK)
name
email (UNIQUE)
password
phone
created_at

Admin
------
admin_id (PK)
name
email (UNIQUE)
password

Account
------
account_id (PK)
user_id (FK)
account_number (UNIQUE)
balance
status (Active / Frozen)
created_at

Transaction
------
transaction_id (PK)
sender_account_id (FK)
receiver_account_id (FK)
amount
type (Deposit / Withdraw / Transfer)
timestamp

AuditLog
------
log_id (PK)
admin_id (FK)
account_id (FK)
action (Freeze / Activate)
timestamp

-----------------------------------------------------

Relationships:

User (1) -----------< (M) Account

Account (1) -----------< (M) Transaction  [Sender]

Account (1) -----------< (M) Transaction  [Receiver]

Admin (1) -----------< (M) AuditLog

Account (1) -----------< (M) AuditLog

