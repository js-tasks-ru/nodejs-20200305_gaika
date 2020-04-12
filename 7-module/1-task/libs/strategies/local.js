const User = require('../../models/User');

const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {
      User.findOne({email}, (err, user) => {
        if (!user) {
          done(null, false, 'Нет такого пользователя');
          return;
        }

        user.checkPassword(password).then((isPasswordTrue) => {
          if (!isPasswordTrue) {
            done(null, false, 'Неверный пароль');
          } else {
            done(null, user, '');
          }
        });
      });
    }
);
