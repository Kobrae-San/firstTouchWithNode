// Içi on va definir un Schema et un model pour les blogs

// On appel de nouveau le module Monggose afin de pouvoir créer nos model ainsi que notre objet Schema
const mongoose = require('mongoose');

// Içi on stock un constructeur de schéma
const Schema = mongoose.Schema;

// Içi on crée un nouvel objet Schema avec le contructeur ci dessus et on définit les propriété de notre objet Blog, on ajoute de sous-propriété comme le type et required
// afin d'avoir une validations supplémentaires. On ajoute aussi un objet optionnel qui va nous indiquer la date de création de notre objet Blog.
const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, { timestamps: true});

// Içi nous définissons notre model Blog avec deux arguments le premier sera le nom du model et le second sera le schema  sur lequelle notre sera basé
const Blog = mongoose.model('Blog', blogSchema);

// On exporte ensuite notre model afin de pouvoir le réutiliser.
module.exports = Blog;



