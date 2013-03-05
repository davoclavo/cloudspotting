// Application bootstrapper.
Application = {
    initialize: function() {
        
        var HomeView = require('views/home_view')
          , FeedView = require('views/feed_view')
          , Router   = require('lib/router')
        
        this.homeView = new HomeView()
        this.feedView = new FeedView()
        this.router   = new Router()
        
        if (typeof Object.freeze === 'function') Object.freeze(this)
        
    }
}

module.exports = Application
