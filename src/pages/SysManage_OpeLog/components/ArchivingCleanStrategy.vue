/*
create by YOU
*/
<template>
  <div>
    <s-form ref="form" :model="form" :rules="rules"
            label-width="100px">
      <s-form-item label="归档方式" prop="archiveMode">
        <s-select v-model="form.archiveMode">
          <s-option label="自动丢弃" :value="0"></s-option>
          <s-option label="本地归档" :value="1"></s-option>
          <s-option label="FTP归档" :value="2"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="归档服务器" class="optServers">
        <s-table-page ref="optServersTable" :data="optServers"
                      style="width: 500px"
                      @selection-change="handleSelection"
                      class="table-select">
          <s-table-column type="selection" width="45"></s-table-column>
          <s-table-column prop="name" show-overflow-tooltip label="名称"></s-table-column>
          <s-table-column prop="archserver" show-overflow-tooltip label="ip"></s-table-column>
          <s-table-column prop="ftpserver" show-overflow-tooltip label="ftp" v-if="form.archiveMode === 2">
            <template slot-scope="scope">
              <s-select v-model="scope.row.ftpserver" clearable>
                <s-option v-for="item in serversList" :label='`${item.archiveDeviceIp}(${item.archiveDeviceName})`'
                          :value="item.uuid" :key="item.uuid"></s-option>
              </s-select>
            </template>
          </s-table-column>
        </s-table-page>
      </s-form-item>
      <s-form-item label="归档内容" class="archiv-item">
        <s-checkbox v-if="ImpAuth" v-model="form.impMod" :true-label="1" :false-label="3">资产监控信息
        </s-checkbox>
        <s-checkbox v-if="OmaAuth" v-model="form.omaMod" :true-label="1" :false-label="3">运维审计信息
        </s-checkbox>
        <s-checkbox v-if="DbaAuth" v-model="form.dbaMod" :true-label="1" :false-label="3">数据库审计信息
        </s-checkbox>
        <s-checkbox v-if="SiemAuth" v-model="form.siemMod" :true-label="1" :false-label="3">
          日志审计信息
        </s-checkbox>
      </s-form-item>
      <s-form-item label="保留天数" prop="remainDays">
        <s-input-number style="width: 185px" v-model="form.remainDays" :min="1" :step="1" :max="3650"></s-input-number>
      </s-form-item>
      <s-form-item label="状态" prop="status">
        <s-select v-model="form.status">
          <s-option label="激活" :value="1"></s-option>
          <s-option label="未激活" :value="0"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item>
        <s-button @click="saveFileClearStrategy">保存</s-button>
      </s-form-item>
    </s-form>
  </div>
</template>

<script type="text/babel">
  import {pick, cloneDeep} from 'lodash'
  import $axios from 'sunflower-ajax'
  import mixin from '@/common/mixins/auth';

  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        form: {
          archiveMode: 2,
          remainDays: 10,
          status: 0,
          impMod: 3, // 资产审计模块   1-开启，3-关闭
          omaMod: 3, // 运维审计模块   1-开启，3-关闭
          dbaMod: 3, // 数据库审计模块   1-开启，3-关闭
          siemMod: 3 // 日志审计模块   1-开启，3-关闭
        },
        rules: {},
        rules1: {
          archiveMode: [{required: true, message: '不能为空', trigger: 'blur', type: 'number'}],
          remainDays: [{required: true, message: '必须为1-3650间的数字', trigger: 'blur', type: 'number', min: 1, max: 3650}],
          status: [{required: true, message: '不能为空', trigger: 'blur', type: 'number'}]
        },
        rules2: {
          archiveMode: [{required: true, message: '不能为空', trigger: 'blur', type: 'number'}],
          remainDays: [{required: true, message: '必须为1-3650间的数字', trigger: 'blur', type: 'number', min: 1, max: 3650}],
          status: [{required: true, message: '不能为空', trigger: 'blur', type: 'number'}]
        },
        serversList: [],
        fileClearStrategyRules: {},
        optServers: [],
        selections: []
      }
    },
    created() {
      this.getServerList()
      this.getFileClearStrategy()
    },
    watch: {
      'form.archiveMode': {
        immediate: true,
        handler(val) {
          if (val === 2) {
            this.rules = this.rules1
          } else {
            this.rules = this.rules2
          }
        }
      }
    },
    methods: {
      getOptServers() { // 归档服务器
        let vm = this
        $axios.post('/archInfo/getOptServers').then(({data}) => {
          data.forEach(v => {
            let index = v.lastIndexOf('_');
            let obj = {
              name: v.substring(0, index),
              archserver: v.substring(index + 1, v.length),
              ftpserver: null
            }
            vm.optServers.push(obj)
          })
          vm.optServers.forEach((list) => {
            if (vm.form.archiveList) {
              vm.form.archiveList.forEach((item) => {
                if (list.archserver === item.archserver) {
                  list.ftpserver = item.ftpserver
                  vm.$refs.optServersTable.toggleRowSelection(list)
                }
              })
            }
          })
        })
      },
      handleSelection(val) {
        this.selections = val
      },
      getServerList() {
        $axios.post('/archiveDevice/getList').then(({data}) => {
          this.serversList = data
        })
      },
      getFileClearStrategy() {
        $axios.get('/archInfo/getAutoArchInfo').then(({data}) => {
          this.form = data
          this.getOptServers()
        })
      },
      saveFileClearStrategy() {
        this.$refs.form.validate((valid) => {
            if (valid) {
              if (this.form.dbaMod === 3 && this.form.impMod === 3 && this.form.siemMod === 3 && this.form.omaMod === 3) {
                this.$message({
                  message: '归档内容请至少勾选一个',
                  type: 'warning'
                });
                return false
              }
              console.log(this.selections);
              if (this.selections.length === 0) {
                this.$message({
                  message: '请至少选择一个归档服务器',
                  type: 'warning'
                });
                return false
              }
              let archiveList = cloneDeep(this.selections)
              let ftpFlag = false
              archiveList.forEach(v => {
                if (this.form.archiveMode !== 2) {
                  v.ftpserver = null
                } else {
                  if (v.ftpserver === null) {
                    ftpFlag = true
                  }
                }
                delete v.name
              })
              if (ftpFlag) {
                this.$message({message: 'ftp不能为空', type: 'warning'});
                return
              }
              let form = pick(this.form, ['archiveId', 'uuid', 'archiveMode', 'remainDays', 'status', 'impMod', 'omaMod', 'dbaMod', 'siemMod'])
              let param = Object.assign({}, form, {archiveList: archiveList})
              $axios.post('/archInfo/updateAutoArchInfo', param, {
                logTemplate: '设置|归档清理策略'
              }).then(({data}) => {
                if (data === true) {
                  this.$message.success('保存成功')
                } else {
                  this.$message.error('保存失败')
                  this.getFileClearStrategy()
                }
              })
            }
          }
        )
      }
    }
  }
  ;
</script>
<style>
  .optServers .s-pagination {
    display: none
  }
  .table-select .iconfont{
    font-size: 14px!important
  }
  .s-table tbody .cell .iconfont{
    margin-right: 0!important;
  }
</style>
