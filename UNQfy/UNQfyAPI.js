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

// POST artistID

router.post('/artists', (req, res) => {
    unqfy.addArtist({name: req.body.name, country: req.body.country});
    saveUNQfy(unqfy, 'estado');
    res.json({
        "id": "0",
        "name": req.body.name,
        "country": req.body.country,
        "albums": []
     });
});

// GET artistID

router.get('/artists/:id', (req, res) => {
    const artist = unqfy.getArtistById(parseInt(req.body.id));
    res.json(artist.toJSON());
});


//Test GET y POST

router.get('/testGet', (req, res) => {
    console.log('Hola!');
    res.json({ message: 'GET Test!' });   
});

router.post('/testPost/:str', (req, res) => {
    console.log(req.params.str);
    res.json({ message: 'POST Test!' });
    saveUNQfy(unqfy, 'estado');
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