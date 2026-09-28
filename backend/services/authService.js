const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

class AuthService {
    static async register(name, email, password, currency, monthly_income) {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            const error = new Error('Email already registered');
            error.statusCode = 409;
            throw error;
        }

        const saltRounds = 12;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const newUser = await UserModel.create({
            name,
            email,
            password_hash,
            currency: currency || 'INR',
            monthly_income: monthly_income || 0
        });

        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        });

        return { user: newUser, token };
    }

    static async login(email, password) {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        });

        const { password_hash, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    static async getUserById(userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }
}

module.exports = AuthService;
