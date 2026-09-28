import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [dashboardRes, insightsRes] = await Promise.all([
                    api.get('/dashboard'),
                    api.get('/dashboard/insights')
                ]);
                setData(dashboardRes.data.data);
                setInsights(insightsRes.data.data);
            } catch (error) {
                console.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-full">Loading your finances...</div>;
    
    if (!data) return <div>Failed to load data.</div>;

    const COLORS = ['#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#EF4444', '#64748B'];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">TOTAL INCOME</h3>
                    <p className="text-2xl font-bold text-success">₹{data.summary.totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">TOTAL EXPENSES</h3>
                    <p className="text-2xl font-bold text-danger">₹{data.summary.totalExpenses.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">REMAINING MONEY</h3>
                    <p className="text-2xl font-bold text-primary">₹{data.summary.remainingBalance.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">TOTAL SAVINGS</h3>
                    <p className="text-2xl font-bold text-indigo-500">₹{data.summary.totalSavings.toFixed(2)}</p>
                </div>
            </div>

            {/* Insights */}
            {insights.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700">Insights for you</h3>
                    {insights.map((insight, idx) => (
                        <div key={idx} className={`p-4 rounded-xl text-sm
                            ${insight.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' : ''}
                            ${insight.type === 'danger' ? 'bg-red-50 text-red-800 border border-red-200' : ''}
                            ${insight.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : ''}
                            ${insight.type === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-200' : ''}
                        `}>
                            {insight.message}
                        </div>
                    ))}
                </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-700 mb-4">Expenses by Category</h3>
                    {data.categoryBreakdown.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.categoryBreakdown}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.categoryBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">No expenses yet.</div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-700 mb-4">Spending Trend (Last 6 Months)</h3>
                    {data.monthlyTrend.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.monthlyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} width={40} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                                    <Line type="monotone" dataKey="income" stroke="#22C55E" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">Not enough data to show trends.</div>
                    )}
                </div>
            </div>
            
            {/* Recent Transactions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-700 mb-4">Recent Transactions</h3>
                {data.recentTransactions.length > 0 ? (
                    <div className="space-y-3">
                        {data.recentTransactions.map(t => (
                            <div key={t.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{backgroundColor: t.categories?.color || '#9CA3AF'}}>
                                        {t.categories?.name ? t.categories.name[0] : '?'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{t.description || t.categories?.name}</p>
                                        <p className="text-xs text-gray-500">{new Date(t.transaction_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`font-semibold ${t.type === 'income' ? 'text-success' : 'text-gray-800'}`}>
                                    {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No recent transactions. Go to Transactions to add one.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
