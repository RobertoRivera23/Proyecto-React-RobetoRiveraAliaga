import styles from "./TarjetaAsistente.module.css";

function TarjetaAsistente({ nombre, tarea, imagen, correo }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageCircle}>
        {imagen && <img src={imagen} alt={nombre} className={styles.image} />}
      </div>
      <h3 className={styles.name}>{nombre}</h3>
      <p className={styles.tarea}>{tarea}</p>
      <p className={styles.email}>{correo}</p>
    </div>
  );
}

export default TarjetaAsistente;