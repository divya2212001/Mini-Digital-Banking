# Sequence Diagram – Transfer Money

Customer → Controller → Service → Repository → Database

1. Customer sends transfer request
2. Controller validates request data
3. Service checks:
   - Sender account exists
   - Receiver account exists
   - Sufficient balance
   - Account status is Active
4. Service deducts amount from sender
5. Service adds amount to receiver
6. Transaction record is saved
7. Success response is returned
