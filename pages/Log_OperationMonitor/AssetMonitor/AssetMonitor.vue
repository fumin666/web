<template>
  <section class="logAssetMonitor content">
    <s-form :inline="true" class="search_form" style="margin: 10px 0;">
      <div>
        <s-form-item label="资产类别：">
          <select-tree :muti="true" @selectMutiTreeChange="nextSelect"></select-tree>
        </s-form-item>
        <s-form-item label="资产名称：">
          <s-input v-model="nameValue" icon="plus" readonly @click.native="showSelect" :asset="assets"></s-input>
        </s-form-item>
        <s-form-item label="排序方式：">
          <s-select v-model="orderValue">
            <s-option label="逆序" value="desc"></s-option>
            <s-option label="顺序" value="asc"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="TOP N：">
          <s-select v-model="TOPNValue">
            <s-option v-for="n in topArrange" :label="n" :value="n" :key="n"></s-option>
          </s-select>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="show()">查询</s-button>
      </div>
    </s-form>
    <s-row style="margin: 15px 0 10px;">
      <s-button title="EXCEL报表" icon="excel" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="WordDownloadHandle()">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="PdfDownloadHandle()">PDF报表</s-button>
    </s-row>
    <s-table-page
      :data="assetLists"

      :header-search="{show: false}"

      :hasActionCol = false
      key="assetLists">
      <s-table-column label="资产名称" prop="itcompName"></s-table-column>
      <s-table-column label="IP地址" prop="address"></s-table-column>
      <s-table-column label="资产类别" prop="ciTypeName"></s-table-column>
      <s-table-column label="分值">
        <template slot-scope="scope">
          <div class="score-td" @click="showScoreDetail(scope.row.uuid, scope.row.itcompUuid, scope.row.isPingSuccess)">
            {{scope.row.score === null ? '-' : scope.row.score}}
          </div>
        </template>
      </s-table-column>
    </s-table-page>
    <!--选择资产弹窗-->
    <s-dialog
      v-model="selectBloom"
      v-if="selectBloom"
      title="选择资产"
      key="selectBloom"
      width="800px">
      <select-asset ref="asset" @getAssetUuid="getIdList" :asset="assets"></select-asset>
      <template slot="footer" class="dialog-footer">
        <s-button @click="selectBloom = false">确定</s-button>
        <s-button type="cancel" @click="cancelSelect">取消</s-button>
      </template>
    </s-dialog>
    <!--非宕机-->
    <s-dialog
      v-model="notDownTime"
      v-if="notDownTime"
      title="查看结果详情"
      key="notDownTime"
      width="800px">
      <not-down-time ref="not-down-time" :assetMsg="assetMsgs" :minWeigthMsg="minWeigth" :minScoreMsg="minScore" :importCmdbMsg="importCmdb"></not-down-time>
    </s-dialog>
    <!--宕机-->
    <s-dialog
      v-model="downTime"
      v-if="downTime"
      title="查看结果详情"
      key="downTime"
      width="800px">
      <down-time ref="down-time" :assetMsg="assetMsgs"></down-time>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'

  import SelectTree from '@/components/selectTree/SelectTree'
  import SelectAsset from './SelectAsset'
  import DownTime from './DownTime'
  import NotDownTime from './NotDownTime'
  import {Download} from 'sunflower-common-utils'

  export default {
    components: {

      SelectTree,
      SelectAsset,
      DownTime,
      NotDownTime
      // Download
    },
    data() {
      return {
        // classValue: '',
        nameValue: '',
        orderValue: 'desc',
        TOPNValue: '',
        topArrange: [5, 10, 20, 30, 40, 50],
        notDownTime: false,
        downTime: false,
        assetLists: [],
        selectBloom: false,
        assets: [],
        classUuid: [],
        assetUuid: [],
        assetMsgs: {},
        minWeigth: {},
        minScore: {},
        importCmdb: [],
        selection: [],
        lastSelection: [], // 保存上一次的selection，为实现取消按钮功能
        lastAssetUuid: [],  // 保存上一次的InstitutionUuid，为实现取消按钮功能
        lastNameValue: ''   // 保存上一次的lastInstitutionName，为实现取消按钮功能
      }
    },
    methods: {
      showSelect() {
        let vm = this;
        if (vm.classUuid.length > 0) {
          vm.selectBloom = true;
          $axios.post('/monitorStat/asset', vm.classUuid).then((res) => {
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
          })
        } else {
          vm.$message.warning('请先选择资产类别！')
        }
      },
      showScoreDetail(val1, val2, val3) {
        let vm = this;
        $axios.get('/kpi/getCurrentScoreByItcompUuid/' + val2).then((res) => {
          vm.assetMsgs = res.data;
        });
        if (val3 === 0) {
          this.downTime = true;
        } else {
          this.notDownTime = true;
          $axios.get('/kpi/getMinWeigthMiByKpiScoreItcompUuid/' + val1).then((res) => {
            vm.minWeigth = res.data;
          });
          $axios.get('/kpi/getMinScoreMiByKpiScoreItcompUuid/' + val1).then((res) => {
            vm.minScore = res.data;
          });
          $axios.get('/kpi/getKpiScoreMiByKpiScoreItcompUuid/' + val1).then((res) => {
            vm.importCmdb = res.data;
          });
        }
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
      show() {
        let vm = this;
        $axios.post('/assetScoreRanking/list', {citypeUuids: vm.classUuid, itcompUuids: vm.assetUuid, order: vm.orderValue, topN: Number(vm.TOPNValue)}).then((res) => {
          if (res.data instanceof Array) {
            vm.assetLists = res.data;
          }
        });
      },
      cancelSelect() {
        let vm = this;
        vm.selectBloom = false;
        vm.assetUuid = vm.lastAssetUuid;
        vm.nameValue = vm.lastNameValue;
        vm.selection = vm.lastSelection;
      },
      getIdList(val1, val2, val3) {
        this.assetUuid = val1;
        this.nameValue = val2;
        this.selection = val3;
      },
      ExcelDownloadHandle() {
        let vm = this;
        $axios.post('/assetScoreRanking/exportAssetScore', {exportType: 'excel', citypeUuids: vm.classUuid, itcompUuids: vm.assetUuid, order: vm.orderValue, topN: Number(vm.TOPNValue)}).then((res) => {
          if (res.data === 'success') {
            Download(`/assetScoreRanking/downAssetScore/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        $axios.post('/assetScoreRanking/exportAssetScore', {exportType: 'pdf', citypeUuids: vm.classUuid, itcompUuids: vm.assetUuid, order: vm.orderValue, topN: Number(vm.TOPNValue)}).then((res) => {
          if (res.data === 'success') {
            Download(`/assetScoreRanking/downAssetScore/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        $axios.post('/assetScoreRanking/exportAssetScore', {exportType: 'word', citypeUuids: vm.classUuid, itcompUuids: vm.assetUuid, order: vm.orderValue, topN: Number(vm.TOPNValue)}).then((res) => {
          if (res.data === 'success') {
            Download(`/assetScoreRanking/downAssetScore/word?t=${new Date().getTime()}`);
          }
        });
      }
    },
    created() {
      this.show()
    }
  }
</script>
