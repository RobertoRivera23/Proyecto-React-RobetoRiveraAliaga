import React, { useState } from 'react';
import { useAuth } from '../../../Context/AuthContext/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validaciones 
    if (!email || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Llama a la función register del contexto
      await register(email, password, 'user');
      
      setSuccess(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // redirige al login  pasados de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      // capturmos el error desde el contexto para mostrarlo en mensaje local OJO..
      setError(err.message || 'Error al registrar el usuario');
    } finally {
      setLoading(false);
      // Limpia el error del contexto después de un tiempo 
      setTimeout(clearError, 5000);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.title}>Crear cuenta</h2>
      
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>¡Usuario registrado con éxito! Redirigiendo...</p>}
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
          disabled={loading}
          minLength="6"
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
          required
          disabled={loading}
        />
        <button 
          type="submit" 
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      
      <p className={styles.loginLink}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
};

export default Register;