<!--重点命令集统计-->
<template>
  <section class="content logImportOrder">
    <s-form :inline="true" class="search_form" label-width="80px">
      <div>
        <s-form-item label="日期单位：">
          <s-select v-model="period" @change="showNext">
            <s-option label="年" value="0"></s-option>
            <s-option label="月" value="1"></s-option>
            <s-option label="日" value="2"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="开始日期：">
          <s-date-picker v-model="beginTimes" :editable="editable" v-if="bloomYear" type="year" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getStartTime">
          </s-date-picker>
          <s-date-picker v-model="beginTimes" :editable="editable" v-if="bloomMonth" type="month" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getStartTime">
          </s-date-picker>
          <s-date-picker v-model="beginTimes" :editable="editable" v-if="bloomDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getStartTime">
          </s-date-picker>
        </s-form-item>
        <s-form-item label="结束日期：">
          <s-date-picker v-model="endTimes" :editable="editable" v-if="bloomYear" type="year" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getEndTime">
          </s-date-picker>
          <s-date-picker v-model="endTimes" :editable="editable" v-if="bloomMonth" type="month" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getEndTime">
          </s-date-picker>
          <s-date-picker v-model="endTimes" :editable="editable" v-if="bloomDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getEndTime">
          </s-date-picker>
        </s-form-item>
        <s-form-item label="组织机构：">
          <s-input icon="plus" readonly v-model="institutionName" @click.native="getInstitution">
          </s-input>
        </s-form-item>
        <s-form-item label="人员：">
          <s-input icon="plus" readonly v-model="userName" @click.native="getUser">
          </s-input>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="showList()">查询</s-button>
      </div>
    </s-form>
    <s-row style="margin: 15px 0 10px">
      <s-button title="EXCEL报表" icon="excel" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="WordDownloadHandle()">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="PdfDownloadHandle()">PDF报表</s-button>
    </s-row>
    <s-table-page
      :data="orderList">
      <s-table-column label="命令集" prop="cmdGroup"></s-table-column>
      <s-table-column label="会话数" prop="sessionCnt">
        <template slot-scope="scope">
          <div :class="{'score-td': scope.row.sessionCnt}" @click="showTalkDetail(scope.row.groupUuid)">{{ scope.row.sessionCnt }}</div>
        </template>
      </s-table-column>
    </s-table-page>
    <!--点击会话数-->
    <s-dialog
      v-model="bloomTalkDetail"
      v-if="bloomTalkDetail"
      title="查看会话数"
      key="bloomTalkDetail"
      width="1200px">
      <talk-detail ref="talk-detail" :List="orderDialog" :SessionList='orderDialog2' :downParam="downParam" @getSessionUuid="getCheckUuid"></talk-detail>
    </s-dialog>
    <!--点击机构-->
    <s-dialog
      v-model="bloomSelectInstitution"
      v-if="bloomSelectInstitution"
      title="选择组织机构"
      width="700px"
      key="bloomSelectInstitution"
      :before-close="cancelInstitution">
      <select-institution ref="institution" :List="institutionList" @institutionsUuid="getInstitutionUuid"></select-institution>
      <template slot="footer" class="dialog-footer">
        <s-button @click="bloomSelectInstitution = false">确定</s-button>
        <s-button type="cancel" @click="cancelInstitution">取消</s-button>
      </template>
    </s-dialog>
    <!--点击选择人员-->
    <s-dialog
      v-model="bloomSelectUser"
      v-if="bloomSelectUser"
      title="选择人员"
      key="bloomSelectUser"
      width="900px"
      :before-close="cancelUser">
      <select-user ref="selectUser" :List="userList" @usersUuid="getUserUuid"></select-user>
      <template slot="footer" class="dialog-footer">
        <s-button @click="bloomSelectUser = false">确定</s-button>
        <s-button type="cancel" @click="cancelUser">取消</s-button>
      </template>
    </s-dialog>
    <!--点击显示详情-->
    <s-dialog
      v-model="bloomCheck"
      v-if="bloomCheck"
      title="会话回显"
      key="bloomCheck"
      width="1000px">
      <session-detail ref="checkDetail" :param="param" :notShowVcr="notShowVcr" @setClip="getClip"></session-detail>
    </s-dialog>
    <!--剪贴板查看详情-->
    <s-dialog
      v-model="bloomClipCheck"
      v-if="bloomClipCheck"
      title="详情"
      key="bloomClipCheck">
      <section class="">
        <s-row>{{this.clipCheckText}}</s-row>
      </section>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import TalkDetail from './TalkDetail'
  import SelectInstitution from './SelectInstitution'
  import SelectUser from './SelectUser'
  import {Download} from 'sunflower-common-utils'
  import SessionDetail from '@/pages/Log_OperationStatistics/SessionDetail'
  export default {
    components: {
      TalkDetail,
      SelectInstitution,
      SelectUser,
      // Download,
      SessionDetail
    },
    data() {
      return {
        period: '日',
        beginTimes: '',
        endTimes: '',
        bloomYear: false,
        bloomMonth: false,
        bloomDate: true,
        orderList: [],
        bloomTalkDetail: false,
        bloomSelectInstitution: false,
        institutionList: [],
        institutionUuid: [],
        institutionName: '',
        bloomSelectUser: false,
        userList: [],
        userUuid: [],
        userName: '',
        orderDialog: [],
        orderDialog2: [],
        bloomCheck: false,
        sessionUuid: '',
        editable: false,
        selection: [],
        selectionUser: [],
        bloomClipCheck: false,
        clipCheckText: '',
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
        downParam: {},
        ProtocolNames: ['ORACLE', 'SQL SERVER', 'MySQL', 'DB2', 'INFORMIX', 'Sybase', 'SFTP', 'FTP'], // 不需要显示视频的协议
        notShowVcr: true,  // 一些协议不显示视频（详情页也不显示视频）
        lastSelection: [], // 保存上一次的selection，为实现取消按钮功能
        lastInstitutionUuid: [],  // 保存上一次的InstitutionUuid，为实现取消按钮功能
        lastInstitutionName: '',   // 保存上一次的lastInstitutionName，为实现取消按钮功能
        lastSelectionUser: [], // 保存上一次的lastSelectionUser，为实现取消按钮功能
        lastUserUuid: [],
        lastUserName: ''
      }
    },
    methods: {
      getStartTime(val) {
        let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let endValue = new Date(Date.parse(this.endTimes.replace(/-/g, '/'))).getTime();
        if (beginVal >= endValue) {
          this.beginTimes = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.beginTimes = val;
        }
      },
      getEndTime(val) {
        let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let beginValue = new Date(Date.parse(this.beginTimes.replace(/-/g, '/'))).getTime();
        if (endVal <= beginValue) {
          this.endTimes = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.endTimes = val;
        }
      },
      // 时间选择
      showNext(val) {
        this.beginTimes = '';
        this.endTimes = '';
        switch (val) {
          case '0':
            this.bloomYear = true;
            this.bloomMonth = false;
            this.bloomDate = false;
            break;
          case '1':
            this.bloomMonth = true;
            this.bloomDate = false;
            this.bloomYear = false;
            break;
          case '2':
            this.bloomDate = true;
            this.bloomYear = false;
            this.bloomMonth = false;
            break;
        }
//        this.collectTask.taskPeriod = Number(this.collectTask.taskPeriod);
      },
      // 会话详情
      showTalkDetail(val) {
        var vm = this;
        vm.bloomTalkDetail = true;
        vm.downParam = {departUuids: vm.institutionUuid, endTime: vm.endTimes, groupUuid: val, startTime: vm.beginTimes, userUuids: vm.userUuid}
        $axios.post('/keyCmdStat/keyCmdUser', vm.downParam).then((res) => {
          vm.orderDialog = res.data;
        });
        $axios.post('/keyCmdStat/keyCmdSessionList', vm.downParam).then((res) => {
          vm.orderDialog2 = res.data;
        });
      },
      // 组织机构
      getInstitution() {
        let vm = this;
        vm.bloomSelectInstitution = true;
        $axios.post('/departmentInfo/queryAllDepartmentInfo').then((res) => {
          vm.institutionList = res.data.departmentList;
          vm.lastSelection = vm.selection;   // 保存上一次的选项，在点击取消按钮时候恢复静this.selection恢复为这个值
          vm.lastInstitutionUuid = vm.institutionUuid;
          vm.lastInstitutionName = vm.institutionName;
          if (vm.selection.length !== 0) {
            vm.$nextTick(() => {
              vm.selection.forEach(row => {
                vm.$refs.institution.$refs.table.toggleRowSelection(vm.institutionList[row], true)
              })
            })
          }
        });
      },
      getInstitutionUuid(val1, val2, val3) {
        this.institutionUuid = val1;
        this.institutionName = val2;
        this.selection = val3;
        if (this.selection.length === 0) {
          this.selectionUser = [];
          this.userName = '';
        }
      },
      cancelInstitution() {
        let vm = this;
        vm.bloomSelectInstitution = false;
        vm.institutionUuid = vm.lastInstitutionUuid;
        vm.institutionName = vm.lastInstitutionName;
        vm.selection = vm.lastSelection;
      },
      // 人员
      getUser() {
        let vm = this;
        if (this.institutionName !== '') {
          vm.bloomSelectUser = true;
          $axios.post('/keyCmdStat/getUsers', vm.institutionUuid).then((res) => {
            vm.userList = res.data;
            vm.lastUserUuid = vm.userUuid;
            vm.lastUserName = vm.userName;
            vm.lastSelectionUser = vm.selectionUser;
            if (vm.selectionUser.length !== 0) {
              vm.$nextTick(() => {
                vm.selectionUser.forEach(row => {
                  vm.$refs.selectUser.$refs.table.toggleRowSelection(vm.userList[row], true)
                })
              })
            }
          })
        } else {
          vm.$message('请先选择组织机构！')
        }
      },
      getUserUuid(val1, val2, val3) {
        this.userUuid = val1;
        this.userName = val2;
        this.selectionUser = val3;
      },
      cancelUser() {
        let vm = this;
        vm.bloomSelectUser = false;
        vm.userUuid = vm.lastUserUuid;
        vm.userName = vm.lastUserName;
        vm.selectionUser = vm.lastSelectionUser;
      },
      // 会话回显
      getCheckUuid(row) {
        let vm = this;
        vm.bloomCheck = true;
        vm.param.protocolType = row.protocol_name;
        vm.param.userDetail = [];
        // 会话回显、会话属性
        $axios.get(`/operationLogStat/review/${row.uuid}`).then((res) => {
          vm.param.sessionDetail = res.data;
          vm.param.userDetail.push(res.data.detail);
          vm.param.talkId = res.data.detail.sessionId;
          vm.param.uuid = res.data.detail.uuid;
        });
        let protocol = ['RDP', 'cspsclient', 'easyView', 'smartDashBoard', 'web', 'postgreAdmin', 'mssqlserver', 'plsql', 'radmin', 'sqlyog', 'vmwareVsphereClient5.5', 'mysqlfront', 'nsm', 'toadoracle', 'vmwareVsphereClient5.0', 'vncviewer', 'vmwareVsphereClient6.0', 'xwin']
        if (protocol.indexOf(vm.param.protocolType) > -1) {
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
          }];
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
        } else {
          vm.param.showTab = false;
          // vm.param.tabs = ['会话回显', '会话属性'];
          vm.param.tabs = [{
            name: '会话回显', value: 'sessionView'
          }, {
            name: '会话属性', value: 'sessionInfo'
          }];
        }
        if (vm.ProtocolNames.indexOf(row.protocol_name) > -1) {
          vm.notShowVcr = false;
        } else {
          vm.notShowVcr = true;
        }
      },
      // 剪贴板查看详情
      getClip(val) {
        this.bloomClipCheck = true;
        this.clipCheckText = val;
      },
      // 列表显示
      showList() {
        let vm = this;
        $axios.post('/keyCmdStat/keyCmdSession', {departUuids: vm.institutionUuid, endTime: vm.endTimes, startTime: vm.beginTimes, userUuids: vm.userUuid}).then((res) => {
          if (res.data instanceof Array) {
            vm.orderList = res.data;
          }
        });
      },
      ExcelDownloadHandle() {
        let vm = this;
        $axios.post('/keyCmdStat/exportCmd', {exportType: 'excel', departUuids: vm.institutionUuid, endTime: vm.endTimes, startTime: vm.beginTimes, userUuids: vm.userUuid}).then((res) => {
          if (res.data === 'success') {
            Download(`/keyCmdStat/downCmd/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        $axios.post('/keyCmdStat/exportCmd', {exportType: 'pdf', departUuids: vm.institutionUuid, endTime: vm.endTimes, startTime: vm.beginTimes, userUuids: vm.userUuid}).then((res) => {
          if (res.data === 'success') {
            Download(`/keyCmdStat/downCmd/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        $axios.post('/keyCmdStat/exportCmd', {exportType: 'word', departUuids: vm.institutionUuid, endTime: vm.endTimes, startTime: vm.beginTimes, userUuids: vm.userUuid}).then((res) => {
          if (res.data === 'success') {
            Download(`/keyCmdStat/downCmd/word?t=${new Date().getTime()}`);
          }
        });
      }
    },
    created() {
      this.showList();
    }
  }
</script>
