<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span slot="good">商品列表</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">排序:</span>
            <a href="javascript:void(0)" class="default cur">默认</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods">
              价格
              <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':sortFlag}">
              <use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterpop">排序</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>价格:</dt>
                <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChick=='all'}" @click="priceChick='all';setPriceFilter('all')" >全部</a></dd>
                <dd v-for="(price,index) in priceFilter" @click="priceChick=index">
                  <a href="javascript:void(0)" v-bind:class="{'cur':priceChick==index}" @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4 warp-list">
                <ul>
                  <li v-for="(item,index) in goodsList">
                    <div class="pic">
                      <!--<a href="#"><img v-lazy="'/static/'+item.productImg" alt=""></a>-->
                      <a href="#"><img v-bind:src="'/static/'+item.productImg" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.productPrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                  <img src="./../assets/loading-spinning-bubbles.svg" v-show="load"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--小窗口下价格层级的遮罩-->
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>

      <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
        <p slot="message">
          请先登录,否则无法加入到购物车中!
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
        </div>
      </modal>

      <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成功!</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
          <!--定义一个超链接-->
          <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
      </modal>

      <nav-fooder></nav-fooder>
    </div>
</template>
<style>
  .sort-up{
    transform: rotate(180deg);
    transition: all .3s ease-out;
  }
</style>
<script>
  import NavHeader from  './../components/NavHeader.vue'
  import NavFooder from  './../components/NavFooter.vue'
  import NavBread from  './../components/NavBread.vue'
  import Modal from  './../components/Modal'
  import axios from 'axios'
    export default {
        name: "GoodsList",
      data(){
          return{
            goodsList:[],
            priceFilter:[
              {startPrice:'0',endPrice:'100'},
              {startPrice:'100',endPrice:'500'},
              {startPrice:'500',endPrice:'1000'},
              {startPrice:'1000',endPrice:'5000'}
            ],
            priceChick:'all',
            filterBy:false,//控制样式
            overLayFlag:false,//遮罩
            sortFlag:true,//控制升降序排列
            page:1,
            pageSize:4,
            busy:true,
            priceChicked:"all",
            load:false,
            mdShow:false,
            mdShowCart:false
          }
      },
      components:{
        NavHeader,
        NavFooder,
        NavBread,
        Modal
      },
      mounted:function () {
        this.getGoodsList();
      },
      methods:{
          getGoodsList(flag){//传入一个布尔值进行控制后续的加载,这是一个请求数据的接口
            var param={
              page:this.page,
              pageSize: this.pageSize,
              sort:this.sortFlag?1:-1,
              priceLevel:this.priceChicked
            };
            this.load=true;
            axios.get("/goods/list",{params:param}).then((result)=>{//params用来传参数，这是数据请求完的回调
              let res=result.data;
              this.load=false;
              if(res.status=="0"){//如果正确就返回值
                //分页
                if(flag){
                  this.goodsList=this.goodsList.concat(res.result.list);//把新的列表加到之前列表的后面
                  if(res.result.count==0){
                    this.busy===true;
                  }else {
                    this.busy=false;
                  }
                }else {
                  this.goodsList=res.result.list;
                  this.busy=false;
                }

              }else {//不正确就返回一个空数组
                this.goodsList=[];
              }
            })
          },
        sortGoods(){
          this.sortFlag=!this.sortFlag;//!非，直接取它的反值
          this.page=1;
          this.getGoodsList();
        },
        showFilterpop(){
            this.filterBy=true;this.overLayFlag=true;
        },
        closePop(){
          this.filterBy=false;this.overLayFlag=false;
        },
        setPriceFilter(index){
            this.priceChick=index;
            this.priceChicked=index;
            this.page=1;
            this.getGoodsList();
            this.closePop();
        },
        loadMore(){
          this.busy=true;
          setTimeout(() => {
            this.page++;
            this.getGoodsList(true);
          }, 500);
        },
        addCart(productId){
            axios.post("/goods/addCart",{
              productId:productId
            }).then((res)=>{
              if(res.data.status==0){
                this.mdShowCart=true;
                this.$store.commit("updateCartCount",1);
              }else {
                this.mdShow=true;
              }
            })
        },
        closeModal(){
            this.mdShow=false;
            this.mdShowCart=false
        }
      }
    }
</script>


