"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Transaction = {
  amount: number;
  date: string;
};

export default function MonthlyExpensesChart() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  async function fetchTransactions() {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    
    // Ensure data is an array
    if (Array.isArray(data)) {
      setTransactions(data);
    } else {
      setTransactions([]); // fallback to empty array
    }
  }
  
  useEffect(() => {
    fetchTransactions();
  }, []);

  const monthlyData = transactions.reduce((acc: { [key: string]: { label: string; total: number } }, tx) => {
    const date = new Date(tx.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
    const label = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`; // eg: Apr 2024
  
    if (!acc[key]) {
      acc[key] = { label, total: 0 };
    }
    acc[key].total += tx.amount;
    return acc;
  }, {});
  
  const chartData = Object.keys(monthlyData)
    .sort()
    .map((key) => ({
      month: monthlyData[key].label,
      total: monthlyData[key].total,
    }));  

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 style={{ color: "maroon" }} className="text-xl font-semibold mb-4">Monthly Expenses</h2>

      {chartData.length === 0 ? (
        <p>No transactions to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#4F46E5" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
