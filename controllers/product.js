const Product = require('../models/product');

const formidable = require('formidable');
const _ = require("lodash");
const fs = require('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');
const product = require('../models/product');


exports.productById = (req,res,next,id) => {
    Product.findById(id).exec((err,product) => {
        if (err || !product){
            return res.status(400).json({
                 error: "Product not found"
             });
         }
         req.product = product;
         next();
     });
 };
 
 
 
 exports.read = (req,res) => {
     req.product.photo = undefined;
     return res.json(req.product);   
 };



exports.create = (req,res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,files) => {
        if(err) {
            return res.status(400).json({
                err: 'Image could not be uploaded'
            });
        }
        // check for all fields
        const {name ,description ,price ,category ,quantity ,photo ,shipping } = fields;
//     const requiredFields = {name,description,price,category,quantity,photo,shipping};

  //   form.on('field', function(name, value) {
  //          if (requiredFields.indexOf(name) > -1 && !value) {
  //              // field is required and its value is empty
  //              form._error('Required field is empty!');
  //              return;
  //          }
  //      });
  //      // Send error message back to client.
  //   form.on('error', function (message) {
  //      res.end(message);
  //  });

   //     if(!name || !description || !price || !category || !quantity || !photo || !shipping) {
    //       return res.status(400).json({
    //          error: 'All fields are required'
   //         });
   //     }
    let product = new Product(fields);

          //1kb=1000
        //1mb=1000000

        if(files.photo){
    //        var sizeLimitBytes = 2000;
    //form.on('progress', function(bytesReceived, bytesExpected) {
    //        if(bytesReceived > sizeLimitBytes ){
    //              return false; //exit the program
    //         }
    //    });

     //       if(files.photo.size> 1000000){
     //           return res.status(400).json({
     //               error: 'Image should be less than 1mb of size'
     //           });
     //       }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.contentType;

        }

        product.save((err,result) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
             }
            res.json({result});
         });
     });
 };


 exports.remove = (req,res) => {
      let product=req.product;
      product.remove((err, deletedProduct) => {
          if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
          }
          res.json({
              message: "Product is deleted Successfully"
          });
            
      });
 };
 