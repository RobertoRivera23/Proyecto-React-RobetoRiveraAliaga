import { useState } from "react";
import styles from "./Producto.module.css";
import { useCart } from "../../../Context/CartContext/CartContext";
import { Link } from "react-router-dom";

function Producto({ id, nombre, precio, imagen, detalle, stock, destacado }) {
  // Obtenemos la función addToCart desde el contexto
  const { addToCart } = useCart();

  // Estado para el contador de unidades
  const [contador, setContador] = useState(0);

  // Incrementa el contador 
  const sumaContador = () => {
    setContador(prev => prev + 1);
  };

  // Baja el contador no permite valores negativos
  const restaContador = () => {
    if (contador > 0) {
      setContador(prev => prev - 1);
    }
  };

  // Estado para el favorito 
  const [esFavorito, setEsFavorito] = useState(false);
  const marcarComoFavorito = () => {
    setEsFavorito(!esFavorito);
  };

  // manejador para agregr al carrito
  const handleAddToCart = () => {
    // Si no selecciona unidades avisamos y salimos
    if (contador === 0) {
      alert("Debes seleccionar al menos una unidad");
      return;
    }

    // Construimos el objeto producto  con lo que necesita el carrito
    const producto = { id, nombre, precio, imagen };

    // Llamamos al addToCart del contexto con la cantidad elegida
    addToCart(producto, contador);

    alert(`✅ ${nombre} agregado al carrito (x${contador})`);

    // Reiniciamos el contador a 0 para la próxima selección
    setContador(0);
  };

  // Manejador para ver detalles 
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
        <Link to={`/productos/${id}`}>Ver detalles</Link>
        <button onClick={handleAddToCart} className={styles.actionButton}>
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

export default Producto;