var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone');

/**
 * Spotify authentication mixin
 */
module.exports = {
    sync: function(method, collection, options){
        options = options || {};
        options.beforeSend = _.bind(this.setAuthHeader, this);
        return Backbone.sync.call(this,method, collection, options);
    },

    setAuthHeader: function(xhr) {
        var User = require('models/user');
        xhr.setRequestHeader('Authorization', 'Bearer ' + User.accessToken);
    }
};
