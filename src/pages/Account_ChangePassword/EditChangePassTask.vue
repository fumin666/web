<template>
  <section>
    <s-collapse v-model="activeNames" accordion>
      <s-collapse-item title="基础设置" name="base">
        <edit-change-pass-base ref="base" :originData="rowData"></edit-change-pass-base>
      </s-collapse-item>
      <s-collapse-item title="关联账号" name="association">
        <association
          ref="association"
          :originData="rowData"
          @showAssInfoDialog="openAssInfoDialog">
        </association>
      </s-collapse-item>
      <s-collapse-item title="改密前设置" name="before">
        <s-scrollbar wrap-style="max-height:450px;">
          <before-change-pass ref="beforeChangePass" :originData="rowData"></before-change-pass>
        </s-scrollbar>
      </s-collapse-item>
      <s-collapse-item title="改密后设置" name="after">
        <after-change-pass ref="afterChangePass" :originData="rowData"></after-change-pass>
      </s-collapse-item>
    </s-collapse>
    <s-row style="margin-top: 20px;">
      <s-button class="rightBtn" type="cancel" @click="cancelEditPassTaskForm">取消</s-button>
      <s-button style="margin-right: 15px;" class="rightBtn" @click="editAddPassTaskForm">保存</s-button>
    </s-row>

    <!--关联账号详情查看-->
    <s-dialog
      v-model="assInfoDialogFlag"
      v-if="assInfoDialogFlag"
      title="关联账号详情"
      class="dialogFlag"
      append-to-body>
      <association-account-info :infoData="assAccInfo"></association-account-info>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import { cloneDeep } from 'lodash';
  import mixin from './MethodsMixin';
  import EditChangePassBase from './EditChangePassBase.vue';
  import Association from './Association.vue';
  import AssociationAccountInfo from './AssociationAccountInfo.vue';
  import BeforeChangePass from './BeforeChangePass.vue';
  import AfterChangePass from './AfterChangePass.vue';

  export default{
    data () {
      return {
        activeNames: 'base',
        rowData: {},                // table行内数据
        assInfoDialogFlag: false,   // 关联账号详情查看
        assAccInfo: {},             // 关联账号详情
        twoResultAccount: []        // 已经关联的账号(账号设置时，不能再关联其他资产)
      }
    },
    mixins: [mixin],
    props: {
      originData: {
        type: Object,
        required: true
      }
    },
    components: {
      EditChangePassBase,
      Association,
      AssociationAccountInfo,
      BeforeChangePass,
      AfterChangePass
    },
    watch: {
    },
    methods: {
      // 保存"修改改密任务"
      editAddPassTaskForm() {
        if (!this.$refs.base.validateBase() || !this.$refs.base.$refs.peroids.validateForm()) {
          this.activeNames = 'base';
          this.$message.warning('请填写"基础设置"中的必填项！')
        } else if (!this.$refs.association.validateAssetsAccount()) {
          this.activeNames = 'association';
          this.$message.warning('请至少选择一项要关联的账号！')
        } else if (!this.$refs.beforeChangePass.validateBefore()) {
          this.activeNames = 'before';
          this.$message.warning('请按要求填写"改密前设置"中的信息！')
        } else if (!this.$refs.afterChangePass.validateAfter()) {
          this.activeNames = 'after';
          this.$message.warning('请在"改密后设置"中填写正确的邮箱地址！')
        } else if (this.$refs.afterChangePass.validateAfter() === 'pwd') {
          this.$message.warning('"改密后设置"中设置"邮件接收者"同时需要设置"附件密码"！');
        } else {
          /* 保存前先提交数据判断该任务是否可以走调度 */
          let newForm = this.formattScheduleTime(this.$refs.base.editPassTaskForm);
          $axios.post('/tPasswdChangeTask/isTrigger', newForm).then(({data}) => {
            if (data.state === true) {
              // 可以走调度，保存
              this.$refs.base.saveEditPassTaskForm().then(() => {
                Promise.all([
                  this.$refs.beforeChangePass.saveBeforeForm(),
                  this.$refs.afterChangePass.saveAfterForm()
                ]).then(() => {
                  this.$refs.association.saveAssetsAccount().then(res => {
                    if (res === 'association') {
                      this.$emit('closeDialog');      // 触发父组件事件，关闭弹框，刷新改密任务列表
                      this.$message.success('编辑成功！');
                    }
                  });
                });
              });
            } else {
              this.$message.warning(data.errorMsg);
            }
          });
        }
      },
      // 取消编辑改密任务弹框
      cancelEditPassTaskForm() {
        this.$emit('closeDialog');
      },
      // 关联账号详情查看
      openAssInfoDialog(info) {
        this.assInfoDialogFlag = true
        this.assAccInfo = info
      }
    },
    created() {
      this.rowData = cloneDeep(this.originData);
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
