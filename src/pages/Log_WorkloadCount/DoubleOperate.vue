/**
* Created by alex on 2019/3/6.
*/
<template>
  <section class="content logDoubleOperate">
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
        <s-form-item label="运维类型：">
          <s-select v-model="operationTypeUuid" placeholder="请选择类型" clearable>
            <s-option v-for="(item, index) in opsTypeList" :label="item.specialoperTypeName" :value="item.uuid" :key="index"></s-option>
          </s-select>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="showList()">查询</s-button>
      </div>
    </s-form>
    <s-row style="margin: 15px 0 10px">
      <s-button title="EXCEL报表" icon="excel" @click="DownloadHandle('excel')">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="DownloadHandle('word')">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="DownloadHandle('pdf')">PDF报表</s-button>
    </s-row>
    <s-table-page
      :data="orderList"
      :header-search="{show: false}"
      >
      <s-table-column label="组织机构" prop="departName"></s-table-column>
      <s-table-column label="运维人员" prop="userRealName"></s-table-column>
      <s-table-column label="协作人员" prop="doubleAuditName"></s-table-column>
      <s-table-column label="协作类型" prop="specialoperTypeName"></s-table-column>
      <s-table-column label="运维次数" prop="sessionNum"></s-table-column>
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
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  import SelectInstitution from './SelectInstitution'
  // import SelectHost from './SelectHost'

  export default {
    components: {
      // Download,
      SelectInstitution
      // SelectHost
    },
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
        lastHostName: '',
        opsTypeList: [],
        operationTypeUuid: ''
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
      showList() {
        let vm = this;
        $axios.post('/operationWorkStat/getDoubleOperationWorks', {departUuids: vm.institutionUuid, endTime: vm.endTimes, startTime: vm.beginTimes, operationTypeUuid: vm.operationTypeUuid}).then((res) => {
          if (res.data instanceof Array) {
            vm.orderList = res.data;
          }
        });
      },
      DownloadHandle(type) {
        let vm = this;
        $axios.post('/operationWorkStat/makeDoubleOperationWorksFile', {exportType: type, departUuids: vm.institutionUuid, endTime: vm.endTimes, startTime: vm.beginTimes, operationTypeUuid: vm.operationTypeUuid}).then((res) => {
          if (res.data) {
            Download(`/operationWorkStat/downDoubleOperationWorks/${type}`);
          }
        });
      },
      getOpsType() {
        $axios.get('/operationLogStat/getDoubleOperationTypeList').then((res) => {
          this.opsTypeList = res.data
        })
      }
    },
    mounted() {
      this.getOpsType()
      this.showList();
    }
  }
</script>

<style>

</style>
