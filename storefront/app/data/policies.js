/**
 * Políticas de la tienda (contenido local). Wompi exige que el comercio
 * publique términos, política de datos y política de devoluciones.
 * ⚠️ Texto base editable: revísalo con tu asesor legal antes de lanzar.
 */
export const POLICIES = {
  'shipping-policy': {
    title: 'Política de envíos',
    updated: '2026-08-28',
    sections: [
      {
        heading: 'Cobertura y tiempos',
        body: 'Enviamos a todo Colombia. Bogotá: 2–3 días hábiles. Resto del país: 3–5 días hábiles. Los pedidos se despachan de lunes a viernes; los pedidos recibidos después de las 2:00 p. m. o en fin de semana se procesan el siguiente día hábil.',
      },
      {
        heading: 'Costo del envío',
        body: 'El envío tiene un costo fijo de $12.000 y es gratis en pedidos desde $100.000 (antes de descuentos). El costo se muestra siempre en el carrito antes de pagar.',
      },
      {
        heading: 'Suscripciones del Club de la Memoria',
        body: 'Cada entrega del Club se despacha dentro de los 2 días hábiles siguientes al cobro. Puedes pausar, cambiar la frecuencia o cancelar en cualquier momento desde el enlace de gestión que recibes por correo.',
      },
      {
        heading: 'Seguimiento',
        body: 'Cuando tu pedido salga de la tostaduría te enviaremos la guía de la transportadora al correo registrado.',
      },
    ],
  },
  'refund-policy': {
    title: 'Cambios y devoluciones',
    updated: '2026-08-28',
    sections: [
      {
        heading: 'Café',
        body: 'Por tratarse de un alimento, no aceptamos devoluciones de café abierto. Si tu pedido llegó dañado, incompleto o con un producto distinto al que compraste, escríbenos dentro de los 5 días siguientes a la entrega a cafemoriahshop@gmail.com con fotos y el número de pedido: lo reemplazamos o te devolvemos el dinero.',
      },
      {
        heading: 'Merch',
        body: 'Aceptamos cambios de merch sin uso, con etiquetas y empaque original, dentro de los 30 días siguientes a la entrega. El costo del envío de vuelta corre por cuenta del cliente salvo defecto de fábrica.',
      },
      {
        heading: 'Retracto',
        body: 'Conforme al artículo 47 de la Ley 1480 de 2011 puedes ejercer el derecho de retracto dentro de los 5 días hábiles siguientes a la entrega, siempre que el producto no sea perecedero y esté sin uso.',
      },
      {
        heading: 'Reembolsos',
        body: 'Los reembolsos se procesan a través de Wompi al mismo medio de pago en un plazo de 5 a 15 días hábiles, según la entidad financiera.',
      },
    ],
  },
  'privacy-policy': {
    title: 'Política de tratamiento de datos personales',
    updated: '2026-08-28',
    sections: [
      {
        heading: 'Responsable',
        body: 'MORIAH Café, Bogotá, Colombia. Correo: cafemoriahshop@gmail.com.',
      },
      {
        heading: 'Datos que recogemos',
        body: 'Nombre, correo, teléfono y dirección de envío para procesar tus pedidos; historias que compartes voluntariamente en #MiPrimerTinto; y datos de navegación anónimos si aceptas analítica. Los datos de tu tarjeta los procesa directamente Wompi (Bancolombia): nunca pasan por nuestros servidores.',
      },
      {
        heading: 'Finalidades',
        body: 'Gestionar y entregar pedidos y suscripciones, enviarte confirmaciones y novedades (puedes darte de baja en cualquier momento), atender tus solicitudes y cumplir obligaciones legales.',
      },
      {
        heading: 'Tus derechos',
        body: 'De acuerdo con la Ley 1581 de 2012 puedes conocer, actualizar, rectificar y suprimir tus datos, y revocar la autorización, escribiendo a cafemoriahshop@gmail.com.',
      },
    ],
  },
  'terms-of-service': {
    title: 'Términos y condiciones',
    updated: '2026-08-28',
    sections: [
      {
        heading: 'Compras',
        body: 'Los precios se expresan en pesos colombianos (COP) e incluyen IVA cuando aplica. El pago se procesa a través de Wompi con Nequi, PSE o tarjetas débito y crédito. El pedido se confirma cuando Wompi aprueba la transacción.',
      },
      {
        heading: 'Club de la Memoria (suscripción)',
        body: 'Al suscribirte autorizas cobros recurrentes a la tarjeta registrada con la frecuencia elegida y con el 15% de descuento sobre el precio de lista. Recibes un correo antes de cada entrega y puedes pausar, cambiar o cancelar en cualquier momento; los cambios aplican desde el siguiente cobro. Si un cobro es rechazado lo reintentamos hasta 3 veces y luego pausamos la suscripción.',
      },
      {
        heading: 'Disponibilidad',
        body: 'Los micro-lotes son ediciones limitadas. Si un producto se agota después de tu compra te contactaremos para ofrecerte un reemplazo o el reembolso total.',
      },
      {
        heading: 'Contacto',
        body: 'Para cualquier consulta escríbenos a cafemoriahshop@gmail.com o por WhatsApp.',
      },
    ],
  },
};

export const POLICY_HANDLES = Object.keys(POLICIES);

/** @param {string} handle */
export function getPolicy(handle) {
  return POLICIES[handle] ? {handle, ...POLICIES[handle]} : null;
}
