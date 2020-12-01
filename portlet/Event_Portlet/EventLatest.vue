<template>
  <s-card-diy
    title="最新事件"
    :more-click="moreClick"
    >
    <s-row class="event-box home-page-box content">
      <s-col span="24" class="main-left">
        <s-card class="main-card-content box-card card-line event-card" id="mainCardContent"
                style="height: calc(100vh - 120px);">
            <div class="event-check-group" style="margin-right: 40px;float:right">
            <s-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
            </s-checkbox>
            <s-checkbox-group v-model="checkedLevel" @change="handleCheckedLevelChange">
              <s-checkbox label="严重"></s-checkbox>
              <s-checkbox label="主要"></s-checkbox>
              <s-checkbox label="次要"></s-checkbox>
              <s-checkbox label="警告"></s-checkbox>
              <s-checkbox label="提示"></s-checkbox>
              <s-checkbox label="正常"></s-checkbox>
              <s-checkbox label="未知"></s-checkbox>
            </s-checkbox-group>
            <!--<span>恢复状态：</span>
            <s-checkbox-group v-model="checkedStatus" @change="handleCheckedStatusChange">
              <s-checkbox label="未恢复"></s-checkbox>
              <s-checkbox label="已恢复"></s-checkbox>
            </s-checkbox-group>-->
          </div>
          <s-scrollbar wrap-class="eventCenterScrollheightLeft" style="width: 100%" v-if="top10List.length">
            <s-time-line type="twoway" v-if="top10List.length">
              <template v-for="(item, index) in top10List">
                <s-time-line-item :style="{height: ((index % 2 == 0) ? eventItemHeight : oddItemHeight) + 'px'}">
                  <event-item :item="item" @viewEvent="_viewEvent(item)" @handelClick="_handelClick(item)"></event-item>
                </s-time-line-item>
              </template>
            </s-time-line>
          </s-scrollbar>
          <div v-nodata="true" v-else style="height: calc(100vh - 200px);"></div>
        </s-card>
      </s-col>
    </s-row>

    <!--监控事件-->
    <s-dialog
      width="800px"
      top="10%"
      v-model="monitorDetailFlag"
      v-if="monitorDetailFlag"
      title="监控事件信息">
      <monitor-detail :detailData="transData" @closeDialog="_closeDialog('monitorDetailFlag')"></monitor-detail>
      <template slot="footer" class="dialog-footer">
        <s-button v-if="!transData.itilIncidentOrderUuid&&WorkFlowAuth" @click="intoProcess('monitorDetailFlag')">进入流程
        </s-button>
        <s-button v-else-if="WorkFlowAuth" @click="viewProcess">查看流程</s-button>
        <s-button type="cancel" @click="monitorDetailFlag=false">关闭</s-button>
      </template>
    </s-dialog>

    <!--运维审计事件-->
    <s-dialog
      width="900px"
      top="10%"
      v-model="operationDetailFlag"
      v-if="operationDetailFlag"
      title="事件详情">
      <operation-detail :rowData="transData" @closeDialog="_closeDialog('operationDetailFlag')"></operation-detail>
      <template slot="footer" class="dialog-footer" v-if="transData.type !== 6">
        <s-button v-if="!transData.itilIncidentOrderUuid&&WorkFlowAuth" @click="intoProcess('operationDetailFlag')">
          进入流程
        </s-button>
        <s-button v-else-if="WorkFlowAuth" @click="viewProcess">查看流程</s-button>
        <s-button type="cancel" @click="operationDetailFlag=false">关闭</s-button>
      </template>
    </s-dialog>

    <!--数据库审计事件-->
    <s-dialog
      width="800px"
      top="10%"
      v-model="DbDetailFlag"
      v-if="DbDetailFlag"
      title="事件信息">
      <db-detail :rowData="transData" @closeDialog="_closeDialog('DbDetailFlag')"></db-detail>
      <template slot="footer" class="dialog-footer">
        <s-button v-if="!transData.itilIncidentOrderUuid&&WorkFlowAuth"
                  @click="intoProcess('DbDetailFlag', 'alarm_id')">进入流程
        </s-button>
        <s-button v-else-if="WorkFlowAuth" @click="viewProcess">查看流程</s-button>
        <s-button type="cancel" @click="DbDetailFlag=false">关闭</s-button>
      </template>
    </s-dialog>

    <!--业务审计事件-->
    <s-dialog
      v-model="businessDetailFlag"
      v-if="businessDetailFlag"
      title="事件信息"
      width="800px"
      top="10%">
      <business-detail :rowData="transData" @closeDialog="_closeDialog('businessDetailFlag')"></business-detail>
      <template slot="footer" class="dialog-footer">
        <s-button v-if="!transData.itilIncidentOrderUuid&&WorkFlowAuth"
                  @click="intoProcess('businessDetailFlag', 'alarm_id')">进入流程
        </s-button>
        <s-button v-else-if="WorkFlowAuth" @click="viewProcess">查看流程</s-button>
        <s-button type="cancel" @click="businessDetailFlag=false">关闭</s-button>
      </template>
    </s-dialog>

    <!--日志审计事件-->
    <s-dialog
      v-model="logAuditDialog"
      v-if="logAuditDialog"
      title="事件信息"
      width="800px"
      top="10%">
      <div class="info-table">
        <s-row class="info-row">
          <s-col :span="5" class="grid-content bg-purple">事件级别</s-col>
          <s-col :span="7" class="grid-content bg-purple-light">{{ transData.levelStr }}</s-col>
          <s-col :span="5" class="grid-content bg-purple">IP地址</s-col>
          <s-col :span="7" class="grid-content bg-purple-light">{{ transData.controlAdderss }}</s-col>
        </s-row>
        <s-row class="info-row">
          <s-col :span="5" class="grid-content bg-purple">创建时间</s-col>
          <s-col :span="7" class="grid-content bg-purple-light">{{ transData.createTimeStr }}</s-col>
          <s-col :span="5" class="grid-content bg-purple">更新时间</s-col>
          <s-col :span="7" class="grid-content bg-purple-light">{{ transData.modifyTimeStr }}</s-col>
        </s-row>
        <s-row class="info-row">
          <s-col :span="5" class="grid-content bg-purple">日志源名称</s-col>
          <s-col :span="19" class="grid-content bg-purple-light">{{ transData.itcompName }}</s-col>
        </s-row>
        <s-row class="info-row">
          <s-col :span="5" class="grid-content bg-purple">事件信息</s-col>
          <s-col :span="19" class="grid-content bg-purple-light">{{ transData.incidentContent }}
          </s-col>
        </s-row>
      </div>
      <template slot="footer" class="dialog-footer">
        <s-button v-if="!transData.itilIncidentOrderUuid&&WorkFlowAuth" @click="intoProcess('logAuditDialog')">进入流程
        </s-button>
        <s-button v-else-if="WorkFlowAuth" @click="viewProcess">查看流程</s-button>
        <s-button type="cancel" @click="logAuditDialog=false">关闭</s-button>
      </template>
    </s-dialog>

    <!--最新事件手动创建事件单，进入itsm流程-->
    <s-dialog
      v-model="createEventOrderDialog"
      v-if="createEventOrderDialog"
      width="600px"
      top="10%"
      title="创建工单">
      <create-event-order ref="createEventOrder" :defaultData="defaultData"></create-event-order>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveCreateEventOrder">保存</s-button>
        <s-button type="cancel" @click="createEventOrderDialog = false">关闭</s-button>
      </template>
    </s-dialog>
  </s-card-diy>
</template>

<script>
  import {reverseObj} from 'sunflower-common-utils'
  import {sTimeLine, sTimeLineItem} from '@/components/timeline'
  import eventItem from '@/home/EventCenter/EventItem'
  // import navs from '@/components/navButton/NavButton.vue'
  import $axios from 'sunflower-ajax'
  import createEventOrder from '@/home/ProcessCenter/ProcessCreatOrder/EventOrderDialog'
  import monitorDetail from '@/pages/Event_List/MonitorDetail.vue'
  import operationDetail from '@/pages/Event_List/OperationDetail.vue'
  import dbDetail from '@/pages/Event_List/DatabaseDetail.vue'
  import businessDetail from '@/pages/Event_List/BusinessDetail.vue'
  import auth from '@/common/mixins/auth.js'

  const levelOptions = ['警告', '次要', '主要', '严重', '提示', '正常', '未知'];
  const colorlist = ['#FFB851', '#FB8032', '#F3608D', '#E7493E'];

  export default {
    mixins: [auth],
    data() {
      return {
        isActive: 'today',
        btncount: 6,
        maxheight: 170,
        chart1: {
          el: 'chart1',
          type: 'yBarChart',
          width: '100%',
          height: '150px',
          data: {},
          opt: {
            series: {
              itemStyle: {
                normal: {
                  color: function (params) {
                    return colorlist[params.dataIndex]
                  },
                  label: {
                    show: true,
                    position: 'right'
                  }
                }
              }
            },
            xAxis: {
              axisLabel: {
                show: false
              },
              axisLine: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(0,0,0,.1)',
                  width: 1,
                  type: 'dashed'
                }
              }
            },
            yAxis:
              {
                axisLine: {show: false}
              }
          }
        },
        chart2: {
          name: 'chart2',
          type: 'lineChart',
          width: '100%',
          height: '160px',
          data: {},
          option: {
            xAxis: [
              {
                axisLabel: {show: true},
                axisLine: {show: false}, // 轴线不显示
                splitLine: {
                  lineStyle: {
                    type: 'dashed'
                  }
                }
              }
            ],
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
              left: 0,
              right: 0,
              top: 10,
              bottom: 20
            },
            tooltip: {
              show: true,
              formatter: function (params) {
                let str = `${params[0].name} <br/> 数量：${params[0].value}`;
                return str;
              }
            },
            series: [
              {
                itemStyle: {
                  normal: {
                    color: '#60ACFC',
                    lineStyle: {
                      color: '#60ACFC'
                    }
                  }
                }
              }
            ]
          }
        },
        chart3: {
          el: 'chart3',
          type: 'yBarChart',
          width: '100%',
          height: '260px',
          data: {},
          opt: {
            series: {
              itemStyle: {
                normal: {
                  color: '#60ACFC',
                  label: {
                    show: true,
                    position: 'right'
                  }
                }
              }
            },
            xAxis: {
              axisLabel: {
                show: false
              },
              axisLine: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(0,0,0,.1)',
                  width: 1,
                  type: 'dashed'
                }
              }
            },
            yAxis:
              {
                axisLine: {show: false}
              }
          }
        },
        alarmStatus: ['失败', '成功'],
        alarmStatusClass: ['error', ''],
        alarmType: ['', '客户端告警', '邮件告警', '短信告警', '微信告警'],
        alarmTypeClass: ['', 'iconfont icon-screen', 'iconfont icon-email', 'iconfont icon-phone', 'iconfont icon-wechat'],
        top10List: [],
        isIndeterminate: false,
        checkAll: false,
        checkedLevel: ['严重'],
        checkedStatus: ['未恢复'],
        eventItemHeight: 60,
        oddItemHeight: 16,
        level: levelOptions,
        t: null,
        createEventOrderDialog: false,  // 最新事件，手动创建事件单
        eventUuid: '',                  // 创建事件单走ITSM流程的事件的uuid
        eventDetailDialogType: '',      // 创建事件单走ITSM流程的事件的类型，用于关闭对应详情弹框
        monitorDetailFlag: false,
        operationDetailFlag: false,
        DbDetailFlag: false,
        businessDetailFlag: false,
        logAuditDialog: false,
        transData: {},
        chartResize: false
      }
    },
    components: {
      // navs,
      sTimeLine,
      sTimeLineItem,
      eventItem,
      createEventOrder,
      monitorDetail,
      operationDetail,
      dbDetail,
      businessDetail
    },
    watch: {
    },
    mounted() {
      this.initDivHeight();
      this.chooseTimeType('today');
      this.$nextTick(() => {
        window.addEventListener('resize', this.initDivHeight);
        window.addEventListener('resize', this.computeAssetHeight);
      });
    },
    destroyed() {
      window.removeEventListener('resize', this.initDivHeight);
    },
    computed: {
      wrapstyle() {
        return 'max-height:' + this.maxheight + 'px;';
      }
    },
    methods: {
      moreClick() {
        this.$router.push('/EventCenter/event_list/0/0/0');
      },
      chooseTimeType (val) {
        if (val === 'week') {
          this.isActive = 'week';
          this.trendByWeek()
        } else if (val === 'today') {
          this.isActive = 'today';
          this.trendByDay()
        } else {
          this.isActive = 'month';
          this.trendByMonth()
        }
      },
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
      initDivHeight() {
        this.chartResize = false
        this.eventItemHeight = 130;
        this.oddItemHeight = 5;
        this.chartResize = true;
      },
      trendByDay() {
        // 当天事件走势
        $axios.get('eventCount/getEventCountByDay').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.chart2.data = res.data;
          }
        });
      },
      trendByWeek() {
        // 本周事件走势
        $axios.get('eventCount/getEventCountByWeek').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.chart2.data = res.data;
          }
        });
      },
      trendByMonth() {
        // 本月事件走势
        $axios.get('eventCount/getEventCountByMonth').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.chart2.data = res.data;
          }
        });
      },
      getData() {
        // 事件级别统计
        let vm = this;
        $axios.get('eventCount/getEventCountByLevel').then((res) => {
          if (res.data && res.data instanceof Array) {
            let arr = res.data.slice(0, 4);
            vm.chart1.data = reverseObj(vm.resetData(arr))
          }
        });
        // 告警事件统计
        $axios.get('/eventCount/getAlarmCountByType').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.chart3.data = this.resetData(res.data);
            console.log(this.chart3.data);
          }
        });
        // 最新事件
        this.getTop10()
      },
      goto(path) {
        this.$router.push('/EventCenter/' + path);
      },
      gotoWithAuth() {
        let registerModelList = this.$store.state.userData.registerModelList;
        let res = ['IMP', 'OMA', 'DBA', 'SIEM'].some((item) => {
          return registerModelList.indexOf(item) > -1;
        });
        if (res) {
          this.goto('event_rules');
        } else {
          this.$message({type: 'error', message: '无访问权限'});
        }
      },
      jumpto(path) {
        this.$router.push(path);
      },
      resetData(data) {
        let _data = {};
        for (let i = 0; i < data.length; i++) {
          _data[data[i].name] = data[i].value;
        }
        return _data;
      },
      handleCheckAllChange(val) {
        this.checkedLevel = val ? levelOptions : [];
        this.isIndeterminate = false;
        this.setTop10();
      },
      handleCheckedLevelChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.level.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.level.length;
        this.setTop10();
      },
      handleCheckedStatusChange(value) {
        if (value.length > 0) {
          this.setTop10();
        }
      },
      setTop10() {
        if (this.t) {
          clearTimeout(this.t);
          this.t = setTimeout(this.getTop10, 1000);
        } else {
          this.t = setTimeout(this.getTop10, 1000);
        }
      },
      getTop10() {
        if (this.checkedLevel.length > 0 && this.checkedStatus.length > 0) {
          let _data = this.checkedLevel.toString().replace(/严重/g, 6).replace(/主要/, 5).replace(/次要/, 4).replace(/警告/, 3).replace(/提示/, 2).replace(/正常/, 1).replace(/未知/, 0) + ',' + this.checkedStatus.toString().replace(/未恢复/g, 8).replace(/已恢复/g, 9);
          $axios.get(`eventCount/getIncidentInfoTop10/${_data}/0`).then((res) => {
            if (res.data && res.data instanceof Array) {
              if (res.data.length > 8) {
                this.top10List = res.data.slice(0, 8);
              } else {
                this.top10List = res.data;
              }
            }
          });
        } else {
          this.top10List = [];
        }
        this.t = null;
      },
      // 点击卡片左侧，查看事件详情
      _viewEvent(item) {
        switch (item.type) {
          case 1:
            this.getMonitorDetail(item);
            break; // 监控事件事件详情信息不足，另外请求获取数据
          case 2:
            this.transData = item;
            this.operationDetailFlag = true;
            break; // 运维事件详情
          case 3:
            this.getDbDetail(item);
            break;  // 数据库审计事件详情信息不足，另外请求获取数据
          case 4:
            this.getBusinessDetail(item);
            break;  // 业务审计事件详情信息不足，另外请求获取数据
          case 5:
            this.transData = item;
            this.logAuditDialog = true;
            break;
          case 6:
            this.transData = item;
            this.operationDetailFlag = true;
            break;
        }
      },
      // 事件项“处理”/“处理中”/“已处理”点击事件
      _handelClick(item) {
        if (item.itilIncidentOrderUuid) { // 已进入流程，查看流程详情
          switch (item.type) {
            case 1:
              this.getMonitorDetail(item, false).then(() => {
                this.viewProcess();
              });
              break;
            case 2:
              this.transData = item;
              this.viewProcess();
              break;
            case 3:
              this.getDbDetail(item, false).then(() => {
                this.viewProcess();
              });
              break;
            case 4:
              this.getBusinessDetail(item, false).then(() => {
                this.viewProcess();
              });
              break;
            case 5:
              this.transData = item;
              this.viewProcess();
              break;
          }
        } else {  // 事件进入流程
          this.defaultData = item;
          switch (item.type) {
            case 1:
              this.getMonitorDetail(item, false).then(() => {
                this.intoProcess('monitorDetailFlag')
              });
              break;
            case 2:
              this.transData = item;
              this.intoProcess('operationDetailFlag');
              break;
            case 3:
              this.getDbDetail(item, false).then(() => {
                this.intoProcess('DbDetailFlag', 'alarm_id')
              });
              break;
            case 4:
              this.getBusinessDetail(item, false).then(() => {
                this.intoProcess('businessDetailFlag', 'alarm_id')
              });
              break;
            case 5:
              this.transData = item;
              this.intoProcess('logAuditDialog');
              break;
          }
        }
      },
      // 事件处理时，获取监控事件的更多详情信息
      getMonitorDetail(item, openDetailDialog = true) {
        return new Promise((resolve, reject) => {
          $axios.get(`/incidentCount/incidentCountByUuid/${item.uuid}`).then(({data}) => {
            if (data) {
              this.transData = data
              this.$set(this.transData, 'itilIncidentOrderUuid', item.itilIncidentOrderUuid)
              openDetailDialog && (this.monitorDetailFlag = true)
              resolve()
            } else reject()
          })
        });
      },
      // 事件处理时，获取数据库审计事件的更多详情信息
      getDbDetail(item, openDetailDialog = true) {
        return new Promise((resolve, reject) => {
          $axios.get(`dbaIncident/getMongdb/t_data_alarm_dbsql/alarm_id/${item.uuid}`).then(({data}) => {
            if (data && data instanceof Array) {
              this.transData = data[0]
              this.$set(this.transData, 'itilIncidentOrderUuid', item.itilIncidentOrderUuid)
              openDetailDialog && (this.DbDetailFlag = true)
              resolve()
            } else reject()
          })
        });
      },
      // 事件处理时，获取业务审计事件的更多详情信息
      getBusinessDetail(item, openDetailDialog = true) {
        return new Promise((resolve, reject) => {
          $axios.get(`dbaIncident/getMongdb/t_data_alarm_url/alarm_id/${item.uuid}`).then(({data}) => {
            if (data && data instanceof Array) {
              this.transData = data[0]
              this.$set(this.transData, 'itilIncidentOrderUuid', item.itilIncidentOrderUuid)
              openDetailDialog && (this.businessDetailFlag = true)
              resolve()
            } else reject()
          })
        });
      },
      // ----------详情弹框内部按钮功能-------------
      // 事件走ITSM流程,创建事件工单
      intoProcess(dialogFlag, eventIdKeyName = 'uuid') {
        $axios.get('/iamUserInfo/hasItilIncidentIamUserInfo').then(({data}) => {
          if (data && data === true) {
            // 打开创建事件单弹框(走ITSM流程创建事件单)
            this.createEventOrderDialog = true
            /**
             * 获取事件的主键ID(走流程时上传的sysIncidentUuid字段)
             * 运维审计事件，主键为sessionCmdUuid，
             * 数据库审计事件，主键为alarm_id，
             * 业务审计事件，主键为alarm_id，
             * 其他事件类型的事件主键为uuid
             */
            this.eventUuid = this.transData[eventIdKeyName]
            // 获取当前查看的事件详情的类型
            this.eventDetailDialogType = dialogFlag
          } else {
            this.$message.error('系统中无流程人员，无法执行此操作！')
          }
        })
      },
      // 事件已进入ITSM流程,查看流程图
      viewProcess() {
        $axios.get(`itilIncidentCenter/getSerialCodeByUuid/${this.transData.itilIncidentOrderUuid}`).then(({data}) => {
          if (data && typeof data === 'string') {
            this.$router.push(`/ProcessCenter/eventFlowchart/${data}/${this.transData.itilIncidentOrderUuid}`)
          }
        })
      },
      /**
       * 最新事件,手动创建事件单-保存
       */
      saveCreateEventOrder() {
        this.$refs['createEventOrder'].$refs['Form'].validate(valid => {
          if (valid) {
            let form = this.$refs['createEventOrder'].form
            let param = {};
            for (let i in form) {
              if (form[i] || form[i] === 0) {
                param[i] = form[i]
              }
            }
            param.attachuuid = this.$refs['createEventOrder'].fileList.map(item => {
              return item.response.attachuuid;
            }).join(',');
            // 上传sysIncidentUuid(事件的uuid/sessionCmdUuid)
            param.sysIncidentUuid = this.eventUuid
            // 上传不同类型事件的数字
            param.sysIncidentType = this.defaultData.type;
            $axios.post('/itilIncidentCenter/saveIncidentOrderUser', param).then(({data}) => {
              if (data.state === true) {
                this.$message.success('已保存，进入流程成功！')
                this.createEventOrderDialog = false
                this._closeDialog(this.eventDetailDialogType)
              } else {
                this.$message.error(data.errormsg)
              }
            })
          } else {
            return false
          }
        })
      },
      // 事件处理，关闭弹框
      _closeDialog(dialog) {
        this[dialog] = false
        this.getData();
      }
    },
    created() {
      this.getData();
    }
  }
</script>
<style lang="stylus">
  .event-box
    width 100%
    margin 0 auto
    .main-left
      .eventCenterScrollheightLeft
        height: calc(100vh - 163px)
        padding-right 20px
      .event-card
        .s-card-header
          padding 0 20px
          .event-check-group
            float right
            display inline-block
        .s-card-body
          padding 0 0 0 20px
    .main-right
      height calc(100vh - 49px)
      padding 20px 0 20px 20px
      .right-scroll
        .s-scrollbar-wrap
          padding-right 20px
      .right-card
        .s-card-header
          padding-right 16px
          border-bottom none !important
      .trend-card
        height: 260px
        .radio-box
          height: 30px
          .s-button-group
            .s-button
              &:not(:last-child)
                margin-right 0
</style>
