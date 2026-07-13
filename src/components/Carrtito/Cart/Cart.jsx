import { useState } from "react";
import styles from "./Cart.module.css";
import { useCart } from "../../../Context/CartContext/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { 
    cart, 
    getCartTotal, 
    clearCart, 
    removeItem,  
    aplicarCupon,
    eliminarCupon,
    cuponAplicado,
    errorCupon,
    getDescuento,
    getSubtotal,
  } = useCart();

  const [ codigoCupon, setCodigoCupon ] = useState("");

  const handleAplicarCupon = async (e) => {
    e.preventDefault();
    if (!codigoCupon.trim())
      return;
    await aplicarCupon(codigoCupon);
    setCodigoCupon("");
  };


  // Si el carrito está vacío, mostramos mensaje
  if (cart.length === 0) {
    return (
      <div className={styles.cartContainer}>
        <h2 className={styles.cartTitle}>🛒 Mi Carrito</h2>
        <p className={styles.emptyCart}>
          El carrito está vacío. ¡Comienza a comprar!
        </p>
        <Link to="/productos" className={styles.shopButton}>
          Ver Productos
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const descuento = getDescuento();
  const total = getCartTotal();

  return (
     <div className={styles.cartContainer}>
      <h2 className={styles.cartTitle}>🛒 Mi Carrito</h2>

      <div className={styles.cartList}>
        {cart.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{item.nombre}</span>
              <div className={styles.itemDetails}>
                <span className={styles.unitPrice}>
                  Precio unitario: ${item.precio}
                </span>
                <span className={styles.itemQuantity}>
                  Cantidad: {item.cantidad}
                </span>
              </div>
            </div>
            <span className={styles.itemSubtotal}>
              ${item.precio * item.cantidad}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className={styles.removeButton}
            >
              ✕ Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className={styles.cuponSection}>
        <form onSubmit={handleAplicarCupon} className={styles.cuponForm}>
          <input
            type="text"
            placeholder="Código de cupón"
            value={codigoCupon}
            onChange={(e) => setCodigoCupon(e.target.value)}
            className={styles.cuponInput}
          />
          <button type="submit" className={styles.cuponButton}>
            Aplicar
          </button>
        </form>
        {errorCupon && <p className={styles.cuponError}>{errorCupon}</p>}
        {cuponAplicado && (
          <div className={styles.cuponAplicado}>
            <span>Cupón aplicado: <strong>{cuponAplicado.codigo}</strong> ({cuponAplicado.descuento}% de descuento)</span>
            <button onClick={eliminarCupon} className={styles.eliminarCupon}>✕</button>
          </div>
        )}
      </div>

      <div className={styles.cartSummary}>
        <div className={styles.summaryLine}>
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {descuento > 0 && (
          <div className={styles.summaryLine}>
            <span>Descuento ({cuponAplicado?.descuento}%):</span>
            <span className={styles.discountAmount}>-${descuento.toFixed(2)}</span>
          </div>
        )}
        <div className={styles.summaryLine}>
          <span className={styles.totalLabel}>Total a Pagar:</span>
          <span className={styles.totalPrice}>${total.toFixed(2)}</span>
        </div>

        <div className={styles.actionButtons}>
          <button onClick={clearCart} className={styles.clearButton}>
            Vaciar carrito
          </button>
          <button className={styles.checkoutButton}>Ir a pagar</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
