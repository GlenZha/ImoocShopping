<template>
  <div>
    这是商品列表页面<br>
    <router-link to="/goods/title">显示title</router-link>
    <router-link to="/goods/image">显示Image</router-link>
    <router-link to="/car">显示购物车</router-link>
    <button @click="jump">跳转到购物车</button>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
    export default {
        name: "coolList",
      methods:{
          jump(){
            //this.$router.push("/car");
            //this.$router.push({path:'/car?id=23'});
            this.$router.go(-2);
          }
      }
    }
</script>


