import config from "../../config.mjs";
import aws from "aws-sdk";
aws.config.update({
  secretAccessKey: config.secretAccessKey,
  accessKeyId: config.secretKey,
  region: config.region,
});
const s3 = new aws.S3({ apiVersion: "2006-03-01" });
const uploadFile = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error("Invalid file object: buffer is missing"));
    }
    if (!file.originalname) {
      return reject(new Error("Invalid file object: originalname is missing"));
    }
    const uploadParams = {
      ACL: "public-read",
      Bucket: "book-management-backend",
      Key: `book-management/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
    };
    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.error("S3 Upload Error Details:", {
          code: err.code,
          message: err.message,
          statusCode: err.statusCode,
          region: config.region,
          bucket: uploadParams.Bucket,
          key: uploadParams.Key,
        });
        return reject(err);
      }
      if (!data || !data.Location) {
        return reject(
          new Error("Failed to upload file: No location returned from S3"),
        );
      }
      resolve(data.Location);
    });
  });
};
export default uploadFile;
