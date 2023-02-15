const hbs = require('hbs');
const path = require('path');

hbs.registerPartials(path.join(__dirname, '../views/partials'));

hbs.registerHelper('isOwner', function (options) {
    const { currentUser, commentOwnerId } = options.hash;
  
    if (currentUser && currentUser.id === commentOwnerId) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  })