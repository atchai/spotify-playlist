var Backbone = require('backbone'),
    URI = require('urijs'),
    URITemplate = require('urijs/src/URITemplate');

/**
 * Playlists collection
 */
module.exports = Backbone.Collection.extend(require('models/spotify')).extend({
    model: require('models/playlist'),

    url: function() {
        var User = require('models/user');
        return URI.expand(
                'https://api.spotify.com/v1/users/{uid}/playlists',
                {uid: User.get('id')}
            )
            .query({
                limit: 50,
                offset:0
            })
            .toString();
    },

    parse: function(response) {
        return response.items;
    }
});
