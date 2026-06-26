import {useMemo, useState} from 'react';
import {Link} from 'react-router';
import {CAFES, getCafe} from '~/data/cafes';
import {CafeCard} from '~/components/CafeCard';
import {IconArrowRight} from '~/components/Icons';

export const meta = () => [
  {title: '¿Qué café va contigo? · MORIAH Café'},
  {
    name: 'description',
    content:
      'Responde 3 preguntas y descubre cuál de nuestros cafés de especialidad es para ti.',
  },
];

const QUESTIONS = [
  {
    q: '¿Cómo disfrutas tu café?',
    options: [
      {label: 'Solo, negro', score: {geisha: 2, 'blend-catillo-caturra': 1}},
      {label: 'Con un toque de leche', score: {'bourbon-rosado': 2}},
      {label: 'Depende del día', score: {'blend-catillo-caturra': 2}},
    ],
  },
  {
    q: '¿Qué perfil de sabor te atrae más?',
    options: [
      {label: 'Floral y frutal', score: {geisha: 3}},
      {label: 'Chocolate y dulce', score: {'bourbon-rosado': 3}},
      {label: 'Equilibrado, para todos los días', score: {'blend-catillo-caturra': 3}},
    ],
  },
  {
    q: '¿Para qué ocasión?',
    options: [
      {label: 'Mi ritual diario', score: {'bourbon-rosado': 2}},
      {label: 'Algo especial o para regalar', score: {geisha: 3}},
      {label: 'Quiero explorar y aprender', score: {'blend-catillo-caturra': 2}},
    ],
  },
];

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const result = useMemo(() => {
    if (answers.length < QUESTIONS.length) return null;
    const scores = {};
    answers.forEach((opt) => {
      Object.entries(opt.score).forEach(([h, pts]) => {
        scores[h] = (scores[h] || 0) + pts;
      });
    });
    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
    return getCafe(best) || CAFES[0];
  }, [answers]);

  const choose = (opt) => {
    setAnswers((a) => [...a, opt]);
    setStep((s) => s + 1);
  };
  const restart = () => {
    setAnswers([]);
    setStep(0);
  };

  const progress = Math.round((step / QUESTIONS.length) * 100);

  return (
    <div className="quiz-page">
      <section className="quiz-hero">
        <div className="container">
          <span className="eyebrow" style={{color: 'var(--gold-300)'}}>
            Encuentra tu café
          </span>
          <h1 className="display-h2">¿Qué café va contigo?</h1>
          <p className="lede" style={{color: 'rgba(247,243,234,0.8)'}}>
            Tres preguntas para encontrar tu match perfecto entre nuestros cafés
            de especialidad.
          </p>
        </div>
      </section>

      <div className="container quiz-body">
        {result ? (
          <div className="quiz-result">
            <span className="eyebrow">Tu café ideal</span>
            <h2 className="display-h2" style={{marginBottom: '1.5rem'}}>
              {result.title}
            </h2>
            <div className="quiz-result__card">
              <CafeCard cafe={result} loading="eager" />
            </div>
            <div className="quiz-result__actions">
              <Link className="btn btn--lg" to={`/products/${result.handle}`}>
                Ver este café
                <IconArrowRight className="btn-icon" />
              </Link>
              <button className="btn btn--ghost" onClick={restart}>
                Repetir test
              </button>
            </div>
          </div>
        ) : (
          <div className="quiz-card">
            <div className="quiz-progress" aria-hidden="true">
              <span style={{width: `${progress}%`}} />
            </div>
            <p className="quiz-step">
              Pregunta {step + 1} de {QUESTIONS.length}
            </p>
            <h2 className="quiz-q">{QUESTIONS[step].q}</h2>
            <div className="quiz-options">
              {QUESTIONS[step].options.map((opt) => (
                <button
                  key={opt.label}
                  className="quiz-option"
                  onClick={() => choose(opt)}
                >
                  {opt.label}
                  <IconArrowRight width={18} height={18} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
