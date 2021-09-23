const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');

require('dotenv').config();

const app = express();
const port = process.env.process || 5001;

app.use(cors());
app.use(express.json());


/* Connection to MongoDB Compass */
mongoose.connect('mongodb://localhost:27017/BlackCoffer',
    { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log('Connection to Compass is successful');
    }).catch((error) => {
        console.log(error);
    });


const cofferRouter = require('./sampleData');
app.use('/coffer', cofferRouter);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
