/*
create by YOU
*/
<template>
  <div>
    <s-row class="summary" style="margin-left:5px;margin-right:5px;">
      <s-col span="3" class="left-summary">
        <div class="s-box s-box-vertical">
          <div class="s-box-item" style="width: 100%;border:none;">
            <div class="s-box-item-icon">
              <i class="iconfont" :class="'icon-' + summaryData[0].icon"></i>
            </div>
            <div class="s-box-item-content-wrapper">
              <div class="s-box-item-des">
                <s-dropdown>
                  <a href="javascript:void(0)" style="text-decoration: none">
                    {{summaryData[0].des}}
                    <i class="iconfont icon-bottom-bold"></i>
                  </a>
                  <s-dropdown-menu slot="list">
                    <s-dropdown-item @click.native="runNow">即时执行</s-dropdown-item>
                    <s-dropdown-item @click.native="scanAndMonitor">扫描监控项</s-dropdown-item>
                    <s-dropdown-item @click.native="monitorManage">监控项管理</s-dropdown-item>
                  </s-dropdown-menu>
                </s-dropdown>
              </div>
              <div class="s-box-item-title">{{summaryData[0].title}}</div>
            </div>
          </div>
        </div>
      </s-col>
      <s-col span="21">
        <s-box :data="summaryData.slice(1)" :bars="summaryLayout.slice(1)" type="vertical"></s-box>
      </s-col>
    </s-row>
    <!--扫描以后界面-->
    <s-row v-if="isScan">
      <server-item v-if="renderFlag && ciType.catalogType == 'Host'" :chart-data="chartData" @show-detail-dialog="showDetailDialog"></server-item>
      <switch-item v-else-if="renderFlag && ciType.catalogType == 'netWork'" :chart-data="chartData" @show-detail-dialog="showDetailDialog"></switch-item>
      <s-row class="listArea" style="min-height: 100px;">
        <s-button icon="set" @click="dynamicCol" class="right-float dynamicColSet" v-show="listCurTab==='接口'"></s-button>
        <!--监控项部分-->
        <s-tab v-model="listCurTab">
          <s-tab-pane :label="key" v-for="(tabData, key) in runningTabs" :key="key" :name="key">
            <s-table-page :data='tabData[1]' style="width: 100%;"  v-if="showTable(key)">
              <s-table-column v-for="(tableColumn,index) in tabData[0]" :key="'table' + index"
                              :prop="tableColumn"
                              :label="tableColumn"
                              show-overflow-tooltip
                              v-if="hideColumn(tableColumn, key)">
                <template slot-scope="scope">
                  <i class="chartStatus" :class="{'normal': scope.row['状态']==0,'wrong': scope.row['状态']!=0}"
                     v-if="tableColumn=='状态'"></i>
                  <a class="chartName" @click="showDetailDialog(scope.row)" style="color: #199fed;"
                     v-else-if="tableColumn=='名称'" v-html="scope.row[tableColumn]"></a>
                  <!--<span v-else-if="tableColumn.indexOf('丢包率')!==-1 || tableColumn.indexOf('利用率')!==-1">{{toFixed(scope.row[tableColumn])}}</span>-->
                  <span v-else-if="tableColumn.indexOf('丢包率')!==-1 || tableColumn.indexOf('利用率')!==-1">{{scope.row[tableColumn]}}</span>
                  <span v-else-if="tableColumn=='latched页数'">{{scope.row['latched页数'] || 0}}</span>
                  <s-input style="border-style:none" v-else-if="tableColumn=='备注' && editingMonitorRow.monitorId === scope.row.monitorId"
                           size='small' @blur="remarkBlur" v-model="scope.row[tableColumn]"></s-input>
                  <span v-else-if="tableColumn=='备注' && editingMonitorRow.monitorId !== scope.row.monitorId" @click="remarkClick(scope.row)"
                        style="display:inline-block; min-width: 50px; height:24px">{{scope.row[tableColumn]}}</span>
                  <span v-else>{{scope.row[tableColumn]}}</span>
                </template>
              </s-table-column>
            </s-table-page>
          </s-tab-pane>
        </s-tab>
      </s-row>
    </s-row>
    <!--未扫描界面-->
    <s-row class="noScan" v-else>
      <div class="noScanContent">
       <div class="autoScanImg"></div>
        <s-row>
          <s-button @click="scanAndMonitor" size="large">扫描监控项</s-button>
        </s-row>
        <s-row class="noScanTip">提示：该组件尚未进行扫描，无法显示监控项，请先点击按钮进行扫描操作。</s-row>
      </div>
    </s-row>
    <!--扫描监控项（即时执行、扫描并监控）弹窗-->
    <scan-dialog v-model="scanDialogFlag" v-if="scanDialogFlag" :comp="compUuid" :name-space="nameSpace" :scan-type="scanType" @reload='loadData'></scan-dialog>
    <!--监控项管理弹窗-->
    <manage-dialog v-model="manageDialogFlag" v-if="manageDialogFlag" :itcompTemplate='comp.itcompTemplate' :comp-id="comp.uuid" @reload="loadData" @show-threshold-change="showThresholdChange"></manage-dialog>
    <!--监控项管理-修改规则弹窗 -->
    <threshold-change-dialog v-model="thresholdChangeDialogFlag" v-if="thresholdChangeDialogFlag"
                             :cur-monitor="curMonitor" @show-threshold-add="showThresholdAdd"
                             ref="thresholdChangeDialog"
    ></threshold-change-dialog>
    <!--监控项管理-添加规则弹窗 -->
    <threshold-add-dialog v-model="thresholdAddDialogFlag" v-if="thresholdAddDialogFlag"
                          :cur-monitor="curMonitor" :showed-threshold-data="showedThresholdData"
                          @threshold-add="thresholdAdd"
    ></threshold-add-dialog>
    <!--动态列弹窗-->
    <interface-dy-col-dialog
      v-model="dyColDialogFlag"
      v-if="dyColDialogFlag"
      :all-cols="this.runningTabs['接口']"
      :use-cols="useCols"
      :citype-uuid="comp.citypeUuid"
      @reload="axiosGet_commonList('interface', '接口')">
    </interface-dy-col-dialog>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  import scanDialog from '@/pages/AssetsMonitor_List/MonitorDialog/ScanDialog';
  import manageDialog from '../MonitorDialog/ManageDialog';
  import thresholdChangeDialog from '../MonitorDialog/ThresholdChangeDialog';
  import thresholdAddDialog from '../MonitorDialog/ThresholdAddDialog';
  import serverItem from '../MonitorItem/ServerItem';
  import switchItem from '../MonitorItem/SwitchItem';
  // import monitorDetail from '../MonitorDialog/MonitorDetail';
  import interfaceDyColDialog from '../MonitorDialog/InterfaceDyColDialog';

  export default {
    data() {
      return {
        summaryData: [
          {
            icon: 'screen',
            title: '资产信息',
            des: ''
          },
          {
            icon: 'not-pass',
            title: '当前状态',
            des: ''
          },
          {
            icon: 'event',
            title: '事件数',
            des: ''
          },
          {
            icon: 'clock',
            title: '运行时长',
            des: ''
          },
          {
            icon: 'panel',
            title: '可用率',
            des: ''
          },
          {
            icon: 'scan-address',
            title: 'PING检测状态',
            des: ''
          },
          {
            icon: 'timer',
            title: 'PING响应时间',
            des: ''
          },
          {
            icon: 'frequency',
            title: '监控频率',
            des: ''
          }
        ],
        summaryLayout: [10, 8, 13, 11, 8, 10, 10, 8],
        // infoDetailDialogFlag: false,
        scanDialogFlag: false,
        manageDialogFlag: false,
        dyColDialogFlag: false,
        chartFlag: {
          cpuFlag: false,
          diskFlag: false,
          memoryFlag: false,
          counterFlag: false,
          fanFlag: false,
          powerFlag: false,
          temperFlag: false
        },
        chartData: {
          chartCpuArr: [],
          chartDiskArr: [],
          chartMemoryArr: [],
          chartCountArr: [],
          chartFanArr: [],
          chartPowerArr: [],
          chartTemperArr: []
        },
        runningTabs: {},
        isScan: true,
        monitorItems: null,
        nameSpace: '',
        thresholdChangeDialogFlag: false,
        thresholdAddDialogFlag: false,
        curMonitor: {}, // 当前监控项
        showedThresholdData: {},
        rundata: [],
        editingMonitorRow: {},
        isInput: false,
        listCurTab: '',
        useCols: [],
        compUuid: {}
      }
    },
    props: {
      comp: {
        required: true,
        type: Object
      }
    },
    watch: {
      comp() {
        if (this.comp.uuid) {
          this.loadData();
        }
      }
    },
    mounted() {
      if (this.comp.uuid) {
        this.loadData();
      }
    },
    computed: {
      ciType() {
        let type = this.comp.panelType;
        let obj = {
          catalogType: '',
          filterListHeader: []
        };
        if (type === 'hostsystem') { // 资产系统 > 服务器
          obj.catalogType = 'Host';
          obj.filterListHeader = ['cpu', 'disk', 'memory', 'counter'];
        } else if (type === 'network') { // 网络资产
          obj.catalogType = 'netWork';
          obj.filterListHeader = ['cpu', 'disk', 'memory', 'counter', 'fan', 'power', 'temper'];
        }
        return obj;
      },
      renderFlag() {
        let flag = true;
        if (!this.monitorItems) {
          flag = false;
        } else {
          for (let i in this.monitorItems) {
            if (this.ciType.filterListHeader.join(',').indexOf(i) !== -1) { // 显示成图
              if (!this.chartFlag[i + 'Flag']) {
                flag = false;
              }
            }
          }
        }
        return flag;
      }
    },
    methods: {
      remarkClick(row) {
        if (Object.keys(this.editingMonitorRow).length > 0) {
          this.remarkBlur();
        } else {
          this.editingMonitorRow = row;
        }
      },
      remarkBlur() {
        this.editingMonitorRow['备注'] = this.editingMonitorRow['备注'] || '';
        if (this.editingMonitorRow['备注'].length > 49) {
          this.$message({type: 'warning', message: '长度最多为49!'});
          return;
        }
        let param = {
          monitorId: this.editingMonitorRow.monitorId,
          newVal: this.editingMonitorRow['备注']
        };
        $axios.post('/resourcemanager/assetmanage/assetRuning/editRemark', param).then(({data}) => {
          if (data === true) {
            this.editingMonitorRow = {};
          }
        })
      },
      transStatus(status) {
        switch (status) {
          case 0:
            return '异常';
          case 1:
            return '正常';
          case 2:
            return '告警';
          case 3:
            return '未知';
          default:
            return '正常';
        }
      },
      pingStatus(status) {
        switch (status) {
          case 0:
            return '异常';
          case 1:
            return '正常';
          case 2:
            return '禁ping';
          case 3:
            return '未知';
          default:
            return '正常';
        }
      },
      loadData() {
        $axios.get(`/resourcemanager/assetmanage/assetRuning/checkIsScan/${this.comp.uuid}`).then(({data}) => {
          if (data) {
            this.axiosRunTabAll();
          }
          this.isScan = data;
        });
        this.axiosRunTabCommon();
      },
      axiosRunTabCommon() {
        // 通用运行信息
        $axios.get(`/resourcemanager/assetmanage/assetRuning/getRuningInfo/${this.comp.uuid}`).then(({data}) => {
          $axios.post(`/resourcemanager/assetmanage/assetRuning/getMonitorState/${this.$route.params.assetUuid}`).then(res => {
            if (res.data && res.data instanceof Object) {
              let arr = [
                data.ipAddress, this.transStatus(data.compentStatus), `总计${data.totalIncidentCount} 已恢复${data.recoveryIncidentCount} 已告警${data.alarmIncidentCount}`,
                data.runTime, res.data.ava ? (res.data.ava + '%') : '-', 'PING' + this.pingStatus(data.pingStatus), data.responseTime, `${data.monitorRate}秒`
              ];
              this.summaryData.forEach((item, index) => {
                item.des = arr[index];
              })
            }
          });
        });
      },
      axiosRunTabAll() {
        // 通用列表头信息
        $axios.get(`/resourcemanager/assetmanage/assetRuning/getMonitorItemTypeList/${this.comp.uuid}/${this.comp.itcompTemplate}`).then(({data}) => {
          this.monitorItems = data;
          this.runningTabs = {};
          this.listCurTab = '';
          for (let i in data) {
            if (this.ciType.filterListHeader.join(',').indexOf(i) !== -1) { // 显示成图
              this[`axiosGet_${i}`]();
            } else { // 显示为列表
//              if (data[i] !== '安全认证' && data[i] !== '安全授权') {
                this.axiosGet_commonList(i, data[i]);
//              }
                if (!this.listCurTab) {
                  this.listCurTab = data[i]
                }
            }
          }
        });
      },
      axiosGet_commonList(monitorType, runningTabName) {
        let axiosCommonList = () => {
          $axios.get(`/resourcemanager/assetmanage/assetRuning/getCommonTableDataInfo/${this.comp.uuid}/${monitorType}/${this.comp.itcompTemplate}/${orderFlag}`).then(({data}) => {
            this.runningTabs[runningTabName] = data;
          });
        };
        this.$set(this.runningTabs, runningTabName, []);
        // 通用列表信息
        let orderFlag = monitorType === 'interface' ? 'ASC' : false;
        if (monitorType === 'interface') {
          this.axiosUseCols(axiosCommonList);
        } else {
          axiosCommonList();
        }
      },
      axiosGet_cpu() {
        $axios.get(`/resourcemanager/assetmanage/assetRuning/getCpuInfo/${this.comp.uuid}/${this.ciType.catalogType}`).then(({data}) => {
          this.chartFlag.cpuFlag = true;
          this.chartData.chartCpuArr = data;
        });
      },
      axiosGet_disk() { // 硬盘
        $axios.get(`/resourcemanager/assetmanage/assetRuning/getDiskInfo/${this.comp.uuid}`).then(({data}) => {
          this.chartFlag.diskFlag = true;
          this.chartData.chartDiskArr = data;
        });
      },
      axiosGet_memory() { // 内存
        $axios.get(`/resourcemanager/assetmanage/assetRuning/getMemoryInfo/${this.comp.uuid}/${this.ciType.catalogType}`).then(({data}) => {
          this.chartFlag.memoryFlag = true;
          this.chartData.chartMemoryArr = [data];
        });
      },
      axiosGet_counter() { // 计时器
        $axios.get(`/resourcemanager/assetmanage/assetRuning/getCounterInfo/${this.comp.uuid}/${this.ciType.catalogType}`).then(({data}) => {
          this.chartFlag.counterFlag = true;
          this.chartData.chartCountArr = [data];
        });
      },
      axiosGet_fan() { // 风扇
        $axios.get(`/resourcemanager/assetmanage/assetRuning/getFanInfo/${this.comp.uuid}/${this.ciType.catalogType}`).then(({data}) => {
          this.chartFlag.fanFlag = true;
          this.chartData.chartFanArr = data;
        });
      },
      axiosGet_power() { // 电源
        $axios.get(`/resourcemanager/assetmanage/assetRuning/getPowerInfo/${this.comp.uuid}/${this.ciType.catalogType}`).then(({data}) => {
          this.chartFlag.powerFlag = true;
          this.chartData.chartPowerArr = data;
        });
      },
      axiosGet_temper() { // 温度
        $axios.get(`/resourcemanager/assetmanage/assetRuning/getTemperInfo/${this.comp.uuid}/${this.ciType.catalogType}`).then(({data}) => {
          this.chartFlag.temperFlag = true;
          this.chartData.chartTemperArr = data;
        });
      },
      axiosUseCols(callback = () => {}) { // 获取接口的隐藏列
        $axios.post(`/resourcemanager/assetmanage/assetRuning/getInterfaceTableHide/${this.comp.citypeUuid}`).then(({data}) => {
          if (data instanceof Array) {
            this.useCols = data;
          }
          callback();
        });
      },
      hideColumn(tableColumn, labelName) {
        if (tableColumn === 'monitorId' || tableColumn === 'monitorType' ||
          (labelName === '接口' && this.useCols.indexOf(tableColumn) === -1)) {
          return false;
        }
        return true;
      },
      // 下拉菜单操作
      runNow() {
        this.nameSpace = new Date().getTime() + '_onceMonitor';
        this.scanType = '即时执行';
        this.compUuid = this.comp
        this.scanDialogFlag = true;
      },
      scanAndMonitor() {
        this.nameSpace = new Date().getTime() + '_itemScan';
        this.scanType = '扫描并监控';
        this.scanDialogFlag = true;
        this.compUuid = this.comp
    },
      monitorManage() {
        this.manageDialogFlag = true;
      },
      showDetailDialog(item) {
        this.curMonitorObj = Object.assign({}, item);
        let simpleComp = {
          citypeUuid: this.comp.citypeUuid,
          controlAdderss: this.comp.controlAdderss,
          uuid: this.comp.uuid,
          monitorCitype: this.comp.monitorCitype
        };
        let simpleCurMonitor = {
          monitorId: this.curMonitorObj.monitorId,
          monitorType: this.curMonitorObj.monitorType
        };
        this.$router.push(`/AssetsMonitor/assetsMonitor_list/info/${this.comp.uuid}/InfoDetail/${JSON.stringify(simpleComp)}/${JSON.stringify(simpleCurMonitor)}`);
      },
      showThresholdChange(obj) {
        this.curMonitor = obj;
        this.thresholdChangeDialogFlag = true;
      },
      showThresholdAdd(data) {
        this.thresholdAddDialogFlag = true;
        this.showedThresholdData = data;
      },
      thresholdAdd(obj) {
        this.$refs.thresholdChangeDialog.addThreshold(obj);
      },
      toFixed(val) {
        if (!val || val === '--') return '--';
        let percent = (val + '').split('%')[0];
        return (percent - 0).toFixed(2) + '%';
      },
      dynamicCol() {
        this.dyColDialogFlag = true;
      },
      showTable(key) {
        return key === this.listCurTab;
      }
    },
    components: {
      scanDialog,
      manageDialog,
      thresholdChangeDialog,
      thresholdAddDialog,
      serverItem,
      switchItem,
      // monitorDetail,
      interfaceDyColDialog
    }
  };
</script>
<style lang="stylus">
  // .summaryDataStyle{
  //   .s-box-item-title,.s-box-item-des{
  //     white-space: nowrap !important;
  //     text-overflow: ellipsis;
  //     overflow: hidden;
  //   }
  // }
</style>
