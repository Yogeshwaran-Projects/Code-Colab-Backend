require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

exports.uploadCode = (roomId, code) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${roomId}.txt`,
    Body: code,
    ContentType: 'text/plain'
  };

  return s3.upload(params).promise();
};
