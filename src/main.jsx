import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./Context/CartContext/CartContext.jsx";

fetch("/data/productos.json")
  .then((respuesta) => {
    console.log("Respuesta cruda del servidor:", respuesta);
    return respuesta.json();
  })
  .then((datos) => {
    console.log("¡Productos cargados!", datos);
  })
  .catch((error) => {
    console.error("¡Ups! Hubo un error:", error);
  })
  .finally(() => {
    createRoot(document.getElementById("root")).render(
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>,
    );
  });
