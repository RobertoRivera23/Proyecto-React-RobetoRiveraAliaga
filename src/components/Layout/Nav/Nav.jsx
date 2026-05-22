import styles from "./Nav.module.css";
import { Link } from "react-router-dom";

function Nav() {

  return (
    <>
      <nav className={styles.navbar}>
        <a className={styles.logo}>Importadora Commerce</a>
        <ul className={styles.navList}>
          <li>
            <Link className={styles.navLink} to="/">
              Inicio
            </Link>
          </li>
          <li>
            <Link className={styles.navLink} to="/productos">
              Productos
            </Link>
          </li>
          <li>
            <Link className={styles.navLink} to="/destacados">
              Productos Destacados
            </Link>
          </li>
          <li>
            <Link className={styles.navLink} to="/contacto">
              Contáctanos
            </Link>
          </li>
          <li>
            <Link className={styles.navLink} to="/alta-producto">
              Agregar Producto
            </Link>
          </li>
        </ul>
        <div className={styles.cartContainer}>
          <Link to="/carrito" className={styles.cartButton}>
            🛒
            {/*cartCount > 0 && (
            <span className={styles.cartBadge}>{cartCount}</span>
          )*/}
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Nav;
