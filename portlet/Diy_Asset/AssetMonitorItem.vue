<template>
  <s-grid
    class="diy-asset-asset-monitor-item"
    style="justify-content: center; align-items: center"
    direction="column">
    <div class="grid-top">{{data.title}}({{data.count}})</div>
    <div class="grid-bottom">
      <div class="grid-bottom-l">
        <img :src='`/${data.path}`' width="32px" height="32px">
      </div>
      <div class="grid-bottom-r">
        <div class="my-error">异常: {{data.data['异常']}}</div>
        <div>告警: {{data.data['告警']}}</div>
        <div>正常: {{data.data['正常']}}</div>
      </div>
    </div>
  </s-grid>
</template>

<script>
  export default {
    props: {
      data: Object
    },

    computed: {
      dir() {
        if (localStorage.theme === 'dark') {
          return 'dark';
        } else {
          return 'normal';
        }
      }
    }
  }
</script>

<style>
  .diy-asset-asset-monitor-item .grid-top {
    width: 126px;
    font-size: 14px;
    padding-left: 6px;
    position: relative;
    margin-bottom: 10px;
  }
  .diy-asset-asset-monitor-item .grid-top:before {
    content: '';
    width: 2px;
    height: 12px;
    background: #ff8441;
    position: absolute;
    left: 0;
    top: 4px;
  }
  .diy-asset-asset-monitor-item .grid-bottom {
    width: 126px;
    height: 64px;
    display: flex;
    flex-direction: row;
  }
  .diy-asset-asset-monitor-item .grid-bottom-l {
    width: 64px;
    height: 64px;
    text-align: center;
    padding-top: 16px;
  }
  .diy-asset-asset-monitor-item .grid-bottom-r {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
  }
  .diy-asset-asset-monitor-item .grid-bottom-r div {
    flex: 1;
    font-size: 12px;
  }
  .diy-asset-asset-monitor-item .grid-bottom-r .my-error {
    color: #ff4a4a;
  }
</style>
