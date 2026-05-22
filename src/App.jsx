import './App.css';
import Layout from './components/Layout/Layout/Layout.jsx';
import { Routes, Route } from 'react-router-dom';
import TarjetaProducto from './components/Productos/TarjetaProducto/TarjetaProducto.jsx';
import FormularioContainer from './components/FormularioProducto/FormularioContainer/FormularioContainer.jsx';
import FormularioContactoContainer from './components/Contacto/FormularioContactoContainer/FormularioContactoContainer.jsx';
import ProductosList from './components/Productos/ProductoList/ProductosList.jsx';
import ProductoDetalle from './components/Productos/ProductoDetalle/ProductoDetalle.jsx';
import Home from './components/Home/Home.jsx';


function App() {

  return (
    <>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={< TarjetaProducto Mensaje={"Nuestros Productos"}/>} />
        <Route path="/destacados" element={< TarjetaProducto Destacados={true}Mensaje={"Productos Destacados"}/>} />
        <Route path="/alta-producto" element={< FormularioContainer />} />
        <Route path="/contacto" element={< FormularioContactoContainer />} />
        <Route path="/carrito" element={<h1>Proximamente...</h1>} />
        <Route path="/productos/:id" element={<ProductoDetalle />} />
      </Route>  
    </Routes>
    </>
  )
}

export default App
