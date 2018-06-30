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

// POST /api/subscribe
router.post('/suscribe', (req, res) => {
      
});


// POST /api/unsubscribe
router.post('/unsuscribe', (req, res) => {
      
});


// POST /api/notify
router.post('/notify', (req, res) => {
      
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
