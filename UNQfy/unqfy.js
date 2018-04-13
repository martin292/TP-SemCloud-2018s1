
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

class PlayList{
  constructor(name){
    this.name = name;
    this.tracks = [];
  }

  duration(){
    const reducer = (acc, cu) => cu.duration + acc;
    return this.tracks.reduce(reducer, 0);
  }

  hasTrack(aTrack){
    return this.tracks.includes(aTrack);
  }

  checkDuration(maxDuration){
    if(this.duration() > maxDuration){
      this.tracks.pop();
      this.checkDuration(maxDuration);
    }
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

  getAllAlbums(){
    const reducer = (acc, cu) => cu.albums.concat(acc);
    return this.artists.reduce(reducer, []);
  }

  getAllTracks(){
    const reducer = (acc, cu) => cu.tracks.concat(acc);
    return this.getAllAlbums().reduce(reducer, []);
  }

  getArtistByName(name) {
		return this.artists.find((artista) => (artista.name === name));   
  }

  getAlbumByName(name) {
		return this.getAllAlbums().find((album) => (album.name === name));
  }

  getTrackByName(name) {
		return this.getAllTracks().find(track => track.name === name);    
  }

  getPlaylistByName(name) {
    return this.playLists.find(p => p.name === name);
  }

  addPlaylist(name, genresToInclude, maxDuration) {
    let playlist = new PlayList(name);
    let ts = this.getTracksMatchingGenres(genresToInclude);
    
    ts = ts.filter(t => t.duration < maxDuration);

    playlist.tracks = ts;

    playlist.checkDuration(maxDuration);

    this.playLists.push(playlist);
  }

  del(){
    this.artists = [];
    this.playLists = [];
  }

  //-----------------------------------------

  save(filename = 'unqfy.json') {
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'unqfy.json') {
    const fs = new picklejs.FileSerializer();
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track, PlayList];
    fs.registerClasses(...classes);
    return fs.load(filename);
  }
}

// TODO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

