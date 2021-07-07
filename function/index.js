require('dotenv').config();

const client = require('@sendgrid/client');
const yup = require('yup');

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
    templateValues: yup.object().shape({
      application: yup.string().required(),
      user: yup
        .string()
        .email()
        .default(() => 'anonymous@coward.gov'),
      basemap: yup.string().oneOf(['lite', 'topo', 'hybrid', 'address points', 'terrain', 'color-ir']).required(),
      description: yup.string().required(),
      link: yup.string().url().required(),
    }),
  }),
});

client.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = (options) => {
  var options = {
    method: 'post',
    url: '/v3/mail/send',
    body: {
      template_id: 'd-be4d2631ac974a13a1e31e4598cf3aef',
      ...options,
    },
  };

  console.log(JSON.stringify(options, null, 2));
  if (process.env.NODE_ENV === 'production') {
    return client.request(options);
  }

  return Promise.resolve([{ statusCode: 200 }]);
};

exports.sendgrid = (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET');

  const data = request.body;

  if (request.headers['referrer']?.indexOf('.utah.gov') === -1 && process.env.NODE_ENV === 'production') {
    return response.status(403).json();
  }

  if (!data || typeof data !== 'object') {
    return response.status(400).json({
      message: 'Required data is missing!',
    });
  }

  const valid = schema.cast(data);

  if (!valid) {
    return response.status(400).json({
      message: 'Required data is missing!',
    });
  }

  const to = emails.filter((item) => data.email.toIds.includes(item.id));
  const from = emails.filter((item) => data.email.fromId === item.id)[0];

  sendMail({
    from: { email: from.email },
    personalizations: [
      {
        to,
        dynamic_template_data: valid.template.templateValues,
      },
    ],
  }).then(([result]) => {
    console.log(result.statusCode);

    return response.status(202).json();
  });
};
