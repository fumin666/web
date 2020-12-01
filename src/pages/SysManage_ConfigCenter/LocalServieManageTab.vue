/**
* Created by dgunzi on 2019/02/28.
* 本机服务管理
*/
<template>
  <div
    v-loading="loading"
    element-loading-text="请求中...">
    <s-table-page
      :data="serviceList"
      :header-search="getHeaderSearch()"
      :row-actions="getRowActions()"
      actions-col-width="150">
      <s-table-column
        label="服务名称"
        prop="serviceName"/>
      <s-table-column
        label="业务名称"
        prop="businessName"/>
      <s-table-column
        label="端口"
        width="250"
        prop="servicePort"/>
      <s-table-column
        label="服务进程号"
        prop="servicePid"/>
      <s-table-column
        label="状态"
        width="200"
        prop="serviceStatus"/>
    </s-table-page>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    name: 'LocalhostServieManage',
    data() {
      return {
        serviceList: [],
        loading: false
      }
    },
    created() {
      this.getServieData()
    },
    methods: {
      getServieData() {
        $axios.get('/configcenter/localservice/getServiceList').then(({data}) => {
          this.serviceList = data;
        });
      },
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入服务名称进行查询',
          searchProps: ['serviceName']
        }
      },
      showStart (row) {
        return (row.serviceStatus === '关闭');
      },
      showStop (row) {
        return (row.serviceStatus === '运行');
      },
      getRowActions() {
        let vm = this;
        return [
          {
            name: '启动',
            icon: 'start',
            show: this.showStart,
            click: (row) => {
              vm.serviceAction(row.serviceName, 'start');
            }
          },
          {
            name: '停止',
            icon: 'stop',
            show: this.showStop,
            click: (row) => {
              vm.serviceAction(row.serviceName, 'stop');
            }
          },
          {
            name: '重启',
            icon: 'reboot',
            click: (row) => {
              vm.serviceAction(row.serviceName, 'restart');
            }
          }
        ]
      },
      // 服务操作方法
      serviceAction(serviceName, action) {
        this.loading = true;
        $axios.get(`/configcenter/localservice/serviceCtrl/${serviceName}/${action}`).then(({data}) => {
          // 刷新列表
          this.getServieData();
          // 1秒后关闭loading效果
          setTimeout(() => {
            this.loading = false;
            if (data.result) {
              this.$message.success(data.errormsg);
            } else {
              this.$message.error(data.errormsg);
            }
          }, 1000);
        });
      }
    }
  }
</script>

<style scoped>

</style>
