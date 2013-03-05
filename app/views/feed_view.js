var View     = require('./view')
  , template = require('./templates/feed')

module.exports = View.extend({
    id: 'feed-view',
    template: template
})
