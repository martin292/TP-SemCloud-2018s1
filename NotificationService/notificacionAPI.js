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
    console.error(err); // imprimimos el error en consola 
    // Chequeamos que tipo de error es y actuamos en consecuencia
    if(err instanceof ApiError  ){
        res.status(err.status); 
        res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
        // body-parser error para JSON invalido   
        res.status(err.status);
        res.json({status: err.status, errorCode: 'BAD_REQUEST'}); }
      else {
             // continua con el manejador de errores por defecto
        res.status(err.status)
        res.json({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'})   
        next(err); 
    } 
}

function throwError(res, e) {
    res.status(e.status).send(e);
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
      if(!req.body  || !req.body.email || req.body.artistId === undefined){
        throwError(res, new BadRequest);
      }else{
        try{
          let artist = notificacion.getArtistName(req.body.artistId);
          notificacion.addSubscription(artist, req.body.email);
          saveNotificacion(notificacion, 'Notificaciones');
        } catch (e){
            throwError(res, new ResourceAlreadyExist);
        }
      }
      res.status(200);
});


// POST /api/unsubscribe
router.post('/unsuscribe', (req, res) => {
      if(!req.body  || !req.body.email || req.body.artistId === undefined){
        throwError(res, new BadRequest);
      }else {
          try{
            let artistName = notificacion.getArtistName(req.body.artistId);  
            notificacion.removeSubsciption(artistName, req.body.email);
            saveNotificacion(notificacion, 'Notificaciones');
          } catch (e) {
            throwError(res, new ResourceAlreadyExist); 
          }
      } 
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
      let artistId = notificacion.getArtistId(req.body.name);
      let subscripciones = notificacion.getSubscripciones(artistId);
      res.status(200);
      res.json({
        "id": artistId,
        "subscriptors": notificacion.subscriptors(artistId) 
    });
});


// DELETE /api/subscriptions
router.delete('/subscriptions', (req, res) => {
    if(!req.body.artistId || req.body.artistId === undefined){
        throwError(res, new BadRequest);
    }else{
        try{
            notificacion.deleteSubscripcionesArtista(req.body.artistId);
            saveNotificacion(notificacion, 'Notificaciones');
        } catch (e){
            throwError(res, new ResourceAlreadyExist);
        }     
    }
    res.status(200);
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
