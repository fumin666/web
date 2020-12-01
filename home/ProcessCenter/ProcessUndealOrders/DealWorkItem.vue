<template>
  <s-col style="margin-right: 10px;margin-top: 10px;width: calc(33.3% - 12px);overflow: hidden;" class="DealWorkBox">
    <div class="dealWorkContainer">
      <s-row class="title">
        <s-col span="18">
          <s-row>
            <span
            :class="[model.orderType === 0 ? 'eventOrderColor' : model.orderType === 1 ? 'problemOrderColor' : model.orderType === 2 ? 'changeOrderColor' : model.orderType === 3 ? 'taskOrderColor' : model.orderType === 4 ? 'knowledgeOrderColor' : model.orderType === 6 ? 'requestServiceOrderColor' : 'publishOrderColor']"
            class="type" v-html="getOrderType(model.orderType)"></span>
            <span class="titleRadiusBg">
              <!--<span class="titleInfo">{{num + 1}}. </span>-->
              <span class="titleInfo" style="cursor: pointer"
                    @click="model.taskSource === 6 ? clickToPublishTaskOrder(model, '详情') : clickToOrder(model.uuid, model.orderType)">{{model.serialCode}}</span>
            </span>
            <i class="titleInfo iconfont"
               :class="[model.isConcern === 1 ? 'icon-star-full attended' : 'icon-star-empty attended']"
               :style="{cursor: 'pointer', fontSize: '20px'}"
               @click="handleConcern(model.uuid, model.orderType, model.isConcern, model.concernUuid)"
               :title="model.isConcern === 1 ? '取消关注' : '关注'">

            </i>
          </s-row>
          <s-row class="info"><span :title="model.createTime">创建时间：{{model.createTime}}</span></s-row>
          <s-row class="info"><span :title="model.createUserName">工单状态：{{getStatus(model)}}</span></s-row>
          <s-row class="deil">
            <span class="status green" :title="model.briefDesc" :style="'opacity: 0.65; display: flex; justify-content:flex-start; line-height:' + spanHeight + 'px;'" >
              {<span class="status green" :style="'display: inline-block; width: auto; max-width: calc(100% - 22px); overflow: hidden; text-overflow: ellipsis;word-break: keep-all;white-space: nowrap;' + 'line-height:' + spanHeight + 'px;'">{{model.briefDesc || model.titile}}</span>}
            </span>
            <span class="summary" :style="'max-width: calc(100% - 22px); overflow: hidden; text-overflow: ellipsis;word-break: keep-all;white-space: nowrap;'"
                  :title="model.detailDesc">{{model.detailDesc}}</span>
          </s-row>
        </s-col>
        <s-col span="6" class="process-border-left">
          <div class="btns" style="text-align: center;bottom:8px"> <!--事件，任务按钮-->
            <div style="margin-top:20px" v-if="model.orderType === 0 || model.orderType === 1 || model.orderType === 3 || model.orderType === 6">
              <s-button class="btnCol" icon="receive" title="接单" @click="model.taskSource === 6 ? clickToPublishTaskOrder(model, '接单') : GetWorkOrder(model.uuid, model.orderType, model)"
                        :disabled="getworkroleDisabled">
              </s-button>
            </div>
            <div :max="99" style="margin-top:20px" title="指派" v-if="model.orderType=== 1">
              <s-button icon="delegate" class="btnCol" :disabled="roleDisabled"
                        @click="propblemDelegateWorkOrder(model.uuid, model.orderType, undefined, model.companyUuid)">
              </s-button>
            </div>
            <div :max="99" style="margin-top:20px" v-if="model.orderType=== 0 || model.orderType === 3">
              <s-button icon="delegate" class="btnCol" title="指派" :disabled="roleDisabled"
                        @click="model.taskSource === 6 ? DelegatePublishWorkOrder(model) : DelegateWorkOrder(model.uuid, model.orderType, model.companyUuid)">
              </s-button>
            </div>
            <div :max="99" style="margin-top:20px" v-if="model.orderType=== 6">
              <s-button icon="delegate" class="btnCol" title="指派" :disabled="roleDisabled"
                        @click="requestServDelegateWorkOrder(model.uuid, model.companyUuid)">
              </s-button>
            </div>
            <div :max="99" style="margin-top:20px" v-if="model.orderType === 2 || model.orderType === 5 || model.orderType === 4">
              <s-button icon="delegate" class="btnCol" title="处理" @click="GetWorkOrder(model.uuid, model.orderType)"
                        :disabled="roleDisabled"></s-button>
            </div>
          </div>
        </s-col>
      </s-row>
      <!-- <div class="btns" v-else-if="model.orderType=== 1"> &lt;!&ndash;问题按钮&ndash;&gt;
        &lt;!&ndash; <s-badge :max="99" class="badgeCol">
           <s-button icon="receive" class="btnCol" @click="ProblemGetWorkOrder(model.orderId, model.orderType, model.taskId, model.procId, model.workflowType)">接单</s-button>
         </s-badge>&ndash;&gt;
         <s-badge :max="99" class="badgeCol">
           <s-button icon="delegate" class="btnCol" @click="propblemDelegateWorkOrder(model.taskId, model.orderType, model.orderId)">指派</s-button>
         </s-badge>
       </div>
       <div class="btns" v-else> &lt;!&ndash;变更按钮&ndash;&gt;
         <s-badge :max="99" class="badgeCol">
           <s-button icon="delegate" class="btnCol">处理</s-button>
         </s-badge>
       </div>-->
    </div>
  </s-col>
</template>

<script>
   import $axios from 'sunflower-ajax'

  export default {
    data () {
      return {
      }
    },
    props: ['num', 'model', 'spanHeight', 'rolePro', 'IsUserGroups'],
    computed: {
      getworkroleDisabled() {
        if (((this.model.orderType === 0 && this.rolePro.incident < 1 && this.model.incidentStatus === 3) || (this.model.orderType === 0 && this.model.incidentStatus === 3) || ((this.model.orderType === 0 && this.rolePro.incident === null))) ||
          // currentAuth === 1 && state < 1 || currentAuth === 2 && state < 3
          (this.model.orderType === 1 && !(this.rolePro.problemArr.includes(3) && this.model.problemStatus < 1 || this.rolePro.problemArr.includes(2) && this.model.problemStatus === 2)) ||
          ((this.model.orderType === 3 && this.model.taskStatus === 4) || (this.model.orderType === 3 && this.model.taskStatus === 3)) ||
          (this.model.orderType === 6 && ((this.model.status === 4 && this.model.isOtherOrder === 1) || !(((this.IsUserGroups && this.rolePro.serviceArr.includes(2)) || (this.rolePro.serviceArr.includes(1) && this.rolePro.serviceArr.includes(4))) && [0, 1, 3].includes(this.model.status) || (this.rolePro.serviceArr.includes(1) && !this.rolePro.serviceArr.includes(4)) && [0, 1].includes(this.model.status) || (!this.rolePro.serviceArr.includes(1) && this.rolePro.serviceArr.includes(4)) && this.model.status === 3)))
        ) {
          return true;
        }
        return false;
      },
      roleDisabled() {
        // 只有高于处理人级别的才可以操作
        if ((this.model.serialCode.slice(0, 2) === 'SJ' && this.rolePro.incident < 1) ||
          (this.model.serialCode.slice(0, 2) === 'WT' && (this.rolePro.problem === 3 && [4, 5].indexOf(this.model.problemStatus) !== -1 || this.rolePro.problem === 2 && [4].indexOf(this.model.problemStatus) !== -1)) ||
          (this.model.serialCode.slice(0, 2) === 'BG' && this.rolePro.change <= 1) ||
          (this.model.serialCode.slice(0, 2) === 'RW' && [4].indexOf(this.model.taskStatus) !== -1) ||
          (this.model.serialCode.slice(0, 2) === 'RE' && ((this.model.status === 4 && this.model.isOtherOrder === 1) || !((this.rolePro.service === 4 || this.rolePro.service === 2) && (this.model.status === 3 || this.model.status === 4))))
          ) {
          return true;
        }
        return false;
      }
    },
    mounted() {
    },
    methods: {
      getStatus(model) {
        let data = []
        switch (model.orderType) {
          case 0: // 事件
            data = this.$store.state.processCenter.status[0]
            return data[model.incidentStatus]
          case 1: // 问题
            data = this.$store.state.processCenter.status[1]
            return data[model.problemStatus]
          case 2: // 变更
            data = this.$store.state.processCenter.status[2]
            return data[model.changeStatus - 1]
          case 3: // 任务
            data = this.$store.state.processCenter.status[3]
            return data[model.taskStatus - 1]
          case 4: // 知识
            data = this.$store.state.processCenter.status[4]
            return data[model.knowledgeStatus - 1]
          case 5: // 发布
            data = this.$store.state.processCenter.status[5]
            return data[model.publishStatus]
          case 6: // 服务请求
            data = this.$store.state.processCenter.status[6]
            return data[model.status]
        }
      },
      getOrderType(num) {
        switch (num) {
          case 0:
            return '事件'
          case 1:
            return '问题'
          case 2:
            return '变更'
          case 3:
            return '任务'
          case 4:
            return '知识'
          case 5:
            return '发布'
          case 6:
            return '服务请求'
        }
      },
      GetWorkOrder(uuid, orderType, model) {
        this.$emit('GetWorkOrder', uuid, orderType, model)
      },
      clickToOrder(uuid, orderType) {
        this.$emit('goOrder', uuid, orderType)
      },
      clickToPublishTaskOrder(model, type) {
        if (type === '详情') {
          this.$emit('goPublishTask', model)
        } else if (type === '接单') {
          $axios.get(`/itilChangeOrder/changeTaskTaking/${model.uuid}`).then((res) => {
            if (res.data.state === true) {
              this.$emit('goPublishTask', model)
            } else {
              this.$message({
                message: res.data.errormsg,
                type: 'error'
              })
            }
          })
        }
      },
      propblemDelegateWorkOrder (taskId, orderType, orderId, companyUuid) {
        this.$emit('propblemDelegateWorkOrder', taskId, orderType, orderId, companyUuid)
      },
      requestServDelegateWorkOrder (uuid, companyUuid) {
        this.$emit('requestServDelegateWorkOrder', uuid, companyUuid)
      },
      DelegateWorkOrder (uuid, orderType, companyUuid) {
        this.$emit('DelegateWorkOrder', uuid, orderType, companyUuid)
      },
      DelegatePublishWorkOrder(model) {
        this.$emit('DelegatePublishWorkOrder', model);
      },
      dealWorkOrder(uuid, orderType) {
        this.$emit('dealWorkOrder', uuid, orderType)
      },
      handleConcern (uuid, orderType, isConcern, concernUuid) {
        this.$emit('handleConcern', uuid, orderType, isConcern, concernUuid)
      }
    }
  }
</script>
<style scoped>
.DealWorkBox{
  border-radius: 2px;
}
</style>
