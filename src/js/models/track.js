var _ = require('lodash'),
    Backbone = require('backbone'),
    URI = require('urijs');

/**
 * Track model
 */
module.exports = Backbone.Model.extend({
    initialize: function() {
        this.fetch();
    },

    url: function() {
        return URI('http://developer.echonest.com/api/v4/track/profile')
            .query({
                api_key: require('config').ECHONEST_API_KEY,
                format: 'json',
                bucket: 'audio_summary',
                id: this.get('uri')
            })
            .toString();
    },

    parse: function(response, opts) {
        if (opts.xhr) {
            // Merge EchoNest audio summary data
            return _.defaults(this.attributes, response.response.track.audio_summary);
        } else {
            // Set Spotify track data
            return _.defaults(response.track, response);
        }
    },

    getArtists: function() {
        return _.map(this.get('artists'), function(artist) {
            return artist.name;
        }).join(', ');
    },

    getAlbum: function() {
        return this.get('album').name;
    },

    getLength: function() {
        var duration = this.get('duration_ms') / 1000,
            minutes = Math.floor(duration / 60),
            seconds = Math.floor(duration - (minutes * 60));
        return minutes + ':' + _.pad(seconds, 2, '0');
    }
});
