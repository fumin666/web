/*
* @Author: YOU
* @Date: Null
* @Last Modified by: shifeng
* @Last Modified time: 2019-01-22 13:45:38
*/

<template>
  <s-form :rules="rules" ref="form" label-width="150px" :model="form">
    <s-form-item label="归档名称" prop="archiveName">
      <s-input :disabled="disabled" v-model="form.archiveName"></s-input>
    </s-form-item>
    <s-form-item label="归档方式" prop="archiveMode">
      <s-select :disabled="disabled" v-model="form.archiveMode">
        <s-option label="本地归档" :value="1"></s-option>
        <s-option label="FTP归档" :value="2"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="归档服务器" class="optServers">
      <s-table-page ref="optServersTable" :data="optServers" @selection-change="handleSelection" class="table-select">
        <s-table-column type="selection" width="45" :selectable="isSelectable"></s-table-column>
        <s-table-column prop="name" show-overflow-tooltip label="名称"></s-table-column>
        <s-table-column prop="archserver" show-overflow-tooltip label="ip"></s-table-column>
        <s-table-column prop="ftpserver" show-overflow-tooltip label="ftp" v-if="form.archiveMode === 2">
          <template slot-scope="scope" >
            <s-select v-model="scope.row.ftpserver" :disabled="disabled" clearable>
              <s-option v-for="item in serversList" :label='`${item.archiveDeviceIp}(${item.archiveDeviceName})`'
                        :value="item.uuid" :key="item.uuid"></s-option>
            </s-select>
          </template>
        </s-table-column>
      </s-table-page>
    </s-form-item>

    <s-form-item label="归档内容" class="archiv-item">
      <s-checkbox :disabled="disabled" v-if="ImpAuth" v-model="form.impMod" :true-label="1" :false-label="3">
        资产监控信息
      </s-checkbox>
      <s-checkbox :disabled="disabled" v-if="OmaAuth" v-model="form.omaMod" :true-label="1" :false-label="3">
        运维审计信息
      </s-checkbox>
      <s-checkbox :disabled="disabled" v-if="DbaAuth" v-model="form.dbaMod" :true-label="1" :false-label="3">
        数据库审计信息
      </s-checkbox>
      <s-checkbox :disabled="disabled" v-if="SiemAuth" v-model="form.siemMod" :true-label="1" :false-label="3">
        日志审计信息
      </s-checkbox>
    </s-form-item>
    <s-form-item label="归档内容开始时间" prop="dataBeginTime">
      <s-date-picker :disabled="disabled" v-model="form.dataBeginTime" type="date" @change="firstChange"
                     format="yyyy-MM-dd 00:00:00" :picker-options="firstPickerOptions" :value-format-flag="true"
                     placeholder="选择开始时间">
      </s-date-picker>
    </s-form-item>
    <s-form-item label="归档内容结束时间" prop="dataEndTime">
      <s-date-picker :disabled="disabled" v-model="form.dataEndTime" type="date" @change="lastChange"
                     format="yyyy-MM-dd 00:00:00" :picker-options="lastPickerOptions" :value-format-flag="true"
                     placeholder="选择结束时间">
      </s-date-picker>
    </s-form-item>
    <s-form-item label="备注" prop="remark">
      <s-input :disabled="disabled" v-model="form.remark" type="textarea"></s-input>
    </s-form-item>
  </s-form>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import mixin from '@/common/mixins/auth';
  import {cloneDeep} from 'lodash';
  export default {
    mixins: [mixin],
    data() {
      return {
        form: {
          archiveName: '', // 归档名称
          archiveMode: 2, // 归档方式：1-本地归档，2-FTP归档
          impMod: 3, // 资产审计模块   1-开启，3-关闭
          omaMod: 3, // 运维审计模块   1-开启，3-关闭
          dbaMod: 3, // 数据库审计模块   1-开启，3-关闭
          siemMod: 3, // 日志审计模块   1-开启，3-关闭
          dataBeginTime: '', // 归档内容开始时间
          dataEndTime: '', // 归档内容结束时间
          remark: '' // 备注
        },
        rules: {
          archiveName: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
            {
              pattern: /^[\w\u4e00-\u9fa5\.\-]{1,30}$/,
              message: '名称为中文、字母、数字、及符号[_-.]组合，且长度不超过30个字符',
              trigger: 'blur'
            }
          ],
          archiveMode: [{
            required: true,
            message: '不能为空',
            trigger: 'blur',
            type: 'number'
          }],
          dataBeginTime: [{
            required: true,
            message: '不能为空',
            trigger: 'blur',
            type: 'date'
          }],
          dataEndTime: [{
            required: true,
            message: '不能为空',
            trigger: 'blur',
            type: 'date'
          }],
          remark: [{
            pattern: /^.{0,120}$/,
            message: '备注长度不能超过120个字符',
            trigger: 'blur'
          }]
        },
        serversList: [],
        selections: [],
        optServers: [],
        firstPickerOptions: {},
        lastPickerOptions: {}
      }
    },
    created() {
      this.getServerList()
      this.getOptServers()
      // 初始化
      if (this.defaultData && this.defaultData.archiveName) {
        this.$set(this, 'form', this.defaultData)
      }
    },
    watch: {
    },
    methods: {
      getServerList() {
        $axios.post('/archiveDevice/getList').then(({data}) => {
          this.serversList = data
        })
      },
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
          if (vm.defaultData && vm.defaultData.archiveList !== null) {
            vm.optServers.forEach((list) => {
              vm.defaultData.archiveList.forEach((item) => {
                if (list.archserver === item.archserver) {
                  list.ftpserver = item.ftpserver
                  vm.$refs.optServersTable.toggleRowSelection(list)
                }
              })
            })
          }
        })
      },
      isSelectable(row, index) {
        if (!this.disabled) {
          return true
        }
      },
      handleSelection(val) {
        this.selections = val
      },
      // 时间选择器
      firstChange(value) {
        this.lastPickerOptions = {
          disabledDate(time) {
            return time.getTime() <= new Date(value).getTime()
          }
        }
      },
      lastChange(value) {
        this.firstPickerOptions = {
          disabledDate(time) {
            // 减去一天
            return time.getTime() > new Date(value).getTime() - 86400000
          }
        }
      },
      getForm() {
        let archiveList = cloneDeep(this.selections)
        archiveList.forEach(v => {
          if (this.form.archiveMode === 1) {
            v.ftpserver = null
          }
          delete v.name
        })
        return Object.assign({}, this.form, {
          dataBeginTime: new Date(this.form.dataBeginTime).getTime() / 1000,
          dataEndTime: new Date(this.form.dataEndTime).getTime() / 1000
        }, {archiveList: archiveList})
      },
      validate(cb) {
        this.$refs.form.validate((valid) => {
          cb(valid)
        })
      }
    },
    props: {
      disabled: false,
      defaultData: {
        type: Object,
        default() {
          return null
        }
      }
    }
  };
</script>
<style lang="stylus">
  .s-form-item.archiv-item .s-form-item-label:before {
    content: "*";
    color: #f51131;
    margin-right: 4px;
  }

  .optServers .s-pagination {
    display none
  }
  .table-select .iconfont{
    font-size 14px!important
  }
  .s-table tbody .cell .iconfont{
    margin-right 0!important;
  }
</style>
