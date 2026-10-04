import {useEffect, useRef, useState} from 'react';
import {Link, useFetcher, useNavigate, useSearchParams} from 'react-router';
import {SIZES, formatCop, subscriptionPrice, GRINDS} from '~/data/cafes';
import {unitPrice} from '~/lib/catalog';
import {AddToCartButton} from '~/components/AddToCartButton';
import {
  QUESTIONS,
  computeResult,
  decodeAnswers,
  encodeAnswers,
} from '~/data/quiz';

export const meta = () => [
  {title: 'Encuentra tu café · MORIAH Café'},
  {
    name: 'description',
    content:
      'Responde 5 preguntas y descubre cuál de nuestros cafés de especialidad va contigo, con la molienda ideal para tu método.',
  },
];

export default function Quiz() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const fromUrl = decodeAnswers(params.get('r'));
  const [answers, setAnswers] = useState([]);
  const step = answers.length;

  const choose = (optIdx) => {
    const next = [...answers, optIdx];
    if (next.length === QUESTIONS.length) {
      setAnswers([]);
      navigate(`/quiz?r=${encodeAnswers(next)}`);
      return;
    }
    setAnswers(next);
  };
  const back = () => setAnswers((a) => a.slice(0, -1));
  const restart = () => {
    setAnswers([]);
    navigate('/quiz');
  };

  return (
    <div className="tx-page tx-quiz">
      {fromUrl ? (
        <QuizResult indices={fromUrl} onRestart={restart} />
      ) : (
        <QuizStep step={step} onChoose={choose} onBack={back} />
      )}
    </div>
  );
}

/* ── Pregunta ─────────────────────────────────────────── */
function QuizStep({step, onChoose, onBack}) {
  const total = QUESTIONS.length;
  const question = QUESTIONS[step];
  const headingRef = useRef(null);

  // Al cambiar de pregunta, el foco va al título (lectores de pantalla y teclado).
  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  return (
    <section className="tx-quiz__stage" aria-labelledby="quiz-q">
      <div className="tx-quiz__card">
        <div
          className="tx-quiz__progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={step + 1}
          aria-label="Progreso del quiz"
        >
          <span style={{width: `${((step + 1) / total) * 100}%`}} />
        </div>

        <div className="tx-quiz__bar">
          {step > 0 ? (
            <button type="button" className="tx-quiz__back" onClick={onBack}>
              ← Atrás
            </button>
          ) : (
            <span className="tx-quiz__eyebrow">Encuentra tu café</span>
          )}
          <span className="tx-quiz__count" aria-live="polite">
            {step + 1} de {total}
          </span>
        </div>

        <div key={step} className="tx-quiz__pane">
          <h1 id="quiz-q" className="tx-quiz__q" tabIndex={-1} ref={headingRef}>
            {question.q}
          </h1>
          <p className="tx-quiz__hint">{question.hint}</p>
          <div
            className={`tx-quiz__options${question.options.length > 4 ? ' is-six' : ''}`}
          >
            {question.options.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                className="tx-quiz__option"
                onClick={() => onChoose(i)}
              >
                <span className="tx-quiz__option-label">{opt.label}</span>
                <span className="tx-quiz__option-sub">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Resultado ────────────────────────────────────────── */
function QuizResult({indices, onRestart}) {
  const {cafe, alternatives, method} = computeResult(indices);
  const [size, setSize] = useState(SIZES[0].label);
  const [grind, setGrind] = useState(method.grind ?? GRINDS[0]);
  const [copied, setCopied] = useState(false);
  const price = unitPrice(cafe.handle, {size});
  const clubPrice = subscriptionPrice(price);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* sin permiso de portapapeles: el enlace sigue en la barra de direcciones */
    }
  };

  return (
    <section className="tx-quiz__stage tx-quiz__stage--result" aria-labelledby="quiz-result">
      <div className="tx-quiz__result">
        <span className="tx-quiz__eyebrow">Tu café ideal</span>
        <h1 id="quiz-result" className="tx-quiz__q tx-quiz__q--result">
          {cafe.title}
        </h1>

        <article className="tx-quiz__main">
          <div className="tx-quiz__media">
            {cafe.badge ? <span className="tx-quiz__badge">{cafe.badge}</span> : null}
            <img
              src={cafe.image}
              alt={`Bolsa de café ${cafe.title}`}
              width={440}
              height={550}
              loading="eager"
            />
          </div>

          <div className="tx-quiz__info">
            <span className="tx-quiz__tier">{cafe.tierLabel}</span>
            <p className="tx-quiz__notes">{cafe.notes}</p>
            <ul className="tx-quiz__facts">
              <li>{cafe.roast}</li>
              <li>{cafe.altitude}</li>
              <li>{cafe.process}</li>
            </ul>
            <p className="tx-quiz__desc">{cafe.description}</p>

            <div className="tx-quiz__buy">
              {SIZES.length > 1 ? (
              <div className="tx-quiz__field">
                <span className="tx-quiz__label" id="quiz-size-label">
                  Tamaño
                </span>
                <div className="tx-quiz__sizes" role="radiogroup" aria-labelledby="quiz-size-label">
                  {SIZES.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      role="radio"
                      aria-checked={size === s.label}
                      className={`tx-quiz__size${size === s.label ? ' is-on' : ''}`}
                      onClick={() => setSize(s.label)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              ) : null}

              <label className="tx-quiz__field">
                <span className="tx-quiz__label">
                  Molienda{method.grind ? ` · sugerida para ${method.label}` : ''}
                </span>
                <select
                  className="tx-quiz__select"
                  value={grind}
                  onChange={(e) => setGrind(e.target.value)}
                >
                  {GRINDS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>

              <p className="tx-quiz__price">
                {formatCop(price)}
                <small>
                  {' '}
                  o {formatCop(clubPrice)} con el{' '}
                  <Link to="/suscripcion">Club de la Memoria (−15%)</Link>
                </small>
              </p>

              <AddToCartButton
                handle={cafe.handle}
                size={size}
                grind={grind}
                product={{handle: cafe.handle, title: cafe.title, price, unitPrice: price}}
                className="tx-btn tx-quiz__atc"
              >
                Agregar al carrito
              </AddToCartButton>
              <Link className="tx-quiz__more" to={`/products/${cafe.handle}`}>
                Ver todos los detalles del café →
              </Link>
            </div>
          </div>
        </article>

        {method.guide ? (
          <Link
            className="tx-quiz__guide"
            to={`/blog/${method.guide}`}
          >
            <span>
              <strong>Cómo prepararlo en {method.label}</strong>
              <small>Receta paso a paso, con medidas y tiempos</small>
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        ) : null}

        <div className="tx-quiz__alts">
          <h2 className="tx-quiz__alts-title">También podrían gustarte</h2>
          <div className="tx-quiz__alts-grid">
            {alternatives.map((alt) => (
              <Link className="tx-quiz__alt" to={`/products/${alt.handle}`} key={alt.handle}>
                <span className="tx-quiz__tier">{alt.tierLabel}</span>
                <span className="tx-quiz__alt-name">{alt.title}</span>
                <span className="tx-quiz__alt-notes">{alt.notes}</span>
                <span className="tx-quiz__alt-price">{formatCop(alt.price)}</span>
              </Link>
            ))}
          </div>
        </div>

        <SaveByEmail />

        <div className="tx-quiz__actions">
          <button type="button" className="tx-quiz__ghost" onClick={onRestart}>
            Repetir el quiz
          </button>
          <button type="button" className="tx-quiz__ghost" onClick={copyLink}>
            {copied ? '¡Enlace copiado!' : 'Copiar enlace de mi resultado'}
          </button>
        </div>
      </div>
    </section>
  );
}

/* Correo opcional, después del resultado y sin ventanas encima. */
function SaveByEmail() {
  const fetcher = useFetcher();
  const sent = fetcher.data?.ok === true;
  const error = fetcher.data?.ok === false ? fetcher.data.error : null;

  return (
    <aside className="tx-quiz__save" aria-label="Guardar mi resultado">
      {sent ? (
        <p role="status">
          ¡Listo! Tu código es <strong>MIPRIMERTINTO10</strong>: úsalo en el carrito
          para tener 10% de descuento.
        </p>
      ) : (
        <>
          <p>
            <strong>¿Quieres un 10% en tu primer café?</strong> Déjanos tu correo y
            te enviamos el código. Es opcional.
          </p>
          <fetcher.Form method="post" action="/api/newsletter" className="tx-quiz__save-form">
            <label htmlFor="quiz-email" className="sr-only">
              Tu correo electrónico
            </label>
            <input
              id="quiz-email"
              type="email"
              name="email"
              required
              placeholder="tu@correo.com"
              autoComplete="email"
            />
            <button type="submit" className="tx-btn tx-btn--peq" disabled={fetcher.state !== 'idle'}>
              Enviarme el código
            </button>
          </fetcher.Form>
          {error ? (
            <p className="tx-quiz__error" role="alert">
              {error}
            </p>
          ) : null}
        </>
      )}
    </aside>
  );
}
