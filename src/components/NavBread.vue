<template>
  <div class="nav-breadcrumb-wrap">
    <div class="container">
      <nav class="nav-breadcrumb">
        <a href="/">主页</a>
        <slot name="good"></slot>
        <slot name="test"></slot>
      </nav>
    </div>
  </div>
</template>
<script>
  export default {
    name: "NavBread",
  }
</script>
