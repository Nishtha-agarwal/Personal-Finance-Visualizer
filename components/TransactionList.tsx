import { useState, useEffect } from "react";

export default function TransactionList({ refresh }: { refresh: () => void }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null); // for spinner on delete
  const [editTransaction, setEditTransaction] = useState<any | null>(null); // for editing transaction
  const [transactionData, setTransactionData] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
  });

  const fetchTransactions = async () => {
    const response = await fetch("/api/transactions");
    if (!response.ok) {
      console.error("Error fetching transactions:", response.statusText);
      return; 
    }
    const text = await response.text(); 
    console.log("Response text:", text); 
  
    try {
      const data = JSON.parse(text);
      setTransactions(data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  
    setLoading(false);
  };
  

  const deleteTransaction = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirmed) return;

    try {
      setDeletingId(id); 
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchTransactions();
        refresh();
      } else {
        console.error("Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setDeletingId(null);
    }
  };

  // Edit a transaction
  const handleEdit = (transaction: any) => {
    setTransactionData({
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date,
      category: transaction.category,
    });
    setEditTransaction(transaction._id); 
  };

  // Save edited transaction
  const saveEdit = async () => {
    const res = await fetch(`/api/transactions/${editTransaction}`, {  // Use editTransaction id
      method: "PUT",  // Use PUT to update the transaction
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });
  
    if (res.ok) {
      await fetchTransactions();
      refresh();
      setEditTransaction(null); // Close edit form
    } else {
      console.error("Failed to update transaction");
    }
  };  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionData({
      ...transactionData,
      [e.target.name]: e.target.value,
    });
  };
  const addTransaction = async () => {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactionData),
    });

    if (res.ok) {
      await fetchTransactions();
      refresh();
      setTransactionData({ description: "", amount: "", date: "", category: "" });
    } else {
      console.error("Failed to add transaction");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refresh]);

  return (
    <div>
      <br />
      <h2 style={{ color: "maroon" }} className="text-xl font-semibold">Transaction List</h2>

      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Description</th>
                <th className="px-4 py-2 border-b">Amount</th>
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Category</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(transactions) && transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-4 py-2 border-b">{transaction.description}</td>
                    <td className="px-4 py-2 border-b">${transaction.amount.toFixed(2)}</td>
                    <td className="px-4 py-2 border-b">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border-b">{transaction.category}</td>
                    <td className="px-4 py-2 border-b text-center">
                      <button onClick={() => handleEdit(transaction)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTransaction(transaction._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                        disabled={deletingId === transaction._id}
                      >
                        {deletingId === transaction._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center px-4 py-2 border-b">No transactions available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Transaction Form */}
      <div>
        <h3>{editTransaction ? "Edit Transaction" : "Add Transaction"}</h3>
        <input
          type="text"
          name="description"
          value={transactionData.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="number"
          name="amount"
          value={transactionData.amount}
          onChange={handleChange}
          placeholder="Amount"
        />
        <input
          type="date"
          name="date"
          value={transactionData.date}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          value={transactionData.category}
          onChange={handleChange}
          placeholder="Category"
        />
        <button onClick={editTransaction ? saveEdit : addTransaction}>
          {editTransaction ? "Save Changes" : "Add Transaction"}
        </button>
      </div>
    </div>
  );
}

