const unqfyAPI = require('./UNQfy/UNQfyAPI');

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
}
