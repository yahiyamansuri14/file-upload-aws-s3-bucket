const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const fileUpload = require('express-fileupload')
const aws = require('aws-sdk')
const moment = require('moment')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(fileUpload())
require('dotenv').config()
const s3 = new aws.S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
})

app.post('/fileupload', async (req, res) => {
    console.log(process.env.accessKeyId)
    console.log(process.env.secretAccessKey)
    let photo = await req.files.photo
    let uploadPath = __dirname + '/uploads/'
    console.log(uploadPath)
    let splitted = photo.name.split('.')
    let fileExt = splitted[splitted.length - 1]
    let fileName = moment().unix() + "." + fileExt
    uploadPath += fileName
    console.log(uploadPath)
    photo.mv(uploadPath, (err) => {
        if (err) {
            res.send({ status: "ERR", message: "there is some error!!!" })
        } else {
            const uploadFileContent = fs.readFileSync(uploadPath)
            const params = {
                Bucket: 'YOUR BUCKET NAME',
                Key: fileName, // File name you want to save as in S3
                Body: uploadFileContent,
                ACL: 'public-read'//give access to public to read file
            }
            s3.upload(params, function(err,data){
                if (err){
                    console.log(err)
                    return res.send({ status: "ERR", message: "there is some error!!!" })
                }
                console.log(data)
                console.log(data.Location)
                fs.unlinkSync(uploadPath)
                res.send({status:"OK", message:"file uploaded successfully"})
            })
        }
    })
})

app.listen(3300, () => {
    console.log("Server started....")
})
