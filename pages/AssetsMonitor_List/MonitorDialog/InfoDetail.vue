<template>
  <div id="infoDetail">
    <s-tab :animated="false" v-model="activeTab">
      <s-tab-pane label="趋势图">
        <s-row>
          <s-form ref="searchForm" :inline="true" :model="searchForm" label-width="100px" class="search_form">
            <div>
              <s-form-item label="资产类型：" class="sameRow">
                <input-tree v-model="searchForm.deviceTypeId" :url="'/monitorcitype/getCitypeTree'" name="uuid" :data="inputTreeData" :props="defaultProps"
                            @select-change="inputTreeChange"></input-tree>
              </s-form-item>
              <s-form-item label="IP地址：" class="sameRow">
                <s-select v-model="searchForm.ipAddress" value-key="uuid">
                  <s-option :label="option.controlAdderss+'('+option.itcompName+')'" :value="option"
                            v-for="(option,index) in searchOptions.itcomps" :key="index" style="width: 85%;"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label="监控项类型：" class="sameRow">
                <s-select v-model="searchForm.monitorType">
                  <s-option :label="option" :value="index" v-for="(option,index) in searchOptions.monitorTypes"
                            :key="index"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label="监控项名称：" class="sameRow">
                <s-select v-model="searchForm.monitorId">
                  <s-option :label="option.monitorName" :value="option.id + ''"
                            v-for="(option,index) in searchOptions.monitorItems[searchForm.monitorType]"
                            :key="index">
                    <span v-html="option.monitorName"></span>
                  </s-option>
                </s-select>
              </s-form-item>
              <s-form-item>
                <s-select v-model="searchForm.dateSelect" @change="dateSelectChange" >
                  <s-option label="快速选择日期" value="0"></s-option>
                  <s-option label="日" value="1"></s-option>
                  <s-option label="周" value="2"></s-option>
                  <s-option label="月" value="3"></s-option>
                  <s-option label="年" value="4"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item prop="bTime" >
                <s-date-picker
                  v-model="searchForm.bTime"
                  type="datetime"
                  placeholder="选择日期"
                  style="width: 90%;"
                  value-format="yyyy-MM-dd HH:mm:ss"></s-date-picker>
                <span class="timeLink">-</span>
              </s-form-item>
              <s-form-item prop="eTime">
                <s-date-picker
                  v-model="searchForm.eTime"
                  type="datetime"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm:ss"></s-date-picker>
              </s-form-item>
            </div>
            <div class="search_btn">
              <s-button icon="magnifier" @click="trendSearch">查询</s-button>
            </div>
          </s-form>
        </s-row>
        <s-row class="chartBox">
          <span class="title">
            <i class="iconfont icon-line"></i>趋势图
          </span>
          <div v-if="hasTrend === false" v-nodata='true' style="height:300px">
          </div>
          <div v-for="(trend,name,index) in trendCharts" :key="name"  class="trendBox" v-if="hasTrend === true">
            <span class="trendTitle">{{name}}</span>
            <div v-nodata='hasTrend === false' style="height:300px">
              <s-chart :chart="getTrend(trend, index)" class="trendChart"></s-chart>
            </div>
          </div>
        </s-row>
        <s-row>
          <span class="title">
             <i class="iconfont icon-line"></i>历史数据
          </span>
          <page-infinite-table loading-text="正在加载中" :ajax-obj="axiosHistoryObj" :startAjax="getHistoryFlag"
                               ref="infiniteTable" @load-callback="loadCallback">
            <s-table-column v-for="(head,index) in historyTableHead" :key="index" :label="head" :prop="head"
                            show-overflow-tooltip>
              <template slot-scope="scope">
                {{dealNull(scope.row[head])}}
              </template>
            </s-table-column>
          </page-infinite-table>
        </s-row>
      </s-tab-pane>
      <s-tab-pane label="事件" style="max-height: 550px;">
        <s-row>
          <s-col span="12" offset="12">
            <s-input
              placeholder="请输入查询条件"
              icon="magnifier"
              v-model="searchKeyWord"
              @change="filterSearch"></s-input>
          </s-col>
        </s-row>

        <s-table-page :data="transDate">
          <s-table-column prop="level" label="标识" width="70" show-overflow-tooltip>
            <template slot-scope="scope">
              <img :src="filterIncidentImg(scope.row.level)" alt="" class="stateImg">
            </template>
          </s-table-column>
          <s-table-column label="事件" width="70" prop="levelStr" show-overflow-tooltip></s-table-column>
          <s-table-column label="事件摘要" prop="incidentContent" show-overflow-tooltip></s-table-column>
          <s-table-column label="恢复状态" prop="isRecoveryStr" show-overflow-tooltip></s-table-column>
          <s-table-column label="事件状态" v-if="flag" prop="statusStr" show-overflow-tooltip></s-table-column>
          <s-table-column label="创建时间" prop="createTimeStr" show-overflow-tooltip></s-table-column>
          <s-table-column label="更新时间" prop="modifyTimeStr" show-overflow-tooltip></s-table-column>
          <s-table-column label="持续时间" prop="dateRange" show-overflow-tooltip></s-table-column>
          <s-table-column label="资产名称" prop="itcompName" show-overflow-tooltip></s-table-column>
          <s-table-column label="IP地址" prop="controlAdderss" show-overflow-tooltip></s-table-column>
          <s-table-column label="监控项类别" prop="typeStr" show-overflow-tooltip></s-table-column>
          <s-table-column label="监控项名称" prop="miTypeName" show-overflow-tooltip></s-table-column>
          <s-table-column label="资产类型" prop="ciTypeName" show-overflow-tooltip></s-table-column>
          <s-table-column label="事件累计" width="100" prop="count" show-overflow-tooltip></s-table-column>
          <s-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" @click="showMonitorDetail(scope.row, scope.$index)" title="查看"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="规则">
        <s-table-page :data='thresholdList'  style="width: 100%" v-if="activeTab === 2">
          <s-table-column prop="name" label="规则名称" show-overflow-tooltip></s-table-column>
          <s-table-column prop="decription" label="规则描述" show-overflow-tooltip></s-table-column>
          <s-table-column prop="desc" label="规则详情" show-overflow-tooltip></s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>


    <s-dialog
      width="800px"
      v-model="monitorDetailFlag"
      v-if="monitorDetailFlag"
      title="监控事件信息"
      key="monitorDetail">
      <monitor-detail
        ref="monitorDetail"
        :detailData="monitorDetailData">
      </monitor-detail>
    </s-dialog>
  </div>
</template>

<script>
  // import searchBox from '@/components/tableCom/src/SearchBox';
  import inputTree from '@/components/inputTree/InputTree';
  import $axios from 'sunflower-ajax';
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  import monitorDetail from './MonitorDetail.vue'
  import Bus from '@/plugins/eventBus'
  export default {
    data() {
      return {
        value: false,
        firstFlag: true,
        activeTab: 0,
        searchForm: {
          deviceTypeId: '',
          ipAddress: '',
          monitorType: '',
          monitorId: '',
          dateSelect: '0',
          bTime: '',
          eTime: ''
        },
        searchFormRules: {
        },
        inputTreeData: [],
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        searchOptions: {
          itcomps: [],
          monitorTypes: {},
          monitorItems: {}
        },
        trendCharts: {},
        historyTableHead: [],
        axiosHistoryObj: {
          type: 'post',
          url: '/resourcemanager/assetmanage/ciPanel/getHisData',
          params: {
            condition: {}
          }
        },
        getHistoryFlag: false,
        thresholdList: [], // 规则的列表
        monitorListOrigin: [],      // 监控事件列表初始值
        monitorList: [],            // 监控事件列表
        monitorDetailFlag: false,   // 监控事件详情弹框
        searchKeyWord: '',          // 查询关键字
        monitorDetailData: {},      // 监控事件详情数据
        criteria: {                 // 真分页分页数据
          condition: {},
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        },
        flag: false
      }
    },
    computed: {
      comp() {
        return JSON.parse(this.$route.params.comp);
      },
      curMonitor() {
        return JSON.parse(this.$route.params.curMonitorObj);
      },
      transDate() {
        let _self = this;
        if (_self.monitorList && _self.monitorList.length > 0) {
          _self.monitorList.map(function (item) {
            item.createTime = _self.Format(item.createTime, 'yyyy-MM-dd hh:mm:ss');
            item.modifyTime = _self.Format(item.modifyTime, 'yyyy-MM-dd hh:mm:ss');
          });
          return _self.monitorList;
        }
      },
      hasTrend() {
        return Object.keys(this.trendCharts).length > 0;
      }
    },
    created() {
      if (this.$store.state.userData.registerModelList.includes('WORKFLOW') === true) {
        this.flag = true
      }
      this.searchForm.deviceTypeId = this.comp.monitorCitype;
      // 获取搜索栏资产类型选项
      $axios.get('/monitorcitype/getCitypeTree').then(({data}) => {
        this.inputTreeData = data;
      });
    },
    mounted() {
      /* 监听查看事件操作 */
      Bus.$on('monitor-detail', (backData) => {
        this.monitorDetailData = backData;
        this.monitorDetailFlag = true;
      })
    },
    methods: {
      dealNull(val) {
        if (val === undefined || val === null || val.indexOf('null') !== -1 || val.indexOf('--') !== -1) return '--';
        return val;
      },
      inputTreeChange(nodeData) {
        let param = {
          cata: nodeData.name,
          compId: this.$route.params.compId,
          deviceType: nodeData.uuid,
          monitorType: null,
          selectFlag: 'cataFlag',
          monitorCitypeUuid: nodeData.uuid
        };
        this.axiosOptions(param, data => {
          this.searchOptions.itcomps = data.itcomps || [];
          this.searchForm.ipAddress = this.firstFlag ? this.getIpItem(this.comp.uuid, data.itcomps) : (data.itcomps ? data.itcomps[0] : '');
        });
      },
      getIpItem(uuid, arr) {
        return arr.find(item => {
          return item.uuid === uuid;
        });
      },
      ipChange(val) {
        if (!val) return;
        let param = {
          cata: null,
          compId: this.searchForm.ipAddress.uuid,
          deviceType: null,
          deviceTypeId: this.searchForm.deviceTypeId,
          monitorType: null,
          selectFlag: 'compFlag'
        };
        this.axiosOptions(param, data => {
          this.searchOptions.monitorTypes = data.monitorTypes || [];
          this.searchOptions.monitorItems = data.monitorItems || [];
          this.searchForm.monitorType = this.curMonitor.monitorType;
//           this.searchForm.monitorType = this.firstFlag ? this.curMonitor.monitorType : Object.keys(data.monitorTypes || {})[0];
          // 连续切换ip时不会触发monitorTypeChange
//          this.searchForm.monitorId = this.searchOptions.monitorItems[this.searchForm.monitorType][0].id + '';
        });
      },
      monitorTypeChange() {
        if (this.firstFlag) {
          this.searchForm.monitorId = this.curMonitor.monitorId + '';
        } else {
          if (this.searchOptions.monitorItems && Object.keys(this.searchOptions.monitorItems).length > 0) {
            this.searchForm.monitorId = this.searchOptions.monitorItems[this.searchForm.monitorType][0].id + '';
          } else {
            this.searchForm.monitorId = '';
          }
        }
        if (this.firstFlag) {
          this.axiosAll();
          this.firstFlag = false;
        }
      },
      dateSelectChange(val) {
        let _this = this;

        function getDateVal(dayBefore) {
          let now = new Date();
          let newdate = new Date();
          let newtimems = newdate.getTime() - (dayBefore * 24 * 60 * 60 * 1000);
          newdate.setTime(newtimems);
          let clockBefore = CurentTime(newdate);
          let clockNow = CurentTime(now);
          _this.searchForm.bTime = clockBefore;
          _this.searchForm.eTime = clockNow;
        }

        function CurentTime(obj) {
          let year = obj.getFullYear();
          let month = obj.getMonth() + 1;
          let day = obj.getDate();
          let clock = year + '-';
          if (month < 10) {
            clock += '0';
          }
          clock += month + '-';
          if (day < 10) {
            clock += '0';
          }
          clock += day + ' ' + '23:59:59';
          return (clock);
        }

        let dayBefore = 0;
        switch (val) {
          case '0':
            dayBefore = 0;
            break;
          case '1':
            dayBefore = 1;
            break;
          case '2':
            dayBefore = 7;
            break;
          case '3':
            dayBefore = 30;
            break;
          case '4':
            dayBefore = 365;
            break;
        }
        if (dayBefore) {
          getDateVal(dayBefore)
        } else {
          this.searchForm.bTime = '';
          this.searchForm.eTime = '';
        }
      },
      trendSearch() {
        this.$refs.searchForm.validate((valid) => {
          if (valid) {
            this.axiosAll();
            this.$refs.infiniteTable.reInfinite();
          }
        })
      },
      loadCallback(list) {
//        list.forEach(item => {
//          for (let i in item) {
//            if (item[i] === 'null%' || item[i] === 'nullMB') {
//              item[i] = '---'
//            }
//          }
//        });
      },
      getTrend(trend, index) {
        let chartData = trend.cap[0];
        return {
          name: 'trendChart' + index,
          type: 'areaChart',
          width: '100%',
          height: '300px',
          unit: chartData.unit,
          data: chartData.data,
          option: {
            dataZoom: {
              show: true
            }
          }
        }
      },
      axiosOptions(param, callback = function () {}) {
        $axios.post(`/resourcemanager/assetmanage/ciPanel/selectSeachParams`, param).then(({data}) => {
          callback(data);
        });
      },
      axiosAll() {
        if (!this.searchForm.monitorId) {
          this.$message({title: '错误', message: '监控项名称不能为空', type: 'error'});
          return;
        }
        this.axiosChart();
        this.axiosHistoryTableHead();
        this.axiosSetHistoryParam();
        this.axiosThresholdList();
        this.axiosIncidentList();
      },
      axiosChart() { // 获取趋势图chart
        $axios.get(`/resourcemanager/assetmanage/ciPanel/getTrend/${this.searchForm.ipAddress.itcompTemplate}/${this.searchForm.monitorType || undefined}/${this.searchForm.monitorId}/${this.searchForm.dateSelect}/${this.searchForm.bTime || undefined}/${this.searchForm.eTime || undefined}/1`).then(({data}) => {
          this.trendCharts = data;
        });
      },
      axiosHistoryTableHead() { // 获取历史数据表头
        let isCap = this.searchForm.dateSelect !== '0' ? '1' : '0';
        $axios.get(`/resourcemanager/assetmanage/ciPanel/getCiHisDataHeads/${this.searchForm.ipAddress.itcompTemplate}/${this.searchForm.monitorType || undefined}/${isCap}`).then(({data}) => {
          if (this.searchForm.monitorType === 'memory') {
            let monitorName = this.searchOptions.monitorItems[this.searchForm.monitorType].find(item =>
              item.id === this.searchForm.monitorId - 0
            ).monitorName;
            if (monitorName.indexOf('Virtual') !== -1) {
              data = data.filter(item => {
                return item.indexOf('虚拟') !== -1 || item === '创建时间';
              });
            } else if (monitorName.indexOf('Physical') !== -1 || monitorName.indexOf('Real') !== -1) {
              data = data.filter(item => {
                return item.indexOf('物理') !== -1 || item === '创建时间';
              });
            } else if (monitorName.indexOf('Swap') !== -1) {
              data = data.filter(item => {
                return item.indexOf('交换') !== -1 || item === '创建时间';
              });
            }
          }
          this.historyTableHead = data;
        });
      },
      axiosSetHistoryParam() { // 设置历史数据传递的参数，设置后自动触发ajax请求并无限分页
        let condition = {};
        for (let i in this.searchForm) {
          if (this.searchForm[i]) {
            if (i === 'ipAddress') {
              condition.tempName = this.searchForm.ipAddress.itcompTemplate
            } else if (i !== 'deviceTypeId') {
              condition[i] = this.searchForm[i];
            }
          }
        }
        this.axiosHistoryObj.params.condition = Object.assign({}, condition);
        this.getHistoryFlag = true;
      },
//      axiosEventList() {
//        $axios.get(`/resourcemanager/assetmanage/ciPanel/getCiIncident/${this.searchForm.monitorId}`).then(({data}) => {
//          this.eventList = data;
//        });
//      },
      axiosThresholdList() {
        $axios.get(`/resourcemanager/assetmanage/ciPanel/getCiThreshold/${this.searchForm.monitorId}`).then(({data}) => {
          this.thresholdList = data;
        });
      },
      /* 请求事件数据 */
      axiosIncidentList() {
        let param = {
          assetUuid: this.comp.uuid,
          monitorId: this.searchForm.monitorId
        };
        $axios.post('/incidentCount/incidentGroupList', param).then(({data}) => {
          this.monitorListOrigin = data;
          this.monitorList = data;
        });
      },
      filterIncidentImg(val) {
        switch (val) {
          case 0:
            return '../../../static/images/incident/weizhi.png';
          case 1:
            return '../../../static/images/incident/zhengchang.png';
          case 2:
            return '../../../static/images/incident/tishi.png';
          case 3:
            return '../../../static/images/incident/jinggao.png';
          case 4:
            return '../../../static/images/incident/ciyao.png';
          case 5:
            return '../../../static/images/incident/zhuyao.png';
          case 6:
            return '../../../static/images/incident/yanzhong.png';
        }
      },
      Format (strTime, fmt) {
        let newTime = strTime * 1000;
        let date = new Date(newTime);
        let o = {
          'M+': date.getMonth() + 1, // 月份
          'd+': date.getDate(), // 日
          'h+': date.getHours(), // 小时
          'm+': date.getMinutes(), // 分
          's+': date.getSeconds(), // 秒
          'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
          'S': date.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
        return fmt;
      },
      /* 查询 */
      filterSearch() {
        let keyWordReg = new RegExp(this.searchKeyWord);
        let searchResults = [];
        for (let i = 0, length = this.monitorListOrigin.length; i < length; i++) {
          for (let key in this.monitorListOrigin[i]) {
            if (keyWordReg.test(this.monitorListOrigin[i][key])) {
              searchResults.push(this.monitorListOrigin[i]);
              break
            }
          }
        }
        this.monitorList = searchResults;
      },
      /* 查看事件信息 */
      showMonitorDetail(row, index) {
        this.monitorDetailData = row;
        Bus.$emit('monitor-detail', this.monitorDetailData);
      }
    },
    watch: {
      'searchForm.ipAddress': {
        handler(val) {
          this.ipChange(val);
        }
      },
      'searchForm.monitorType': {
        handler(val) {
          this.monitorTypeChange(val);
        }
      },
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    },
    components: {
      // searchBox,
      inputTree,
      pageInfiniteTable,
      monitorDetail
    }
  }
</script>
