import {useState} from 'react';

const METHODS = [
  {
    id: 'aeropress',
    label: 'Aeropress',
    img: '/images/hero-lifestyle.webp',
    specs: [
      {k: 'Café', v: '18 g'},
      {k: 'Agua', v: '200 ml + 50 ml bypass'},
      {k: 'Molienda', v: 'Fina, casi como la arena'},
      {k: 'Temperatura', v: '92 °C'},
      {k: 'Tiempo total', v: '3 minutos'},
      {k: 'Filtros', v: '2 filtros de papel'},
    ],
    steps: [
      {t: 'Paso 1: Medir y moler', d: 'Pesa 18 g de café y muélelo fino, casi como arena. Una cucharada Aeropress redondeada.'},
      {t: 'Paso 2: Preparar el Aeropress', d: 'Coloca el filtro y enjuágalo con agua caliente. Arma el Aeropress en posición invertida.'},
      {t: 'Paso 3: Agregar café', d: 'Agrega el café molido al Aeropress con la ayuda del embudo.'},
      {t: 'Paso 4: Verter el agua', d: 'Vierte 200 ml de agua a 92 °C en 10 segundos. Satura bien el café molido.'},
      {t: 'Paso 5: Sellar y esperar', d: 'Coloca el émbolo y crea un sello. Espera hasta el minuto 1:15.'},
      {t: 'Paso 6: Revolver y presionar', d: 'Retira el sello, revuelve y vuelve a poner el émbolo. Presiona suavemente hasta escuchar un silbido.'},
    ],
  },
  {
    id: 'chemex',
    label: 'Chemex',
    img: '/images/monte-moriah.webp',
    specs: [
      {k: 'Café', v: '30 g'},
      {k: 'Agua', v: '500 ml'},
      {k: 'Molienda', v: 'Media-gruesa'},
      {k: 'Temperatura', v: '94 °C'},
      {k: 'Tiempo total', v: '4–5 minutos'},
      {k: 'Filtros', v: '1 filtro Chemex'},
    ],
    steps: [
      {t: 'Paso 1: Enjuagar el filtro', d: 'Dobla el filtro en cuatro, colócalo en el Chemex y enjuágalo con agua caliente.'},
      {t: 'Paso 2: Agregar café', d: 'Añade 30 g de café molido medio-grueso.'},
      {t: 'Paso 3: Bloom', d: 'Vierte 60 ml de agua y espera 45 segundos para que el café "florezca".'},
      {t: 'Paso 4: Vertidos en espiral', d: 'Continúa vertiendo en movimientos circulares hasta completar 500 ml en 3–4 minutos.'},
      {t: 'Paso 5: Retirar el filtro', d: 'Cuando el agua termine de pasar, retira el filtro y sirve.'},
    ],
  },
  {
    id: 'filtrado',
    label: 'Filtrado manual',
    img: '/images/tostado-moriah.webp',
    specs: [
      {k: 'Café', v: '15 g'},
      {k: 'Agua', v: '250 ml'},
      {k: 'Molienda', v: 'Media'},
      {k: 'Temperatura', v: '93 °C'},
      {k: 'Tiempo total', v: '3 minutos'},
      {k: 'Filtros', v: '1 filtro de papel V60'},
    ],
    steps: [
      {t: 'Paso 1: Preparar', d: 'Coloca el filtro en el dripper y enjuágalo sobre la taza con agua caliente.'},
      {t: 'Paso 2: Bloom', d: 'Añade 15 g de café y vierte el doble en agua (30 ml). Espera 30 segundos.'},
      {t: 'Paso 3: Primer vertido', d: 'Vierte en espiral hasta los 130 ml totales.'},
      {t: 'Paso 4: Segundo vertido', d: 'Cuando el nivel baje, continúa hasta 250 ml en movimientos constantes.'},
      {t: 'Paso 5: Disfrutar', d: 'Retira el dripper en cuanto el café deje de gotear. Sirve y disfruta.'},
    ],
  },
  {
    id: 'prensa',
    label: 'Prensa francesa',
    img: '/images/equipo-moriah.webp',
    specs: [
      {k: 'Café', v: '30 g'},
      {k: 'Agua', v: '500 ml'},
      {k: 'Molienda', v: 'Gruesa'},
      {k: 'Temperatura', v: '92 °C'},
      {k: 'Tiempo total', v: '4 minutos'},
    ],
    steps: [
      {t: 'Paso 1: Pre-calentar', d: 'Llena la prensa con agua caliente, espera un minuto y bota el agua.'},
      {t: 'Paso 2: Café y agua', d: 'Añade 30 g de café molido grueso y vierte 500 ml de agua a 92 °C.'},
      {t: 'Paso 3: Revolver', d: 'Revuelve suavemente con una cuchara de madera.'},
      {t: 'Paso 4: Tapar y esperar', d: 'Coloca la tapa sin presionar. Espera 4 minutos exactos.'},
      {t: 'Paso 5: Presionar y servir', d: 'Presiona el émbolo lentamente y sirve de inmediato para evitar sobreextracción.'},
    ],
  },
];

export function BrewGuidePage() {
  const [active, setActive] = useState('aeropress');
  const method = METHODS.find((m) => m.id === active);

  return (
    <div className="tx-page">
      {/* Banner */}
      <div className="tx-brew-banner">
        <img
          src="/images/hero-lifestyle.webp"
          alt="Preparación de café MORIAH"
          width={1920}
          height={600}
          className="tx-brew-banner__img"
          fetchPriority="high"
        />
        <div className="tx-brew-banner__title">Prepara tu café</div>
      </div>

      {/* Tabs */}
      <div style={{background:'var(--tx-bg)', borderBottom:'1px solid var(--tx-line)', padding:'0 var(--tx-gutter)'}}>
        <nav className="tx-brew-tabs" aria-label="Métodos de preparación">
          {METHODS.map((m) => (
            <button
              key={m.id}
              className="tx-brew-tab"
              data-active={active === m.id ? 'true' : 'false'}
              onClick={() => setActive(m.id)}
              type="button"
            >
              {m.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {method && (
        <div className="tx-brew-pane tx-brew-pane--active">
          {/* izquierda: imagen + specs */}
          <div className="tx-brew-left">
            <div className="tx-brew-specs">
              <h2 className="tx-display tx-h2" style={{color:'var(--tx-ink)', marginBottom:'1rem'}}>
                {method.label}
              </h2>
              <p className="tx-titulo" style={{marginBottom:'0.8rem'}}>Para una taza</p>
              {method.specs.map((s) => (
                <div key={s.k} className="tx-brew-spec">
                  <strong>{s.k}:</strong> {s.v}
                </div>
              ))}
            </div>
            <div className="tx-brew-img">
              <img src={method.img} alt={method.label} width={600} height={800} loading="lazy" />
            </div>
          </div>

          {/* derecha: pasos */}
          <div className="tx-brew-steps">
            {method.steps.map((s) => (
              <div key={s.t} className="tx-brew-step">
                <h4>{s.t.split(':')[0]}: <span>{s.t.split(':')[1]}</span></h4>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
