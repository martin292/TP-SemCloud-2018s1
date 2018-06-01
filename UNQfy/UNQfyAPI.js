let express = require('express');
let app = express();
let bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let router = express.Router();
let port = process.env.PORT || 5000;

//------------------------------------------------------------------

const fs = require('fs');
const unqmod = require('./unqfy');

function getUNQfy(filename) {
    let unqfy = new unqmod.UNQfy();
    if (fs.existsSync(filename)) {
      console.log();
      unqfy = unqmod.UNQfy.load(filename);
    }
    return unqfy;
  }
  
  function saveUNQfy(unqfy, filename) {
    console.log();
    unqfy.save(filename);
  }

//------------------------------------------------------------------
// Manejador de Errores
/*
function errorHandler(err, req, res, next) {
    console.error(err); // imprimimos el error en consola
    // Chequeamos que tipo de error es y actuamos en consecuencia
    if (err instanceof InvalidInputError){
    res.status(err.status);
    res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
    // body-parser error para JSON invalido
    res.status(err.status);
    res.json({status: err.status, errorCode: 'INVALID_JSON'});
    } else if (err.type === 'El artista ya existe'){
        res.status(err.status);
        res.json({status: err.status, errorCode: 'BAD REQUEST'});
    } else if (err.type === 'El album ya existe'){
        res.status(err.status);
        res.json({status: err.status, errorCode: 'BAD REQUEST'});

    } else if (err.type === 'El track ya existe'){
        res.status(err.status);
        res.json({status: err.status, errorCode: 'BAD REQUEST'});    
    // continua con el manejador de errores por defecto
    next(err);
    }
}
*/ 

//------------------------------------------------------------------

let unqfy = null;

router.use((req, res, next) => {
    unqfy = getUNQfy('estado');
    console.log('Request received!');
    next();
});

// POST artist
router.post('/artists', (req, res) => {
    unqfy.addArtist({name: req.body.name, country: req.body.country}); //Falta crear en la clase UNQfy un generador de IDs 
    saveUNQfy(unqfy, 'estado');
    res.status(200);
    res.json({
        "id": "0",
        "name": req.body.name,
        "country": req.body.country,
        "albums": []
    });
});

// GET artist by ID
router.get('/artists/:id', (req, res) => {
    const artist = unqfy.getArtistById(req.params.id); //Todavia no funciona, faltan los IDs
    res.status(200);
    res.json(artist.toJSON());
});

// DELETE artist by ID
router.delete('/artists/:id', (req, res) => {
    unqfy.deleteArtistById(req.params.id); //Falta crear la funcion deleteArtistById() en la clase UNQfy
    res.status(200);
});

// GET artist by name
router.get('/artists', (req, res) => {
    res.status(200);
    res.send(unqfy.getArtistByName(req.query.name));
});

//------------------------------------------------------------------

app.use('/api', router);

/*
app.use((req, res) => {
    res.status(404);
    res.json({status:404, errorCode: '"RESOURCE_NOT_FOUND"'})
});

app.use(errorHandler);
*/

app.listen(port);
console.log('http://localhost:' + port + '/api');