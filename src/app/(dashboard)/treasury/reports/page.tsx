'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Filter, PieChart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ReportsPage() {
    const { churchId } = useAuth();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());
    // const [month, setMonth] = useState(new Date().getMonth());

    const fetchData = async () => {
        if (!churchId) return;
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/treasury/transactions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setTransactions(await res.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [churchId]);

    // --- Calculations ---

    const months = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    // 1. Monthly Trends (Income vs Expense) for the selected Year
    const monthlyData = months.map((name, index) => {
        const monthTxs = transactions.filter(t => {
            const d = new Date(t.date);
            return d.getFullYear() === year && d.getMonth() === index;
        });

        const income = monthTxs
            .filter(t => t.destinationAccount?.type === 'asset' && t.sourceAccount?.type === 'income')
            .reduce((acc, t) => acc + Number(t.amount), 0);

        const expense = monthTxs
            .filter(t => t.sourceAccount?.type === 'asset' && t.destinationAccount?.type === 'expense')
            .reduce((acc, t) => acc + Number(t.amount), 0);

        return { name, income, expense };
    });

    const maxVal = Math.max(...monthlyData.map(d => Math.max(d.income, d.expense)), 1000); // Avoid div by 0

    // 2. Expense Breakdown by Category (Yearly)
    const expenseTxs = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() === year && t.sourceAccount?.type === 'asset' && t.destinationAccount?.type === 'expense';
    });

    const breakdown = expenseTxs.reduce((acc: any, t) => {
        const catName = t.destinationAccount?.name || 'Otros';
        acc[catName] = (acc[catName] || 0) + Number(t.amount);
        return acc;
    }, {});

    const sortedBreakdown = Object.entries(breakdown)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 5); // Top 5

    const totalExpenseYear = expenseTxs.reduce((acc, t) => acc + Number(t.amount), 0);

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => window.location.href = '/treasury'} className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Reportes y Análisis</h1>
                        <p className="text-sm font-medium text-slate-500">Visualiza el rendimiento financiero de {year}.</p>
                    </div>
                </div>
                <Select value={year.toString()} onValueChange={(val) => setYear(Number(val))}>
                    <SelectTrigger className="w-[120px] font-bold bg-white text-base h-11 rounded-xl shadow-sm border-slate-200">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Main Chart: Monthly Trends */}
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                <CardHeader className="border-b border-slate-50 pb-4">
                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-primary" />
                        Flujo de Caja Mensual
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-8 pb-4">
                    <div className="h-[250px] w-full flex items-end justify-between gap-2 md:gap-4 px-2">
                        {monthlyData.map((d, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 w-full group relative">
                                {/* Tooltipish */}
                                <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                                    <div className="font-bold flex items-center gap-1 text-emerald-400">
                                        <ArrowUpRight className="w-3 h-3" /> +${d.income.toLocaleString()}
                                    </div>
                                    <div className="font-bold flex items-center gap-1 text-rose-400">
                                        <ArrowDownRight className="w-3 h-3" /> -${d.expense.toLocaleString()}
                                    </div>
                                </div>

                                <div className="w-full flex gap-1 h-[200px] items-end justify-center">
                                    {/* Income Bar */}
                                    <div
                                        className="w-3 md:w-6 bg-emerald-400 rounded-t-sm transition-all duration-500 hover:bg-emerald-500"
                                        style={{ height: `${(d.income / maxVal) * 100}%` }}
                                    />
                                    {/* Expense Bar */}
                                    <div
                                        className="w-3 md:w-6 bg-rose-400 rounded-t-sm transition-all duration-500 hover:bg-rose-500"
                                        style={{ height: `${(d.expense / maxVal) * 100}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Breakdown by Category */}
                <Card className="border-none shadow-xl shadow-slate-200/50">
                    <CardHeader>
                        <CardTitle className="text-base font-bold text-slate-700">Gastos Principales</CardTitle>
                        <CardDescription>Top 5 categorías con mayor egreso en {year}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {sortedBreakdown.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 text-sm font-medium">No hay gastos registrados.</div>
                        ) : (
                            sortedBreakdown.map(([name, amount]: any, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between text-sm font-semibold">
                                        <span className="text-slate-700">{name}</span>
                                        <span className="text-slate-900">${amount.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-rose-500 rounded-full"
                                            style={{ width: `${(amount / totalExpenseYear) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Summary Stats */}
                <div className="grid gap-4 content-start">
                    <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none shadow-lg shadow-emerald-200 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold opacity-90 uppercase tracking-widest">Ingresos Totales ({year})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold tracking-tight">
                                ${monthlyData.reduce((a, b) => a + b.income, 0).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-rose-500 to-rose-600 border-none shadow-lg shadow-rose-200 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold opacity-90 uppercase tracking-widest">Egresos Totales ({year})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold tracking-tight">
                                ${monthlyData.reduce((a, b) => a + b.expense, 0).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-none shadow-lg shadow-slate-100">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Resultado Neto</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-4xl font-bold tracking-tight ${(monthlyData.reduce((a, b) => a + b.income, 0) - monthlyData.reduce((a, b) => a + b.expense, 0)) >= 0
                                    ? 'text-slate-800' : 'text-rose-500'
                                }`}>
                                ${(monthlyData.reduce((a, b) => a + b.income, 0) - monthlyData.reduce((a, b) => a + b.expense, 0)).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
