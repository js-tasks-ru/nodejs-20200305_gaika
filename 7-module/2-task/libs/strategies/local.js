const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      try {
        const user = await User.findOne({email});

        if (!user) {
          return done(null, false, 'Нет такого пользователя');
        }

        const isPasswordTrue = await user.checkPassword(password);

        if (!isPasswordTrue) {
          return done(null, false, 'Неверный пароль');
        }

        return done(null, user, '');
      } catch (e) {
        console.log(e.stack);
        return done(null, false, 'Ошибка');
      }
    }
);
