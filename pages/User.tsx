import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../components/SideBar";

/* ================= TYPES ================= */

type Role = "user" | "admin";

interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: Role;
}

/* ================= API ================= */

const API = "http://localhost:5000/api/users";

/* ================= COMPONENT ================= */

export default function UserCRUD() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  /* ================= FETCH USERS ================= */

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API);
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users error", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
    });
    setShowForm(false);
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      alert("Name and Email required");
      return;
    }

    try {
      if (isEditing && currentId) {
        await axios.put(`${API}/${currentId}`, formData);
      } else {
        await axios.post(API, formData);
      }

      resetForm();
      fetchUsers();
    } catch (err) {
      alert("Operation failed");
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // always empty on edit
      role: user.role,
    });
    setCurrentId(user._id);
    setIsEditing(true);
    setShowForm(true);
  };

  /* ================= DELETE (FIXED) ================= */

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API}/${id}`);

      // Optimistic UI update
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />

      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              User Management
            </h1>

            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              + Add User
            </button>
          </div>

          {/* FORM */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? "Edit User" : "Create User"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="border p-3 rounded"
                />

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="border p-3 rounded"
                />

                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    isEditing ? "New password (optional)" : "Password"
                  }
                  className="border p-3 rounded"
                />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="border p-3 rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  {isEditing ? "Update" : "Create"}
                </button>

                <button
                  onClick={resetForm}
                  className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-center p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            u.role === "admin"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(u._id)}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center p-6 text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
