const test = require('ava');
const { formatLink, schema } = require('./index.js');

test('address point editor schema with point', (t) => {
  const data = {
    email: { toIds: [3], fromId: 2 },
    template: {
      templateId: 3,
      templateValues: {
        description: 'we moved offices',
        application: 'https://test.mapserv.utah.gov/address-point-editor/',
        basemap: 'Terrain',
        user: 'anonymous',
        link: 'https://test.mapserv.utah.gov/chalkdust?center={{center}}&level={{level}}&redline={{redline}}',
        center: '{"x":-12418256.062931547,"y":5166331.468454685,"spatialReference":{"wkid":3857}}',
        level: 7,
        redline: '{"x":-12453111.347829578,"y":4977990.630760062,"spatialReference":{"wkid":3857}}',
      },
    },
  };

  t.deepEqual(
    {
      email: { toIds: [3], fromId: 2 },
      template: {
        templateId: 3,
        templateValues: {
          description: 'we moved offices',
          application: 'https://test.mapserv.utah.gov/address-point-editor/',
          basemap: 'terrain',
          user: 'anonymous',
          link: 'https://test.mapserv.utah.gov/chalkdust?center={{center}}&level={{level}}&redline={{redline}}',
          center: '{"x":-12418256.062931547,"y":5166331.468454685,"spatialReference":{"wkid":3857}}',
          level: 7,
          redline: '{"x":-12453111.347829578,"y":4977990.630760062,"spatialReference":{"wkid":3857}}',
        },
      },
    },
    schema.validateSync(data)
  );
});

test('address point editor schema without point', (t) => {
  const data = {
    email: { toIds: [3], fromId: 2 },
    template: {
      templateId: 3,
      templateValues: {
        description: 'we moved offices',
        application: 'https://test.mapserv.utah.gov/address-point-editor/',
        basemap: 'Terrain',
        user: 'anonymous',
      },
    },
  };

  t.deepEqual(
    {
      email: { toIds: [3], fromId: 2 },
      template: {
        templateId: 3,
        templateValues: {
          description: 'we moved offices',
          application: 'https://test.mapserv.utah.gov/address-point-editor/',
          basemap: 'terrain',
          user: 'anonymous',
        },
      },
    },
    schema.validateSync(data)
  );
});

test('default values', (t) => {
  const data = {
    email: { toIds: [3], fromId: 2 },
    template: {
      templateId: 3,
      templateValues: {
        description: 'we moved offices',
        application: 'https://test.mapserv.utah.gov/address-point-editor/',
      },
    },
  };

  t.deepEqual(
    {
      email: { toIds: [3], fromId: 2 },
      template: {
        templateId: 3,
        templateValues: {
          description: 'we moved offices',
          application: 'https://test.mapserv.utah.gov/address-point-editor/',
          basemap: 'unknown',
          user: 'anonymous@coward.gov',
        },
      },
    },
    schema.validateSync(data)
  );
});

test('format link returns itself when no redline is provided', (t) => {
  t.is('a link', formatLink('a link', {}));
});

test('format link creates valid querystring', (t) => {
  const link = 'https://chalkdust.dev.utah.gov/';
  t.is('https://chalkdust.dev.utah.gov/?redline=1', formatLink(link, { redline: 1 }));
});

test('format link creates valid querystring for a geometry', (t) => {
  const link = 'https://chalkdust.dev.utah.gov/';
  t.is(
    'https://chalkdust.dev.utah.gov/?redline={"x":-12453111.347829578,"y":4977990.630760062,"spatialReference":{"wkid":3857}}',
    formatLink(link, { redline: { x: -12453111.347829578, y: 4977990.630760062, spatialReference: { wkid: 3857 } } })
  );
});
