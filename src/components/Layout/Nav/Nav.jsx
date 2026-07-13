import styles from "./Nav.module.css";
import { Link } from "react-router-dom";
import { useCart } from "../../../Context/CartContext/CartContext";
import { useAuth } from "../../../Context/AuthContext/AuthContext";

const Nav = () => {
  const { getCartQuantity } = useCart();
  const cartCount = getCartQuantity();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/"; //redirige a inicio
  };
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
          {/*<li>
            <Link className={styles.navLink} to="/productosN">
              Productos Nacionales
            </Link>
          </li>*/}
          <li>
            <Link className={styles.navLink} to="/contacto">
              Contáctanos
            </Link>
          </li>

          {isAdmin && (
            <>
              <li>
                <Link to="/gestion" className={styles.navLink}>
                  Gestión Productos
                </Link>
              </li>
              <li>
                <Link to="/admin/cupones" className={styles.navLink}>
                  Gestión Cupones
                </Link>
              </li>
            </>
          )}
        </ul>
        <div className={styles.cartContainer}>
          <Link to="/carrito" className={styles.cartButton}>
            🛒
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </Link>
        </div>
        {!user ? (
          <li><Link to="/login" className={styles.navLink}>Iniciar Sesión</Link></li>
        ) : (
          <li>
            <button
              onClick={handleLogout}
              className={styles.navLink}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Cerrar Sesión
            </button>
          </li>
        )}
      </nav>
    </>
  );
};

export default Nav;
