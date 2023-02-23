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

  hbs.registerHelper('hasLike', function (options) {
    const { currentUser, comment } = options.hash;
    console.log("******** ", currentUser);

    if (currentUser.likes.some(like => like.comment.toString() === comment.id)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  })