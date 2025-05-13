import Point from '@arcgis/core/geometry/Point';
import proj4 from 'proj4';

// wkt26912: String
//      The well known text for utm zone 12 N NAD83 for use with proj4
const utm =
  'PROJCS["NAD83 / UTM zone 12N",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980' +
  '",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,' +
  'AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY' +
  '["EPSG","4269"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator' +
  '"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",-111],PARAMETER["scale_factor"' +
  ',0.9996],PARAMETER["false_easting",500000],PARAMETER["false_northing",0],AUTHORITY' +
  '["EPSG","26912"],AXIS["Easting",EAST],AXIS["Northing",NORTH]]';

// wkt3857: String
//      The well known text for wgs 84 for use with proj4
const wgs84 =
  'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID' +
  '["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],' +
  'PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",' +
  '0.0],PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER[' +
  '"Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]';

export const ProjectUtmToWgs = (geometry) => {
  geometry = proj4(utm, wgs84, geometry);

  return new Point({
    ...geometry,
    spatialReference: {
      wkid: 3857,
    },
  });
};
