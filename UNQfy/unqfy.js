
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

  print(){
    console.log(' ');
    console.log('Name: ' + this.name);
    console.log('Country: ' + this.country);
    console.log('Albums: ' + this.albums.map(a => a.name));
  }
}

class Album{
	constructor(name, year, artist){
		this.name = name;
    this.year = year;
    this.artist = artist;
		this.tracks = [];
  }
  
  getTracksMatchingGenres(genres){
    return this.tracks.filter(t => t.matchGenres(genres));
  }

  print(){
    console.log(' ');
    console.log('Name: ' + this.name);
    console.log('Year: ' + this.year);
    console.log('Artist: ' + this.artist.name);
    console.log('Tracks: ' + this.tracks.map(t => t.name));
  }
}

class Track{
	constructor(name, duration, genres, album){
		this.name = name;
		this.duration = duration;
    this.genres = genres;
    this.album = album;
	}

	matchGenres(genres){
    return this.genres.some(g => genres.includes(g));
  }
  
  print(){
    console.log(' ');
    console.log('Name: ' + this.name);
    console.log('Duration: ' + this.duration);
    console.log('Album: ' + this.album.name);
    console.log('Genre: ' + this.genres);
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

  print(){
    console.log(' ');
    console.log('Name: ' + this.name);
    console.log('Tracks: ' + this.tracks.map(t => t.name));    
  }
}

class Exception{
  constructor(_messagge){
      this.messagge = _messagge;
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
    const reducer = (acc, cu) => cu.tracks.concat(acc);
    return artist.albums.reduce(reducer, []);
  }

  exists(param){
      return param !== undefined;
  }

  addArtist(params) {
    if(this.artists.includes(this.getArtistByName(params.name))){
      throw new Exception("Error"); 
    }
      this.artists.push(new Artist(params.name, params.country));
  }

  addAlbum(artistName, params) {
    let artist = this.getArtistByName(artistName);
    const album = new Album(params.name, params.year, artist);

    if(this.getAllAlbums().includes(this.getAlbumByName(params.name))){
      throw new Exception("Error"); 
    }
    artist.albums.push(album);
  }

  addTrack(albumName, params) {
    let album = this.getAlbumByName(albumName);
    const track = new Track(params.name, params.duration, params.genres, album);

    //album.tracks.push(track);

    if(this.getAllTracks().includes(this.getTrackByName(params.name))){
      throw new Exception("Error"); 
    }
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
    return this.getByName(name, this.artists);   
  }

  getAlbumByName(name) {
    return this.getByName(name, this.getAllAlbums());
  }

  getTrackByName(name) {
    return this.getByName(name, this.getAllTracks());    
  }

  getPlaylistByName(name) {
    return this.getByName(name, this.playLists);
  }

  getByName(name, list){
    return list.find(element => element.name === name);
  }

  addPlaylist(name, genresToInclude, maxDuration) {
    let playlist = new PlayList(name);
    let tracks = this.getTracksMatchingGenres(genresToInclude);
    
    tracks = tracks.filter(t => t.duration < maxDuration);

    playlist.tracks = tracks;

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

