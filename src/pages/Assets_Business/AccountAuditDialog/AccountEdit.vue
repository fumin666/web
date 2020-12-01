<!--
 * @Author: 高建鹏
 * @Date: 2019-05-16 09:53:41
 * @LastEditors: 高建鹏
 * @Description: 编辑查看稽核任务
 * @Position:
 -->
<template>
  <s-scrollbar wrap-style="max-height: 420px;">
    <s-collapse v-model="activeName" accordion>
      <s-collapse-item title="基础设定" name="1">
        <s-form :model="collectTask" :rules="rules" label-width="120px" ref="baseForm">
          <s-form-item label="稽核任务名称" prop="taskName">
            <s-input v-model="collectTask.taskName" :disabled="!isShow"></s-input>
          </s-form-item>
          <s-form-item label="是否周期任务" prop="taskType">
            <s-radio-group v-model="collectTask.taskType" :disabled="!isShow">
              <s-radio :label="0">否</s-radio>
              <s-radio :label="1">是</s-radio>
            </s-radio-group>
          </s-form-item>
          <s-period v-model="collectTask.tScheduleTime" :showPeriodItem="showPeriodItem" :disableFromProp="!isShow" :isShowNow="'is-show-now'" ref="period"></s-period>
          <s-form-item label="备注" prop="remark">
            <s-input type="textarea" v-model="collectTask.remark" :disabled="!isShow"></s-input>
          </s-form-item>
        </s-form>
      </s-collapse-item>
      <s-collapse-item title="稽核对象" name="2">
        <s-table-page
          ref="multipleTablex"
          :data="collectDeviceList"
          :show-header-checkbox="true"
          :header-search="defSearch()"
          @selection-change="handleSelectionChange">
          <s-table-column
            type="selection"
            width="45"
            v-if="isShow">
          </s-table-column>
          <s-table-column label="业务名称" prop="name">
          </s-table-column>
          <s-table-column label="备注" prop="remark">
          </s-table-column>
        </s-table-page>
      </s-collapse-item>
      <s-collapse-item title="通知方式" name="3">
        <s-form ref="form" label-width="130px" label-position="left">
          <p class="phead">邮件</p>
          <s-form-item label="启用邮件发送">
            <s-switch
              :disabled="!isShow"
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
  import {cloneDeep} from 'lodash'
  import {delDiffArray} from 'sunflower-common-utils'
  import sPeriod from '@/components/periodFormItem/Period'
  import $axios from 'sunflower-ajax';

  export default {
    components: {
      sPeriod
    },
    data() {
      return {
        isShow: true, // 是否置灰不可选
        activeName: '1',
        showPeriodItem: false, // 是否启动周期时间
        // 基础设定
        collectTask: {
          uuid: '',
          taskCategory: 2, // 必传参数，表示业务账号稽核任务,
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
        openEmail: false, // 启用邮件发送
        listEmail: this.emaillist, // email数组
        selectEmail: [], // 选中的email数组
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
      },
      defaultData: {
         handler (value) {

        },
        immediate: true
      },
      emaillist(val) {
        this.listEmail = val;
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
      },
      getEmailActionsDef() {
        let vm = this;
        if (this.isShow) {
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
        } else {
          return {}
        }
      },
      handleEmailChange(val) {
        this.selectEmail = val;
      },
      setData1() {
        let _self = this
        let val = cloneDeep(_self.defaultData);
        if (val.commonTask) {
          _self.collectTask.uuid = val.commonTask.uuid;
          _self.collectTask.taskName = val.commonTask.taskName;
          _self.collectTask.taskType = val.commonTask.taskType;
          _self.collectTask.remark = val.commonTask.remark;
          _self.collectTask.tScheduleTime = val.tScheduleTime;
        }

        if (val.noticesList && val.noticesList.length > 0) {
          _self.openEmail = true;
          let emailarr = val.noticesList;
          _self.listEmail = emailarr.map(function(item) {
            item.userEmail = item.noticeUserEmail;
            item.userName = item.noticeUserName;
            item.userUuid = item.noticeUserUuid;
            return item;
          })
        }
      },
      setData2() {
        let _self = this
        let val = cloneDeep(_self.defaultData);
        let arrlist = [];
        if (val.relObjlist && val.relObjlist.length > 0) {
          arrlist = val.relObjlist;
        }
        if (_self.isShow) { // 编辑
          arrlist.forEach(function(item) {
            _self.collectDeviceList.forEach(function(obj) {
              if (obj.uuid === item.uuid) {
                _self.$nextTick(function() {
                  _self.$refs.multipleTablex.toggleRowSelection(obj, true);
                })
              }
            })
          })
        } else { // 查看
          _self.collectDeviceList = arrlist;
        }
      }
    },
    props: {
      defaultData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      type: {
        type: String
      },
      emaillist: Array
    },
    created() {
      if (this.type === 'see') {
        this.isShow = false;
        this.setData2();
      } else {
        this.isShow = true;
        $axios.get('/iamBusinessSystem/list').then(res => {
          if (res.status === 200) {
            this.collectDeviceList = res.data;
          }
          this.setData2();
        })
      }
      this.setData1();
    }
  }
</script>
