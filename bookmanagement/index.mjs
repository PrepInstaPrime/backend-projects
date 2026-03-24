import express from 'express';
import mongoose from 'mongoose';
import config from './config.mjs';
import router from './src/route.mjs';
import multer from 'multer'
const app = express();
app.use(multer().any());
app.use(express.json());

mongoose.connect(config.mongoURI)
    .then(()=>{
        console.log("database connected");
    })
    .catch((err)=>{
        console.log("connection error", err);
    });

app.use('/', router);
app.listen(config.port || 8080, ()=>{
    console.log(`server started at port ${config.port || 8080}`);
});
