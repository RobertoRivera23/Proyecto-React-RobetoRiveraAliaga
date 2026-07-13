import "./App.css";
import Layout from "./components/Layout/Layout/Layout.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TarjetaProducto from "./components/Productos/TarjetaProducto/TarjetaProducto.jsx";
import FormularioContainer from "./components/FormularioProducto/FormularioContainer/FormularioContainer.jsx";
import FormularioContactoContainer from "./components/Contacto/FormularioContactoContainer/FormularioContactoContainer.jsx";
import ProductosList from "./components/Productos/ProductoList/ProductosList.jsx";
import ProductoDetalle from "./components/Productos/ProductoDetalle/ProductoDetalle.jsx";
import Home from "./components/Home/Home.jsx";
import Cart from "./components/Carrtito/Cart/Cart.jsx";
//import ProductosNacionales from "./components/ProductosNacionales/ProductosNacionales.jsx";
import GestionProductos from "./components/FormularioProducto/GestionProductos/GestionProductos.jsx";
import GestionCupones from "./components/GestionCupones/GestionCupones.jsx";
import Login from "./components/Login/Login.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import { AuthProvider } from "./Context/AuthContext/AuthContext.jsx";
import Register from "./components/Login/Register/Register.jsx";
import Proximamente from "./components/Pagos/Proximamente/Proximamente.jsx";

function App() {
  return (
    <>
      <AuthProvider>
          <Routes>
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route
                path="/productos"
                element={<TarjetaProducto Mensaje={"Nuestros Productos"} />}
              />
              <Route
                path="/destacados"
                element={
                  <TarjetaProducto
                    Destacados={true}
                    Mensaje={"Productos Destacados"}
                  />
                }
              />
              <Route
                path="/contacto"
                element={<FormularioContactoContainer />}
              />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/proximamente" element={<Proximamente />} />
              <Route path="/productos/:id" element={<ProductoDetalle />} />
              {/* <Route path="/productosN" element={< ProductosNacionales Mensaje={"Nuestros Productos Nacionales"}/>} />*/}
              
              <Route path="/gestion" element={
                <PrivateRoute>
                  <GestionProductos />
                </PrivateRoute>
                } />
              <Route path="/admin/cupones" element={
                <PrivateRoute>
                  <GestionCupones />
                </PrivateRoute>
                } />
            </Route>
          </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
