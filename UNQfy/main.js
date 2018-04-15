

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy');

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename) {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    console.log();
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

// Guarda el estado de UNQfy en filename
function saveUNQfy(unqfy, filename) {
  console.log();
  unqfy.save(filename);
}


//


function main() {
  let unqfy = getUNQfy('estado');

  processArguments(process.argv.slice(2), unqfy);
  
  saveUNQfy(unqfy, 'estado');  
}


//------------------------------------------------------------------------------//


/*
node main.js addArtist 'unNombre' 'unPais'
node main.js addAlbum 'unNombre' 'unAño' 'nombreArtista'
node main.js addTrack 'unNombre' 'unaDuracion' 'unGenero' 'nombreAlbum'

node main.js searchAllTracksByArtist 'nombreArtista'
node main.js searchAllTracksByGenre 'genero1' 'genero2' 'generoN'

node main.js searchTrackByName 'nombreTrack'
node main.js searchAlbumByName 'nombreAlbum'
node main.js searchArtistByName 'nombreArtista'

node main.js createPlaylist 'unNombre' 'duracionMaxima' 'genero1' 'genero2' 'generoN'
node main.js showPlaylist 'nombrePlaylist'

node main.js help
*/

function processArguments(args, unqfy){
  switch(args[0]){
    case 'addArtist': addArtist(args.slice(1), unqfy); break;
    case 'addAlbum' : addAlbum(args.slice(1), unqfy);  break;
    case 'addTrack' : addTrack(args.slice(1), unqfy);  break;

    case 'searchAllTracksByArtist': searchAllTracksByArtist(args.slice(1), unqfy); break;
    case 'searchAllTracksByGenre' : searchAllTracksByGenre(args.slice(1), unqfy);  break;

    case 'searchTrackByName' : searchTrackByName(args.slice(1), unqfy);   break;
    case 'searchAlbumByName' : searchAlbumByName(args.slice(1), unqfy);   break;
    case 'searchArtistByName': searchArtistsByName(args.slice(1), unqfy); break;

    case 'createPlaylist': createPlaylist(args.slice(1), unqfy); break;
    case 'showPlaylist'  : showPlaylist(args.slice(1), unqfy);   break;

    case 'help': showHellp(); break;

    case 'del': del(unqfy); break;
    
    default: defaultMsg(args[0]); break;
  }
}

function defaultMsg(arg){
  console.log('El argumento "' + arg + '" no existe.');
}

function del(unqfy){
  unqfy.del();
}

function showHellp(){
  console.log('Help:');
  console.log(' ');
  console.log('node main.js addArtist unNombre unPais');
  console.log('node main.js addAlbum unNombre unAño nombreArtista');
  console.log('node main.js addTrack unNombre unaDuracion unGenero nombreAlbum');
  console.log(' ');
  console.log('node main.js searchAllTracksByArtist nombreArtista');
  console.log('node main.js searchAllTracksByGenre genero1 genero2 generoN');
  console.log(' ');
  console.log('node main.js searchTrackByName nombreTrack');
  console.log('node main.js searchAlbumByName nombreAlbum');
  console.log('node main.js searchArtistByName nombreArtista');
  console.log(' ');
  console.log('node main.js createPlaylist unNombre duracionMaxima genero1 genero2 generoN');
  console.log('node main.js showPlaylist nombrePlaylist');
  console.log(' ');
  console.log('node main.js help');
}

function addArtist(params, unqfy){
  unqfy.addArtist({name: params[0], country: params[1]});
  console.log('Artista ' + unqfy.getArtistByName(params[0]).name + ' agregado.');
}

function exists(param){
  return param !== undefined;
}

function addAlbum(params, unqfy){
  let artist = unqfy.getArtistByName(params[2]);
  if(exists(artist)){
    unqfy.addAlbum(artist.name, {name: params[0], year: params[1]});
    console.log('Album: ' + unqfy.getAlbumByName(params[0]).name + ' agregado.');
  }else{
    console.log('El artista no existe.');
  }    
}

function addTrack(params, unqfy){
  const album = unqfy.getAlbumByName(params[3]);
  if(exists(album)){
    unqfy.addTrack(album.name, {name: params[0], duration: parseInt(params[1]), genres: [params[2]]});
    console.log('Track: ' + unqfy.getTrackByName(params[0]).name + ' agregado.');
  }else{
    console.log('El album no existe.');
  }
}

function searchTrackByName(trackName, unqfy){
  const track = unqfy.getTrackByName(trackName[0]);
  if(exists(track)){
    track.print();
  }else{
    console.log('El track "' + trackName + '" no existe.');
  }
}

function searchAlbumByName(albumName, unqfy){
  const album = unqfy.getAlbumByName(albumName[0]);
  if(exists(album)){
    album.print();
  }else{
    console.log('El album "' + albumName + '" no existe.');
  }
}

function searchArtistsByName(artistName, unqfy){
  const artist = unqfy.getArtistByName(artistName[0]);
  if(exists(artist)){
    artist.print();
  }else{
    console.log('El Artista "' + artistName + '" no existe.');
  }
}

function searchAllTracksByArtist(artistName, unqfy){
  const artist = unqfy.getArtistByName(artistName[0]);
  printTracks(unqfy.getTracksMatchingArtist(artist));
}

function searchAllTracksByGenre(genres, unqfy){
  printTracks(unqfy.getTracksMatchingGenres(genres));
}

function printTracks(tracks){
  tracks.map(t => t.print());
}

function createPlaylist(args, unqfy){
  unqfy.addPlaylist(args[0],args.slice(1) , parseInt(args[1]));

  console.log('playlist "' + unqfy.getPlaylistByName(args[0]).name + '" creada.');
}

function showPlaylist(args, unqfy){
  const playlist = unqfy.getPlaylistByName(args[0]);
  if(exists(playlist)){
    playlist.print();
  }else{
    console.log('La playlist "' + args[0] + '" no existe.');
  }
}





//--------------------------------------------
main();


