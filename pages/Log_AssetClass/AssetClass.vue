<template>
  <section class="content assetClass">
    <s-form :inline="true" class="search_form" style="margin: 5px 0;">
      <div>
        <s-form-item
          label="配置管理员机构：">
          <s-input
            icon="plus"
            readonly
            v-model="institutionName"
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
      :data="assetList"
      :header-search="{show: false}"
      :hasActionCol=false
      class="tableData"
      border>
      <s-table-column
        label="配置管理员机构">
        <s-table-column
          label="机构名称"
          prop="departname"
          show-overflow-tooltip
          width="150"></s-table-column>
      </s-table-column>
      <s-table-column
        label="资产类别"
        v-if="assetList.length > 0">
        <s-table-column
          v-for="(item, index) in assetList[0].categoryCountlist"
          :key="item.name"
          :label="item.name">
          <template slot-scope="scope">
            <div :class="{'score-td': scope.row.categoryCountlist[index].count}"
                 @click="showCategoryDetail(scope.row, index)">{{
              scope.row.categoryCountlist[index].count }}
            </div>
          </template>
        </s-table-column>
      </s-table-column>
      <s-table-column
        label="资产状态"
        v-if="assetList.length > 0">
        <s-table-column
          v-for="(item, index) in assetList[0].assetStatuslist"
          :key="item.name"
          :label="item.name">
          <template slot-scope="scope">
            <div :class="{'score-td': scope.row.assetStatuslist[index].count}"
                 @click="showAssetDetail(scope.row, index)">{{
              scope.row.assetStatuslist[index].count }}
            </div>
          </template>
        </s-table-column>
      </s-table-column>
      <s-table-column
        label="总计">
        <s-table-column
          label="资产总数"
          prop="total"
          width="100">
        </s-table-column>
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
    <s-dialog
      v-model="assetDetail"
      v-if="assetDetail"
      title="查看资产详情"
      key="assetDetail"
      width="800px">
      <asset-detail ref="assetdetail" :asseDetailtLists="numberDetail"></asset-detail>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import SelectInstitution from './SelectInstitution'
  import AssetDetail from './AssetDetail'
  import {Download} from 'sunflower-common-utils'

  // import {batchUuid} from 'sunflower-common-utils'

  export default {
    components: {
      SelectInstitution,
      AssetDetail
      // Download
    },
    data() {
      return {
        bloomSelect: false,
        assetDetail: false,
        assetList: [],
        selectList: [],
        institutionUuid: [],
        numberDetail: [],
        institutionName: '',
        selection: [],
        lastSelection: [], // 保存上一次的selection，为实现取消按钮功能
        lastInstitutionUuid: [],  // 保存上一次的InstitutionUuid，为实现取消按钮功能
        lastInstitutionName: ''   // 保存上一次的lastInstitutionName，为实现取消按钮功能
      }
    },
    methods: {
      getList() {
        let vm = this;
        vm.bloomSelect = false;
        let total = 0
        $axios.post('/cmdbAssetLog/getDepartmentAssetCount', this.institutionUuid).then((res) => {
          if (res.data instanceof Array) {
            vm.assetList = res.data;
            vm.assetList.forEach((item) => {
              item.categoryCountlist.forEach((category) => {
                total += category.count
              })
              item.total = total
              total = 0
            })
          }
        });
      },
      showSelect() {
        var vm = this;
        vm.bloomSelect = true;
        $axios.get('/departmentInfo/queryAllDepartmentInfo').then((res) => {
          vm.selectList = res.data.departmentList;
          vm.lastSelection = vm.selection;   // 保存上一次的选项，在点击取消按钮时候恢复静this.selection恢复为这个值
          vm.lastInstitutionUuid = vm.institutionUuid;
          vm.lastInstitutionName = vm.institutionName;
          if (vm.selection.length !== 0) {
            vm.$nextTick(() => {
              vm.selection.forEach(row => {
                vm.$refs.institution.$refs.table.toggleRowSelection(vm.selectList[row], true);
              });
            })
          }
        });
      },
      showCategoryDetail(row, index) {
        let citypeUuid = row.categoryCountlist[index].countUuid
        let count = row.categoryCountlist[index].count
        if (count !== 0) {
          $axios.get(`/cmdbAssetLog/getAssetInfoByCitypeAndOrg/${row.departuuid}/${citypeUuid}`).then((res) => {
            this.assetDetail = true;
            this.numberDetail = res.data;
          });
        }
      },
      showAssetDetail(row, index) {
        let citypeUuid = row.assetStatuslist[index].countUuid
        let count = row.assetStatuslist[index].count
        if (count !== 0) {
          $axios.get(`/cmdbAssetLog/getAssetInfoByStatusAndOrg/${row.departuuid}/${citypeUuid}`).then((res) => {
            this.assetDetail = true;
            this.numberDetail = res.data;
          });
        }
      },
      getUuid(uuid, name, selection) {
        this.institutionUuid = uuid;
        this.institutionName = name;
        this.selection = selection;
      },
      cancelSelect() {
        let vm = this;
        vm.bloomSelect = false;
        vm.institutionUuid = vm.lastInstitutionUuid;
        vm.institutionName = vm.lastInstitutionName;
        vm.selection = vm.lastSelection;
      },
      ExcelDownloadHandle() {
        let vm = this;
        $axios.post('/cmdbAssetLog/exportAssetType/excel', vm.institutionUuid).then((res) => {
          if (res.data === 'success') {
            Download(`/cmdbAssetLog/downAssetType/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        $axios.post('/cmdbAssetLog/exportAssetType/pdf', vm.institutionUuid).then((res) => {
          if (res.data === 'success') {
            Download(`/cmdbAssetLog/downAssetType/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        $axios.post('/cmdbAssetLog/exportAssetType/word', vm.institutionUuid).then((res) => {
          if (res.data === 'success') {
            Download(`/cmdbAssetLog/downAssetType/word?t=${new Date().getTime()}`);
          }
        });
      }
    },
    created() {
      this.getList();
    }
  }
</script>
