/**
* Created by dgunzi on 2019/02/25.
* 资产生命周期
*/
<template>
  <div>
    <s-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">
          资产生命周期
        </span>
      </div>
      <div>
        <section id="AssetLifeCycleTimeLine" style="width: 400px;margin:0 auto;margin-top:10px;">
            <s-time-line type="equalTwoway" v-if="lifeCycleDetailLists.length > 0">
              <template v-for="(list, index) in lifeCycleDetailLists">
                <s-time-line-item>
                  <div slot="left">
                    <span
                      class="lifeName"
                      v-text="list.statusName"
                      :style="{backgroundColor:circleColor(list.statusName)}">
                    </span>
                  </div>
                  <div slot="right" style="overflow:hidden ;text-overflow:ellipsis;white-space:nowrap">
                    <div class="rightSlot">
                      <span class="userName">
                        <i class="iconfont icon-user"></i>
                        <span v-text="list.createUserName"></span>
                      </span>
                      <span class="createTime">
                        <i class="iconfont icon-clock"></i>
                        <span v-text="list.createTime"></span>
                      </span>
                    </div>
                  </div>
                </s-time-line-item>
              </template>
            </s-time-line>
        </section>
        <div v-nodata="lifeCycleDetailLists.length <= 0"></div>
      </div>
    </s-card>
  </div>
</template>


<script>
    import $axios from 'sunflower-ajax';
    import {sTimeLine, sTimeLineItem} from '@/components/timeline';
    export default {
        name: 'AssetLifeCycleTimeLine',
        data() {
            return {
              lifeCycleDetailLists: [],
              /* 基础信息参数 */
              assetUuid: this.$route.params.assetUuid
            }
        },
        components: {
          sTimeLine,
          sTimeLineItem
        },
        created() {
          $axios.get(`/resourcemanager/assetmanager/itasset/getItcompLife/${this.assetUuid}`).then(({data}) => {
            if (data && data.assetLifecycles instanceof Array) {
              this.lifeCycleDetailLists = data.assetLifecycles;
            }
          });
        },
        methods: {
          circleColor(statusName) {
            switch (statusName) {
              case '使用':
                return '#96ca28';
              case '变更':
                return '#fab22a';
              case '维修':
                return '#9b88d5';
              case '报废':
                return '#b6cee0';
              case '折旧':
                return '#63abc1';
              case '库存':
                return '#89ceff';
              case '退库':
                return '#f08faa';
              default:
                return '#b6cee0';
            }
          }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #AssetLifeCycleTimeLine
    .lifeName
      position absolute
      display inline-block
      padding 3px 8px
      border-radius 4px
      color #fff
      font-size 14px
      text-align center
    .rightSlot
      margin-right -20px
      .userName, .createTime
        margin-left 3px
        font-size 12px
      .iconfont
        font-weight bold
    /*资产生命周期详情弹框时间轴样式重新定义*/
    .s-timeline.equalTwoway
      .timeline-icon
        margin-left 52px !important
        div
          margin -3px 1px
      .s-timeline-item
        .s-timeline-item-head
          left 55px !important
        .s-timeline-item-tail
          left 59px !important
        .s-timeline-item-content
          &>div
            &:first-child
              float left
              position relative
              width 100px
              height 30px
            &:nth-child(2)
              width :70%;
              margin -30px 15px 0 0 !important
              padding 6px 10px
              float right
</style>
