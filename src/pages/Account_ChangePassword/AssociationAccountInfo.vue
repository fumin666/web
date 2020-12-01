<template>
  <section>
    <s-row class="taskRow">
      <s-col span="8" class="grid-content bg-purple">账号名：</s-col>
      <s-col span="16" class="grid-content bg-purple-light">{{infoData.accountName}}</s-col>
    </s-row>
    <s-row class="taskRow">
      <s-col span="8" class="grid-content bg-purple">类型：</s-col>
      <s-col span="16" class="grid-content bg-purple-light">{{infoData.accountTypeStr}}</s-col>
    </s-row>
    <s-row class="taskRow">
      <s-col span="8" class="grid-content bg-purple">账号属性：</s-col>
      <s-col span="16" class="grid-content bg-purple-light">{{attributeTxt}}</s-col>
    </s-row>
    <s-row class="taskRow">
      <s-col span="8" class="grid-content bg-purple">状态：</s-col>
      <s-col span="16" class="grid-content bg-purple-light">{{statusTxt}}</s-col>
    </s-row>
    <s-row class="taskRow">
      <s-col span="8" class="grid-content bg-purple">备注：</s-col>
      <s-col span="16" class="grid-content bg-purple-light">{{infoData.remark}}</s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  // import {intersectObj} from 'sunflower-common-utils'

  export default{
    data() {
      return {
        attributeTxt: this.infoData.attribute === 1 ? '托管账号' : '收集账号'
      }
    },
    props: {
      infoData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      statusTxt() {
        switch (this.infoData.status) {
          case 0:
            return '未激活'
          case 1:
            return '激活'
          case 2:
            return '锁定'
          case 3:
            return '注销'
          case 4:
            return '删除'
        }
      }
    }
  }
</script>
