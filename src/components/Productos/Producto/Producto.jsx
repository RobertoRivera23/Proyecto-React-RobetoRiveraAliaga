import { useState } from "react";
import styles from "./Producto.module.css";
import { Link } from "react-router-dom";


function Producto({id, nombre, precio, imagen, detalle, stock, destacado }) {
  // Manejamos el contador
  const [contador, setContador] = useState(0);

  const sumaContador = () => {
    setContador(contador + 1);
  };
  const restaContador = () => {
    if (contador > 0) {
      setContador(contador - 1);
    }
  };

  // Manejamos el Favorito
  const [esFavorito, setEsFavorito] = useState(false);

  const marcarComoFavorito = () => {
    setEsFavorito(!esFavorito);
  };

  //Manejamos Agregar a Favorito
  const addToCart = () => {
    alert(`Producto:  ${nombre} agregado al carrito, Cantidad: ${contador}`);
  };

  //Manejamos ver detalles
  const verDetalles = () => {
    alert(`Detalles de ${nombre}: ${detalle || "Sin descripción"}`);
  };

  return (
    <div className={styles.productCard}>
      <span onClick={marcarComoFavorito} className={styles.favoriteIcon}>
        {esFavorito ? "⭐" : "☆"}
      </span>
      <div className={styles.imageWrapper}>
        <img src={imagen} alt={nombre} className={styles.productImage} />
      </div>
      <h3 className={styles.productTitle}>{nombre}</h3>
      <p className={styles.productPrice}>${precio}</p>
      <div className={styles.quantitySection}>
        <button onClick={restaContador} className={styles.quantityButton}>
          -
        </button>
        <span className={styles.quantityValue}>{contador}</span>
        <button onClick={sumaContador} className={styles.quantityButton}>
          +
        </button>
      </div>
      <div className={styles.actionButtons}>
        <Link to={`/productos/${id}`}>
          Ver detalles
        </Link>
        <button onClick={addToCart} className={styles.actionButton}>
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

export default Producto;
