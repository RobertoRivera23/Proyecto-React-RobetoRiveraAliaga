import { useState, createContext, useContext } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

// Creamos el contexto
export const CartContext = createContext();

// Hook porseonalizado
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
};

// El  provider que envuelve la app
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  // codigo e descuento
  const [ cuponAplicado, setCuponAplicado ] = useState(null);
  const [ errorCupon, setErrorCupon ] = useState(null);

  // Agrega o actualiza un producto en el carrito
  const addToCart = (producto, cantidad = 1) => {
    // Validamos que cantidad debe ser mayor a 0
    if (cantidad <= 0) return;

    // Buscamos si el producto esta en el carrito
    const itemExiste = cart.find(item => item.id === producto.id);

    if (itemExiste) {
      // Actualizamos la cantidad sumando
      const updateCart = cart.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      );
      setCart(updateCart);
    } else {
      // Si no esta lo agregamos como nuevo item
      setCart([...cart, { ...producto, cantidad }]);
    }
  };

  // Vacía todo el carrito
  const clearCart = () => {
    setCart([]);
    setCuponAplicado(null);
    setErrorCupon(null);
  }

  // Elimina un producto por su id
  const removeItem = (productoId) => {
    setCart(cart.filter(item => item.id !== productoId));
  };

  // Devuelve la cantidad total de productos 
  const getCartQuantity = () => {
    return cart.reduce((acc, item) => acc + item.cantidad, 0);
  };

  //Total sin descuento
  const getSubtotal =  () => {
    return cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  //Precio total con descuento
  const getCartTotal = () => {
    const subtotal = getSubtotal();
    if (cuponAplicado) {
      const descuento = (subtotal * cuponAplicado.descuento) / 100;
      return subtotal - descuento;
    }
    return subtotal;
  };

  //desceunto en dinero
  const getDescuento = () => {
    const subtotal = getSubtotal();
    if (cuponAplicado) {
      return (subtotal * cuponAplicado.descuento) / 100;
    }
    return 0;
  }

  //bucamos aplicar el cupon de firestore
  const aplicarCupon = async (codigo) => {
    setErrorCupon(null);
    if (!codigo || codigo.trim() === "") {
      setErrorCupon("Ingresa el código de cupón.")
      return false;
    }

    try {
      const quer = query(collection(db, "Cupones"), where("codigo", "==", codigo.trim()));
      const querySnapshot = await getDocs(quer);
      if (querySnapshot.empty) {
        setErrorCupon("El cupón no es válido.");
        return false;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();
      const descuento = Number(data.descuento);
      if (!descuento || descuento <= 0 || descuento > 100) {
        setErrorCupon("El cupón tiene un descuento no válido.");
        return false;
      }

      setCuponAplicado({
        codigo: codigo.trim(),
        descuento: descuento,
        id: doc.id,
      });
      return true;
    } catch (error) {
      console.error("Error al aplicar el Cupón.");
      console.error("Código= ", error.code);
      console.error("Mensaje= ", error.message);
      setErrorCupon("Error al validar el cupón. Intenta nuevamente.");
      return false;
    }
  };

  //Eliminar el cupón
  const eliminarCupon = () => {
    setCuponAplicado(null);
    setErrorCupon(null);
  };

    // Cantidad de un producto 
  const getCantidadActual = (productoId) => {
    const item = cart.find(item => item.id === productoId);
    return item ? item.cantidad : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeItem,
        clearCart,
        getCantidadActual,
        getCartQuantity,
        getCartTotal,
        getSubtotal,
        getDescuento,
        aplicarCupon,
        eliminarCupon,
        cuponAplicado,
        errorCupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};