define([
    'agrc/widgets/map/BaseMap',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/io-query',
    'dojo/on',
    'dojo/text!app/templates/App.html',
    'dojo/_base/array',
    'dojo/_base/Color',
    'dojo/_base/declare',
    'dojo/_base/json',

    'esri/geometry/Point',
    'esri/graphic',
    'esri/symbols/SimpleMarkerSymbol',

    'layer-selector'
], function(
    BaseMap,

    _TemplatedMixin,
    _WidgetBase,

    ioQuery,
    on,
    template,
    array,
    Color,
    declare,
    dojo,

    Point,
    Graphic,
    SimpleMarkerSymbol,

    BaseMapSelector
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: 'app',
        serviceUrl: 'http://mapserv.utah.gov/arcgis/rest/services/BaseMaps/Terrain/MapServer',

        constructor: function() {
            // summary:
            //      first function to fire after page loads
            console.info('app.App::constructor', arguments);

            this.childWidgets = [];

            this.inherited(arguments);
        },
        postCreate: function() {
            // summary:
            //      Fires when
            console.log('app.App::postCreate', arguments);

            this.initMap();

            window.agrc = this;

            this.inherited(arguments);
        },
        startup: function() {
            // summary:
            //      Fires after postCreate when all of the child widgets are finished laying out.
            console.log('app.App::startup', arguments);

            var that = this;
            array.forEach(this.childWidgets, function (widget) {
                console.log(widget.declaredClass);
                that.own(widget);
                widget.startup();
            });

            this.inherited(arguments);
        },
        initMap: function() {
            // summary:
            //      Sets up the map
            console.info('app.App::initMap', arguments);

            var uri = window.location.href,
                query = uri.substring(uri.indexOf('?') + 1, uri.length),
                queryObject = ioQuery.queryToObject(query);

            var center = new Point(dojo.fromJson(queryObject.center));
            var point = new Point(dojo.fromJson(queryObject.redline));

            var sls = new SimpleMarkerSymbol()
                    .setStyle(SimpleMarkerSymbol.STYLE_CIRCLE)
                    .setColor(new Color([255, 0, 0, 0.5]))
                    .setOutline(null)
                    .setSize('32');

            var graphic = new Graphic(point, sls);

            this.map = new BaseMap(this.mapDiv, {
                useDefaultBaseMap: false,
                showAttribution: false
            });

            var self = this;
            on(this.map, 'Load', function() {
                self.map.centerAndZoom(center, queryObject.level);
                self.map.graphics.add(graphic);
            });

            this.childWidgets.push(
                new BaseMapSelector({
                    map: this.map,
                    quadWord: 'alabama-anvil-picnic-sunset', //'alfred-plaster-crystal-dexter',
                    baseLayers: ['Hybrid', 'Lite', 'Terrain', 'Topo', 'Color IR']
                })
            );
        }
    });
});
