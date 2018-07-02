const notificacion = require('./notificacion');

let express = require('express');
let app = express();
let bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let router = express.Router();
let port = process.env.PORT || 5001;

//------------------------------------------------------------------



//------------------------------------------------------------------
let notificacion = new Notification();

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
   
});


// DELETE /api/subscriptions
router.delete('/subscriptions', (req, res) => {
       
});


//------------------------------------------------------------------

app.use('/api', router);

app.listen(port);
console.log('http://localhost:' + port + '/api');

//------------------------------------------------------------------
