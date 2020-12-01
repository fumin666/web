/**
* Created by alex on 2018/8/15.
*/
<template>
  <section>
    <s-form :model="taskForm" :rules="taskRules" label-width="120px" ref="taskForm">
      <s-form-item label="采集名称" prop="taskName">
        <s-input v-model="taskForm.taskName"></s-input>
      </s-form-item>
      <s-form-item label="指定扫描网段" class="apply-special-table" required>
        <s-row :gutter="10">
          <s-button @click="openAdd">添加</s-button>
          <s-button @click="openDel">删除</s-button>
        </s-row>
        <s-table :data="IPBlockList" @selection-change="handleSelectChange" ref="sTable">
          <s-table-column type="selection" width="45"></s-table-column>
          <s-table-column label="IP地址段" prop="ipAddressPart"></s-table-column>
        </s-table>
      </s-form-item>
      <s-form-item label="是否周期任务" prop="isPeriod">
        <s-radio-group v-model="taskForm.isPeriod">
          <s-radio :label="0">否</s-radio>
          <s-radio :label="1">是</s-radio>
        </s-radio-group>
      </s-form-item>
      <s-period ref="period" v-model="taskForm.tScheduleTime" :showPeriodItem="showPeriodItem" :isShowNow="'is-show-now'"></s-period>
    </s-form>
    <!--ip段-->
    <s-dialog
      v-model="addDialog"
      v-if="addDialog"
      width="600px"
      title="添加IP段"
      append-to-body>
      <add-ip ref="AddIP"></add-ip>
      <template slot="footer">
        <s-button @click="saveIpBlock">保存</s-button>
        <s-button type="cancel" @click="addDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import { intersectObj, Validaters } from 'sunflower-common-utils'
  import addIp from './AddIpblock.vue'
  import sPeriod from '@/components/periodFormItem/Period'

  export default {
    data () {
      let checkRepeatName = (rule, value, callback) => {
        if (value !== this.editRepeatName) {
          if (value) {
            $axios.post('/cicollectTaskinfo/validateAutoCollName', { name: value }).then((res) => {
              if (res.data === true) {
                callback(new Error('该名称已经存在'));
              } else {
                callback()
              }
            })
          }
        } else {
          callback()
        }
      };
      return {
        IPBlockList: [],
        delIpList: [],
        addDialog: false,
        Form: {},
        taskForm: {
          taskName: '',
          isPeriod: 0,
          tScheduleTime: {
            timeType: 1,
            day: 1,
            week: 1,
            month: 1,
            year: 1,
            dayOfWeek: [2],
            dayOfMonth: [1],
            monthOfYear: 1,
            isForever: 0,
            firstFireTime: undefined,
            endFireTime: undefined
          },
          uuid: '',
          editRepeatName: ''
        },
        taskRules: {
          taskName: [
            Validaters.NotNull,
            Validaters.Max(30),
            {validator: checkRepeatName, trigger: 'blur'}
          ]
        },
        showPeriodItem: false
      }
    },
    components: {
      addIp,
      sPeriod
    },
    props: {
      editData: {
        type: Object
      }
    },
    created () {
      if (this.editData !== undefined) {
        this.taskForm = intersectObj(this.taskForm, this.editData)
        this.editRepeatName = this.taskForm.taskName
        this.IPBlockList = this.editData.autoMateCiCollectNets.map(item => (
            {uuid: item.uuid,
            ipAddressPart: item.startIpaddress + '~' + item.endIpaddress
            })
        )
        this.$nextTick(() => {
          this.IPBlockList.forEach(row => {
            this.$refs['sTable'].toggleRowSelection(row, true)
          })
        })
      }
    },
    methods: {
      validatorAny (rule, value, callback) {
        callback()
      },
      openAdd () {
        this.addDialog = true
      },
      openDel () {
        let form = this.delIpList.map(item => {
          return item.uuid
        })
        if (form.length === 0) {
          this.$message.error('请选择删除列')
          return false
        }
        $axios.post('/cicollectTaskinfo/deleteNetsegmentByList', form).then((res) => {
          if (res.data) {
            this.$message.success('删除成功')
            for (let i = 0; i < form.length; i++) {
              for (let j = 0; j < this.IPBlockList.length; j++) {
                if (form[i] === this.IPBlockList[j].uuid) {
                  this.IPBlockList.splice(j, 1)
                }
              }
            }
            if (this.IPBlockList.length === 0) {
              this.$refs['sTable'].clearSelection()
            }
          } else {
            this.$message.error('删除失败')
          }
        })
      },
      saveIpBlock () {
        this.$refs['AddIP'].$refs['Form'].validate(valid => {
          if (!valid) {
            return false
          }
          let param = {}
          for (let i in this.Form) {
            if (i !== 'ipaddress') {
              param[i] = this.Form[i]
            }
          }
          let AddIP = this.$refs.AddIP.Form
          let ipAddressArr = this.$refs.AddIP.Form.ipaddress.split('~')
          if (ipAddressArr.length === 2) {
            param.startIpaddress = ipAddressArr[0]
            param.endIpaddress = ipAddressArr[1]
            param.ipaddress = AddIP.ipaddress
            param.mxHostCount = AddIP.mxHostCount
            param.subNetAddress = AddIP.subNetAddress
            param.subNetMask = AddIP.subNetMask
          }
          param.uuids = this.IPBlockList.map(item => item.uuid)
          $axios.post('/cicollectTaskinfo/saveNetsegment', param).then(({data}) => {
            if (data.result === 'true') {
              this.$message({showClose: true, message: '添加成功', type: 'success'})
              this.IPBlockList.push({
                uuid: data.modle.uuid,
                ipAddressPart: data.modle.startIpaddress + '~' + data.modle.endIpaddress
              })
              this.$nextTick(() => {
                this.IPBlockList.forEach(row => {
                  this.$refs['sTable'].toggleRowSelection(row, true)
                })
              })
            } else {
              if (data.result === 'isExist') {
                this.$message({type: 'error', message: '该网段已存在！'})
              } else {
                this.$message({type: 'error', message: '添加失败，请重试！'})
              }
            }
          })
          this.addDialog = false
        })
      },
      handleSelectChange (val) {
        this.delIpList = val
      }
    },
    watch: {
      'taskForm.isPeriod': {
        handler: function (val) {
          val === 0 ? this.showPeriodItem = false : this.showPeriodItem = true
        },
        deep: true
      }
    }
  }
</script>
