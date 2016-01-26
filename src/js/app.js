var Backbone = require('backbone'),
    Router = require('router');

window.Router = new Router();
Backbone.history.start({pushState: true});
