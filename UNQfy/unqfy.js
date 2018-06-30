
const picklejs = require('picklejs');
const rp = require('request-promise');
const notificacionAPI = require('./NotificationService/notificacionAPI');

//---------------------------------------

class Observer{

}

class Artist{	
	constructor(name, country, id){
		this.name = name;
		this.country = country;
    this.albums = [];
    this.id = id;
  }

  getAlbumByName(name){
    return this.albums.find(album => album.name === name);
  }

  deleteAlbum(id){
    this.albums = this.albums.filter(album => album.id !== id);
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
	constructor(name, year, artist, id){
		this.name = name;
    this.year = year;
    this.artist = artist;
    this.tracks = [];
    this.id = id;
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
	constructor(name, duration, genres, album, id){
		this.name = name;
		this.duration = duration;
    this.genres = genres;
    this.album = album;
    this.lyric = null;
    this.BASE_URL = 'http://api.musixmatch.com/ws/1.1';
    this.id = id;
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

  getLyrics(){
    rp.get(this.getOption()).then((res) => {
      this.id = res.message.body.track_list[0].track.track_id;
      this.printLyricks();
    }).catch((err) => console.log(err));
  }

  printLyricks(){
    rp.get({
      uri: this.BASE_URL + '/track.lyrics.get?track_id=' + this.id,
      qs: {
          apikey: '487a658c7713a6b3ab5332c9ca488511',
          track_id: this.id
      },
      json: true
    }).then((res) => {
      this.lyric = res.message.body.lyrics.lyrics_body;
      console.log(this.lyric);
    }).catch((err) => console.log(err));
  }

  getOption(){
    return {
      uri: this.BASE_URL + '/track.search??q_artist=' + this.artistName() + '&q_track=' + this.name + '&page_size=1',
      qs: {
          apikey: '487a658c7713a6b3ab5332c9ca488511',
          q_artist: this.artistName(),
          q_track: this.name
      },
      json: true
    }
  }

  artistName(){return this.album.artist.name;}
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
    this.idArtist = 1;
    this.idAlbum = 1;
    this.idTrack = 1;
  }
  
  populateAlbumsForArtist( artistName){
    const options = {
      url: 'https://api.spotify.com/v1/search?q=' + artistName + '&type=artist',
      headers: { Authorization: 'Bearer BQCs07CIBqTHU4Xsood58jN-dBcjPX4BO6ju4yKo-2jCLwwe92NYoa6dY_xJyu7D2JbtFdH77HF0s0C9yMkZOiKwr7udOnYg5uWkgoD4erHlqQwB7tZKP7bPXGSMLtAUjtyZZtKDZg7O_cFU8IoPTeIMTH-nK5KNlKc4A1s4-ptofVwDZu3fSQ'},
      json: true
    };
    
    rp.get(options).then((res) => {
      this.addArtist({name: artistName, country: 'country'});
      let artist = this.findArtist(res, artistName);
      this.getAlbums(artist).then((a) => this.addAlbums(a, artistName));
    });
  }

  addAlbums(list, name){
    list.map((album) => this.addAlbum(name, {name: album, year: 0}));
  }

  findArtist(res, name){
    return res.artists.items.find((i) => i.name === name);
  }

  getAlbums(artist){
    const options = {
      url: 'https://api.spotify.com/v1/artists/' + artist.id +'/albums',
      headers: { Authorization: 'Bearer BQCs07CIBqTHU4Xsood58jN-dBcjPX4BO6ju4yKo-2jCLwwe92NYoa6dY_xJyu7D2JbtFdH77HF0s0C9yMkZOiKwr7udOnYg5uWkgoD4erHlqQwB7tZKP7bPXGSMLtAUjtyZZtKDZg7O_cFU8IoPTeIMTH-nK5KNlKc4A1s4-ptofVwDZu3fSQ'},
      json: true
    };
    
    return rp.get(options).then((res) => {
      let albumes = [];
      res.items.map((album) => albumes.push(album.name));
      return albumes;
    });
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
    if(this.getArtistByName(params.name) !== undefined){
      throw new Exception("El artista ya existe"); 
    }
    this.artists.push(new Artist(params.name, params.country, this.idArtist));
    this.idArtist++;
  }

  removeArtist(params){  
    if(this.getArtistByName(params) === undefined){
      throw new Exception("El artista no existe"); 
    } 
      this.artists = this.artists.filter(a => a.name !== params);
  }

  addAlbum(artistName, params) {
    if(this.getAlbumByName(params.name) !== undefined){
      throw new Exception("El album ya existe"); 
    }
    let artist = this.getArtistByName(artistName);
    const album = new Album(params.name, params.year, artist, this.idAlbum);
    artist.albums.push(album);
    this.idAlbum++;
  }

  addTrack(albumName, params) {
    if(this.getTrackByName(params.name) !== undefined){
      throw new Exception("El track ya existe"); 
    }
    let album = this.getAlbumByName(albumName);
    const track = new Track(params.name, params.duration, params.genres, album, this.idTrack);
    album.tracks.push(track);
    this.idTrack++;
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

  getArtistById(id){
    return this.getByID(id, this.artists);
  }

  getAlbumByName(name) {
    return this.getByName(name, this.getAllAlbums());
  }

  getAlbumById(id){
    return this.getByID(id, this.getAllAlbums());
  }

  getTrackByName(name) {
    return this.getByName(name, this.getAllTracks());    
  }

  getAlbumById(id){
    return this.getByID(id, this.getAllAlbums());
  }

  getPlaylistByName(name) {
    return this.getByName(name, this.playLists);
  }

  getByName(name, list){
    return list.find(element => element.name === name);
  }

  searchArtistByName(name){
    return this.searchByName(name, this.artists);
  }

  searchAlbumByName(name){
    return this.searchByName(name, this.getAllAlbums());
  }

  searchByName(name, list){
    return list.filter(element => element.name.toLowerCase().indexOf(name) !== -1);
  }

  getByID(id, list){
    return list.find(element => element.id === id);
  }

  deleteArtistById(id){
    this.artists = this.artists.filter(artist => artist.id !== id);
  }

  deleteAlbumById(id){
    this.artists.map(artist => artist.deleteAlbum(id));
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


//Test Spotify
/*
let unq = new UNQfy();
unq.populateAlbumsForArtist('Queen');
setTimeout(function(){console.log(unq.artists.find(a => a.name === 'Queen').albums)}, 2000);
*/

//Test MusixMatch
/*
let artist = new Artist('Queen', 'england');
let album = new Album('The works', 0, artist);
let track = new Track('I want to break free', 0, 'rock', album);

track.getLyrics();
*/