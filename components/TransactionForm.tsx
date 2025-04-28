"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

const categories = ["Food", "Travel", "Shopping", "Bills", "Other"];

export default function TransactionForm({ refresh }: { refresh: () => void }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !date || !description) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
  
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "transaction", // 👈 ADD this
          amount: parseFloat(amount),
          date,
          description,
          category,
        }),
      });
  
      refresh();
      setAmount("");
      setDate("");
      setDescription("");
      setCategory("Other");
      setError(null); // Clear error if successful
    } catch (error) {
      setError("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <h2 style={{ color: "maroon" }} className="text-xl font-semibold">Add Transaction</h2>
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <Input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <Input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Select value={category} onValueChange={(value) => setCategory(value)}>
        <SelectTrigger>{category}</SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        {loading ? "Adding..." : "Add Transaction"}
      </Button>
    </form>
  );
}


