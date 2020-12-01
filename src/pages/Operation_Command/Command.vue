<template>
  <section>
    <s-tab type="card" class="oper-subpage-margin">
      <s-tab-pane label="运维列表" v-if="judgeRoleBtn('operationCenter_cmdCheckOperationList')">
        <div class="input-search fr" style="width: 280px; margin-bottom: 10px">
          <s-input placeholder="请输入内容" v-model="searchKey" class="real-search-input"
                   @keyup.enter.native="getLists"></s-input>
          <i class="iconfont icon-magnifier search-btn" @click="getLists"></i>
        </div>
        <RealPageTable :ajax-obj="ajaxObj" :useVirtual="true" :height="600">
          <s-table-column
            prop="itcompName"
            label="资产名称"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="controlAdderss"
            label="IP地址"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="itcompPort"
            label="端口"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="protocolName"
            label="协议"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="accountName"
            label="账号"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="operateDate"
            label="历史运维时间"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-special-oper" v-if="scope.row.canOperate" @click="commandOperate(scope.row)" title="运维"></i>
              <i class="iconfont icon-ban" v-if="!scope.row.canOperate" @click="commandStop(scope.row)" title="禁止"></i>
            </template>
          </s-table-column>
        </RealPageTable>
      </s-tab-pane>
      <s-tab-pane label="运维复核" v-if="judgeRoleBtn('operationCenter_cmdCheckOperationCheck')">
        <s-table-page :data='historyList'
                      :header-search="getOpsSearchDefHistory()"
                      :has-action-col='false'>
          <s-table-column
            prop="userRealName"
            label="操作人">
          </s-table-column>
          <s-table-column
            prop="sessionClientIp"
            label="客户端IP">
          </s-table-column>
          <s-table-column
            prop="deviceIp"
            label="目标资产IP">
          </s-table-column>
          <s-table-column
            prop="port"
            label="端口">
          </s-table-column>
          <s-table-column
            prop="protocolName"
            label="协议名">
          </s-table-column>
          <s-table-column
            prop="accountName"
            label="账号名">
          </s-table-column>
          <s-table-column
            prop="createTime"
            label="访问时间">
          </s-table-column>
          <s-table-column
            label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-vcr" v-if="true" @click="handleStart(scope.row)" title="开始复核"></i>
              <i class="iconfont icon-stop" v-if="true" @click="handleEnd(scope.row)" title="结束复核"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>
    <!--添加账号-->
    <s-dialog
      v-model="opsDialog"
      v-if="opsDialog"
      width="600px"
      title="运维访问">
      <ops-dialog :rowData="rowData"  ref="ops"></ops-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addOk">确定</s-button>
        <s-button type="cancel" @click="addCancel">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import opsDialog from './OpsAccess'
  export default {
    data() {
      return {
        historyList: [],
        opsDialog: false,
        rowData: {},
        ajaxObj: {
          type: 'post',
          url: '/checkCmd/getDoubleOptsList',
          params: {
            condition: {
            }
          }
        },
        searchKey: ''
      }
    },
    components: {
      RealPageTable,
      opsDialog
    },
    methods: {
      commandOperate(row) {
        let vm = this;
        vm.opsDialog = true
        vm.rowData = row
      },
      commandStop() {
        this.$message({message: '禁止操作', type: 'warning'});
      },
      handleStart(row) {
        if (row.canOperate === false) {
          this.$message({message: '禁止复核', type: 'error'});
          return false
        }
        $axios.get(`/checkCmd/isCanDoCheck/${row.uuid}`).then(res => {
          if (res.data === false) {
            this.$message({
              type: 'error',
              duration: '6000',
              message: '此条复核已经结束，请查看尚未复核数据'
            })
            this.getHistory()
          } else {
            $axios.get(`/checkCmd/doReplayOrBlockCheck/replay/${row.uuid}`).then(res => {
              if (res.data.status === 'true') {
                this.$message({
                  type: 'success',
                  message: res.data.msg
                })
                if (res.data.url !== '' || res.data.url !== null || res.data.url !== undefined) {
                  window.location.href = res.data.url
                }
              }
              if (res.data.status === 'false') {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            })
          }
        })
      },
      handleEnd(row) {
        this.$confirm('确定结束运维?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/checkCmd/doReplayOrBlockCheck/block/${row.uuid}`).then(res => {
            if (res.data.status === 'true') {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
              this.getHistory()
            }
            if (res.data.status === 'false') {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          });
        }).catch(() => {});
      },
      getLists() {
        let params = {
          content: this.searchKey
        }
        this.ajaxObj.params.condition = params;
      },
      getHistory() {
        $axios.get('/checkCmd/getDoubleSessionsList').then(res => {
          this.historyList = res.data
        });
      },
      getOpsSearchDefHistory() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['userRealName', 'sessionClientIp', 'deviceIp', 'port', 'createTime', 'protocolName', 'accountName'] // can be string or Array
        }
      },
      addOk() {
        let form = this.$refs['ops'].form
        form.deviceIp = this.rowData.controlAdderss
        let formValidate = this.$refs['ops'].$refs['addForm']
        formValidate.validate(valid => {
          if (!valid) return;
          $axios.post('/checkCmd/startClient', form).then(res => {
          if (res.status === 200) {
            if (res.data.status === 'true') {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
              if (res.data.url !== '' || res.data.url !== null || res.data.url !== undefined) {
                window.location.href = res.data.url
              }
              this.opsDialog = false
            }
            if (res.data.status === 'false') {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          }
        });
        })
      },
      addCancel() {
        this.opsDialog = false
      }
    },
    mounted() {
      this.getLists()
      this.getHistory()
    }
  }
</script>
<style>
  .oper-subpage-margin .input-search{
    position: relative;
  }
  .oper-subpage-margin .input-search .search-btn{
    position: absolute;
    right: 9px;
    top: 6.5px
  }
</style>
