import styles from "./ModalConfirmacion.module.css";

const ModalConfirmacion = ({
  isOpen,
  onClose,
  titulo = "Confirmar Eliminación", 
  mensaje = "¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.",
  onConfirm,
  nombreItem = "",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{ titulo }</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <div className={styles.body}>
          <p>{mensaje}</p>
          {nombreItem && (
            <p className={styles.itemName}>
              <strong>“{nombreItem}”</strong>
            </p>
          )}
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            C{ cancelText }
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
           { confirmText }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;