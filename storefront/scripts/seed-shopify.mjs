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

// --- Colección -----------------------------------------------------------
async function upsertCollection(productIds) {
  const existing = await gql(
    `query { collectionByHandle(handle: "cafes") { id } }`,
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
      {
        input: {
          handle: 'cafes',
          title: 'Cafés',
          descriptionHtml:
            '<p>Ediciones de especialidad y blends únicos, cultivados con intención y respeto por la tierra. Café 100% colombiano.</p>',
        },
      },
    );
    userErrors(created.collectionCreate, 'collectionCreate');
    collectionId = created.collectionCreate.collection.id;
  }

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
  if (errs.length) throw new Error(`collectionAddProducts: ${JSON.stringify(errs)}`);
  return collectionId;
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
  console.log('1/5 Autenticando…');
  TOKEN = await getToken();

  console.log('2/5 Definiendo metafields (visibles en storefront)…');
  await ensureMetafieldDefinitions();

  console.log('2/5 Creando cafés…');
  const productIds = [];
  for (const cafe of CAFES) {
    const product = await createCafe(cafe);
    productIds.push(product.id);
    console.log(`  ✓ ${product.title} (${product.handle})`);
    if (!(await hasMedia(product.id))) {
      await uploadImage(product.id, 'producto-bolsa.webp', `${product.title} · MORIAH Café`);
      console.log('    ✓ imagen');
    }
  }

  console.log('3/5 Creando Kit Tres Orígenes…');
  const kit = await createKit();
  productIds.push(kit.id);
  console.log(`  ✓ ${kit.title} ($${KIT_PRICE} / antes $${KIT_COMPARE_AT})`);
  if (!(await hasMedia(kit.id))) {
    await uploadImage(kit.id, 'kit-bolsas.webp', 'Kit Tres Orígenes · MORIAH Café');
    console.log('    ✓ imagen');
  }

  console.log('4/5 Creando colección `cafes`…');
  const collectionId = await upsertCollection(productIds);
  console.log(`  ✓ colección ${collectionId}`);

  console.log('5/5 Publicando en canales de venta…');
  await publishAll([...productIds, collectionId]);
  console.log('  ✓ publicado');

  console.log('\nListo. Catálogo creado en Shopify.');
}

main().catch((err) => {
  console.error('\nERROR:', err.message);
  process.exit(1);
});
