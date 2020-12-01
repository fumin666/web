<template>
  <section class="approval-success">
    <header id="headBar" class="noPrint">
      <s-row type="flex" justify="between" align="middle" class="header-bg">
        <s-col :span="8" class="left-info">
          <div class="logo-icon" :title="systemName">
            <img src="static/images/logo/logo.svg"/>
          </div>
        </s-col>
        <s-col :span="8" class="right-info">
          <s-row type="flex" justify="center" align="middle" :gutter="16">
            <span class="title">运维审批</span>
          </s-row>
        </s-col>
      </s-row>
    </header>
    <div class="msg">
      <span>{{msg}}</span>
    </div>
  </section>
</template>

<script type="text/babel">
  import {getConfig} from 'sunflower-common-utils'
  export default {
    data () {
      return {
        systemName: getConfig('systemName')
      }
    },
    created() {
      this.msg = this.$route.params.errormsg
    },
    methods: {
    }
  }
</script>

<style scoped>
  .approval-success{
    height: 100%;
  }
  .approval-success .title{
    padding-right: 30px;
    color: #fff;
    line-height: 35px;
  }
  .approval-success .msg{
    text-align: center;
    color: #F56C6C;
    vertical-align:middle;
    font-weight: 600;
    font-size: 18px;
    height: calc(100% - 45px);
    display: flex;
    align-items: center;
    justify-content:center;
  }
</style>
