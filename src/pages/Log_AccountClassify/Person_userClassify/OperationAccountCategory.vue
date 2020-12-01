<template>
 <section>
   <!--t头部的搜索栏-->
   <s-form :inline="true" class="search_form" style="margin: 10px 0;">
     <div>
       <s-form-item label="业务名称：">
         <s-input
           readonly
           v-model="OperationObj.businessAccountNames"
           icon="plus"
           @click.native="showSelect()">
         </s-input>
       </s-form-item>
       <s-form-item label="账号分类：">
         <s-select v-model="OperationObj.businessAccountClassify" placeholder="请选择"  @clear="emptySelect" clearable>
           <s-option  v-for="(item,index) in selectList" :label="item.name" :value="item.value" :key="index"></s-option>
         </s-select>
       </s-form-item>
     </div>
     <div class="search_btn">
       <s-button icon="magnifier" title="查询" @click="getOperationList()">查询</s-button>
     </div>
   </s-form>
   <s-row style="margin:15px 0 10px;">
     <s-button title="EXCEL报表" icon="excel" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
     <s-button title="WORD报表" icon="word" @click="WordDownloadHandle()">WORD报表</s-button>
     <s-button title="PDF报表" icon="pdf" @click="PdfDownloadHandle()">PDF报表</s-button>
   </s-row>
   <!--列表-->
   <s-table-page
     :data="operationList"

     :header-search="{show: false}"

     :hasActionCol = false
     key="assetList">
     <s-table-column label="账号名称" prop="businessAccountName" show-overflow-tooltip></s-table-column>
     <s-table-column label="账号角色" prop="businessRoleNames" show-overflow-tooltip></s-table-column>
     <s-table-column label="状态" prop="businessAccountStatusStr" show-overflow-tooltip></s-table-column>
     <s-table-column label="业务名称" prop="businessSystemName" show-overflow-tooltip></s-table-column>
     <s-table-column
       label="账号分类">
       <template slot-scope="scope">
         <div @click="operationClass(scope.row)" class="ipamColor">
           {{scope.row.businessAccountClassifyStr}}
         </div>
       </template>
     </s-table-column>
   </s-table-page>

   <!--查看资产账号-->
   <s-dialog
     class="addAccountDialog"
     v-model="viewOperationAccountbool"
     v-if="viewOperationAccountbool"
     title="查看资产账号"
     width="800px"
     height="600px"
     key="viewOperationAccountbool">
     <view-business :viewAssetObj="viewOperationObj" @getRepeatUuid="getRepeatUuid"></view-business>
     <template slot="footer" class="dialog-footer">
       <s-button @click="viewOperationAccountbool = false">确定</s-button>
       <s-button type="cancel" @click="viewOperationAccountbool = false">取消</s-button>
     </template>
   </s-dialog>
   <!--查看详情弹出框-->
   <s-dialog
     v-model="detailSeeBool"
     v-if="detailSeeBool"
     title="查看详情"
     width="800px"
     height="350px"
     key="detailSeeBool">
     <detail-see ref="institution" :repeatAssetAccountUuid="repeatAssetAccountUuid"></detail-see>
     <template slot="footer" class="dialog-footer">
       <s-button @click="detailSeeBool = false">确定</s-button>
       <s-button type="cancel" @click="detailSeeBool = false">取消</s-button>
     </template>
   </s-dialog>


   <!--组织机构的弹窗的出现-->
   <s-dialog
     v-model="bloomSelect"
     v-if="bloomSelect"
     title="选择业务名称"
     width="800px"
     key="bloomSelect">
     <business-list-dialog ref="institution" :selectList="businessSelectList" @institutionsUuid="getUuid"></business-list-dialog>
     <template slot="footer" class="dialog-footer">
       <s-button @click="bloomSelect = false">确定</s-button>
       <s-button type="cancel" @click="cancelSelect">取消</s-button>
     </template>
   </s-dialog>

 </section>
</template>
<script>
  import $axios from 'sunflower-ajax'

  // import SelectTree from '@/components/selectTree/SelectTree'
  import ViewBusiness from './ViewBusiness'
  import DetailSee from '../AssetAccount/DetailSee'
  import {Download} from 'sunflower-common-utils'
  import BusinessListDialog from './BusinessListDialog'
  export default{
    components: {

      // SelectTree,
      ViewBusiness,
      BusinessListDialog,
      DetailSee
    },
    data() {
      return {
        OperationObj: {
          businessAccountNames: null,
          businessAccountClassify: 0
        },
        viewOperationAccountbool: false,
        detailSeeBool: false,
        selectList: [],
        operationList: [],
        repeatAssetAccountUuid: [],
        viewOperationObj: [],
        bloomSelect: false,
        businessSelectList: [], // 记录可以选择的业务名称
        lastSelection: [],  // 记录上一次选择的业务名称的下标
        lastInstitutionUuid: [], // 记录上一次选择的业务名称的id
        lastInstitutionName: '', // 记录上一次选择的业务名称
        institutionUuid: [], // 记录业务名称的id
        selection: [] // 业务名称的下标
      }
    },
    created() {
      this.getSelectList();
      this.getOperationList();
    },
    methods: {
      getSelectList() {
        let vm = this;
        $axios.get('/assetAccount/getAssetAccountTypes').then((res) => {
          vm.selectList = res.data;
        });
      },
      getOperationList() {
        let vm = this;
        let params = {
          condition: {
            businessSystemUuids: vm.institutionUuid,
            businessAccountClassify: vm.OperationObj.businessAccountClassify
          }
        }
        $axios.post('/businessAccount/list', params).then((res) => {
          console.log(res.data);
          vm.operationList = res.data || [];
        });
      },
      getRepeatUuid(arr) {
        this.detailSeeBool = true;
        this.repeatAssetAccountUuid = arr;
      },
      operationClass(val) {
        console.log(val);
        this.viewOperationAccountbool = true;
        this.viewOperationObj = {};
        this.viewOperationObj = val;
      },
      ExcelDownloadHandle() {
        let vm = this;
        let params = {
            exportType: 'excel',
            businessSystemUuids: vm.institutionUuid,
            businessAccountClassify: vm.OperationObj.businessAccountClassify
        }
        $axios.post('/businessAccount/export', params).then((res) => {
          if (res.data) {
            Download(`/businessAccount/download/excel`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        let params = {
            exportType: 'word',
            businessSystemUuids: vm.institutionUuid,
            businessAccountClassify: vm.OperationObj.businessAccountClassify
        }
        $axios.post('/businessAccount/export', params).then((res) => {
          if (res.data) {
            Download(`/businessAccount/download/word`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        let params = {
            exportType: 'pdf',
            businessSystemUuids: vm.institutionUuid,
            businessAccountClassify: vm.OperationObj.businessAccountClassify
        }
        $axios.post('/businessAccount/export', params).then((res) => {
          if (res.data) {
            Download(`/businessAccount/download/pdf`);
          }
        });
      },
      emptySelect() {
        this.OperationObj.assetAccountClassify = 0;
      },
    //  关于业务选择
      showSelect(el, row) {
        var vm = this;
        vm.bloomSelect = true;
        $axios.get('/iamBusinessSystem/list').then((res) => {
          vm.businessSelectList = res.data;
          vm.lastSelection = vm.selection;   // 保存上一次的选项，在点击取消按钮时候恢复静this.selection恢复为这个值
          vm.lastInstitutionUuid = vm.institutionUuid;
          vm.lastInstitutionName = vm.OperationObj.businessAccountNames;
          vm.$nextTick(() => {
            vm.selection.forEach(row => {
              vm.$refs.institution.$refs.table.toggleRowSelection(vm.businessSelectList[row], true);
            });
          })
        });
      },
      cancelSelect() {
        let vm = this;
        vm.bloomSelect = false;
        vm.institutionUuid = vm.lastInstitutionUuid;
        vm.OperationObj.businessAccountNames = vm.lastInstitutionName;
        vm.selection = vm.lastSelection;
      },
      getUuid(uuid, name, selection) {
        this.institutionUuid = uuid;
        this.OperationObj.businessAccountNames = name;
        this.selection = selection;
      }
    }
  }
</script>
<style>

</style>
