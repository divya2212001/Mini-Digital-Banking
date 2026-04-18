"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const User_1 = require("./User");
class Customer extends User_1.User {
    getRoleLabel() {
        return "Customer";
    }
}
exports.Customer = Customer;
