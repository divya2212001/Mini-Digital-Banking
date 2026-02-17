# Sequence Diagram – Transfer Money Flow

This sequence diagram represents the complete flow of transferring money
between two accounts in the Mini Digital Banking System.

It follows layered architecture:
Client → Controller → Service → Repository → Database

------------------------------------------------------------------

Participants:

1. Customer
2. ClientApp
3. TransactionController
4. TransactionService
5. AccountRepository
6. TransactionRepository
7. Database

------------------------------------------------------------------

Customer initiates transfer

Customer → ClientApp  
enterTransferDetails(receiverId, amount)

ClientApp → TransactionController  
POST /transfer

TransactionController → TransactionService  
transfer(senderId, receiverId, amount)

------------------------------------------------------------------

Fetch Sender Account

TransactionService → AccountRepository  
findById(senderId)

AccountRepository → Database  
queryAccount()

Database → AccountRepository  
return senderAccount

AccountRepository → TransactionService  
return senderAccount

------------------------------------------------------------------

Fetch Receiver Account

TransactionService → AccountRepository  
findById(receiverId)

AccountRepository → Database  
queryAccount()

Database → AccountRepository  
return receiverAccount

AccountRepository → TransactionService  
return receiverAccount

------------------------------------------------------------------

Validate Transfer

alt

[Insufficient Balance OR Account Frozen]

TransactionService → TransactionController  
Transfer Failed

TransactionController → ClientApp  
Error Response

ClientApp → Customer  
Transfer Unsuccessful


[Valid Transfer]

TransactionService → AccountRepository  
updateBalance(sender)

AccountRepository → Database  
update sender balance

TransactionService → AccountRepository  
updateBalance(receiver)

AccountRepository → Database  
update receiver balance

TransactionService → TransactionRepository  
saveTransaction()

TransactionRepository → Database  
insert transaction record

TransactionService → TransactionController  
Transfer Success

TransactionController → ClientApp  
200 OK

ClientApp → Customer  
Transfer Successful

end alt

------------------------------------------------------------------

Key Concepts Represented:

• Layered Architecture (Controller → Service → Repository)
• Validation logic before balance update
• Conditional flow using alt block
• Separate repository calls for persistence
• Atomic-style transaction behavior (logical level)

<img width="1191" height="756" alt="image" src="https://github.com/user-attachments/assets/7c51f1a5-b7fd-41c7-bd14-5d63500a3a93" />
