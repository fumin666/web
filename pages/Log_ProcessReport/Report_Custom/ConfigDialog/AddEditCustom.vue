<!--
 * @Author: mybells
 * @Version://清远自定义报表
 * @Description:报表中心-数据库审计-自定义报表->报表配置->添加编辑操作
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->
<template>
  <s-dialog v-model="addEditDialog" class="log_custom" :title="title" width="650px" :before-close="cancel" append-to-body>
    <s-scrollbar wrap-style="max-height:500px;padding-right:10px;">
      <s-collapse v-model="activeNames" accordion>
        <s-collapse-item title="基本信息" name="1">
          <!-- content -->
          <s-form :model="baseForm" :rules="baseRules" ref="baseForm" label-width="80px">
            <s-form-item label="报表名称" prop="name">
              <s-input v-model.trim="baseForm.name" :disabled="isAdd==='eye'"></s-input>
            </s-form-item>
            <s-form-item label="报表类型" prop="type">
              <s-select
                @change="typeChange" :disabled="isAdd==='eye'"
                v-model="baseForm.type" placeholder="请选择" style="width: 300px">
                <s-option label="审计报表" :value="0"></s-option>
                <s-option label="事件报表" :value="1"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="输出格式" prop="fileType">
              <s-select :disabled="isAdd==='eye'"
                v-model="baseForm.fileType" placeholder="请选择" style="width: 300px">
                <s-option label="PDF" :value="0"></s-option>
                <s-option label="EXCEL" :value="1"></s-option>
                <s-option label="WORD" :value="2"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="是否启用" prop="use">
              <s-radio-group v-model="baseForm.isActive" :disabled="isAdd==='eye'">
                <s-radio :label="1">是</s-radio>
                <s-radio :label="0">否</s-radio>
              </s-radio-group>
            </s-form-item>
            <s-form-item label="备注" prop="note">
              <s-input v-model="baseForm.note" :disabled="isAdd==='eye'" :rows="2" type="textarea"></s-input>
            </s-form-item>
          </s-form>
        </s-collapse-item>
        <s-collapse-item title="过滤条件" name="2">
          <!-- content -->
          <s-form :model="filterForm" :rules="filterRules" ref="filterForm" label-width="95px">
            <s-form-item label="操作类型" prop="operationTypeList">
              <s-checkbox-group v-model="filterForm.operationTypeList" :disabled="isAdd==='eye'">
                <s-checkbox :label="1">DML</s-checkbox>
                <s-checkbox :label="2">DDL</s-checkbox>
                <s-checkbox :label="3">DCL</s-checkbox>
                <s-checkbox :label="4">TCL</s-checkbox>
                <s-checkbox :label="5">OTHER</s-checkbox>
              </s-checkbox-group>
            </s-form-item>
            <s-form-item label="操作指令" prop="dboIdListStr" class="redColor">
              <s-input v-model="filterForm.dboIdListStr" :disabled="isAdd==='eye'" type="text" icon="plus" readonly :on-icon-click="openCommand"></s-input>
            </s-form-item>
            <s-form-item label="统计时间" prop="cycleTime" :required="true">
              <s-radio-group v-model="filterForm.cycleTime" :disabled="isAdd==='eye'">
                <s-radio :label="0">上一天</s-radio>
                <s-radio :label="1">上一周</s-radio>
                <s-radio :label="2">上一月</s-radio>
              </s-radio-group>
            </s-form-item>
            <s-form-item label="登录工具" prop="clientTools">
              <s-input v-model.trim="filterForm.clientTools" :disabled="isAdd==='eye'" placeholder="*"></s-input>
            </s-form-item>
            <s-form-item label="数据库账号" prop="loginName">
              <s-input v-model.trim="filterForm.loginName" :disabled="isAdd==='eye'" placeholder="*"></s-input>
            </s-form-item>
            <s-form-item label="客户端IP" prop="clientIp">
              <s-input v-model.trim="filterForm.clientIp" :disabled="isAdd==='eye'" placeholder="*"></s-input>
            </s-form-item>
            <s-form-item label="客户端MAC" prop="clientMac">
              <s-input v-model.trim="filterForm.clientMac" :disabled="isAdd==='eye'" placeholder="*"></s-input>
            </s-form-item>
            <s-form-item class="dbiUuid" label="选择数据库" prop="dbiUuid" style="margin-bottom:5px">
            </s-form-item>
            <s-table-page maxHeight="350" ref="filterTable" :data="filterDbData" :header-search="getFilterHeaderSearch()" :show-header-checkbox="isAdd!=='eye'" @selection-change="filterSelection" style="width: 100%;">
              <s-table-column type="selection" width="55" v-if="isAdd!=='eye'"></s-table-column>
              <s-table-column prop="dbiName" label="数据库名称" show-overflow-tooltip></s-table-column>
              <s-table-column prop="dbiIp" label="数据库IP" show-overflow-tooltip></s-table-column>
              <s-table-column prop="protocolName" label="数据库类型" show-overflow-tooltip></s-table-column>
            </s-table-page>
          </s-form>
        </s-collapse-item>
        <s-collapse-item title="表格信息" name="3">
          <s-form :model="tableForm" :rules="tableRules" ref="tableForm" label-width="95px">
            <s-row>
              <s-col :span="22">
                <s-transfer
                  style="text-align: left; display: inline-block"
                  :titles="['可用列', '显示列']"
                  :props="{key:'fieldName', label:'zhName',disabled:'disabled'}"
                  @change="checkChange"
                  target-order="unshift"
                  @right-check-change="rightCheckChange"
                  v-model="tableForm.selectedTableData" :data="tableData">
                </s-transfer>
              </s-col>
              <s-col :span="2">
                <div style="padding: 0 5px; text-align: center; position: relative; top: 100px;">
                  <button @click="upMove" type="button" :disabled="selectTableRow.length?false:'disabled'" :class="{'is-disabled':!selectTableRow.length}" class="s-button s-button-default s-transfer-button">
                    <span class=""><i class="iconfont icon-top"></i> <!----></span>
                  </button>
                  <button @click="downMove" type="button" :disabled="selectTableRow.length?false:'disabled'" :class="{'is-disabled':!selectTableRow.length}" class="s-button s-button-default s-transfer-button">
                    <span><i class="iconfont icon-bottom"></i></span>
                  </button>
                </div>
              </s-col>
            </s-row>
            <s-form-item label="排序" prop="type" style="margin-bottom:5px">
            </s-form-item>
            <s-row>
              <s-col :span="10">
                首先由：
                <s-select :disabled="isAdd==='eye'"
                  v-model="tableForm.column1" placeholder="请选择" style="width: 150px">
                  <s-option :disabled="tableForm.column2==item.fieldName" v-for="(item, index) in sortData" :key="index" :label="item.zhName" :value="item.fieldName"></s-option>
                </s-select>
              </s-col>
              <s-col>
                排序：
                <s-select :disabled="isAdd==='eye'"
                  v-model="tableForm.sort1" placeholder="请选择" style="width: 150px">
                  <s-option label="升序" :value="1" v-if="tableForm.column1"></s-option>
                  <s-option label="降序" :value="-1" v-if="tableForm.column1"></s-option>
                </s-select>
              </s-col>
            </s-row>
            <s-row>
              <s-col :span="10">
                其次由：
                <s-select :disabled="isAdd==='eye'"
                  v-model="tableForm.column2" placeholder="请选择" style="width: 150px">
                  <s-option :disabled="tableForm.column1==item.fieldName" v-for="(item, index) in sortData" :key="index" :label="item.zhName" :value="item.fieldName"></s-option>
                </s-select>
              </s-col>
              <s-col>
                排序：
                <s-select :disabled="isAdd==='eye'"
                  v-model="tableForm.sort2" placeholder="请选择" style="width: 150px">
                  <s-option label="升序" :value="1" v-if="tableForm.column2"></s-option>
                  <s-option label="降序" :value="-1" v-if="tableForm.column2"></s-option>
                </s-select>
              </s-col>
            </s-row>
          </s-form>
        </s-collapse-item>
        <s-collapse-item title="生成规则" name="4">
          <!-- content -->
          <s-form :model="generateForm" :rules="generateRules" ref="generateForm" label-width="95px">
            <s-form-item label="生成周期" prop="isPeriodicTask">
              <s-select :disabled="isAdd==='eye'"
                @change="generateForm.day=null"
                v-model="generateForm.isPeriodicTask" placeholder="请选择" :style="styleTask">
                <s-option label="立即" :value="0"></s-option>
                <s-option label="天" :value="1"></s-option>
              </s-select>
              <s-input :disabled="isAdd==='eye'" v-if="generateForm.isPeriodicTask==1" style="width:200px;" v-model.trim="generateForm.day" type="number"></s-input>
            </s-form-item>
            <s-form-item label="导出条数" prop="inputNum">
              <s-select :disabled="isAdd==='eye'"
                @change="generateForm.defined=null"
                v-model="generateForm.inputNum" placeholder="请选择" :style="styleInput">
                <s-option label="1000" :value="1000"></s-option>
                <s-option label="5000" :value="5000"></s-option>
                <s-option label="10000" :value="10000"></s-option>
                <s-option label="50000" :value="50000"></s-option>
                <s-option label="全部（倒出时间可能比较长）" value="all"></s-option>
                <s-option label="自定义" value="defined"></s-option>
              </s-select>
              <s-input :disabled="isAdd==='eye'" v-if="generateForm.inputNum=='defined'" style="width:200px;" v-model.trim="generateForm.defined" type="number"></s-input>
            </s-form-item>
            <s-form-item class="tReportSendTaskNotices" label="通知方式" style="margin-bottom:5px" prop="tReportSendTaskNotices">
            </s-form-item>
            <s-row>
              <s-button @click="showMyEmail" icon="plus" v-if="isAdd!='eye'">手动增加</s-button>
              <s-button @click="linkEmail" icon="link" v-if="isAdd!='eye'">添加引用</s-button>
              <s-button @click="delEmailList" icon="delete" v-if="isAdd!='eye'">删除引用</s-button>
            </s-row>
            <s-table-page :data="generateForm.tReportSendTaskNotices"
                        :row-actions="getRowActionsDef()"
                        @selection-change="handleEmailSelect" style="width:100%;">
              <s-table-column type="selection" width="55" v-if="isAdd !== 'eye'"></s-table-column>
              <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
              <s-table-column label="Email" prop="userMail"></s-table-column>
            </s-table-page>
          </s-form>
        </s-collapse-item>
      </s-collapse>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="validateForm">确 定</s-button>
      <s-button type="cancel" @click="cancel">取 消</s-button>
    </template>
    <!-- 选择指令 -->
    <CommandDialog v-if="selectCommandDialog" :selectCommandDialog.sync="selectCommandDialog" :data="filterForm.operationTypeList" :selectData="commandData" @commandReload="commandReload"></CommandDialog>
    <!--手动邮件-->
    <s-dialog v-model="bloomEmail" v-if="bloomEmail" title="邮件" append-to-body>
      <my-email ref="myEmail"></my-email>
      <template slot="footer">
        <s-button @click="myEmailOk">确定</s-button>
        <s-button type="cancel" @click="bloomEmail = false">取消</s-button>
      </template>
    </s-dialog>
    <!--添加引用-->
    <s-dialog v-model="bloomUser" v-if="bloomUser" title="账号" width="800px" append-to-body>
      <my-user :data="userList" :has-select="hasSelectUser" type="listEmail" ref="myUser"></my-user>
      <template slot="footer">
        <s-button @click="myUserOk">确定</s-button>
        <s-button type="cancel" @click="bloomUser = false">取消</s-button>
      </template>
    </s-dialog>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import CommandDialog from './CommandDialog'
  import MyEmail from './MyEmail.vue'
  import MyUser from './MyUser.vue'
  import baseFormMixin from './mixins/baseFormMixin'
  import filterFormMixin from './mixins/filterFormMixin'
  import tableFormMixin from './mixins/tableFormMixin'
  import generateFormMixin from './mixins/generateFormMixin'
  import {cloneDeep} from 'lodash'
  export default {
    mixins: [baseFormMixin, filterFormMixin, tableFormMixin, generateFormMixin],
    components: {
      CommandDialog,
      MyUser,
      MyEmail
    },
    props: {
      addEditDialog: Boolean,
      isAdd: String,
      rowUuid: String
    },
    data() {
      return {
        activeNames: '1',
        editData: {},
        allCommandData: {}
      }
    },
    computed: {
      title() {
        if (this.isAdd === 'add') {
          return '添加';
        } else if (this.isAdd === 'edit') {
          return '编辑'
        } else if (this.isAdd === 'eye') {
          return '查看'
        }
      }
    },
    created() {
      this.getUsers();// 获取人员引用信息
      if (this.isAdd === 'add') {
        Promise.all([this.getFilterDbData(), this.getTableData(0)]).then(([dbData, tableData]) => {
          this.filterDbData = dbData.data || [];
          this.tableData = tableData.data || [];
        })
      } else if (this.isAdd === 'edit' || this.isAdd === 'eye') {
        Promise.all([this.getAllCommand(), this.getFilterDbData(), this.getTableData(0), this.getEditData()]).then(([commandData, dbData, tableData, editData]) => {
          let arr = {};
          let obj = {
            '1': 'DML',
            '2': 'DDL',
            '3': 'DCL',
            '4': 'TCL',
            '5': 'OTHER'
          }
          for (let key in commandData.data || []) {
            arr[obj[key]] = commandData.data[key];
          }
          this.allCommandData = cloneDeep(arr);// 全部操作指令
          this.filterDbData = dbData.data || [];// 过滤条件数据库数据
          if (this.isAdd === 'eye') {
            (tableData.data || []).forEach(element => {
              element.disabled = true;
            });
          }
          this.tableData = tableData.data || [];// 表格信息
          this.dealEditData(editData.data);// 回显编辑数据
        })
      }
    },
    methods: {
      getAllCommand() {
        return $axios.post('/dbaCustomReport/getOperations', [1, 2, 3, 4, 5]);
      },
      // 获取编辑数据
      getEditData() {
        return $axios.get(`/dbaCustomReport/getTaskDetail/${this.rowUuid}`);
      },
      dealEditData(data) {
        if (data) {
          this.editData = cloneDeep(data);
          /* 基本信息 */
          this.baseForm = {
            name: data.name,
            type: data.type,
            fileType: data.fileType,
            isActive: data.isActive,
            note: data.note
          }
          /* 过滤条件 */
          this.filterForm = {
            operationTypeList: data.dbaCustomReportWhere.operationTypeList,
            dboIdListStr: data.dbaCustomReportWhere.dboId,
            cycleTime: data.dbaCustomReportWhere.cycleTime,
            clientTools: data.dbaCustomReportWhere.clientTools,
            loginName: data.dbaCustomReportWhere.loginName,
            clientIp: data.dbaCustomReportWhere.clientIp,
            clientMac: data.dbaCustomReportWhere.clientMac
            // dbiUuid: data.dbaCustomReportWhere.dbiUuid,
          }
          // 设置指令选中数据
          if (data.dbaCustomReportWhere.dboIdList) {
            let commandData = {}
            let list = data.dbaCustomReportWhere.dboIdList || [];
            let allComData = this.allCommandData;
            for (let key of list) {
              for (let name in allComData) {
                let arr = allComData[name];
                let obj = arr.find(item => item.dbo_id === key);
                if (obj) {
                  commandData[name] ? commandData[name].push(obj.dbo_id + '-' + obj.dboKeyAndDboExpand) : commandData[name] = [obj.dbo_id + '-' + obj.dboKeyAndDboExpand];
                  break;
                }
              }
            }
            this.commandData = commandData;
          }
          // 勾选数据库
          let dbiUuid = [];
          if (data.dbaCustomReportWhere.dbiUuid) {
            let temp = data.dbaCustomReportWhere.dbiUuid.split(',');
            this.$nextTick(() => {
              for (let i = 0; i < temp.length; i++) {
                for (let j = 0; j < this.filterDbData.length; j++) {
                  if (this.filterDbData[j].dbiUuid === temp[i]) {
                    dbiUuid.push(this.filterDbData[j])
                    this.$refs.filterTable.toggleRowSelection(this.filterDbData[j], true);
                    break;
                  }
                }
              }
              if (this.isAdd === 'eye') {
                this.filterDbData = this.filterForm.dbiUuid;
              }
            })
          }
          /* 表格信息 */
          this.tableForm.selectedTableData = data.dbaCustomReportField.selectFieldList || [];
          if (data.dbaCustomReportField.sortField) {
            let sortField = data.dbaCustomReportField.sortField.split(';');
            let col1 = sortField[0];
            this.tableForm.column1 = col1.split(',')[0];
            this.tableForm.sort1 = parseInt(col1.split(',')[1]);
            if (sortField.length >= 2) {
              let col2 = sortField[1]
              this.tableForm.column2 = col2.split(',')[0]
              this.tableForm.sort2 = parseInt(col2.split(',')[1]);
            }
          }
          /* 生成规则 */
          let dbaCustomReportNotice = (data.dbaCustomReportNotice || []).map(item => {
            item.userRealName = item.userName;
            item.userMail = item.userEmail;
            return item;
          })
          let inputNum;
          let defined = null;
          if (data.inputNum === 1000 || data.inputNum === 5000 || data.inputNum === 10000 || data.inputNum === 50000) {
            inputNum = data.inputNum;
          } else if (data.inputNum) {
            defined = data.inputNum;
            inputNum = 'defined';
          } else {
            inputNum = 'all';
          }
          this.generateForm = {
            isPeriodicTask: data.isPeriodicTask,
            day: data.tScheduleTime ? data.tScheduleTime.day : null,
            inputNum: inputNum,
            defined: defined,
            tReportSendTaskNotices: dbaCustomReportNotice
          }
        }
      },
      validateForm() {
        if (this.isAdd === 'eye') {
          this.$emit('update:addEditDialog', false)
        }
        let form = {};
        this.$refs.baseForm.validate(valid1 => { // 基本信息
          if (!valid1) {
            this.activeNames = '1';
            this.$message({ message: '请按照要求填写信息！', type: 'warning' });
            return;
          }
          form = Object.assign({}, this.baseForm);
          this.$refs.filterForm.validate(valid2 => { // 过滤条件
            if (!valid2) {
              this.activeNames = '2';
              this.$message({ message: '请按照要求填写信息！', type: 'warning' });
              return;
            }
            let dboIdList = Object.keys(this.commandData).reduce((m, val) => {
              m.push(...(this.commandData[val].map(item => parseInt(item.split('-')[0]))))
              return m
            }, [])
            form.dbaCustomReportWhere = {
              operationTypeList: this.filterForm.operationTypeList,
              dboIdList: dboIdList,
              cycleTime: this.filterForm.cycleTime,
              clientTools: this.filterForm.clientTools,
              loginName: this.filterForm.loginName,
              clientIp: this.filterForm.clientIp,
              clientMac: this.filterForm.clientMac,
              dbiUuid: (this.filterForm.dbiUuid.map(item => item.dbiUuid)).join(',')
            }
            this.$refs.tableForm.validate(valid3 => { // 表格信息
              if (!valid3) {
                this.activeNames = '3';
                this.$message({ message: '请按照要求填写信息！', type: 'warning' });
                return;
              }
              if (!this.tableForm.selectedTableData.length) {
                this.$message({ message: '至少选择一列！', type: 'warning' });
                this.activeNames = '3';
                return;
              }
              let str = '';
              if (this.tableForm.column1 && this.tableForm.sort1) {
                str += this.tableForm.column1 + ',' + this.tableForm.sort1 + ';';
              }
              if (this.tableForm.column2 && this.tableForm.sort2) {
                str += this.tableForm.column2 + ',' + this.tableForm.sort2 + ';';
              }
              form.dbaCustomReportField = {
                selectFieldList: this.tableForm.selectedTableData,
                sortField: str || null
              }
              this.$refs.generateForm.validate(valid4 => { // 生成规则
                if (!valid4) {
                  this.activeNames = '4';
                  this.$message({ message: '至少选择一列！', type: 'warning' });
                  return;
                }
                form.dbaCustomReportNotice = this.generateForm.tReportSendTaskNotices.map(item => {
                  if (item.userUuid) {
                    return {userEmail: item.userMail, userName: item.userRealName, userUuid: item.userUuid}
                  } else {
                    return {userEmail: item.userMail, userName: item.userRealName}
                  }
                });
                form.isPeriodicTask = this.generateForm.isPeriodicTask
                if (this.generateForm.isPeriodicTask === 1) {
                  let time = parseInt((new Date().getTime() / 1000) + 3600 * 3);// 3小时后执行
                  form.tScheduleTime = {timeType: 1, day: parseInt(this.generateForm.day), isForever: 1, firstFireTime: time}
                } else {
                  form.tScheduleTime = null
                }
                if (this.generateForm.inputNum === 'defined') {
                  form.inputNum = this.generateForm.defined
                } else if (this.generateForm.inputNum === 'all') {
                  form.inputNum = null;
                } else {
                  form.inputNum = parseInt(this.generateForm.inputNum);
                }
                this.save(form);
              })
            })
          })
        })
      },
      save(form) {
        if (this.isAdd === 'add') {
          $axios.post(`/dbaCustomReport/saveTask`, form, {
            data: [form],
            logTemplate: '添加|自定义报表(#name#)'
          }).then(({data}) => {
            if (data.state === true) {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.$emit('update:addEditDialog', false)
              this.$emit('reload');
            } else {
              this.$message({
                type: 'error',
                message: data.errormsg
              })
            }
          })
        } else if (this.isAdd === 'edit') {
          let obj = this.editData
          let params = Object.assign({}, obj, form);
          params.dbaCustomReportWhere = Object.assign({}, obj.dbaCustomReportWhere, form.dbaCustomReportWhere)
          params.dbaCustomReportField = Object.assign({}, obj.dbaCustomReportField, form.dbaCustomReportField)
          params.dbaCustomReportNotice = form.dbaCustomReportNotice
          $axios.post(`/dbaCustomReport/modifyTask`, params, {
            data: [params],
            logTemplate: '编辑|自定义列表(#name#)'
          }).then(({data}) => {
            if (data.state === true) {
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
              this.$emit('update:addEditDialog', false)
              this.$emit('reload');
            } else {
              this.$message({
                type: 'error',
                message: data.errormsg
              })
            }
          })
        }
      },
      cancel() {
        this.$emit('update:addEditDialog', false)
      }
    }
  }
</script>

<style lang="stylus">
.log_custom{
  .s-transfer-panel{
    width:190px;
  }
  .redColor{
    .s-form-item-label{
      padding-left:11px;
    }
  }
  .redColor:before{
    content:'*';
    position: absolute;
    color: red;
    top:7px;
  }
  .dbiUuid,.tReportSendTaskNotices{
    .s-form-item-error{
      top:14px;
    }
  }
}
</style>
