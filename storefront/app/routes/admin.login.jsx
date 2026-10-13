import {Form, data, redirect, useActionData, useLoaderData, useNavigation} from 'react-router';
import {adminConfigured, checkAdminPassword, isAdmin, loginHeaders} from '~/lib/admin.server';
import adminStyles from '~/styles/admin.css?url';

export const links = () => [{rel: 'stylesheet', href: adminStyles}];

export const meta = () => [
  {title: 'Acceso · MORIAH Admin'},
  {name: 'robots', content: 'noindex, nofollow'},
];

/** @param {import('react-router').LoaderFunctionArgs} args */
export async function loader({request}) {
  if (await isAdmin(request)) throw redirect('/admin/pedidos');
  return {configured: adminConfigured()};
}

/** @param {import('react-router').ActionFunctionArgs} args */
export async function action({request}) {
  const form = await request.formData();
  if (!checkAdminPassword(String(form.get('password') ?? ''))) {
    // Frena un poco los intentos a ciegas.
    await new Promise((r) => setTimeout(r, 1000));
    return data({error: 'Contraseña incorrecta.'}, {status: 401});
  }
  return redirect('/admin/pedidos', {headers: await loginHeaders(request)});
}

export default function AdminLogin() {
  const {configured} = useLoaderData();
  const actionData = useActionData();
  const busy = useNavigation().state !== 'idle';

  return (
    <div className="admin container">
      <section className="admin-login">
        <span className="eyebrow">MORIAH Admin</span>
        <h1 className="display-h2">Entrar</h1>
        {configured ? (
          <Form method="post" className="admin-login__form">
            <div className={`field${actionData?.error ? ' field--error' : ''}`}>
              <label htmlFor="admin-password">Contraseña</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                autoFocus
              />
              {actionData?.error ? <p className="field__error">{actionData.error}</p> : null}
            </div>
            <button className="btn btn--lg" type="submit" disabled={busy}>
              {busy ? 'Entrando…' : 'Entrar'}
            </button>
          </Form>
        ) : (
          <p className="muted">
            El panel no está activo: falta la variable <code>ADMIN_PASSWORD</code> en Vercel.
          </p>
        )}
      </section>
    </div>
  );
}
