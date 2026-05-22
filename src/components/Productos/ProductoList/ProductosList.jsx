import styles from "./ProductosList.module.css";
import { Link } from "react-router-dom";
import Producto from "../Producto/Producto.jsx";


function ProductosList({ productos }) {
  return (
    <div className={styles.gridContainer}>
      {productos.map((producto) => (
        <div key={producto.id} className={styles.cardWrapper}>
          
            <Producto 
              id={producto.id}
              {...producto}
            />
        </div>
      ))}
    </div>
  );
}

export default ProductosList;