<template>
  <section class="content logDeviceWork">
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
          <s-date-picker v-model="beginTimes" v-if="bloomYear" type="year" :editable="editable" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getStartTime">
          </s-date-picker>
          <s-date-picker v-model="beginTimes" v-if="bloomMonth" type="month" :editable="editable" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getStartTime">
          </s-date-picker>
          <s-date-picker v-model="beginTimes" v-if="bloomDate" type="date" :editable="editable" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getStartTime">
          </s-date-picker>
        </s-form-item>
        <s-form-item label="结束日期：">
          <s-date-picker v-model="endTimes" v-if="bloomYear" type="year" :editable="editable" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getEndTime">
          </s-date-picker>
          <s-date-picker v-model="endTimes" v-if="bloomMonth" type="month" :editable="editable" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getEndTime">
          </s-date-picker>
          <s-date-picker v-model="endTimes" v-if="bloomDate" type="date" :editable="editable" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getEndTime">
          </s-date-picker>
        </s-form-item>
        <s-form-item label="组织机构：">
          <s-input icon="plus" readonly @click.native="getInstitution"  v-model="institutionName">
          </s-input>
        </s-form-item>
        <s-form-item label="资产：">
          <s-input icon="plus" readonly @click.native="getHost" v-model="hostName">
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
      :data="orderList"

      :header-search="{show: false}"

      >
      <s-table-column label="组织机构" prop="departName"></s-table-column>
      <s-table-column label="资产名称" prop="deviceName"></s-table-column>
      <s-table-column label="资产IP" prop="deviceIp"></s-table-column>
      <s-table-column label="用户数" prop="userCnt"></s-table-column>
      <s-table-column label="账户数" prop="accoutCnt"></s-table-column>
      <s-table-column label="运维次数" prop="sessionNum"></s-table-column>
      <s-table-column label="运维时长" prop="timeLongCountView"></s-table-column>
      <s-table-column label="命令数" prop="cmdNumCount"></s-table-column>
    </s-table-page>
    <!--点击选择机构-->
    <s-dialog
      v-model="bloomSelectInstitution"
      v-if="bloomSelectInstitution"
      title="选择组织机构"
      width="700px"
      key="bloomSelectInstitution">
      <select-institution ref="institution" :List="institutionList" @institutionsUuid="getInstitutionUuid"></select-institution>
      <template slot="footer" class="dialog-footer">
        <s-button @click="bloomSelectInstitution = false">确定</s-button>
        <s-button type="cancel" @click="cancelSelect">取消</s-button>
      </template>
    </s-dialog>
    <!--点击选择资产-->
    <s-dialog
      v-model="bloomSelectHost"
      v-if="bloomSelectHost"
      title="选择资产"
      key="bloomSelectHost"
      width="800px">
      <select-host ref="host" :List="hostList" @usersUuid="getHostUuid"></select-host>
      <template slot="footer" class="dialog-footer">
        <s-button @click="bloomSelectHost = false">确定</s-button>
        <s-button type="cancel" @click="cancelHostSelect">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  import SelectInstitution from './SelectInstitution'
  import SelectHost from './SelectHost'

  export default {
    components: {
      // Download,
      SelectInstitution,
      SelectHost},
    data() {
      return {
        period: '年',
        beginTimes: '',
        endTimes: '',
        bloomYear: true,
        bloomMonth: false,
        bloomDate: false,
        orderList: [],
        bloomSelectInstitution: false,
        institutionList: [],
        institutionUuid: [],
        institutionUuidBackUp: [],  // 备份的institutionUuid，方便对比所选机构是否改变
        institutionName: '',
        bloomSelectHost: false,
        hostList: [],
        hostUuid: [],
        hostName: '',
        selectionHost: [],
        selection: [],
        editable: false,  // 控制时间是否可以编辑
        lastSelection: [], // 保存上一次的selection，为实现取消按钮功能
        lastInstitutionUuid: [],  // 保存上一次的InstitutionUuid，为实现取消按钮功能
        lastInstitutionName: '',   // 保存上一次的lastInstitutionName，为实现取消按钮功能
        lastSelectionHost: [],
        lastHostUuid: [],
        lastHostName: ''
      }
    },
    props: ['show3'],
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
                vm.$refs.institution.$refs.table.toggleRowSelection(vm.institutionList[row], true);
              });
            })
          }
        });
      },
      getInstitutionUuid(val1, val2, val3) {
        this.institutionUuid = val1;
        this.institutionName = val2;
        this.selection = val3;
        // institutionUuidBackUp保存的是上一次选择机构的uuid，如果两次相比不一样，则说明所选机构发生了改变，则将选择人员清空
        if (this.institutionUuidBackUp === [] || JSON.stringify(this.institutionUuidBackUp) !== JSON.stringify(this.institutionUuid)) {
          this.hostUuid = [];
          this.hostName = '';
          this.selectionHost = [];
        }
        this.institutionUuidBackUp = val1
      },
      cancelSelect() {
        let vm = this;
        vm.bloomSelectInstitution = false;
        vm.institutionUuid = vm.lastInstitutionUuid;
        vm.institutionName = vm.lastInstitutionName;
        vm.selection = vm.lastSelection;
      },
      getHost() {
        let vm = this;
        if (vm.institutionUuid.length === 0) {
          vm.$message('请先选择组织机构！')
        } else {
          vm.bloomSelectHost = true;
          $axios.post('/operationWorkStat/getAssetList', vm.institutionUuid).then((res) => {
            vm.hostList = res.data;
            vm.lastSelectionHost = vm.selectionHost;   // 保存上一次的选项，在点击取消按钮时候恢复静this.selection恢复为这个值
            vm.lastHostUuid = vm.hostUuid;
            vm.lastHostName = vm.hostName;
            if (vm.selectionHost.length !== 0) {
              vm.$nextTick(() => {
                vm.selectionHost.forEach(row => {
                  vm.$refs.host.$refs.hostTable.toggleRowSelection(vm.hostList[row], true);
                });
              })
            }
          });
        }
      },
      cancelHostSelect() {
        let vm = this;
        vm.bloomSelectHost = false;
        vm.hostUuid = vm.lastHostUuid;
        vm.hostName = vm.lastHostName;
        vm.selectionHost = vm.lastSelectionHost;
      },
      getHostUuid(val1, val2, val3) {
        this.hostUuid = val1;
        this.hostName = val2;
        this.selectionHost = val3;
      },
      showList() {
        let vm = this;
        $axios.post('/operationWorkStat/devStat', {departUuids: vm.institutionUuid, endTime: vm.endTimes, startTime: vm.beginTimes, devUuids: vm.hostUuid}).then((res) => {
          if (res.data instanceof Array) {
            vm.orderList = res.data;
          }
        });
      },
      ExcelDownloadHandle() {
        let vm = this;
        $axios.post('/operationWorkStat/exportDeviceWoks', {exportType: 'excel', departUuids: vm.institutionUuid, endTime: vm.endTimes, startTime: vm.beginTimes, devUuids: vm.hostUuid}).then((res) => {
          if (res.data === 'success') {
            Download(`/operationWorkStat/downDeviceWoks/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        $axios.post('/operationWorkStat/exportDeviceWoks', {exportType: 'pdf', departUuids: vm.institutionUuid, endTime: vm.endTimes, startTime: vm.beginTimes, devUuids: vm.hostUuid}).then((res) => {
          if (res.data === 'success') {
            Download(`/operationWorkStat/downDeviceWoks/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        $axios.post('/operationWorkStat/exportDeviceWoks', {exportType: 'word', departUuids: vm.institutionUuid, endTime: vm.endTimes, startTime: vm.beginTimes, devUuids: vm.hostUuid}).then((res) => {
          if (res.data === 'success') {
            Download(`/operationWorkStat/downDeviceWoks/word?t=${new Date().getTime()}`);
          }
        });
      }
    },
    watch: {
      show3: function(val) {
        if (val === true) {
          this.showList();
        }
      }
    }
  }
</script>

<style>

</style>
