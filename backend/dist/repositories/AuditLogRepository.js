"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogRepository = void 0;
const AuditLog_model_1 = require("../models/AuditLog.model");
class AuditLogRepository {
    async findById(id) {
        return AuditLog_model_1.AuditLogModel.findById(id);
    }
    async create(data) {
        return AuditLog_model_1.AuditLogModel.create(data);
    }
    async findAll(skip, limit) {
        return AuditLog_model_1.AuditLogModel.find()
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .populate("adminId", "name email")
            .populate("targetUserId", "name email");
    }
    async count() {
        return AuditLog_model_1.AuditLogModel.countDocuments();
    }
}
exports.AuditLogRepository = AuditLogRepository;
