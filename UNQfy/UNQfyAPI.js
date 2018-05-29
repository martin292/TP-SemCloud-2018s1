let express = require('express');
let app = express();
let bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let router = express.Router();
let port = process.env.PORT || 8080;

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

app.listen(port);
console.log('http://localhost:' + port + '/api');