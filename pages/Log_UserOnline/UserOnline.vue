<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-18 10:43:51
 * @LastEditTime: 2019-09-18 10:43:51
 * @LastEditors: your name
 -->

/**
* @Author: songyf
* @Description: 报表中心-系统在线人员
* @Date: 2019-07-24
*/
<template>
  <section class="content" style="margin-top: 20px;">

    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="在线人员" name="pane1"  v-if="judgeRoleBtn('logCenter_userOnlineSys')">
        <s-table-page :data="onlineRes"
                      :header-search="getSearchOnline()"
                      key="onlineList1" v-if="activeTab === 'pane1'">
          <s-table-column label="时间" prop="createTime" min-width="180"></s-table-column>
          <s-table-column label="姓名" prop="userRealName" min-width="120"></s-table-column>
          <s-table-column label="账号" prop="userLoginName" min-width="170"></s-table-column>
          <s-table-column label="IP地址" prop="clientIp" min-width="170"></s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="在线运维人员" name="pane2" v-if="judgeRoleBtn('logCenter_userOnlineOper')">
        <s-table-page :data="onlineOpeRes"
                     :header-search="getSearchOnlineOpe()"
                     key="onlineList2"
                     v-if="activeTab === 'pane2'">
          <s-table-column label="创建时间" prop="createTime" min-width="180"></s-table-column>
          <s-table-column label="真实姓名" prop="userRealName" min-width="120"></s-table-column>
          <s-table-column label="账号名称" prop="userLoginName" min-width="170"></s-table-column>
          <s-table-column label="所属机构" prop="departName" min-width="170"></s-table-column>
          <s-table-column label="目标资产IP" prop="deviceIp" min-width="170"></s-table-column>
          <s-table-column label="资产名称" prop="itcompName" min-width="170"></s-table-column>
          <s-table-column label="资产分类" prop="citypeName" min-width="170" show-overflow-tooltip></s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>
  </section>
</template>
<script>
  import $axios from 'sunflower-ajax'
  export default{
    data () {
      return {
        tabNameArr: ['logCenter_userOnlineSys', 'logCenter_userOnlineOper'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1',
        onlineRes: [], // 在线平台用户
        onlineOpeRes: [] // 在线运维用户
      }
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
      if (this.$route.query.pan) {
        this.activeTab = this.$route.query.pan
      }
      this.getAllOnlineUser();
      this.getAllOnlineOperationUser();
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
