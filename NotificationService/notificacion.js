const picklejs = require('picklejs');
const nodemailer = require('nodemailer');
const rp = require('request-promise');
//const errors = require('./errors');

//---------------------------------------------------

class Subscription{
    constructor(nameArtist, email){
        this.nameArtist = nameArtist;
        this.email = email;
    }

    compare(name, email){
        return (this.nameArtist === name && this.email === email);
    }
}

class Notification{ 
    constructor(){
        this.subscriptions = [];
    }

    getArtistName(id) {
        const options = {
            url: 'http://localhost:5000/api/artists/' + id,
            method: 'GET',
            json: true
        };

        return rp(options)
            .then((res) => { return res.name; })
            .catch((e) => { throw e; });
    }

    addSubscription(name, email){
        let sub = new Subscription(name, email);
        if(!this.subscriptions.includes(sub)){
            this.subscriptions.push(sub);
        }
    }

    removeSubscription(name, email){
        this.subscriptions = this.subscriptions.filter(sub => !sub.compare(name, email));
    }

    getSubscripciones(idArtista){ 
        let artistName = getArtistName(idArtista);
        return this.subscriptions.filter(sub => sub.nameArtist === artistName);
    }


    notify(name, from, message, subject){
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'tu.email@gmail.com',
                pass: 'pass',
            },
        });

        const mailOptions = {
            from: from,
            to: this.emails(name),
            subject: subject , 
            text: message,
            html: '<b>Hello</b>'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw(error);
            } else {
                console.log(info);
            }
        });
    }

    emails(name){
        return this.subscriptions.filter(sub => sub.nameArtist === name).map(sub => sub.email).join();
    }

// Busca el artista por nombre y devuelve el id 
/*
    getArtistId(name){
        let idArtist;
        const options = {
            url: 'http://localhost:5000/api/artists/' + name,
            method: 'GET',
            json: true
        };
        rp(options).then((res) => idArtist = res.id);
        
        return idArtist;
    }

    subscriptors(idArtist){
        let artistName = getArtistName(idArtista);
        let suscripciones = this.subscriptions.filter(sub => sub.nameArtist === artistName);
        return suscripciones.map(sub => sub.email).join();
    }
*/

//----------------------------------------------------
  
  save(filename = 'notificacion.json') {
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'notificacion.json') {
    const fs = new picklejs.FileSerializer();
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [Notification, Subscription];
    fs.registerClasses(...classes);
    return fs.load(filename);
  }
}

// TODO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  Notification,
};

