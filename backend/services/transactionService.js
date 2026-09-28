const TransactionModel = require('../models/transactionModel');

class TransactionService {
    static async createTransaction(userId, transactionData) {
        return await TransactionModel.create({
            ...transactionData,
            user_id: userId
        });
    }

    static async getTransaction(id, userId) {
        const transaction = await TransactionModel.findByIdAndUser(id, userId);
        if (!transaction) {
            const error = new Error('Transaction not found');
            error.statusCode = 404;
            throw error;
        }
        return transaction;
    }

    static async getTransactions(userId, query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 20;
        
        const { data, count } = await TransactionModel.findAllByUser(userId, {
            ...query,
            page,
            limit
        });

        return {
            data,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    static async updateTransaction(id, userId, updateData) {
        // Ensure transaction exists and belongs to user
        await this.getTransaction(id, userId);
        return await TransactionModel.update(id, userId, updateData);
    }

    static async deleteTransaction(id, userId) {
        await this.getTransaction(id, userId);
        await TransactionModel.delete(id, userId);
        return true;
    }
}

module.exports = TransactionService;
