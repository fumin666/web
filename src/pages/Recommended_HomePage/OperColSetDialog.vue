/**
* Created by songyf on 2019/7/22.
* 运维中心-运维资产-动态列
*/
<template>
  <s-dialog v-model="dialogFlag" title="添加" class="operColSetDialog" width="450px" top="142px">
    <div class="setDataPage">
      <s-table
        :data="setData"
        @selection-change="handleSelectionChange"
        ref="operationPage"
        style="width: 100%">
        <s-table-column
          type="selection"
          width="40">
        </s-table-column>
        <s-table-column
          prop="colName"
          label="运维列表页面设置"
          width="150">
        </s-table-column>
        <s-table-column
          label="列号">
          <template slot-scope="scope">
            <s-input-number :min="1" :max="100"  v-model="scope.row.order"></s-input-number>
          </template>
        </s-table-column>
      </s-table>
      <s-form ref="form" :model="sysOperSet" label-width="140px" >
        <s-form-item label="默认排序列">
          <s-select v-model="sysOperSet.orderCol">
            <s-option v-for="item in setData" :key="item.id" :label="item.colName" :value="item.colKey"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="排序方式">
          <s-select v-model="sysOperSet.orderType">
            <s-option label="降序" :value="0"></s-option>
            <s-option label="升序" :value="1"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item>
          <s-button @click="saveSetForm">保存</s-button>
        </s-form-item>
      </s-form>
    </div>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {intersectObj} from 'sunflower-common-utils'
  import _ from 'lodash';
  export default {
    data() {
      return {
        dialogFlag: false,
        setData: [],
        multipleSelection: [],
        sysOperSet: {
          orderCol: '',
          orderType: ''
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.getSetForm()
    },
    methods: {
      getSetForm() {
        let that = this
        let selected = []
        $axios.get('/operationSettings/listOperPage').then((res) => {
          that.setData = res.data.sysOperList
          for (let i of that.setData) {
            if (i.status === 1) {
              selected.push(i)
            }
          }
          that.sysOperSet = intersectObj(that.sysOperSet, res.data.sysOperSet)
          that.$nextTick(() => {
            selected.forEach(row => {
              that.$refs.operationPage.toggleRowSelection(row);
            });
          })
        })
      },
      handleSelectionChange(val) {
        let noSelectVal = _.difference(this.setData, val)
        noSelectVal.forEach(val => {
          val.status = 0
        })
        val.forEach(val => {
          val.status = 1
        })
        this.multipleSelection = noSelectVal.concat(val);
      },
      saveSetForm() {
        let addForm = Object.assign({}, {sysOperList: this.multipleSelection}, {sysOperSet: this.sysOperSet})
        $axios.post('/operationSettings/saveSysOper', addForm, {
          logTemplate: '编辑|运维页面设置'
        }).then((res) => {
          if (res.data === 'success') {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.$emit('refreshColData');
            this.dialogFlag = false;
          } else {
            this.$message({
              message: '请至少勾选一个',
              type: 'error'
            });
          }
        });
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    }
  }
</script>

<style lang="stylus">
  .operColSetDialog
    .s-dialog
      left: auto;
      right: 10px;
      transform: none
      .s-form-item
        padding-left 55px
        .s-form-item-content
          margin-left: 150px!important

</style>
