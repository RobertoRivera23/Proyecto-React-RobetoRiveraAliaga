import styles from "./GestionProductos.module.css";
import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/config";
import FormularioProducto from "../FormularioProducto/FormularioProducto"; 
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore"; 

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditadoId, setProductoEditadoId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");

  //Carga de datos al incio 
  const estadoInicialDelForm = {
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
    detalle: "",
    destacado: false,
    imagen: null,
    urlImagen: "",
  };

  const [datosForm, setDatosForm] = useState(estadoInicialDelForm);

  //Carga de errores inicio 
  const [errores, setErrores] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
    detalle: "",
    destacado: "",
    imagen: "",
    urlImagen: "",
  });

  //maneja carga de datos
  const [loading, setLoading] = useState(false);
  // controla si se selecciono imagenes
  const [imagenFile, setImagenFile] = useState(null);

  // Cargar productos
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const productosRef = collection(db, "Productos");
      const resp = await getDocs(productosRef);
      setProductos(
        resp.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            idFirestore: doc.id, 
          };
        }),
      );
    } catch (error) {
      console.error("Error al cargar productos.", error);
      setErrores((prev) => ({ ...prev, general: "Error al cargar productos" }));
    }
  };

  //Validacion de datos
  const validarCampo = (nombre, valor) => {
    switch (nombre) {
      case "nombre":
        if (!valor.trim()) return "El nombre es obligatorio";
        if (valor.length < 3) return "Mínimo 3 caracteres";
        if (valor.length > 50) return "Máximo 50 caracteres";
        return "";
      case "categoria":
        if (!valor.trim()) return "La categoría es obligatoria";
        if (valor.length < 3) return "Mínimo 3 caracteres";
        if (valor.length > 30) return "Máximo 30 caracteres";
        return "";
      case "precio":
        if (!valor) return "El precio es obligatorio";
        if (!/^\d+(\.\d{1,2})?$/.test(valor))
          return "Formato inválido (ej: 99 o 99.99)";
        if (parseFloat(valor) <= 0) return "Debe ser mayor a 0";
        if (parseFloat(valor) > 9999999) return "Precio demasiado alto";
        return "";
      case "stock":
        if (!valor) return "El stock es obligatorio";
        if (!/^\d+$/.test(valor)) return "Solo números enteros positivos";
        if (parseInt(valor) < 0) return "No puede ser negativo";
        if (parseInt(valor) > 10000) return "Stock máximo 10000";
        return "";
      case "detalle":
        if (!valor.trim()) return "El detalle es obligatorio";
        if (valor.length < 10) return "Minimo 10 carácteres";
        if (valor.length > 1000) return "Máximo 500 carácterres";
        return "";
      case "imagen":
        // Si está en modo edición y no hay imagen nueva, no es obligatorio subirla
        if (!modoEdicion && !valor) return "Debe seleccionar una imagen";
        if (valor && valor instanceof File) {
          const tipos = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
          if (!tipos.includes(valor.type))
            return "Formato no permitido (JPG, JPEG, PNG, WEBP)";
          if (valor.size > 2 * 1024 * 1024) return "Máximo 2MB";
        }
        return "";
      default:
        return "";
    }
  };

  // Manejador para campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevoValor = type === "checkbox" ? checked : value;

    setDatosForm((prev) => ({ ...prev, [name]: nuevoValor }));

    if (type !== "checkbox") {
      const error = validarCampo(name, nuevoValor);
      setErrores((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Manejador específico para archivos de imagen
  const handleFileChange = (e) => {
    const archivo = e.target.files[0] || null;
    const name = "imagen";

    setDatosForm((prev) => ({ ...prev, [name]: archivo }));
    const error = validarCampo(name, archivo);
    setErrores((prev) => ({ ...prev, [name]: error }));
  };

  // Prepara el formulario para editar un producto
  const handleEditar = (producto) => {
    setModoEdicion(true);
    setProductoEditadoId(producto.idFirestore);
    setDatosForm({
      nombre: producto.nombre || "",
      categoria: producto.categoria || "",
      precio: producto.precio?.toString() || "",
      stock: producto.stock?.toString() || "",
      detalle: producto.detalle || "",
      destacado: producto.destacado || false,
      imagen: null,
      urlImagen: producto.urlImagen || "",
    });
    setErrores({});
    document.querySelector("form")?.scrollIntoView({ behavior: "smooth" });
  };

  //Cancelar edición
  const handleCancelarEdicion = () => {
    setModoEdicion(false);
    setProductoEditadoId(null);
    setDatosForm(estadoInicialDelForm);
    setErrores({});
    setMensajeExito("");
  };

  //Eliminar productos
  const handleDelete = async (idFirestore) => {
    const confirmacion = window.confirm(
      "Esta seguro de que desea eliminar este producto?",
    );
    if (confirmacion) {
      try {
        const docRef = doc(db, "Productos", idFirestore);
        await deleteDoc(docRef);
        setProductos(productos.filter((prod) => prod.idFirestore !== idFirestore));
        alert("Producto Eliminado.");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Error al eliminar el producto.");
      }
    }
  };

  // Manejar subir imagen a ImgBB
  const subirImagen = async (archivo) => {
    if (!archivo) return null;
    const apiKey = "3eb0d944516e5fc624bc06002c489917";
    const formData = new FormData();
    formData.append("image", archivo); //

    console.log("Subiendo imagen a ImgBB...", archivo);

    const urlImgbb = `https://api.imgbb.com/1/upload?key=${apiKey}`;
    const respuestaImgbb = await fetch(urlImgbb, {
      method: "POST",
      body: formData,
    });
    const datosImgbb = await respuestaImgbb.json();

    if (!datosImgbb.success) {
      throw new Error(
        "Error al subir imagen: " +
          (datosImgbb.error?.message || "desconocido"),
      );
    }

    const urlImagen = datosImgbb.data.url;
    console.log("Imagen subida con éxito:", urlImagen);
    return urlImagen; //
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrores({});
    setMensajeExito("");

    // Validar todos los campos
    const nuevosErrores = {
      nombre: validarCampo("nombre", datosForm.nombre),
      categoria: validarCampo("categoria", datosForm.categoria),
      precio: validarCampo("precio", datosForm.precio),
      stock: validarCampo("stock", datosForm.stock),
      detalle: validarCampo("detalle", datosForm.detalle),
      imagen: validarCampo("imagen", datosForm.imagen),
    };

    setErrores(nuevosErrores);
    const esValido = Object.values(nuevosErrores).every((err) => err === "");

    if (!esValido) {
      console.log("Hay errores en el formulario", nuevosErrores);
      setLoading(false);
      alert("Corrige los errores del formulario");
      return;
    }

    //deshabilita boton cargar mientras se sube la imagen
    setLoading(true);
    console.log("Loading...");

    try {
      // Mantiene la imagen si no sube otra
      let urlImagen = datosForm.urlImagen;

      // Sube si hay imagen nueva 
      if (datosForm.imagen instanceof File) {
        urlImagen = await subirImagen(datosForm.imagen);
      }

      // Enviar el producto completo a la API
      const productoCompleto = {
        nombre: datosForm.nombre,
        categoria: datosForm.categoria,
        precio: parseFloat(datosForm.precio),
        stock: parseInt(datosForm.stock),
        detalle: datosForm.detalle,
        destacado: datosForm.destacado,
        urlImagen: urlImagen,
      };
      console.log("Producto completo a enviar:", productoCompleto);

      //subimos a DB
      console.log("Enviando producto a Firebase...", productoCompleto);

      if (modoEdicion && productoEditadoId) {
        // EDITAR
        const docRef = doc(db, "Productos", productoEditadoId);
        await updateDoc(docRef, productoCompleto);
        //actualizamos listado
        setProductos((prev) =>
          prev.map((prod) =>
            prod.idFirestore === productoEditadoId
              ? { ...prod, ...productoCompleto, idFirestore: prod.idFirestore }
              : prod,
          ),
        );
        setMensajeExito("Producto actualizado con éxito.");
      } else {
        // CREAR
        const productosCollection = collection(db, "Productos");
        const docRef = await addDoc(productosCollection, productoCompleto);

        setProductos((prev) => [
          ...prev,
          { ...productoCompleto, idFirestore: docRef.id },
        ]);
        setMensajeExito("Producto agregado con éxito.");
      }

      handleCancelarEdicion();
    } catch (error) {
      console.error("Error al guardar:", error);
      setErrores((prev) => ({
        ...prev,
        general: "Error al guardar. Intenta nuevamente.",
      }));
      alert("Error al guardar. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  // Renderizamos el formulario y la lista
  return (
    <div className={styles.gestionContainer}>
      <h2>Gestión de Productos</h2>
      <hr />

      <FormularioProducto
        datosForm={datosForm}
        errores={errores}
        modoEdicion={modoEdicion}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        handleCancelarEdicion={handleCancelarEdicion}
        loading={loading}
        mensajeExito={mensajeExito}
      />

      <hr />
      <h3 className={styles.listaTitulo}>Lista de Productos</h3>
      <div className={styles.listaProductos}>
        {productos.map((prod) => (
          <div key={prod.idFirestore} className={styles.productoItem}>
            <div className={styles.productoImagen}>
              {prod.urlImagen ? (
                <img src={prod.urlImagen} alt={prod.nombre} />
              ) : (
                <span className={styles.sinImagen}>📷</span>
              )}
            </div>

            <div className={styles.productoInfo}>
              <span className={styles.productoNombre}>{prod.nombre}</span>
              <span className={styles.productoCategoria}>
                {prod.categoria || "Sin categoría"}
              </span>
              <span className={styles.productoPrecio}>${prod.precio}</span>
            </div>

            <div className={styles.acciones}>
              <button
                className={styles.btnEditar}
                onClick={() => handleEditar(prod)}
              >
                ✏️ Editar
              </button>
              <button
                className={styles.btnEliminar}
                onClick={() => handleDelete(prod.idFirestore)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionProductos;
