<!--
 * @Author: songyf
 * @Date: 2020-1-19
 * @LastEditors: songyf
 * @Description: 安全通报-安全通报任务-查看通报下发
 -->
<template>
  <s-dialog v-model="dialogFlag" title= "查看" width="750px" append-to-body class="release-bulletin">
    <s-scrollbar wrap-class="default-dialog-scroll">

      <s-collapse accordion class="" v-model="activeNames">
        <s-collapse-item title="通报内容" name="bulletinContent">
          <s-form :model="bulletinForm" ref="contentForm" :rules="bulletinRules" label-width="135px">
            <s-form-item label="通报类型" prop="typeUuid">
              <s-select v-model="bulletinForm.typeUuid" :disabled="isView">
                <s-option v-for="(item, index) in safeTypeList" :label="item.bulletinName"
                          :value="item.uuid" :key="index"></s-option>
              </s-select>
            </s-form-item>
            <!--自定义表单-->
            <custom-form ref="customRef" :customData="customData" :isView="isView"></custom-form>
          </s-form>
        </s-collapse-item>
        <s-collapse-item title="通报任务" name="bulletinTask">
          <s-form :model="bulletinForm" ref="taskForm" :rules="bulletinRules" label-width="135px">
            <s-form-item label="是否周期任务" class="required-tips">
              <s-radio-group v-model="bulletinForm.cycleTaskStatus" :disabled="isView">
                <s-radio :label="0">否</s-radio>
                <s-radio :label="1">是</s-radio>
              </s-radio-group>
            </s-form-item>
            <s-period
              v-if="bulletinForm.cycleTaskStatus === 1"
              v-model="bulletinForm.tScheduleTime"
              :showTimeItem="false"
              :disableFromProp="true"
              :showPeriodItem="showPeriodItem" ref="period"></s-period>
            <s-form-item label="下发时间" prop="startTime">
              <s-date-picker style="width: 250px"
                             class="fl"
                             v-model="bulletinForm.startTime"
                             value-format="yyyy-MM-dd HH:mm:ss"
                             format="yyyy-MM-dd HH:mm:ss"
                             :editable="false"
                             type="datetime"
                             placeholder="选择日期" :disabled="isView"></s-date-picker>
              <div style="float: left;margin-left: 8px; line-height: 36px">
                <s-checkbox v-model="immediatelyIssued" :disabled="isView">立即下发</s-checkbox>
              </div>
            </s-form-item>
            <s-form-item label="启动时间" prop="orderStartTime">
              <s-date-picker style="width: 250px"
                             class="fl"
                             v-model="bulletinForm.orderStartTime"
                             value-format="yyyy-MM-dd HH:mm:ss"
                             format="yyyy-MM-dd HH:mm:ss"
                             :editable="false"
                             type="datetime"
                             placeholder="选择日期" :disabled="isView"></s-date-picker>
              <div style="float: left;margin-left: 8px; line-height: 36px">
                <s-checkbox v-model="immediatelyStart" :disabled="isView">立即启动</s-checkbox>
              </div>
            </s-form-item>
            <s-form-item label="结束时间" prop="endTime">
              <s-date-picker
                style="width: 250px"
                class="fl"
                v-model="bulletinForm.endTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :editable="false"
                type="datetime"
                placeholder="选择日期" :disabled="isView">
              </s-date-picker>
              <div style="float: left;margin-left: 8px; line-height: 36px" v-if="bulletinForm.cycleTaskStatus === 1">
                <s-checkbox v-model="nerverEnd" :disabled="isView">永不结束</s-checkbox>
              </div>
            </s-form-item><s-form-item label="单次任务持续天数" prop="onceTaskTime" v-if="bulletinForm.cycleTaskStatus === 1">
            <s-input v-model="bulletinForm.onceTaskTime" :disabled="isView"></s-input>
          </s-form-item>
          </s-form>
        </s-collapse-item>
        <s-collapse-item title="通报对象" name="bulletinObject">
          <s-form :model="bulletinForm" ref="objectForm" :rules="bulletinRules" label-width="135px">
            <s-form-item label="下发方式" prop="excutorType" class="required-tips">
              <s-radio-group v-model="bulletinForm.excutorType" :disabled="isView">
                <s-radio :label="1">按部门下发</s-radio>
                <s-radio :label="2">按角色下发</s-radio>
                <s-radio :label="3">按人员下发</s-radio>
              </s-radio-group>
            </s-form-item>
            <s-form-item label="选择部门" prop="departUuidList" v-if="bulletinForm.excutorType === 1">
              <s-select v-model="bulletinForm.departUuidList" multiple collapse-tags filterable clearable :disabled="isView">
                <s-option v-for="(item, index) in departmentList" :label="item.departName"
                          :value="item.uuid" :key="index"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="选择角色" prop="roleUuidList" v-if="bulletinForm.excutorType === 2">
              <s-select v-model="bulletinForm.roleUuidList" multiple collapse-tags filterable clearable :disabled="isView">
                <s-option v-for="(item, index) in safeRoleList" :label="item.roleName"
                          :value="item.roleUuid" :key="index"></s-option>
              </s-select>
            </s-form-item>
            <!--人员列表-->
            <div v-if="bulletinForm.excutorType === 3">
              <s-table-page
                :header-search="getHeaderSearch()"
                :data="rowData.userList">
                <s-table-column prop="userRealName" label="真实姓名" show-overflow-tooltip>
                </s-table-column>
                <s-table-column prop="userLoginName" label="账号名称" show-overflow-tooltip>
                </s-table-column>
                <s-table-column prop="departName" label="所属机构" show-overflow-tooltip>
                </s-table-column>
              </s-table-page>
            </div>
          </s-form>
        </s-collapse-item>
        <s-collapse-item title="任务启动/结束邮件通知" name="bulletinNotice">
          <s-form :model="bulletinForm" ref="noticeForm" :rules="bulletinRules" label-width="135px">
            <s-form-item label="发送任务启动通知">
              <s-switch v-model="bulletinForm.safeTaskEmailNotice.startNoticeStatus" :active-value="1"
                        :inactive-value="0" :disabled="isView">
              </s-switch>
            </s-form-item>
            <s-form-item label="提前通知时间" prop="safeTaskEmailNotice.startValue" v-if="bulletinForm.safeTaskEmailNotice.startNoticeStatus === 1">
              <s-input v-model="bulletinForm.safeTaskEmailNotice.startValue" style="width: 200px" :disabled="isView"></s-input>
              <s-select v-model="bulletinForm.safeTaskEmailNotice.startUnit" style="width: 200px; margin-left: 20px" :disabled="isView">
                <s-option label="天" :value="1"></s-option>
                <s-option label="时" :value="2"></s-option>
                <s-option label="分" :value="3"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="发送任务结束通知">
              <s-switch v-model="bulletinForm.safeTaskEmailNotice.endNoticeStatus" :active-value="1"
                        :inactive-value="0" :disabled="isView">
              </s-switch>
            </s-form-item>
            <s-form-item label="提前通知时间" prop="safeTaskEmailNotice.endValue" v-if="bulletinForm.safeTaskEmailNotice.endNoticeStatus === 1">
              <s-input v-model="bulletinForm.safeTaskEmailNotice.endValue" style="width: 200px" :disabled="isView"></s-input>
              <s-select v-model="bulletinForm.safeTaskEmailNotice.endUnit" style="width: 200px; margin-left: 20px" :disabled="isView">
                <s-option label="天" :value="1"></s-option>
                <s-option label="时" :value="2"></s-option>
                <s-option label="分" :value="3"></s-option>
              </s-select>
            </s-form-item>
          </s-form>
        </s-collapse-item>
      </s-collapse>
    </s-scrollbar>
  </s-dialog>
</template>
<script>
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import sPeriod from '@/components/periodFormItem/Period'
  import customForm from './CustomForm';
  import AddReleaseMixin from './AddReleaseMixin';

  export default {
    mixins: [AddReleaseMixin],
    components: {
      customForm,
      sPeriod,
      RealPageTable
    },
    data() {
      return {
        dialogFlag: false,
        activeNames: 'bulletinContent',
        axiosUrl: '/safetyPlatform/bulletinIssuedTask/saveBulletinIssuedTask',
        ajaxObj: { // 人员数据
          type: 'post',
          url: '/safetyPlatform/bulletinIssuedTask/getSafeUserListByCriteria',
          checkedUuidArr: [], // 初始要回显选中的行
          params: {
            condition: {
            }
          }
        },
        searchKey: '',
        selections: [],
        customData: [],
        safeTypeList: [],
        safeRoleList: [],
        departmentList: []
      }
    },
    props: {
      isView: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      /* 是否可以勾选 */
      isSelectable(row) {
        return false
      },
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入查询内容',
          searchProps: ['userRealName', 'userLoginName', 'departName']
        }
      }
    }
  }
</script>

<style lang="stylus">
  .release-bulletin
    .s-form-item-label
      width 135px!important
</style>
