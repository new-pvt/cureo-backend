import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"



const s3Client = new S3Client({
    region:process.env.REGION,
    credentials: {
      accessKeyId:process.env.ACCESS_KEY_ID,
      secretAccessKey:process.env.SECRETE_ACCESS_KEY_ID
    }
  })

const uploadFile =(fileBuffer, fileName, mimetype)=>{
    const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Body: fileBuffer,
        Key: fileName,
        ContentType: mimetype
      }
return s3Client.send(new PutObjectCommand(uploadParams));
}

const deleteFile =(fileName)=>{
    const deleteParams = {
        Bucket: bucketName,
        Key: fileName,
      }
return s3Client.send(new DeleteObjectCommand(deleteParams));
}


const getObjectSignedUrl =async(key)=>{
    const params = {
        Bucket: bucketName,
        Key: key
      }
      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(s3Client, command);
      return url

}


export {
    getObjectSignedUrl,
    uploadFile,
    deleteFile
}