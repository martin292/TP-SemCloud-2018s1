const picklejs = require('picklejs');
const nodemailer = require('nodemailer');
const rp = require('request-promise');
const errors = require('./errors');

//---------------------------------------------------

class Subscription{
    constructor(nameArtist, email){
        this.nameArtist = nameArtist;
        this.email = email;
    }
}

class Notification{ 
    constructor(){
        this.subscriptions = [];
        
    }

    getArtistName(id) {
        //let name;
        const options = {
            url: 'http://localhost:5000/api/artists/' + id,
            method: 'GET',
            json: true
        };

        return rp(options)
            .then((res) => {
                return res.name;
            })
            .catch((e) => { 
                //console.log(e);
                throw e;
            });
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
*/

    addSubscription(name, email){
        let sub = new Subscription(name, email);
        if(!this.subscriptions.includes(sub)){
            this.subscriptions.push(sub);
        }
    }

    removeSubscription(name, email){
        this.subscriptions = this.subscriptions.filter(sub => sub.nameArtist !== name && sub.email !== email);
    }

    getSubscripciones(idArtista){ 
        let artistName = getArtistName(idArtista);
        return this.subscriptions.filter(sub => sub.nameArtist === artistName);
    }

    deleteSubscripcionesArtista(idArtista){
        try{
            this.getArtistName(idArtista).then((name) => {
                this.subscriptions = this.subscriptions.filter(sub => sub.nameArtist !== name);
            });
        }catch(e){throw e;}        
    }

/*
    subscriptors(idArtist){
        let artistName = getArtistName(idArtista);
        let suscripciones = this.subscriptions.filter(sub => sub.nameArtist === artistName);
        return suscripciones.map(sub => sub.email).join();
    }
*/

    notify(name, from, message, subject){
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // server para enviar mail desde gmail
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: '<suCuentaDeGmail>',
                pass: '<suPasswordEnTextoPlano>',
            },
        });

        const mailOptions = {
            from: from, // sender address
            to: this.emails(name), // list of receivers
            subject: subject , // Subject line
            text: message, // plain text body
            html: '<b>Hello</b>' // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw(new InternalServerError);
            } else {
                console.log(info);
            }
        });
    }

    emails(name){
        return this.subscriptions.filter(sub => sub.artistName !== name).map(sub => sub.email).join();
    }

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

