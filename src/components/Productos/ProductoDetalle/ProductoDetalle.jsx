import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./ProductoDetalle.module.css";

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [esFavorito, setEsFavorito] = useState(false);
  const [cantidad, setCantidad] = useState(1); // para agregar al carrito

  useEffect(() => {
    fetch("/data/productos.json")
      .then((response) => response.json())
      .then((data) => {
        const encontrado = data.find((producto) => producto.id === parseInt(id));
        setProducto(encontrado);
      })
      .catch((error) => console.error("Error al cargar el producto:", error));
  }, [id]);

  const toggleFavorito = () => {
    setEsFavorito(!esFavorito);
  };

  const addToCart = () => {
    alert(`Producto: ${producto.nombre} agregado al carrito, Cantidad: ${cantidad}`);
  };

  if (!producto) {
    return <h2 style={{ textAlign: "center" }}>Cargando detalle del producto...</h2>;
  }

  if (!producto.id) {
    return <h2 style={{ textAlign: "center" }}>Producto no encontrado...</h2>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Columna izquierda: imagen */}
        <div className={styles.imageCol}>
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className={styles.productImage}
          />
        </div>

        {/* Columna derecha: detalles y acciones */}
        <div className={styles.detailsCol}>
          <h1 className={styles.productName}>{producto.nombre}</h1>
          <p className={styles.productPrice}>${producto.precio}</p>
          <p className={styles.productStock}>Stock disponible: {producto.stock} unidades</p>
          <p className={styles.productDescription}>{producto.detalle}</p>

          <div className={styles.actions}>
            <button onClick={addToCart} className={styles.addToCartBtn}>
              Agregar al Carrito
            </button>
            <button onClick={toggleFavorito} className={styles.favoriteIcon}>
              {esFavorito ? "💛" : "🤍"}
            </button>
          </div>
          {/* Opcional: selector de cantidad */}
          <div style={{ marginTop: "1rem" }}>
            <label>Cantidad: </label>
            <input
              type="number"
              min="1"
              max={producto.stock}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              style={{ width: "70px", marginLeft: "8px", padding: "4px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;