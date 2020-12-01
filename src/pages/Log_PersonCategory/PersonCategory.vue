<template>
<section class="content assetClass" style="margin-top: 20px;">
  <!--头部的选择框-->
  <s-form :inline="true" class="search_form" style="margin: 5px 0;">
    <div>
      <s-form-item
        label="组织机构：">
        <s-input
          readonly
          v-model="personObj.departUuid"
          icon="plus"
          @click.native="showSelect()">
        </s-input>
      </s-form-item>
    </div>
    <div class="search_btn">
      <s-button icon="magnifier" title="查询" @click="getList()">查询</s-button>
    </div>
  </s-form>
  <s-row style="margin: 15px 0 10px;">
    <s-button title="EXCEL报表" icon="excel" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
    <s-button title="WORD报表" icon="word" @click="WordDownloadHandle()">WORD报表</s-button>
    <s-button title="PDF报表" icon="pdf" @click="PdfDownloadHandle()">PDF报表</s-button>
  </s-row>
  <!--表格的布局以及数据的显示-->
  <s-table-page
    :data="personList"
    :header-search="{show: false}"
    :hasActionCol = false
    key="assetList">
    <s-table-column label="机构名称" prop="orgName"></s-table-column>
    <s-table-column label="内部人员" prop="internalLong" show-overflow-tooltip></s-table-column>
    <s-table-column label="内部临时" prop="internalShort" show-overflow-tooltip></s-table-column>
    <s-table-column label="职能人员" prop="function" show-overflow-tooltip></s-table-column>
    <s-table-column label="应用人员" prop="application" show-overflow-tooltip></s-table-column>
    <s-table-column label="总数" prop="total" show-overflow-tooltip></s-table-column>
  </s-table-page>

  <!--组织机构的弹窗的出现-->
  <s-dialog
    v-model="bloomSelect"
    v-if="bloomSelect"
    title="选择组织机构"
    width="700px"
    key="bloomSelect">
    <organization-selection ref="institution" :selectList="selectList" @institutionsUuid="getUuid"></organization-selection>
    <template slot="footer" class="dialog-footer">
      <s-button @click="bloomSelect = false">确定</s-button>
      <s-button type="cancel" @click="cancelSelect">取消</s-button>
    </template>
  </s-dialog>

</section>
</template>
<script>

  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  import OrganizationSelection from './OrganizationSelection.vue'
  export default{
    components: {

      OrganizationSelection
    },
    data () {
      return {
        personObj: {
          departUuid: null
        },
        selection: [],
        institutionUuid: [],
        personList: [],
        bloomSelect: false,
        selectList: [], // 组织机构的所有数据
        lastSelection: [], // 保存上一次的selection，为实现取消按钮功能
        lastInstitutionUuid: [],  // 保存上一次的InstitutionUuid，为实现取消按钮功能
        lastInstitutionName: ''   // 保存上一次的lastInstitutionName，为实现取消按钮功能
      }
    },
    created() {
      this.getList();
    },
    methods: {
      showSelect(el, row) {
        var vm = this;
        vm.bloomSelect = true;
        $axios.get('departmentInfo/queryAllDepartmentInfo').then((res) => {
          vm.selectList = res.data.departmentList;
          vm.lastSelection = vm.selection;   // 保存上一次的选项，在点击取消按钮时候恢复静this.selection恢复为这个值
          vm.lastInstitutionUuid = vm.institutionUuid;
          vm.lastInstitutionName = vm.personObj.departUuid;
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
        vm.personObj.departUuid = vm.lastInstitutionName;
        vm.selection = vm.lastSelection;
      },
      getUuid(uuid, name, selection) {
        this.institutionUuid = uuid;
        this.personObj.departUuid = name;
        this.selection = selection;
      },
      getList() {
        let vm = this;
        let params = {
          condition: {
            departUuids: vm.institutionUuid
          }
        };
        $axios.post('/userAccount/list', params, {headers: {'Content-Type': 'application/json'}}).then((res) => {
          vm.personList = res.data;
        });
      },
      getOrganitionList() {
        let vm = this;
        $axios.post('departmentInfo/queryAllDepartmentInfo').then((res) => {
          vm.selectList = res.data.departmentList;
        });
      },
      ExcelDownloadHandle() {
        let params = {
          departUuids: this.institutionUuid,
          exportType: 'excel'
        }
        $axios.post('/userAccount/export', params).then((res) => {
          if (res.data) {
            Download(`/userAccount/download/excel`);
          }
        });
      },
      WordDownloadHandle() {
        let params = {
          departUuids: this.institutionUuid,
          exportType: 'word'
        }
        $axios.post('/userAccount/export', params).then((res) => {
          if (res.data) {
            Download(`/userAccount/download/word`);
          }
        });
      },
      PdfDownloadHandle() {
        let params = {
          departUuids: this.institutionUuid,
          exportType: 'pdf'
        }
        $axios.post('/userAccount/export', params).then((res) => {
          if (res.data) {
            Download(`/userAccount/download/pdf`);
          }
        });
      }
    }
  }
</script>
