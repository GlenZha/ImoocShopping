//定义一个商品模型
var mongoose=require('mongoose');
var Schema=mongoose.Schema;//定义表模型

var productSchema =new Schema({//定义一个模型
  "productId":{type:String},//另一种定义字符类型
  "productName":String,
  "productPrice":Number,
  "productImg":String
});

module.exports=mongoose.model('Good',productSchema,'goods');//把这个模型输出去
