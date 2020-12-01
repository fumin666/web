/*
* @Author: YOU
* @Date: Null
* @Last Modified by: shifeng
* @Last Modified time: 2019-01-22 14:00:47
*/

<template>
  <div class="archivingByHand">
    <s-form :inline='true' class="search_form"  style="margin-bottom:10px" label-width='105px'>
      <div>
        <s-form-item label='归档名称：'>
          <s-input v-model="form.archiveName"></s-input>
        </s-form-item>
        <s-form-item label='归档方式：'>
          <s-select v-model="form.archiveMode">
            <s-option label="自动丢弃" :value="0"></s-option>
            <s-option label="本地归档" :value="1"></s-option>
            <s-option label="FTP归档" :value="2"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label='状态：'>
          <s-select v-model="form.status">
            <s-option v-for="item in statusData" :label="item.name" :value="item.valueInt" :key="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label='创建时间：'>
          <s-date-picker v-model="form.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false" @change="getDateRangeStart">
          </s-date-picker>
          ~
          <s-date-picker v-model="form.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false" @change="getDateRangeEnd">
          </s-date-picker>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon='magnifier' @click="getArchInfoList">查询</s-button>
      </div>
    </s-form>
    <s-table-page :data="data" :header-actions="innerActionsDef()">
      <s-table-column prop="archiveName" show-overflow-tooltip label="归档名称">
      </s-table-column>
      <s-table-column prop="modeStr" show-overflow-tooltip label="归档方式">
      </s-table-column>
      <s-table-column prop="createDate" show-overflow-tooltip label="创建时间">
      </s-table-column>
      <s-table-column show-overflow-tooltip label="归档内容">
        <template slot-scope="scope">
          <span v-if="scope.row.siemMod !== 3">日志审计信息 </span>
          <span v-if="scope.row.dbaMod !== 3">数据库审计信息 </span>
          <span v-if="scope.row.impMod !== 3">资产监控信息 </span>
          <span v-if="scope.row.omaMod !== 3">运维审计信息</span>
        </template>
      </s-table-column>
      <s-table-column prop="dataBeginTime" show-overflow-tooltip label="归档内容开始时间">
      </s-table-column>
      <s-table-column prop="dataEndTime" show-overflow-tooltip label="归档内容结束时间">
      </s-table-column>
      <s-table-column prop="statusStr" show-overflow-tooltip label="状态">
      </s-table-column>
      <s-table-column show-overflow-tooltip label="操作" width=160>
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="LookArchiving(scope.row)"></i>
          <!-- <i v-if="scope.row.status === 2 && scope.row.archiveMode === 1" class="iconfont icon-delete" title="删除" @click="deleteHandler(scope.row)"></i> -->
          <!-- <i v-if="scope.row.status === 2 && scope.row.archiveMode === 1" class="iconfont icon-download" title="下载" @click="downloadHandler(scope.row)"></i> -->
        </template>
      </s-table-column>
    </s-table-page>
    <s-dialog v-model="addDialog" v-if="addDialog" width="800px" title="添加归档">
      <archiving-form ref="add"></archiving-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addArchiving">保存</s-button>
        <s-button type="cancel" @click="addDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog v-model="lookDialog" v-if="lookDialog" width="800px" title="查看">
      <archiving-form :defaultData="defaultData" :disabled="true"></archiving-form>
    </s-dialog>
  </div>
</template>

<script type="text/babel">
  import {Download} from 'sunflower-common-utils'
  import archivingForm from './ArchivingForm.vue'

  import $axios from 'sunflower-ajax'
  export default {
    components: {

      archivingForm
    },
    data() {
      return {
        data: [],
        selectedList: [],
        addDialog: false,
        lookDialog: false,
        // 查看时的数据
        defaultData: {},
        form: {
          archiveName: null,
          serviceIp: null,
          archiveMode: null,
          startTime: '',
          endTime: '',
          status: null
        },
        statusData: []
      }
    },
    created() {
      this.getArchInfoList()
      $axios.get('/archInfo/getArchiveStatusEnumList').then(({data}) => {
        this.statusData = data
      })
    },
    methods: {
      getDateRangeStart(value) {
        let start = this.form.startTime ? new Date(this.form.startTime).getTime() : 0
        let end = this.form.endTime ? new Date(this.form.endTime).getTime() : 0
        if (end) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.form.startTime = '';
          }
        }
      },
      getDateRangeEnd(value) {
        let start = this.form.startTime ? new Date(this.form.startTime).getTime() : 0
        let end = this.form.endTime ? new Date(this.form.endTime).getTime() : 0
        if (start) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.form.endTime = '';
          }
        }
      },
      getArchInfoList() {
      let params = {
          condition: Object.assign({}, this.form),
          currentPage: 1,
          totalCount: 0,
          pageSize: 10,
          pageList: [],
          distinct: false,
          orderByClause: ''
        }
        params.condition.startTime = (new Date(this.form.startTime).getTime()) / 1000
        params.condition.endTime = (new Date(this.form.endTime).getTime()) / 1000
        $axios.post('/archInfo/getArchInfoList', params).then(({data}) => {
          this.data = data
        })
      },
      innerActionsDef() {
        let _self = this
        return {
          width: 5,
          offset: 0,
          actions: [
            {
              name: '添加归档',
              icon: 'plus',
              click() {
                _self.addDialog = true
              }
            }
          ]
        }
      },
      addArchiving() {
        this.$refs.add.validate((valid) => {
          if (valid) {
            let params = this.$refs.add.getForm();
            if (params.archiveList.length === 0) {
              this.$message({
                message: '请至少选择一个归档服务器',
                type: 'warning'
              });
              return false
            }
            let ftpFlag = false
            params.archiveList.forEach(v => {
              if (params.archiveMode === 2) {
                if (v.ftpserver === null) {
                  ftpFlag = true
                }
              }
            })
            if (ftpFlag) {
              this.$message({message: 'ftp不能为空', type: 'warning'});
              return
            }
            if (params.dbaMod === 3 && params.impMod === 3 && params.siemMod === 3 && params.omaMod === 3) {
              this.$message({
                message: '归档内容请至少勾选一个',
                type: 'error'
              });
              return false
            }
            if (params.dataBeginTime > params.dataEndTime) {
              this.$message({
                message: '归档开始时间必须小于归档结束时间',
                type: 'error'
              });
              return false
            }
            $axios.post('/archInfo/checkName/', {
              checkName: params.archiveName
            }, {timeout: 300000}).then(({data}) => {
              if (data === true) {
                this.addDialog = false
                $axios.post('/archInfo/saveArchInfo', params, {
                  data: [{name: params.archiveName}],
                  logTemplate: '添加|手动归档>归档(#name#)'
                }).then(({data}) => {
                  if (data === true) {
                    this.$message.success('保存成功，正在归档...')
                    this.getArchInfoList()
                  } else {
                    this.$message.success('保存失败!')
                  }
                })
              } else {
                this.$message.error('归档名称重复!')
              }
            })
          }
        })
      },
      LookArchiving(row) {
        row.dbaMod !== 3 ? (row.dbaMod = 1) : (row.dbaMod = 3)
        row.impMod !== 3 ? (row.impMod = 1) : (row.impMod = 3)
        row.siemMod !== 3 ? (row.siemMod = 1) : (row.siemMod = 3)
        row.omaMod !== 3 ? (row.omaMod = 1) : (row.omaMod = 3)
        this.defaultData = row
        this.lookDialog = true
      },
      downloadHandler(row) {
        Download(`archInfo/download/${row.uuid}`)
      },
      deleteHandler(row) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/archInfo/delete/${row.uuid}`).then(({data}) => {
            if (data === true) {
              this.$message.success('删除成功')
              this.getArchInfoList()
            } else {
              this.$message.error('删除失败')
            }
          })
        }).catch(() => {});
      }
    }
  };
</script>

