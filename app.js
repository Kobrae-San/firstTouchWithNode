// Appel du module express
const express = require('express');
// Appel du module morgan qui va nous permettre d'afficher dans la console les requete effecter sur le serveur
const morgan = require('morgan');
// Appel du module après installation avec npm mongoose qui va nous permettre d'utiliser mongodb de manière simplifier
// Mongoose est une librairie ODM
// En appellant le module mongoose je crée une instance d'objet mongoose
const mongoose = require('mongoose');
// Import du model du model Blog afin de pouvoir l'utiliser dans le fichier
const Blog = require('./models/blog');
const blogRoutes = require('./routes/blogRoutes');
const blogController = require('./controllers/blogControllers');
// Création d'une instance d'application express
const app = express();

// Lien de connection Mongodb contenant le nom d'un utilisateur ainsi que son mot de passe d'accès à la base de donnée et la base de données en question 
const dbURI = 'mongodb+srv://Kobrae:yzy8OJMglGuxUka6@nodetuto.tr5piul.mongodb.net/node-tuto?retryWrites=true&w=majority';

// Içi j'utilise mon objet avec la méthode connect afin de lui permettre de se connecter à ma base de donnée , je lui donne donc comme argument mon lien de connection et un
// objet optionnel pour éviter le message qui indique que cette méthode n'est plus d'actualité
// Comme la méthode connect est une fonction asynchrone on peut lui appliquer les méthodes .then et .catch
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    // Une fois que mongoose a réussi à ce connecter à ma bdd  je peux désormais écouter les requêtes envoyé à mon server
    .then((result) => app.listen(5000))
    .catch((err) => console.log(err));
// Ici on utilise 'app.set pour modifier les paramètre de l'application afin d'utiliser un moteur de vue', qui sera pour cet exemple le moteur ejs.
// Avec la ligne ci dessous, Express ira chercher automatiquement dans le dossier views mes fichiers '.ejs'
app.set('view engine', 'ejs');

// Ci je voulais changer le nom du dossier, il faudrait que je modifie les paramètre afin de choisir dans quelle dossier Express devrais chercher mes vu comme ci dessous
// app.set('views', 'nomdudossier');


// Ecoute des requete sur le port 3000, on peut stockez cette partie la dans une variable afin de la réutiliser
// app.listen(3000);

app.use(express.static('public'));
// Ce middleware va récupérer toute les données encodées dans un url et les transformé en un objet pour que nous puissions les utilisées
app.use(express.urlencoded({ extended: true }));
// Utilisation du Middleware morgan avec le mode dev
app.use(morgan('dev'));

// Içi on gère une requête qui va ajouter un blog à la bdd, lorsque l'on appelle cette page on crée une nouvelle instance de blog avant de la sauvegarder dans la bdd,
// on ne met dans notre instance de blog que les propriété défini dans notre Schema, le timestamps est automatiquement géré par le model.
// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//         title: 'new blog 3',
//         snippet: 'about my new blog',
//         body: 'more about my new blog'
//     });

//     // Içi on utilise la méthode .save de notre model afin de sauvegarder une nouvelle instance de notre objet blog dans la bdd la méthode étant une fonction asynchrone on peut lui ajouter 
//     // les méthodes .then et .catch afin de définir ce qui doit être fait lorsque la promesse est résolu
//     blog.save()
//     .then((result) => {
//         res.send(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// });

// Içi nous avons une requête qui s'en va chercher dans notre collection mongodb tout les objets correspondant au model blog grace à la méthode ".find()" du Model Blog
// app.get('/all-blogs', (req, res) => {
//     Blog.find()
//         .then((result) => {
//             res.render('index', { title: 'All Blogs', blogs: result })
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });

// Juste au dessus notre requête nous permet d'aller chercher toutes les instances du model Blog, içi la requete fait apparaitre un en particulier
// app.get('/single-blog', (req,res) => {
//     Blog.findById('6541992de168939411e82c9a')
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });

// Ci dessous nous avons un "Middleware" personnalisé qui nous indique dans la console lorsqu'une requète est effectuer ainsi que 
// l'hôte de la requete, le chemin et la méthode.

// app.use((req, res, next) => {
//     console.log('new request made:');
//     console.log('host: ', req.hostname);
//     console.log('path: ', req.path);
//     console.log('method: ', req.method);
//     next();
// });

// renvoie une réponse en fonction de la requete envoyé
app.get('/', (req, res) => {
    // res.send('<p>Home page </p>');
    // Içi on renvoie le fichier index.html avec la méthode 'sendFile' le problème c'est qu'elle prend normalement un chemin absolu donc on donne un 2è arguments 
    // qui correspond à la racine du projet.
    // res.sendFile('./views/index.html', { root: __dirname });
    // const blogs = [
    //     {title : 'Yoshi finds eggs', snippet : 'Lorem ipsum dolor sit amet consecteur'},
    //     {title : 'Mario finds star', snippet : 'Lorem ipsum dolor sit amet consecteur'},
    //     {title : 'How to defeat bowser', snippet : 'Lorem ipsum dolor sit amet consecteur'}
    // ]
    // res.render('index', { title : 'Home', blogs }); // Contrairement à la ligne en commentaire du dessus içi on ne cherche pas à envoyer un fichier mais à afficher un fichier mais une vue
    Blog.find()
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result })
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/about', (req, res) => {
    // res.send('<p>about page </p>');
    // res.sendFile('./views/about.html', { root: __dirname });
    res.render('about', { title: 'About'});
});

// // Pour les redirection on utilise la méthode redirect
// app.get('/about-us', (req, res) => {
//     // res.send('<p>about page </p>');
//     res.redirect('/about');
// });

// Içi dès que mon url sera suivi d'un /blogs ce middleware fera appel aux routes contenu dans le fichiers blogRoutes
app.use('/blogs', blogRoutes);

app.post('/', blogController.blog_post);

// Erreur 404, Ce code doit se trouver en dessous de toute les autres route parce qu'il se lance automatiquement si le code atteint cet partie du code
app.use((req, res) => {
    // res.status(404).sendFile('./views/404.html', { root: __dirname });
    res.status(404).render('404', { title: '404'})
});