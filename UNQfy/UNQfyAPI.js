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
    if(jsonIsValidForArtists(req.body)){
        postArtist(req, res);
    }else{
        res.status(400).json({ status: 400, errorCode: "BAD_REQUEST" });
    }    
});

function jsonIsValidForArtists(json){
    return json.hasOwnProperty('name') && json.hasOwnProperty('country');
}

function postArtist(req, res){
    if (unqfy.getArtistByName(req.body.name) !== undefined) {
        res.status(409).json({ status: 409, errorCode: 'RESOURCE_ALREADY_EXISTS' });
    } else {
        addArtist(req, res);
    }
}

function addArtist(req, res) {
    unqfy.addArtist({ name: req.body.name, country: req.body.country });
    const artist = unqfy.getArtistByName(req.body.name);
    saveUNQfy(unqfy, 'estado');
    res.status(200);
    res.json({
        "id": artist.id,
        "name": artist.name,
        "country": artist.country,
        "albums": artist.albums
    });
}

// GET artist by ID
router.get('/artists/:id', (req, res) => {
    const artist = unqfy.getArtistById(parseInt(req.params.id));
    if (artist !== undefined) {
        res.status(200);
        res.json(retArtist(artist));
    } else {
        res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
    }
});

// GET artist ID
router.get('/artist/:name', (req, res) => {
    // Busca el artista por nombre y devuelve su ID.
    const artist = unqfy.getArtistByName(req.params.name);
    if (artist === undefined) {
        res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
    }
    res.status(200);
    res.json({"artistId":artist.id});
});

// DELETE artist by ID
router.delete('/artists/:id', (req, res) => {
    if(artistExist(parseInt(req.params.id))){
        unqfy.deleteArtistById(parseInt(req.params.id));
        saveUNQfy(unqfy, 'estado');
        res.status(200);
        res.end();
    }else{
        res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
    }    
});

function artistExist(id){
    return unqfy.getArtistById(id) !== undefined;
}

// GET artist by name
router.get('/artists', (req, res) => {
    if (req.query.name) {
        getArtist(req.query.name, res);
    } else {
        res.status(200);
        res.send(retArtists(unqfy.artists));
    }
});

function getArtist(name, res) {
    let artists = unqfy.searchArtistByName(name.toLowerCase());
    if (artists.length !== 0) {
        res.status(200);
        res.send(retArtists(artists));
    } else {
        res.status(200).json([]);
    }
}

function retArtists(artists){
    return artists.map(artist => retArtist(artist));
}

function retArtist(artist){
    return {
        "id": artist.id,
        "name": artist.name,
        "albums": artist.albums.map(album => retAlbum(album)),
        "country": artist.country        
    };
}

//------------------------------------------------------------------

// POST album
router.post('/albums', (req, res) => {
    if(jsonIsValidForAlbums(req.body)){
        tryPostAlbum(req, res);
    }else{
        res.status(400).json({ status: 400, errorCode: "BAD_REQUEST" });
    }    
});

function jsonIsValidForAlbums(json){
    return json.hasOwnProperty('name') && json.hasOwnProperty('year') && json.hasOwnProperty('artistId');
}

function tryPostAlbum(req, res){
    let artist = unqfy.getArtistById(req.body.artistId);
    if (artist === undefined) {
        res.status(404).json({ status: 404, errorCode: "RELATED_RESOURCE_NOT_FOUND" });
    } else {
        postAlbum(artist, req, res);
    }
}

function postAlbum(artist, req, res) {
    if (artist.getAlbumByName(req.body.name) !== undefined) {
        res.status(409).json( { status: 409, errorCode: 'RESOURCE_ALREADY_EXISTS' });
    } else {
        addAlbum(req, res, artist.name);
    }
}

function addAlbum(req, res, artistName) {
    unqfy.addAlbum(artistName, { name: req.body.name, year: req.body.year });
    const album = unqfy.getAlbumByName(req.body.name);
    saveUNQfy(unqfy, 'estado');
    res.status(200);
    res.json({
        "id": album.id,
        "name": album.name,
        "year": album.year,
        "tracks": album.tracks
    });
}

// GET album by ID
router.get('/albums/:id', (req, res) => {
    const album = unqfy.getAlbumById(parseInt(req.params.id));
    if (album !== undefined) {
        res.status(200);
        res.json({
            "id": album.id,
            "name": album.name,
            "year": album.year,
            "tracks": album.tracks
        });
    } else {
        res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
    }
});

// DELETE album by ID
router.delete('/albums/:id', (req, res) => {
    if(albumExist(parseInt(req.params.id))){
        unqfy.deleteAlbumById(parseInt(req.params.id));
        saveUNQfy(unqfy, 'estado');
        res.status(200);
        res.end();
    }else{
        res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
    }   
});

function albumExist(id){
    return unqfy.getAlbumById(id) !== undefined;
}

// GET album by name
router.get('/albums', (req, res) => {
    if (req.query.name) {
        getAlbum(req.query.name, res);
    } else {
        res.status(200);
        res.send(unqfy.getAllAlbums().map(album => retAlbum(album)));
    }
});

function getAlbum(name, res) {
    let albums = unqfy.searchAlbumByName(name.toLowerCase());
    if (albums !== []) {
        res.status(200);
        res.send(retAlbums(albums));
    } else {
        res.status(404).json({ "errorcode": "RESOURCE_NOT_FOUND" });
    }
}

function retAlbums(albums){
    return albums.map(album => retAlbum(album));
}
function retAlbum(album){
    return {
        "id": album.id,
        "name": album.name,
        "year": album.year,
        "tracks": album.tracks
    };
}

router.use('/*', (req, res) => {
    res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
});

//------------------------------------------------------------------

function errorHandler(err, req, res, next) {
    console.log(err);
    if (err instanceof InvalidInputError){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
        res.status(err.status);
        res.json({status: err.status, errorCode: 'BAD_REQUEST'});
    } else {
        next(err);
    }
}

//------------------------------------------------------------------

app.use('/api', router);

app.use(errorHandler);

app.listen(port);
console.log('http://localhost:' + port + '/api');

//------------------------------------------------------------------

class APIError extends Error {
    constructor(name, statusCode, errorCode, message = null) {
        super(message || name);
        this.name = name;
        this.status = statusCode;
        this.errorCode = errorCode;
    }
}

class InvalidInputError extends APIError {
    constructor() {
        super('InvalidInputError', 400, 'INVALID_INPUT_DATA');
    }
}