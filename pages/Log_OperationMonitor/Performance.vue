<template>
  <div id="infoDetail"  style="width: calc(100%);margin: 20px 0 20px 5px;">
    <s-row>
      <s-form :inline="true" class="search_form" :model="searchForm" label-width="100px">
        <div>
          <s-form-item label="资产类型：" class="sameRow">
            <input-tree v-model="searchForm.deviceTypeId" name="uuid" :data="inputTreeData" :props="defaultProps"
                        @select-change="inputTreeChange"></input-tree>
          </s-form-item>
          <s-form-item label="IP地址：" class="sameRow ip-label">
            <s-select v-model="searchForm.ipAddress" value-key="uuid" filterable>
              <s-option :label="option.controlAdderss+'('+option.itcompName+')'" :value="option"
                        v-for="(option,index) in searchOptions.itcomps" :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="监控项类型：" class="sameRow moniton-input">
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
            <s-select v-model="searchForm.dateSelect" @change="dateSelectChange">
              <s-option label="快速选择日期" value="0"></s-option>
              <s-option label="日" value="1"></s-option>
              <s-option label="周" value="2"></s-option>
              <s-option label="月" value="3"></s-option>
              <s-option label="年" value="4"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item>
            <s-date-picker
              v-model="searchForm.bTime"
              type="datetime"
              placeholder="选择日期"
              :picker-options="disableAfterToday1"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="getStartTime"></s-date-picker>
            <span class="timeLink">-</span>
          </s-form-item>
          <s-form-item>
            <s-date-picker
              v-model="searchForm.eTime"
              type="datetime"
              placeholder="选择日期"
              :picker-options="disableAfterToday2"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="getEndTime"></s-date-picker>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" title="查询" @click="trendSearch()">查询</s-button>
        </div>
      </s-form>
    </s-row>
    <s-row class="chartBox">
          <span class="title">
            <i class="iconfont icon-line"></i>趋势图
          </span>
      <div v-for="(trend,name,index) in trendCharts" :key="name" class="trendBox" v-if="hasTrend == true">
        <span class="trendTitle">{{name}}</span>
        <s-chart :chart="getTrend(trend, index)" class="trendChart" style="width:100%"></s-chart>
      </div>
      <div class="noData" v-if="hasTrend == false">暂无数据</div>
    </s-row>
    <s-row>
          <span class="title">
             <i class="iconfont icon-tag"></i>历史数据
          </span>
      <page-infinite-table loading-text="正在加载中" :ajax-obj="axiosHistoryObj" :startAjax="getHistoryFlag"
                           ref="infiniteTable">
        <s-table-column v-for="(head,index) in historyTableHead" :key="index" :label="head" :prop="head"
                        show-overflow-tooltip>
        </s-table-column>
      </page-infinite-table>
    </s-row>
  </div>
</template>

<script>
  // import searchBox from '@/components/tableCom/src/SearchBox';
  import inputTree from '@/components/inputTree/InputTree';
  import $axios from 'sunflower-ajax';

  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  export default {
    data() {
      return {
        value: false,
        firstFlag: true,  // 第一次默认显示第一个数据，之后必须点查询按钮才能查询
        searchForm: {
          deviceTypeId: '',
          ipAddress: '',
          monitorType: '',
          monitorId: '',
          dateSelect: '0',
          bTime: '',
          eTime: ''
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
        criteria: {                 // 真分页分页数据
          condition: {},
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        },
        trendWidth: '',
        disableAfterToday1: {
          disabledDate(time) {
            return time.getTime() >= Date.now();
          }
        },
        disableAfterToday2: {
          disabledDate(time) {
            return time.getTime() >= Date.now()
          }
        }
      }
    },
    computed: {
      comp() {
        // {monitorId: 10, monitorType: "cpu"}
        // 默认资产类型为windows
        // return {citypeUuid: '22e21df197c64bc6b7c6eacc1ee418eb', controlAdderss: '', uuid: ''};
        // 默认资产类型为pc服务器
        return {citypeUuid: 'fd1edc72265e4e099479619af7dbcfd7', controlAdderss: '', uuid: ''};
      },
      hasTrend() {
        return Object.keys(this.trendCharts).length > 0;
      }
    },
//    created() {
//      this.searchForm.deviceTypeId = this.comp.citypeUuid;
//      // 获取搜索栏资产类型选项
//      $axios.get('/resourcemanager/configurationmanage/citype/getCountCitypeTree').then(({data}) => {
//        this.inputTreeData = data;
//      });
//    },
    methods: {
      initDivWidth () {
        var boxCardItemWidth = document.getElementById('infoDetail').offsetWidth;
        this.trendWidth = boxCardItemWidth + 'px';
      },
      inputTreeChange(nodeData) {
        let param = {
          cata: nodeData.name,
          compId: null,
          deviceType: nodeData.uuid,
          monitorType: null,
          selectFlag: 'cataFlag'
        };
        this.axiosOptions(param, data => {
          this.searchOptions.itcomps = data.itcomps || [];
          this.searchForm.ipAddress = data.itcomps ? data.itcomps[0] : '';
        });
        // 如果资产类型更改了，则后面的内容先清空，否则会出现有的资产类型没有数据但是还显示上一个资产类型的数据
//        this.searchForm.ipAddress = '';
//        this.searchForm.monitorType = '';
//        this.searchForm.monitorId = '';
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
          this.searchForm.monitorType = Object.keys(data.monitorTypes || {})[0];
          // 连续切换ip时不会触发monitorTypeChange
          this.searchForm.monitorId = this.searchOptions.monitorItems[this.searchForm.monitorType] ? this.searchOptions.monitorItems[this.searchForm.monitorType][0].id + '' : '';
        });
      },
      monitorTypeChange() {
        if (this.searchOptions.monitorItems && Object.keys(this.searchOptions.monitorItems).length > 0) {
          this.searchForm.monitorId = this.searchOptions.monitorItems[this.searchForm.monitorType][0].id + '';
        } else {
          this.searchForm.monitorId = '';
        }
        if (this.firstFlag) {
          this.axiosAll();
          this.firstFlag = false;
        }
      },
      getStartTime(val) {
        if (val != null) {
          let self = this
          let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
          let endValue = new Date(Date.parse(self.searchForm.eTime.replace(/-/g, '/'))).getTime();
          if (beginVal >= endValue) {
            self.searchForm.bTime = '';
            self.$message('开始日期不能大于等于结束日期！');
            return false;
          } else {
            self.searchForm.bTime = val;
            self.disableAfterToday2 = {
              disabledDate(time) {
                return time.getTime() > Date.now() || time.getTime() < new Date(self.searchForm.bTime) - 24 * 60 * 60 * 1000
              }
            }
          }
        }
      },
      getEndTime(val) {
        if (val != null) {
          let self = this
          let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
          let beginValue = new Date(Date.parse(self.searchForm.bTime.replace(/-/g, '/'))).getTime();
          if (endVal <= beginValue) {
            self.searchForm.eTime = '';
            self.$message('开始日期不能大于等于结束日期！');
            return false;
          } else {
            self.searchForm.eTime = val;
            self.disableAfterToday1 = {
              disabledDate(time) {
                return time.getTime() > Date.now() || time.getTime() > new Date(self.searchForm.eTime)
              }
            }
          }
        }
      },
      dateSelectChange(val) {
        let _this = this;

        function getDateVal(dayBefore, mAndY) {
          let now = new Date();
          if (mAndY) {
            let nowTime = now.getTime() - 1 * 24 * 60 * 60 * 1000;
            now.setTime(nowTime);
          }
          let newdate = new Date();
          let newtimems = newdate.getTime() - (dayBefore * 24 * 60 * 60 * 1000);
          newdate.setTime(newtimems);
          let clockBefore = CurentTime(newdate, mAndY);
          let clockNow = CurentTime(now, mAndY);
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
        let mAndY = false;
        switch (val) {
          case '0':
            dayBefore = 0;
            mAndY = false;
            break;
          case '1':
            dayBefore = 1;
            mAndY = false;
            break;
          case '2':
            dayBefore = 7;
            mAndY = false;
            break;
          case '3':
            dayBefore = 31;
            mAndY = true;
            break;
          case '4':
            dayBefore = 366;
            mAndY = true
            break;
        }
        if (dayBefore) {
          getDateVal(dayBefore, mAndY)
        } else {
          this.searchForm.bTime = '';
          this.searchForm.eTime = '';
        }
      },
      trendSearch() {
        this.trendCharts = {};
        this.axiosAll();
        this.$refs.infiniteTable.reInfinite();
      },
      getTrend(trend, index) {
        let chartData = trend.cap[0];
        return {
          name: 'trendChart' + index,
          type: 'areaChart',
          width: this.trendWidth,
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
      axiosOptions(param, callback = function () {
      }) {
        $axios.post(`/resourcemanager/assetmanage/ciPanel/selectSeachParams`, param).then(({data}) => {
          callback(data);
        });
      },
      axiosAll() {
        if (this.searchForm.monitorId) {
          this.axiosChart();
        }
        this.axiosHistoryTableHead();
        this.axiosSetHistoryParam();
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
    mounted() {
      this.searchForm.deviceTypeId = this.comp.citypeUuid;
      // 获取搜索栏资产类型选项
      $axios.get('/resourcemanager/configurationmanage/citype/getCountCitypeTree').then(({data}) => {
        this.inputTreeData = data;
      });
      this.initDivWidth();
      window.addEventListener('resize', this.initDivWidth);
    },
    destroyed() {
      window.removeEventListener('resize', this.initDivWidth);
    },
    components: {
      // searchBox,
      inputTree,
      pageInfiniteTable
    }
  }
</script>
<style>
  .searchFormChunk .ip-label .s-form-item-label{
    width: 60px!important;
  }
  .searchFormChunk .moniton-input .s-form-item-content{
    width: 150px!important;
  }
</style>
