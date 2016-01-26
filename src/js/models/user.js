var _ = require('lodash'),
    Backbone = require('backbone'),
    URI = require('urijs');

/**
 * User singleton
 */
module.exports = (function() {
    return new (Backbone.Model.extend(require('models/spotify')).extend({
        url: 'https://api.spotify.com/v1/me',

        initialize: function() {
            this.accessToken = URI('?' + URI().fragment()).query(true).access_token;
        },

        isAuthorized: function() {
            return !_.isEmpty(this.accessToken);
        },

        authorize: function() {
            window.location = URI('https://accounts.spotify.com/authorize')
                .query({
                    client_id: require('config').SPOTIFY_CLIENT_ID,
                    redirect_uri: URI()
                        .query('')
                        .fragment('')
                        .path(_.invert(require('router').prototype.routes).playlistSelect)
                        .toString(),
                    response_type: 'token',
                    scope: 'playlist-read-private playlist-modify-private playlist-modify-public'
                })
                .toString();
        }
    }));
})();
