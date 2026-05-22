import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import ProductosList from "../Productos/ProductoList/ProductosList";
import { Link } from "react-router-dom";

function Home() {
  const [productosDestacados, setProductosDestacados] = useState([]);

  useEffect(() => {
    fetch("/data/productos.json")
      .then((res) => res.json())
      .then((data) => {
        // Normalizar destacado (por si viene como string)
        const normalizados = data.map((p) => ({
          ...p,
          destacado: p.destacado === "true",
        }));
        const destacados = normalizados.filter((p) => p.destacado);
        setProductosDestacados(destacados);
      })
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Productos por Mayor <br /> para tu Negocio
            </h1>
            <p className={styles.heroSubtitle}>
              Tecnología, hogar y accesorios con precios competitivos y stock permanente.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/productos" className={styles.btnPrimary}>
                Ver Productos
              </Link>
              <Link to="/destacados" className={styles.btnSecondary}>
                Productos Destacados
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de Beneficios */}
      <section className={styles.benefitsBar}>
        <div className={styles.benefitsContainer}>
          <div className={styles.benefitItem}>✅ Envíos a todo el país</div>
          <div className={styles.benefitItem}>🤝 Atención personalizada</div>
          <div className={styles.benefitItem}>💰 Precios mayoristas</div>
          <div className={styles.benefitItem}>🌎 Productos importados</div>
          <div className={styles.benefitItem}>📦 Stock permanente</div>
        </div>
      </section>

      {/* Productos Destacados 
      <section className={styles.featured}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Productos Destacados</h2>
          {productosDestacados.length > 0 ? (
            <ProductosList productos={productosDestacados} />
          ) : (
            <p>Cargando productos destacados...</p>
          )}
        </div>
      </section>*/}

      {/* Por qué elegirnos */}
      <section className={styles.whyUs}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>¿Por qué elegir Importadora Commerce?</h2>
          <div className={styles.cards}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🏅</div>
              <h3>Calidad garantizada</h3>
              <p>Trabajamos con productos seleccionados y verificados.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🔒</div>
              <h3>Compra segura</h3>
              <p>Proceso rápido y seguro para mayoristas y revendedores.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>💬</div>
              <h3>Atención personalizada</h3>
              <p>Asesoramiento para negocios y emprendedores.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios (opcional, sugerido) */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Lo que dicen nuestros clientes</h2>
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonial}>
              <p>“Excelente atención y productos de primera calidad. Mi negocio creció con ellos.”</p>
              <span>- María Gómez, Revendedora</span>
            </div>
            <div className={styles.testimonial}>
              <p>“Stock permanente y envíos rápidos. Los recomiendo 100%.”</p>
              <span>- Roberto Rivera, Tienda mayorista</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;