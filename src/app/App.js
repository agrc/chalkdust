define([
    'agrc/widgets/map/BaseMap',

    'app/config',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/io-query',
    'dojo/text!app/templates/App.html',
    'dojo/_base/array',
    'dojo/_base/Color',
    'dojo/_base/declare',
    'dojo/_base/json',

    'esri/geometry/Extent',
    'esri/geometry/Point',
    'esri/graphic',
    'esri/SpatialReference',
    'esri/symbols/SimpleMarkerSymbol',

    'layer-selector',

    'proj4'
], function(
    BaseMap,

    config,

    _TemplatedMixin,
    _WidgetBase,

    ioQuery,
    template,
    array,
    Color,
    declare,
    dojo,

    Extent,
    Point,
    Graphic,
    SpatialReference,
    SimpleMarkerSymbol,

    BaseMapSelector,

    proj4
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: 'app',

        // wkt26912: String
        //      The well known text for utm zone 12 N NAD83 for use with proj4
        wkt26912: 'PROJCS["NAD83 / UTM zone 12N",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980' +
                  '",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,' +
                  'AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY' +
                  '["EPSG","4269"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator' +
                  '"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",-111],PARAMETER["scale_factor"' +
                  ',0.9996],PARAMETER["false_easting",500000],PARAMETER["false_northing",0],AUTHORITY' +
                  '["EPSG","26912"],AXIS["Easting",EAST],AXIS["Northing",NORTH]]',

        // wkt3857: String
        //      The well known text for wgs 84 for use with proj4
        wkt3857: 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID' +
                 '["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],' +
                 'PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",' +
                 '0.0],PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER[' +
                 '"Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]',

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

            this.inherited(arguments);
        },
        startup: function() {
            // summary:
            //      Fires after postCreate when all of the child widgets are finished laying out.
            console.log('app.App::startup', arguments);

            array.forEach(this.childWidgets, function (widget) {
                console.log(widget.declaredClass);
                this.own(widget);
                widget.startup();
            }, this);

            this.inherited(arguments);
        },
        initMap: function() {
            // summary:
            //      Sets up the map
            console.info('app.App::initMap', arguments);

            var that = this;

            var uri = window.location.href;
            var query = uri.substring(uri.indexOf('?') + 1, uri.length);
            var queryObject = ioQuery.queryToObject(query);
            var level = parseInt(queryObject.level, 10);
            var redline;

            var input = dojo.fromJson(queryObject.redline);
            if (input.spatialReference && input.spatialReference.wkid === 26912) {
                input = proj4(this.wkt26912, this.wkt3857, input);

                level = level + 5;
            }

            redline = new Point(input.x, input.y, new SpatialReference({
                wkid: 3857
            }));

            this.map = new BaseMap(this.mapDiv, {
                useDefaultBaseMap: false,
                showAttribution: false,
                extent: new Extent({
                    xmax: -12010849.397533866,
                    xmin: -12898741.918094235,
                    ymax: 5224652.298632992,
                    ymin: 4422369.249751998,
                    spatialReference: {
                        wkid: 3857
                    }
                })
            });

            this.childWidgets.push(
                new BaseMapSelector({
                    map: this.map,
                    quadWord: config.quadWord,
                    baseLayers: ['Hybrid', 'Lite', 'Terrain', 'Topo', 'Color IR']
                })
            );

            var sls = new SimpleMarkerSymbol()
                .setStyle(SimpleMarkerSymbol.STYLE_CIRCLE)
                .setColor(new Color([255, 0, 0, 0.5]))
                .setOutline(null)
                .setSize('32');

            if (redline) {
                var graphic = new Graphic(redline, sls);

                if (this.map.loaded) {
                    that.map.centerAndZoom(redline, level);
                    that.map.graphics.add(graphic);
                } else {
                    this.map.on('load', function() {
                        that.map.centerAndZoom(redline, level);
                        that.map.graphics.add(graphic);
                    });
                }
            }
        }
    });
});
