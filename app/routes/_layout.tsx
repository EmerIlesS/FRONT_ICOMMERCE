import { Outlet } from "react-router";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Layout from "../components/layout/layout";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Outlet />
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}
