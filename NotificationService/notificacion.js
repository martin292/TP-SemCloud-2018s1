//const unqfyAPI = require('./UNQfy/UNQfyAPI');
const nodemailer = require('nodemailer');

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
        this.rp = require('request-promise');
    }

    getArtistName(id){
        let name;
        const options = {
            url: 'http://localhost:5000/api/artists/' + id,
            method: 'GET',
            json: true
        };
        rp.get(options).then((res) => name = res.name);
        
        return name;
    }

    addSubscription(name, email){
        let sub = new Subscription(name, email);
        if(!this.subscriptions.includes(sub)){
            this.subscriptions.push(sub);
        }
    }

    removeSubscription(name, email){
        this.subscriptions = this.subscriptions.filter(sub => sub.name !== name && sub.email !== email);
    }

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
                console.log(error);
            } else {
                console.log(info);
            }
        });
    }

    emails(name){
        return this.subscriptions.map(sub => sub.email).join();
    }
}

