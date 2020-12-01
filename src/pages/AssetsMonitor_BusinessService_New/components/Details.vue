/*
create by YOU
*/
<template>
  <section class="monitor-card">
    <s-row class="monitor-card-line" :gutter="20">
      <!--基本信息/businessservice/getBusinessServicesInfo/bf732e04a6374780a50c75c7a9aa622d-->
      <s-col :span="12">
        <s-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <div class="my-tb">
            <s-row>
              <s-col :span="6" class="header">名称</s-col>
              <s-col :span="6">{{ basic.name }}</s-col>
              <s-col :span="6" class="header">服务状态</s-col>
              <s-col :span="6">{{ basic.statusName ? basic.statusName : '未知' }}</s-col>
            </s-row>
            <s-row>
              <s-col :span="6" class="header">关键程度</s-col>
              <s-col :span="6">{{ basic.criticalityName }}</s-col>
              <s-col :span="6" class="header">影响度</s-col>
              <s-col :span="6">{{ basic.effectName }}</s-col>
            </s-row>
            <!--<s-row>-->
            <!--<s-col :span="6" class="header">提供方</s-col>-->
            <!--<s-col :span="6">{{ basic.providerView ? basic.providerView.departName : '无' }}</s-col>-->
            <!--<s-col :span="6" class="header">维护人</s-col>-->
            <!--<s-col :span="6">{{ basic.maintenanceView ? basic.maintenanceView.userRealName : '无' }}</s-col>-->
            <!--</s-row>-->
            <s-row>
              <s-col :span="6" class="header">创建日期</s-col>
              <s-col :span="6">{{ basic.createTime }}</s-col>
              <s-col :span="6" class="header">最近修改时间</s-col>
              <s-col :span="6">{{ basic.modifyTime }}</s-col>
            </s-row>
            <s-row>
              <s-col :span="6" class="header" style="height: 68px;">描述</s-col>
              <s-col :span="18" style="height: 68px;">{{ basic.decription ? basic.decription : '无' }}</s-col>
            </s-row>
          </div>
        </s-card>
      </s-col>
      <!--可用性-->
      <!--/businessservice/servicesAvailable/-->
      <s-col :span="12">
        <s-card class="box-card">
          <div slot="header" class="clearfix">
            <span>可用性</span>
          </div>
          <div class="btns">
            <s-button :class="useful.btn ? 'btn-focus' : ''" @click="ringChartToday" class="today">今天</s-button>
            <s-button :class="useful.btn ? '' : 'btn-focus'" @click="ringChartWeek">近七天</s-button>
          </div>
          <s-chart key="ringChart1" v-if="useful.btn" :chart="useful.today"></s-chart>
          <s-chart key="ringChart2" v-else :chart="useful.week"></s-chart>
        </s-card>
      </s-col>
    </s-row>
    <s-row class="monitor-card-line" :gutter="20">
      <!--服务状态-->
      <!--/businessservice/weekServicesStatusCurve/-->
      <!--/businessservice/todayServicesStatusCurve/-->
      <s-col :span="12">
        <s-card class="box-card">
          <div slot="header" class="clearfix">
            <span>服务状态</span>
          </div>
          <div class="btns">
            <s-button :class="serviceStatus.btn ? 'btn-focus' : ''" @click="lineChartToday" class="today">今天
            </s-button>
            <s-button :class="serviceStatus.btn ? '' : 'btn-focus'" @click="lineChartWeek">近七天</s-button>
          </div>
          <s-chart key="lineChart1" v-if="serviceStatus.btn" :chart="serviceStatus.today"></s-chart>
          <s-chart key="lineChart2" v-else :chart="serviceStatus.week"></s-chart>
        </s-card>
      </s-col>
      <!--关联资产状态/businessservice/getBusinessServicesItcompRelStatusListByBusinessServicesInfoUuid/bf732e04a6374780a50c75c7a9aa622d/1-->
      <s-col :span="12">
        <s-card class="box-card">
          <div slot="header" class="clearfix">
            <span>关联资产状态</span>
          </div>
          <s-scrollbar wrap-class="monitorScrollMiniheight">
            <s-table
              :data="resourceStatus"
              style="width: 100%">
              <s-table-column
                prop="controlAdderss"
                show-overflow-tooltip
                label="IP地址">
              </s-table-column>
              <s-table-column
                prop="itcompName"
                show-overflow-tooltip
                label="资产名称">
              </s-table-column>
              <s-table-column
                prop="citypeName"
                show-overflow-tooltip
                label="类型">
              </s-table-column>
              <s-table-column
                show-overflow-tooltip
                label="可用性">
                <template slot-scope="scope">
                  <span :class="`status-circle-box status-circle-1-${scope.row.used1}`"></span>
                </template>
              </s-table-column>
              <s-table-column
                show-overflow-tooltip
                label="健康状况">
                <template slot-scope="scope">
                  <!-- 0red 1yellow 2green -->
                  <span :class="`status-circle-box status-circle-2-${scope.row.used2}`"></span>
                </template>
              </s-table-column>
              <s-table-column
                prop="used3"
                show-overflow-tooltip
                label="今日可用性">
                <template slot-scope="scope">
                  <s-progress :percentage="parseFloat(scope.row.used3)"></s-progress>
                </template>
              </s-table-column>
            </s-table>
          </s-scrollbar>
        </s-card>
      </s-col>
    </s-row>
    <s-row class="monitor-card-line" :gutter="20">
      <!--事件统计/incidentCount/countIncidentCountForBusinessServices/bf732e04a6374780a50c75c7a9aa622d-->
      <s-col :span="24">
        <s-card class="box-card card-auto">
          <div slot="header" class="clearfix">
            <span>事件统计</span>
          </div>
          <s-box :data="eventsCount.box" :bars="4" type="vertical"></s-box>
          <s-table-page
            :data="eventsCount.list"
            :show-overflow-tooltip="true"
            >
            <s-table-column
              prop="controlAdderss"
              show-overflow-tooltip
              label="标识">
            </s-table-column>
            <s-table-column
              prop="levelStr"
              show-overflow-tooltip
              label="事件级别">
            </s-table-column>
            <s-table-column
              prop="incidentContent"
              show-overflow-tooltip
              label="事件摘要">
            </s-table-column>
            <s-table-column
              prop="isRecoveryStr"
              show-overflow-tooltip
              label="恢复状态">
            </s-table-column>
            <s-table-column
              prop="statusStr"
              show-overflow-tooltip
              label="事件状态">
            </s-table-column>
            <s-table-column
              show-overflow-tooltip
              label="创建时间">
              <template slot-scope="scope">
                {{ scope.row.createTimeStr }}
                <!--{{ formatTime(new Date(scope.row.createTime * 1000)) }}-->
              </template>
            </s-table-column>
            <s-table-column
              show-overflow-tooltip
              label="更新时间">
              <template slot-scope="scope">
                {{ scope.row.modifyTimeStr }}
                <!--{{ formatTime(new Date(scope.row.modifyTime * 1000)) }}-->
              </template>
            </s-table-column>
            <s-table-column
              prop="itcompName"
              show-overflow-tooltip
              label="资产名称">
            </s-table-column>
            <s-table-column
              prop="controlAdderss"
              show-overflow-tooltip
              label="IP地址">
            </s-table-column>
            <s-table-column
              prop="typeStr"
              show-overflow-tooltip
              label="监控项类别">
            </s-table-column>
            <s-table-column
              prop="miTypeName"
              show-overflow-tooltip
              label="监控项名称">
            </s-table-column>
            <s-table-column
              prop="ciTypeName"
              show-overflow-tooltip
              label="资产类型">
            </s-table-column>
            <s-table-column
              prop="count"
              show-overflow-tooltip
              label="事件累计">
            </s-table-column>
          </s-table-page>
        </s-card>
      </s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">

  import $axios from 'sunflower-ajax'

  export default {

    data () {
      return {
        // 概况
        basic: {},
        useful: {
          today: {
            name: '可用性',
            type: 'ringChart',
            width: '100%',
            height: '230px',
            itemName: '可用性',
            data: 0,
            isReverseColor: 1
          },
          week: {
            name: '可用性',
            type: 'ringChart',
            width: '100%',
            height: '230px',
            itemName: '可用性',
            data: 0,
            isReverseColor: 1
          },
          btn: true
        },
        serviceStatus: {
          today: {
            name: '服务状态',
            type: 'areaWordChart',
            width: '100%',
            height: '270px',
            itemName: '状态',
            data: {
              'data': [],
              'relation': []
            }
          },
          week: {
            name: '服务状态',
            type: 'areaWordChart',
            width: '100%',
            height: '270px',
            itemName: '状态',
            data: {
              'data': [],
              'relation': []
            }
          },
          btn: true
        },
        resourceStatus: [],
        eventsCount: {
          box: [
            {
              icon: 'file',
              title: '事件总数',
              des: '0'
            },
            {
              icon: 'file',
              title: '已告警事件数',
              des: '0'
            },
            {
              icon: 'file',
              title: '未告警事件数',
              des: '0'
            },
            {
              icon: 'file',
              title: '已恢复事件数',
              des: '0'
            }
          ],
          list: []
        }
      }
    },
    beforeRouteUpdate () {
      this.init()
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        let _self = this
        let uuid = this.$route.params.id
        this.uuid = uuid
        // 概况
        $axios.post('/businessservice/getBusinessServicesInfo/' + uuid).then(function (res) {
          _self.basic = res.data
        })
        $axios.post('/businessservice/getBusinessServicesItcompRelStatusListByBusinessServicesInfoUuid/' + uuid + '/1').then(function (res) {
          _self.resourceStatus = res.data
        })
        $axios.post('/businessservice/servicesAvailable/' + uuid).then(function (res) {
          _self.useful.today.data = Number.parseFloat(res.data.today)
          _self.useful.week.data = Number.parseFloat(res.data.week)
        })
        $axios.post('/businessservice/weekServicesStatusCurve/' + uuid).then(function (res) {
          if (res.data.data && res.data.data.length === 0) {
            _self.serviceStatus.week.data = {}
          } else {
            _self.serviceStatus.week.data = res.data
          }
        })
        $axios.post('/businessservice/todayServicesStatusCurve/' + uuid).then(function (res) {
          if (!res.data.data || res.data.data && res.data.data.length === 0) {
            _self.serviceStatus.today.data = {}
          } else {
            _self.serviceStatus.today.data = res.data
          }
        })
        $axios.post('/incidentCount/countIncidentCountForBusinessServices/' + uuid).then(function (res) {
          _self.eventsCount.box[0].des = res.data.count_all
          _self.eventsCount.box[1].des = res.data.yigaojing
          _self.eventsCount.box[2].des = res.data.weigaojing
          _self.eventsCount.box[3].des = res.data.yihuifu
          _self.$nextTick(function () {
            _self.eventsCount.list = res.data.incidentCountList
          })
        })
      },
      ringChartToday () {
        this.useful.data = this.useful.today;
        this.useful.btn = true;
      },
      ringChartWeek () {
        this.useful.data = this.useful.week;
        this.useful.btn = false;
      },
      lineChartToday () {
        this.serviceStatus.btn = true;
      },
      lineChartWeek () {
        this.serviceStatus.btn = false;
      }
    }
  };
</script>
