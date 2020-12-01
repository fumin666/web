/**
* Created by liushupeng on 2019/2/21.//Q4高级搜索优化
*/
<template>
  <!--日志信息-->
  <div>
    <s-row>
      <s-card class="box-card different-view-card">
        <div slot="header" class="clearfix">
          <span class="card-title">日志信息</span>
          <s-button icon="arrow-left" title="返回" @click="back"  style="float: right; padding: 3px 10px"></s-button>
        </div>
      </s-card>
      <s-row>
        <s-form :inline="true" :model="searchForm" class="search_form" label-width="65px">
          <div>
            <s-form-item label="内容:" prop="searchForm.logMessage">
              <s-input v-model="searchForm.logMessage" style="width:185px;"></s-input>
            </s-form-item>
            <s-form-item label="程序:" prop="searchForm.program">
              <s-input v-model="searchForm.program" style="width:185px;"></s-input>
            </s-form-item>
            <s-form-item label="级别:" prop="searchForm.logLevel">
              <s-select v-model="searchForm.logLevel" clearable>
                <s-option v-for="item in logLevelList" :label="item.configName" :value="item.configValue" :key="item.value"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="特性:" prop="searchForm.facility">
              <s-select v-model="searchForm.facility" clearable>
                <s-option v-for="item in logFacilities" :label="item.name" :value="item.value" :key="item.value"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="接收时间:">
              <s-date-picker type="datetime" v-model="searchForm.startTime" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" style="width: 185px;" @change="getDateRangeStart">
              </s-date-picker>
              ~
              <s-date-picker type="datetime" v-model="searchForm.endTime" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" style="width: 185px;" @change="getDateRangeEnd">
              </s-date-picker>
            </s-form-item>
          </div>
          <div class="search_btn">
            <s-button icon="magnifier" @click="search">查询</s-button>
          </div>
        </s-form>
      </s-row>
    </s-row>
    <s-page-infinite-table ref="infiniteTable" loading-text="正在加载中" :ajax-obj="axiosObj" :startAjax="getFlag">
      <s-table-column prop="receivedTime" label="接收时间"></s-table-column>
      <s-table-column prop="logMessage" label="内容"></s-table-column>
      <s-table-column prop="program" label="程序"></s-table-column>
      <s-table-column prop="logLabel" label="级别"></s-table-column>
      <s-table-column prop="facilityLabel" label="特性"></s-table-column>
    </s-page-infinite-table>
  </div>
</template>

<script>
  // import searchBox from '@/components/tableCom/src/SearchBox'
  import $axios from 'sunflower-ajax'

  import sPageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  export default {
    data() {
      return {
        dep: true,
        axiosObj: {
          type: 'post',
          url: '/searchManage/getItcompLogInfo',
          params: {
            condition: {}
          }
        },
        getFlag: false,
        dataList: [],
        logLevelList: [],
        logFacilities: [],
        searchForm: {
          logSourceUuid: this.uuid,
          facility: '',
          logLevel: '',
          program: '',
          logMessage: '',
          startTime: '',
          endTime: ''
        }
        // disableAfterToday1: {
        //     disabledDate(time) {
        //         return time.getTime() >= Date.now();
        //     }
        // },
        // disableAfterToday2: {
        //     disabledDate(time) {
        //         return time.getTime() >= Date.now()
        //     }
        // }
      }
    },
    props: {
      uuid: {
        type: String
      }
    },
    created() {
      this.initSearch()
    },
    mounted() {
      this.search()
    },
    methods: {
      back() { // 返回上一页设置一个路由参数
        this.$router.push({name: 'assetsManage_systemConfiguration', params: {tabParam: 'logAudit'}});
      },
      search() {
        this.getFlag = true;
        let obj = Object.assign({}, this.searchForm);
        if (obj.startTime) {
          if (obj.endTime) {
            obj.receivedTime = obj.startTime + ' # ' + obj.endTime;
            delete obj.startTime;
            delete obj.endTime;
            this.axiosObj.params.condition = obj;
          } else {
            this.$message('必须有结束时间');
          }
        } else if (obj.endTime) {
          if (obj.startTime) {
            obj.receivedTime = obj.startTime + ' # ' + obj.endTime;
            delete obj.startTime;
            delete obj.endTime;
            this.axiosObj.params.condition = obj;
          } else {
            this.$message('必须有开始时间');
          }
        } else {
          delete obj.startTime;
          delete obj.endTime;
          this.axiosObj.params.condition = obj;
        }
      },
      initSearch() {
        $axios.get('/searchManage/getRuleConditionData').then((res) => {
          this.logFacilities = res.data.logFacilities
          this.logLevelList = res.data.logLevelList
        })
      },
      getDateRangeStart(val) {
        if (val == null) {
          val = ''
        }
        if (this.searchForm.endTime == null) {
          this.searchForm.endTime = '';
        }
        let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let endValue = new Date(Date.parse(this.searchForm.endTime.replace(/-/g, '/'))).getTime();
        if (beginVal >= endValue) {
          this.searchForm.startTime = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.searchForm.startTime = val;
        }
      },
      getDateRangeEnd(val) {
        if (val == null) {
          val = ''
        }
        if (this.searchForm.startTime == null) {
          this.searchForm.startTime = '';
        }
        let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let beginValue = new Date(Date.parse(this.searchForm.startTime.replace(/-/g, '/'))).getTime();
        if (endVal <= beginValue) {
          this.searchForm.endTime = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.searchForm.endTime = val;
        }
      }
    },
    components: {
      // searchBox,

      sPageInfiniteTable
    }
  }
</script>
