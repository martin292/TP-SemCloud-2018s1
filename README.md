# TP-SemCloud-2018s1

Modelamos una aplicación similar a Spotify, a la cual llamaremos UNQfy.

En UNQfy existe una gran cantidad de temas musicales (tracks)  los cuales siempre pertenecen a un álbum. Un álbum tiene asociado uno o más artistas. Cada track tiene asociado uno o más géneros, que son strings. También existen playlists, que son conjuntos de tracks que pueden pertenecer a diferentes álbumes.


# UML del modelo del proyecto

https://drive.google.com/file/d/1Y_57wNZD5lXE54HAxT1daOwOuUfYIAbV/view?usp=sharing


**Comandos (_sin comillas_):**


node main.js **addArtist** 'unNombre' 'unPais'

node main.js **addAlbum** 'unNombre' 'unAño' 'nombreArtista'

node main.js **addTrack** 'unNombre' 'unaDuracion' 'unGenero' 'nombreAlbum'


node main.js **searchAllTracksByArtist** 'nombreArtista'

node main.js **searchAllTracksByGenre** 'genero1' 'genero2' 'generoN'


node main.js **searchTrackByName** 'nombreTrack'

node main.js **searchAlbumByName** 'nombreAlbum'

node main.js **searchArtistByName** 'nombreArtista'


node main.js **createPlaylist** 'unNombre' 'duracionMaxima' 'genero1' 'genero2' 'generoN'

node main.js **showPlaylist** 'nombrePlaylist'


node main.js **help**

node main.js **del**
