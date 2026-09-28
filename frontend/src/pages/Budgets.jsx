import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, PieChart } from 'lucide-react';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const currentDate = new Date();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            
            const [budgetsRes, dashRes] = await Promise.all([
                api.get(`/budgets?month=${month}&year=${year}`),
                api.get('/dashboard')
            ]);
            
            setBudgets(budgetsRes.data.data);
            
            const expensesMap = {};
            dashRes.data.data.categoryBreakdown.forEach(cat => {
                expensesMap[cat.name] = cat.value;
            });
            setExpenses(expensesMap);
            
        } catch (error) {
            console.error("Failed to load budgets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div>Loading budgets...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Monthly Budgets</h2>
                <button className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors">
                    <Plus size={20} />
                    <span>Create Budget</span>
                </button>
            </div>

            {budgets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {budgets.map(budget => {
                        const catName = budget.categories?.name;
                        const spent = expenses[catName] || 0;
                        const usage = (spent / budget.amount) * 100;
                        const isOver = usage > 100;
                        
                        let progressColor = 'bg-success';
                        if (usage > 70) progressColor = 'bg-warning';
                        if (usage > 90) progressColor = 'bg-danger';
                        
                        return (
                            <div key={budget.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{backgroundColor: budget.categories?.color || '#9CA3AF'}}>
                                        {catName ? catName[0] : '?'}
                                    </div>
                                    <h3 className="font-semibold text-lg text-gray-800">{catName}</h3>
                                </div>
                                
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <p className="text-sm text-gray-500">Spent</p>
                                        <p className="text-xl font-bold text-gray-800">₹{Number(spent).toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Budget</p>
                                        <p className="font-medium text-gray-600">₹{Number(budget.amount).toFixed(2)}</p>
                                    </div>
                                </div>
                                
                                <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden flex">
                                    <div className={`${progressColor} h-3 transition-all duration-500`} style={{ width: `${Math.min(usage, 100)}%` }}></div>
                                </div>
                                
                                {isOver ? (
                                    <p className="text-sm text-danger font-medium">Budget exceeded by ₹{(spent - budget.amount).toFixed(2)}</p>
                                ) : (
                                    <p className="text-sm text-gray-500">₹{(budget.amount - spent).toFixed(2)} remaining</p>
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
                        <PieChart className="text-primary" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No budgets yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">Create a monthly budget to see how much you have left to spend in each category.</p>
                    <button className="bg-primary hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                        Create Budget
                    </button>
                </div>
            )}
        </div>
    );
};

export default Budgets;
