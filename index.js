const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;
let users = []; // this array will act as the in-memory database
const saltRounds = 10;

const secret = 'your-jwt-secret';

// Middleware to Authenticate JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, secret, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
  
  app.get('/api/users', authenticateToken, (req, res) => {
    res.json(users);
  });

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = { username, password: hashedPassword };
    users.push(user);
    res.status(201).json(user);
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username: user.username }, secret);
        res.json({ message: `Welcome ${user.username}!`, token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
