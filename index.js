const express = require('express');
const cors = require('cors');

require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

let users = []; // this array will act as the in-memory database

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/register', (req, res) => {
  // here you should add some validation for username and password
  const { username, password } = req.body;

  // normally you would encrypt the password here
  const user = { username, password };
  users.push(user);

  res.status(201).json(user);
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // here you would normally check the password against the hashed one in the DB
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ message: `Welcome ${user.username}!` });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
