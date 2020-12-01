<!--
 * @Author: shifeng
 * @Email: shifeng199307@gmail.com
 * @LastEditors  : mybells
 * @LastEditEmail: shifeng199307@gmail.com
 * @Description: 资产账号密码导出管理
 * @Date: 2019-02-28 15:11:21
 * @LastEditTime : 2020-01-21 16:34:23
 -->

<template>
  <div class="account-export">

    <!-- 头部搜索条件框 -->
    <div class="s-search-group">
      <s-form :inline="true" :model="formInline" class="demo-form-inline" style="display:inline-block;vertical-align: middle;">
        <s-form-item label="资产类型">
          <input-tree v-model="formInline.citypeUuid" name="uuid" :data="citypeOptions" :hasDelIcon="true" :props="defaultProps" @select-change="inputTreeChange" @input="handleInput"></input-tree>
        </s-form-item>
        <s-form-item label="IP地址">
          <s-input v-model="formInline.ipAddress" placeholder="请输入IP地址"></s-input>
        </s-form-item>
        <s-form-item label="资产名称">
          <s-input v-model="formInline.itcompName" placeholder="请输入资产名称"></s-input>
        </s-form-item>
        <s-form-item label="账号名称">
          <s-input v-model="formInline.accountName" placeholder="请输入账号名称"></s-input>
        </s-form-item>
      </s-form>
      <s-button @click="search">搜索</s-button>
      <!--<s-button @click="searchClean">重置</s-button>-->
    </div>

    <!-- 顶部按钮 -->
    <s-row class="topRow" style="float:left;margin-bottom:10px">
      <s-button @click="passwordExport" icon="export">密码导出</s-button>
    </s-row>

    <!-- 资产列表 -->
    <s-table-page
      :data="assetsAccountList"
      @selection-change="handleSelectionChange">
      <s-table-column type="selection" />
      <s-table-column label="资产名称" prop="itcompName"></s-table-column>
      <s-table-column label="IP地址" prop="controlAdderss"></s-table-column>
      <s-table-column label="分类一级" prop="fristTypeName"></s-table-column>
      <s-table-column label="分类二级" prop="secondTypeName"></s-table-column>
      <s-table-column label="分类三级" prop="threeTypeName"></s-table-column>
      <s-table-column label="型号" prop="modelNumber"></s-table-column>
      <s-table-column label="账号名称" prop="accountName"></s-table-column>
      <s-table-column label="账号类型" prop="accountTypeName"></s-table-column>
    </s-table-page>

    <!-- 密码导出弹框 -->
    <AccountPasswordExportDialog v-if="accountPasswordExportDialog" v-model="accountPasswordExportDialog" @save="exportOk"></AccountPasswordExportDialog>
  </div>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax';
import inputTree from '@/components/inputTree/InputTree';
import AccountPasswordExportDialog from '../AssetOtherDialog/AccountPasswordExportDialog';
// import {Validaters} from 'sunflower-common-utils';
import {Download} from 'sunflower-common-utils'

export default {
  components: {
    inputTree,
    AccountPasswordExportDialog
  },
  data() {
    return {
      formInline: {
        citypeUuid: '',
        citypeUuidList: [],
        ipAddress: '',
        itcompName: '',
        accountName: ''
      }, // 搜索条件
      citypeOptions: [], // 资产类型下拉列表
      assetsAccountList: [], // 资产账号列表
      selections: [], // 已选列表
      accountPasswordExportDialog: false, // 密码导出弹框
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      paramsTemp: ['citypeUuidList', 'ipAddress', 'itcompName', 'accountName']
    }
  },
  created() {
    // this.getBackupRecList();
    console.log(this.$route.query.uuids);
    this.getCiType(); // 获取资产选择器树；
    this.getList(); // 账户列表
  },
  methods: {
    // 搜索框资产类型下拉树
    getCiType() {
      $axios.get('/resourcemanager/configurationmanage/citype/getCountCitypeTree').then(({data}) => {
        this.citypeOptions = data;
      });
    },
    // 账户列表
    getList() {
      let params = {};
      this.paramsTemp.forEach(item => {
        params[item] = this.formInline[item];
      });
      // delete params.citypeUuid;
      params['itcompUuidList'] = Array.isArray(this.$route.query.uuids) ? this.$route.query.uuids : [this.$route.query.uuids];
      // if (arguments.length !== 0) {
      //   console.log(arguments);
      // }
      $axios.post(`/resourcemanager/assetmanager/itasset/getItcompAndAssetAccountList`, params).then(({data}) => {
        this.assetsAccountList = data;
      })
    },
    // 顶部搜索函数
    search() {
      this.getList();
    },
    searchClean() {
      this.formInline = {
        citypeUuid: '',
        citypeUuidList: [],
        ipAddress: '',
        itcompName: '',
        accountName: ''
      };
      this.getList();
    },
    // 选中账号
    handleSelectionChange(val) {
      this.selections = val;
    },
    // 密码导出弹框的方法
    passwordExport() {
      if (!this.selections || this.selections.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一个账户！'
        })
      } else {
        this.accountPasswordExportDialog = true
      }
    },
    // 导出框确定后的回调函数
    exportOk(password) {
      let params = {};
      params['password'] = password;
      params['accountUuidList'] = this.selections.map(item => item.accountUuid);
      $axios.post('/resourcemanager/assetmanager/itasset/exportItcompAccountFist', params, {
        data: this.selections,
        logTemplate: '账号密码导出|资产(#controlAdderss#/#itcompName#)账号密码(AccountPass)'
      }).then(({data}) => {
        if (data.length !== 0) {
          Download(data[0]);
        }
      });
    },
    inputTreeChange(nodeData) {
      this.formInline.citypeUuidList = [nodeData.uuid];
      let self = this;
      function recursive(nodeData) {
        if (nodeData.childrenList.length > 0) {
          nodeData.childrenList.forEach(item => {
            self.formInline.citypeUuidList.push(item.uuid);
            if (item.childrenList.length > 0) {
              recursive(item);
            }
          });
        } else {
          self.formInline.citypeUuidList.push(nodeData.uuid);
        }
      }
      recursive(nodeData);
    },
    /**
     * 当点击清除按钮时清除citypeUuidList
     */
    handleInput(nodeData) {
      if (!nodeData) {
        this.formInline.citypeUuidList = [];
      }
    }
  }
}
</script>

<style lang="stylus">
.account-export {
  margin: 15px;

  .s-search-group-wrapper {
    overflow: visible;
  }

  .s-search-group {
    margin-bottom: 10px;

    button {
      float: right;
      margin: 9px;
    }
  }
}
</style>
