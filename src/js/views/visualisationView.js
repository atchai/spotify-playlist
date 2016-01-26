var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    d3 = require('d3');

/**
 * Visualisation view
 */
module.exports = Backbone.View.extend({
    template: _.template(require('templates/visualisation.html')),

    events: {
        'click #controls a': 'toggleSeries'
    },

    height: 400,
    margins: {top: 30, right: 40, bottom: 30, left: 50},

    series: new Backbone.Collection([
        {id: 'tempo', name: 'BPM', scale: 'y1', show: true},
        {id: 'energy', name: 'Energy', scale: 'y0', show: true},
        {id: 'liveness', name: 'Liveness', scale: 'y0', show: false},
        {id: 'speechiness', name: 'Speechiness', scale: 'y0', show: false},
        {id: 'acousticness', name: 'Acousticness', scale: 'y0', show: false},
        {id: 'instrumentalness', name: 'Instrumentalness', scale: 'y0', show: false},
        {id: 'danceability', name: 'Danceability', scale: 'y0', show: false},
        {id: 'valence', name: 'Valence', scale: 'y0', show: false}
    ]),

    xAxisFormat: d3.time.format('%M:%S'),
    yAxisLeftFormat: d3.format('%'),
    yAxisRightFormat: d3.format('d'),

    initialize: function() {
        this.listenTo(this.model, 'sync', this.render);
    },

    render: function() {
        // Render template
        this.$el.html(this.template({series: this.series}));

        // Get tracks data
        var data = this.model.getData();

        // Calculate chart size
        var chartWidth = this.$('#chart').width() - this.margins.left - this.margins.right,
            chartHeight = this.height - this.margins.top - this.margins.bottom;

        // Build chart
        var svg = d3.select(this.$('#chart').get(0))
            .append('svg')
                .attr('width', chartWidth + this.margins.left + this.margins.right)
                .attr('height', chartHeight + this.margins.top + this.margins.bottom)
            .append('g')
                .attr('transform', this.translate(this.margins.left, this.margins.top));

        // Scales
        var scales = {
            x: d3.time.scale()
                    .range([0, chartWidth])
                    .domain(d3.extent(data, _.property('time'))),
                    //.domain([0, d3.max(data, _.property('time'))]),
            y0: d3.scale.linear()
                    .range([chartHeight, 0])
                    .domain([0, 1]),
            y1: d3.scale.linear()
                    .range([chartHeight, 0])
                    .domain(d3.extent(data, _.property('tempo')))
        };

        this.series.each(function(series) {
            // Ignore unselected series
            if (!series.get('show')) {
                return;
            }

            // Generate series line function
            var line = d3.svg.line()
                .x(function(d) { return scales.x(d.time); })
                .y(function(d) { return scales[series.get('scale')](d[series.get('id')]); });

            // Render line
            svg.append('path')
                .attr({class: series.get('id'), d: line(data)});
        });

        // X-Axis
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', this.translate(0, chartHeight))
            .call(d3.svg.axis()
                    .scale(scales.x)
                    .orient('bottom')
                    .tickFormat(this.xAxisFormat));

        // Y-Axis Left
        svg.append('g')
            .attr('class', 'y axis left')
            .call(d3.svg.axis()
                    .scale(scales.y0)
                    .orient('left')
                    .tickFormat(this.yAxisLeftFormat));

        // Y-Axis Right
        svg.append('g')
            .attr('class', 'x axis right')
            .attr('transform', this.translate(chartWidth, 0))
            .call(d3.svg.axis()
                    .scale(scales.y1)
                    .orient('right')
                    .tickFormat(this.yAxisRightFormat));
    },

    translate: function(x, y) {
        return 'translate(' + x.toFixed() + ',' + y.toFixed() + ')';
    },

    toggleSeries: function(e) {
        e.preventDefault();
        var series = this.series.get($(e.currentTarget).attr('href'));
        series.set('show', !series.get('show'));
        this.render();
    }
});
