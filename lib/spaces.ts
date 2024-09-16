import AWS from 'aws-sdk';

if (!process.env.DIGITAL_OCEAN_ORIGIN_SPACES_ENDPOINT) {
  throw new Error('DIGITAL_OCEAN_ORIGIN_SPACES_ENDPOINT is not set');
}

const spacesEndpoint = new AWS.Endpoint(process.env.DIGITAL_OCEAN_ORIGIN_SPACES_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DIGITAL_OCEAN_SPACE_ACCESS_KEY,
  secretAccessKey: process.env.DIGITAL_OCEAN_SPACE_SECRET_KEY,
  region: 'us-east-1', // DigitalOcean Spaces use this region
  signatureVersion: 'v4'
});

export default s3;