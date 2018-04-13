

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

function main() {
  let unqfy = getUNQfy('estado');

  processArguments(process.argv.slice(2), unqfy);
  
  saveUNQfy(unqfy, 'estado');  
}

//node main.js addArtist 'unNombre' 'unPais'
//node main.js addAlbum 'unNombre' 'unAño' 'nombreArtista'
//node main.js addTrack 'unNombre' 'unaDuracion' 'unGenero' 'nombreAlbum'


function processArguments(args, unqfy){
  switch(args[0]){
    case 'addArtist': addArtist(args.slice(1), unqfy); break;
    case 'addAlbum': addAlbum(args.slice(1), unqfy); break;
    case 'addTrack': addTrack(args.slice(1), unqfy); break;

    case 'searchAllTracksByArtist': searchAllTracksByArtist(args.slice(1), unqfy); break;
    case 'searchAllTracksByGenre': searchAllTracksByGenre(args.slice(1), unqfy); break;

    case 'searchTracksByName': searchTracksByName(args.slice(1), unqfy); break;
    case 'searchAlbumByName': searchTracksByName(args.slice(1), unqfy); break;
    case 'searchArtistByName': searchTracksByName(args.slice(1), unqfy); break;

    case 'createPlaylist': createPlaylist(args.slice(1), unqfy); break;
    case 'showPlaylist': showPlaylist(args.slice(1), unqfy); break;
    
    default: defaultMsg(); break;
  }
}


function addArtist(params, unqfy){
  unqfy.addArtist({name: params[0], year: params[1]});
  console.log('Artista ' + unqfy.getArtistByName(params[0]).name + ' agregado.');
}

function addAlbum(params, unqfy){
  let artist = unqfy.getArtistByName(params[2]);
  if(artist !== undefined){
    unqfy.addAlbum(artist.name, {name: params[0], year: params[1]});
    console.log('Album: ' + unqfy.getAlbumByName(params[0]).name + ' agregado.');
  }else{
    console.log('El artista no existe.');
  }    
}

function addTrack(params, unqfy){
  let album = unqfy.getAlbumByName(params[3]);
  if(album !== undefined){
    unqfy.addTrack(album.name, {name: params[0], duration: params[1], genres: params[2]});
    console.log('Track: ' + unqfy.getTrackByName(params[0]).name + ' agregado.');
  }else{
    console.log('El album no existe.');
  }
}






//--------------------------------------------
main();


