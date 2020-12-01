/**
 * @author fumin
 * @date 2019/7/18
 * @Description: 报表中心 -》运维审计报表 -》智能审计
*/
<template>
  <!---->
  <section class="operationStatistics" id="logAudit">
    <s-form v-if="!isSearchPage" :inline="true" :module="time">
      <select-time ref="selecttime">
        <template slot="searchBtn">
          <div class="search_btn">
            <s-button title="查询" icon='magnifier' @click="showList">查询</s-button>
          </div>
        </template>
      </select-time>
    </s-form>
    <s-row style="margin: 15px 0 10px;">
      <s-button title="EXCEL报表" icon="excel" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
    </s-row>
    <!--审核页面的动态表头真分页-->
    <div style="float: right; margin: 0 10px 10px  0" v-if = "isSearchPage">
      <s-button title="返回" icon="arrow-left" @click="backTo()">返回</s-button>
    </div>
    <div style="float: right; margin: -44px 10px 0 0">
      <s-button title="评分规则" icon="weizhi" @click="gradRule()">评分规则</s-button>
    </div>
    <s-table :data="operationList" style="width:100%;" @selection-change="getSelection" actionColWidth="150px"  ref="operationTable">
      <s-table-column type="selection" width="55px" v-if="!isSearchPage"></s-table-column>
      <s-table-column label="会话ID" prop="sessionId"></s-table-column>
      <s-table-column label="会话类型" prop="sessionTypeName"></s-table-column>
      <s-table-column label="操作人" prop="userLoginName"></s-table-column>
      <s-table-column label="人员所属机构" prop="departName"></s-table-column>
      <s-table-column label="客户端IP" prop="sessionClientIp"></s-table-column>
      <s-table-column label="目标资产IP" prop="deviceIp"></s-table-column>
      <s-table-column label="端口" prop="port"></s-table-column>
      <s-table-column label="协议名" prop="protocolName"></s-table-column>
      <s-table-column label="账号名" prop="accountName"></s-table-column>
      <s-table-column label="命令告警" prop="alertCnt"></s-table-column>
      <s-table-column label="命令阻断" prop="cmdBlockCnt"></s-table-column>
      <s-table-column label="会话阻断" prop="sessionBlockCnt"></s-table-column>
      <s-table-column label="智能评分">
        <template slot-scope="scope">
          <a @click="goIntellDetail(scope.row)" class="ip">{{scope.row.score}}</a>
        </template>
      </s-table-column>
      <s-table-column label="评分等级" prop="scoreLevel"></s-table-column>
      <s-table-column label="操作" width="200">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" @click="sessionView(scope.row)" title="查看"></i>
          <i class="iconfont icon-vcr" @click="sessionVcr(scope.row)" title="录像回放"></i>
        </template>
      </s-table-column>
    </s-table>
    <s-row class="pageRow">
      <s-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="operationTable.currentPage" :page-size="operationTable.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="operationTable.totalCount"></s-pagination>
    </s-row>

    <!--会话回显-->
    <s-dialog v-model="bloomSession" v-if="bloomSession" title="会话回显" key="bloomSession" width="1000px">
      <session-detail ref="sessionDetail" :param="param" :notShowVcr="notShowVcr" @setClip="getClip"></session-detail>
    </s-dialog>
    <!--剪贴板查看详情-->
    <s-dialog v-model="bloomClipCheck" v-if="bloomClipCheck" title="详情" key="bloomClipCheck">
      <section class="">
        <s-row>{{clipCheckText}}</s-row>
      </section>
    </s-dialog>
    <!--评分规则-->
    <s-dialog v-model="gradeDialog" v-if="gradeDialog" width="800px" title="评分规则设置与说明">
      <score-rule></score-rule>
    </s-dialog>
    <!--点击智能评分跳转到详情-->
    <s-dialog v-model="roleFlag" v-if="roleFlag" title="智能评分详细">
      <score-detail :scoreData="scoreData"></score-detail>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'

  import SessionDetail from './SessionDetail'
  // import AuditDetail from './AuditDetail'
  import ScoreRule from './ScoreRule'
  import ScoreDetail from './ScoreDetail'
  import SelectTime from '@/components/selectTime/SelectTime.vue'

  export default {
    components: {
      // Download,

      SessionDetail,
      // AuditDetail,
      SelectTime,
      ScoreRule,
      ScoreDetail
    },
    data() {
      return {
        operationList: [],
        operationTable: {
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        },
        yearValue: '',
        monthValue: '',
        dayValue: '',
        year: [],
        month: [],
        day: [],
        bloomSession: false,
        gradeDialog: false,
        uuid: [],       // 会话审核的uuid
        uuidArr: [],   // 批量会话审核的uuid
        time: [],
        audit: '',      // 会话审核弹框的select
        auditArr: '',   // 批量会话审核弹框的select
        sessionAuditRemark: '',  // 会话审核弹框的select
        sessionAuditRemarkArr: '',  // 批量会话审核弹框的select
        failureReason: '',
        bloomClipCheck: false,
        clipCheckText: '',
        ProtocolNames: ['ORACLE', 'SQL SERVER', 'MySQL', 'DB2', 'INFORMIX', 'Sybase', 'SFTP', 'FTP'], // 不需要显示视频和下载的协议
        notShowVcr: true,  // 一些协议不显示视频（详情页也不显示视频）
        param: {
          sessionDetail: [],
          userDetail: [],
          clip: [],
          talkId: '',
          title: [],
          mouse: [],
          bitmap: [],
          protocolType: '',
          showTab: false,
          tabs: [],
          uuid: ''
        },
        roleFlag: false,
        scoreData: {},
        key: 0,
        selections: [],
        sessionUuids: []
      }
    },
    // 接收显示第二个tab页的内容
    props: ['isSearchPage', 'dateTime', 'dataList', 'columnList', 'show1'],
    methods: {
      gradRule() { // 查看评分规则
        this.gradeDialog = true
      },
      goIntellDetail(row) { // 点击智能评分，跳转到详情
        this.roleFlag = true
        this.scoreData = row
      },
      ExcelDownloadHandle() {
        let vm = this;
        let {beginTimes, endTimes} = vm.$refs.selecttime
        let form = {
          exportType: 'excel',
          startTime: new Date(beginTimes).getTime() / 1000,
          endTime: new Date(endTimes).getTime() / 1000,
          sessionUuids: vm.sessionUuids
        }
        $axios.post(`/operationLogStat/makeIntelligentAuditFile`, form).then((res) => {
          if (res.data) {
            Download(`/operationLogStat/downOperationIntelligentAuditFile/excel?t=${new Date().getTime()}`);
          }
        });
      },
      backTo () {
        this.$emit('changeFlag')
      },
      sessionView (row) { // 查看
        let vm = this;
        vm.bloomSession = true;
        vm.param.protocolType = row.protocolName;
        vm.param.userDetail = [];
        // 会话回显、会话属性
        $axios.get(`/operationLogStat/review/${row.uuid}`).then((res) => {
          vm.param.sessionDetail = res.data;
          vm.param.userDetail.push(res.data.detail);
          vm.param.talkId = res.data.detail.sessionId;
          vm.param.uuid = res.data.detail.uuid;
        });
        let protocol = ['RDP', 'nla', 'cspsclient', 'easyView', 'smartDashBoard', 'web', 'postgreAdmin', 'mssqlserver', 'plsql', 'radmin', 'sqlyog', 'vmwareVsphereClient5.5', 'mysqlfront', 'nsm', 'toadoracle', 'vmwareVsphereClient5.0', 'vncviewer', 'vmwareVsphereClient6.0', 'xwin']
        // 如果是上述几种协议之一，则显示6个tab
        if (protocol.indexOf(vm.param.protocolType) > -1) {
          // vm.param.tabs = {'sessionView': '会话回显', 'sessionInfo': '会话属性', 'clipBoard': '剪贴板审计', 'title': '标题审计', 'mouse': '鼠标审计', 'bitMap': '缩略图审计'};
          vm.param.tabs = [{
            name: '会话回显', value: 'sessionView'
          }, {
            name: '会话属性', value: 'sessionInfo'
          }, {
            name: '剪贴板审计', value: 'clipBoard'
          }, {
            name: '标题审计', value: 'title'
          }, {
            name: '鼠标审计', value: 'mouse'
          }
          // {
          //   name: '缩略图审计', value: 'bitMap'
          // }
          ];
          vm.param.showTab = true;
          // 剪贴板审计
          $axios.get(`/operationLogStat/clipBoard/${row.uuid}`).then((res) => {
            vm.param.clip = res.data;
          });
          // 标题审计
          $axios.get(`/operationLogStat/title/${row.uuid}`).then((res) => {
            vm.param.title = res.data;
          });
          // 鼠标审计
          $axios.get(`/operationLogStat/mouse/${row.uuid}`).then((res) => {
            vm.param.mouse = res.data;
          });
          // 缩略图审计
          $axios.get(`/operationLogStat/bitmap/${row.uuid}`).then((res) => {
            vm.param.bitmap = res.data;
          });
        } else {
          vm.param.showTab = false;
          // vm.param.tabs = ['会话回显', '会话属性'];
          vm.param.tabs = [{
            name: '会话回显', value: 'sessionView'
          }, {
            name: '会话属性', value: 'sessionInfo'
          }];
        }
        if (row.failureReason === 0 && vm.ProtocolNames.indexOf(row.protocolName) > -1) {
          vm.notShowVcr = false;
        } else {
          vm.notShowVcr = true;
        }
      },
      sessionVcr (row) { // 录像回放
        $axios.get(`/operationLogStat/videoReplay/${row.uuid}/session/${row.uuid}`).then((res) => {
          if (res.data.indexOf('ssi') > -1) {
            window.location.href = res.data.substring(8);
          }
        });
      },
      // checkbox是否可以选择
      // selectable(row, index) {
      //   if (row.failureReason === 0 && row.sessionStatus !== '已连接') {
      //     return true
      //   } else {
      //     return false
      //   }
      // },
      // 剪贴板查看详情
      getClip(val) {
        this.bloomClipCheck = true;
        this.clipCheckText = val;
      },
      // 会话审核的查询
      showList() {
        let vm = this;
        let beginTimes = '';
        let endTimes = '';
        if (vm.isSearchPage === 1) {
          beginTimes = vm.dateTime.beginTimes;
          endTimes = vm.dateTime.endTimes;
        } else {
          beginTimes = vm.$refs.selecttime.beginTimes;
          endTimes = vm.$refs.selecttime.endTimes;
        }
        let form = {
          currentPage: vm.operationTable.currentPage,
          pageSize: vm.operationTable.pageSize,
          condition: {
            startTime: beginTimes,
            endTime: endTimes
          }
        };
        $axios.post('/operationLogStat/getIntelligentAudits', form).then((res) => {
          if (res.data.pageList instanceof Array) {
              vm.operationList = res.data.pageList;
              vm.operationTable.totalCount = res.data.totalCount;
          }
        });
      },
      getSelection(selections) {
        this.selections = selections;
        this.sessionUuids = this.selections.map(item => item.uuid)
      },
      nextMonth() {
        let vm = this;
        vm.month.length = 0;
        vm.monthValue = '';
        for (let i = 0; i < vm.time.length; i++) {
          if (vm.time[i].year === vm.yearValue) {
            for (let objMonth in vm.time[i].months) {
              vm.month.push(objMonth);
            }
            vm.monthValue = vm.month[vm.month.length - 1];
          }
        }
        this.nextDay()
      },
      nextDay(val) {
        let vm = this;
        vm.dayValue = '';
        let monthValue = vm.monthValue;
        for (let i = 0; i < vm.time.length; i++) {
          if (vm.time[i].year === vm.yearValue) {
            vm.day = vm.time[i].months[monthValue];
          }
          vm.dayValue = vm.day[vm.day.length - 1];
        }
        if (val === 'autoDay') {
          vm.showList();
        }
      },
      // 重新加载
      reloadPage() {
        if (!this.isSearchPage) {
          let vm = this;
          $axios.get('/operationLogStat/getMonthDayList').then((res) => {
            vm.time = res.data
            vm.year.length = 0
            for (let i = 0; i < vm.time.length; i++) {
              for (let objYear in vm.time[i]) {
                if (objYear === 'year') {
                  // 清空年的selection，否则重复显示
                  vm.year.unshift(vm.time[i][objYear]);
                }
              }
            }
            // 直接显示列表
            vm.yearValue = vm.year[vm.year.length - 1];
            vm.nextMonth();
            vm.nextDay('autoDay');
          });
        }
      },
      // 真分页
      handleSizeChange(curPageSize) {
        this.operationTable.currentPage = 1;
        this.operationTable.pageSize = curPageSize;
        this.showList();
      },
      handleCurrentChange(current) {
        if (current === this.operationTable.currentPage) return;
        this.operationTable.currentPage = current;
        this.showList();
      }
    },
    created() {
      this.reloadPage()
    },
    watch: {
      dataList: function () {
        this.operationList = this.dataList.pageList;
        this.operationTable.totalCount = this.dataList.totalCount;
      },
      show1: function (val) {
        // 重新请求数据加载
        if (val === true) {
          this.reloadPage()
        }
      }
    }
  }
</script>

<style>
  .operationStatistics {
    position: relative;
  }
  .operationStatistics .logWrapHeight {
    max-heigth: 350px;
  }
</style>
