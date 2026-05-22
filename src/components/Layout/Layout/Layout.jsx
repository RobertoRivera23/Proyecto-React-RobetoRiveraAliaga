import styles from "./Layout.module.css";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";
import Header from "../Header/Header.jsx";


function Layout() {

  return (
    <>
      <div className={styles.layoutContainer}>
        <Header />
        <main className={styles.mainContent}>
          < Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Layout;


