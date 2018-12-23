<template>
  <div>
    <button @click="add">加</button>
    <button @click="cut">减</button>
    <p><span>{{num}}</span></p>
  </div>
</template>

<script>
    export default {
      props:["num"],
        name: "add",
      data(){
          return{
            num:0,
          }
      },
      methods:{
          add(){
            this.num++;
          },
          cut(){
            this.num--;
          },
      }
    }
</script>
