<!--
 * @Author: shifeng
 * @Email: shifeng199307@gmail.com
 * @LastEditors  : mybells
 * @LastEditEmail: shifeng199307@gmail.com
 * @Description: 在线用户
 * @Date: 2019-02-27 16:09:20
 * @LastEditTime : 2019-12-27 15:50:37
 -->

<template>
  <div class="onlineUser">
    <s-row class="topRow" style="float:left;">
      <s-button @click="onlinetab=0">在线运维用户</s-button>
      <s-button @click="onlinetab=1">平台在线用户</s-button>
    </s-row>
    <template v-if="onlinetab === 0">
      <s-table-page :data="onlineOpeRes"   :header-search="getSearchOnlineOpe()"  key="onlineList1">
        <s-table-column label="创建时间" prop="createTime" min-width="180"></s-table-column>
        <s-table-column label="真实姓名" prop="userRealName" min-width="120"></s-table-column>
        <s-table-column label="账号名称" prop="userLoginName" min-width="170"></s-table-column>
        <s-table-column label="所属机构" prop="departName" min-width="170"></s-table-column>
        <s-table-column label="目标资产IP" prop="deviceIp" min-width="170"></s-table-column>
        <s-table-column label="资产名称" prop="itcompName" min-width="170"></s-table-column>
        <s-table-column label="资产分类" prop="citypeName" min-width="170" show-overflow-tooltip></s-table-column>
      </s-table-page>
    </template>
    <template v-else-if="onlinetab === 1">
      <s-table-page :data="onlineRes"   :header-search="getSearchOnline()"  key="onlineList2">
        <s-table-column label="时间" prop="createTime" min-width="180"></s-table-column>
        <s-table-column label="姓名" prop="userRealName" min-width="120"></s-table-column>
        <s-table-column label="账号" prop="userLoginName" min-width="170"></s-table-column>
        <s-table-column label="IP地址" prop="clientIp" min-width="170"></s-table-column>
      </s-table-page>
    </template>
  </div>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax';
// import {Validaters} from 'sunflower-common-utils';

// import sPeriod from '@/components/periodFormItem/Period'
// import {cloneDeep} from 'lodash';

export default {
  components: {
    // sPeriod // 定时控件
  },
  data() {
    return {
      onlinetab: 0, // 当前活动tab
      onlineRes: [], // 在线平台用户
      onlineOpeRes: [] // 在线运维用户
    }
  },
  created() {
    this.getAllOnlineUser();
    this.getAllOnlineOperationUser();
  },
  watch: {
    activeTab(val) {
      if (val === 0) {
        this.getAllOnlineOperationUser();
      } else if (val === 1) {
        this.getAllOnlineUser();
      }
    }
  },
  methods: {
    // 查询在线平台用户
    getSearchOnline() {
      return {
        width: 8,
        offset: 16,
        placeholder: '请输入查询内容',
        searchProps: ['createTime', 'userRealName', 'userLoginName', 'clientIp']
      }
    },
    // 查询在线运维用户
    getSearchOnlineOpe() {
      return {
        width: 8,
        offset: 16,
        placeholder: '请输入查询内容',
        searchProps: ['createTime', 'userRealName', 'userLoginName', 'departName', 'deviceIp', 'itcompName', 'citypeName']
      }
    },
    // 获取在线用户
    getAllOnlineUser() {
      $axios.get('/sysOperatingLog/getAllOnlineUser').then((res) => {
        if (res.data) {
          this.onlineRes = res.data;
        }
      })
    },
    // 获取在线运维用户
    getAllOnlineOperationUser() {
      $axios.get('/sysOperatingLog/getAllOnlineOperationUser').then((res) => {
        if (res.data) {
          this.onlineOpeRes = res.data
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
