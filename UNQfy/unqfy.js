
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
	constructor(name, year, artist){
		this.name = name;
    this.year = year;
    this.artist = artist;
		this.tracks = [];
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
}

class Playlist{
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
    this.artists   = [];
    this.albums    = [];//TODO: Eliminar lista
    this.tracks    = [];//TODO: Eliminar lista
    this.playlists = [];
  }

  //TODO: Actualizar (Buscar en la lista de tracks de los albunes de los artistas)
  getTracksMatchingGenres(genres) {
		return this.tracks.filter(track => track.matchGenres(genres));
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
		this.artists.push(new Artist(params.name, params.country));
  }

  addAlbum(artistName, params) {
    let artist = this.getArtistByName(artistName);
    let album = new Album(params.name, params.year, artist);
				
		artist.albums.push(album);
		this.albums.push(album);//TODO: Eliminar esta linea
  }

  addTrack(albumName, params) {
    let album = this.getAlbumByName(albumName);
    let track = new Track(params.name, params.duration, params.genres, album);
		
		album.tracks.push(track);
		this.tracks.push(track);//TODO: Eliminar esta linea
  }

  getArtistByName(name) {
		return this.artists.find(artist => artist.name === name);
  }

  //TODO: Actualizar (Buscar el la lista de albunes de los artistas)
  getAlbumByName(name) {
		return this.albums.find(album => album.name === name);
  }

  //TODO: Actualizar (Buscar en la lista de tracks de los albunes de los artistas)
  getTrackByName(name) {
		return this.tracks.find(track => track.name === name);
  }

  getPlaylistByName(name) {
    return this.playlists.find(playlist => playlist.name === name);
  }

  addPlaylist(name, genresToInclude, maxDuration) {
    let playlist = new Playlist(name);
    let ts = this.getTracksMatchingGenres(genresToInclude);
    
    ts = ts.filter(t => t.duration < maxDuration);

    //FALTA RANDOMIZAR LA LISTA

    playlist.tracks = ts;

    this.playlists.push(playlist);
  }

  //----

  del(){
    this.artists = [];
    this.albums = [];//TODO: Eliminar esta linea
    this.tracks = [];//TODO: Eliminar esta linea
    this.playlists = [];
  }

  save(filename = 'unqfy.json') {
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'unqfy.json') {
    const fs = new picklejs.FileSerializer();
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track, Playlist];
    fs.registerClasses(...classes);
    return fs.load(filename);
  }
}

// TODO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

