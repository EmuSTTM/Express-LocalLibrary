/*  La definicion será muy similar a los otros modelos
- El modelo tiene una string SchemaType llamado Name para describir el generos
- This name deberia requerer y tener de 3 a 100 caracteres
- Hay que declarar un virtual para la URL 
- Exportar el modelo 
*/

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    name: {
        type:String,
        required: true,
        min: 3,
        max: 100},
})

GenreSchema.virtual('url').get(function() {
    return `/catalog/genre/${this._id}`;
})

module.exports = mongoose.model("Genre", GenreSchema);