// Primero importamos mongoose 
const mongoose = require('mongoose');

const { DateTime } = require("luxon");
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


AuthorSchema.virtual("lifespan").get(function() {
    let date_of_birth_formatted =  DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
    let date_of_death_formatted =  DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
    if(date_of_death_formatted == "Invalid DateTime"){date_of_death_formatted = "no date of death"};
    if(date_of_birth_formatted == "Invalid DateTime"){date_of_birth_formatted = "no date of birth"};
    const lifespan = `${date_of_birth_formatted} - ${date_of_death_formatted}`;
    return lifespan;
});


AuthorSchema.virtual("date_of_birth_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.date_of_birth).toISODate(); // format 'YYYY-MM-DD'
  });
  
  AuthorSchema.virtual("date_of_death_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.date_of_death).toISODate(); // format 'YYYY-MM-DD'
  });

// Exportamos el modelo
module.exports = mongoose.model('Author', AuthorSchema)