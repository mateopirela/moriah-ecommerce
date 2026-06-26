/**
 * Email Templates for Moriah Café — 12-Month Storytelling Campaign
 *
 * These templates define the narrative copy for all 16 emails in the funnel.
 * They're designed to be pasted into Klaviyo (with merge tags for personalization).
 *
 * Email subjects + bodies (plain text + HTML structure).
 */

export const EMAIL_TEMPLATES = {
  welcome_1: {
    subject: 'Yo no aprendí a querer el café. Lo heredé.',
    body: `Hola {{first_name}},

Acabo de recibiír tu primer pedido de café MORIAH, y quería escribirte personalmente.

Hace poco recordé algo que no había pensado en años. Cuando era niño, no entendía por qué ese olor me detenía. Salía de la cocina, llenaba la casa entera... y de repente, todos aparecían. Mi abuela, mis tíos, mi mamá. El tinto no era la excusa para reunirnos. Era la señal.

Crecí. Y un día me di cuenta de que estaba perdiendo algo que no sabía cómo nombrar. No era una casa, ni un pueblo. Era ese olor exacto.

Por eso nací MORIAH.

No es solo un café de especialidad. Es un tributo a la pausa, al color y a la abundancia de esas mañanas que le devuelven a la vida lo que de verdad importa.

Cuando hayas probado tu café, quiero que sientas eso. Que te devuelva el tiempo.

Con cariño,
[Founder Name]
MORIAH Café

P.S. ¿A qué te recuerda a ti el olor a café? Comparte tu historia en {{memory_form_link}}.`,
  },

  welcome_2: {
    subject: 'Bienvenido al Club de la Memoria',
    body: `Hola {{first_name}},

Gracias por tu compra. Eres ahora parte del Club de la Memoria.

Aquí es donde viven las historias reales de nuestros clientes. Cada mes, las más hermosas serán compartidas (con tu permiso) en nuestras redes, en emails, y eventualmente en un libro impreso.

**Tus beneficios como miembro:**
- 15% de descuento en cada entrega de suscripción
- Sorpresas cada mes (historias impresas, stickers coleccionables, regalos)
- Acceso a comunidades privadas y eventos
- La pausa que mereces, cada mes

**Próximo paso:** Si aún no comparte tu historia, te invitamos a hacerlo. Es el corazón de todo lo que hacemos aquí.

{{memory_form_link}}

Con cariño,
[Founder Name]`,
  },

  welcome_3: {
    subject: 'Las historias que hemos recibido esta semana',
    body: `Hola {{first_name}},

Esta semana, tres historias hermosas llegaron a nuestro Banco de Recuerdos. Quería compartirlas contigo.

[Si hay 3+ historias aprobadas, mostrarlas aquí; si no, skip este email e ir al #4]

Cada una cuenta un momento único donde el café fue más que un bebida. Fue conexión.

¿La tuya será la próxima? {{memory_form_link}}

Con gratitud,
[Founder Name]`,
  },

  welcome_4: {
    subject: '¿A qué te recuerda a ti el olor a café?',
    body: `Hola {{first_name}},

Tengo una pregunta para ti.

Cuando hueles café por la mañana, ¿en dónde estás? ¿Qué ves? ¿A quién recuerdas?

Para algunos, es la cocina de la abuela. Para otros, es un viaje de hace años. Para algunos, es tan simple como la paz antes de que el día empiece.

Queremos conocer tu historia.

No tiene que ser larga. Solo honesta. {{memory_form_link}}

Con curiosidad,
[Founder Name]`,
  },

  welcome_5: {
    subject: 'Historias de la Tierra: Conoce a {{producer_name}}',
    body: `Hola {{first_name}},

Hoy quiero que conozcas a {{producer_name}}, la persona cuyas manos cultivaron el café que estás a punto de probar.

{{producer_story}}

Cada grano que llega a tu taza cuenta su historia. Y comenzó aquí, en manos de alguien que lo ama.

Cuando lo tuestas, piensa en {{producer_name}}.

Con respeto,
[Founder Name]`,
  },

  editorial_6: {
    subject: 'Historias de la Costa',
    body: `Hola {{first_name}},

Esta semana estuve en la Costa, visitando las fincas aliadas de MORIAH. Y me acordé de algo que mi abuela siempre decía: "El tiempo aquí pasa diferente."

Tiene razón. En La Esmeralda, en San Rafael, el día avanza lentamente. Los árboles de sombra crecen con cuidado. Las manos que cosechan el café lo hacen con respeto a la tierra.

Es difícil de explicar si nunca estuviste ahí. Pero lo siento cada mañana, cuando huelo el café.

¿Vos?

Con gratitud,
[Founder Name]`,
  },

  editorial_7: {
    subject: 'Cómo nace un café de especialidad',
    body: `Hola {{first_name}},

La mayoría de la gente cree que un café es un café. Que el tueste lo es todo.

Pero comienza mucho antes.

**Cultivo:** Altura (altitud = complejidad). Variedad (genética del grano). Suelo (minerales, pH).

**Cosecha:** Selectiva o masiva. El grano tiene que estar en su punto exacto.

**Procesamiento:** Lavado (limpio), Honey (dulce), Natural (frutal). Cada método revela perfiles diferentes.

**Tostado:** La temperatura y el tiempo conducen el cambio químico que define el sabor.

**Tu rol:** La molienda, el agua, la preparación. Vos terminás la historia.

Un café de especialidad es un diálogo entre la tierra, el cultivador, el tostador, y vos.

Por eso importa.

Con respeto,
[Founder Name]`,
  },

  editorial_8: {
    subject: 'Recuerdos de mi primer tinto',
    body: `Hola {{first_name}},

Hace poco encontré una foto de mi abuelo tomando café en el patio de la casa, hace más de 30 años.

Sus manos sostenían la taza como si fuese el acto más importante del día. Y tal vez lo era.

En una época sin teléfonos, sin prisa medida en notificaciones, el café era el momento en el que la familia se detenía.

Creo que eso es lo que me falta de mi niñez. No la casa, ni el clima. La pausa.

MORIAH existe porque quiero devolverte eso.

¿Qué recuerdas vos?

Con cariño,
[Founder Name]`,
  },

  newsletter_9_fanzine: {
    subject: 'Memorias de la Mesa: [Month]',
    body: `Hola {{first_name}},

Este mes, recolectamos historias hermosas en nuestro Banco de Recuerdos.

Aquí están las tres más emotivas:

[Mostrar: Historia 1 (50-100 palabras), Historia 2, Historia 3 + nombres + ciudades]

Cada historia es un recordatorio: el café no es combustible. Es conexión.

¿Tu historia será la del próximo mes?

{{memory_form_link}}

Con gratitud,
[Founder Name]

---
P.S. Si solicitaste una suscripción al Club de la Memoria, tu primer paquete llega con una sorpresa especial adentro.`,
  },

  newsletter_10_producer: {
    subject: 'Las manos que cultivan tu café',
    body: `Hola {{first_name}},

Este mes, queremos que conozcas a la familia detrás de tu café.

[Mostrar: Foto del productor + nombre + historia (150 palabras) + ubicación + altitud]

Cada mes, un 5% de nuestras ventas va directamente a proyectos de mejora comunitaria en la zona de cultivo. Este mes, [proyecto específico].

Cuando tomes tu taza, sabrás exactamente a quién estás apoyando.

Con respeto,
[Founder Name]`,
  },

  newsletter_11_howto: {
    subject: 'Método Chemex: Ritual de paciencia',
    body: `Hola {{first_name}},

Hoy quería compartirte mi forma favorita de preparar café: la Chemex.

No es por la eficiencia. Es por el ritual.

**Lo que necesitás:**
- Chemex (o cualquier método de goteo)
- Molinillo (muele justo antes)
- Agua caliente (195-205°F)
- 1:15 ratio (café:agua, en peso)

**El ritual:**
1. Calienta el agua
2. Muele el café (medio, como arena)
3. Vierte el agua en espiral, lentamente
4. Pausa. Respira.
5. Continúa el vertido.
6. Espera. Son 3-4 minutos de pausa verdadera.
7. Vierte en tu taza.
8. Detente. Observa el color. Huele.
9. Bebe lentamente.

La magia está en la pausa.

Con cariño,
[Founder Name]`,
  },

  newsletter_12_reflection: {
    subject: 'Recuerdos de enero: Retrospectiva',
    body: `Hola {{first_name}},

Hace 30 días, lanzamos #MiPrimerTinto. Y pasaron cosas hermosas.

Recibimos historias desde Bogotá, Medellín, Cali. De abuelas, de nietos, de personas que no se habían visto en años y que el aroma del café reunió en la mesa.

Una mujer escribió: "Mi hija por fin se sentó a hablar conmigo durante 20 minutos. Sin teléfono. Mientras tomábamos café."

Eso es MORIAH.

No es el café. Es el momento.

Gracias por ser parte.

Con gratitud,
[Founder Name]`,
  },

  retail_13: {
    subject: 'Historias de las tiendas',
    body: `Hola {{first_name}},

Este mes, MORIAH llegó a 300+ tiendas en toda Colombia.

Y algo inesperado pasó. Gente que nunca había pisado nuestro sitio web, que vio el café en una góndola, decidió probar.

Nos escribieron mensajes diciendo cosas como:
"Vi el nombre 'Moriah' y algo me llamó."
"La foto de la bolsa me trajo un recuerdo."
"Compré dos: una para mí, otra para mi mamá."

La historia está creciendo.

Ahora, desde las tiendas, también recolectamos memorias. Si visitaste una Estación de la Memoria, gracias por compartir.

Con cariño,
[Founder Name]`,
  },

  final_14: {
    subject: 'Mensajes desde la comunidad',
    body: `Hola {{first_name}},

Esta semana, el Banco de Recuerdos llegó a 1.000 historias.

No es un número. Son 1.000 momentos donde el café fue puente.

Hoy quería compartir tres que me emocionaron especialmente:

[Mostrar: 3 historias + nombres + ciudades + 50-100 palabras cada una]

Cada una es una prueba de que esto funciona.

Gracias por ser parte.

Con gratitud,
[Founder Name]`,
  },

  annual_15: {
    subject: 'Un año de memorias',
    body: `Hola {{first_name}},

Hace exactamente un año, lanzamos MORIAH.

Y hoy, publicamos el "Libro de la Memoria Cafetera" — una compilación de las 50 mejores historias del año, ilustradas, con fotos de los productores y sus fincas.

Leerlo es descubrir que el café nunca fue sobre el café.

Fue siempre sobre los momentos donde dejas de hacer, y empezás a ser.

El libro está disponible como descarga gratis para todos los miembros del Club de la Memoria. Y como edición impresa, limitada, para coleccionar.

Gracias por hacer esto posible.

Con infinita gratitud,
[Founder Name]`,
  },

  annual_16: {
    subject: 'Estado del Tinto: 2025 en números',
    body: `Hola {{first_name}},

Como es costumbre, quería compartirte los números de este año.

**Lo que pasó:**
- 5.000+ historias en el Banco de Recuerdos
- 25.000 miembros del Club de la Memoria
- 300+ tiendas en toda Colombia
- 8 episodios de podcast "La Pausa"
- 1 libro impreso (500 copias)
- 1 evento anual (Día del Tinto de Verdad) con 500+ asistentes

**Lo que aprendimos:**
El café no es un commodity cuando lo tratas como una conexión.

**Lo que viene:**
Más historias. Más comunidad. Más momentos donde el tiempo se detiene.

Gracias por ser parte.

2026 será mucho más.

Con cariño,
[Founder Name]`,
  },
};

/**
 * Helper: Get email template by key
 */
export function getEmailTemplate(key) {
  return EMAIL_TEMPLATES[key] || null;
}

/**
 * Helper: List all email keys (for admin/dashboard)
 */
export function listEmailTemplates() {
  return Object.keys(EMAIL_TEMPLATES);
}
