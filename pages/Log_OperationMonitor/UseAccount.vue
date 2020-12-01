<template>
  <section class="content useAccount" style="margin-top:20px;">
    <s-form :inline="true" class="search_form">
      <div>
        <s-form-item label="资产类别：">
          <select-tree v-model="classValue" :muti="true" @selectMutiTreeChange="nextSelect"></select-tree>
        </s-form-item>
        <s-form-item label="资产名称：">
          <s-input v-model="nameValue" icon="plus" readonly @click.native="showSelect"></s-input>
        </s-form-item>
        <s-form-item label="开始时间：">
          <s-date-picker v-model="beginTimes" :editable="editable" type="datetime" value-format="yyyy-MM-dd HH:mm:SS" format="yyyy-MM-dd HH:mm:SS" @change="getStartTime">
          </s-date-picker>
        </s-form-item>
        <s-form-item label="结束时间：">
          <s-date-picker v-model="endTimes" :editable="editable" type="datetime" value-format="yyyy-MM-dd HH:mm:SS" format="yyyy-MM-dd HH:mm:SS" @change="getEndTime">
          </s-date-picker>
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
    <s-row>
      <s-col :span="12">
        <s-table :data="assetLists.avaStatPer">
          <s-table-column label="可用性" prop="available"></s-table-column>
          <s-table-column label="资产数" prop="assetCnt"></s-table-column>
          <s-table-column label="比例">
            <template slot-scope="scope">{{scope.row.percent}}%</template>
          </s-table-column>
        </s-table>
      </s-col>
      <s-col :span="12">
        <s-chart :chart="chart1" style="left: -140px"></s-chart>
      </s-col>
    </s-row>
    <s-row><span class="title"><i class="iconfont icon-pie-chart"></i>可用率详情</span></s-row>
    <s-table-page
      :data="assetLists.avaStatList"

      :header-search="{show: false}"

      :hasActionCol = false
      key="assetLists">
      <s-table-column label="资产名称" prop="assetName"></s-table-column>
      <s-table-column label="IP地址" prop="ip"></s-table-column>
      <s-table-column label="资产类别" prop="assetType"></s-table-column>
      <s-table-column label="中断次数" prop="crashCnt"></s-table-column>
      <s-table-column label="中断时长">
        <template slot-scope="scope">{{scope.row.crashTime}}</template>
      </s-table-column>
      <s-table-column label="可用性">
        <template slot-scope="scope">{{Number(scope.row.ava).toFixed(2)}}%</template>
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
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'

  import SelectTree from '@/components/selectTree/SelectTree'
  import SelectAsset from './SelectAsset'
  import {Download} from 'sunflower-common-utils'

  export default {
    components: {

      SelectAsset,
      SelectTree
      // Download
    },
    data() {
      return {
        classValue: '',
        nameValue: '',
        beginTimes: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 00:00:00`,
        endTimes: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 23:59:59`,
        classUuid: [],
        assets: [],
        assetUuid: [],
        chart1: {
          name: 'chart',
          type: 'pieChart',
          width: '100%',
          height: '300px',
          data: []
        },
        useRatioList: [],
        assetLists: {},
        selectBloom: false,
        selection: [],
        editable: false,
        lastSelection: [], // 保存上一次的selection，为实现取消按钮功能
        lastAssetUuid: [],  // 保存上一次的lastAssetUuid，为实现取消按钮功能
        lastNameValue: ''   // 保存上一次的lastNameValue，为实现取消按钮功能
      }
    },
    props: ['show1'],
    methods: {
      showSelect() {
        let vm = this;
        if (vm.classUuid.length > 0) {
          vm.selectBloom = true;
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
          })
        } else {
          vm.$message.warning('请先选择资产类别！')
        }
      },
      nextSelect(val) {
        let vm = this;
        vm.classUuid = [];  // 资产类别的uuid
        vm.selection = [];  // 请空弹框的复选框
        vm.assetUuid = [];  // 资产名称uuid
        vm.nameValue = '';
        val.map((item) => {
          vm.classUuid.push(item.uuid)
        });
      },
      show(val) {
        let vm = this;
        if (vm.classUuid.length === 0 && val !== 'first') {
          vm.$message('请至少选择一个类别！')
        } else {
          $axios.post('/monitorStat/avaStat', {
            endTime: vm.endTimes,
            itcompTypeUuids: vm.classUuid,
            itcompUuids: vm.assetUuid,
            startTime: vm.beginTimes
          }).then((res) => {
            vm.assetLists = res.data;
            let list = vm.assetLists.avaStatPer;
            let chart = {data: []};
            for (var i = 0; i < list.length; i++) {
              chart.data[i] = {};
              chart.data[i].name = list[i].available;
              chart.data[i].value = list[i].assetCnt;
            }
            vm.chart1.data = chart.data;
          });
        }
      },
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
      cancelSelect() {
        let vm = this;
        vm.selectBloom = false;
        vm.assetUuid = vm.lastAssetUuid;
        vm.nameValue = vm.lastNameValue;
        vm.selection = vm.lastSelection;
      },
      getIdList(val1, val2, val3) {
        this.nameValue = val2;
        this.assetUuid = val1;
        this.selection = val3;
      },
      ExcelDownloadHandle() {
        let vm = this;
        $axios.post('/monitorStat/exportAva', {exportType: 'excel', endTime: vm.endTimes, itcompTypeUuids: vm.classUuid, itcompUuids: vm.assetUuid, startTime: vm.beginTimes}).then((res) => {
          if (res.data === 'success') {
            Download(`/monitorStat/downAva/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        $axios.post('/monitorStat/exportAva', {exportType: 'pdf', endTime: vm.endTimes, itcompTypeUuids: vm.classUuid, itcompUuids: vm.assetUuid, startTime: vm.beginTimes}).then((res) => {
          if (res.data === 'success') {
            Download(`/monitorStat/downAva/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        $axios.post('/monitorStat/exportAva', {exportType: 'word', endTime: vm.endTimes, itcompTypeUuids: vm.classUuid, itcompUuids: vm.assetUuid, startTime: vm.beginTimes}).then((res) => {
          if (res.data === 'success') {
            Download(`/monitorStat/downAva/word?t=${new Date().getTime()}`);
          }
        });
      }
    },
    created() {
      // false: created时候selectree下拉框还是空，所以添加判断
      this.show('first');
    },
    watch: {
      show1: function(val) {
        if (val === true) {
          this.show('first');
        }
      }
    }
  }
</script>
