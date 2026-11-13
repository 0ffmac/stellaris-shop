import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/HomePage";
import { CategoryPage } from "@/pages/CategoryPage";
import { ProductPage } from "@/pages/ProductPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="collection" element={<Navigate to="/#collection" replace />} />
        <Route path="collection/:category" element={<CategoryPage />} />
        <Route path="collection/:category/:productId" element={<ProductPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
