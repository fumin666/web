<!--
 * @Description: In User Settings Edit
 * @Author:
 * @Date: 2019-07-29 13:18:09
 * @LastEditTime : 2019-12-31 23:09:13
 * @LastEditors  : mybells
 -->
<template>
  <!---->
  <section class="operationStatistics">
    <s-form v-if="!isSearchPage" :inline="true" :module="time">
      <select-time ref="selecttime">
        <template slot="serachForm">
          <s-form-item>
            <s-input v-model="sessionNumber" placeholder="请输入运维单号"></s-input>
          </s-form-item>
        </template>
        <template slot="searchBtn">
          <div class="search_btn">
            <s-button title="查询" icon='magnifier' @click="showList">查询</s-button>
          </div>
        </template>
      </select-time>
    </s-form>
    <s-row v-if="!isSearchPage" style="margin:15px 0 10px;">
      <s-button title="批量审核" icon="order" @click="batchReview()">批量审核</s-button>
      <s-button title="EXCEL报表" icon="excel" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="WordDownloadHandle()">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="PdfDownloadHandle()">PDF报表</s-button>
    </s-row>
    <div style="float: right;margin-top: -54px;" v-if="!isSearchPage">
      <!--表格动态列设置弹框-->
      <dynamic-column-set :dynamicData="auditData.sysAuditList" :option="option" @save="saveAuditSetForm" style="display:inline-block">
        <s-button icon="nav-system-set" type="cancel" title="列设置" slot="click"></s-button>
        <s-form ref="form" label-width="280px" slot="otherSetting" :model="auditData.sysAuditSet">
          <s-form-item label="默认排序列" label-width="100px">
            <s-select v-model="auditData.sysAuditSet.orderCol" placeholder="请选择">
              <s-option v-for="item in auditData.sysAuditList" :key="item.id" :label="item.colName" :value="item.colKey"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="排序方式" prop="isAsc" label-width="100px">
            <s-select v-model="auditData.sysAuditSet.orderType" placeholder="请选择">
              <s-option label="降序" :value="0"></s-option>
              <s-option label="升序" :value="1"></s-option>
            </s-select>
          </s-form-item>
        </s-form>
      </dynamic-column-set>
    </div>
    <!--审核页面的动态表头真分页-->
    <div style="float: right; position:absolute;top:-44px;right:0;" v-if = "isSearchPage">
      <s-button title="返回" icon="arrow-left" @click="backTo()">返回</s-button>
    </div>
     <s-table :data="operationList" style="width:100%;" :row-class-name="tableRowClassName" @selection-change="getSelection" actionColWidth="150px"  ref="operationTable">
    <!--<s-table-page :data="operationList" style="width:100%;" :row-class-name="tableRowClassName" @selection-change="getSelection" actionColWidth="150px"  ref="operationTable">-->
      <s-table-column type="selection" width="" :selectable="selectable" v-if="!isSearchPage"></s-table-column>
      <s-table-column  v-for="(item, index) in operationColumnList"  :label="item.colName" :key="index" :prop="item.colKey">
      </s-table-column>
      <s-table-column label="操作" width="200">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" @click="sessionView(scope.row)" title="查看"></i>
          <i class="iconfont icon-download" @click="sessionDownload(scope.row)" title="下载"></i>
          <i class="iconfont icon-vcr" @click="sessionVcr(scope.row)" title="录像回放"></i>
          <i class="iconfont icon-order" @click="sessionOrder(scope.row)" title="审核"></i>
          <i class="iconfont icon-batch-del" @click="sessionBatchDel(scope.row)" title="错误原因"></i>
          <i class="iconfont icon-stop" @click="sessionStop(scope.row)" title="停止运维"></i>
        </template>
      </s-table-column>
    <!--</s-table-page>-->
     </s-table>
    <s-row class="pageRow">
      <s-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="operationTable.currentPage" :page-size="operationTable.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="operationTable.totalCount"></s-pagination>
    </s-row>

    <!--会话回显-->
    <s-dialog v-model="bloomSession" v-if="bloomSession" title="会话回显" key="bloomSession" width="1000px">
      <session-detail ref="sessionDetail" :param="param" :notShowVcr="notShowVcr" @setClip="getClip"></session-detail>
    </s-dialog>
    <!--会话审核和批量会话审核写成一个会导致uuid混乱，审核有bug-->
    <!--会话审核-->
    <s-dialog v-model="bloomAudit" v-if="bloomAudit" title="会话审核" key="bloomAudit">
      <audit-detail ref="auditdetail" :audit="audit" :sessionAuditRemark="sessionAuditRemark"></audit-detail>
      <template slot="footer">
        <s-button @click="save">保存</s-button>
        <s-button @click="bloomAudit = false" type="cancel">取消</s-button>
      </template>
    </s-dialog>
    <!--会话批量审核-->
    <s-dialog v-model="bloomAuditArr" v-if="bloomAuditArr" title="批量审核" key="bloomAuditArr">
      <audit-detail ref="auditdetailArr" :audit="auditArr" :sessionAuditRemark="sessionAuditRemarkArr"></audit-detail>
      <template slot="footer">
        <s-button @click="saveArr">保存</s-button>
        <s-button @click="bloomAuditArr = false" type="cancel">取消</s-button>
      </template>
    </s-dialog>
    <!--会话失败原因-->
    <s-dialog v-model="bloomFailure" v-if="bloomFailure" title="会话失败原因" key="bloomFailure">
      <section class="">
        <s-row>{{this.failureReason}}</s-row>
      </section>
    </s-dialog>
    <!--剪贴板查看详情-->
    <s-dialog v-model="bloomClipCheck" v-if="bloomClipCheck" title="详情" key="bloomClipCheck">
      <section class="">
        <s-row>{{clipCheckText}}</s-row>
      </section>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'

  import SessionDetail from './SessionDetail'
  import AuditDetail from './AuditDetail'
  import SelectTime from '@/components/selectTime/SelectTime.vue'
  import dynamicColumnSet from '@/components/dynamicColumnDialog/DynamicColumnSet.vue'

  export default {
    components: {
      // Download,

      SessionDetail,
      AuditDetail,
      SelectTime,
      dynamicColumnSet
    },
    data() {
      return {
        auditData: {
          sysAuditList: [],
          sysAuditSet: {
            orderCol: '',
            orderType: ''
          }
        },
        option: {
          title: '列显示设置',
          key: 'uuid', // key
          nameKey: 'colName', // 名字key
          showKey: 'status', // 是否显示key
          sortKey: 'order', // 排序key
          width: '300',
          height: '500'
        },
        operationList: [],
        operationTable: {
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        },
        operationColumnList: [],
        yearValue: '',
        monthValue: '',
        dayValue: '',
        year: [],
        month: [],
        day: [],
        sessionNumber: '', // 运维单号
        bloomSession: false,
        bloomAudit: false,
        bloomAuditArr: false,
        uuid: [],       // 会话审核的uuid
        uuidArr: [],   // 批量会话审核的uuid
        time: [],
        audit: '',      // 会话审核弹框的select
        auditArr: '',   // 批量会话审核弹框的select
        sessionAuditRemark: '',  // 会话审核弹框的select
        sessionAuditRemarkArr: '',  // 批量会话审核弹框的select
        bloomFailure: false,
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
        key: 0,
        sessionId: ''
      }
    },
    // 接收显示第二个tab页的内容
    props: ['isSearchPage', 'dateTime', 'dataList', 'columnList', 'show1', 'show2', 'searchForm'],
    methods: {
      // 获取动态列数据
      getAuditForm() {
        $axios.get('/operationSettings/listCheckPage').then((res) => {
          this.auditData = res.data;
        })
      },
      saveAuditSetForm(data) {
        this.auditData.sysAuditList = data;
        let addForm = Object.assign({}, this.auditData)
        $axios.post('/operationSettings/saveCheckPageSet', addForm, {
          logTemplate: '编辑|审核页面设置'
        }).then((res) => {
          if (res.data === true) {
            this.reloadPage();
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.dialogFlag = false;
            this.$emit('refreshColData');
          } else {
            this.$message({
              message: '保存失败',
              type: 'error'
            });
          }
        });
      },
      ExcelDownloadHandle() {
        let vm = this;
        let {beginTimes, endTimes} = vm.$refs.selecttime
        let form = {
          exportType: 'excel',
          startTime: beginTimes,
          endTime: endTimes,
          sessionNumber: vm.sessionNumber
        }
        $axios.post(`/operationLogStat/makeSessionSearchFile`, form).then((res) => {
          if (res.data) {
            Download(`operationLogStat/downSessionSearchFile/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        let {beginTimes, endTimes} = vm.$refs.selecttime;
        let form = {
          exportType: 'pdf',
          startTime: beginTimes,
          endTime: endTimes,
          sessionNumber: vm.sessionNumber
        }
        $axios.post('/operationLogStat/makeSessionSearchFile', form).then((res) => {
          if (res.data) {
            Download(`/operationLogStat/downSessionSearchFile/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        let {beginTimes, endTimes} = vm.$refs.selecttime;
        let form = {
          exportType: 'word',
          startTime: beginTimes,
          endTime: endTimes,
          sessionNumber: vm.sessionNumber
        }
        $axios.post('/operationLogStat/makeSessionSearchFile', form).then((res) => {
          if (res.data) {
            Download(`/operationLogStat/downSessionSearchFile/word?t=${new Date().getTime()}`);
          }
        });
      },
      batchReview () { // 批量审核
        let vm = this;
        if (vm.uuidArr.length === 0) {
          vm.$message('请先选择至少一项！')
        } else {
          vm.bloomAuditArr = true;
        }
      },
      backTo () {
        this.$emit('changeFlag')
      },
      getListActionsDef() {
        let vm = this;
        let def = [];
        let def1 = [{
          name: '批量审核',
          click() {
            if (vm.uuidArr.length === 0) {
              vm.$message('请先选择至少一项！')
            } else {
              vm.bloomAuditArr = true;
            }
          }
        }];
        let def2 = [{
          name: '返回',
          click() {
            vm.$emit('changeFlag')
          }
        }];
        // 判断当前页面是第一个tab页内容还是第二个
        def = vm.isSearchPage ? def2 : def1;
        return {
          width: 2,
          offset: 22,
          def: def
        }
      },
      // 真分页row操作按钮
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
      sessionDownload (row) { // 下载
        let vm = this;
        vm.uuid = row.uuid;
        vm.$confirm('确定要下载该运维日志？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vm.downLog();
        }).catch(() => {});
      },
      sessionVcr (row) { // 录像回放
        $axios.get(`/operationLogStat/videoReplay/${row.uuid}/session/${row.uuid}`).then((res) => {
          if (res.data.indexOf('ssi') > -1) {
            window.location.href = res.data.substring(8);
          }
        });
      },
      sessionOrder (row) { // 审核
        let vm = this;
        vm.bloomAudit = true;
        vm.audit = row.auditResult;
        vm.sessionAuditRemark = row.sessionAuditRemark;
        vm.uuid = [];
        vm.uuid.push(row.uuid);
      },
      sessionBatchDel (row) { // 错误原因
        let vm = this;
        vm.bloomFailure = true;
        vm.failureReason = row.sessionFailureReason;
      },
      sessionStop (row) { // 停止运维
        let vm = this;
        vm.$confirm('确定结束运维?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/operationLogStat/cancelSession/${row.uuid}`).then((res) => {
            if (res.data === 'Success') {
              vm.$message({
                type: 'success',
                message: '结束运维成功!'
              });
              vm.showList()
            } else {
              vm.$message({
                type: 'error',
                message: '结束运维失败!'
              });
            }
          });
        }).catch(() => {});
      },
      getRowActionsDef() {
        let vm = this;
        return [{
          name: '查看',
          icon: 'eye',
          click(row) {
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
              //   {
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
          }
        }, {
          name: '下载',
          icon: 'download',
          click(row) {
            vm.uuid = row.uuid;
            vm.$confirm('确定要下载该运维日志？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              vm.downLog();
            }).catch(() => {});
          }
        }, {
          name: '录像回放',
          icon: 'vcr',
          click(row) {
            $axios.get(`/operationLogStat/videoReplay/${row.uuid}/session/${row.uuid}`).then((res) => {
              if (res.data.indexOf('ssi') > -1) {
                window.location.href = res.data.substring(8);
              }
            });
          }
        }, {
          name: '审核',
          icon: 'order',
          click(row) {
            vm.bloomAudit = true;
            vm.audit = row.auditResult;
            vm.sessionAuditRemark = row.sessionAuditRemark;
            vm.uuid = [];
            vm.uuid.push(row.uuid);
          }
        }, {
          name: '错误原因',
          icon: 'batch-del',
          click(row) {
            vm.bloomFailure = true;
            vm.failureReason = row.sessionFailureReason;
          }
        }, {
          name: '结束运维',
          icon: 'stop',
          click(row) {
            vm.$confirm('确定结束运维?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              $axios.get(`/operationLogStat/cancelSession/${row.uuid}`).then((res) => {
                if (res.data === 'Success') {
                  vm.$message({
                    type: 'success',
                    message: '结束运维成功!'
                  });
                  vm.showList()
                } else {
                  vm.$message({
                    type: 'error',
                    message: '结束运维失败!'
                  });
                }
              });
            }).catch(() => {});
          }
        }]
      },
      tableRowClassName(row) {
        // failureReason为1，则只显示错误信息
        if (row.failureReason === 1) {
          return 'disableAll'  // 错误
        }
        // failureReason不为1，且sessionStatus为已连接，则：
        if (row.failureReason === 0 && row.sessionStatus === '已连接') {
          // 如果是协议，则只有运维结束，否则只有视频和运维结束
          if (this.ProtocolNames.indexOf(row.protocolName) > -1) {
            return 'onlyEndOperation'
          } else {
            return 'endOperation'
          }
          // failureReason不为1，且sessionStatus为已结束，则：
        } else {
          // 如果是VNC，则不显示查看按钮，如果是协议，则不显示视频和下载，但是他们除了结束运维之外的其他按钮都显示
          if (row.protocolName === 'VNC') {
            return 'disableCheck'
          } else if (this.ProtocolNames.indexOf(row.protocolName) > -1) {
            return 'Protocol'
          }
        }
      },
      // checkbox是否可以选择
      selectable(row, index) {
        if (row.failureReason === 0 && row.sessionStatus !== '已连接') {
          return true
        } else {
          return false
        }
      },
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
        let form = {};
        if (vm.isSearchPage === 1) {
          beginTimes = vm.dateTime.beginTimes;
          endTimes = vm.dateTime.endTimes;
          let obj = {
            startTime: beginTimes,
            endTime: endTimes
          };
          let condition = Object.assign({}, vm.searchForm, obj)
          form = {
            currentPage: vm.operationTable.currentPage,
            pageSize: vm.operationTable.pageSize,
            condition: condition
          };
        } else {
          beginTimes = vm.$refs.selecttime.beginTimes;
          endTimes = vm.$refs.selecttime.endTimes;
          form = {
            currentPage: vm.operationTable.currentPage,
            pageSize: vm.operationTable.pageSize,
            condition: {
              startTime: beginTimes,
              endTime: endTimes,
              sessionNumber: vm.sessionNumber
            }
          };
        }
        $axios.post('/operationLogStat/search', form).then((res) => {
          if (res.data.pageList instanceof Array) {
            if (vm.$route.query && vm.$route.query.ip) {
              let curIp = vm.$route.query.ip;
              vm.operationList = res.data.pageList.filter(item => {
                return item.deviceIp === curIp;
              })
            } else if (vm.sessionId) {
              let sessionId = vm.sessionId
              vm.operationList = res.data.pageList.filter(item => {
                return item.sessionId === sessionId;
              })
              vm.operationTable.totalCount = vm.operationList.length;
              // 完成时清空会话ID，不然下次会带着这个条件搜索
              vm.sessionId = ''
            } else {
              vm.operationList = res.data.pageList;
              vm.operationTable.totalCount = res.data.totalCount;
            }
          }
        });
        $axios.get('operationSettings/getShowCheckPage').then((res) => {
          // if (res.data instanceof Array) {
            vm.operationColumnList = res.data;
          // }
        });
      },
      getSelection(val) {
        let vm = this;
        vm.uuidArr.length = 0;
        val.map(item => {
          vm.uuidArr.push(item.uuid);
        });
      },
      // 批量会话审核的保存
      saveArr() {
        let vm = this;
        vm.$refs.auditdetailArr.$refs.ruleForm.validate((valid) => {
          if (valid) {
            vm.bloomAuditArr = false;
            $axios.post('/operationLogStat/check', {auditRemark: vm.$refs.auditdetailArr.auditForm.write, auditResult: Number(vm.$refs.auditdetailArr.auditForm.auditValue), uuids: vm.uuidArr}).then((res) => {
              if (res.data === 'success') {
                this.$message('成功')
                // 根据不同的页面调用不同的查询列表函数
                if (vm.isSearchPage === 1) {
                  vm.$emit('searchPageHandler')
                } else {
                  this.showList();
                }
              } else {
                this.$message('失败')
              }
            });
            this.uuidArr = [];
          } else {
            return false
          }
        })
      },
      // 会话审核的保存
      save() {
        let vm = this;
        vm.$refs.auditdetail.$refs.ruleForm.validate((valid) => {
          if (valid) {
            vm.bloomAudit = false;
            $axios.post('/operationLogStat/check', {auditRemark: vm.$refs.auditdetail.auditForm.write, auditResult: Number(vm.$refs.auditdetail.auditForm.auditValue), uuids: vm.uuid}).then((res) => {
              if (res.data === 'success') {
                this.$message('成功')
                // 根据不同的页面调用不同的查询列表函数
                if (vm.isSearchPage === 1) {
                  vm.$emit('searchPageHandler')
                } else {
                  this.showList();
                }
              } else {
                this.$message('失败')
              }
            });
            this.uuid = [];
          } else {
            return false
          }
        })
      },
      downLog() {
        let vm = this;
        Download(`/operationLogStat/downLog/${vm.uuid}?t=${new Date().getTime()}`);
      },
      // 不清楚uuid会导致点击审核取消后点击批量审核会生效
      closeSession() {
        this.bloomSession = false;
        this.uuid = [];
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
          this.getAuditForm();
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
      this.sessionId = this.$route.query.sessionId;
    },
    watch: {
      dataList: function () {
        this.operationList = this.dataList.pageList;
        this.operationTable.totalCount = this.dataList.totalCount;
        $axios.get('operationSettings/getShowCheckPage').then((res) => {
          // if (res.data instanceof Array) {
          this.operationColumnList = res.data;
          // }
        });
      },
      show1: function (val) {
        // 重新请求数据加载
        if (val === true) {
          this.reloadPage()
        }
      },
      show2: function (val) {
        // 重新请求数据加载
        if (val === true) {
          this.showList()
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
    max-height: 350px;
  }
  .operationStatistics .icon-stop {
    display: none;
  }
  .operationStatistics .icon-batch-del {
    display: none;
  }
  /*VNC: 不显示查看，其他都显示*/
  .operationStatistics .disableCheck .icon-eye {
    display: none;
  }
  /*只显示查看错误信息*/
  .operationStatistics .disableAll .icon-eye,
  .operationStatistics .disableAll .icon-order,
  .operationStatistics .disableAll .icon-vcr,
  .operationStatistics .disableAll .icon-download {
    display: none;
  }
  .operationStatistics .disableAll .icon-batch-del {
    display: inline-block;
  }
  /*只显示结束运维和视频*/
  .operationStatistics .endOperation .icon-stop {
    display: inline-block;
  }
  .operationStatistics .endOperation .icon-eye,
  .operationStatistics .endOperation .icon-order,
  .operationStatistics .endOperation .icon-download {
    display: none;
  }
  /*只显示结束运维*/
  .operationStatistics .onlyEndOperation .icon-stop {
    display: inline-block;
  }
  .operationStatistics .onlyEndOperation .icon-eye,
  .operationStatistics .onlyEndOperation .icon-order,
  .operationStatistics .onlyEndOperation .icon-vcr,
  .operationStatistics .onlyEndOperation .icon-download {
    display: none;
  }
  /*不显示视频,其他都显示*/
  .operationStatistics .Protocol .icon-vcr,
  .operationStatistics .Protocol .icon-download {
    display: none;
  }
</style>
