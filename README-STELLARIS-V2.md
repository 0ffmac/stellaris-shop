# Stellaris 2.0 — primera propuesta funcional

## Qué cambia
- Nueva identidad visual cálida: marfil, rosa antiguo, terracota, verde petróleo y latón.
- Navegación y textos en español.
- Cinco familias reales: estrellas de papel, lámparas turcas, pulseras y gemas, aromas y rituales, tapices y textiles.
- Se conserva `StarViewer`, el modelo `Star.glb` y las cuatro texturas existentes. El usuario puede seleccionar los acabados disponibles.
- El catálogo de estrellas deja de inventar referencias como “Star 04”: se presenta como un diseño original con variantes.
- Se conservan las fotografías de pulseras.
- La fotografía de lámpara aportada por el usuario se ha recortado para usarla como imagen de referencia de la categoría.

## Cómo probar
1. Descomprime este ZIP.
2. Ejecuta `pnpm install` (o `npm install`).
3. Ejecuta `pnpm dev` (o `npm run dev`).
4. Abre la URL local que indique Vite.

## Pendiente antes de publicar
- Sustituir/confirmar fotografía de lámpara con fotografía propia de producto sin interfaz de captura.
- Añadir fotografías reales de incienso, salvia y palo santo. En esta primera versión se usan tarjetas tipográficas/ilustrativas, no se inventan fotos de producto.
- Confirmar precios, nombres, variantes, materiales y disponibilidad.
- Configurar enlaces reales de Instagram, email, políticas, envíos y devoluciones.
- Conectar carrito, pagos, inventario, impuestos y checkout. Los botones de compra están deliberadamente desactivados para no simular una compra funcional.
- Añadir traducciones EN/FR cuando se definan textos comerciales definitivos.
- Revisar accesibilidad, SEO, analítica y rendimiento antes de producción.

## Nota técnica
El visor 3D existente se conserva. No se ha sustituido el modelo ni se han añadido diseños de estrella distintos.


## Actualización: colección real de estrellas
- Se han integrado las 21 fotografías del ZIP del usuario en `public/assets/stars/catalog/`.
- Las imágenes se han optimizado a WebP manteniendo su composición y aspecto.
- La página de inicio muestra una selección de seis modelos y enlaza a la colección completa.
- La categoría de estrellas muestra los 21 modelos.
- Los nombres son provisionales (`Estrella modelo 01`…`21`) para no inventar nombres comerciales.
- No se muestran precios porque no venían indicados en el ZIP. Añadirlos cuando estén confirmados.
- El visor 3D y sus cuatro texturas existentes siguen intactos; representan el personalizador de acabados, no sustituyen las fotos del catálogo.

## Actualización: colección de tapices
- Se han preparado las 17 fotografías de `public/assets/tapestries/` y se han añadido como productos de la categoría «Tapices y textiles».
- Cada imagen se ha enderezado, se ha limpiado el borde del recorte y se ha centrado en un lienzo 4:5 sobre el mismo fondo marfil de las tarjetas.
- Los archivos finales están en `public/assets/tapestries/catalog/tapiz-01.webp`…`tapiz-17.webp`.
- El proceso es reproducible con `python3 scripts/prepare-tapestries.py`.
- Los nombres (`Tapiz modelo 01`…`17`) y las características son provisionales. Faltan medidas, precios y disponibilidad reales.
- Las fotografías originales se conservan sin modificar en `design/tapestries/` para no incluirlas en el despliegue.

## Fichas de producto

- Cada tarjeta del catálogo enlaza a `/collection/:categoria/:producto/`.
- La ficha muestra la imagen, descripción, detalles, materiales/cuidados, selector de tamaño y el precio (o «Precio a consultar»).
- El botón «Solicitar compra» abre un email con el producto y el tamaño seleccionados. El pago online sigue sin estar conectado.
- Las tallas de los tapices (`Pequeño`, `Mediano`, `Grande`) son provisionales y se pueden cambiar en `src/data/catalog.ts`.
- `public/_redirects` permite abrir directamente las URLs de producto en Cloudflare Pages sin romper las páginas de categoría, que siguen generándose como HTML estático.

### Galería ampliada

- Al pulsar «Ampliar imagen» se abre la fotografía a pantalla completa.
- Se puede hacer zoom con la rueda del ratón o con un pellizco en pantalla táctil, hasta un máximo del 600%.
- Al ampliar, se puede arrastrar la imagen para moverse por la fotografía.
- Un doble clic alterna entre el tamaño ajustado y el zoom.
- Los controles inferiores permiten acercar, alejar y restablecer el zoom.
- `Escape` cierra la galería; también se puede cerrar tocando fuera de la imagen o con el botón de cerrar.

## Página de inicio

- Se ha retirado la sección «21 estrellas, 21 personalidades».
- También se ha retirado la sección «Tu estrella, tu estilo».
- Las fotografías de estrellas no se han eliminado: siguen disponibles en la colección `/collection/stars/` y en el catálogo.

## Imágenes fuera de Git

- Las imágenes nuevas de producto no se suben al repositorio. Están incluidas en `.gitignore`:
  - `design/` — originales y guías de diseño.
  - `public/assets/tapestries/` — tapices procesados.
  - `public/assets/stars/` — catálogo de estrellas.
  - `public/assets/bracelets/` — fotografías de pulseras.
  - `public/assets/*.jpg`, `*.jpeg`, `*.png`, `*.webp`, `*.gif`, `*.avif` — imágenes sueltas de producto y tarjetas sociales.
- Los archivos siguen en el proyecto local y son necesarios para que el catálogo se vea completo. No se han borrado.
- Antes de compilar o desplegar desde un clon nuevo, copia las imágenes en sus rutas correspondientes. No las añadas con `git add -f` salvo que se decida usar Git LFS.
- Las imágenes que ya estaban versionadas antes de esta rama (modelo 3D y texturas de `public/assets/skins/`) se mantienen tal cual. `public/og-image.jpg` no se actualiza en esta rama.

## Git

- Repositorio remoto: `https://github.com/0ffmac/stellaris-shop.git`.
- Rama de estos cambios: `feature/catalog-product-pages`.
- Para publicar la rama:

```bash
gh auth login -h github.com
git push -u origin feature/catalog-product-pages
```

- Las imágenes nuevas no se incluyen en el commit; consulta la sección anterior.

## Vista previa al compartir en WhatsApp

- `public/og-image.jpg` contiene la tarjeta de compartir de 1200 × 630 px.
- `index.html` incluye Open Graph y Twitter Card en el HTML inicial.
- La URL pública configurada es `https://main.stellaris-shop.pages.dev/`.
- Si conectas un dominio propio, cambia `og:url`, `og:image`, `twitter:image` y `canonical` al nuevo dominio.
- Tras compilar, despliega con `pnpm exec wrangler pages deploy dist --project-name=stellaris-shop --branch=preview`.
- Comprueba la URL de producción después de desplegar a producción.
