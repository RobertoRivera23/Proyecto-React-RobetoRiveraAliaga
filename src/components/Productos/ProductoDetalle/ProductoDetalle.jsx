import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./ProductoDetalle.module.css";
import { useCart } from "../../../Context/CartContext/CartContext"; 
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/config";

function ProductoDetalle() {
  const { id } = useParams();
  const { addToCart } = useCart(); 
  const [producto, setProducto] = useState(null);
  const [esFavorito, setEsFavorito] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const cargarProducto = async () => {
    if (!id) {
      setError("ID de producto no válido");
      setCargando(false);
      return;
    }

    try {
      const productosRef = doc(db, "Productos", id);
      const resp = await getDoc(productosRef); // 

      if (!resp.exists()) {
        setError("Producto no encontrado");
      } else {
        const data = resp.data();
        setProducto({
          ...data,
          firestoreId: resp.id, // guardamos el ID de Firestore
        });
      }
    } catch (err) {
      console.error("Error al obtener el producto:", err);
      setError("No se pudo cargar el producto. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  cargarProducto();
}, [id]);


  // useEffect(() => {
  //   fetch("/data/productos.json")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const encontrado = data.find((producto) => producto.id === parseInt(id));
  //       setProducto(encontrado);
  //     })
  //     .catch((error) => console.error("Error al cargar el producto:", error));
  // }, [id]);

   const toggleFavorito = () => {
     setEsFavorito(!esFavorito);
   };

  // Manejador para agregar al carrito
  const handleAddToCart = () => {
    if (!producto) return;

    if (cantidad <= 0) {
      alert("Debes seleccionar al menos una unidad");
      return;
    }

    if (cantidad > producto.stock) {
      alert("No hay suficiente stock. Stock disponible: ${producto.stock}");
      return;
    }

    // Construimos el objeto producto con los datos necesarios
    const item = {
      id: producto.firestoreId || producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.urlImagen,
      detalle: producto.detalle,
      categoria: producto.categoria
    };

    addToCart(item, cantidad);
    alert(`✅ ${producto.nombre} agregado al carrito (x${cantidad})`);
    setCantidad(1); 
  };

  //Carga y error
  if (cargando) {
    return <h2 style={{ textAlign: "center" }}>Cargando detalle del producto...</h2>;
  }

  if (error) {
    return <h2 style={{ textAlign: "center", color: "red" }}>{error}</h2>;
  }

  // Si no hay producto 
  if (!producto.id) {
    return <h2 style={{ textAlign: "center" }}>Producto no encontrado...</h2>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.imageCol}>
          <img
            src={producto.urlImagen}
            alt={producto.nombre}
            className={styles.productImage}
          />
        </div>
        <div className={styles.detailsCol}>
          <h1 className={styles.productName}>{producto.nombre}</h1>
          <p className={styles.productPrice}>${producto.precio}</p>
          <p className={styles.productStock}>Stock disponible: {producto.stock} unidades</p>
          <p className={styles.productDescription}>{producto.detalle}</p>

          <div className={styles.actions}>
            <div style={{ marginBottom: "1rem" }}>
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
            <button onClick={handleAddToCart} className={styles.addToCartBtn}>
              Agregar al Carrito
            </button>
            <button onClick={toggleFavorito} className={styles.favoriteIcon}>
              {esFavorito ? "💛" : "🤍"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;