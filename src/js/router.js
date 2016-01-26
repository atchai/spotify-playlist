var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone');

/**
 * Application router
 */
module.exports = Backbone.Router.extend({
    $app: $('#app'),
    $loading: $('#loading'),

    routes: {
        ''                          : 'auth',
        'index.html'                : 'auth',
        'playlists'                 : 'playlistSelect',
        'playlist/:user/:playlist'  : 'playlistView'
    },

    auth: function() {
        this.render(require('views/authView'));
    },

    playlistSelect: function() {
        this.show(require('views/playlistSelectView'));
    },

    playlistView: function(user, playlist) {
        this.show(require('views/playlistView'), {uid: user, id: playlist});
    },

    show: function(View, opts) {
        var User = require('models/user');
        if (!User.isAuthorized()) {
            this.render(AuthView, opts);
        } else if (User.isNew()) {
            this.showLoading();
            User.fetch({success: _.bind(this.render, this, View, opts)});
        } else {
            this.render(View, opts);
        }
    },

    render: function(View, opts) {
        this.hideLoading();
        if (this.view) {
            this.view.remove();
        }
        this.view = new View(opts);
        this.$app.append(this.view.$el);
    },

    showLoading: function() {
        this.$loading.removeClass('hidden');
    },

    hideLoading: function() {
        this.$loading.addClass('hidden');
    },

    navigate: function(url, opts) {
        var URI = require('urijs');
        url = URI(url)
            .fragment(URI().fragment())
            .toString();
        return Backbone.Router.prototype.navigate.call(this, url, opts);
    }
});
