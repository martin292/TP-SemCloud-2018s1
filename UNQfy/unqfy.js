
const picklejs = require('picklejs');

//---------------------------------------

class Artist{	
	constructor(name, country){
		this.name = name;
		this.country = country;
		this.albums = [];
	}
}

class Album{
	constructor(name, year){
		this.name = name;
    this.year = year;
    this.artist = {};
		this.tracks = [];
	}
}

class Track{
	constructor(name, duration, genres){
		this.name = name;
		this.duration = duration;
    this.genres = genres;
    this.album = {};
	}

	matchGenres(genres){
    return this.genres.some(g => genres.includes(g));
	}
}

// hay q ver si Genero lo ponemos como un objeto
class Genre{
  constructor(_name){
  this.name = _name;
  }
};

class PlayList{
  constructor(_name, _duration){//????
    this.name = _name;
    this.duration = _duration;
    this.tracks = [];
  }

  duration(){
    const reducer = (acc, cur) => acc + cur.duration;
    return this.tracks.reduce(reducer, 0);;
  }

  hasTrack(aTrack){
    return this.tracks.includes(aTrack);
  }
}

//---------------------------------------

class UNQfy {
  constructor(){
    this.artists = [];
    this.playLists = [];
  }

  //TODO: Actualizar (Buscar en la lista de tracks de los albunes de los artistas)
  getTracksMatchingGenres(genres) {
    // corregir ???????????????????????????????????
		//return this.tracks.filter(track => track.matchGenres(genres));
  }

  getTracksMatchingArtist(artist) {
    // corregir ????????????????????????????????????
    /*
    const a = artist.albums;    
    let t = [];

    a.forEach(album => {
      if(album.tracks.length !== 0)
        t = t.concat(album.tracks);
    });
    return t;
    */
  }

  addArtist(params) {
		let a = new Artist(params.name, params.country);
    
    this.artists.push(a);
  }

  addAlbum(artistName, params) {
    let album = new Album(params.name, params.year);
    let artista = this.getArtistByName(artistName);
    
    album.artist = artista;
    artista.albums.push(album);
  }

  addTrack(albumName, params) {
    let track = new Track(params.name, params.duration, params.genres);
		let album = this.getAlbumByName(albumName);

    track.album = album;
    album.tracks.push(track);
  }

  getArtistByName(name) {
		let a = this.artists.find((artista) => (artista.name === name));
    
    if(typeof (a) !== "undefined"){
      return a;
    }else{
      console.log("no hay artista con ese nombre")
    }
  }

  //TODO: Actualizar (Buscar el la lista de albunes de los artistas)
  getAlbumByName(name) {
		return this.getAlbums().find((album) => (album.name === name));
  }

  getAlbums(){
    let allAlbums = [];

    for (let i in this.artists){
      let albums = this.artists[i].albums;
      for(let j in albums){
        allAlbums.push(albums[j]);  
      }
    }

    return allAlbums;
  }

  //TODO: Actualizar (Buscar en la lista de tracks de los albunes de los artistas)
  getTrackByName(name) {
		
  }

  getPlaylistByName(name) {
    
  }

  addPlaylist(name, genresToInclude, maxDuration) {
    /* El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist
    */

    // corregir ??????????????????????????????
    /*
    let playlist = new Playlist(name);
    let ts = this.getTracksMatchingGenres(genresToInclude);
    
    ts = ts.filter(t => t.duration < maxDuration);

    //FALTA RANDOMIZAR LA LISTA

    playlist.tracks = ts;

    this.playlists.push(playlist);
    */
  }


  save(filename = 'unqfy.json') {
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'unqfy.json') {
    const fs = new picklejs.FileSerializer();
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track, Genre, PlayList];
    fs.registerClasses(...classes);
    return fs.load(filename);
  }
}

// TODO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,Artist,Album,Track,Genre,PlayList,
};

