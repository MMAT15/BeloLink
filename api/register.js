import { readUsers, saveUsers } from './utils.js ';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const users = readUsers();

    if (users.find((user) => user.email === email)) {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }

    const newUser = { username, email, password };
    users.push(newUser);
    saveUsers(users);

    return res.status(201).json({ message: 'Usuario registrado con éxito.' });
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Método ${req.method} no permitido`);
};