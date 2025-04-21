"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomValidations = exports.signinValidation = exports.SignupValidation = void 0;
const zod_1 = require("zod");
exports.SignupValidation = zod_1.z.object({
    username: zod_1.z.string().min(3).max(30),
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
exports.signinValidation = zod_1.z.object({
    username: zod_1.z.string().min(3).max(30),
    password: zod_1.z.string()
});
exports.roomValidations = zod_1.z.object({
    slug: zod_1.z.string().min(1, "slug is required")
});
