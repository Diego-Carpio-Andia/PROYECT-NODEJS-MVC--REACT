const mongoose = require("mongoose");

const connection = async() => {
    try {

        mongoose.set('strictQuery', true);
        await mongoose.connect("mongodb://localhost:27017/mi_red_social");
        console.log("nos conectamos a la base de datos mi_red_social");
 
        
    } catch (error) {
        console.log(error);
        throw new Error("no se conecto a la base de datos");
    }
}


module.exports = {
    connection
}