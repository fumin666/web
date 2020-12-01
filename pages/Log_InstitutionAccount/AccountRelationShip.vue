<template>
  <section class="content accountRelationship">
    <s-form
      :inline="true">
      <s-form-item label="资产类别">
        <select-tree v-model="classValue" :muti="true" @selectMutiTreeChange="nextSelect"></select-tree>
      </s-form-item>
      <s-form-item label="资产名称">
        <s-input v-model="nameValue" icon="plus" readonly @click.native="showSelect"></s-input>
      </s-form-item>
      <s-form-item>
        <s-button title="统计" @click="getList">统计</s-button>
      </s-form-item>
      <s-form-item>
        <s-button title="EXCEL报表" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
      </s-form-item>
      <s-form-item>
        <s-button title="WORD报表" @click="WordDownloadHandle()">WORD报表</s-button>
      </s-form-item>
      <s-form-item>
        <s-button title="PDF报表" @click="PdfDownloadHandle()">PDF报表</s-button>
      </s-form-item>
    </s-form>
    <s-table-page
      :data="assetList"

      :header-search="{show: false}"

      :hasActionCol = false
      key="assetList">
      <s-table-column
        label="资产名称"
        prop="assetName"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        label="资产类别"
        prop="citypeName">
      </s-table-column>
      <s-table-column
        label="资产IP"
        prop="assetIp">
      </s-table-column>
      <s-table-column
        label="账号数">
        <template slot-scope="scope">
          <div
            v-if="scope.row.userCount !== null"
            :class="{'score-td': scope.row.userCount.count}"
            @click="checkAccount(scope.row.userCount.countuuidList)">
            {{scope.row.userCount.count}}
          </div>
          <div v-else>0</div>
        </template>
      </s-table-column>
      <s-table-column
        label="资产账号数">
        <template slot-scope="scope">
          <div
            v-if="scope.row.monitorAccountCount !== null"
            :class="{'score-td': scope.row.monitorAccountCount.count}"
            @click="checkAssetAccount(scope.row.monitorAccountCount.countuuidList)">
            {{scope.row.monitorAccountCount.count}}
          </div>
          <div v-else>0</div>
        </template>
      </s-table-column>
    </s-table-page>
    <s-dialog
      v-model="bloomSelect"
      v-if="bloomSelect"
      title="选择资产"
      key="bloomSelect"
      width="800px">
      <select-asset ref="asset" @getAssetUuid="getIdList" :asset="assets"></select-asset>
      <template slot="footer" class="dialog-footer">
        <s-button @click="bloomSelect = false">确定</s-button>
        <s-button type="cancel" @click="cancelSelect">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="showCheckAccount"
      v-if="showCheckAccount"
      title="查看账号"
      key="showCheckAccount"
      width="800px">
      <check-account ref="check-account" :asseDetailtLists="accountsDetail"></check-account>
    </s-dialog>
    <s-dialog
      v-model="showCheckAssetAccount"
      v-if="showCheckAssetAccount"
      title="查看资产账号"
      key="showCheckAssetAccount"
      width="800px">
      <check-asset-account ref="check-asset-account" :assetAccountsDetail="assetAccountsDetail"></check-asset-account>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import SelectTree from '@/components/selectTree/SelectTree'
  import SelectAsset from './SelectAsset'
  import CheckAccount from './CheckAccount'
  import CheckAssetAccount from './CheckAssetAccount'

  import {Download} from 'sunflower-common-utils'
  // import {batchUuid} from 'sunflower-common-utils'

  export default {
    components: {
      SelectAsset,
      CheckAccount,
      CheckAssetAccount,
      SelectTree

      // Download
    },
    data() {
      return {
        classValue: '22e21df197c64bc6b7c6eacc1ee418eb',
        bloomSelect: false,
        assetList: [],
        classUuid: ['22e21df197c64bc6b7c6eacc1ee418eb'],
        nameValue: '',
        assets: [],
        institutionUuid: [],
        accountsDetail: [],
        assetAccountsDetail: [],
        assetUuid: [],
        selection: [],
        showCheckAccount: false,
        showCheckAssetAccount: false,
        lastSelection: [], // 保存上一次的selection，为实现取消按钮功能
        lastAssetUuid: [],  // 保存上一次的assetUuid，为实现取消按钮功能
        lastNameValue: ''   // 保存上一次的nameValue，为实现取消按钮功能
      }
    },
    props: ['show2'],
    methods: {
      getList() {
        let vm = this;
        $axios.post('/cmdbAssetLog/getUserAccountStat', {itcompTypeUuids: vm.classUuid, itcompUuids: vm.assetUuid}).then((res) => {
          vm.assetList = res.data;
        });
      },
      showSelect() {
        let vm = this;
        vm.bloomSelect = true;
        $axios.post('/monitorStat/asset', vm.classUuid).then((res) => {
          if (res.data instanceof Array) {
            vm.assets = res.data;
            vm.lastSelection = vm.selection;   // 保存上一次的选项，在点击取消按钮时候恢复静this.selection恢复为这个值
            vm.lastAssetUuid = vm.assetUuid;
            vm.lastNameValue = vm.nameValue;
            if (vm.selection.length !== 0) {
              vm.$nextTick(() => {
                vm.selection.forEach(row => {
                  vm.$refs.asset.$refs.assetTable.toggleRowSelection(vm.assets[row], true);
                });
              })
            }
          }
        });
      },
      cancelSelect() {
        let vm = this;
        vm.bloomSelect = false;
        vm.nameValue = vm.lastNameValue;
        vm.assetUuid = vm.lastAssetUuid;
        vm.selection = vm.lastSelection;
      },
      getIdList(val1, val2, val3) {
        this.nameValue = val2;
        this.assetUuid = val1;
        this.selection = val3;
      },
      getUuid(uuid) {
        this.institutionUuid = uuid;
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
      checkAccount(uuidList) {
        var vm = this;
        vm.showCheckAccount = true;
        $axios.post('/iamLog/getIamUserInfoDetailList', uuidList).then((res) => {
          if (res.data instanceof Array) {
            vm.accountsDetail = res.data;
          }
        });
      },
      checkAssetAccount(uuidList) {
        var vm = this;
        vm.showCheckAssetAccount = true;
        $axios.post('/cmdbAssetLog/getAssetAccountList', uuidList).then((res) => {
          if (res.data instanceof Array) {
            vm.assetAccountsDetail = res.data;
          }
        });
      },
      ExcelDownloadHandle() {
        let vm = this;
        $axios.post('/cmdbAssetLog/exportUserAccount', {exportType: 'excel', itcompTypeUuids: vm.classUuid, itcompUuids: vm.assetUuid}).then((res) => {
          if (res.data === 'success') {
            Download(`/cmdbAssetLog/downUserAccount/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        $axios.post('/cmdbAssetLog/exportUserAccount', {exportType: 'pdf', itcompTypeUuids: vm.classUuid, itcompUuids: vm.assetUuid}).then((res) => {
          if (res.data === 'success') {
            Download(`/cmdbAssetLog/downUserAccount/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle () {
        let vm = this;
        $axios.post('/cmdbAssetLog/exportUserAccount', {exportType: 'word', itcompTypeUuids: vm.classUuid, itcompUuids: vm.assetUuid}).then((res) => {
          if (res.data === 'success') {
            Download(`/cmdbAssetLog/downUserAccount/word?t=${new Date().getTime()}`);
          }
        });
      }
    },
    watch: {
      show2: function(val) {
        if (val === true) {
          this.getList();
        }
      }
    }
  }
</script>
