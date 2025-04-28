"use client";

import { useState, useEffect } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyExpensesChart from "@/components/MonthlyExpensesChart";
import CategoryPieChart from "@/components/CategoryPieChart";

export default function Dashboard() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  
    const refresh = () => {
      setRefreshFlag(!refreshFlag);
    };
  
    useEffect(() => {
      async function fetchTransactions() {
        const response = await fetch('/api/transactions');
        const data = await response.json();
        setTransactions(data);
      }
  
      fetchTransactions();
    }, [refreshFlag]); 
    
    const totalExpenses = Array.isArray(transactions) 
    ? transactions.reduce((acc, t) => acc + t.amount, 0) 
    : 0;

  return (
    <>
    <div style={{ backgroundColor: "#E5E7EB" }}>
      <div > 
      <div style={{ color: "#D2691E" }}><h1 className="text-center text-4xl font-bold text-orange-800">Personal Finance Visualizer</h1></div>
        <TransactionForm refresh={refresh} />
        <TransactionList refresh={refresh} />
        <MonthlyExpensesChart />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 style={{ color: "maroon" }} className="text-xl font-semibold">Total Expenses</h2>
          <p className="text-xl">${totalExpenses.toFixed(2)}</p>
      </div>

      <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 style={{ color: "maroon" }} className="text-xl font-semibold">Most Recent Transactions</h2>
      <ul>
        {Array.isArray(transactions) && transactions.length > 0 ? (
          [...transactions].reverse().slice(0, 5).map((t) => (
            <li key={t._id} className="text-sm">
              {t.description} - ${t.amount} ({new Date(t.date).toLocaleDateString()})
            </li>
          ))
        ) : (
        <li className="text-sm">No transactions available</li>
        )}
      </ul>
      </div>

      <div className="p-6 bg-white shadow-lg rounded-lg">
        <CategoryPieChart transactions={transactions} />
      </div>
      
    </div>
    </div>
    </>
  );
}

