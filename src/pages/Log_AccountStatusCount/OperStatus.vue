<template>
  <section class="content accountStatistics" style="margin-top: 0;">
    <s-form :inline="true" class="search_form" style="margin: 5px 0;">
      <div>
        <s-form-item
          label="组织机构：">
          <s-input
            readonly
            v-model="name"
            icon="plus"
            @click.native="showSelect()">
          </s-input>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="getList()">查询</s-button>
      </div>
    </s-form>
    <s-row style="margin: 15px 0 10px">
      <s-button title="EXCEL报表" icon="excel" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="WordDownloadHandle()">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="PdfDownloadHandle()">PDF报表</s-button>
    </s-row>
    <s-table-page
      :data="accountStatisticsList"

      :header-search="{show: false}"

      :hasActionCol = false
      class="tableData"
      border>
      <s-table-column
        label="机构名称"
        prop="departname"
        width="200"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        label="运维">
        <template slot-scope="scope">
          <div :class="{'score-td': scope.row.operatingcount}" @click="showOperateDetail(1, scope.row.operatingcountuuidList)">{{ scope.row.operatingcount }}</div>
        </template>
      </s-table-column>
      <s-table-column
        label="未运维">
        <template slot-scope="scope">
          <div :class="{'score-td': scope.row.unoperatingcount}" @click="showAccountDetail(scope.row.unoperatingcountuuidList)">{{ scope.row.unoperatingcount }}</div>
        </template>
      </s-table-column>
      <s-table-column
        label="账号总数"
        prop="">
        <template slot-scope="scope">
          <div>{{ scope.row.operTotalCount }}</div>
        </template>
      </s-table-column>
    </s-table-page>
    <s-dialog
      v-model="bloomSelect"
      v-if="bloomSelect"
      title="选择组织机构"
      width="700px"
      key="bloomSelect">
      <select-institution ref="institution" :List="selectList" @institutionsUuid="getUuid"></select-institution>
      <template slot="footer" class="dialog-footer">
        <s-button @click="bloomSelect = false">确定</s-button>
        <s-button type="cancel" @click="cancelSelect">取消</s-button>
      </template>
    </s-dialog>
    <!--其他弹框-->
    <s-dialog
      v-model="accountDetail"
      v-if="accountDetail"
      title="查看账号详情"
      key="accountDetail"
      width="700px">
      <account-detail ref="account-detail" :asseDetailtLists="numberDetail"></account-detail>
    </s-dialog>
    <!--运维弹框-->
    <s-dialog
      v-model="operateDetail"
      v-if="operateDetail"
      title="查看账号详情"
      key="operateDetail"
      width="800px">
      <operate-detail ref="operate-detail" :treeData="treeData"></operate-detail>
    </s-dialog>
    <!--未运维弹框-->
    <s-dialog
      v-model="notOperateDetail"
      v-if="notOperateDetail"
      title="查看账号详情"
      key="notOperateDetail"
      width="800px">
      <not-operate-detail ref="not-operate-detail" :notOperateData="notOperateData"></not-operate-detail>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import SelectInstitution from '../Log_InstitutionAccount/SelectInstitution'
  import AccountDetail from '../Log_InstitutionAccount/AccountDetail'
  import OperateDetail from '../Log_InstitutionAccount/OperateDetail'
  import NotOperateDetail from '../Log_InstitutionAccount/NotOperateDetail.vue'
  import {Download} from 'sunflower-common-utils'

  export default {
    components: {
      SelectInstitution,
      AccountDetail,
      OperateDetail,
      // Download,

      NotOperateDetail
    },
    data() {
      return {
        bloomSelect: false,
        accountDetail: false,
        operateDetail: false,
        notOperateDetail: false,
        accountStatisticsList: [],
        selectList: [],
        institutionUuid: [],
        numberDetail: [],
        name: '',
        selection: [],
        treeData: [], // 运维的树形展示
        notOperateData: [], // 未运维的数据
        lastSelection: [], // 保存上一次的selection，为实现取消按钮功能
        lastInstitutionUuid: [],  // 保存上一次的InstitutionUuid，为实现取消按钮功能
        lastInstitutionName: ''   // 保存上一次的lastInstitutionName，为实现取消按钮功能
      }
    },
    methods: {
      getList() {
        let vm = this;
        let param = {
          depatmentUuidList: vm.institutionUuid,
          status: 'oper'
        };
        vm.bloomSelect = false;
        $axios.post('/iamLog/getDepartmentUserCount', param).then((res) => {
          if (res.data instanceof Array) {
            vm.accountStatisticsList = res.data;
          }
        });
      },
      showSelect(el, row) {
        var vm = this;
        vm.bloomSelect = true;
        $axios.get('departmentInfo/queryAllDepartmentInfo').then((res) => {
          vm.selectList = res.data.departmentList;
          vm.lastSelection = vm.selection;   // 保存上一次的选项，在点击取消按钮时候恢复静this.selection恢复为这个值
          vm.lastInstitutionUuid = vm.institutionUuid;
          vm.lastInstitutionName = vm.name;
          vm.$nextTick(() => {
            vm.selection.forEach(row => {
              vm.$refs.institution.$refs.table.toggleRowSelection(vm.selectList[row], true);
            });
          })
        });
      },
      cancelSelect() {
        let vm = this;
        vm.bloomSelect = false;
        vm.institutionUuid = vm.lastInstitutionUuid;
        vm.name = vm.lastInstitutionName;
        vm.selection = vm.lastSelection;
      },
      showAccountDetail(uuidList) {
        var vm = this;
        if (uuidList.length !== 0) {
          $axios.post('/iamLog/getIamUserInfoDetailList', uuidList).then((res) => {
            vm.accountDetail = true;
            vm.numberDetail = res.data;
          });
        }
      },
      // 点击运维列表弹出框
      showOperateDetail(type, uuidList) {
        var vm = this;
        if (uuidList.length !== 0) {
          $axios.post('/iamLog/getIamUserOperatingDetailList', uuidList).then((res) => {
            if (type === 1) {
              vm.treeData = res.data;
              vm.operateDetail = true;
            }
          });
        }
      },
      getUuid(uuid, name, selection) {
        this.institutionUuid = uuid;
        this.name = name;
        this.selection = selection;
      },
      ExcelDownloadHandle() {
        let param = {
          depatmentUuidList: this.institutionUuid,
          status: 'oper'
        };
        $axios.post('/iamLog/exportAccount/excel', param).then((res) => {
          if (res.data === 'success') {
            Download(`/iamLog/downAccount/oper/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let param = {
          depatmentUuidList: this.institutionUuid,
          status: 'oper'
        };
        $axios.post('/iamLog/exportAccount/pdf', param).then((res) => {
          if (res.data === 'success') {
            Download(`/iamLog/downAccount/oper/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        let param = {
          depatmentUuidList: this.institutionUuid,
          status: 'oper'
        };
        $axios.post('/iamLog/exportAccount/word', param).then((res) => {
          if (res.data === 'success') {
            Download(`/iamLog/downAccount/oper/word?t=${new Date().getTime()}`);
          }
        });
      }
    },
    created() {
      this.getList();
    },
    watch: {
    }
  }
</script>
