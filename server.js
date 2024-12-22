const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Ruta de inicio de sesión
server.post("/login", (req, res) => {
  let body = [];
  req.on("data", (chunk) => body.push(chunk));
  req.on("end", () => {
    body = JSON.parse(Buffer.concat(body).toString());
    const { username, password } = body;

    // Buscar usuario
    const db = router.db.getState();
    const user = db.users.find((u) => u.username === username && u.password === password);

    if (user) {
      res.json({ token: user.token });
    } else {
      res.status(401).json({ message: "Credenciales inválidas." });
    }
  });
});

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server está ejecutándose en http://localhost:3000");
});
