import React, { useState } from "react";
import FormularioContacto from "../FormularioContacto/FormularioContacto";

function FormularioContactoContainer() {
  const [datosForm, setDatosForm] = useState({
    nombreCompleto: "",
    empresa: "",
    correo: "",
    telefono: "",
    mensaje: "",
  });

  const [errores, setErrores] = useState({
    nombreCompleto: "",
    empresa: "",
    correo: "",
    telefono: "",
    mensaje: "",
  });

  const [loading, setLoading] = useState(false);

  const validarCampo = (nombre, valor) => {
    switch (nombre) {
      case "nombreCompleto":
        if (!valor.trim()) return "El nombre es obligatorio";
        if (valor.length < 3) return "Mínimo 3 caracteres";
        return "";
      case "empresa":
        // opcional
        return "";
      case "correo":
        if (!valor.trim()) return "El correo es obligatorio";
        const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        if (!emailRegex.test(valor)) return "Formato inválido (ej: nombre@dominio.com)";
        return "";
      case "telefono":
        if (!valor.trim()) return "El teléfono es obligatorio";
        const soloNumeros = valor.replace(/[\s-]/g, '');
        if (!/^\d{8,15}$/.test(soloNumeros)) return "Debe tener entre 8 y 15 dígitos";
        return "";
      case "mensaje":
        if (!valor.trim()) return "El mensaje es obligatorio";
        if (valor.length < 5) return "Mínimo 5 caracteres";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosForm(prev => ({ ...prev, [name]: value }));
    const error = validarCampo(name, value);
    setErrores(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {
      nombreCompleto: validarCampo("nombreCompleto", datosForm.nombreCompleto),
      empresa: validarCampo("empresa", datosForm.empresa),
      correo: validarCampo("correo", datosForm.correo),
      telefono: validarCampo("telefono", datosForm.telefono),
      mensaje: validarCampo("mensaje", datosForm.mensaje),
    };
    setErrores(nuevosErrores);
    const esValido = Object.values(nuevosErrores).every(err => err === "");
    if (!esValido) {
      alert("Corrige los errores del formulario");
      return;
    }
    setLoading(true);
    try {
      //enviar datos a backend
      console.log("Datos de contacto:", datosForm);
      alert("Mensaje enviado correctamente");
      setDatosForm({ nombreCompleto: "", empresa: "", correo: "", telefono: "", mensaje: "" });
      setErrores({});
    } catch (error) {
      console.error(error);
      alert("Error al enviar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormularioContacto
      datosForm={datosForm}
      errores={errores}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      loading={loading}
    />
  );
}

export default FormularioContactoContainer;