<template>
  <div class="s-empty">此模块正在加工中</div>
</template>

<script>
  export default {
    name: 'SEmpty'
  }
</script>

<style>
  .s-empty {
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    margin: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
