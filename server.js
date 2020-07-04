const express = require('express');
const app = express();
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

connectDB();

app.get('/',(req,res)=>{
    res.send('All Good');
});

app.use(express.json({extended:false}));
//Users Route
app.use('/api/users',require('./routes/api/users'));

// Auth Route
app.use('/api/auth',require('./routes/api/auth'));

//Posts Route
app.use('/api/posts',require('./routes/api/posts'));

//Profile Route
app.use('/api/profile',require('./routes/api/profile'));


app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
});