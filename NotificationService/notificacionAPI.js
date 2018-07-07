let express = require('express');
let app = express();
let bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let router = express.Router();
let port = process.env.PORT || 5001;

let errors = require('./errors');
let ApiError = errors.APIError;

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

function errorHandler(err, req, res, next) {
    //console.error(err);
    if(err instanceof ApiError  ){
        res.status(err.status); 
        res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){ 
        res.status(err.status);
        res.json({status: err.status, errorCode: 'BAD_REQUEST'}); }
      else {
        res.status(err.status)
        res.json({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'})   
        next(err); 
    } 
}

function throwError(res, e) {
    res.status(e.status).json({ status: e.status, errorCode: e.errorCode }).send(e);
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
    try{
        checkValidJson(req.body);
        let artist = notificacion.getArtistName(req.body.artistId);
        notificacion.addSubscription(artist, req.body.email);
        saveNotificacion(notificacion, 'Notificaciones');
        res.status(200);
    } catch (e){
        throwError(res, e);
    }
});

function checkValidJson(body){
    if(!hasEmailAndArtistID(body)){
        throw(new BadRequest);
    }
}

function hasEmailAndArtistID(body){
    return body.hasOwnProperty('email') && body.hasOwnProperty('artistID');
}


// POST /api/unsubscribe
router.post('/unsuscribe', (req, res) => {
    try{
        checkValidJson(req.body, res);
        let artistName = notificacion.getArtistName(req.body.artistId);  
        notificacion.removeSubsciption(artistName, req.body.email);
        saveNotificacion(notificacion, 'Notificaciones');
        res.status(200);
    } catch (e) {
        throwError(res, e); 
    }
});


// POST /api/notify
router.post('/notify', (req, res) => {
    try{
        checkJson(req.body, res);
        let artist = notificacion.getArtistName(req.body.artistId);
        notification.notify(artist, req.body.from, req.body.message, req.body.subject);
        saveNotificacion(notificacion, 'Notificaciones');
        res.status(200);
    } catch (e){
        throwError(res, e); 
    }
});

function checkJson(body, res){
    if(!hasProperties(body)){
        throw(new BadRequest);
    }
}

function hasProperties(body) {
    return body.hasOwnProperty('artistID')
        && body.hasOwnProperty('from')
        && body.hasOwnProperty('message')
        && body.hasOwnProperty('subject');
}


// GET /api/subscriptions
router.get('/subscriptions', (req, res) => {
    try{
        checkBody(body);
        let artistName = notificacion.getArtistName(req.body.artistId);
        res.status(200);
        res.json({
            "artistId": req.body.artistId,
            "subscriptors": notificacion.emails(artistName)
        });
    }catch(e){
        throwError(res, e);
    }
});

function checkBody(body){
    if(!body.hasOwnProperty('artistID')){
        throw(new BadRequest);
    }
}

// DELETE /api/subscriptions
router.delete('/subscriptions', (req, res) => {
    try{
        notificacion.deleteSubscripcionesArtista(req.body.artistId);
        saveNotificacion(notificacion, 'Notificaciones');
        res.status(200);
    } catch (e){
        throwError(res, e);
    }
});


router.use('/*', (req, res) => {
    throwError(res, new ResourceNotFound);
});


//------------------------------------------------------------------

app.use('/api', router);

app.use(errorHandler);

app.listen(port);
console.log('http://localhost:' + port + '/api');

//------------------------------------------------------------------
