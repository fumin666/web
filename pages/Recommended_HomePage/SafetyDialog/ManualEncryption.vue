<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 16:29:40
 * @LastEditTime: 2019-09-27 23:26:46
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div >
    <search-box ref="searchBox" :searchAction="search">
      <template slot="leftBtn">
        <s-button icon="export" @click="AccountExport" v-noBtn="'assetsManage_assetAccountpwExport'">资产账号密码导出</s-button>
      </template>
      <template slot="rightBtn">
      </template>
      <template slot="form" >
        <s-form :inline="true">
          <s-form-item label="资产类型">
            <input-tree v-model="searchForm.citypelist" name="uuid" :data="searchOptions" :props="defaultProps" :hasDelIcon="true" @select-change="inputTreeChange"></input-tree>
          </s-form-item>
          <s-form-item label="IP地址">
            <s-input v-model="searchForm.controlAdderss"></s-input>
          </s-form-item>
          <s-form-item label="资产名称">
            <s-input  v-model="searchForm.itcompName"></s-input>
          </s-form-item>
        </s-form>
      </template>
    </search-box>
    <page-infinite-table loading-text="正在加载中" :ajax-obj="axiosHistoryObj" :startAjax="getHistoryFlag" height=450 @selection-change="selectionChange">
        <s-table-column type="selection" width="45" align="center" v-if="isSystemAdmin"></s-table-column>
        <s-table-column label="资产名" prop="itcompName"></s-table-column>
        <s-table-column label="资产IP" prop="controlAdderss"></s-table-column>
        <s-table-column label="一级分类" prop="fristTypeName"></s-table-column>
        <s-table-column label="二级分类" prop="secondTypeName"></s-table-column>
        <s-table-column label="三级分类" prop="threeTypeName"></s-table-column>
        <s-table-column label="型号" prop="productKeyName"></s-table-column>
        <s-table-column label="配置管理员机构" prop="cmdbOrgName"></s-table-column>
        <s-table-column label="配置管理员	" prop="maintenanceStaffName	"></s-table-column>
        <s-table-column label="状态" prop="assetstatusName"></s-table-column>
        <s-table-column label="操作">
          <template slot-scope="scope">
            <i class="iconfont icon-asset-add" @click="rowAccount(scope.row)" title="账号管理" v-noBtn="'assetsManage_omaAccountManage'"></i>
          </template>
        </s-table-column>
      </page-infinite-table>
        <!--账号管理-->
    <s-dialog v-model="accountDialogFlag" v-if="accountDialogFlag" title="账号管理" width="900px">
      <asset-account :addAssetUuid="assetUuid" :isOma="isOma" :curAsset="curAsset" :permission="isConfigAdminCheck(curAsset.monitorItcomp || {})"></asset-account>
    </s-dialog>
  </div>
</template>
<script>
import SearchBox from '@/components/tableCom/src/SearchBox';
import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
import inputTree from '@/components/inputTree/InputTree';
import * as assetListAjax from '../../Assets_AssetList/api/assetList_api'
import assetAccount from '@/pages/Assets_AssetList/AssetAddTabs/AssetAccount'
  import roleCheckMixin from '@/common/mixins/roleCheckMixin';

export default {
    mixins: [roleCheckMixin],
    components: {
      SearchBox,
      pageInfiniteTable,
      inputTree,
      assetAccount
    },
  data() {
    return {
      axiosHistoryObj: {
        type: 'post',
        url: '/omaIndex/getMonitorItcompList',
        params: {
          condition: {

          }
        }
      },
      getHistoryFlag: false,
      searchOptions: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      searchForm: {
        citypelist: [],
        controlAdderss: '',
        itcompName: ''
      },
      assetListAjax: assetListAjax,
      accountDialogFlag: false,
      curAsset: {},
      selections: [],
      isOma: false

    }
  },
  created() {
    // 判断是否是单注册OMA
    if (this.$store.state.userData.registerModelList.length === 1 && this.$store.state.userData.registerModelList[0] === 'OMA') {
      this.isOma = true
    }
        // 获取搜索栏资产类型选项
    this.assetListAjax.getCitypeTree().then(({data}) => {
      this.searchOptions = data;
    });

    this.getList()
  },
  methods: {
   getList() {
      this.getHistoryFlag = true;
      this.axiosHistoryObj.params.condition = Object.assign({}, this.searchForm);
    },
    inputTreeChange(nodeData) {
      this.axiosHistoryObj.params.condition.citypelist = [nodeData.uuid];
      let _VM = this;
      function recursive(nodeData) {
        if (nodeData.childrenList.length > 0) {
          nodeData.childrenList.forEach(item => {
            _VM.axiosHistoryObj.params.condition.citypelist.push(item.uuid);
            if (item.childrenList.length > 0) {
              recursive(item);
            }
          });
        } else {
          _VM.treeForm.citypelist.push(nodeData.uuid);
        }
      }
      recursive(nodeData);
    },
        // 账号管理
    rowAccount(row) {
      this.assetUuid = row.uuid;
      this.curAsset = row;
      this.accountDialogFlag = true
    },
    search() {
      this.getList()
    },
        // 密码导出
    AccountExport(row) {
      if (this.selections.length === 0) {
        this.$message.warning('请至少选择一项要导出账号密码的资产！');
        return;
      }
      let uuids = this.selections.map(item => item.uuid);
      this.$router.push({path: `/AssetsAll/assets_list/assetsAccountExport`, query: {uuids: uuids}})
    },
    selectionChange(selections) {
      this.selections = selections;
    }
  }
}
</script>
<style>
.s-row .s-search-group .s-search-group-wrapper {
    margin: 6px 0;
    overflow:unset!important;
}
</style>
