import AsistentesList from '../../Asistentes/AsistentesList/AsistentesList.jsx';
import styles from './Footer.module.css';

function Footer(){
    
    return(
        <footer className={styles.footer}>
            <AsistentesList /> 
            <p>&copy; 2026 - Mi Aplicación React</p>
        </footer>
    );
};

export default Footer;