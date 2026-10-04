import {redirect} from 'react-router';

/** "Prepara tu café" pasó al blog: cada método (?metodo=…) lleva a su artículo. */
const RECETAS = {
  aeropress: '/blog/como-preparar-cafe-en-aeropress',
  chemex: '/blog/como-preparar-cafe-en-chemex',
  filtrado: '/blog/como-preparar-cafe-en-v60',
  prensa: '/blog/como-preparar-cafe-en-prensa-francesa',
};

/**
 * Las páginas /pages/* ya no existen como contenido: solo quedan redirecciones
 * para que los enlaces viejos sigan funcionando. La página de contacto se quitó;
 * el contacto vive en el pie (WhatsApp, correo e Instagram).
 * @param {import('react-router').LoaderFunctionArgs} args
 */
export function loader({params, request}) {
  if (params.handle === 'prepara-tu-cafe') {
    const metodo = new URL(request.url).searchParams.get('metodo');
    throw redirect(RECETAS[metodo] ?? '/blog?categoria=Preparaci%C3%B3n', 301);
  }
  // "Nuestra historia" pasó a /conocenos.
  if (params.handle === 'nuestra-historia') throw redirect('/conocenos', 301);
  if (params.handle === 'contacto') throw redirect('/', 301);
  throw new Response('Not Found', {status: 404});
}
