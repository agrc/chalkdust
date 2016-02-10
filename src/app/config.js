define([
    'dojo/has',
    'dojo/request/xhr',

    'esri/config'
], function (
    has,
    xhr,

    esriConfig
) {

    // force api to use CORS on mapserv thus removing the test request on app load
    // e.g. http://mapserv.utah.gov/ArcGIS/rest/info?f=json
    esriConfig.defaults.io.corsEnabledServers.push('mapserv.utah.gov');
    esriConfig.defaults.io.corsEnabledServers.push('basemaps.utah.gov');
    esriConfig.defaults.io.corsEnabledServers.push('discover.agrc.utah.gov');

    if (has('agrc-build') === 'prod') {
        // mapserv.utah.gov
        return {
            quadWord: 'alfred-plaster-crystal-dexter'
        };
    } else if (has('agrc-build') === 'stage') {
        // test.mapserv.utah.gov
        return {
            quadWord: 'opera-event-little-pinball'
        };
    } else {
        // localhost
        var quadWord;
        xhr(require.baseUrl + 'secrets.json', {
            handleAs: 'json',
            sync: true
        }).then(function (secrets) {
            quadWord = secrets.quadWord;
        }, function () {
            throw 'Error getting secrets!';
        });

        return {
            quadWord: quadWord
        };
    }
});
