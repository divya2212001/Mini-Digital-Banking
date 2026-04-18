"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/**
 * Abstraction: base user identity for bank customers.
 */
class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getEmail() {
        return this.email;
    }
}
exports.User = User;
