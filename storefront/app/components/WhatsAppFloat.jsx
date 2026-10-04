import {useLocation} from 'react-router';
import {CONTACT, whatsappUrl} from '~/data/contact';
import {IconWhatsapp} from '~/components/Icons';

/** Rutas donde no se muestra: el pago no debe tener distracciones. */
const OCULTAR = ['/checkout', '/suscripcion/gestionar'];

/**
 * Botón flotante de WhatsApp. Es ayuda para elegir o resolver dudas, no un
 * segundo botón de compra: la compra se hace en el sitio. El mensaje ya trae el
 * contexto (el café que estás viendo) para que la conversación empiece con algo.
 * En móvil solo se ve el ícono; en pantallas grandes lleva texto.
 */
export function WhatsAppFloat() {
  const {pathname} = useLocation();
  if (!CONTACT.hasWhatsapp || OCULTAR.some((r) => pathname.startsWith(r))) return null;

  const producto = pathname.startsWith('/products/') ? pathname.split('/')[2] : null;
  const mensaje = producto
    ? `Hola MORIAH, tengo una pregunta sobre ${producto.replace(/-/g, ' ')}.`
    : 'Hola MORIAH, quiero ayuda para elegir mi café.';

  return (
    <a
      className={`wa-float${producto ? ' wa-float--sube' : ''}`}
      href={whatsappUrl(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <span className="wa-float__icono" aria-hidden="true">
        <IconWhatsapp width={26} height={26} />
      </span>
      <span className="wa-float__texto">¿Te ayudamos a elegir?</span>
    </a>
  );
}
