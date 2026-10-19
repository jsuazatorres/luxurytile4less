# 💎 Luxury Tile 4 Less - Website & Control Center (CMS)

Sitio web oficial moderno y panel de administración integrado para **Luxury Tile 4 Less** (Port St. Lucie, FL).

---

## 🚀 Cómo abrir y usar la página

### Opción 1: Abrir directamente en tu navegador (Sin instalar nada)
Simplemente haz doble clic en el archivo [index.html](file:///c:/Users/Camilo/Documents/luxurytile4less/index.html) desde tu explorador de archivos de Windows y se abrirá en Chrome, Edge o tu navegador favorito.

### Opción 2: Con servidor local (Recomendado para desarrollo)
Abre PowerShell o terminal en esta carpeta y ejecuta:
```bash
python -m http.server 8080
```
Luego visita en tu navegador: **`http://localhost:8080`**

---

## 🔒 Panel de Administración (CMS)

Puedes editar todos los contenidos, baldosas, fotos, precios, teléfonos y textos sin tocar una sola línea de código.

1. **Cómo ingresar al CMS:**
   - Haz clic en el botón **`🔒 Admin CMS`** situado en la barra superior derecha o en el enlace del pie de página.
   - Introduce la clave de acceso.
   - **Clave por defecto:** `admin123` (puedes cambiarla en la pestaña *Business & Contacts*).

2. **Funciones del Panel:**
   - **📦 Manage Products:** Ver la lista de todas las baldosas activas. Puedes hacer clic en ✏️ para editar cualquier dato o en 🗑️ para eliminarla.
   - **✏️ Product Editor:** Formulario para agregar una nueva baldosa o editar una existente.
     - **Subida de fotos:** Permite seleccionar fotos directamente desde tu computadora (o pegar una URL).
     - **Campos:** Nombre, categoría, acabado, dimensiones (ej. 24"x48"), precio por sq.ft, descripción, badge promocional y estado de stock.
   - **⚙️ Business & Contacts:** Cambia los números de teléfono, el número de WhatsApp para cotizaciones, el correo, la dirección física en Port St. Lucie, horarios y textos del Hero.
   - **💾 Backup & Restore:** 
     - **Descargar Backup (.json):** Descarga una copia de seguridad completa con todos tus productos y fotos.
     - **Restaurar Backup:** Sube un archivo .json guardado previamente para restaurar el catálogo.
     - **Restablecer:** Vuelve al catálogo original de fábrica.

---

## 📁 Estructura del Proyecto

```
luxurytile4less/
├── index.html              # Página web principal y modales
├── original_backup.html    # Copia de seguridad del código HTML original que pegaste
├── README.md               # Esta guía de uso
├── css/
│   └── styles.css          # Estilos de diseño prémium de alta gama
├── js/
│   └── app.js              # Motor de interactividad y Panel CMS
├── data/
│   └── initialProducts.js  # Base de datos inicial precargada
└── assets/                 # Fotos de alta resolución y logos originales
    ├── recurso-1.png       # Logotipo oficial original
    ├── recurso-2.png       # Logotipo alternativo original
    ├── logo-icon.webp      # Favicon / Icono de la marca
    ├── hero-showroom.jpg   # Foto prémium del showroom
    ├── service-bathroom.jpg # Remodelación de baños
    ├── service-kitchen.jpg  # Remodelación de cocinas e islas
    ├── product-calacatta.jpg # Mármol Calacatta Gold
    ├── product-noir.jpg    # Mármol Noir Saint Laurent
    ├── product-quartzite.jpg # Cuarcita exótica Patagonia
    ├── product-wood.jpg    # Porcelanato amaderado Oak
    ├── product-herringbone.jpg # Mosaico espiga Carrara
    ├── product-travertine.jpg # Travertino romano beige
    └── product-concrete.jpg # Cemento moderno gris
```

---

## 🌐 Publicación en Internet (Hosting)
Como este sitio es 100% autónomo (HTML5 + CSS + JavaScript), no requiere bases de datos MySQL complejas ni servidores PHP que se caigan. Puedes alojarlo en:
- **Netlify / Vercel:** Arrastrando esta carpeta (100% gratis con certificado SSL).
- **GitHub Pages:** Subiéndolo a un repositorio gratuito.
- **Tu propio hosting / cPanel / Hostinger / GoDaddy:** Subiendo estos archivos por FTP a la carpeta `public_html`.
