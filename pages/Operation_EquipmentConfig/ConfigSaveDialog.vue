<template>
  <section>
    <s-collapse v-model="activeName">
      <s-collapse-item title="任务信息" name="1">
        <s-form ref="addForm" :model="form" :rules="rules" label-width="120px" class="accountAddForm">
          <s-form-item label="任务名称" prop="taskName">
            <s-input v-model="form.taskName" style="width: 250px"></s-input>
          </s-form-item>
          <s-form-item label="备份周期" prop="taskPeriod">
            <s-select v-model="form.taskPeriod" style="width: 250px">
              <s-option label="1天" :value="1"></s-option>
              <s-option label="2天" :value="2"></s-option>
              <s-option label="3天" :value="3"></s-option>
              <s-option label="4天" :value="4"></s-option>
              <s-option label="5天" :value="5"></s-option>
              <s-option label="6天" :value="6"></s-option>
              <s-option label="7天" :value="7"></s-option>
              <s-option label="15天" :value="15"></s-option>
              <s-option label="30天" :value="30"></s-option>
              <s-option label="60天" :value="60"></s-option>
              <s-option label="90天" :value="90"></s-option>
              <s-option label="180天" :value="180"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="开始时间" prop="beginTimeStr">
            <s-date-picker style="width: 250px;" type="date" :editable="false" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="form.beginTimeStr"></s-date-picker>
          </s-form-item>
          <s-form-item label="结束时间" prop="endTimeStr">
            <s-date-picker style="width: 250px;" type="date" :editable="false" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="form.endTimeStr"></s-date-picker>
          </s-form-item>
        </s-form>
      </s-collapse-item>
      <s-collapse-item title="管理资产" name="2">
        <asset-relate ref="relate" :editData="relateEditData"></asset-relate>
      </s-collapse-item>
    </s-collapse>
  </section>
</template>

<script type="text/babel">
  import { intersectObj } from 'sunflower-common-utils'
  import AssetRelate from './EquipmentRelate'
  export default {
    data() {
      let checkName = (rule, value, callback) => {
        if (value) {
          let res = value.search(/[^-|\w|\u4e00-\u9fa5]/g);
          if (res > -1) {
            callback(new Error('由中文、字母、数字、-、_组成'));
          } else {
            callback();
          }
        }
      };
      return {
        activeName: '1',
        form: {
          uuid: '',
          taskName: '',
          taskPeriod: 1,
          beginTimeStr: '',
          endTimeStr: ''
        },
        btime: '',
        etime: '',
        rules: {
          taskName: [
            {required: true, message: '请输入任务名称', trigger: 'blur'},
            {max: 30, message: '最大长度为 30', trigger: 'blur'},
            {validator: checkName, trigger: 'blur'}
          ],
          beginTimeStr: [
            {required: true, message: '请输入日期', trigger: 'change'}
          ],
          endTimeStr: [
            {required: true, message: '请输入日期', trigger: 'change'}
          ]
        },
        relateEditData: []
      }
    },
    computed: {
      assetSelection() {
        return this.$refs['relate'].selection
      }
    },
    components: {
      AssetRelate
    },
    props: {
      editData: {
        type: Object
      }
    },
    mounted() {
      if (this.editData !== undefined) {
        this.form = intersectObj(this.form, this.editData)
        this.relateEditData = this.editData.netDeviceInfoList
      }
    }
  }
</script>
