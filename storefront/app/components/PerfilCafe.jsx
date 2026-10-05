import {IconLeaf} from '~/components/Icons';

/**
 * Perfil del café antes de comprar: notas de sabor y tres barras (tueste, cuerpo,
 * acidez) en escala de 1 a 5. Los valores salen de `perfil` en app/data/cafes.js.
 */
const BARRAS = [
  {clave: 'tueste', titulo: 'Tueste', extremos: ['Claro', 'Oscuro']},
  {clave: 'cuerpo', titulo: 'Cuerpo', extremos: ['Ligero', 'Alto']},
  {clave: 'acidez', titulo: 'Acidez', extremos: ['Suave', 'Brillante']},
];

export function PerfilCafe({cafe}) {
  const sabor = cafe.flavor ?? cafe.notes;
  const perfil = cafe.perfil;
  if (!sabor && !perfil) return null;

  return (
    <section className="perfil" aria-label="Perfil del café">
      {sabor ? (
        <div className="perfil__sabor">
          <span className="perfil__label">
            <IconLeaf width={16} height={16} aria-hidden="true" /> Perfil de sabor
          </span>
          <p>{sabor}</p>
        </div>
      ) : null}

      {perfil ? (
        <div className="perfil__barras">
          {BARRAS.map((b) => {
            const nivel = perfil[b.clave];
            return (
              <div className="perfil__barra" key={b.clave}>
                <span className="perfil__titulo">{b.titulo}</span>
                <span
                  className="perfil__escala"
                  role="img"
                  aria-label={`${b.titulo}: ${nivel} de 5`}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} data-on={n <= nivel} />
                  ))}
                </span>
                <span className="perfil__extremos" aria-hidden="true">
                  <span>{b.extremos[0]}</span>
                  <span>{b.extremos[1]}</span>
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
