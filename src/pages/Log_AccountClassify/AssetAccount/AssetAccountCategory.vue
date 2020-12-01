<template>
  <section class="accountStatistics">
    <!--t头部的搜索栏-->
    <s-form :inline="true" class="search_form" style="margin: 10px 0;">
      <div>
        <s-form-item label="资产类别：">
          <select-tree v-model="classValue" :muti="true"
                       @selectMutiTreeChange="nextSelect">
          </select-tree>
        </s-form-item>
        <s-form-item label="资产名称：">
          <s-input v-model="AssetObj.assetName"></s-input>
        </s-form-item>
        <s-form-item label="IP地址：">
          <s-input v-model="AssetObj.assetIp"></s-input>
        </s-form-item>
        <s-form-item label="账号分类：">
          <s-select v-model="AssetObj.assetAccountClassify" placeholder="请选择" @clear="emptySelect" clearable>
            <s-option  v-for="(item,index) in selectList" :label="item.name" :value="item.value" :key="index"></s-option>
          </s-select>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="getList()">查询</s-button>
      </div>
    </s-form>
    <s-row style="margin:15px 0 10px;">
      <s-button title="EXCEL报表" icon="excel" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="WordDownloadHandle()">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="PdfDownloadHandle()">PDF报表</s-button>
    </s-row>
    <!--列表-->
    <s-table-page
      :data="assetList"

      :header-search="{show: false}"

      :hasActionCol = false
      key="assetList">
      <s-table-column label="账号名称" prop="assetAccountName" show-overflow-tooltip></s-table-column>
      <s-table-column label="账号角色" prop="assetAccountRole" show-overflow-tooltip></s-table-column>
      <s-table-column label="状态" prop="assetAccountStatus" show-overflow-tooltip></s-table-column>
      <s-table-column label="资产类别" prop="assetCitype" show-overflow-tooltip></s-table-column>
      <s-table-column label="资产名称" prop="assetName" show-overflow-tooltip></s-table-column>
      <s-table-column label="IP地址" prop="assetIp" show-overflow-tooltip></s-table-column>
      <s-table-column
        label="账号分类">
        <template slot-scope="scope">
          <div @click="ViewAssetAccount(scope.row)" class="score-td">
            {{scope.row.assetAccountClassify}}
          </div>
        </template>
      </s-table-column>
    </s-table-page>
    <div>
      <!--查看详情弹出框-->
      <s-dialog
        v-model="detailSeeBool"
        v-if="detailSeeBool"
        title="查看详情"
        width="800px"
        height="350px"
        key="detailSeeBool">
        <detail-see ref="institution" :repeatAssetAccountUuid="repeatAssetAccountUuid"></detail-see>
      </s-dialog>
      <!--查看资产账号-->
      <account-view-dialog v-model="accountViewDialogFlag"
                           v-if="accountViewDialogFlag"
                           :assetUuid="assetUuid"
                           :accountClassify="accountClassify"
                           :accountUuid="accountUuid">
      </account-view-dialog>
    </div>
  </section>
</template>
<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'

  import SelectTree from '@/components/selectTree/SelectTree'
  import DetailSee from './DetailSee'
  import accountViewDialog from '@/pages/Assets_AssetList/AssetOtherDialog/AccountViewDialog';
  export default {
    components: {
      SelectTree,
      DetailSee,
      accountViewDialog
    },
    data() {
      return {
        classValue: '',
        detailSeeBool: false,
        accountViewDialogFlag: false,
        repeatAssetAccountUuid: [], // 使用过的重复账号的id
        selectList: [],
        AssetObj: {
          assetName: '',
          assetIp: '',
          assetAccountClassify: 0
        },
        classUuid: [],
        assetList: [],
        assetUuid: '',
        accountUuid: '',
        accountClassify: '' // 账号类型
      }
    },
    created() {
      this.getList();
      this.getSelectList();
    },
    methods: {
      // 清空下拉菜单
      emptySelect() {
        this.AssetObj.assetAccountClassify = 0;
      },
      getSelectList() {
        let vm = this;
        $axios.get('/assetAccount/getAssetAccountTypes').then((res) => {
          vm.selectList = res.data;
        });
      },
      getList() {
        let vm = this;
        let params = {
          condition: {
            assetCitypeUuids: vm.classUuid,
            assetName: vm.AssetObj.assetName,
            assetIp: vm.AssetObj.assetIp,
            assetAccountClassify: vm.AssetObj.assetAccountClassify
          }
        }
        $axios.post('/assetAccount/list', params).then((res) => {
          vm.assetList = res.data;
        });
      },
      ExcelDownloadHandle() {
        let vm = this;
        let params = {
          assetCitypeUuids: vm.classUuid,
          assetName: vm.AssetObj.assetName,
          assetIp: vm.AssetObj.assetIp,
          assetAccountClassify: vm.AssetObj.assetAccountClassify,
          exportType: 'excel'
        }
        $axios.post('/assetAccount/export', params).then((res) => {
          if (res.data) {
            Download(`/assetAccount/download/excel`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        let params = {
          assetCitypeUuids: vm.classUuid,
          assetName: vm.AssetObj.assetName,
          assetIp: vm.AssetObj.assetIp,
          assetAccountClassify: vm.AssetObj.assetAccountClassify,
          exportType: 'word'
        }
        $axios.post('/assetAccount/export', params).then((res) => {
          if (res.data) {
            Download(`/assetAccount/download/word`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        let params = {
          assetCitypeUuids: vm.classUuid,
          assetName: vm.AssetObj.assetName,
          assetIp: vm.AssetObj.assetIp,
          assetAccountClassify: vm.AssetObj.assetAccountClassify,
          exportType: 'pdf'
        }
        $axios.post('/assetAccount/export', params).then((res) => {
          if (res.data) {
            Download(`/assetAccount/download/pdf`);
          }
        });
      },
      // 点击账号分类会出现一个弹框
      ViewAssetAccount(row) {
        this.accountClassify = row.accountClassify;
        this.accountUuid = row.assetAccountUuid;
        this.assetUuid = row.assetUuid;
        this.accountViewDialogFlag = true;
      },
      nextSelect(val) {
        let vm = this;
        vm.classUuid = [];
        vm.selection = [];
        this.nameValue = '';
        val.map((item) => {
          vm.classUuid.push(item.uuid)
        });
      },
      getRepeatUuid(arr) {
        this.detailSeeBool = true;
        this.repeatAssetAccountUuid = arr;
      }
    }
  }
</script>
<style>

</style>
