
const picklejs = require('picklejs');

//---------------------------------------

class Artist{	
	constructor(name, country){
		this.name = name;
		this.country = country;
		this.albums = [];
  }
  
  getTracksMatchingGenres(genres){
    const reducer = (acc, cu) => cu.getTracksMatchingGenres(genres).concat(acc);
    return this.albums.reduce(reducer, []);
  }
}

class Album{
	constructor(name, year){
		this.name = name;
    this.year = year;
    this.artist = {};
		this.tracks = [];
  }
  
  getTracksMatchingGenres(genres){
    return this.tracks.filter(t => t.matchGenres(genres));
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
  constructor(name){
    this.name = name;
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


  getTracksMatchingGenres(genres) {
    const reducer = (acc, cu) => cu.getTracksMatchingGenres(genres).concat(acc);
    return this.artists.reduce(reducer, []);
  }

  getTracksMatchingArtist(artist) {
    const a = artist.albums;    
    let t = [];

    a.forEach(album => {
      if(album.tracks.length !== 0)
        t = t.concat(album.tracks);
    });
    return t;
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
		let artist = this.artists.find((artista) => (artista.name === name));
    
    if(typeof (artist) !== "undefined"){
      return artist;
    }else{
      console.log("no hay artista con ese nombre")
    }
  }

  
  getAlbumByName(name) {
		return this.getAllAlbums().find((album) => (album.name === name));
    /*
    if(typeof (album) !== "undefined"){
      return album;
    }else{
      console.log("no hay album con ese nombre")
    }
    */
  }

  /*
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
  */

  getAllAlbums(){
    const reducer = (acc, cu) => cu.albums.concat(acc);
    return this.artists.reduce(reducer, []);
  }

  getAllTracks(){
    const reducer = (acc, cu) => cu.tracks.concat(acc);
    return this.getAllAlbums().reduce(reducer, []);
  }

  getTrackByName(name) {
		return this.getAllTracks().find(track => track.name === name);

    /*
    let track = this.getTracks().find((track) => (track.name === name));
    
    if(typeof (track) !== "undefined"){
      return track;
    }else{
      console.log("no hay track con ese nombre")
    }
    */
  }




  /*
  getTracks(){
    let allTracks = [];
    let allAlbums = this.getAlbums();
    
    for (let i in allAlbums){
      let tracks = allAlbums[i].tracks;
      for(let j in tracks){
        allTracks.push(tracks[j]);  
      }
    }
    return allTracks;
>>>>>>> 77077e6c1f23cac21c03fa89b9d836ce977fa86f
  }
  */




  getPlaylistByName(name) {
    return this.playLists.find(p => p.name === name);
  }

  addPlaylist(name, genresToInclude, maxDuration) {
    let playlist = new PlayList(name);
    let ts = this.getTracksMatchingGenres(genresToInclude);
    
    ts = ts.filter(t => t.duration < maxDuration);

    //FALTA RANDOMIZAR LA LISTA

    playlist.tracks = ts;

    this.playLists.push(playlist);
  }

  del(){
    this.artists = [];
    this.playLists = [];
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
  UNQfy, //Artist, Album, Track, Genre, PlayList,
};

