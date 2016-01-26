var Backbone = require('backbone'),
    URI = require('urijs');

/**
 * Tracks collection
 */
module.exports = Backbone.Collection.extend({
    model: require('models/track'),

    getData: function() {
        var time = 0;
        return this.map(function(track, idx) {
            time += track.get('duration_ms');
            return _.defaults(
                track.pick([
                    'energy',
                    'liveness',
                    'speechiness',
                    'acousticness',
                    'instrumentalness',
                    'danceability',
                    'valence',
                    'tempo'
                ]),
                {time: time}
            );
        }, this);
    }
});
