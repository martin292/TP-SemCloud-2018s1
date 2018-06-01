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

let unqfy = null;

router.use((req, res, next) => {
    unqfy = getUNQfy('estado');
    console.log('Request received!');
    next();
});

// POST artist
router.post('/artists', (req, res) => {
    unqfy.addArtist({name: req.body.name, country: req.body.country});
    const artist = unqfy.getArtistByName(req.body.name);
    saveUNQfy(unqfy, 'estado');
    res.status(200);
    res.json({
        "id": artist.id,
        "name": artist.name,
        "country": artist.country,
        "albums": artist.albums
    });
});

// GET artist by ID
router.get('/artists/:id', (req, res) => {
    const artist = unqfy.getArtistById(parseInt(req.params.id));
    res.status(200);
    res.json({
        "id": artist.id,
        "name": artist.name,
        "country": artist.country,
        "albums": artist.albums
    });
});

// DELETE artist by ID
router.delete('/artists/:id', (req, res) => {
    unqfy.deleteArtistById(parseInt(req.params.id));
    unqfy.del();
    res.status(200);
    res.send('Artista eliminado');
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