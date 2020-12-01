<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-01 09:00:26
 * @LastEditTime : 2019-12-27 15:40:32
 * @LastEditors  : mybells
 -->
<template>
  <section class="content logOperationBlock">
    <s-form :inline="true" class="search_form" label-width="80px" style="margin: 10px 0;">
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
          <s-input icon="plus" readonly v-model="departName" @click.native="getInstitution">
          </s-input>
        </s-form-item>
        <s-form-item label="黑名单名称：" label-width="100px">
          <s-select v-model="blackName" multiple @change="getUuid" :collapse-tags='true' clearable>
            <s-option v-for="item in blackList" :label="item.bwName" :value="item.uuid" :key="item.bwName"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="黑名单命令：" label-width="100px" v-if="bloomBlack">
          <s-select v-model="blackOrder" multiple @change="getOrderUuid" :collapse-tags='true' clearable>
            <s-option v-for="item in blackOrderList" :label="item.commandName" :value="item.uuid" :key="item.commandName"></s-option>
          </s-select>
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
      <s-table-column label="命令名称" prop="cmdName"></s-table-column>
      <s-table-column label="用户数" prop="userCnt"></s-table-column>
      <s-table-column label="资产数" prop="hostCnt"></s-table-column>
      <s-table-column label="运维次数" prop="operationCnt"></s-table-column>
      <s-table-column label="阻断次数" prop="blockCnt"></s-table-column>
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
  import SelectInstitution from './SelectInstitution'
  import {Download} from 'sunflower-common-utils'

  export default {
    components: {
      SelectInstitution
      // Download
    },
    data() {
      return {
        period: '2',
        beginTimes: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 00:00:00`,
        endTimes: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 23:59:59`,
        bloomYear: false,
        bloomMonth: false,
        bloomDate: true,
        orderList: [],
        bloomSelectInstitution: false,
        institutionList: [],
        institutionUuid: [],
        blackList: [],
        blackUuid: [],
        blackOrderUuid: [],
        blackName: [],
        blackOrder: [],
        blackOrderList: [],
        bloomBlack: false,
        departName: '',
        selection: [],
        editable: false,
        lastSelection: [], // 保存上一次的selection，为实现取消按钮功能
        lastInstitutionUuid: [],  // 保存上一次的InstitutionUuid，为实现取消按钮功能
        lastDepartName: ''   // 保存上一次的lastDepartName，为实现取消按钮功能
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
      },
      getInstitution() {
        let vm = this;
        vm.bloomSelectInstitution = true;
        $axios.post('/departmentInfo/queryAllDepartmentInfo').then((res) => {
          vm.institutionList = res.data.departmentList;
          vm.lastSelection = vm.selection;   // 保存上一次的选项，在点击取消按钮时候恢复静this.selection恢复为这个值
          vm.lastInstitutionUuid = vm.institutionUuid;
          vm.lastDepartName = vm.departName;
          if (vm.selection.length !== 0) {
            vm.$nextTick(() => {
              vm.selection.forEach(row => {
                vm.$refs.institution.$refs.table.toggleRowSelection(vm.institutionList[row], true);
              });
            })
          }
        });
      },
      cancelSelect() {
        let vm = this;
        vm.bloomSelectInstitution = false;
        vm.institutionUuid = vm.lastInstitutionUuid;
        vm.departName = vm.lastDepartName;
        vm.selection = vm.lastSelection;
      },
      getBlackList() {
        let vm = this;
        $axios.get('/cmdBlockStat/getbwinfos').then((res) => {
          vm.blackList = res.data;
        });
      },
      getInstitutionUuid(val1, val2, val3) {
        this.institutionUuid = val1;
        this.departName = val2;
        this.selection = val3;
      },
      showList() {
        let vm = this;
        $axios.post('/cmdBlockStat/list', {bwCmdUuids: vm.blackOrder, bwFormoUuids: vm.blackName, departUuids: vm.institutionUuid, endTime: vm.endTimes, startTime: vm.beginTimes}).then((res) => {
          vm.orderList = res.data;
        });
      },
      getUuid() {
        let vm = this;
        vm.blackUuid = vm.blackName;
        vm.bloomBlack = true;
        $axios.post('/cmdBlockStat/getcomands', vm.blackUuid).then((res) => {
          vm.blackOrderList = res.data;
          vm.blackOrder = []
        });
      },
      getOrderUuid() {
        let vm = this;
        vm.blackOrderUuid = vm.blackOrder;
      },
      ExcelDownloadHandle() {
        let vm = this;
        $axios.post(`/cmdBlockStat/exportBlock`, {exportType: 'excel', bwCmdUuids: vm.blackOrderUuid, bwFormoUuids: vm.blackUuid, departUuids: vm.institutionUuid, endTime: vm.endTimes, startTime: vm.beginTimes}).then((res) => {
          if (res.data === 'success') {
            Download(`/cmdBlockStat/downBlock/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        $axios.post('/cmdBlockStat/exportBlock', {exportType: 'pdf', bwCmdUuids: vm.blackOrderUuid, bwFormoUuids: vm.blackUuid, departUuids: vm.institutionUuid, endTime: vm.endTimes, startTime: vm.beginTimes}).then((res) => {
          if (res.data === 'success') {
            Download(`/cmdBlockStat/downBlock/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        $axios.post('/cmdBlockStat/exportBlock', {exportType: 'word', bwCmdUuids: vm.blackOrderUuid, bwFormoUuids: vm.blackUuid, departUuids: vm.institutionUuid, endTime: vm.endTimes, startTime: vm.beginTimes}).then((res) => {
          if (res.data === 'success') {
            Download(`/cmdBlockStat/downBlock/word?t=${new Date().getTime()}`);
          }
        });
      }
    },
    created() {
      this.showList();
      this.getBlackList();
    }
  }
</script>
