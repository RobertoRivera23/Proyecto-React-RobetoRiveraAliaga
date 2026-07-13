import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../../firebase/config'; 
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 

// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Traducms los errores de Firebase
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No existe una cuenta con este correo electrónico.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido.';
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta más tarde.';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu internet.';
      default:
        return 'Ocurrió un error inesperado. Intenta nuevamente.';
    }
  };

  // Observa autenticación al abrir la app y en cada cambio de sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Si hay usuario consulta el rol en Firestore
        try {
          const userDocRef = doc(db, 'usuarios', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          let rol = 'user'; 
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            rol = data.rol || 'user';
          }

          setUser({
            ...currentUser,
            rol: rol,
          });
        } catch (error) {
          console.error('Error al obtener el rol del usuario:', error);
          setUser({
            ...currentUser,
            rol: 'user',
          });
        }
      } else {
        // No hay usuario autenticado
        setUser(null);
      }
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  // Inicia sesión
  const login = async (email, password) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const mensaje = getErrorMessage(err.code);
      setError(mensaje);
      throw err; 
    }
  };

  // REgistra nuevo Usuario
  const register = async (email, password, rol = "user") => {
    setError(null);

    try {
        // creamos ususario en Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        // guarda en firestore con el rol
        const userDocRef = doc(db, "usuarios", newUser.uid);
        await setDoc(userDocRef, {
            email: email,
            rol: rol,
            // fecha de creacioón
            createdAt: new Date().toISOString(),
        });

        return newUser;
    } catch (err) {
        const mensaje = getErrorMessage(err.code);
        setError(mensaje);
        throw err;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setError('Error al cerrar sesión. Intenta nuevamente.');
      throw err;
    }
  };

  // Limpiar error manualmente
  const clearError = () => setError(null);

  // Valor que se compartirá a toda la app
  const value = {
    user,          
    loading,
    error,
    login,
    logout,
    register,
    clearError,
    //informa si es admin OJO...
    isAdmin: user?.rol === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};