import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";

import MyOrders from "./pages/MyOrders";
import MyProfile from "./pages/MyProfile";
import MyOrderRegister from "./pages/MyOrderRegister";
import MyBenefits from "./pages/MyBenefits";
import MyLogout from "./pages/MyLogout";

import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductNew from "./pages/admin/AdminProductNew";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <div className="app-shell">
      <Header />

      <main className="page">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />

          {/* My */}
          <Route path="/my/profile" element={<MyProfile />} />
          <Route path="/my/orders" element={<MyOrders />} />
          <Route path="/my/order-register" element={<MyOrderRegister />} />
          <Route path="/my/benefits" element={<MyBenefits />} />
          <Route path="/my/logout" element={<MyLogout />} />

          {/* Admin */}
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminProductNew />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}

export default App;
