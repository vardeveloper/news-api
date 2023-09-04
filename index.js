const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const app = express();

// Configura la estrategia de autenticación de GitHub
passport.use(new GitHubStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.URL + '/auth/github/callback' // Cambia esta URL según tu configuración
},
function(accessToken, refreshToken, profile, done) {
  // Aquí puedes manejar la lógica de autenticación y almacenar los datos del usuario en tu base de datos si es necesario.
  return done(null, profile);
}));

// Configura Passport para almacenar el usuario en la sesión
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Configura Express
app.use(require('express-session')({ secret: 'tu_secreto', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Ruta de inicio de sesión con GitHub
app.get('/auth/github', passport.authenticate('github'));

// Ruta de redirección después de la autenticación con GitHub
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/profile'); // Puedes redirigir al perfil del usuario o a donde desees
  });

// Ruta para cerrar sesión
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// Ruta protegida que requiere autenticación
app.get('/profile', isAuthenticated, function(req, res) {
  res.send('Bienvenido a tu perfil');
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

app.listen(process.env.PORT, () => {
  console.log('Aplicación de inicio de sesión con GitHub en ejecución en http://localhost:3000');
});
