/**
 * @author fumin
 * @date 2019/10/31
 * @Description: 我的审批一级页面卡片
*/
<template>
  <s-col style="margin-right: 10px;margin-top: 10px;width: calc(33.3% - 12px);overflow: hidden;" class="DealWorkBox">
    <div class="dealWorkContainer">
      <s-row class="title">
        <s-col span="18">
          <s-row>
            <span
            :class="[model.orderType === '变更' ? 'changeOrderColor' : model.orderType === '知识' ? 'knowledgeOrderColor' : model.orderType === '服务请求' ? 'requestServiceOrderColor' : 'publishOrderColor']"
            class="type" v-html="model.orderType"></span>
            <span class="titleRadiusBg">
              <!--<span class="titleInfo">{{num + 1}}. </span>-->
              <span class="titleInfo" style="cursor: pointer"
                    @click="clickToOrder(model.orderUuid, model.orderType)">{{model.sercode}}</span>
            </span>
            <i class="titleInfo iconfont"
               :class="[model.isConcern !== 1 ? 'icon-star-empty attended' : 'icon-star-full attended']"
               :style="{cursor: 'pointer', fontSize: '20px'}"
               @click="handleConcern1(model.orderUuid, model.orderType, model.isConcern, model.concernUuid)"
               :title="model.isConcern !== 1 ? '关注' : '取消关注'">
            </i>
          </s-row>
          <s-row class="info"><span :title="model.createTime">创建时间：{{model.createTime}}</span></s-row>
          <s-row class="info"><span :title="model.createUserName">工单状态：{{getStatus(model)}}</span></s-row>
          <s-row class="deil">
            <span class="status green" :title="model.titile" :style="'opacity: 0.65; display: flex; justify-content:flex-start; line-height:' + spanHeight + 'px;'" >
              {<span class="status green" :style="'display: inline-block; width: auto; max-width: calc(100% - 22px); overflow: hidden; text-overflow: ellipsis;word-break: keep-all;white-space: nowrap;' + 'line-height:' + spanHeight + 'px;'">
                {{ model.titile}}
              </span>}
            </span>
          </s-row>
        </s-col>
        <s-col span="6" class="process-border-left">
          <div class="btns" style="text-align: center">
            <div>
              <s-button class="btnCol" icon="info-read" title="通过" @click="allow(model.uuid)"
                        :disabled="delIsShow">
              </s-button>
            </div>
            <div :max="99">
              <s-button icon="cancel" class="btnCol" title="拒绝" @click="refuse(model.uuid)">
              </s-button>
            </div>
          </div>
        </s-col>
      </s-row>
    </div>
  </s-col>
</template>

<script>
   // import $axios from 'sunflower-ajax'

  export default {
    data () {
      return {
      }
    },
    props: ['num', 'model', 'spanHeight', 'rolePro'],
    computed: {
      delIsShow() {
        if (this.model.approveStatus !== '未审批') {
          return true;
        } else {
          return false
        }
      }
    },
    mounted() {
    },
    methods: {
      getStatus(model) {
        let data = []
        switch (model.orderType) {
          case '变更': // 变更
            data = this.$store.state.processCenter.status[2]
            return data[model.userStatus - 1]
          case '知识': // 知识
            data = this.$store.state.processCenter.status[4]
            return data[model.userStatus - 1]
          case '发布': // 发布
            data = this.$store.state.processCenter.status[5]
            return data[model.userStatus]
          case '服务请求': // 服务请求
            data = this.$store.state.processCenter.status[6]
            return data[model.userStatus]
        }
      },
      clickToOrder(uuid, orderType) {
        if (orderType === '变更') {
          orderType = 2
        } else if (orderType === '知识') {
          orderType = 4
        } else if (orderType === '发布') {
          orderType = 5
        } else {
          orderType = 6
        }
        this.$emit('goOrder', uuid, orderType)
      },
      allow(allowUuid) {
        this.$emit('allow', allowUuid)
      },
      refuse(refuseUuid) {
        this.$emit('refuse', refuseUuid)
      },
      handleConcern1 (uuid, orderType, isConcern, concernUuid) {
        if (orderType === '变更') {
          orderType = 2
        } else if (orderType === '知识') {
          orderType = 4
        } else if (orderType === '发布') {
          orderType = 5
        } else {
          orderType = 6
        }
        this.$emit('handleConcern1', uuid, orderType, isConcern, concernUuid)
      }
    }
  }
</script>
<style scoped>
.DealWorkBox{
  border-radius: 2px;
}
</style>
