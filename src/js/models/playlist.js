var _ = require('lodash'),
    Backbone = require('backbone'),
    URI = require('urijs'),
    URITemplate = require('urijs/src/URITemplate');

/**
 * Playlist model
 */
module.exports = Backbone.Model.extend(require('models/spotify')).extend({
    initialize: function() {
        var Tracks = require('collections/tracks');
        this.tracks = new Tracks()
    },

    url: function() {
        return URI.expand(
                'https://api.spotify.com/v1/users/{uid}/playlists/{id}',
                {
                    uid: this.get('owner').id,
                    id: this.get('id')
                }
            )
            .toString();
    },

    parse: function(response) {
        if (response && response.tracks && response.tracks.items) {
            this.tracks.reset(response.tracks.items, {parse: true});
        }
        return response;
    },

    getUrl: function() {
        return URI.expand(
            '/playlist/{uid}/{id}',
            {
                uid: this.get('owner').id,
                id: this.get('id')
            }
        );
    },

    getNumTracks: function() {
        return this.get('tracks').total;
    },

    getThumbnail: function() {
        var thumb = _.minBy(this.get('images'), function(image) {
            return image.width * image.height;
        });
        return (thumb) ? thumb.url : null;
    },

    getOwner: function() {
        var User = require('models/user'),
            owner = this.get('owner');
        if (owner.id == User.get('id')) {
            return '';
        }
        return 'by ' + owner.id;
    }
});
