import {Link} from 'react-router';

/**
 * "Nuestra Historia" — seed page para /pages/nuestra-historia.
 * Layout inspirado en Tropicalia: big gold h1, 3-col intro + masonry de equipo.
 */
export function StoryPage() {
  return (
    <div className="tx-page">
      {/* ── Sección principal ── */}
      <section className="tx-page-section">
        <h1 className="tx-nosotros__h1">Yo no aprendí<br />a querer el café.<br />Lo heredé.</h1>
        <div className="tx-nosotros__intro">
          {/* col izquierda — fondo tinta */}
          <div className="tx-nosotros__col-dark">
            <h4>El propósito detrás del nombre</h4>
            <p>
              Moriah es el monte donde se reveló la provisión. Elegimos ese nombre
              porque el café bien cultivado y bien compartido es exactamente eso:
              provisión para el cuerpo y para el alma.
            </p>
            <Link to="/collections/cafes" className="tx-btn tx-btn--peq" style={{alignSelf: 'flex-start', marginTop: '1rem'}}>
              Nuestros cafés
            </Link>
          </div>
          {/* col centro — imagen */}
          <div className="tx-nosotros__col-img">
            <img
              src="/images/monte-moriah.webp"
              alt="Monte Moriah — Fincas cafeteras de Colombia"
              width={900}
              height={1200}
              loading="eager"
            />
          </div>
          {/* col derecha — texto */}
          <div className="tx-nosotros__col-text">
            <span className="tx-titulo">Cafés colombianos de alta montaña</span>
            <p className="tx-lede">
              Trabajamos con fincas aliadas en Colombia, seleccionando lotes con
              trazabilidad completa. Sabes de qué finca viene tu café, qué variedad
              es y cómo fue procesado.
            </p>
            <p className="tx-lede">
              Nacimos en 2025 con un grupo de amigos unidos por un sueño: servir al
              mundo a través del café colombiano de especialidad.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sección equipo ── */}
      <div id="equipo" className="tx-nosotros__equipo">
        {/* col texto sticky */}
        <div className="tx-nosotros__equipo-text">
          <span className="tx-eyebrow">Nuestro equipo</span>
          <h2 className="tx-display tx-h2">Las personas detrás del café</h2>
          <p className="tx-lede">
            Nos esforzamos por distribuir el mayor valor posible a las manos de los
            productores que cosechan los mejores granos de Colombia. Viajamos para
            encontrarlos, compramos a precios sostenibles y desarrollamos alianzas
            de largo plazo.
          </p>
          <p className="tx-lede">
            En MORIAH somos tostadores, catadores y distribuidores comprometidos con
            que cada taza tenga un propósito.
          </p>
          <Link to="/collections/cafes" className="tx-btn" style={{marginTop: '1rem'}}>
            Comprar ahora
          </Link>
        </div>

        {/* masonry de fotos */}
        <div className="tx-nosotros__masonry">
          <div className="tx-nosotros__photo tall">
            <img src="/images/tostado-moriah.webp" alt="Tostado artesanal MORIAH" width={600} height={900} loading="lazy" />
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'clamp(0.8rem,2vw,1.4rem)'}}>
            <div className="tx-nosotros__photo">
              <img src="/images/equipo-moriah.webp" alt="Equipo MORIAH" width={600} height={400} loading="lazy" />
            </div>
            <div className="tx-nosotros__photo">
              <img src="/images/cafe-cafes.webp" alt="Cafés MORIAH" width={600} height={400} loading="lazy" />
            </div>
            <div className="tx-nosotros__photo narrow">
              <img src="/images/lineup-bolsas.webp" alt="Línea de bolsas MORIAH" width={400} height={300} loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
