var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone');

/**
 * Playlist select view
 */
module.exports = Backbone.View.extend({
    template: _.template(require('templates/playlistSelect.html')),

    events: {
        'click .list-group a': 'selectTrack'
    },

    initialize: function() {
        window.Router.showLoading();
        var Playlists = require('collections/playlists');
        this.playlists = new Playlists();
        this.listenTo(this.playlists, 'sync', this.render);
        this.playlists.fetch();
    },

    render: function() {
        window.Router.hideLoading();
        this.$el.html(this.template({playlists: this.playlists}));
    },

    selectTrack: function(e) {
        e.preventDefault();
        var Router = require('router');
        window.Router.navigate($(e.currentTarget).attr('href'), {trigger: true});
    }
});
