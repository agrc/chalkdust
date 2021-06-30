import { useRef, useEffect } from 'react';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import Viewpoint from '@arcgis/core/Viewpoint';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import { marker } from './Symbols';
import { ProjectUtmToWgs } from './Projections';
import { whenTrueOnce } from '@arcgis/core/core/watchUtils';
import queryString from 'query-string';

const ReactMapView = () => {
  const mapDiv = useRef(null);
  const webMap = useRef(null);
  const mapView = useRef(null);

  // set up map effect
  useEffect(() => {
    if (mapDiv.current) {
      webMap.current = new WebMap({
        portalItem: {
          id: '80c26c2104694bbab7408a4db4ed3382',
        },
      });

      mapView.current = new MapView({
        container: mapDiv.current,
        map: webMap.current,
      });
    }

    console.log('parsing query string');
    let { redline } = queryString.parse(location.search);

    if (redline) {
      console.log('parsing redline point');

      redline = JSON.parse(redline);
      redline = new Point({
        x: redline.x,
        y: redline.y,
        spatialReference: redline.spatialReference,
      });

      if (redline.spatialReference.wkid === 26912) {
        console.log('projecting redline');

        redline = ProjectUtmToWgs(redline);
      }
    }

    console.log('zooming to viewpoint');

    whenTrueOnce(mapView.current, 'ready', () => {
      console.log('view is ready, zooming');

      mapView.current.goTo(
        new Viewpoint({
          scale: 6000,
          targetGeometry: redline,
        }),
        { duration: 1500, easing: 'ease-in-out' }
      );

      window.history.pushState({}, '', new URL(window.location.origin));

      if (redline) {
        mapView.current.graphics.add(new Graphic(redline, marker));
      }
    });

    return () => {
      mapView.current.destroy();
      webMap.current.destroy();
    };
  }, []);

  return <div ref={mapDiv} className="border-t border-gray-300 h-full w-full"></div>;
};

export default ReactMapView;
