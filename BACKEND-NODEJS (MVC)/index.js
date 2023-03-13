
const {connection} = require("./database/connection");
const express = require("express");
const cors = require("cors");


console.log("api node red social arrancada");

connection();

const app = express();
const puerto = 3900;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const userRoutes = require("./routes/user");
const publicationRoutes = require("./routes/publication");
const followRoutes = require("./routes/follow");

app.use("/api/user",userRoutes);
app.use("/api/publication",publicationRoutes);
app.use("/api/follow",followRoutes);

app.listen(puerto, ()=>{
    console.log("servidor de node corriendo en el puerto: " + puerto);
})