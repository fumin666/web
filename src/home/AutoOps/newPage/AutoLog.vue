<!--
 * @Author: 高建鹏
 * @Description:近期脚本日志模块
 * @Position:
 * @Date: 2019-10-18 13:40:27
 * @LastEditors: mybells
 -->

<template>
  <section class="autolog">
    <s-card class="box-card card-line">
      <div slot="header" class="clearfix" style="padding-left:0;padding-right:10px;border:none;">
        <span class="card-title">{{ cardConfig.title }}</span>
        <div class="card-enter more-info" @click="handleMore('autoops_log/0')">{{ cardConfig.moreText }}</div>
      </div>
      <div class="autolog_cardbody">
        <div v-if="listData.length">
          <div class="autologcontent" v-for="(item, index) in listData" :key="index">
            <div class="autolog_left">
              <img :src="`/static/images/autoOps/status/${item.excuteStatus?'sucess':'error'}.svg`">
            </div>
            <div class="autolog_right">
              <div class="autolog_righttop">
                <span :title="`${item.scriptName}`" class="autolog_righttext1" style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">{{item.scriptName}}</span>
                <span class="autolog_righttext2" style="white-space: nowrap;float:right;">{{item.createTime}}</span>
              </div>
              <div class="autolog_rightbottom" :title="`IP：${item.assetIp} | 操作人：${item.excuteUserName}`">
                IP：{{item.assetIp}} | 操作人：{{item.excuteUserName}}
              </div>
            </div>
          </div>
        </div>
        <div v-nodata="!listData.length" v-else style="height:250px;"></div>
      </div>
    </s-card>
  </section>
</template>
<script type="text/babel">
  import mixin from '@/common/mixins/portletUtil'
  import $axios from 'sunflower-ajax';
  export default {
    mixins: [mixin],
    data () {
      return {
        cardConfig: {
          title: '近期脚本执行日志',
          moreText: '更多'
        },
        listData: []
      }
    },
    created() {
      $axios.get(`/autoMateCount/getScriptTaskLogTopN/10`).then(({data}) => {
        this.listData = data || []
      })
    },
    methods: {
      handleMore(path) {
        this.$router.push('/AutoOpsCenter/' + path)
      }
    },
    components: {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.autolog
  .s-card-header
    border:none !important;
</style>
