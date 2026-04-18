"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const Customer_1 = require("./Customer");
class UserMapper {
    static toDomain(doc) {
        const id = doc._id.toString();
        return new Customer_1.Customer(id, doc.name, doc.email);
    }
}
exports.UserMapper = UserMapper;
