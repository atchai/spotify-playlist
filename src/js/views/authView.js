var $ = require('jquery'),
    Backbone = require('backbone');

/**
 * Auth view
 */
module.exports = Backbone.View.extend({
    events: {
        'click #login': 'authorize'
    },

    initialize: function() {
        this.render();
    },

    render: function() {
        this.$el.html(require('templates/auth.html'));
    },

    authorize: function() {
        var User = require('models/user');
        User.authorize();
    }
});
