import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import Register from ".//Register/Register";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  //asi por que AuthContext esta envolviendo y centraliza la logica de autenticación  OJO...
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      // Si pasa el login el contexto actualiza el usuario
      console.log("Inicio de sesión exitoso");
      // Redirige a la página principal
      navigate("/");
    } catch (err) {
      console.error("Error en el login:", err);
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          Ingresar
        </button>
      </form>
      <p className={styles.registerLink}>
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;
