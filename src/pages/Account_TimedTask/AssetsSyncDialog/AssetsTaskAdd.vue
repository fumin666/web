<!--
 * @Author: 高建鹏
 * @Date: 2019-05-16 09:53:41
 * @LastEditors: 高建鹏
 * @Description: 新增同步任务
 * @Position:
 -->
<template>
  <s-scrollbar wrap-style="max-height: 420px;">
    <s-collapse v-model="activeName" accordion>
      <s-collapse-item title="基础设定" name="1">
        <s-form :model="collectTask" :rules="rules" label-width="120px" ref="baseForm">
          <s-form-item label="同步任务名称" prop="taskName">
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
      <s-collapse-item title="同步对象" name="2">
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
          <s-table-column
            label="账号名称"
            prop="accountName">
          </s-table-column>
          <s-table-column
            label="账号角色"
            prop="accountRoleName">
          </s-table-column>
          <s-table-column
            label="账号分类"
            prop="accountClassify">
          </s-table-column>
          <s-table-column
            label="账号类型"
            prop="accountType">
          </s-table-column>
          <s-table-column
            label="资产名称"
            prop="itcompName">
          </s-table-column>
          <s-table-column
            label="IP地址"
            prop="ipaddr">
          </s-table-column>
          <s-table-column label="资产类型" prop="citypeName">
          </s-table-column>
        </s-table-page>
      </s-collapse-item>
      <s-collapse-item title="通知方式" name="3">
        <s-form ref="form" label-width="130px" label-position="left">
          <p class="phead">邮件</p>
          <s-form-item label="启用邮件发送">
            <s-switch
              v-model="openEmail"
              on-text="ON"
              off-text="OFF">
            </s-switch>
          </s-form-item>
          <s-table-page
            v-show="openEmail"
            :data="listEmail"
            :header-actions="getEmailActionsDef()"
            :header-search="{show: false}"


            :paginationShow="false"
            @selection-change="handleEmailChange"
            key="formEmail">
            <s-table-column type="selection" width="45"></s-table-column>
            <s-table-column label="真实姓名" prop="userName"></s-table-column>
            <s-table-column label="Email" prop="userEmail"></s-table-column>
          </s-table-page>
        </s-form>
      </s-collapse-item>
    </s-collapse>
  </s-scrollbar>
</template>

<script>
  import {delDiffArray} from 'sunflower-common-utils'

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
          taskName: '',
          taskCategory: 0, // 必传参数，表示资产账号定时任务,
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
        openEmail: false, // 启用邮件发送
        listEmail: [], // email数组
        selectEmail: [], // 选中的email数组
        collectDeviceList: [], // 同步对象数据
        multipleSelection: [], // 选中的同步对象
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
      },
      emaillist(val) {
        this.listEmail = val;
      }
    },
    methods: {
      // 定义同步对象表头查询
      defSearch() {
        return {
          width: 10,
          placeholder: '请输入账号名称、类型、IP地址查询',
          searchProps: ['itcompName', 'controlAdderss', 'citypeName']
        }
      },
      handleSelectionChange(rows) {
        this.multipleSelection = rows;
      },
      getEmailActionsDef() {
        let vm = this;
        return {
          width: 24,
          actions: [{
            name: '手动增加',
            icon: 'plus',
            click() {
              vm.$emit('showEmailM');
            }
          }, {
            name: '添加引用',
            icon: 'link',
            click() {
              vm.$emit('showEmail');
            }
          }, {
            name: '删除引用',
            icon: 'delete',
            click() {
              if (vm.selectEmail.length === 0) {
                vm.$message({type: 'info', message: '请选择要删除的引用'});
              } else {
                delDiffArray(vm.listEmail, vm.selectEmail);
              }
            }
          }]
        }
      },
      handleEmailChange(val) {
        this.selectEmail = val;
      }
    },
    props: {
      emaillist: Array
    },
    created() {
      $axios.get('/assetAccount/getMonitorAccountInfoDetailList').then(res => {
        if (res.status === 200) {
          this.collectDeviceList = res.data;
        }
      })
    }
  }
</script>
