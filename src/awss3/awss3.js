
const aws = require('aws-sdk');

aws.config.update({
  accessKeyId: "AKIAY3L35MCRZNIRGT6N",
  secretAccessKey: "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",
  region: "ap-south-1"
});

let uploadFile = async (file) => {
  return new Promise(function(resolve, reject) {
    // this function will upload file to AWS and return the link
    let s3 = new aws.S3({apiVersion: '2006-03-01'}); // we will be using the S3 service of AWS

    var uploadParams = {
      ACL: "public-read",
      Bucket: "classroom-training-bucket", // Specify your bucket name here
      Key: "abc/" + file.originalname,
      Body: file.buffer
    };

    s3.upload(uploadParams, function (err, data) {
      if (err) {
        return reject({"error": err});
      }
      console.log(data);
      console.log("File uploaded successfully");
      return resolve(data.Location);
    });
  });
};


module.exports = {uploadFile};