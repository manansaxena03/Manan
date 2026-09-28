import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Target } from 'lucide-react';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGoals = async () => {
        try {
            const res = await api.get('/goals');
            setGoals(res.data.data);
        } catch (error) {
            console.error("Failed to load goals", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    if (loading) return <div>Loading goals...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Savings Goals</h2>
                <button className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors">
                    <Plus size={20} />
                    <span>Create Goal</span>
                </button>
            </div>

            {goals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => {
                        const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
                        return (
                            <div key={goal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-lg text-gray-800 mb-1">{goal.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Target: {goal.target_date ? new Date(goal.target_date).toLocaleDateString() : 'No date set'}
                                </p>
                                
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <p className="text-2xl font-bold text-primary">₹{Number(goal.current_amount).toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">of ₹{Number(goal.target_amount).toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-700">{progress.toFixed(0)}%</p>
                                        <p className="text-xs text-gray-500">₹{(goal.target_amount - goal.current_amount).toFixed(2)} left</p>
                                    </div>
                                </div>
                                
                                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4 overflow-hidden">
                                    <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                </div>
                                
                                <button className="w-full py-2 border border-primary text-primary font-medium rounded-xl hover:bg-indigo-50 transition-colors">
                                    Add Money
                                </button>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
                        <Target className="text-primary" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No savings goals yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">Create a goal and start tracking your progress towards what matters to you.</p>
                    <button className="bg-primary hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                        Create Goal
                    </button>
                </div>
            )}
        </div>
    );
};

export default Goals;
