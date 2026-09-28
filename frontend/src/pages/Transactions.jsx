import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/transactions');
            setTransactions(res.data.data);
        } catch (error) {
            console.error("Failed to load transactions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await api.delete(`/transactions/${id}`);
                setTransactions(transactions.filter(t => t.id !== id));
            } catch (error) {
                console.error("Failed to delete", error);
            }
        }
    };

    if (loading) return <div>Loading transactions...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
                <button className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors">
                    <Plus size={20} />
                    <span>Add New</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 font-medium text-gray-500 text-sm">Date</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Description</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Category</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm">Amount</th>
                                    <th className="p-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t) => (
                                    <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm text-gray-600">{new Date(t.transaction_date).toLocaleDateString()}</td>
                                        <td className="p-4 font-medium text-gray-800">{t.description || '-'}</td>
                                        <td className="p-4 text-sm">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{backgroundColor: `${t.categories?.color}20`, color: t.categories?.color || '#666'}}>
                                                {t.categories?.name}
                                            </span>
                                        </td>
                                        <td className={`p-4 font-semibold ${t.type === 'income' ? 'text-success' : 'text-gray-800'}`}>
                                            {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toFixed(2)}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button className="text-gray-400 hover:text-primary transition-colors p-1"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-danger transition-colors p-1"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <List className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No expenses yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Start tracking your first expense and you'll begin to see your spending patterns here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
