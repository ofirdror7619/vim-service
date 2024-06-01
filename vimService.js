const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

const PORT = process.env.PORT || 3000;

const SECRET_KEY = 'vim_service_secret_key';

const users = [{ id: 1, username: 'user1', password: 'password1' }];

app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
  
    if (user) {
      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });


  const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
  
    if (token) {
      jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };

  
app.get('/', authenticateJWT, (req, res) => {
    console.log('* GET request called');
    res.send('Hello dear user!');
  });

app.post('/post', authenticateJWT, (req, res) => {
    console.log(`* POST request called with body: ${JSON.stringify(req.body)}`); 
    res.send('Data received');
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });