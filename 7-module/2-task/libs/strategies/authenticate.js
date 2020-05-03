const User = require('../../models/User');
const mongoose = require('mongoose');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }
  const user = await User.findOne({email});
  if (!user) {
    await User.create({email: email, displayName: displayName}, (err, email) => {
      if (err) {
        if (err instanceof mongoose.Error.ValidationError) {
          return done({
            errors: {
              email: {
                message: 'Некорректный email.',
              },
            },
            name: err.name,
          }, false, 'Некорректный email.');
        }
        return done(null, false, 'Не удалось создать пользователя');
      } else {
        return done(null, email, true);
      }
    });
  } else {
    return done(null, user, '');
  }
};
