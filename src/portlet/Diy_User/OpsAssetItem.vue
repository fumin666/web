<template>
  <s-grid class="diy-user-ops-asset-item" direction="row">
    <img src="static/images/diy/asset.svg" width="30px" height="30px" style="margin-top: 15px;"/>
    <s-grid-item :flex="1">
      <div class="my-top">
        <div class="my-name">{{obj.itcompName}}</div>
        <div class="my-pname">{{obj.protocolName}}</div>
      </div>
      <div class="my-bottom">{{obj.controlAdderss}} | {{obj.accountName}}</div>
    </s-grid-item>
  </s-grid>
</template>

<script>
  export default {
    props: {
      obj: Object
    }
  }
</script>

<style>
  .diy-user-ops-asset-item {
    padding-left: 16px;
    padding-right: 16px;
  }
  .diy-user-ops-asset-item .my-top {
    display: flex;
    flex-direction: row;
    height: 20px;
    line-height: 20px;
    margin-top: 15px;
    padding-left: 10px;
  }
  .diy-user-ops-asset-item .my-ping {
    font-size: 14px;
    color: #61CD46;
  }
  .diy-user-ops-asset-item .my-name {
    font-size: 14px;
    flex: 1;
    padding-left: 6px;
  }
  .diy-user-ops-asset-item .my-pname {
    font-size: 12px;
    color: #392C28;
    padding: 0 4px;
  }
  .diy-user-ops-asset-item .my-bottom {
    font-size: 12px;
    color: #666;
    height: 17px;
    line-height: 17px;
    margin-top: 4px;
    padding-left: 10px;
  }
</style>
