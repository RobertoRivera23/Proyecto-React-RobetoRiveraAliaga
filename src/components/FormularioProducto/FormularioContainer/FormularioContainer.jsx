import React, { useState } from "react";
import FormularioProducto from "../FormularioProducto/FormularioProducto";
import { getFirestore, collection, addDoc } from 'firebase/firestore';

function FormularioContainer({ onProductAdded }) { 
  //Carga de datos al incio
  const [datosForm, setDatosForm] = useState({
    nombre: "",
    categoria: "",        
    precio: "",
    stock: "",
    detalle: "",
    destacado: false,
    imagen: null,
  });

  //Carga de errores inicio
  const [errores, setErrores] = useState({
    nombre: "",
    categoria: "",        
    precio: "",
    stock: "",
    detalle: "",
    destacado: "",
    imagen: "",
  });
  
  //maneja carga de datos
  const [loading, setLoading] = useState(false);
  // maneja imagenes
  const [imagenFile, setImagenFile] = useState(null); 

  //Validacion de datos de onChange y onSubmit
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
        if(valor.length < 10) return "Minimo 10 carácteres";
        if(valor.length > 500) return "Máximo 500 carácterres";
        return "";
      case "imagen":
        if (!valor) return "Debe seleccionar una imagen";
        const tipos = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (!tipos.includes(valor.type))
          return "Formato no permitido (JPG, JPEG, PNG, WEBP)";
        if (valor.size > 2 * 1024 * 1024) return "Máximo 2MB";
        return "";
      default:
        return "";
    }
  };

  // Manejador para campos de texto 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevoValor = type === "checkbox" ? checked : value;

    setDatosForm((prev) => ({ ...prev, [name]: nuevoValor }));

    if (type !== "checkbox") {
      const error = validarCampo(name, nuevoValor);
      setErrores((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Manejador para archivos de imagen 
  const handleFileChange = (e) => {
    const archivo = e.target.files[0] || null;
    const name = "imagen";

    setDatosForm((prev) => ({ ...prev, [name]: archivo }));
    const error = validarCampo(name, archivo);
    setErrores((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      alert("Corrige los errores del formulario");
      return;
    }
    //deshabilita boton cargar mienstra sube la imagen
    setLoading(true);
    console.log("Loading...");

    try {
      // Sube la imagen a ImgBB
      const apiKey = "3eb0d944516e5fc624bc06002c489917";
      const formData = new FormData();
      formData.append("image", datosForm.imagen);

      console.log("Subiendo imagen a ImgBB...", datosForm.imagen);

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
      console.log("Imagen subida con exito:", urlImagen);

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

      //manejo a DB
      const db = getFirestore();
      const productosCollection = collection(db, "Productos");
      const docRef = await addDoc(productosCollection, productoCompleto);

      
      if (onProductAdded) {
        onProductAdded({ ...productoCompleto, id: docRef.id });
      }

      alert("Producto guardado correctamente");

      // Limpia el formulario
      setDatosForm({ 
        nombre: "", 
        categoria: "",    
        precio: "", 
        stock: "", 
        detalle: "",
        destacado: false, 
        imagen: null 
      });
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormularioProducto
      datosForm={datosForm}
      errores={errores}
      handleChange={handleChange}
      handleFileChange={handleFileChange}
      handleSubmit={handleSubmit}
      loading={loading}
    />
  );
}

export default FormularioContainer;