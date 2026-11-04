import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import ProductsPage from "./screens/productsPage";
import OtherNavbar from "./components/headers/OtherNavbar";
import Footer from "./components/footer";
import HelpPage from "./screens/helpPage";
import TablesPage from "./screens/tablesPage";
import WaiterLoginPage from "./screens/waiterLoginPage";
import useBasket from "./hooks/useBasket";
import { useWaiter } from "./context/WaiterContext";
import "../css/app.css";
import "../css/navbar.css";
import "../css/footer.css";
import "../css/add-to-cart-animation.css";
import { AddToCartAnimationProvider } from "./context/AddToCartAnimation";

/**
 * Afitsant ilovasi: buyurtmani mijoz emas, afitsant beradi.
 * PIN bilan kiriladi → stol tanlanadi → menyudan taom tanlab buyurtma beriladi.
 */
export default function App() {
  const { token } = useWaiter();
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();

  if (!token) {
    return (
      <Switch>
        <Route path="/login">
          <WaiterLoginPage />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }

  return (
    <AddToCartAnimationProvider>
      <OtherNavbar
        cartItems={cartItems}
        onAdd={onAdd}
        onRemove={onRemove}
        onDelete={onDelete}
        onDeleteAll={onDeleteAll}
      />
      <Switch>
        <Route path="/tables">
          <TablesPage />
        </Route>
        <Route path="/products">
          <ProductsPage onAdd={onAdd} />
        </Route>
        <Route path="/help">
          <HelpPage />
        </Route>
        <Redirect to="/tables" />
      </Switch>
      <Footer />
    </AddToCartAnimationProvider>
  );
}
