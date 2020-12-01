<!--
 * @Author: 高建鹏
 * @Date: 2019-05-16 09:53:41
 * @LastEditors: 高建鹏
 * @Description: 新增稽核任务
 * @Position:
 -->
<template>
  <s-scrollbar wrap-style="max-height: 420px;">
    <s-collapse v-model="activeName" accordion>
      <s-collapse-item title="基础设定" name="1">
        <s-form :model="collectTask" :rules="rules" label-width="120px" ref="baseForm">
          <s-form-item label="稽核任务名称" prop="taskName">
            <s-input v-model="collectTask.taskName"></s-input>
          </s-form-item>
          <s-form-item label="是否周期任务" prop="taskType">
            <s-radio-group v-model="collectTask.taskType">
              <s-radio :label="0">否</s-radio>
              <s-radio :label="1">是</s-radio>
            </s-radio-group>
          </s-form-item>
          <s-period v-model="collectTask.tScheduleTime" :showPeriodItem="showPeriodItem" :isShowNow="'is-show-now'" ref="period"></s-period>
          <s-form-item label="备注" prop="remark">
            <s-input type="textarea" v-model="collectTask.remark"></s-input>
          </s-form-item>
        </s-form>
      </s-collapse-item>
      <s-collapse-item title="稽核对象" name="2">
        <s-table-page
          ref="multipleTable"
          :data="collectDeviceList"
          :show-header-checkbox="true"
          :header-search="defSearch()"
          @selection-change="handleSelectionChange">
          <s-table-column
            type="selection"
            width="45">
          </s-table-column>
          <s-table-column label="业务名称" prop="name">
          </s-table-column>
          <s-table-column label="备注" prop="remark">
          </s-table-column>
        </s-table-page>
      </s-collapse-item>
    </s-collapse>
  </s-scrollbar>
</template>

<script>
  import sPeriod from '@/components/periodFormItem/Period'
  import $axios from 'sunflower-ajax';

  export default {
    components: {
      sPeriod
    },
    data() {
      return {
        activeName: '1',
        showPeriodItem: false, // 是否启动周期时间
        // 基础设定
        collectTask: {
          taskCategory: 1, // 必传参数，表示业务角色稽核任务
          taskName: '',
          taskType: 0,
          remark: '',
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
          }
        },
        collectDeviceList: [], // 稽核对象数据
        multipleSelection: [], // 选中的稽核对象
        rules: {
          taskName: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 32, message: '最大长度为32', trigger: 'blur'}
          ],
          remark: [{max: 120, message: '不能超过120个字符', trigger: 'blur'}]
        }
      }
    },
    watch: {
      'collectTask.taskType': {
        handler: function (val) {
          val === 0 ? this.showPeriodItem = false : this.showPeriodItem = true
        },
        deep: true
      }
    },
    methods: {
      // 定义稽核对象表头查询
      defSearch() {
        return {
          width: 10,
          placeholder: '请输入业务名称查询',
          searchProps: ['name']
        }
      },
      handleSelectionChange(rows) {
        this.multipleSelection = rows;
      }
    },
    created() {
      $axios.get('/iamBusinessSystem/list').then(res => {
        if (res.status === 200) {
          this.collectDeviceList = res.data;
        }
      })
    }
  }
</script>
