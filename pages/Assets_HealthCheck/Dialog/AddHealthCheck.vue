<!--
 * @Version: //Q4手风琴样式
 -->
<template>
  <section id="addHealthCheck">
    <s-collapse v-model="activeNames" accordion>
      <s-collapse-item title="基础设置" name="base">
        <s-form
          ref="addBaseSetForm"
          :model="addBaseSetForm"
          :rules="addBaseSetFormRules"
          label-width="100px">
          <s-form-item label="检查名称：" prop="taskName">
            <s-input v-model="addBaseSetForm.taskName"></s-input>
          </s-form-item>
          <!--<s-form-item label="备注：" prop="remark">-->
            <!--<s-input v-model="addBaseSetForm.remark"></s-input>-->
          <!--</s-form-item>-->
        </s-form>
      </s-collapse-item>
      <s-collapse-item title="检查对象" name="checkObj">
          <check-object-table ref="checkObjectTable"></check-object-table>
      </s-collapse-item>
      <s-collapse-item title="通知方式" name="notify">
        <!-- <s-scrollbar wrap-style="max-height:400px;"> -->
          <s-row class="title">邮件</s-row>
          <s-row>
            <s-col span="8">启用邮件发送</s-col>
            <s-col span="16"><s-switch v-model="openEmail"></s-switch></s-col>
          </s-row>
          <s-row v-show="openEmail">
            <s-table-page
              maxHeight="300"
              :data="quoteList"
              :header-search="getSearchDef()"
              :header-actions="getActionsDef()"
              @selection-change="quoteSelectionChange">
              <s-table-column type="selection" width="45" align="center"></s-table-column>
              <s-table-column label="真实姓名" prop="accountName"></s-table-column>
              <s-table-column label="Email" prop="email"></s-table-column>
            </s-table-page>
          </s-row>
        <!-- </s-scrollbar> -->
      </s-collapse-item>
    </s-collapse>

    <s-row class="footerRow">
      <s-button @click="saveAddHealthCheck" :disabled="btnDisabled">确定</s-button>
      <s-button type="cancel" @click="cancelAddHealthCheck">取消</s-button>
    </s-row>

    <!--手动添加-->
    <add-quote-manual-dialog
      v-model="addQuoteManualDialog"
      v-if="addQuoteManualDialog"
      @add-quote="addQuoteManualCb">
    </add-quote-manual-dialog>

    <!--添加引用-->
    <add-quote-auto-dialog
      v-model="addQuoteAutoDialog"
      v-if="addQuoteAutoDialog"
      :user-list="userList"
      :has-select="hasSelectUser"
      @add-quote="addQuoteAutoCb">
    </add-quote-auto-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  import CheckObjectTable from './CheckObjectTable';
  import AddQuoteAutoDialog from './AddQuoteAutoDialog';
  import AddQuoteManualDialog from './AddQuoteManualDialog';

  export default{
    data() {
      let checkName = (rule, value, callback) => {
        if (value) {
          $axios.get(`/assetHealthTask/checkTaskName/${value}`).then((res) => {
            if (res.data.state) {
              callback()
            } else {
              callback(new Error('该名称已存在！'));
            }
          })
        } else {
          callback(new Error('不能为空'));
        }
      };
      return {
        btnDisabled: false,
        activeNames: ['base'],      // 默认展开面板
        // 基础设置-设置表单
        addBaseSetForm: {
          taskName: '',
          remark: ''
        },
        // 基础设置-设置表单验证规则
        addBaseSetFormRules: {
          taskName: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { max: 30, message: '最大长度为30', trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9_\-\.$][a-zA-Z0-9_\-\s\.@\\$]{0,29}$/, message: '只能由字母、数字、符号[_-.]构成', trigger: 'blur' },
            {validator: checkName, trigger: 'blur'}
          ]
        },
        openEmail: false,               // 通知方式-是否启用邮件
        quoteList: [],                  // 通知方式-表格列表
        quoteManualList: [],            // 通知方式-手动添加列表
        quoteAutoList: [],              // 通知方式-自动引用的列表
        quoteSelections: [],            // 通知方式-引用表格列表多选值
        addQuoteManualDialog: false,    // 通知方式-手动添加弹框
        addQuoteAutoDialog: false,      // 通知方式-添加引用弹框
        userList: []                    // 通知方式-引用列表
      }
    },
    components: {

      CheckObjectTable,
      AddQuoteAutoDialog,
      AddQuoteManualDialog
    },
    computed: {
      // 已经引用的
      hasSelectUser() {
        return this.quoteList.filter(item => item.accountUuid)
      },
      // 通知方式-表格影展示的数据
      quoteListTemp() {
        return this.quoteManualList.concat(this.quoteAutoList);
      }
    },
    watch: {
      // 通知方式-表格影展示的数据变化时赋值给table
      quoteListTemp(newVal) {
        if (newVal) this.quoteList = newVal;
      }
    },
    methods: {
      // 通知方式-表头查询
      getSearchDef() {
        return {
          width: 8,
          offset: 4,
          placeholder: '请输入真实姓名、Email查询',
          searchProps: ['accountName', 'email']
        }
      },
      // 通知方式-表头功能按钮
      getActionsDef() {
        let _this = this
        return {
          width: 12,
          actions: [{
            name: '手动添加',
            icon: 'plus',
            click() {
              _this.addQuoteManual()
            }
          }, {
            name: '添加引用',
            icon: 'link',
            click() {
              _this.addQuoteAuto()
            }
          }, {
            name: '删除引用',
            icon: 'delete',
            click() {
              _this.delQuote()
            }
          }]
        }
      },
      // 获取通知方式-添加引用-账号列表
      getUserList() {
        $axios.post('/iamUserInfo/list', {}).then(({data}) => {
          if (data && data instanceof Array) {
            this.userList = data.map(item => {
              item.accountName = item.userRealName;
              item.email = item.userMail;
              item.accountUuid = item.uuid;
              return item;
            })
          }
        });
      },
      // 通知方式-手动添加
      addQuoteManual() {
        this.addQuoteManualDialog = true;
      },
      // 通知方式-手动添加数据回显
      addQuoteManualCb(obj) {
        this.quoteManualList.push(obj);
      },
      // 通知方式-添加引用
      addQuoteAuto() {
        this.addQuoteAutoDialog = true;
      },
      // 通知方式-添加引用数据回显
      addQuoteAutoCb(arr) {
        this.quoteAutoList = arr;
      },
      // 获取通知方式-引用表格列表多选
      quoteSelectionChange(selections) {
        this.quoteSelections = selections;
      },
      // 通知方式-删除引用
      delQuote() {
        if (this.quoteSelections.length === 0) {
          this.$message({message: '请选择要删除的数据', type: 'warning'});
          return;
        }
        this.quoteSelections.forEach(delItem => {
          for (let j = 0; j < this.quoteList.length; j++) {
            let item = this.quoteList[j];
            if ((delItem.accountUuid && delItem.accountUuid === item.accountUuid) ||
              (!delItem.accountUuid &&
              delItem.accountName === item.accountName &&
              delItem.email === item.email)) {
              this.quoteList.splice(j, 1);
              break;
            }
          }
        });
      },
      // 保存添加健康性检查任务ajax请求
      AddHealthCheckPost() {
        let assetsSelections = this.$refs.checkObjectTable.$refs.allAssetsListTable.getAllSelectedData();   // 检查对象-多选列表
        let itcompUuids = assetsSelections.map(item => item.uuid);    // 检查对象-资产uuid
        let notices = [];
        // 未开启邮件通知，notices字段上传空数组
        if (this.openEmail) {
          notices = this.quoteAutoList.map(item => { return {accountUuid: item.uuid} });    // 邮件通知账号(自动引用)uuid
          // 邮件通知(手动添加)账号名、Email
          this.quoteManualList.forEach(item => {
            notices.push(item);
          })
        }
        let sendData = {
          taskName: this.addBaseSetForm.taskName,
          remark: this.addBaseSetForm.remark,
          itcompUuids,
          notices
        };
        this.btnDisabled = true;
        $axios.post('/assetHealthTask/addTask', sendData, {
          data: [sendData],
          logTemplate: '添加|检查名称(#taskName#)'
        }).then(({data}) => {
          this.btnDisabled = false;
          if (data && data.state) {
            this.$emit('closeAddDialog');
            this.$message.success('保存成功！');
          } else {
            this.$message.error('保存失败，请重试！');
          }
        });
      },
      // 保存添加健康性检查任务
      saveAddHealthCheck() {
        this.$refs.addBaseSetForm.validate(valid => {
          if (valid) {
            let assetsSelections = this.$refs.checkObjectTable.$refs.allAssetsListTable.getAllSelectedData();   // 检查对象-多选列表
            if (assetsSelections.length === 0) {
              this.activeNames = ['checkObj'];
              this.$message.warning('请至少选择一项要检查的资产！');
            } else {
              if (this.openEmail && this.quoteList.length === 0) {
                this.activeNames = ['notify'];
                this.$message.warning('请至少选择一项邮件通知的账号！');
              } else {
                this.AddHealthCheckPost();
              }
            }
          } else {
            this.activeNames = ['base'];
          }
        });
      },
      // 取消添加健康性检查任务
      cancelAddHealthCheck() {
        this.$emit('closeAddDialog');
      }
    },
    created() {
      this.getUserList();   // 获取通知方式-添加引用-账号列表
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #addHealthCheck
    .footerRow
      margin-top 15px
      text-align right
      button + button
        margin-left 12px
</style>
