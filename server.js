// Przypisz niezbedne zaleznosci do zmiennych
var express = require( 'express' );
var passport = require( 'passport' );
var GoogleStrategy = require( 'passport-google-oauth' ).OAuth2Strategy;
var config = require( './config' );
var app = express();
var googleProfile = {};

// Utworz ustawienia poczatkowe wumagane do uruchomienia passporta
passport.serializeUser( function( user, done ) {
    done( null, user );
});
passport.deserializeUser( function( obj, done ) {
    done( null, obj );
});

// Skonfiguruj zadanie autoryzacji passporta
// Utworz nowa instacje klasy ktora przechowuje obiekty i podaj
// dane ktore posiadasz w pliku config.js
passport.use( new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.CALLBACK_URL        
    },
    function( accessToken, refreshToken, profile, cb ) {
        googleProfile = {
            id: profile.id,
            displayName: profile.displayName
        }
        cb( null, profile );
    }
));

// Ustaw silnik widokow Puga
app.set( 'view engine', 'pug' );
app.set( 'views', './views' );
// Zainicjalizuj passporta
app.use( passport.initialize() );
// Uzyj sesji passporta
app.use( passport.session()) ;

// app routes
// Uzyj metody GET aby utworzyc endpoint i wyrenderowac plik z powitaniem
app.get( '/', function( req, res ) {
    // Wyrenderuj plik index.pug i zapisz obiekt zadania uzytkownika w kluczu
    res.render( 'index', { user: req.user} );
});

// Uzytj metody GET aby dostac sie do endpointa i wyrenderuj plik pug
app.get( '/logged', function( req, res ) {
    res.render( 'logged', { user: googleProfile } );
});

// Passport routes
app.get( '/auth/google',
    // Wykonaj zadanie autoryzacji do google przez passporta
    passport.authenticate( 'google', {
    scope: [ 'profile', 'email' ]
}));

// Uzyj metody GET aby wygenerowac strone do przekierowania po logowaniu
app.get( '/auth/google/callback',
    // Uzyj passporta aby sprawdzil czy uzytkownik zalogowal sie poprawnie
    passport.authenticate( 'google', {
    // Jesli zalogowalismy sie poprawnie to przenies uzytkownika do tej sciezki
    successRedirect: '/logged',
    // Jesli nie, wroc do poczatkowego endpointa
    failureRedirect: '/'    
}));

// Nasluchuj na port serwera
app.listen( 3000 );