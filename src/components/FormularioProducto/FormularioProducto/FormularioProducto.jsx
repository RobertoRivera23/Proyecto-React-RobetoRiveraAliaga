import React from "react";
import Style from "./FormularioProducto.module.css";

function FormularioProducto({ datosForm, loading, handleFileChange, errores, handleChange, handleSubmit }) {

    return (
    <form className={Style.formu} onSubmit={handleSubmit}>
      <h3>Agregar Nuevo Producto</h3>

      <div>
        <label>Nombre del Producto:</label>
        <input
          type="text"
          placeholder="Ej: Vaso Térmico"
          name="nombre"
          value={datosForm?.nombre || ""}
          onChange={handleChange}
        />
        {errores?.nombre && <span className={Style.error}>{errores.nombre}</span>}
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
        {errores?.precio && <span className={Style.error}>{errores.precio}</span>}
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
        <label>Imagen:</label>
        <input
          type="file"
          name="imagen"
          placeholder="https://..."
          accept="image/jpeg,image/png,image/jpg,image/webp"
          onChange={handleFileChange}
        />
        {errores?.imagen && <span className={Style.error}>{errores.imagen}</span>}
      </div>

      <button type="submit" disabled={loading}>
      {loading ? "Guardando..." : "Guardar Producto"}
      </button>
    </form>
  );
}

export default FormularioProducto;