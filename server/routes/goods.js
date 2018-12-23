var express =require('express');//先拿到express对象
var router =express.Router();//拿到express的路由
var mongoose=require('mongoose');//为了操作数据库，拿到mongoose
var Goods=require('../models/goods');


//链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/local');
//链接数据库成功
mongoose.connection.on("connected",function () {
  console.log("MongoDB connected success")
});
//链接数据库错误
mongoose.connection.on("error",function () {
  console.log("MongoDB connected error")
});
//链接数据库没有成功
mongoose.connection.on("disconnected",function () {
  console.log("MongoDB connected disconnected")
});
//get到商品的路由
router.get("/list",function (req,res,next) {//二级路由访问“/”时用get，返回一个回调函数//res.send('good list')
  let page=parseInt(req.param("page"));//页码
  let pageSize=parseInt(req.param("pageSize"));//每页的条数
  let sort =parseInt(req.param("sort"));//获取从网页传过来的sort参数，自定义排序的
  let skip=(page-1)*pageSize;//应该跳过的条数
  let params={};
  let priceLevel=req.param("priceLevel");//获取到价格分类的层级
  var priceGt='',priceLte='';
  if(priceLevel!=='all'){
    switch (priceLevel) {
      case "0":priceGt=0;priceLte=100;break;
      case "1":priceGt=100;priceLte=500;break;
      case "2":priceGt=500;priceLte=1000;break;
      case "3":priceGt=1000;priceLte=5000;break;
    }
    params={
      productPrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }

  let goodsModel=Goods.find(params).skip(skip).limit(pageSize);//find查找所有数据,skip跳过的条数,limit一页多少条


  goodsModel.sort({'productPrice':sort});//根据商品的价格进行升降序的排列

  //
  goodsModel.exec(function (err,doc) {//回调函数，回调ERROR和文档
    if(err){
      res.json({//错误传回的错误信息
        status:'1',
        msg:err.message
      });
    }else {
      res.json({
        status: '0',
        msg:'',
        result:{
          count:doc.length,//数据的数量
          list:doc//doc是我们需要的列表集合
        }
      })
    }
  });

});
//post到购物车的路由
router.post("/addCart",function (req,res,next) {
  var userId=req.cookies.userId,productId=req.body.productId;
  var User=require('../models/user');//获取用户的模型
  User.findOne({userId:userId},function (err,userDoc) {
    if (err){
      res.json({
        status:'1',
        msg:err.message
      })
    } else {
      console.log("userDoc:"+userDoc);
      if(userDoc){
        let goodItem='';
        userDoc.carList.forEach(function (item) {
          if(item.productId==productId){
            goodItem=item;
            item.productNum++;
          }
        });
        if (goodItem){
          userDoc.save(function (err2,doc2) {
            if(err2){
              res.json({
                status:'1',
                msg:err2.message
              })
            }else {
              res.json({
                status:'0',
                msg:'',
                result: '加入成功'
              })
            }
          })
        } else {
          Goods.findOne({productId:productId},function (err1,doc) {
            if(err1){
              res.json({
                status:'1',
                msg:err1.message
              })
            }else {
              if(doc){
                doc._doc.checked="1";
                doc._doc.productNum="1";
                userDoc.carList.push(doc);
                userDoc.save(function (err2,doc2) {
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err2.message
                    })
                  }else {
                    res.json({
                      status:'0',
                      msg:'',
                      result: '加入成功'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  });
});
module.exports=router;//将路由输出
