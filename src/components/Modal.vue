<!--模态框-->
<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
      <div class="md-modal-inner">
        <div class="md-top">
          <button class="md-close" @click="closeModal">关闭</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="message"></slot>
          </div>

          <div class="btn-wrap">
            <slot name="btnGroup"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
  </div>
</template>
<style>

</style>
<script>
  export default{
    props:["mdShow"],
    data(){
      return{
        msg:'hello vue'
      }
    },
    methods:{
      closeModal(){
        this.$emit("close");//类似于jQuery的trigger，触发父组件的close事件
        //trigger("click")
      }
    }
  }
</script>
