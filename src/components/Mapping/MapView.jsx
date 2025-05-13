import { whenOnce } from '@arcgis/core/core/reactiveUtils';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import Viewpoint from '@arcgis/core/Viewpoint';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import queryString from 'query-string';
import { useEffect, useRef } from 'react';
import { ProjectUtmToWgs } from './Projections.jsx';
import { marker } from './Symbols.jsx';

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

    let { redline: redlineString } = queryString.parse(location.search);
    let redline;

    if (redlineString) {
      let redlineJson = JSON.parse(redlineString);

      if (typeof redlineJson === 'string') {
        redlineJson = JSON.parse(redlineJson);
      }

      redline = new Point({
        x: redlineJson.x,
        y: redlineJson.y,
        spatialReference: redlineJson.spatialReference,
      });

      if (redline.spatialReference.wkid === 26912) {
        redline = ProjectUtmToWgs(redline);
      }
    }

    if (redline) {
      whenOnce(() => mapView.current.ready).then(() => {
        mapView.current.goTo(
          new Viewpoint({
            scale: 6000,
            targetGeometry: redline,
          }),
          { duration: 1500, easing: 'ease-in-out' },
        );

        window.history.pushState({}, '', new URL(window.location.origin));

        if (redlineString) {
          mapView.current.graphics.add(new Graphic(redline, marker));
        }
      });
    }

    return () => {
      mapView.current.destroy();
      webMap.current.destroy();
    };
  }, []);

  return <div ref={mapDiv} className="h-full w-full border-t border-gray-300"></div>;
};

export default ReactMapView;
