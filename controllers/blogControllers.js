const Blog = require('../models/blog');

const blog_create = (req, res) => {
    res.render('create', { title: 'Create'});
}

// Cette requête permet de d'afficher un document spécifique en utilisant son id
const blog_details = (req, res) => {
    // Je stock dans ma variable l'id que je vais recupérer via le paramêtre passer dans l'url de ma requête
    const id = req.params.id;
    // Avec l'id je vais utiliser la méthode .findById disponible routerdans mon model pour chercher mon document et l'afficher si le document existe
    Blog.findById(id)
        .then(result => {
            res.render('details', { blog: result, title: 'Blog Details' })
        })
        .catch(err => {
            console.log(err)
        });
}

const blog_delete = (req, res) => {
    const id = req.params.id;

    // Içi, on utilise l'id recuperer en paramêtre afin de trouver le documeent et le supprimer avec la méthode disponible via mon model findByIdAndDelete
    Blog.findByIdAndDelete(id)
        .then(result => {
            // Une fois que c'est validé je renvoie un json afin de permettre à mon front de s'actualiser
            res.json({ redirect: '/' });
        })
        .catch(err => {
            console.log(err);
        })
}

const blog_post = (req, res) => {
    // Nous récupérons les informations envoyées par la requête post via notre formulaire.
    const blog = new Blog(req.body);

    // On sauvegarde enuite notre instance de Blog.
    blog.save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = {
    blog_create,
    blog_details,
    blog_delete,
    blog_post
}