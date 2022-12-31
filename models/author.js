// Primero importamos mongoose 
const mongoose = require('mongoose');

// Importamos el modelo de los Schema / Esquemas. Ver más en Mongoose Primer
const Schema = mongoose.Schema;

// Creamos el esquea del autor (equivalente a tablas en MySql)
const AuthorSchema = new Schema({
    first_name : { type: String, required:true, maxLenght: 100 },
    family_name : { type:String, required:true, maxLenght: 100 },
    date_of_birth: { type:Date },
    date_of_death: { type:Date },
})

// Creamos una propieadd virtual ( unimos dos propiedades en una sola, la cual es accesible luego)
AuthorSchema.virtual('name').get(function(){
    // Para abordar errores en casos donde el autor no tiene un primer nombre o un apellido
    // Nosotros querriamos estar seguros creando una excepción que retorne una string vacia en este caso
    let fullname = "";

    if(this.first_name && this.family_name){
        fullname = `${this.family_name}, ${this.first_name}`;
    }
    if(!this.first_name && !this.family_name){
        fullname = "";
    }
    return fullname;
})


// Virtual para el URL del autor
AuthorSchema.virtual('url').get(function() {
    // No vamos a usar una funcion flecha ya que necesitamos este objeto
    return `/catalog/author/${this._id}`

})

// Exportamos el modelo
module.exports = mongoose.model('Author', AuthorSchema)