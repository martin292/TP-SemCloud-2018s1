let express = require('express');
let app = express();
let bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let router = express.Router();
let port = process.env.PORT || 8080;

//------------------------------------------------------------------

router.use((req, res, next) => {
    //
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
});


//------------------------------------------------------------------

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);