app.post('/api/register', (req, res) => {
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
    password,
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: 'Usuario registrado con éxito.' });
});

app.post('/api/login', (req, res) => {
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