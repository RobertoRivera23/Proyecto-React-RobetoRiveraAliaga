import React from "react";
import Style from "./FormularioProducto.module.css";

function FormularioProducto({
  datosForm,
  errores,
  modoEdicion,
  handleChange,
  handleFileChange,
  handleSubmit,
  handleCancelarEdicion,
  loading,
  mensajeExito,
}) {
  console.log("📦 datosForm en FormularioProducto:", datosForm);

  return (
    <form className={Style.formu} onSubmit={handleSubmit}>
      <h3>{modoEdicion ? "Editar Producto" : "Agregar Nuevo Producto"}</h3>

      {mensajeExito && <div className={Style.exito}>{mensajeExito}</div>}
      {errores?.general && (
        <div className={Style.errorGeneral}>{errores.general}</div>
      )}

      <div>
        <label>ID (Código):</label>
        <input
          type="number"
          placeholder="Ej: 123"
          name="id"
          value={datosForm?.id || ""}
          onChange={handleChange}
          min="1"
          step="1"
        />
        {errores?.id && <span className={Style.error}>{errores.id}</span>}
      </div>

      <div>
        <label>Nombre del Producto:</label>
        <input
          type="text"
          placeholder="Ej: Vaso Térmico"
          name="nombre"
          value={datosForm?.nombre || ""}
          onChange={handleChange}
        />
        {errores?.nombre && (
          <span className={Style.error}>{errores.nombre}</span>
        )}
      </div>

      <div>
        <label>Categoría:</label>
        <input
          type="text"
          placeholder="Ej: Hogar, Electrónica, Deportes..."
          name="categoria"
          value={datosForm?.categoria || ""}
          onChange={handleChange}
        />
        {errores?.categoria && (
          <span className={Style.error}>{errores.categoria}</span>
        )}
      </div>

      <div>
        <label>Precio:</label>
        <input
          type="text"
          placeholder="Ej: 12000"
          name="precio"
          value={datosForm?.precio || ""}
          onChange={handleChange}
        />
        {errores?.precio && (
          <span className={Style.error}>{errores.precio}</span>
        )}
      </div>

      <div>
        <label>Stock:</label>
        <input
          type="text"
          placeholder="Ej: 50"
          name="stock"
          value={datosForm?.stock || ""}
          onChange={handleChange}
        />
        {errores?.stock && <span className={Style.error}>{errores.stock}</span>}
      </div>

      <div>
        <label>Detalle:</label>
        <textarea
          placeholder="Ej: Vaso térmico de acero inoxidable..."
          name="detalle"
          rows={4}
          value={datosForm?.detalle || ""}
          onChange={handleChange}
        />
        {errores?.detalle && (
          <span className={Style.error}>{errores.detalle}</span>
        )}
      </div>

      <div>
        <label>Imagen:</label>
        <input
          type="file"
          name="imagen"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          onChange={handleFileChange}
        />
        {modoEdicion && datosForm?.urlImagen && (
          <div>
            <p>Imagen actual:</p>
            <img
              src={datosForm.urlImagen}
              alt="Vista previa"
              style={{
                maxWidth: "150px",
                maxHeight: "150px",
                objectFit: "contain",
              }}
            />
          </div>
        )}
        {errores?.imagen && (
          <span className={Style.error}>{errores.imagen}</span>
        )}
      </div>

      <div className={Style.checkboxContainer}>
        <label>Destacado:</label>
        <input
          type="checkbox"
          name="destacado"
          checked={datosForm?.destacado || false}
          onChange={handleChange}
        />
        {errores?.destacado && (
          <span className={Style.error}>{errores.destacado}</span>
        )}
      </div>

      <div className={Style.botones}>
        <button type="submit" disabled={loading}>
          {loading
            ? "Guardando..."
            : modoEdicion
              ? "Actualizar Producto"
              : "Guardar Producto"}
        </button>
        {modoEdicion && (
          <button type="button" onClick={handleCancelarEdicion}>
            Cancelar Edición
          </button>
        )}
      </div>
    </form>
  );
}

export default FormularioProducto;
