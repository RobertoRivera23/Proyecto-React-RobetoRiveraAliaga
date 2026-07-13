import styles from "./GestionCupones.module.css";
import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const estadoInicial = {
  codigo: "",
  descuento: "",
};

const GestionCupones = () => {
  const [datosForm, setDatosForm] = useState(estadoInicial);
  const [cupones, setCupones] = useState([]);
  const [cuponesAEditar, setCuponesAEditar] = useState(null);
  const [cargando, setCargando] = useState(false);

  //Cargamos los cupones
  const obtenerCupones = async () => {
    try {
      const respuesta = await getDocs(collection(db, "Cupones"));
      const lista = respuesta.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCupones([...lista]);
    } catch (error) {
      console.error("Error al obtener los cupones:", error);
      alert("Ocurrió un error al cargar los cupones.");
    }
  };

  useEffect(() => {
    obtenerCupones();
    console.log("Los cupones: ", cupones);
  },  []);

  // Maneja cambios en el formulario
  const handleChangeCupon = (e) => {
    const { name, value } = e.target;

    // Validación para descuento
    if (name === "descuento") {
      if (value === "") {
        setDatosForm({
          ...datosForm,
          [name]: value,
        });
        return;
      }

      const numero = Number(value);
      // Permitir solo números entre 1 y 100
      if (
        !isNaN(numero) &&
        Number.isInteger(numero) &&
        numero >= 1 && numero <= 100
      ) {
        setDatosForm({
          ...datosForm,
          [name]: value,
        });
      } else {
        console.warn("Descuento debe ser un número entero entre 1 y 100");
      }
    } else {
      setDatosForm({
        ...datosForm,
        [name]: value,
      });
    }
  };

  // Crear y editar cupón
  const crearCupon = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!datosForm.codigo || !datosForm.descuento) {
      alert("Complete todos los campos.");
      return;
    }

    // Validar que el descuento sea un número entero entre 1 y 100
    const descuentoNumero = Number(datosForm.descuento);
    if (
      !Number.isInteger(descuentoNumero) ||
      descuentoNumero < 1 || descuentoNumero > 100
    ) {
      alert("El descuento debe ser un número entero entre 1 y 100.");
      return;
    }
    setCargando(true);
    try {
      if (cuponesAEditar) {
        await updateDoc(doc(db, "Cupones", cuponesAEditar.id), {
          codigo: datosForm.codigo,
          descuento: descuentoNumero,
        });
      } else {
        await addDoc(collection(db, "Cupones"), {
          codigo: datosForm.codigo,
          descuento: descuentoNumero,
        });
      }

      await obtenerCupones();
      
      setDatosForm(estadoInicial);
      setCuponesAEditar(null);
    } catch (error) {
      console.error("Error al guardar el cupón:", error);
      alert("Error al guardar el cupón.");
    } finally {
      setCargando(false);
    }
  };

  // Editar cupón
  const EditCupon = (cupon) => {
    setCuponesAEditar(cupon);
    setDatosForm({
      codigo: cupon.codigo,
      descuento: cupon.descuento.toString(),
    });
  };

  // Eliminar cupón
  const handleDeleteCupon = async (id) => {
    try {
      await deleteDoc(doc(db, "Cupones", id));
      if (cuponesAEditar?.id === id) {
        setCuponesAEditar(null);
        setDatosForm(estadoInicial);
      }
      await obtenerCupones();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el cupón.");
    }
  };

  // Cancela edición
  const handleCancelaEdicion = () => {
    setCuponesAEditar(null); 
    setDatosForm(estadoInicial);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Gestión de Cupones</h2>

      <form className={styles.form} onSubmit={crearCupon}>
        <input
          className={styles.input}
          type="text"
          name="codigo"
          placeholder="Código"
          required
          value={datosForm.codigo}
          onChange={handleChangeCupon}
        />
        <input
          className={styles.input}
          type="number"
          name="descuento"
          placeholder="Descuento (1-100)"
          min="1"
          max="100"
          required
          value={datosForm.descuento}
          onChange={handleChangeCupon}
        />
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          type="submit"
          disabled={cargando}
        >
          {cuponesAEditar ? "Actualizar Cupón" : "Crear Cupón"}
        </button>

        {cuponesAEditar && (
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            type="button"
            onClick={handleCancelaEdicion}
          >
            Cancelar
          </button>
        )}
      </form>

      <hr className={styles.divider} />

      <h3 className={styles.listTitle}>Listado de Cupones</h3>

      {cupones.length === 0 ? (
        <p className={styles.emptyMessage}>No hay cupones creados.</p>
      ) : (
        <div className={styles.list}>
          {cupones.map((cupon) => (
            <div key={cupon.id} className={styles.card}>
              <div className={styles.info}>
                <span className={styles.code}>
                  <strong>Código:</strong> {cupon.codigo}
                </span>
                <span className={styles.discount}>{cupon.descuento}%</span>
              </div>
              <div>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => EditCupon(cupon)}
                >
                  Editar
                </button>
                <button
                  className={`${styles.btn} ${styles.btnDanger}`}
                  onClick={() => handleDeleteCupon(cupon.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GestionCupones;
