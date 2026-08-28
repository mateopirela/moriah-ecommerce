import {Link, useLoaderData} from 'react-router';
import {getPolicy} from '~/data/policies';

/** @type {import('react-router').MetaFunction} */
export const meta = ({data}) => [{title: `${data?.policy.title ?? 'Políticas'} · MORIAH Café`}];

/** @param {import('react-router').LoaderFunctionArgs} args */
export function loader({params}) {
  const policy = getPolicy(params.handle);
  if (!policy) throw new Response('Política no encontrada', {status: 404});
  return {policy};
}

export default function Policy() {
  const {policy} = useLoaderData();
  return (
    <div className="tx-page">
      <section className="tx-page-section policy">
        <Link to="/policies">← Todas las políticas</Link>
        <h1 className="tx-display tx-h1" style={{color: 'var(--tx-gold)', margin: '1rem 0 0.5rem'}}>
          {policy.title}
        </h1>
        <p className="muted">Última actualización: {policy.updated}</p>
        <div className="tx-lede" style={{maxWidth: '70ch', lineHeight: 1.8}}>
          {policy.sections.map((s) => (
            <section key={s.heading} style={{marginTop: '1.5rem'}}>
              <h2 className="display-h3">{s.heading}</h2>
              <p>{s.body}</p>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
