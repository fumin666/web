<template>
  <div class="diy-script-log autoOpsfix autolog">
    <s-card-diy
      show-scrollbar
      title="近期脚本执行日志"
      :more-click="goto">
        <div v-nodata="listData.length === 0">
          <s-row type="flex" class="script-log-item s-row-flex autologcontent" v-for="(item, index) in listData" :key="index">
            <div class="autolog_left">
              <img :src="`/static/images/autoOps/status/${item.excuteStatus?'sucess':'error'}.svg`">
            </div>
            <div class="autolog_right">
              <div class="autolog_righttop">
                <span :title="`${item.scriptName}`" class="autolog_righttext1" style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">{{item.scriptName}}</span>
                <span class="autolog_righttext2" style="white-space: nowrap;float:right;">{{item.createTime}}</span>
              </div>
              <div class="autolog_rightbottom" :title="`IP：${item.assetIp}} | 操作人：${item.excuteUserName}}`">
                IP：{{item.assetIp}} | 操作人：{{item.excuteUserName}}
              </div>
            </div>
          </s-row>
        </div>
    </s-card-diy>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default{
    data() {
      return {
        listData: []           // 近期脚本执行日志
      }
    },
    methods: {
      // 路由跳转
      goto() {
        this.$router.push('/AutoOpsCenter/autoops_log/0');
      }
    },
    created() {
      // 获取"近期脚本执行日志"数据
      $axios.get(`/autoMateCount/getScriptTaskLogTopN/10`).then(({data}) => {
        this.listData = data || []
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .diy-script-log
    .script-log-item
      height 80px
      padding 0 10px
      .log-item
        .client
          font-size 12px
          padding 2px 5px
          border-radius 2px
</style>
