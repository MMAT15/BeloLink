const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public')); // Archivos estáticos

const USERS_FILE = 'users.json';

// Leer usuarios desde JSON
const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data);
};

// Guardar usuarios en JSON
const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Ruta: Registro de Usuario
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  const users = readUsers();

  if (users.find((user) => user.email === email)) {
    return res.status(409).json({ message: 'El correo ya está registrado.' });
  }

  const newUser = {
    id: uuidv4(),
    username,
    email,
    password, // No seguro, agregar hash en producción
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: 'Usuario registrado con éxito.' });
});

// Ruta: Inicio de Sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const users = readUsers();
  const user = users.find((user) => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas.' });
  }

  const sessionToken = uuidv4();
  res.cookie('sessionToken', sessionToken, { httpOnly: true });

  res.json({ message: 'Inicio de sesión exitoso.', username: user.username });
});

// Ruta: Validar Sesión
app.get('/validate-session', (req, res) => {
  const { sessionToken } = req.cookies;

  if (!sessionToken) {
    return res.status(401).json({ message: 'No tienes una sesión activa.' });
  }

  res.json({ message: 'Sesión válida.' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});