<!--会话详情-->
<template>
  <section class="talkDetail">
    <s-table-page
      :data="List"
      :header-search="getSearchDef()"
      :header-actions="getListActionsDef()"
      key="userList"
      style="width: 55%; float: left">
      <s-table-column type="index" width="65" label="排名"></s-table-column>
      <s-table-column label="用户" prop="userName"></s-table-column>
      <s-table-column label="使用命令次数" prop="cmdCnt"></s-table-column>
    </s-table-page>
    <template>
      <s-chart :chart="chart1" style="float: left; margin-top: 50px;"></s-chart>
    </template>
    <div class="clear"></div>
    <s-scrollbar wrap-style="max-height:250px;">
      <s-table-page
        :data="SessionList"
        :row-actions="getRowActionsDef()"
        key="SessionList">
        <s-table-column label="登录时间" prop="create_date" width="180px" show-overflow-tooltip></s-table-column>
        <s-table-column label="登录IP" prop="session_client_ip" width="170px" show-overflow-tooltip></s-table-column>
        <s-table-column label="登录用户" prop="user_login_name" show-overflow-tooltip></s-table-column>
        <s-table-column label="访问资产" prop="device_ip" width="170px" show-overflow-tooltip></s-table-column>
        <s-table-column label="访问协议" prop="protocol_name" show-overflow-tooltip></s-table-column>
        <s-table-column label="登录账号" prop="account_name" show-overflow-tooltip></s-table-column>
        <s-table-column label="使用命令" prop="cmdContent" show-overflow-tooltip></s-table-column>
      </s-table-page>
    </s-scrollbar>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  export default {
    components: {
      // Download
    },
    data() {
      return {
      }
    },
    props: ['List', 'SessionList', 'downParam'],
    computed: {
      chart1: function() {
        let chart = {data: []};
        for (var i = 0; i < this.List.length; i++) {
          chart.data[i] = {};
          chart.data[i].name = this.List[i].userName;
          chart.data[i].value = this.List[i].cmdCnt;
        }
        return {
          name: 'chart',
          type: 'pieChart',
          width: '500px',
          height: '250px',
          data: chart.data
        }
      }
    },
    methods: {
      getListActionsDef() {
        let vm = this;
        return {
          width: 16,
          actions: [{
            name: 'Excel 报表',
            icon: 'excel',
            click: function() {
              $axios.post('/keyCmdStat/exportUserSessionCmd', Object.assign({exportType: 'excel'}, vm.downParam)).then((res) => {
                if (res.data === 'success') {
                  Download(`/keyCmdStat/downUserSessionCmd/excel?t=${new Date().getTime()}`);
                }
              });
            }
          }, {
            name: 'Word 报表',
            icon: 'word',
            click: function() {
              $axios.post('/keyCmdStat/exportUserSessionCmd', Object.assign({exportType: 'word'}, vm.downParam)).then((res) => {
                if (res.data === 'success') {
                  Download(`/keyCmdStat/downUserSessionCmd/word?t=${new Date().getTime()}`);
                }
              });
            }
          }, {
            name: 'Pdf 报表',
            icon: 'pdf',
            click: function() {
              $axios.post('/keyCmdStat/exportUserSessionCmd', Object.assign({exportType: 'pdf'}, vm.downParam)).then((res) => {
                if (res.data === 'success') {
                  Download(`/keyCmdStat/downUserSessionCmd/pdf?t=${new Date().getTime()}`);
                }
              });
            }
          }]
        }
      },
      getRowActionsDef() {
        let vm = this;
        return [{
          name: '查看',
          icon: 'eye',
          click: (row) => {
            vm.$emit('getSessionUuid', row)
          }
        }]
      },
      getSearchDef() {
        return {
          width: 8,
          placeholder: '请输入查询内容',
          searchProps: ['userName', 'cmdCnt']
        }
      }
    }
  }
</script>
