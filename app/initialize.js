var application = require('application')
var cloudspotting = require('cloudspotting')

$(function() {
    application.initialize()
    Backbone.history.start()
    cloudspotting.initialize()
})
