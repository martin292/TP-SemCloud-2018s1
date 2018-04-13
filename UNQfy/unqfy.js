
const picklejs = require('picklejs');

let artists = [];
let albums  = [];
let tracks  = [];

let playlists = [];

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
		this.tracks = [];
	}
}

class Track{
	constructor(name, duration, genres){
		this.name = name;
		this.duration = duration;
		this.genres = genres;	
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

  restart(){
    artists = [];
    albums = [];
    tracks = [];
  }

  getTracksMatchingGenres(genres) {
		return tracks.filter(track => track.matchGenres(genres));
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
		artists.push(new Artist(params.name, params.country));
  }

  addAlbum(artistName, params) {
		let album = new Album(params.name, params.year);
		let artist = this.getArtistByName(artistName);
		
		artist.albums.push(album);
		albums.push(album);
  }

  addTrack(albumName, params) {
		let track = new Track(params.name, params.duration, params.genres);
		let album = this.getAlbumByName(albumName);

		album.tracks.push(track);
		tracks.push(track);
  }

  getArtistByName(name) {
		return artists.find(artist => artist.name === name);
  }

  getAlbumByName(name) {
		return albums.find(album => album.name === name);
  }

  getTrackByName(name) {
		return tracks.find(track => track.name === name);
  }

  getPlaylistByName(name) {
    return playlists.find(playlist => playlist.name === name);
  }

  addPlaylist(name, genresToInclude, maxDuration) {
    let playlist = new Playlist(name);
    let ts = this.getTracksMatchingGenres(genresToInclude);
    
    ts = ts.filter(t => t.duration < maxDuration);

    //FALTA RANDOMIZAR LA LISTA

    playlist.tracks = ts;

    playlists.push(playlist);
  }

  //----

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

