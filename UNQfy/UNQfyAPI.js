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
    if (unqfy.getArtistByName(req.body.name) !== undefined) {
        res.status(409).json({ "errorcode": "RESOURCE_ALREADY_EXISTS" });
    } else {
        addArtist(req, res);
    }
});

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
        res.json({
            "id": artist.id,
            "name": artist.name,
            "country": artist.country,
            "albums": artist.albums.map(album => album.name)
        });
    } else {
        res.status(404).json({ "errorcode": "RESOURCE_NOT_FOUND" });
    }
});

// DELETE artist by ID
router.delete('/artists/:id', (req, res) => {
    unqfy.deleteArtistById(parseInt(req.params.id));
    saveUNQfy(unqfy, 'estado');
    res.status(200);
    res.end();
});

// GET artist by name
router.get('/artists', (req, res) => {
    if (req.query.name) {
        getArtist(req.query.name, res);
    } else {
        res.status(200);
        res.send(unqfy.artists.map(artist => artist.name));
    }
});

function getArtist(name, res) {
    let artist = unqfy.getArtistByName(name);
    if (artist !== undefined) {
        res.status(200);
        res.send(artist);
    } else {
        res.status(404).json({ "errorcode": "RESOURCE_NOT_FOUND" });
    }
}

//------------------------------------------------------------------

// POST album
router.post('/albums', (req, res) => {
    let artist = unqfy.getArtistById(req.body.artistId);
    if (artist === undefined) {
        res.status(404).json({ "errorcode": "RELATED_RESOURCE_NOT_FOUND" });
    } else {
        postAlbum(artist, req, res);
    }
});

function postAlbum(artist, req, res) {
    if (artist.getAlbumByName(req.body.name) !== undefined) {
        res.status(409).json({ "errorcode": "RESOURCE_ALREADY_EXISTS" });
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
        res.status(404).json({ "errorcode": "RESOURCE_NOT_FOUND" });
    }
});

// DELETE album by ID
router.delete('/albums/:id', (req, res) => {
    unqfy.deleteAlbumById(parseInt(req.params.id));
    saveUNQfy(unqfy, 'estado');
    res.status(200);
    res.end();
});

// GET album by name
router.get('/albums', (req, res) => {
    if (req.query.name) {
        getAlbum(req.query.name, res);
    } else {
        res.status(200);
        res.send(unqfy.getAllAlbums().map(album => album.name));
    }
});

function getAlbum(name, res) {
    let album = unqfy.getAlbumByName(name);
    if (album !== undefined) {
        res.status(200);
        res.send({
            "name": album.name,
            "year": album.year,
            "id": album.id,
            "tracks": album.tracks,
            "artist": album.artist.name
        });
    } else {
        res.status(404).json({ "errorcode": "RESOURCE_NOT_FOUND" });
    }
}

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