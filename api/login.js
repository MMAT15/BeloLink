import { readUsers } from './utils.js';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    const users = readUsers();

    const user = users.find((user) => user.email === email && user.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    return res.status(200).json({ message: 'Inicio de sesión exitoso.', username: user.username });
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Método ${req.method} no permitido`);
};