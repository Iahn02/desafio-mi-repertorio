const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const rutaRepertorio = path.join(__dirname, "repertorio.json");

// Permite leer el payload JSON que envía el cliente en POST y PUT
app.use(express.json());

// Lee el repertorio desde el archivo. Si no existe, lo crea vacío.
const leerRepertorio = () => {
  if (!fs.existsSync(rutaRepertorio)) {
    fs.writeFileSync(rutaRepertorio, "[]");
  }
  return JSON.parse(fs.readFileSync(rutaRepertorio, "utf8"));
};

// Guarda el repertorio en el archivo
const guardarRepertorio = (canciones) => {
  fs.writeFileSync(rutaRepertorio, JSON.stringify(canciones, null, 2));
};

// Revisa que la canción traiga título, artista y tono
const datosValidos = ({ titulo, artista, tono }) =>
  [titulo, artista, tono].every((campo) => typeof campo === "string" && campo.trim() !== "");

// GET / : devuelve la página web del cliente
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// GET /canciones : devuelve todas las canciones del repertorio
app.get("/canciones", (req, res) => {
  res.json(leerRepertorio());
});

// POST /canciones : agrega una canción con los datos del payload
app.post("/canciones", (req, res) => {
  const cancion = req.body ?? {};

  if (!datosValidos(cancion)) {
    return res.status(400).json({ mensaje: "Faltan datos: titulo, artista y tono son obligatorios" });
  }

  const canciones = leerRepertorio();
  // El cliente envía un id; si no viene, se genera uno
  const nuevaCancion = {
    id: cancion.id ?? Date.now(),
    titulo: cancion.titulo,
    artista: cancion.artista,
    tono: cancion.tono,
  };
  canciones.push(nuevaCancion);
  guardarRepertorio(canciones);

  res.status(201).json(nuevaCancion);
});

// PUT /canciones/:id : edita la canción indicada en la URL con los datos del payload
app.put("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const cancion = req.body ?? {};

  if (!datosValidos(cancion)) {
    return res.status(400).json({ mensaje: "Faltan datos: titulo, artista y tono son obligatorios" });
  }

  const canciones = leerRepertorio();
  // El id de la URL llega como texto, por eso se compara como texto
  const indice = canciones.findIndex((c) => String(c.id) === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: `No existe una canción con id ${id}` });
  }

  // Se mantiene el id original y se actualizan los demás datos
  canciones[indice] = {
    id: canciones[indice].id,
    titulo: cancion.titulo,
    artista: cancion.artista,
    tono: cancion.tono,
  };
  guardarRepertorio(canciones);

  res.json(canciones[indice]);
});

// DELETE /canciones/:id : elimina la canción indicada en la URL
app.delete("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const canciones = leerRepertorio();
  const indice = canciones.findIndex((c) => String(c.id) === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: `No existe una canción con id ${id}` });
  }

  const [eliminada] = canciones.splice(indice, 1);
  guardarRepertorio(canciones);

  res.json(eliminada);
});

// Si el payload no es un JSON válido, responde con un mensaje claro
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ mensaje: "El cuerpo de la consulta no es un JSON válido" });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
