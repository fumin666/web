<template>
  <div style="margin-right: 10px;margin-top: 10px;width: calc(33.3% - 12px);overflow: hidden;" class="DealWorkBox">
    <div class="dealWorkContainer">
      <s-row class="title" >
        <s-col span="18" >
          <s-row>
            <span
              :class="[model.orderType === 2 ? 'publishOrderColor' : model.orderType === 1 ? 'problemOrderColor' : '']"
              class="type " :title="model.safeType"><span style="width:64px;display:block" class="ellipsis" v-html="model.safeType"></span></span>
            <span class="titleRadiusBg">
              <!--<span class="titleInfo">{{num + 1}}. </span>-->
              <span class="titleInfo" style="cursor: pointer" v-if="flowType ===1 || flowType ===2"
                    @click="routerJump(model)">{{model.safeId}}</span>
              <span class="titleInfo" style="cursor: pointer" v-if="flowType ===3"
                    @click="receipt(2)">{{model.safeId}}</span>
            </span>
            <i class="titleInfo iconfont"
               :class="[model.isConcern === 1 ? 'icon-star-full attended' : 'icon-star-empty attended']"
               :style="{cursor: 'pointer', fontSize: '20px'}"
               @click="handleConcern()"
               :title="model.isConcern === 1 ? '取消关注' : '关注'">

            </i>
          </s-row>
          <s-row class="info" style='margin-bottom: 5px;margin-top:10px'><span :title="model.createTime">创建时间：{{model.createTime}}</span></s-row>
          <s-row class="info" style='margin-bottom: 10px;'><span :title="model.orderStatusName">工单状态：{{model.orderStatusName}}</span></s-row>
          <s-row class="deil">
            <span class="summary twoLine" :style="'max-width: calc(100% - 22px);font-size:14px'"
                  :title="model.title">标题：{{model.title}}</span>
          </s-row>
        </s-col>
        <s-col span="6" style="height:140px" class="dispose process-border-left">
          <div class="btns" style="text-align: center;font-size:18px;bottom:8px"> <!--事件，任务按钮-->
            <div :max="99" :title="model.orderType === 1 && model.orderStatus === 1 ? '工单未启动,请在启动时间后操作' :'处理'" v-if='flowType === 1' style="margin-top:15px">
              <s-button class="dbbtnCol" icon="order-track" :disabled='model.orderType === 1 && model.orderStatus === 1' @click="routerJump(model)">
              </s-button>
            </div>
            <div :title="model.orderType === 1 && model.orderStatus === 1 ? '工单未启动,请在启动时间后操作' :'委派'" :max="99" v-if='flowType === 1' style="margin-top:15px">
              <s-button icon="assigned" class="dbbtnCol" :disabled='model.orderType === 1 && model.orderStatus === 1' @click="designate()">
              </s-button>
            </div>
            <div title="通过" :max="99" v-if='flowType === 2' style="margin-top:15px">
              <s-button icon="finish" class="dbbtnCol" @click="appove(1)">
              </s-button>
            </div>
            <div title="拒绝" :max="99" v-if='flowType === 2' style="margin-top:15px">
              <s-button icon="cancel" class="dbbtnCol" @click="appove(0)">
              </s-button>
            </div>
            <div :title="model.orderStatus === 1 ? '工单未启动,请在启动时间后操作' :'参加'" :max="99" v-if='flowType === 3 && model.isMeeting === 1' style="margin-top:15px">
              <s-button icon="finish" :disabled='model.orderStatus === 1' class="dbbtnCol" @click="receipt(2)">
              </s-button>
            </div>
            <div :title="model.orderStatus === 1 ? '工单未启动,请在启动时间后操作' :'拒绝'" :max="99" v-if='flowType === 3 && model.isMeeting === 1' style="margin-top:15px;">
              <s-button icon="cancel" :disabled='model.orderStatus === 1' class="dbbtnCol" @click="receipt(3)">
              </s-button>
            </div>
            <div :title="model.orderStatus === 1 ? '工单未启动,请在启动时间后操作' :'回执'" :max="99" v-if='flowType === 3 && model.isMeeting === 0' style="margin-top:55px;">
              <s-button icon="email" :disabled='model.orderStatus === 1' class="dbbtnCol" @click="receipt(1)">
              </s-button>
            </div>
          </div>
        </s-col>
      </s-row>
    </div>
    <appoint-task v-model="appointDialog" v-if="appointDialog" :taskName='taskName' :orderUuid='orderUuid' @receive='receive'></appoint-task>
    <Appoint-task-dialog v-model="AppointTaskDialog" :taskName='taskName' v-if="AppointTaskDialog" :orderUuid='orderUuid' @receive='receive'></Appoint-task-dialog>
    <Information-Dialog v-model="informationDialog" :receipType='receipType' v-if="informationDialog" :rowData='rowData' @receive='receive'></Information-Dialog>
    <s-dialog
      v-model="appoveDialog"
      v-if="appoveDialog"
      width="600px"
      append-to-body
      :before-close="deadlineClose"
      class="createProcess"
      title="审批工单">
      <s-form :model="appoveForm" :rules="appoveRule" ref="appoveForm" label-width='125px'>
        <s-form-item label="审批意见：" prop='approvalResult'>
          <s-radio class="radio" v-model="appoveForm.approvalResult" :value='1' :label="1">通过</s-radio>
          <s-radio class="radio" v-model="appoveForm.approvalResult" :value='0' :label="0">拒绝</s-radio>
        </s-form-item>
        <s-form-item label="工作信息：" prop='workInfo'>
          <s-input type='textarea' v-model="appoveForm.workInfo"></s-input>
        </s-form-item>
        <s-form-item label="下一节点处理人" prop='assignUser'>
          <s-select v-model="appoveForm.assignUser">
            <s-option v-for='val in userData' :key='val.uuid' :label='val.userRealName' :value='val.uuid'>{{val.userRealName}}</s-option>
          </s-select>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="appoveSave">保存</s-button>
        <s-button type="cancel" @click="deadlineClose">关闭</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import AppointTask from '@/pages/Safety_BulletinTask/components/dialog/AppointDialog';
  import AppointTaskDialog from '@/pages/Safety_BulletinTask/components/dialog/AppointTaskDialog';
  import InformationDialog from '@/pages/Safety_BulletinTask/components/dialog/InformationDialog';
  export default {
    data () {
      return {
        appointDialog: false,
        AppointTaskDialog: false,
        appoveDialog: false,
        orderUuid: '',
        taskName: '',
        appoveForm: {
          approvalResult: 1,
          workInfo: '',
          assignUser: ''
        },
        appoveRule: {
          workInfo: [{required: true, message: '不能为空', trigger: 'blur'}, {max: 120, message: '最大长度为120', trigger: 'blur'}],
          assignUser: [{required: true, message: '不能为空', trigger: 'blur'}]
        },
        informationDialog: false,
        rowData: [],
        receipType: 2
      }
    },
    props: ['num', 'model', 'spanHeight', 'rolePro', 'IsUserGroups', 'flowType', 'userData'],
    components: {
      AppointTask,
      InformationDialog,
      AppointTaskDialog
    },
    mounted() {
      this.orderUuid = this.model.uuid
      this.taskName = this.model.safeId
    },
    methods: {
      getStatus(model) {
        switch (model) {
          case 1:
            return '新建'
          case 2:
            return '进行中'
          case 3:
            return '已完成'
        }
      },
      designate() {
        if (this.model.orderType === 1) {
          this.appointDialog = true
        } else {
          this.AppointTaskDialog = true
        }
      },
      appove(val) {
        this.appoveDialog = true
        this.appoveForm.approvalResult = val
      },
      receipt(v) {
        this.receipType = v
        this.informationDialog = true
        this.rowData = this.model
      },
      handleConcern() {
        let type
        if (this.model.isConcern === 1) {
          type = 0
        } else {
          type = 1
        }
        let parms = {
          orderUuid: this.model.uuid,
          orderType: this.model.orderType,
          type: type
        }
        let str = this.model.isConcern === 0 ? `关注|等保工作(${this.model.safeId})` : `取消关注|等保工作(${this.model.safeId})`
        $axios.post(`/safetyPlatform/safeOrder/concernOrderOrTask/`, parms, {
          logTemplate: str
        }).then(res => {
          if (res.data.state) {
            this.appoveDialog = false
            this.$emit('receive', true)
            if (this.model.isConcern === 0) {
              this.$message({message: '关注成功!', type: 'success'});
            } else {
              this.$message({message: '取消关注成功!', type: 'success'});
            }
          } else {
            this.$message({message: res.data.errormsg, type: 'error'});
          }
        })
      },
      receive() {
        this.$emit('receive', true)
      },
      appoveSave() {
        console.log(this.appoveForm)
        this.$refs['appoveForm'].validate((valid) => {
          if (valid) {
            let parms = Object.assign({}, this.appoveForm)
            parms.orderUuid = this.model.uuid
            $axios.post('/safetyPlatform/safeOrder/approvalOrder', parms, {
              logTemplate: `处理|我的待办>等保工作(${this.model.safeId})`
            }).then(res => {
              if (res.data.state) {
                this.$message({message: '审批成功!', type: 'success'});
                this.$emit('receive', true)
                this.deadlineClose()
              } else {
                this.$message({message: res.data.errormsg, type: 'error'});
              }
            })
          }
        })
      },
      deadlineClose() {
        this.appoveForm = {
          approvalResult: 1,
          workInfo: '',
          assignUser: ''
        }
        this.appoveDialog = false
      },
      routerJump(model) {
        if (model.orderType === 1) {
          this.$router.push(`/GradeProtect/safetyBulletin_details/${model.uuid}`)
        } else {
          this.$router.push(`/GradeProtect/safetyBulletin_dispose/${model.uuid}`);
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
      }
    }
  }
</script>
<style scoped>
  .DealWorkBox{
    border-radius: 2px;
  }
  .dispose{
    position: relative;
  }
  .dispose .btns{
    position: absolute;
    top:0;bottom:0;left:0;right:0;
    margin: auto
  }
  .icon-star-full {
    margin-right: 0;
  }
</style>
