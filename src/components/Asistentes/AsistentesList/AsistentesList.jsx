// AsistentesList.jsx
import { useState, useEffect } from "react"; // 1. Importar hooks
import styles from "./AsistentesList.module.css";
import TarjetaAsistente from "../TarjetaAsistente/TarjetaAsistente";

function AsistentesList() {
  // Gestion de datos
  const [asistentes, setAsistentes] = useState([]); // 3. Estado para los datos
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Fetch
    fetch("/data/asistentes.json")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("No se pudo cargar la información de los asistentes");
        }
        return respuesta.json();
      })
      .then((datos) => {
        setAsistentes(datos); // Guardar los datos
        setCargando(false);
      })
      .catch((error) => {
        setError(error.message);
        setCargando(false);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []); // Dependencias vacías = ejecuta una vez

  if (cargando) {
    return <p>Cargando asistentes, por favor espere...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={styles.gridContainer}>
      {asistentes.map((asistente) => {
        console.log(asistente); // Mira qué propiedades tiene
        return <TarjetaAsistente key={asistente.id} {...asistente} />;
      })}
    </div>
  );
}

export default AsistentesList;
