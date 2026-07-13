import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Proximamente.module.css';

const Proximamente = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🚧 Próximamente</h1>
      <p className={styles.message}>
        Estamos trabajando la gestión de pagos.
        <br />
        ¡Vuelve pronto para completar tu compra!
        <br />
        Gracias por elegirnos!!! 😄
      </p>
      <Link to="/" className={styles.button}>
        Volver al inicio
      </Link>
    </div>
  );
};

export default Proximamente;