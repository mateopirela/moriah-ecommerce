import {Link} from 'react-router';
import {IconArrowRight, IconMountain, IconLeaf, IconCheck} from '~/components/Icons';

/**
 * "Nuestra Historia" — extended "¿Por qué Moriah?" page. Rendered as a local
 * fallback for /pages/nuestra-historia until the page exists in Shopify
 * (same seed→Shopify pattern as the catalog).
 */
export function StoryPage() {
  return (
    <div className="story-page">
      <StoryHero />
      <NameSection />
      <TeamSection />
      <ValuesSection />
      <StoryCta />
    </div>
  );
}

function StoryHero() {
  return (
    <section className="section section--dark">
      <div className="container" style={{textAlign: 'center', maxWidth: '760px'}}>
        <span className="eyebrow" style={{color: 'var(--gold-300)'}}>
          Nuestra historia
        </span>
        <h1 className="display-h2">Moriah, el monte de la provisión</h1>
        <p className="lede" style={{textAlign: 'center', color: 'rgba(247,243,234,0.8)'}}>
          En cada grano, una promesa. En cada taza, provisión. Esta es la
          historia detrás del nombre —y del propósito— que nos mueve.
        </p>
      </div>
    </section>
  );
}

function NameSection() {
  return (
    <section className="section section--cream">
      <div className="container story">
        <div className="story__media">
          <img
            src="/images/monte-moriah.webp"
            alt="Empaque MORIAH sobre las montañas cafeteras de Colombia"
            width={1024}
            height={1280}
            loading="lazy"
          />
        </div>
        <div className="story__body">
          <span className="eyebrow">¿Por qué Moriah?</span>
          <h2 className="display-h2">El nombre es la historia</h2>
          <p className="lede">
            Moriah es el monte donde, en la historia, se reveló la provisión:
            lo esencial llega cuando más se necesita. Elegimos ese nombre
            porque creemos que el café —bien cultivado, bien tostado, bien
            compartido— es eso: provisión para el cuerpo y para el alma.
          </p>
          <p className="lede">
            Por eso nuestro emblema es una montaña dorada. Cada taza de MORIAH
            es un recordatorio de conexión, propósito y vida; un momento para
            despertar lo esencial en medio del día.
          </p>
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="section">
      <div className="container story">
        <div className="story__media">
          <img
            src="/images/tostado-moriah.webp"
            alt="Granos de café MORIAH girando en la tostadora"
            width={1024}
            height={1280}
            loading="lazy"
          />
        </div>
        <div className="story__body">
          <span className="eyebrow">Cómo empezó</span>
          <h2 className="display-h2">Un grupo de amigos, un sueño</h2>
          <p className="lede">
            MORIAH nace en 2025 con un grupo de amigos unidos por un sueño:
            servir al mundo a través del café colombiano de especialidad.
            Empezamos recorriendo fincas, conociendo familias caficultoras y
            aprendiendo de quienes llevan generaciones cultivando en altura.
          </p>
          <p className="lede">
            Hoy trabajamos con fincas aliadas en Antioquia y otras regiones de
            Colombia, seleccionando lotes con trazabilidad completa: sabes de
            qué finca viene tu café, qué variedad es y cómo fue procesado.
          </p>
          <blockquote className="quote">
            “Cada grano que llega a tus manos cuenta una historia de origen,
            dedicación y conexión.”
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const values = [
    {
      Icon: IconLeaf,
      t: 'Trazabilidad total',
      d: 'Cada lote indica finca, variedad, proceso y altitud. La especificidad es nuestra forma de honrar a quien cultiva.',
    },
    {
      Icon: IconCheck,
      t: 'Comercio justo',
      d: 'Pagamos por calidad, no por volumen, para que las familias caficultoras aliadas prosperen con su trabajo.',
    },
    {
      Icon: IconMountain,
      t: 'Tostado con intención',
      d: 'Tandas pequeñas, perfiles diseñados por origen y sellado al vacío para que llegue fresco a tu puerta.',
    },
  ];
  return (
    <section className="section section--dark">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="eyebrow" style={{color: 'var(--gold-300)'}}>
            Lo que nos guía
          </span>
          <h2 className="display-h2">Más que café, un propósito</h2>
        </div>
        <div className="shipping-grid">
          {values.map(({Icon, t, d}) => (
            <div className="card-dark" key={t}>
              <Icon style={{width: 30, height: 30, color: 'var(--gold-400)'}} />
              <h3 className="display-h3" style={{marginTop: '1rem', fontSize: '1.2rem'}}>
                {t}
              </h3>
              <p className="muted" style={{color: 'rgba(247,243,234,0.65)'}}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryCta() {
  return (
    <section className="section section--cream">
      <div className="container" style={{textAlign: 'center', maxWidth: '640px'}}>
        <h2 className="display-h2">Prueba la provisión en tu taza</h2>
        <p className="lede" style={{textAlign: 'center'}}>
          Tres orígenes, una promesa. Encuentra el café que va contigo.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '1.5rem',
          }}
        >
          <Link className="btn btn--lg" to="/collections/cafes">
            Ver los cafés
            <IconArrowRight className="btn-icon" />
          </Link>
          <Link className="btn btn--outline-gold btn--lg" to="/quiz">
            Hacer el test
          </Link>
        </div>
      </div>
    </section>
  );
}
