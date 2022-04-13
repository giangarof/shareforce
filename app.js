const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.port || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req,res) => {
    res.render('home')
})

app.listen(PORT, () => {
    console.log('connected');
});