<template>
        <s-table-page :data='datalist'


                  :pagination-def="getPaginationDef()"
                  :header-search='getNewSearchDef()'
                  @selection-change="handleSelectionChange">
          <s-table-column
            type="selection"
            width="45">
          </s-table-column>
          <s-table-column
            prop="itcompName"
            label="名称"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="controlAdderss"
            label="IP地址">
          </s-table-column>
          <s-table-column
            prop="controlAdderss"
            label="协议端口">
            <template slot-scope="scope">
              <s-select v-model="scope.row.protocolUuids" @change="getAccountName(scope.$index)">
                <s-option v-for="item in scope.row.monitorPortInfoList" :key="item.id" :label="item.protocolName" :value="item.uuid"></s-option>
              </s-select>
            </template>
          </s-table-column>
          <s-table-column
            label="登录账号">
            <template slot-scope="scope">
              <s-select v-model="scope.row.accountUuids">
                <s-option v-for="item in scope.row.accountList" :key="item.id" :label="item.accountName" :value="item.accountUuid"></s-option>
              </s-select>
            </template>
          </s-table-column>
          <s-table-column
            prop="taskName"
            label="已关联任务"
            show-overflow-tooltip>
          </s-table-column>
        </s-table-page>
</template>

<script type="text/babel">

  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        datalist: [],
        form: {
          accountUuids: [],
          deviceUuids: [],
          portUuids: [],
          taskUuid: ''
        },
        selection: []
      }
    },
    props: {
      taskUuid: {
        type: String
      }
    },
    methods: {
      getAccountName(val) {
        let portUuid = this.datalist[val].protocolUuids
        this.datalist[val].accountList = []
        this.datalist[val].accountUuids = ''
        $axios.post(`/operationBatchExcute/getAccountList/${portUuid}`).then((res) => {
          this.datalist[val].accountList = res.data;
        });
      },
      getNewSearchDef() {
        return {
          width: 6,
          placeholder: '查询条件',
          searchProps: ['itcompName', 'controlAdderss', 'protocolName']
        }
      },
      getPaginationDef() {
        return {
          layout: 'prev, pager, next'
        }
      },
      handleSelectionChange(val) {
        this.selection = val
      }
    },
    created() {
      this.form.taskUuid = this.taskUuid
      $axios.get('/operationBatchExcute/getInitFormDeviceList').then((res) => {
        this.datalist = res.data
        for (let v of this.datalist) {
          this.$set(v, 'protocolUuids')
          this.$set(v, 'accountUuids')
          this.$set(v, 'accountList')
        }
      });
    },

    watch: {
      datalist: {
        deep: true,
        handler: function (val) {
          let arr = []
          for (let v of val) {
            for (let y of this.selection) {
              if (y.uuid === v.uuid) {
                arr.push(v)
              }
            }
          }
          this.selection = arr
        }
      }
    }
  }
</script>

