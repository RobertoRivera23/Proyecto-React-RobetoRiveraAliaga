import styles from "./TarjetaProducto.module.css";
import { useState, useEffect } from "react";
import ProductosList from "../ProductoList/ProductosList.jsx";
import { getDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config.js";

function TarjetaProducto({ Mensaje, Destacados }) {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
 //traemos dede json
  // useEffect(() => {
  //   fetch("/data/productos.json")
  //     .then((respuesta) => {
  //       if (!respuesta.ok) {
  //         throw new Error("No se pudo cargar la información de los productos");
  //       }
  //       return respuesta.json();
  //     })
  //     .then((datos) => {
  //     // Parseamos datos (string): "true"/"false" a booleanos
  //       const datosNormalizados = datos.map(product => ({
  //         ...product,
  //         destacado: product.destacado === "true"
  //       }));
  //       setProductos(datosNormalizados);
  //     })
  //     .catch((error) => {
  //       setError(error.message);
  //     })
  //     .finally(() => {
  //       setCargando(false);
  //     });
  // }, []);

  //Traermos desde BD
  useEffect(() => {
    const productosDB = collection(db, "Productos");
    getDocs(productosDB)
      .then((resp) => {
        const data = resp.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          imagen: doc.data().urlImagen,
        }));
        setProductos(data);
        setError(null); //Limpia errores previos
      })
      .catch((error) => {
        console.error("Error al obtener productos de la BD:", error);
        setError("No se pudieron cargar los productos. Vuelve a intentar");
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
