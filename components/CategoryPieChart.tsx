import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Transaction = {
  category: string;
  amount: number;
};

const COLORS = ["#f5e1a4", "#64b5f6", "#ffcc00", "#cc0033", "#81c784", "#ba68c8"];

export default function CategoryPieChart({ transactions }: { transactions: Transaction[] }) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return <div>No transactions available</div>;
  }

  const categoryData: { [key: string]: number } = {};

  transactions.forEach((t) => {
    categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
  });

  const data = Object.keys(categoryData).map((category) => ({
    category,
    amount: categoryData[category],
  }))
  .sort((a, b) => b.amount - a.amount);

  return (
    <div className="w-full mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 style={{ color: "maroon" }} className="text-xl font-semibold mb-4">Category-wise Breakdown</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

  