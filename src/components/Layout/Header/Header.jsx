import React from "react";
import styles from "./Header.module.css";
import Nav from "../Nav/Nav.jsx";

function Header() {
  return (
    <header>
      <div className={styles.header}>
        <div className={styles.container}>
          <Nav />
        </div>
      </div>
    </header>
  );
}

export default Header;
