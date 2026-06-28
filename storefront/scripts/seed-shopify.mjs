/**
 * MORIAH — seed del catálogo en Shopify vía Admin API (client credentials).
 *
 * Crea: 3 cafés (variantes Gramaje × Molienda, metafields de ficha técnica,
 * imagen), el Kit Tres Orígenes (−15%), la colección `cafes` y publica todo
 * en todos los canales de venta (Online Store + Hydrogen).
 *
 * Uso:
 *   SHOP=xxx.myshopify.com CLIENT_ID=... CLIENT_SECRET=... node scripts/seed-shopify.mjs
 *
 * Idempotente: si un producto/colección ya existe (mismo handle), lo actualiza.
 */
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const SHOP = process.env.SHOP;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_VERSION = '2025-01';

if (!SHOP || !CLIENT_ID || !CLIENT_SECRET) {
  console.error('Faltan SHOP / CLIENT_ID / CLIENT_SECRET en el entorno.');
  process.exit(1);
}

const IMAGES_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'public',
  'images',
);

// --- Catálogo (espejo de app/data/cafes.js) -----------------------------
const SIZES = [
  {label: '340 g', mult: 1},
  {label: '500 g', mult: 1.4},
];
const GRINDS = [
  'Grano entero',
  'Molida media (goteo / V60)',
  'Molida fina (espresso)',
  'Molida gruesa (prensa francesa)',
];
const round100 = (n) => Math.round(n / 100) * 100;

const CAFES = [
  {
    handle: 'bourbon-rosado',
    title: 'Bourbon Rosado',
    price: 45000,
    tags: ['De la casa', '100% Arábica', 'Comercio Justo'],
    description:
      'Un Bourbon Rosado de la Finca La Esmeralda con un perfil dulce y cítrico. Notas de chocolate y piel de naranja sobre una acidez de grosella negra y gaseosa de toronja. Tueste medio que resalta su cuerpo y equilibrio.',
    metafields: {
      flavor_notes: 'Chocolate, Piel de Naranja, Grosella Negra, Gaseosa de Toronja',
      origin: 'Finca La Esmeralda, Colombia',
      roast: 'Tueste Medio',
      process: 'Lavado',
      altitude: '1.700 – 1.850 msnm',
      variety: 'Bourbon Rosado',
      producer: 'Familia caficultora aliada · Finca La Esmeralda',
    },
  },
  {
    handle: 'blend-catillo-caturra',
    title: 'Blend Castillo Caturra',
    price: 52000,
    tags: ['Origen especial', '100% Arábica', 'Comercio Justo'],
    description:
      'Un blend de variedades Castillo y Caturra de la Finca La Esmeralda. Dulce y redondo, con notas de chocolate, piel de naranja y uva. Proceso honey y tueste medio, ideal para el ritual diario.',
    metafields: {
      flavor_notes: 'Chocolate, Piel de Naranja, Uva',
      origin: 'Finca La Esmeralda, Colombia',
      roast: 'Tueste Medio',
      process: 'Honey',
      altitude: '1.750 – 1.900 msnm',
      variety: 'Castillo y Caturra',
      producer: 'Familia caficultora aliada · Finca La Esmeralda',
    },
  },
  {
    handle: 'geisha',
    title: 'Geisha',
    price: 75000,
    tags: ['Edición Limitada', 'Micro-lote', 'Orgánico'],
    description:
      'Nuestra edición más exclusiva. Una Geisha de la Finca San Rafael, floral y herbal, con notas de flor de Jamaica, tomillo y toronjil. Tueste claro para preservar su complejidad aromática. Edición limitada.',
    metafields: {
      flavor_notes: 'Flor de Jamaica, Tomillo, Toronjil',
      origin: 'Finca San Rafael, Colombia',
      roast: 'Tueste Claro',
      process: 'Lavado',
      altitude: '1.850 – 2.000 msnm',
      variety: 'Geisha',
      producer: 'Finca San Rafael',
    },
  },
];

const KIT_PRICE = round100((45000 + 52000 + 75000) * 0.85); // 146.200
const KIT_COMPARE_AT = 45000 + 52000 + 75000; // 172.000

// --- Merch (espejo de app/data/merch.js) --------------------------------
// Productos simples (variante única) "Para vestir y para el ritual".
const MERCH = [
  {
    handle: 'caja-el-legado',
    title: 'Caja El Legado',
    price: 220000,
    image: 'kit-bolsas.webp',
    tags: ['Regalo insignia', 'Caja regalo'],
    description:
      'El nombre definitivo para tu producto estrella de regalo. Al entregar el molino, el pocillo y el café, estás entregando la herramienta para heredar una tradición.',
  },
  {
    handle: 'pocillo-de-verdad',
    title: 'Pocillo De Verdad',
    price: 58000,
    image: 'producto-bolsa.webp',
    tags: ['El ritual', 'Pocillos'],
    description:
      'Inspirado en la promesa del manifiesto de "compartir un tinto de verdad". No es un mug genérico de oficina, es el contenedor de un ritual real.',
  },
  {
    handle: 'tote-bag-abundancia',
    title: 'Tote Bag Abundancia',
    price: 75000,
    image: 'cafe-cafes.webp',
    tags: ['Para cargar lo que importa', 'Accesorios'],
    description:
      'Un guiño sutil a "la abundancia de esas mañanas", ideal para cargar todo lo que importa en el día a día.',
  },
  {
    handle: 'gorra-la-pausa',
    title: 'Gorra La Pausa',
    price: 120000,
    image: 'tostado-moriah.webp',
    tags: ['Baja la velocidad', 'Para vestir'],
    description:
      'El accesorio perfecto para cubrirse del sol y recordarse a uno mismo (y al mundo) que está bien bajar la velocidad.',
  },
  {
    handle: 'sueter-el-afan',
    title: 'Suéter El Afán',
    price: 185000,
    image: 'equipo-moriah.webp',
    tags: ['Desconéctate', 'Para vestir'],
    description:
      'La ironía perfecta; la prenda que te pones precisamente para protegerte y desconectarte del afán de las pantallas y las reuniones de la ciudad.',
  },
];

// --- Suscripción: Club de la Memoria (selling plans) --------------------
const SUBSCRIPTION = {
  groupName: 'Club de la Memoria',
  merchantCode: 'club-de-la-memoria',
  discountPercent: 15,
  // (intervalo, cantidad) por cada frecuencia ofrecida.
  options: [
    {label: 'Cada 2 semanas', interval: 'WEEK', count: 2},
    {label: 'Cada 4 semanas', interval: 'WEEK', count: 4},
    {label: 'Cada 6 semanas', interval: 'WEEK', count: 6},
  ],
};

// --- Helpers -------------------------------------------------------------
let TOKEN = null;

async function getToken() {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`Token exchange falló: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.access_token;
}

async function gql(query, variables = {}) {
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: JSON.stringify({query, variables}),
  });
  const data = await res.json();
  if (data.errors) throw new Error(`GraphQL: ${JSON.stringify(data.errors)}`);
  return data.data;
}

function userErrors(payload, label) {
  const errs = payload?.userErrors ?? [];
  if (errs.length) throw new Error(`${label}: ${JSON.stringify(errs)}`);
}

// --- Productos -----------------------------------------------------------
function cafeVariants(basePrice) {
  const variants = [];
  for (const size of SIZES) {
    for (const grind of GRINDS) {
      variants.push({
        optionValues: [
          {optionName: 'Gramaje', name: size.label},
          {optionName: 'Molienda', name: grind},
        ],
        price: String(round100(basePrice * size.mult)),
      });
    }
  }
  return variants;
}

async function upsertProduct(input) {
  // productSet crea por defecto; para actualizar hay que pasar el id.
  const existing = await gql(
    `query($q: String!) { products(first: 1, query: $q) { nodes { id handle } } }`,
    {q: `handle:${input.handle}`},
  );
  const id = existing.products.nodes[0]?.id;
  const data = await gql(
    `mutation productSet($input: ProductSetInput!) {
      productSet(input: $input, synchronous: true) {
        product { id handle title }
        userErrors { field message }
      }
    }`,
    {input: id ? {...input, id} : input},
  );
  userErrors(data.productSet, `productSet ${input.handle}`);
  return data.productSet.product;
}

async function createCafe(cafe) {
  return upsertProduct({
    handle: cafe.handle,
    title: cafe.title,
    descriptionHtml: `<p>${cafe.description}</p>`,
    vendor: 'MORIAH Café',
    status: 'ACTIVE',
    tags: cafe.tags,
    productOptions: [
      {name: 'Gramaje', position: 1, values: SIZES.map((s) => ({name: s.label}))},
      {name: 'Molienda', position: 2, values: GRINDS.map((g) => ({name: g}))},
    ],
    variants: cafeVariants(cafe.price),
    metafields: Object.entries(cafe.metafields).map(([key, value]) => ({
      namespace: 'custom',
      key,
      type: 'single_line_text_field',
      value,
    })),
  });
}

async function createKit() {
  return upsertProduct({
    handle: 'kit-tres-origenes',
    title: 'Kit Tres Orígenes',
    descriptionHtml:
      '<p>Los tres cafés MORIAH en un solo kit: Bourbon Rosado, Blend Castillo Caturra y Geisha (340 g cada uno). La forma perfecta de recorrer nuestros orígenes —y de regalar— con 15% de descuento.</p>',
    vendor: 'MORIAH Café',
    status: 'ACTIVE',
    tags: ['15% DCTO', 'Kit de degustación', 'Ideal para regalar'],
    productOptions: [{name: 'Title', position: 1, values: [{name: 'Default Title'}]}],
    variants: [
      {
        optionValues: [{optionName: 'Title', name: 'Default Title'}],
        price: String(KIT_PRICE),
        compareAtPrice: String(KIT_COMPARE_AT),
      },
    ],
  });
}

async function createMerch(item) {
  return upsertProduct({
    handle: item.handle,
    title: item.title,
    descriptionHtml: `<p>${item.description}</p>`,
    vendor: 'MORIAH Café',
    status: 'ACTIVE',
    productType: 'Merch',
    tags: item.tags,
    productOptions: [{name: 'Title', position: 1, values: [{name: 'Default Title'}]}],
    variants: [
      {
        optionValues: [{optionName: 'Title', name: 'Default Title'}],
        price: String(item.price),
      },
    ],
  });
}

// --- Imágenes (staged upload → productCreateMedia) ------------------------
async function uploadImage(productId, filename, alt) {
  const filePath = path.join(IMAGES_DIR, filename);
  const buffer = await readFile(filePath);

  const staged = await gql(
    `mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets { url resourceUrl parameters { name value } }
        userErrors { field message }
      }
    }`,
    {
      input: [
        {
          filename,
          mimeType: 'image/webp',
          httpMethod: 'POST',
          resource: 'IMAGE',
        },
      ],
    },
  );
  userErrors(staged.stagedUploadsCreate, 'stagedUploadsCreate');
  const target = staged.stagedUploadsCreate.stagedTargets[0];

  const form = new FormData();
  for (const p of target.parameters) form.append(p.name, p.value);
  form.append('file', new Blob([buffer], {type: 'image/webp'}), filename);
  const up = await fetch(target.url, {method: 'POST', body: form});
  if (!up.ok) throw new Error(`Upload ${filename} falló: ${up.status} ${await up.text()}`);

  const media = await gql(
    `mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media { ... on MediaImage { id } }
        mediaUserErrors { field message }
      }
    }`,
    {
      productId,
      media: [{originalSource: target.resourceUrl, alt, mediaContentType: 'IMAGE'}],
    },
  );
  const errs = media.productCreateMedia.mediaUserErrors;
  if (errs.length) throw new Error(`productCreateMedia: ${JSON.stringify(errs)}`);
}

async function hasMedia(productId) {
  const data = await gql(
    `query($id: ID!) { product(id: $id) { media(first: 1) { nodes { id } } } }`,
    {id: productId},
  );
  return data.product.media.nodes.length > 0;
}

// --- Definiciones de metafields (expuestas al Storefront API) -------------
const METAFIELD_DEFS = [
  ['flavor_notes', 'Notas de sabor'],
  ['origin', 'Origen'],
  ['roast', 'Tueste'],
  ['process', 'Proceso'],
  ['altitude', 'Altitud'],
  ['variety', 'Variedad'],
  ['producer', 'Productor'],
];

async function ensureMetafieldDefinitions() {
  for (const [key, name] of METAFIELD_DEFS) {
    const res = await gql(
      `mutation metafieldDefinitionCreate($definition: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(definition: $definition) {
          createdDefinition { id }
          userErrors { code message }
        }
      }`,
      {
        definition: {
          namespace: 'custom',
          key,
          name,
          type: 'single_line_text_field',
          ownerType: 'PRODUCT',
          access: {storefront: 'PUBLIC_READ'},
        },
      },
    );
    const errs = res.metafieldDefinitionCreate.userErrors.filter(
      (e) => e.code !== 'TAKEN', // ya existe → ok
    );
    if (errs.length) throw new Error(`metafieldDefinition ${key}: ${JSON.stringify(errs)}`);
  }
}

// --- Colecciones ---------------------------------------------------------
/** Crea (o reutiliza) una colección manual y le agrega los productos dados. */
async function upsertCollection({handle, title, descriptionHtml, productIds}) {
  const existing = await gql(
    `query($handle: String!) { collectionByHandle(handle: $handle) { id } }`,
    {handle},
  );
  let collectionId = existing.collectionByHandle?.id;

  if (!collectionId) {
    const created = await gql(
      `mutation collectionCreate($input: CollectionInput!) {
        collectionCreate(input: $input) {
          collection { id }
          userErrors { field message }
        }
      }`,
      {input: {handle, title, descriptionHtml}},
    );
    userErrors(created.collectionCreate, 'collectionCreate');
    collectionId = created.collectionCreate.collection.id;
  }

  if (productIds.length) {
    const added = await gql(
      `mutation collectionAddProducts($id: ID!, $productIds: [ID!]!) {
        collectionAddProducts(id: $id, productIds: $productIds) {
          collection { id }
          userErrors { field message }
        }
      }`,
      {id: collectionId, productIds},
    );
    const errs = added.collectionAddProducts.userErrors.filter(
      (e) => !/already exists/i.test(e.message),
    );
    if (errs.length) throw new Error(`collectionAddProducts ${handle}: ${JSON.stringify(errs)}`);
  }
  return collectionId;
}

// --- Suscripción: selling plan group (Club de la Memoria) ----------------
/**
 * Crea el selling plan group "Club de la Memoria" con un plan por frecuencia
 * (−15% recurrente) y lo asocia a los cafés. Idempotente por merchantCode.
 *
 * NOTA: crear los planes habilita la opción "Suscríbete y ahorra" en el
 * catálogo, pero el COBRO recurrente real lo gestiona una app de suscripciones
 * (contratos). Recomendado: instalar la app gratuita "Shopify Subscriptions".
 */
async function upsertSellingPlanGroup(cafeProductIds) {
  const existing = await gql(
    `query($q: String!) { sellingPlanGroups(first: 1, query: $q) { nodes { id } } }`,
    {q: `merchant_code:${SUBSCRIPTION.merchantCode}`},
  ).catch(() => ({sellingPlanGroups: {nodes: []}}));
  if (existing.sellingPlanGroups?.nodes?.[0]?.id) {
    return existing.sellingPlanGroups.nodes[0].id;
  }

  const plans = SUBSCRIPTION.options.map((o) => ({
    name: `${SUBSCRIPTION.groupName} · ${o.label}`,
    options: [o.label],
    category: 'SUBSCRIPTION',
    billingPolicy: {
      recurring: {interval: o.interval, intervalCount: o.count},
    },
    deliveryPolicy: {
      recurring: {interval: o.interval, intervalCount: o.count},
    },
    pricingPolicies: [
      {
        fixed: {
          adjustmentType: 'PERCENTAGE',
          adjustmentValue: {percentage: SUBSCRIPTION.discountPercent},
        },
      },
    ],
  }));

  const created = await gql(
    `mutation sellingPlanGroupCreate($input: SellingPlanGroupInput!, $resources: SellingPlanGroupResourceInput) {
      sellingPlanGroupCreate(input: $input, resources: $resources) {
        sellingPlanGroup { id }
        userErrors { field message }
      }
    }`,
    {
      input: {
        name: SUBSCRIPTION.groupName,
        merchantCode: SUBSCRIPTION.merchantCode,
        options: ['Frecuencia de entrega'],
        sellingPlansToCreate: plans,
      },
      resources: {productIds: cafeProductIds},
    },
  );
  userErrors(created.sellingPlanGroupCreate, 'sellingPlanGroupCreate');
  return created.sellingPlanGroupCreate.sellingPlanGroup.id;
}

// --- Publicación en canales ----------------------------------------------
async function publishAll(ids) {
  const pubs = await gql(`query { publications(first: 20) { nodes { id name } } }`);
  const publications = pubs.publications.nodes;
  console.log('Canales:', publications.map((p) => p.name).join(' · '));
  for (const id of ids) {
    const res = await gql(
      `mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
          userErrors { field message }
        }
      }`,
      {id, input: publications.map((p) => ({publicationId: p.id}))},
    );
    const errs = res.publishablePublish.userErrors.filter(
      (e) => !/already published/i.test(e.message),
    );
    if (errs.length) throw new Error(`publish ${id}: ${JSON.stringify(errs)}`);
  }
}

// --- Main ------------------------------------------------------------------
async function main() {
  console.log('1/7 Autenticando…');
  TOKEN = await getToken();

  console.log('2/7 Definiendo metafields (visibles en storefront)…');
  await ensureMetafieldDefinitions();

  console.log('3/7 Creando cafés…');
  const cafeIds = [];
  for (const cafe of CAFES) {
    const product = await createCafe(cafe);
    cafeIds.push(product.id);
    console.log(`  ✓ ${product.title} (${product.handle})`);
    if (!(await hasMedia(product.id))) {
      await uploadImage(product.id, 'producto-bolsa.webp', `${product.title} · MORIAH Café`);
      console.log('    ✓ imagen');
    }
  }

  console.log('4/7 Creando Kit Tres Orígenes…');
  const kit = await createKit();
  console.log(`  ✓ ${kit.title} ($${KIT_PRICE} / antes $${KIT_COMPARE_AT})`);
  if (!(await hasMedia(kit.id))) {
    await uploadImage(kit.id, 'kit-bolsas.webp', 'Kit Tres Orígenes · MORIAH Café');
    console.log('    ✓ imagen');
  }

  console.log('5/7 Creando merch…');
  const merchIds = [];
  for (const item of MERCH) {
    const product = await createMerch(item);
    merchIds.push(product.id);
    console.log(`  ✓ ${product.title} (${product.handle})`);
    if (!(await hasMedia(product.id))) {
      await uploadImage(product.id, item.image, `${product.title} · MORIAH Café`);
      console.log('    ✓ imagen');
    }
  }

  console.log('6/7 Creando colecciones y suscripción…');
  const cafesCol = await upsertCollection({
    handle: 'cafes',
    title: 'Cafés',
    descriptionHtml:
      '<p>Ediciones de especialidad y blends únicos, cultivados con intención y respeto por la tierra. Café 100% colombiano.</p>',
    productIds: [...cafeIds, kit.id],
  });
  const merchCol = await upsertCollection({
    handle: 'merch',
    title: 'Merch',
    descriptionHtml:
      '<p>Para vestir y para el ritual. El manifiesto MORIAH hecho objeto.</p>',
    productIds: merchIds,
  });
  const allCol = await upsertCollection({
    handle: 'all',
    title: 'Todo',
    descriptionHtml: '<p>Todo el catálogo MORIAH: cafés, kits y merch.</p>',
    productIds: [...cafeIds, kit.id, ...merchIds],
  });
  console.log('  ✓ colecciones: cafes · merch · all');

  let planGroupId = null;
  try {
    planGroupId = await upsertSellingPlanGroup(cafeIds);
    console.log(`  ✓ suscripción "Club de la Memoria" (${planGroupId})`);
  } catch (err) {
    console.warn(
      `  ⚠️  No se pudo crear el selling plan group (${err.message}).\n` +
        '     Suele requerir scope de suscripciones / app "Shopify Subscriptions". ' +
        'El resto del catálogo quedó creado correctamente.',
    );
  }

  console.log('7/7 Publicando en canales de venta…');
  await publishAll([
    ...cafeIds,
    kit.id,
    ...merchIds,
    cafesCol,
    merchCol,
    allCol,
  ]);
  console.log('  ✓ publicado');

  console.log('\nListo. Catálogo MORIAH creado en Shopify.');
}

main().catch((err) => {
  console.error('\nERROR:', err.message);
  process.exit(1);
});
