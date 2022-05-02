const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();
const URL_EXPIRATION_SECONDS = 300;

// Main Lambda entry point
exports.handler = async (event, context) => {
  return await getUploadURL(event);
};

const getUploadURL = async function(event) {
  
  let key = '';
  
  switch(event.routeKey){
    
    case 'GET /URL_Lambda/output':
      key = 'output.txt';
    break;
    
    default:
      key = 'input.txt';
  }

  // Get signed URL from S3
  const s3Params = {
    Bucket: 'mystack-s3bucket-15to1mwj7zunc',
    Key: key,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: 'txt'
  };
  const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params);
  return JSON.stringify({
    uploadURL: uploadURL,
    key: key
  });
};