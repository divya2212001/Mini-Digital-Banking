"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccountNumber = generateAccountNumber;
function generateAccountNumber() {
    const part = () => Math.floor(100000 + Math.random() * 900000).toString();
    return `${part()}${part()}`;
}
