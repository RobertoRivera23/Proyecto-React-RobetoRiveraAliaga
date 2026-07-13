import { useState, useEffect } from "react"; // 1. Importar hooks
import styles from "./AsistentesList.module.css";
import TarjetaAsistente from "../TarjetaAsistente/TarjetaAsistente";
import { db } from "../../../firebase/config";
import { collection, getDocs } from "firebase/firestore";


function AsistentesList() {
  // Gestion de datos
  const [asistentes, setAsistentes] = useState([]); 
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerAsistentes = async () => {
      try {
        const querySnapShot = await getDocs(collection(db, "Asistentes"));
        const lista = querySnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAsistentes(lista);
        setCargando(false);
      } catch (error) {
        console.error("Error al obtener los asistentes: ", error);
        setError("No se pudo cargar a los asistentes.");
        setCargando(false);
      }
    };

    obtenerAsistentes();
  }, []); 

  if (cargando) {
    return <p>Cargando asistentes, por favor espere...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={styles.gridContainer}>
      {asistentes.map((asistente) => {
        return <TarjetaAsistente key={asistente.id} {...asistente} />;
      })}
    </div>
  );
}

export default AsistentesList;
