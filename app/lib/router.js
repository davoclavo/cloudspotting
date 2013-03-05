var application = require('application')

module.exports = Backbone.Router.extend({
    routes: {
        '': 'home',
        'feed': 'feed'
    },
    
    home: function() {
        $('body').html(application.homeView.render().el)
    },

    feed: function() {
        $('body').html(application.feedView.render().el)
    }
})
