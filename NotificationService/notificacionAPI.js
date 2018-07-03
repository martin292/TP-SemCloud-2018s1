let express = require('express');
let app = express();
let bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let router = express.Router();
let port = process.env.PORT || 5001;

//------------------------------------------------------------------

const fs = require('fs');
const notiMod = require('./notificacion');

function getNotificacion(filename) {
    let noti = new notiMod.Notification();
    if (fs.existsSync(filename)) {
        console.log();
        noti = notiMod.Notification.load(filename);
    }
    return noti;
}

function saveNotificacion(noti, filename) {
    console.log('Save!');
    noti.save(filename);
}

//------------------------------------------------------------------
let notificacion = null;

router.use((req, res, next) => {
    notificacion = getNotificacion('Notificaciones');
    console.log('Request received!');
    next();
});

// POST /api/subscribe
router.post('/suscribe', (req, res) => {
      let artist = notificacion.getArtistName(req.body.artistId);
      notificacion.addSubscription(artist, req.body.email);
      res.status(200);
});


// POST /api/unsubscribe
router.post('/unsuscribe', (req, res) => {
      let artist = notificacion.getArtistName(req.body.artistId);
      notificacion.removeSubsciption(artist, req.body.email);
      res.status(200);
});


// POST /api/notify
router.post('/notify', (req, res) => {
      let artist = notificacion.getArtistName(req.body.artistId);
      notification.notify(artist, req.body.from, req.body.message, req.body.subject);
      res.status(200);
});


// GET /api/subscriptions
router.get('/subscriptions', (req, res) => {
      let artistId = notificacion.getArtistById(req.body.name);
      let subscripciones = notificacion.getSubscripciones(artistId);
      res.status(200);
      res.json({
        "id": artist.id,
        "subscriptors": artist.subscripciones // ?????
    });
});


// DELETE /api/subscriptions
router.delete('/subscriptions', (req, res) => {
    if(!req.body.artistId || req.body.artistId === undefined){
        res.status(400).json({ status: 400, errorCode: "BAD_REQUEST" });
    }else{
        notificacion.deleteSubscripcionesArtista(req.body.artistId);
        saveNotificacion(notificacion, 'Notificaciones');
   }
   res.status(200);
});

router.use('/*', (req, res) => {
    res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
});


//------------------------------------------------------------------

app.use('/api', router);

app.listen(port);
console.log('http://localhost:' + port + '/api');

//------------------------------------------------------------------
