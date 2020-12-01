<!--
 * @Author: songyf
 * @Date: 2019-10-16 10:19:33
 * @LastEditors: songyf
 * @Description: 运维中心
 -->
<template>
  <section class="content oper-box home-page-box">
    <s-row>
      <s-col span="19" class="main-left">
        <s-row>
          <!--运维资产-->
          <oper-equipment ref="operEquipment"></oper-equipment>
        </s-row>
        <s-row :gutter="10" class="oper-footer">
          <s-col span="8">
            <s-card class="box-card contentOpacity card-line card-height">
              <div slot="header" class="clearfix">
                <span class="card-title">
                  最新通知
                </span>
                <div class="card-enter more-info" @click="newEventDialogShow">更多</div>
              </div>
              <div v-nodata="newEvents.length === 0">
                <event-item v-for="item in newEvents" :key="item.id" :data="item" @chooseDialog="takeGo"></event-item>
              </div>
            </s-card>
          </s-col>
          <s-col span="8">
            <s-card class="box-card contentOpacity card-line card-height">
              <div slot="header" class="clearfix">
              <span class="card-title">
                <!--<i class="iconfont icon-pie-chart"></i>-->
                本周审核情况统计
              </span>
                <div class="card-enter more-info" @click="goto('oper_auditstatistic')">更多</div>
              </div>
              <div v-nodata="auditChart.data.length === 0" style="height: 160px">
                <s-chart :chart="auditChart" v-if="auditChart.data.length"></s-chart>
              </div>
            </s-card>
          </s-col>
          <s-col span="8">
            <s-card class="box-card contentOpacity card-line card-height">
              <div slot="header" class="clearfix">
              <span class="card-title">
                本周运维量统计
              </span>
                <div class="card-enter more-info" @click="goto('oper_statistic')">更多</div>
              </div>
              <div v-nodata="!Object.keys(operChart.data).length" style="height: 160px">
                <s-charts :chart="operChart" v-if="Object.keys(operChart.data).length"></s-charts>
              </div>
            </s-card>
          </s-col>
        </s-row>
      </s-col>
      <s-col span="5" class="main-right">
        <navs :modelName="'operationCenter'" @goto="goto" @btnClick="btnClick"  @buttonCount='buttonCount' style="padding-right: 20px;"></navs>
        <s-scrollbar :wrap-style="wrapstyle" class="clr right-scroll">
          <div class="new-apply-btn" v-noBtn="'operationCenter_operApply'" style="margin-bottom: 15px; padding: 0 ">
            <s-button icon="plus" @click="newAppDialog = true">添加运维申请</s-button>
          </div>
          <!-- 运维人员and团队主管 -->
          <s-card class="box-card card-line right-card sper-card sper-card-border" v-if='Directorflag'>
            <div slot="header" class="clearfix">
              <span class="card-title">
                特殊运维
              </span>
              <div class="card-enter more-info" @click="goto('oper_special')">更多</div>
            </div>
            <s-row type="flex">
              <s-col span="7" class="tc">
                <span class="oper-title" :style="{ fontSize: fontSize + 'px' }">我申请</span>
                <span  :style="{ fontSize: fontSize + 'px' }"> {{ApplyNum.mySubOrder}}</span>
              </s-col>
              <s-col span="9" class="tc">
                <span class="oper-title" :style="{ fontSize: fontSize + 'px' }">他人已审批</span>
                <span  :style="{ fontSize: fontSize + 'px' }"> {{ApplyNum.approvedOrder}}</span>
              </s-col>
              <s-col span="8" class="tc">
                <span class="oper-title" :style="{ fontSize: fontSize + 'px' }">待我审批</span>
                <span  :style="{ fontSize: fontSize + 'px' }"> {{BatchExeNum.myApproveOrder}}</span>
              </s-col>
            </s-row>
          </s-card>
          <s-card class="box-card contentOpacity card-line right-card sper-card" v-if='Directorflag'>
            <div slot="header" class="clearfix">
              <span class="card-title">
                批量执行
              </span>
              <div class="card-enter more-info" @click="goto('oper_batch')">更多</div>
            </div>
            <s-row type="flex">
              <s-col span="7" class="tc">
                <span class="oper-title" :style="{ fontSize: fontSize + 'px' }">我申请</span>
                <span  :style="{ fontSize: fontSize + 'px' }"> {{ApplyNum.mySubTask}}</span>
              </s-col>
              <s-col span="9" class="tc">
                <span class="oper-title" :style="{ fontSize: fontSize + 'px' }">他人已审批</span>
                <span  :style="{ fontSize: fontSize + 'px' }"> {{ApplyNum.approvedTask}}</span>
              </s-col>
              <s-col span="8" class="tc">
                <span class="oper-title" :style="{ fontSize: fontSize + 'px' }">待我审批</span>
                <span  :style="{ fontSize: fontSize + 'px' }"> {{BatchExeNum.myApproveTask}}</span>
              </s-col>
            </s-row>
          </s-card>
          <!-- 运维人员 -->
          <s-card class="box-card contentOpacity card-line right-card sper-card sper-card-border" v-if='operflag' >
            <div slot="header" class="clearfix">
              <span class="card-title">
                特殊运维
              </span>
              <div class="card-enter more-info" @click="goto('oper_special')">更多</div>
            </div>
            <s-row type="flex" :gutter="6" >
              <s-col span="12" class="tc">
                <span class="oper-title" :style="{ fontSize: fontSize + 'px' }">我申请</span>
                <span  :style="{ fontSize: fontSize + 'px' }"> {{ApplyNum.mySubOrder}}</span>
              </s-col>
              <s-col span="12" class="tc">
                <span class="oper-title" :style="{ fontSize: fontSize + 'px' }">他人已审批</span>
                <span  :style="{ fontSize: fontSize + 'px' }"> {{ApplyNum.approvedOrder}}</span>
              </s-col>
            </s-row>
          </s-card>
          <s-card class="box-card contentOpacity card-line right-card sper-card" v-if='operflag'>
            <div slot="header" class="clearfix">
              <span class="card-title">
                批量执行
              </span>
              <div class="card-enter more-info" @click="goto('oper_batch')">更多</div>
            </div>
            <s-row type="flex" :gutter="6" >
              <s-col span="12" class="tc">
                <span class="oper-title" :style="{ fontSize: fontSize + 'px' }">我申请</span>
                <span  :style="{ fontSize: fontSize + 'px' }"> {{ApplyNum.mySubTask}}</span>
              </s-col>
              <s-col span="12" class="tc">
                <span class="oper-title" :style="{ fontSize: fontSize + 'px' }">他人已审批</span>
                <span  :style="{ fontSize: fontSize + 'px' }"> {{ApplyNum.approvedTask}}</span>
              </s-col>
            </s-row>
          </s-card>
          <!-- 团队主管 -->
          <s-card class="box-card contentOpacity card-line right-card sper-card sper-card-border" v-if='teamflag' >
            <div slot="header" class="clearfix">
              <span class="card-title">
                特殊运维
              </span>
              <div class="card-enter more-info" @click="goto('oper_special')">更多</div>
            </div>
            <s-row type="flex" :gutter="6" >
              <s-col span="24" class="tc">
                <span class="oper-title" :style="{ fontSize: fontSize + 'px' }">待我审批</span>
                <span  :style="{ fontSize: fontSize + 'px' }"> {{BatchExeNum.myApproveOrder}}</span>
              </s-col>
            </s-row>
          </s-card>
          <s-card class="box-card contentOpacity card-line right-card sper-card" v-if='teamflag'>
            <div slot="header" class="clearfix">
              <span class="card-title">
                批量执行
              </span>
              <div class="card-enter more-info" @click="goto('oper_batch')">更多</div>
            </div>
            <s-row type="flex" :gutter="6" >
              <s-col span="24" class="tc">
                <span class="oper-title" :style="{ fontSize: fontSize + 'px' }">待我审批</span>
                <span  :style="{ fontSize: fontSize + 'px' }"> {{BatchExeNum.myApproveTask}}</span>
              </s-col>
            </s-row>
          </s-card>
          <s-card class="box-card contentOpacity card-line right-card" style="margin-top: 20px">
            <div slot="header" class="clearfix">
              <span class="card-title">
                <!--<i class="iconfont icon-log"></i>-->
                运维日志
              </span>
              <div class="card-enter more-info" @click="goto('oper_log')">更多</div>
            </div>
            <div v-nodata="opsLog.length === 0" style="height: 250px;" v-if="opsLog.length === 0"></div>
            <section v-if="opsLog.length !== 0" >
              <div class="operateLogItem" v-for="item in opsLog" :key="item.id">
                <s-row class="log-item">
                  <s-col span="4" class="oper-img tc">
                    <img :src="`static/images/topologyicon/default/${item.iconName}.svg`" style="width: 28px;height: 28px" alt="">
                  </s-col>
                  <s-col span="13" class="oper-details">
                    <div style="height: 23px"><span class="ip">{{item.deviceIp}}</span></div>
                    <div>
                      <s-row>
                        <s-col span="12" class="ellipsis info" style="min-width: 56px;">
                          <i class="iconfont icon-user"></i>
                          <span class="client" :title="item.accountName">{{item.accountName}}</span>
                        </s-col>
                        <s-col span="12" class="ellipsis info" style="min-width: 56px;">
                          <i class="iconfont icon-server"></i>
                          <span :title="item.protocolName">{{item.protocolName}}</span>
                        </s-col></s-row>
                    </div>
                  </s-col>
                  <s-col span="7" class="text-right">
                    <s-tag type="tpwarning">{{item.sessionAuditResultName}}</s-tag>
                  </s-col>
                </s-row>
              </div>
            </section>
          </s-card>
        </s-scrollbar>
      </s-col>
    </s-row>
    <!--更多事件-->
    <s-dialog
      v-model="newEventDialog"
      v-if="newEventDialog"
      width="550px"
      title="最新通知">
      <event-dialog @chooseDialog="takeGo"></event-dialog>
    </s-dialog><!--下载客户端-->
    <s-dialog
      v-model="downloadDialog"
      v-if="downloadDialog"
      width="900px"
      title="工具下载">
      <download-dialog></download-dialog>
    </s-dialog>

    <!--新建申请-->
    <s-dialog
      v-model="newAppDialog"
      v-if="newAppDialog"
      width="400px"
      title="新建申请">
      <s-radio-group v-model="radio">
        <s-radio :label="1">特殊运维</s-radio>
        <s-radio :label="2">批量执行</s-radio>
      </s-radio-group>
      <template slot="footer" class="dialog-footer">
        <s-button @click="nextGoApply">下一步</s-button>
        <s-button type="cancel" @click="newAppDialog = false">关闭</s-button>
      </template>
    </s-dialog>
    <!--特殊运维-->
    <s-dialog
      v-model="chooseSpecialDialog"
      v-if="chooseSpecialDialog"
      width="900px"
      title="特殊运维">
      <Add-Apply ref="AddApply" @saveApp="ApplySave"></Add-Apply>
      <template slot="footer" class="dialog-footer">
        <s-button @click="uploadFile">保存</s-button>
        <s-button type="cancel" @click="chooseSpecialDialog = false">关闭</s-button>
      </template>
    </s-dialog>
    <!--批量-->
    <s-dialog
      v-model="chooseBatchDialog"
      v-if="chooseBatchDialog"
      width="900px"
      title="批量执行">
      <Add-Batch :uuid="uploadUuid" ref="addBatchDialog"></Add-Batch>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addOk">下一步</s-button>
        <s-button type="cancel" @click="chooseBatchDialog = false">关闭</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="relatedEquipmentDialog"
      v-if="relatedEquipmentDialog"
      width="900px"
      title="设置批量任务关联资产">
      <relate-dialog :taskUuid="uploadUuid" ref="relatedEquipment"></relate-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveRelated">保存</s-button>
        <s-button type="cancel" @click="relatedEquipmentDialog = false">取消</s-button>
      </template>
    </s-dialog>

    <!--审批操作-->
    <s-dialog
      v-model="approveDialog"
      v-if="approveDialog"
      width="50%"
      title="审批">
      <view-dialog :uuid="approveUuid" :taskUuid="viewUuid" ref="approveDia"></view-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button v-if="doing" @click="approveOk">确定</s-button>
        <s-button v-if="!doing" disabled style="width:100px">
          <div style="float: left">正在审批</div>
          <s-spin color="#30a6fd" type="clip" size="8px"></s-spin>
        </s-button>
        <s-button type="cancel" @click="approveDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--运维-->
    <s-dialog
      v-model="assistDialog"
      v-if="assistDialog"
      width="600px"
      title="接受邀请协助">
      <ops-assist :uuid="uuids" :sessionUuid="sessionUuids" ref="getOps"></ops-assist>
      <template slot="footer" class="dialog-footer">
        <s-button @click="reciveOps">确定</s-button>
        <s-button type="cancel" @click="assistDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--会同弹窗-->
    <s-dialog
      v-model="huiDialog"
      v-if="huiDialog"
      width="600px"
      title="密码会同">
      <s-form ref="jointlyWith" :model="form" label-width="120px">
        <s-form-item label="密码" prop="devicePasswd">
          <s-input type="password" v-model="form.devicePasswd"></s-input>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveHui">确定</s-button>
        <s-button type="cancel" @click="huiDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--聊天室-->
    <scan-socket v-if="startSocket" :name-space="nameSpace" ref="socket"
                 @message-callback="messageCallback">
    </scan-socket>
    <!-- 运维人员-特殊运维 -->
    <Apply-Me v-model="teamApply" v-if="teamApply"></Apply-Me>
    <Others v-model="teamother" v-if="teamother"></Others>
    <!-- 运维人员-批量执行 -->
    <batch-Me v-model="batch" v-if="batch"></batch-Me>
    <batch-Other v-model="batchWe" v-if="batchWe"></batch-Other>
    <!-- 团队主管 -->
    <approved v-model="teamPlease" v-if="teamPlease"></approved>
    <approvedother v-model="batchOther" v-if="batchOther"></approvedother>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import approved from '../../pages/Recommended_HomePage/Dialog/approved ';
  import approvedother from '../../pages/Recommended_HomePage/Dialog/approvedother';
  import ApplyMe from '../../pages/Recommended_HomePage/Dialog/ApplyMe';
  import Others from '../../pages/Recommended_HomePage/Dialog/Others';
  import batchMe from '../../pages/Recommended_HomePage/Dialog/batchMe';
  import batchOther from '../../pages/Recommended_HomePage/Dialog/batchOther';
  import navs from '@/components/navButton/NavButton.vue'
  import eventItem from './EventItem'
  import eventDialog from './NewEventTimeLine'
  import downloadDialog from '@/pages/Operation_ClientDownLoad/Download'
  import {Download} from 'sunflower-common-utils'
  import {isEmpty, merge} from 'lodash';
  import AddApply from '@/pages/Operation_SpecialOperation/ApplySpecial'
  import AddBatch from '@/pages/Operation_BatchExecution/AddBatchExe'
  import relateDialog from '@/pages/Operation_BatchExecution/RelateEquipment'
  import scanSocket from '@/components/socketClient/SocketClient'
  import viewDialog from '@/pages/Operation_BatchExecution/ViewList'
  import opsAssist from '@/pages/Operation_AssistInvite/OpsAssist'
  import roleCheckMixin from '@/common/mixins/roleCheckMixin'
  import operEquipment from '@/home/OperationCenter/OperationEquipment'
  import pieChartOption from '@/components/chart/pieChartOption.js'

  export default {
    mixins: [roleCheckMixin],
    data() {
      return {
        btncount: 6,
        maxheight: 170,
        mainCardHeight: 500,
        boxHeaderHeight: 30,
        isEmptyEquipment: false,
        opsAccessNewDialog: false, // 运维访问(new)
        teamApply: false,
        teamother: false,
        batch: false,
        batchOther: false,
        teamPlease: false,
        batchWe: false,
        operflag: false,
        teamflag: false,
        Directorflag: false,
        radio: 1,
        auditChart: {
          name: 'auditChart',
          type: 'pieChart',
          width: '100%',
          height: '160px',
          data: '',
          option: {
            legend: {
              y: '80%',
              x: 'center',
              icon: 'circle',
              orient: 'horizontal',
              padding: [5, 20],
              itemGap: 10,
              itemWidth: 10,             // 图例图形宽度
              itemHeight: 10
            },
            series: [{
              radius: '50%',
              center: ['50%', '40%']    // 默认全局居中
            }]
          }
        },
        operChart: {
          el: 'operChart',
          type: 'lineBarChart',
          width: '100%',
          height: '160px',
          data: {},
          opt: {
            yAxis: [
              {
                axisLabel: {show: false},
                axisLine: {show: false}, // 轴线不显示
                splitLine: {
                  lineStyle: {
                    type: 'dashed'
                  }
                }
              }
            ],
            grid: {
              left: 20,
              right: 20,
              top: 20
            },
            tooltip: {
              show: true,
              formatter: function (params) {
                let str = params[0].name;
                for (let i = 0; i < params.length; i++) {
                  str += '<br/>' + params[i].marker + params[i].seriesName + ': ' + params[i].value
                }
                str += '分钟';
                return str;
              }
            }
          }
        },
        downloadDialog: false,
        newAppDialog: false,
        chooseSpecialDialog: false,
        newEventDialog: false,
        chooseBatchDialog: false,
        relatedEquipmentDialog: false,
        doing: true,
        equipmentList: [],
        BatchExeNum: {},
        ApplyNum: {},
        uploadUuid: '',
        showModel: '',
        rowData: [],
        usershow: '',
        nameSpace: '',
        startSocket: false,
        opsLog: [],
        newEvents: [],
        approveDialog: false,
        assistDialog: false,
        huiDialog: false,
        viewUuid: '',
        viewUuidName: '',
        approveUuid: '',
        uuids: '',
        sessionUuids: '',
        optDb: '',
        accountName: '',
        form: {
          devicePasswd: '',
          protocolName: '',
          uuid: ''
        },
        iconSize: 16,
        fontSize: 14
      }
    },
    components: {
      navs,
      eventItem,
      downloadDialog,
      AddApply,
      AddBatch,
      relateDialog,
      scanSocket,
      viewDialog,
      opsAssist,
      eventDialog,
      approved,
      approvedother,
      ApplyMe,
      Others,
      batchMe,
      batchOther,
      operEquipment
    },
    computed: {
      wrapstyle() {
        return 'max-height:' + this.maxheight + 'px;';
      }
    },
    created() {
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
      this.getSwitch()
      let user = this.$store.getters.userName
      $axios.post(`/iamUserInfo/getUserInfoDetail`, {name: user}).then((res) => {
        this.startSocket = true
        this.nameSpace = `suninfo_${res.data.uuid}_operation`
      }).then(() => {
        $axios.get('/iamUserInfo/createPageConnection/' + this.nameSpace).then((data) => {
          // console.log(data)
        });
      })
      $axios.get('/operationCenter/getCheckStateByWeek').then((res) => {
        this.auditChart.data = res.data
      });
      $axios.get('/operationCenter/getUserOperationWorkloadByWeek').then((res) => {
        this.operChart.data = res.data
      });
      if (this.isOperation === true) {
        this.getSpecialoperApplyNum()
        this.operflag = true
      }
      if (this.isOMATeamLeader === true) {
        this.getBatchExeNum()
        this.teamflag = true
      }
      if (this.isOperation === true && this.isOMATeamLeader === true) {
        this.operflag = false
        this.teamflag = false
        this.getSpecialoperApplyNum()
        this.getBatchExeNum()
        this.Directorflag = true
      }
      this.getOpsLogList()
      this.getNewEventList()
    },
    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', this.computeAssetHeight);
      });
    },
    destroyed() {
      window.removeEventListener('resize', this.computeAssetHeight);
    },
    methods: {
      // 计算右侧按钮的高度
      buttonCount(count) {
        this.btncount = count;
        this.computeAssetHeight();
      },
      computeAssetHeight() {
        let navbuttonheight = Math.ceil(this.btncount / 2) * 40;
        // eslint-disable-next-line no-undef
        let sreenheight = $('#app').height();
        this.maxheight = sreenheight - navbuttonheight - 90;
      },
      getTheme(val) {
        var option = {
          series: [{
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorlist = ['#98DF79', '#FF6C65', '#BBC1D2']
                  return colorlist[params.dataIndex]
                }
              }
            }
          }]
        }
        if (val === 'dark') {
          this.auditChart.option = merge({}, this.auditChart.option, pieChartOption.dark, option)
        } else {
          this.auditChart.option = merge({}, this.auditChart.option, pieChartOption.light, option)
        }
        console.log(this.auditChart.option);
      },
      // 获取开关状态
      getSwitch() {
        $axios.get('/basicOperation/getAutoSetInfo').then((res) => {
          this.isOpen = res.data
        })
      },
      reciveOps() {
        const form = this.$refs['getOps'].form
        const formObj = this.$refs['getOps'].$refs['addForm']
        formObj.validate((valid) => {
          if (!valid) return;
          $axios.post(`invitHelp/isCanReciveInvite/${form.sessionUuid}`).then((res) => {
            if (res.data.state === false) {
              this.$message({message: res.data.errormsg, type: 'error'});
            } else {
              $axios.post('/invitHelp/startClient', form).then((res) => {
                if (res.status === 200) {
                  if (res.data.status === 'true') {
                    this.$message({message: res.data.msg, type: 'success'});
                    this.assistDialog = false;
                    if (res.data.url !== '' || res.data.url !== null || res.data.url !== undefined) {
                      window.location.href = res.data.url
                    }
                  } else {
                    this.$message({message: res.data.msg, type: 'error'});
                  }
                }
              })
            }
          })
        })
      },
      saveHui() {
        $axios.post('/pwdConnect/pwdCon', this.form).then((res) => {
          if (res.data.status === 'true') {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.huiDialog = false
          } else if (res.data.status === 'false') {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      approveOk() {
        let addForm = this.$refs['approveDia'].addForm;
        this.$refs['approveDia'].$refs['addForm'].validate(valid => {
          if (!valid) return;
          this.doing = false
          $axios.post('/operationBatchExcute/batchExcuteAudit', addForm, {
            data: [{name: this.viewUuidName}],
            logTemplate: '审批|审批列表>审批任务（#name#）'
          }).then((res) => {
            if (res.data.status === 'true') {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.approveDialog = false
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
            this.doing = true
          })
        })
      },
      takeGo(data) {
        let detail = JSON.parse(data.detailInfo)
        let message = JSON.parse(detail.message)
        switch (data.incidentType) {
          case 1:
            $axios.get(`/operationBatchExcute/getAddFormInfo/${message.scripttask.uuid}`).then((res) => {
              if (isEmpty(res.data)) {
                this.$message({
                  message: '此运维申请已被申请人取消'
                })
              } else if (res.data.hasOwnProperty('approved')) {
                this.$message({
                  message: '此运维申请已被审批'
                })
              } else {
                this.viewUuid = message.scripttask.uuid;
                this.viewUuidName = message.scripttask.taskName;
                this.approveUuid = res.data.ScriptAudit.uuid;
                this.approveDialog = true;
              }
            })
            break;
          case 2:
            $axios.get(`/pwdConnect/judgePwdConnect/${message.content.uuid}`).then(({data}) => {
              if (data.state) {
                this.huiDialog = true
                this.form.uuid = message.content.uuid
                this.form.protocolName = message.content.protocolName
              } else {
                this.$message({
                  message: data.errormsg,
                  type: 'error'
                });
              }
            })
            break;
          case 3:
            this.assistDialog = true
            this.uuids = message.content.vMainUuid
            this.sessionUuids = message.content.uuid
            break;
          case 4:
            let uuid = message.content.uuid
            $axios.get(`checkCmd/isCanDoCheck/${uuid}`).then(res => {
              if (res.data === false) {
                this.$message({
                  type: 'error',
                  message: '复核已结束'
                })
              } else {
                $axios.get(`/checkCmd/doReplayOrBlockCheck/replay/${uuid}`).then(res => {
                  if (res.status === 200) {
                    if (res.data.status === 'true') {
                      this.$message({
                        type: 'success',
                        message: res.data.msg
                      })
                      if (res.data.url !== '' || res.data.url !== null || res.data.url !== undefined) {
                        window.location.href = res.data.url
                      }
                    }
                    if (res.data.status === 'false') {
                      this.$message({
                        type: 'error',
                        message: res.data.msg
                      })
                    }
                  }
                });
              }
            })
            break;
        }
      },
      messageCallback(data) {
        const msg = JSON.parse(data.message)
        if (msg.operationIncidentType === 5) {
          this.opsLog.splice(0, 1)
          let dataList = JSON.parse(msg.message)
          this.opsLog.push(dataList.content)
        } else {
          this.newEvents.splice(0, 1)
          this.newEvents.push(msg)
        }
      },
      getOpsLogList() {
        $axios.get('/operationCenter/getNewOperationLogList').then(res => {
          this.opsLog = res.data
        })
      },
      getNewEventList() {
        $axios.get('/operationCenter/getTwoPushLog').then(res => {
          this.newEvents = res.data.splice(0, 1)
        })
      },
      uploadFile() {
        let files = this.$refs['AddApply'].fileList
        let formObj = this.$refs['AddApply'].$refs['addSpecialForm']
        let form = this.$refs['AddApply'].addForm
        if (files.length > 5) {
          this.$message({message: '最多上传五个附件', type: 'error'});
          return false
        }
        if (Date.parse(form.endTimeStr) - Date.parse(form.startTimeStr) < 0) {
          this.$message({
            message: '结束时间必须大于开始时间',
            type: 'error'
          });
          return false
        }
        if (form.relresourceList.length < 1) {
          this.$message({
            message: '您还没有选择资产',
            type: 'error'
          });
          return false
        }
        formObj.validate((valid) => {
          if (!valid) {
            return false;
          }
          if (files.length !== 0) {
            this.$refs['AddApply'].$refs['upload'].submit();
          } else {
            this.ApplySave()
          }
        })
      },
      ApplySave() {
        let applyData = this.$refs['AddApply']
        let form = applyData.addForm
        for (let v of applyData.selectionsCommand) {
          form.relcommandList.push(
            {
              type: v.commandtype,
              accountUuid: v.accountUuid,
              commandType: v.commandinfoType,
              commandUuid: v.comanduuid,
              maintainedDeviceUuid: v.maintainedDeviceUuid
            }
          )
        }
        $axios.post('/specialOperationApply/addSpecialoperApply', form, {
          data: [{title: form.specialoperName}],
          logTemplate: '添加|运维申请(#title#)'
        }).then((res) => {
          if (res.data.result === true) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.chooseSpecialDialog = false
            this.getSpecialoperApplyNum()
          }
        })
      },
      nextGoApply() {
        this.newAppDialog = false
        if (this.radio === 1) {
          $axios.get('/specialOperationApply/isCanAddSpecialoperApply').then(res => {
            if (res.data.hasOwnProperty('false')) {
              this.$message({
                type: 'error',
                message: res.data.false
              });
            }
            if (res.data.hasOwnProperty('true')) {
              this.chooseSpecialDialog = true
            }
          });
        } else if (this.radio === 2) {
          $axios.get('/operationBatchExcute/isCanAdd').then((res) => {
            if (res.data.status === 'false') {
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            } else {
              this.chooseBatchDialog = true
            }
          })
        }
      },
      addOk() {
        let self = this
        let addForm = this.$refs['addBatchDialog'].addForm;
        this.$refs['addBatchDialog'].$refs['addScriptForm'].validate(valid => {
          if (!valid) return;
          $axios.post('/operationBatchExcute/addBatchExcuteTask', addForm, {
            data: [{name: addForm.taskName}],
            logTemplate: '添加|申请列表>设置任务(#name#)'
          }).then((res) => {
            if (res.data.status === 'true') {
              self.uploadUuid = res.data.uuid
              self.relatedEquipmentDialog = true
            } else {
              self.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          }).then(function () {
            self.chooseBatchDialog = false
            self.getBatchExeNum()
          })
        })
      },
      saveRelated() {
        let addForm = this.$refs['relatedEquipment'].form;
        let selection = this.$refs['relatedEquipment'].selection
        for (let v of selection) {
          addForm.accountUuids.push(v.accountUuids)
          addForm.deviceUuids.push(v.itcompUuid)
          addForm.portUuids.push(v.protocolUuids)
        }
        $axios.post('/operationBatchExcute/saveDeviceList', addForm).then((res) => {
          if (res.data.status === 'true') {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.relatedEquipmentDialog = false
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      colorShow(status) {
        switch (status) {
          case '正常' :
            return 'greenWord';
          case '告警' :
            return 'yellowWord';
          case '异常' :
            return 'redWord';
        }
      },
      downLinux() {
        this.$confirm('确定下载linux客户端?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Download(`/operationSettings/downLoadClientTool/linux`, {
            logTemplate: '下载|工具下载>客户端下载(Linux)'
          })
        }).catch(() => {
        });
      },
      downWin() {
        this.$confirm('确定下载Windows客户端?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Download(`/operationSettings/downLoadClientTool/win`, {
            logTemplate: '下载|工具下载>客户端下载(Windows)'
          })
        }).catch(() => {
        });
      },
      downMac() {
        this.$confirm('确定下载Mac客户端?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Download(`/operationSettings/downLoadClientTool/mac`, {
            logTemplate: '下载|工具下载>客户端下载(Mac)'
          })
        }).catch(() => {
        });
      },
      goto(path) {
        this.$router.push('/OperationCenter/' + path)
      },
      btnClick(path) {
        if (path === 'toolDownload') {
          this.downloadDialog = true
        }
      },
      newEventDialogShow() {
        this.newEventDialog = true
      },
      getBatchExeNum() {
        $axios.get('/omaIndex/getMyApproveCount').then((res) => {
          this.BatchExeNum = res.data
        });
      },
      getSpecialoperApplyNum() {
        $axios.get('/omaIndex/getOrderAndTaskCount').then((res) => {
          this.ApplyNum = res.data
        });
      }
    },
    watch: {
      '$store.state.theme': function(val) {
        this.getTheme(val)
      },
      huiDialog(val) {
        if (val === false) {
          this.$refs['jointlyWith'].resetFields()
        }
      }
    }
  }
</script>

<style lang="stylus">
  .oper-box
    height 100%
    &>.s-row
      height 100%
      .main-left
        height 100%
        .oper-card
          height calc(100vh - 333px)
        .oper-search-input
          width 270px
          .s-input-inner
            font-weight 100
            border none
            border-radius 2px
            padding 0 15px
      .main-right
        height calc(100vh - 50px)
        padding 20px 0 20px 20px
        .s-card-header
          border-bottom none!important
        .orangeWord
          /*cursor pointer*/
        .oper-title
          /*cursor pointer*/
        .right-scroll
          .s-scrollbar-wrap
            padding-right 20px
</style>
