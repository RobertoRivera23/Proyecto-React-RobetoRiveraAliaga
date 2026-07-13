import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

const ProductosNacionales = ({ Mensaje }) => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const productosDB = collection(db, "Productos Nacionales"); // Asegúrate de que el nombre coincida con el de Firebase
    getDocs(productosDB)
      .then((resp) => {
        const data = resp.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProductos(data);
      })
      .catch((error) => {
        console.error("Error al obtener productos de la BD:", error);
      });
  }, []);

  return (
    <div>
      <h1>{Mensaje}</h1>
      <div className="lista-productos">
        {productos.length === 0 ? (
          <p>No hay productos disponibles</p>
        ) : (
          productos.map((prod) => (
            <div key={prod.id}>
              <img src={prod.imagen} alt={prod.nombre} style={{ width: "100px" }} />
              <h3>{prod.nombre}</h3>
              <p>Categoría: {prod.categoria}</p>
              <p>Precio: ${prod.precio}</p>
              <p>Stock: {prod.stock} unidades</p>
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductosNacionales;