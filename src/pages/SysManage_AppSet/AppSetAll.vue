<template>
  <section class="app-set-all">
    <s-row>
      <s-col :span="12">
        <s-dropdown @on-click="batchHandler">
          <s-button icon="backup">
            批量操作<i class="iconfont icon-bottom"></i>
          </s-button>
          <s-dropdown-menu slot="list" style="padding:0 10px">
            <s-dropdown-item name="blank"><i class="icon iconfont icon-user"></i> 批量加入黑名单</s-dropdown-item>
            <s-dropdown-item name="offline"><i class="icon iconfont icon-most-bottom"></i> 批量下线</s-dropdown-item>
            <s-dropdown-item name="unbind"><i class="icon iconfont icon-stop"></i>批量解绑</s-dropdown-item>
          </s-dropdown-menu>
        </s-dropdown>
      </s-col>
    </s-row>
    <s-table-page
      :data="listData"
      :row-actions="getRowActionsDef()"
      :header-search="getSearchDef()"
      :row-class-name="getRowClassName"
      @selection-change="changeHandler">
      <s-table-column type="selection" width="45"></s-table-column>
      <s-table-column label="ID号" prop="certificate"></s-table-column>
      <s-table-column label="IP地址" prop="clientIp"></s-table-column>
      <s-table-column label="最后登录时间" prop="loginTime"></s-table-column>
      <s-table-column label="登录账号" prop="userLoginName"></s-table-column>
    </s-table-page>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax';
  export default {
    components: {
    },
    data() {
      return {
        listData: []
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      batchHandler(name) {
        switch (name) {
          case 'black':
            break;
          case 'offline':
            break;
          case 'unbind':
            break;
        }
      },
      getList() {
        $axios.get('/mobileLogin/getIds').then((res) => {
          if (res.data instanceof Array) {
            this.listData = res.data;
          }
        });
      },
      getRowActionsDef() {
        // let vm = this;
        return [
          {
            icon: 'assist-cancel',
            name: '解绑',
            click(row) {
              console.log('解绑');
            }
          },
          {
            icon: 'edit',
            name: '改名',
            click(row) {
              console.log('改名');
            }
          },
          {
            icon: 'stop',
            name: '下线',
            click(row) {
              console.log('下线');
            }
          },
          {
            icon: 'ban',
            name: '加入黑名单',
            click(row) {
              console.log('加入黑名单');
            }
          },
          {
            icon: 'eye',
            name: '查看详情',
            click(row) {
              console.log('查看详情');
            }
          }
        ]
      },
      getSearchDef() {
        return {
          width: 12,
          placeholder: '请输入查询内容',
          searchProps: []
        }
      },
      getRowClassName(row) {},
      changeHandler(val) {}
    }
  }
</script>

<style>
  .app-set-all>.sc-table {
    margin-top: -32px;
    min-height: 300px;
  }
  .app-set-all>.sc-table>div.tool-bar {
    justify-content: flex-end;
  }
</style>
