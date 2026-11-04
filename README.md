# Desafío - Mi repertorio

Servidor con Express que gestiona el repertorio de canciones de la escuela de música "E-Sueño". Las canciones se guardan en `repertorio.json` usando el módulo File System, y la página `index.html` (cliente entregado en el material de apoyo) permite agregarlas, editarlas y eliminarlas.

## Cómo ejecutarlo

Requiere Node.js.

```bash
npm install
npm start
```

Luego abre http://localhost:3000 en el navegador.

## Rutas

| Método | Ruta | Qué hace |
| --- | --- | --- |
| GET | `/` | Devuelve la página web del repertorio (`index.html`). |
| GET | `/canciones` | Devuelve un JSON con todas las canciones. |
| POST | `/canciones` | Agrega la canción que llega en el payload (`id`, `titulo`, `artista`, `tono`). |
| PUT | `/canciones/:id` | Edita la canción con ese `id` usando los datos del payload. |
| DELETE | `/canciones/:id` | Elimina la canción con ese `id`. |

Si faltan datos o el JSON es inválido, responde `400`. Si el `id` no existe, responde `404`.

## Archivos

- `index.js`: servidor Express con las rutas.
- `index.html`: cliente del repertorio (material de apoyo).
- `repertorio.json`: canciones guardadas (parte vacío: `[]`).
