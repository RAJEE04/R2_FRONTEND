import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Product from "../pages/Products";
import User from "../pages/User";
import UserDashboard from "../pages/UserDashboard";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<Product />} />
        <Route path="/user" element={<User />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
  );
}

export default App;
