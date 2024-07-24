const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3003;

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Middleware para parsear JSON
app.use(bodyParser.json());

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: String
});

const User = mongoose.model('User', userSchema, 'users');

// Ruta para actualizar un usuario
app.put('/updateUser/:id', async (req, res) => {
    const userId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send('Invalid user ID');
    }
    
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`UpdateUser service is running on port ${port}`);
});
