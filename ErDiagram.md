Entities:

1. User
2. Admin
3. Account
4. Transaction
5.AuditLog

-----------------------------------------------------

Relationships:

User (1) -----------< (M) Account

Account (1) -----------< (M) Transaction  [Sender]

Account (1) -----------< (M) Transaction  [Receiver]

Admin (1) -----------< (M) AuditLog

Account (1) -----------< (M) AuditLog

-----------------------------------------------------

ER Diagram:


<img width="1930" height="1170" alt="Blank diagram (1)" src="https://github.com/user-attachments/assets/2b1987d5-e00d-4f70-9bdb-630126999bab" />

