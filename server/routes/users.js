var express = require('express');
var router = express.Router();

var User=require('./../models/user');
require('./../util/util');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/test', function(req, res, next) {
  res.send('test');
});
//登录接口
router.post('/login', function(req,res, next) {
  var param={
    userName:req.body.userName,
    userPwd:req.body.userPwd
  };
  User.findOne(param,function (err,doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message
      });
    }else {
      if(doc){
        res.cookie("userId",doc.userId,{
          path:'/',//传的地址
          maxiAge:1000*3600//cookie的有效时间
        });
        res.cookie("userName",doc.userName,{
          path:'/',//传的地址
          maxiAge:1000*3600//cookie的有效时间
        });
        /*req.session.user=doc;//将信息存入session*/
        res.json({
          status: '0',
          msg: '',
          result:{
            userName:doc.userName
          }
        })
      }else {
        res.json({
          status: '1',
          msg: '账号或密码错误',
          result:''
        })
      }
    }
  })
});

//登出接口
router.post("/logout",function (req,res,next) {
  res.cookie("userId",'',{
    path: '/',
    maxiAge: -1,//直接使cookie失效
  });
  res.json({
    status:'0',
    msg:'',
    result: ''
  })
});

//校验用户信息
router.get("/checkLogin",function (req,res,next) {
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName||''
    });
  }else {
    res.json({
      status:'',
      msg:'未登录',
      result:''
    });
  }
});

//查找出购物车
router.get("/cartList",function (req,res,next) {
  var  userId=req.cookies.userId;
  User.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else {
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.carList
        });
      }
    }
  })
});

//删除购物车
router.post("/cartDel", function (req,res,next) {
  var userId = req.cookies.userId,productId = req.body.productId;
  User.update({
    userId:userId
  },{
    $pull:{
      'carList':{
        'productId':productId
      }
    }
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  });
});

//更新购物车的数量
router.post("/cartEdit", function (req,res,next) {
  var userId = req.cookies.userId,productId = req.body.productId,productNum=req.body.productNum;
  User.update({"userId":userId,"carList.productId":productId},{
    "carList.$.productNum":productNum
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  });
});

//获取购物车商品的数量
router.get("/getCartCount", function (req,res,next) {
  if(req.cookies && req.cookies.userId){
    console.log("userId:"+req.cookies.userId);
    var userId = req.cookies.userId;
    User.findOne({"userId":userId}, function (err,doc) {
      if(err){
        res.json({
          status:"0",
          msg:err.message
        });
      }else{
        let cartList = doc.carList;
        let cartCount = 0;
        cartList.map(function(item){
          cartCount += parseFloat(item.productNum);
        });
        res.json({
          status:"0",
          msg:"",
          result:cartCount
        });
      }
    });
  }else{
    res.json({
      status:"0",
      msg:"当前用户不存在"
    });
  }
});
router.get("/getCartCount1",function (req,res,next) {
  if(req.cookie&&req.cookies.userId){
    var userId=req.cookies.userId;
    User.findOne({userId:userId},function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        var cartList =doc.carList;
        let cartCount=0;
        cartList.map(function (item) {//用map进行遍历
          cartCount+=parseInt(item.productNum);//每一个商品数量的累加
        });
        res.json({
          status:'0',
          msg:'',
          result:cartCount
        });
      }
    })
  }
});

//购物车全选
router.post("/editCheckAll",function (req,res,next) {
  var userId = req.cookies.userId,checked = req.body.checked?'1':'0';
  User.findOne({userId:userId},function (err,user) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if (user){
        user.carList.forEach((item)=>{
          item.checked=checked;
        });
        user.save(function (err1,doc) {
          if(err1){
            res.json({
              status:'1',
              msg:err1,message,
              result:''
            });
          }else{
            res.json({
              status:'0',
              msg:'',
              result:'suc'
            });
          }
        })
      }

    }
  });
});

//查询用户地址接口
router.get("/addressList",function (req,res,next) {
  var  userId=req.cookies.userId;
  User.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else {
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.addressList
        });
      }
    }
  })
});
//将地址设置为默认
router.post("/setDefault",function (req,res,next) {
  var  userId=req.cookies.userId,addressId=req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:'地址ID找不到',
      result:''
    });
  }else {
    User.findOne({userId:userId},function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else {
        if(doc){
          var addressList=doc.addressList;
          addressList.forEach((item)=>{
            if(item.addressId==addressId){
              item.isDefault=true;
            }else {
              item.isDefault=false;
            }
          });
          doc.save(function (err1,doc1) {
            if(err1){
              res.json({
                status:'1',
                msg:err.message,
                result:''
              });
            }else {
              res.json({
                status:'0',
                msg:'',
                result:''
              })
            }
          })

        }
      }
    });
  }
});

//删除地址接口
router.post('/delAddress',function (req,res,next) {
  var  userId=req.cookies.userId,addressId=req.body.addressId;
  User.update({
    userId:userId
  },{
    $pull:{
      'addressList':{
        'addressId':addressId
      }
    }
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  });
});

//生成订单
router.post("/payMent1", function (req,res,next) {
  var userId=req.cookie.userId;
  var addressId=req.body.addressId;
  var orderTotal=req.body.orderTotal;
  User.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      });
    }else {
      var address={},goodsList=[];
      //获取地址
      doc.addressList.forEach((item)=>{
        if(addressId==item.addressId){
          address=item;
        }
      });
      doc.carList.forEach((item)=>{
        if(item.checked='1'){
          goodsList.push(item);
        }
      });
      var platform = '622';
      var r1 = Math.floor(Math.random()*10);
      var r2 = Math.floor(Math.random()*10);

      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platform+r1+sysDate+r2;
      var order={
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:createDate
      };
      doc.orderList.push(order);
      doc.save(function (err1,doc) {
        if(err1){
          res.json({
            status:"1",
            msg:err.message,
            result:''
          });
        }else {
          res.json({
            status:"0",
            msg:'',
            result:{
              orderId:order.orderId,//返回订单号
              orderTotal:order.orderTotal//返回订单金额
            }
          });
        }
      })
    }
  })
});
router.post("/payMent", function (req,res,next) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId,
    orderTotal = req.body.orderTotal;
  User.findOne({userId:userId}, function (err,doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      });
    }else{
      var address = '',goodsList = [];
      //获取当前用户的地址信息
      doc.addressList.forEach((item)=>{
        if(addressId==item.addressId){
          address = item;
        }
      })
      //获取用户购物车的购买商品
      doc.carList.filter((item)=>{
        if(item.checked=='1'){
          goodsList.push(item);
        }
      });

      var platform = '622';
      var r1 = Math.floor(Math.random()*10);
      var r2 = Math.floor(Math.random()*10);

      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platform+r1+sysDate+r2;
      var order = {
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:createDate
      };

      doc.orderList.push(order);

      doc.save(function (err1,doc1) {
        if(err1){
          res.json({
            status:"1",
            msg:err.message,
            result:''
          });
        }else{
          res.json({
            status:"0",
            msg:'',
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          });
        }
      });
    }
  })
});
//根据订单Id查询订单信息
router.get("/orderDetail", function (req,res,next) {
  var userId = req.cookies.userId,orderId = req.param("orderId");
  User.findOne({userId:userId}, function (err,userInfo) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      var orderList = userInfo.orderList;
      if(orderList.length>0){
        var orderTotal = 0;
        orderList.forEach((item)=>{
          if(item.orderId == orderId){
            orderTotal = item.orderTotal;
          }
        });
        if(orderTotal>0){
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }else{
          res.json({
            status:'120002',
            msg:'无此订单',
            result:''
          });
        }
      }else{
        res.json({
          status:'120001',
          msg:'当前用户未创建订单',
          result:''
        });
      }
    }
  })
});

//添加地址
router.post("/addAddress",function (req,res,nex) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId,
    userName=req.body.userName,
    streetName=req.body.streetName,
    postCode=req.body.postCode,
    tel=req.body.tel;
  isDefault=req.body.isDefault;
    User.findOne({userId:userId},function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        var address = {
          addressId:addressId,
          userName:userName,
          streetName:streetName,
          postCode:postCode,
          tel:tel,
          isDefault:false
        };

        doc.addressList.push(address);

        doc.save(function (err1,doc1) {
          if(err1){
            res.json({
              status:"1",
              msg:'',
              result:''
            });
          }else{
            res.json({
              status:"0",
              msg:'',
              result:''
            });
          }
        })
      }
    });
});

module.exports = router;
