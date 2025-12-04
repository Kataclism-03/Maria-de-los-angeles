# Siempre tú

Landing estática romántica con ondas pastel, reproducción musical y carta que se escribe lentamente. Pensada para abrirla en el teléfono y compartirla por enlace.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (incluye npm)
- Archivo de audio en `assets/audio/cancion.mp3`

## Desarrollo local

```bash
npm install        # ya ejecutado, repítelo si cambias de equipo
npm run dev        # abre http://localhost:3000
```

`lite-server` expone la carpeta raíz; en otro dispositivo del mismo WiFi puedes usar la IP local que muestra la terminal (por ejemplo `http://192.168.0.12:3000`).

## Despliegue rápido

### Opción 1: GitHub Pages
1. Crea un repositorio y sube todo el contenido (incluyendo `assets/audio/cancion.mp3`).
2. En GitHub → **Settings → Pages** selecciona la rama `main` y carpeta `/ (root)`.
3. Espera unos minutos hasta que aparezca la URL `https://tuusuario.github.io/tu-repo/`.

### Opción 2: Netlify Drop
1. Ejecuta `npm run build:zip` para generar `dist.zip` con los archivos.
2. Arrastra ese ZIP a [https://app.netlify.com/drop](https://app.netlify.com/drop) y copia el enlace que genera.

### Opción 3: Netlify CLI (permite dominio propio)
```bash
npm install -g netlify-cli
netlify login
netlify deploy --dir .          # despliegue provisional
netlify deploy --dir . --prod   # despliegue público
```

## Personalización
- Edita el texto dentro de `script.js` (`storyBlocks`).
- Cambia colores/fuentes en `index.html` (config de Tailwind CDN y CSS interno).
- Sustituye la canción en `assets/audio/cancion.mp3` o cambia el `src` del `<audio>`.

## Notas
- Algunos navegadores móviles requieren tocar la pantalla para permitir audio. El botón "Encender la canción" ya cuenta como interacción.
- SiNetlify o GitHub Pages tardan más en reflejar cambios, limpia la caché del navegador móvil o usa modo incógnito.
