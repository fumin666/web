<template>
  <section class="content systemGeneral" style="margin-top:20px">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="管理操作日志" name="pane1" v-if="judgeRoleBtn('logCenter_systemManageOperationLog') || judgeRoleBtn('gradeProtect_dbReport_systemManageOperationLog')">
        <!--<s-select v-model="timeValue" @change="getList" placeholder="切换月份" class="select-time">-->
        <!--<s-option v-for="item in timeList" :label="item.slice(0,4) + '年' + item.slice(4,6) + '月'" :value="item" :key="item"></s-option>-->
        <!--</s-select>-->
        <s-form :inline="true" :model="manageForm">
          <select-time ref="selecttime1">
            <template slot="searchBtn">
              <div class="search_btn">
                <s-button title="查询" icon='magnifier' @click="getListManage">查询</s-button>
              </div>
            </template>
          </select-time>
        </s-form>
        <s-row style="margin: 15px 0 10px;">
          <s-button title="EXCEL报表" icon="excel" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
          <s-button title="WORD报表" icon="word" @click="WordDownloadHandle()">WORD报表</s-button>
          <s-button title="PDF报表" icon="pdf" @click="PdfDownloadHandle()">PDF报表</s-button>
        </s-row>
        <s-table-page :data="SystemList"   :header-search="{show: false}"  key="SystemList">
          <s-table-column label="时间" prop="createTime" min-width="180"></s-table-column>
          <s-table-column label="操作人" prop="userRealName" min-width="120"></s-table-column>
          <s-table-column label="客户端IP" prop="operatingIp" min-width="170"></s-table-column>
          <s-table-column label="模块" prop="productName" min-width="120"></s-table-column>
          <s-table-column label="功能" prop="moduleName" min-width="120"></s-table-column>
          <s-table-column label="操作内容" prop="operatingContent" min-width="300" show-overflow-tooltip></s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="系统登录日志" name="pane2" v-if="judgeRoleBtn('logCenter_systemLoginLog') || judgeRoleBtn('gradeProtect_dbReport_systemLoginLog')">
        <!--<s-select v-model="timeValue" @change="getLoginList" placeholder="切换月份" class="select-time">-->
        <!--<s-option v-for="item in timeList" :label="item.slice(0,4) + '年' + item.slice(4,6) + '月'" :value="item" :key="item"></s-option>-->
        <!--</s-select>-->
        <s-form :model="systemForm" :inline="true">
          <select-time ref="selecttime2">
            <template slot="searchBtn">
              <div class="search_btn">
                <s-button title="查询" icon='magnifier' @click="getLoginList">查询</s-button>
              </div>
            </template>
          </select-time>
        </s-form>
        <s-row style="margin: 15px 0 10px;">
          <s-button title="EXCEL报表" icon="excel" @click="ExcelDownloadHandle2()">EXCEL报表</s-button>
          <s-button title="WORD报表" icon="word" @click="WordDownloadHandle2()">WORD报表</s-button>
          <s-button title="PDF报表" icon="pdf" @click="PdfDownloadHandle2()">PDF报表</s-button>
        </s-row>
        <s-table-page :data="loginRes"   :header-search="{show: false}"  key="LoginList">
          <s-table-column label="时间" prop="createTime" min-width="180"></s-table-column>
          <s-table-column label="姓名" prop="userRealName" min-width="120"></s-table-column>
          <s-table-column label="账号" prop="userLoginName" min-width="170"></s-table-column>
          <s-table-column label="IP地址" prop="loginIp" min-width="170"></s-table-column>
          <s-table-column label="登录方式" prop="loginType" min-width="170" show-overflow-tooltip></s-table-column>
          <s-table-column label="结果" prop="loginResult" min-width="300" show-overflow-tooltip></s-table-column>
        </s-table-page>
      </s-tab-pane>
      <!--<s-tab-pane label="在线用户">-->
        <!--<onlineUser v-if="activeTab === 2"></onlineUser>-->
      <!--</s-tab-pane>-->
    </s-tab>
  </section>
</template>

<script>
import $axios from 'sunflower-ajax'

// import onlineUser from './components/onlineUser'
import SelectTime from '@/components/selectTime/SelectTime.vue'
import {Download} from 'sunflower-common-utils'

export default {
  components: {

    // onlineUser,
    SelectTime
  },
  data() {
    return {
      tabNameArr: ['logCenter_systemManageOperationLog', 'logCenter_systemLoginLog'], // 页签名字的集合(顺序和页签一致)
      tabNameArr1: ['gradeProtect_dbReport_systemManageOperationLog', 'gradeProtect_dbReport_systemLoginLog'], // 页签名字的集合(顺序和页签一致)
      activeTab: 'pane1',
      SystemList: [],
      timeList: [],
      LoginList: [],
      period1: {},
      period11: {},
      period2: {},
      period22: {},
      manageForm: {},
      systemForm: {}
    }
  },
  mounted() {
    let {path} = this.$route
    this.activeTab = path === '/GradeProtect/gradeProtect_dbReport' ? this.tabIndexName(this.tabNameArr1) : this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    this.getListManage()
    this.getLoginList();
  },
  methods: {
    getListManage() {
      let vm = this;
      vm.period1 = {
        startTime: new Date(this.$refs.selecttime1.beginTimes).getTime() / 1000,
        endTime: new Date(this.$refs.selecttime1.endTimes).getTime() / 1000
      }
      vm.period11 = {
        startTime: new Date(this.$refs.selecttime1.beginTimes || null).getTime() / 1000,
        endTime: new Date(this.$refs.selecttime1.endTimes || null).getTime() / 1000
      }
      $axios.post('/sysOperatingLog/getLogListByParams', vm.period1).then((res) => {
        if (res.data instanceof Array) {
          vm.SystemList = res.data;
        }
      })
    },
    getLoginList() {
      let vm = this;
      vm.period2 = {
        startTime: new Date(this.$refs.selecttime2.beginTimes).getTime() / 1000,
        endTime: new Date(this.$refs.selecttime2.endTimes).getTime() / 1000
      }
      vm.period22 = {
        startTime: new Date(this.$refs.selecttime2.beginTimes || null).getTime() / 1000,
        endTime: new Date(this.$refs.selecttime2.endTimes || null).getTime() / 1000
      }
      $axios.post('/sysLoginLog//getLogListByParams', vm.period2).then((res) => {
        if (res.data instanceof Array) {
          vm.LoginList = res.data;
        }
      })
    },
    ExcelDownloadHandle() {
      let vm = this
      Download(`/sysOperatingLog/exportLog/excel/${vm.period11.startTime}/${vm.period11.endTime}?t=${new Date().getTime()}`);
    },
    PdfDownloadHandle() {
      let vm = this
      Download(`/sysOperatingLog/exportLog/pdf/${vm.period11.startTime}/${vm.period11.endTime}?t=${new Date().getTime()}`);
    },
    WordDownloadHandle() {
      let vm = this
      Download(`/sysOperatingLog/exportLog/word/${vm.period11.startTime}/${vm.period11.endTime}?t=${new Date().getTime()}`);
    },
    ExcelDownloadHandle2() {
      let vm = this
      Download(`/sysLoginLog/exportLog/excel/${vm.period22.startTime}/${vm.period22.endTime}?t=${new Date().getTime()}`);
    },
    PdfDownloadHandle2() {
      let vm = this
      Download(`/sysLoginLog/exportLog/pdf/${vm.period22.startTime}/${vm.period22.endTime}?t=${new Date().getTime()}`);
    },
    WordDownloadHandle2() {
      let vm = this
      Download(`/sysLoginLog/exportLog/word/${vm.period22.startTime}/${vm.period22.endTime}?t=${new Date().getTime()}`);
    }
  },
  watch: {
    activeTab(val) {
      switch (val) {
        case 0:
          this.getListManage();
          break;
        case 1:
          this.getLoginList();
          break;
      }
    }
  },
  computed: {
    loginRes() {
      return this.LoginList.map(item => {
        let status = '';
        if (item.loginResult === 1) {
          status = '成功'
        } else {
          status = '失败'
        }
        return Object.assign({}, item, {
          loginResult: status
        })
      })
    }
  }
}
</script>

<style>
.systemGeneral {
  position: relative;
}

.systemGeneral .select-time {
  position: absolute;
}
</style>
