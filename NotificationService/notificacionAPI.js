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
    if(err instanceof ApiError){
        res.status(err.status); 
        res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){ 
        res.status(err.status);
        res.json({status: err.status, errorCode: 'BAD_REQUEST'}); 
    } else {
        //res.status(err.status);
        //res.json({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'}); 
        next(err); 
    } 
}

function throwError(res, e) {
    res.status(e.status).json({ status: e.status, errorCode: e.errorCode });
}

//------------------------------------------------------------------
let notificacion = null;

router.use((req, res, next) => {
    notificacion = getNotificacion('Notificaciones');
    console.log('Request received!');
    next();
});

// POST /api/subscribe
router.post('/subscribe', (req, res) => {
    try{
        checkValidJson(req.body);
        notificacion.getArtistName(parseInt(req.body.artistId))
        .then((name,) => {
            notificacion.addSubscription(name, req.body.email);
            saveNotificacion(notificacion, 'Notificaciones');
            res.status(200);
            res.end();
        }).catch((e) => { throwError(res, new errors.RelatedResourceNotFound());});     
    } catch (e){
        throwError(res, e);
    }
});

function checkValidJson(body){
    if(!hasEmailAndArtistID(body)){
        throw(new errors.BadRequest());
    }
}

function hasEmailAndArtistID(body){
    return body.hasOwnProperty('email') && body.hasOwnProperty('artistId');
}


// POST /api/unsubscribe
router.post('/unsubscribe', (req, res) => {
    try{
        checkValidJson(req.body, res);
        notificacion.getArtistName(req.body.artistId)
        .then((name) => {
            notificacion.removeSubscription(name, req.body.email);
            saveNotificacion(notificacion, 'Notificaciones');
            res.status(200);
            res.end();
        }).catch((e) => { throwError(res, new errors.RelatedResourceNotFound());});    
    } catch (e) {
        throwError(res, e); 
    }
});


// POST /api/notify
router.post('/notify', (req, res) => {
    try{
        checkJson(req.body);
        notificacion.getArtistName(req.body.artistId)
        .then((name) => {
            notificacion.notify(name, req.body.from, req.body.message, req.body.subject);
            saveNotificacion(notificacion, 'Notificaciones');
            res.status(200);
            res.end();
        }).catch((e) => { throwError(res, new errors.RelatedResourceNotFound());});
    } catch (e){
        throwError(res, e); 
    }
});

function checkJson(body){
    if(!hasProperties(body)){
        throw(new errors.BadRequest());
    }
}

function hasProperties(body) {
    return body.hasOwnProperty('artistId')
        && body.hasOwnProperty('from')
        && body.hasOwnProperty('message')
        && body.hasOwnProperty('subject');
}


// GET /api/subscriptions?artistId=<artistId>
router.get('/subscriptions', (req, res) => {
    try{
        notificacion.getArtistName(req.query.artistId)
        .then((name) => {
            res.status(200);
            res.json({
                "artistId": req.query.artistId,
                "subscriptors": notificacion.emails(name)
            });
            res.end();
        }).catch((e) => { throwError(res, new errors.RelatedResourceNotFound());});       
    }catch(e){
        throwError(res, e);
    }
});

function checkBody(body){
    if(!body.hasOwnProperty('artistId')){
        throw(new errors.BadRequest());
    }
}

// DELETE /api/subscriptions
router.delete('/subscriptions', (req, res) => {
    try{
        checkBody(req.body);
        notificacion.getArtistName(parseInt(req.body.artistId))
        .then((name) => {
            notificacion.subscriptions = notificacion.subscriptions.filter(sub => sub.nameArtist !== name);
            saveNotificacion(notificacion, 'Notificaciones');
            res.status(200);
            res.end();
        }).catch((e) => { throwError(res, new errors.RelatedResourceNotFound());});      
    } catch (e){
        throwError(res, e);
    }
});


router.use('/*', (req, res) => {
    throwError(res, new errors.ResourceNotFound());
});


//------------------------------------------------------------------

app.use('/api', router);

app.use(errorHandler);

app.listen(port);
console.log('http://localhost:' + port + '/api');

//------------------------------------------------------------------
