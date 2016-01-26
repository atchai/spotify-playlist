var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    VisualisationView = require('views/visualisationView');

/**
 * Playlist view
 */
module.exports = Backbone.View.extend({
    template: _.template(require('templates/playlist.html')),

    initialize: function(opts) {
        window.Router.showLoading();
        var Playlist = require('models/playlist');
        this.playlist = new Playlist({
            id: opts.id,
            owner: {id: opts.uid}
        });
        this.listenTo(this.playlist, 'sync', this.render);
        this.playlist.fetch();
    },

    render: function() {
        window.Router.hideLoading();
        this.$el.html(this.template({playlist: this.playlist}));
        this.visualisation = new VisualisationView({
            el: this.$('#visualisation'),
            model: this.playlist.tracks
        });
    }
});
