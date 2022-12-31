const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookSchema = new Schema ({
    title: { type: String, required:true },
    author: { type: Schema.Types.ObjectId, ref:"Author", required:true }, // This is a kind of foreing key of Author Schema
    summary: { type: String, required:true },
    isbn: { type:String, required:true},
    genre: [{type: Schema.Types.ObjectId, ref:"Genre"}], //Another foreing key
})

// Virtal para las URL de los libros
BookSchema.virtual('url').get(function() {
    // No usamos una funcion flecha porque necesitmaos, otra vez, el objeto
    return `/catalog/book/${this._id}`;
})

//Exportamos el modelo

module.exports = mongoose.model('Book', BookSchema)