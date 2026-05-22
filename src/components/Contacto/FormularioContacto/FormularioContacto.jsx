import React from "react";
import styles from "./FormularioContacto.module.css";

function FormularioContacto({ datosForm, errores, handleChange, handleSubmit, loading }) {
  // Datos de la empresa (pueden venir por props o ser fijos)
  const empresaInfo = {
    nombre: "Importadora Commerce S.A.",
    direccion: "Av. Principal 1234, Ciudad Autónoma de Buenos Aires",
    telefono: "+54 11 1234-5678",
    email: "ventas@importadoracommerce.com",
    horario: "Lunes a Viernes de 9 a 18 hs",
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.container}>
        <div className={styles.infoColumn}>
          <h2 className={styles.title}>Solicitud de venta al por mayor</h2>
          <p className={styles.description}>
            Nuestro programa de ventas al por mayor se centra en establecer asociaciones,
            garantizar la transparencia y ofrecer productos de la más alta calidad.
          </p>
          <div className={styles.contactDetails}>
            <h3>Datos de contacto</h3>
            <p><strong>Empresa:</strong> {empresaInfo.nombre}</p>
            <p><strong>Dirección:</strong> {empresaInfo.direccion}</p>
            <p><strong>Teléfono:</strong> {empresaInfo.telefono}</p>
            <p><strong>Email:</strong> {empresaInfo.email}</p>
            <p><strong>Horario:</strong> {empresaInfo.horario}</p>
          </div>
        </div>

        {/* Columna derecha - formulario */}
        <div className={styles.formColumn}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3>Completa el formulario y te contactaremos</h3>
            
            <div className={styles.formGroup}>
              <label>Nombre completo *</label>
              <input
                type="text"
                name="nombreCompleto"
                value={datosForm.nombreCompleto}
                onChange={handleChange}
                placeholder="Juan Pérez"
              />
              {errores.nombreCompleto && <span className={styles.error}>{errores.nombreCompleto}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Empresa / Tienda</label>
              <input
                type="text"
                name="empresa"
                value={datosForm.empresa}
                onChange={handleChange}
                placeholder="Mi Negocio SA"
              />
              {errores.empresa && <span className={styles.error}>{errores.empresa}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Correo electrónico *</label>
              <input
                type="email"
                name="correo"
                value={datosForm.correo}
                onChange={handleChange}
                placeholder="contacto@ejemplo.com"
              />
              {errores.correo && <span className={styles.error}>{errores.correo}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Número de teléfono *</label>
              <input
                type="tel"
                name="telefono"
                value={datosForm.telefono}
                onChange={handleChange}
                placeholder="1122223333"
              />
              {errores.telefono && <span className={styles.error}>{errores.telefono}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Mensaje *</label>
              <textarea
                name="mensaje"
                rows="4"
                value={datosForm.mensaje}
                onChange={handleChange}
                placeholder="Escriba su consulta..."
              />
              {errores.mensaje && <span className={styles.error}>{errores.mensaje}</span>}
            </div>

            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormularioContacto;