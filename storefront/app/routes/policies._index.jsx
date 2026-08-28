import {Link} from 'react-router';
import {POLICIES} from '~/data/policies';

export const meta = () => [{title: 'Políticas · MORIAH Café'}];

export default function Policies() {
  return (
    <div className="tx-page">
      <section className="tx-page-section policies">
        <h1 className="tx-display tx-h1" style={{color: 'var(--tx-gold)', marginBottom: '2rem'}}>
          Políticas
        </h1>
        <div>
          {Object.entries(POLICIES).map(([handle, policy]) => (
            <fieldset key={handle}>
              <Link to={`/policies/${handle}`}>{policy.title}</Link>
            </fieldset>
          ))}
        </div>
      </section>
    </div>
  );
}
