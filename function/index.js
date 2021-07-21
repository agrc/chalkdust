const client = require('@sendgrid/client');
const yup = require('yup');
const queryString = require('query-string');

if (!['production', 'test'].includes(process.env.NODE_ENV)) {
  require('dotenv').config();
}

if (process.env.NODE_ENV !== 'test') {
  client.setApiKey(process.env.SENDGRID_API_KEY);
}

const emails = [
  { id: 1, email: 'ugrc@utah.gov' },
  { id: 2, email: 'noreply@utah.gov' },
  { id: 3, email: 'sgourley@utah.gov' },
  { id: 4, email: 'stdavis@utah.gov' },
  { id: 5, email: 'eneemann@utah.gov' },
  { id: 6, email: 'sfernandez@utah.gov' },
  { id: 7, email: 'zbeck@utah.gov' },
  { id: 8, email: 'agrc@utah.gov' },
  { id: 12, email: 'gbunce@utah.gov' },
];

const schema = yup.object().shape({
  email: yup.object().shape({
    fromId: yup.number().integer().required(),
    toIds: yup.array().of(yup.number().integer().positive()).required(),
  }),
  template: yup.object().shape({
    templateId: yup.number().integer().default(-1),
    templateValues: yup.object().shape({
      application: yup.string().required(),
      user: yup.string().required().default('anonymous@coward.gov'),
      basemap: yup.string().lowercase().default('unknown'),
      description: yup.string().required(),
      link: yup.string(),
    }),
  }),
});

const formatLink = (link, options) => {
  if (options.redline) {
    options.redline = options.redline;
    const stringify = queryString.stringify(options, { encode: false });

    const url = new URL(link);
    return `${url.protocol}//${url.host}${url.pathname}?${stringify}`;
  }

  return link;
};

const sendMail = (options) => {
  var options = {
    method: 'post',
    url: '/v3/mail/send',
    body: {
      template_id: 'd-be4d2631ac974a13a1e31e4598cf3aef',
      ...options,
    },
  };

  console.info('sending mail with options', JSON.stringify(options));

  if (process.env.NODE_ENV === 'production') {
    return client.request(options);
  }

  return Promise.resolve([{ statusCode: 200 }]);
};

const sendgrid = (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');

  if (request.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    console.info('responding to cors request');

    response.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Max-Age', '3600');

    return response.status(204).send('');
  } else if (request.method === 'GET') {
    return response.status(204).send('');
  }

  const data = request.body;

  if (request.headers['referrer']?.indexOf('.utah.gov') === -1 && process.env.NODE_ENV === 'production') {
    console.warn('invalid header', JSON.stringify(request.headers['referrer']));

    return response.status(403).json();
  }

  if (!data || typeof data !== 'object') {
    console.warn('invalid data', JSON.stringify(data));

    return response.status(400).json({
      message: 'Required data is missing!',
    });
  }

  let valid = false;

  try {
    valid = schema.validateSync(data);
  } catch (error) {
    console.error('invalid schema', error);

    return response.status(400).json({
      message: error.message,
    });
  }

  const to = emails.filter((item) => data.email.toIds.includes(item.id));
  const from = emails.filter((item) => data.email.fromId === item.id)[0];

  valid.template.templateValues.link = formatLink(valid.template.templateValues.link, valid.template.templateValues);

  sendMail({
    from: { email: from.email },
    personalizations: [
      {
        to,
        dynamic_template_data: valid.template.templateValues,
      },
    ],
  }).then(([result]) => {
    console.info('email sent', result.statusCode);

    return response.status(202).json();
  });
};

module.exports = {
  schema,
  formatLink,
  sendgrid,
};
