import styles from "./TarjetaProducto.module.css";
import { useState, useEffect } from "react";
import ProductosList from "../ProductoList/ProductosList.jsx";

function TarjetaProducto({ Mensaje, Destacados }) {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/data/productos.json")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("No se pudo cargar la información de los productos");
        }
        return respuesta.json();
      })
      .then((datos) => {
      // Parseamos datos (string): "true"/"false" a booleanos
        const datosNormalizados = datos.map(product => ({
          ...product,
          destacado: product.destacado === "true"
        }));
        setProductos(datosNormalizados);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);
  if (cargando) {
    return <p>Cargando productos, por favor espere...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

// Manejamos el filtrado de los productos destacados
  const productosParaMostrar = Destacados ? 
  productos.filter(product => product.destacado) : productos;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}> {Destacados ? "Productos Destacados" : "Nuestros Productos"} </h2>
    <article className={styles.card}>
      <ProductosList 
                  productos={productosParaMostrar}
      />
    </article>
    </div>
  );
}

export default TarjetaProducto;
