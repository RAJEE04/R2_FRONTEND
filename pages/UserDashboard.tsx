import { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
  const [last7Days, setLast7Days] = useState([]);
  const [categorySale, setCategorySale] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57"];
  const API = "http://localhost:5000/api/stats";

  useEffect(() => {
    fetch(`${API}/last7days`).then(r => r.json()).then(d => setLast7Days(d.data));
    fetch(`${API}/category-sale`).then(r => r.json()).then(d => setCategorySale(d.data));
    fetch(`${API}/top-customers`).then(r => r.json()).then(d => setTopCustomers(d.data));
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Last 7 Day Sales</h2>
          {last7Days.length === 0 ? <p>No data yet</p> :
            <BarChart width={600} height={250} data={last7Days}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3182CE" />
            </BarChart>
          }
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Category Sale</h2>
          {categorySale.length === 0 ? <p>No data yet</p> :
            <PieChart width={400} height={300}>
              <Pie data={categorySale} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={100}>
                {categorySale.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
            </PieChart>
          }
        </div>

        {/* Top Customers Table */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Top Customers</h2>
          {topCustomers.length === 0 ? <p>No data yet</p> :
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Customer</th>
                  <th className="p-2 border">Total Spent</th>
                  <th className="p-2 border">Orders</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c: any) => (
                  <tr key={c._id}>
                    <td className="p-2 border">{c._id}</td>
                    <td className="p-2 border">{c.totalSpent}</td>
                    <td className="p-2 border">{c.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>

      </div>
    </div>
  );
}
