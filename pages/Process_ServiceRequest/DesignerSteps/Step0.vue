<template>
  <section id="guide">
    <s-row class="step-title">设计器使用引导</s-row>
    <s-row class="guide-tip" style="opacity: 0.65;font-size: 14px;">设计一套自己企业使用的服务请求流程，您需要完成以下几步：</s-row>
    <s-row>
      <ul class="guide-text" style="opacity: 0.65;font-size: 14px;">
        <li>1. 向用户描述服务请求（导航类别、服务目录）</li>
        <li>2. 设计服务请求属性（图像、成本、价格）</li>
        <li>3. 定义服务请求所需提交项（提交的表单字段设计）</li>
        <li>4. 定义服务请求执行流程（提交后生成服务请求单或事件单或变更单）</li>
        <li>5. 定义服务请求审批人（个人审批、组审批、角色审批）</li>
        <li>6. 部署生效（部署时间、到期时间）</li>
      </ul>
    </s-row>
    <s-row class="choice">你可以选择以下操作：</s-row>
    <s-row>
      <s-button @click="createDesigner">创建</s-button>
      <s-button @click="editDesigner" type="cancel">修改</s-button>
    </s-row>

    <s-dialog
      v-model="editDialog"
      v-if="editDialog"
      title="选择服务请求"
      width="750px"
      ref="editDialog">
      <edit-service-table ref="editServiceTable"></edit-service-table>
      <template slot="footer">
        <s-button @click="nextStep">下一步</s-button>
        <s-button type="cancel" @click="editDialog=false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import Bus from '@/plugins/eventBus';
  import $axios from 'sunflower-ajax';
  import EditServiceTable from '../DesignerDialog/EditServiceTable';

  export default {
    data() {
      return {
        editDialog: false
      }
    },
    components: {
      EditServiceTable
    },
    methods: {
      // 创建设计器
      createDesigner() {
        this.$store.commit('setEditDesigner', null);
        Bus.$emit('goToStep1');
      },
      // 修改设计器
      editDesigner() {
        this.editDialog = true;
      },
      // 编辑服务请求"下一步"
      nextStep() {
        let editServiceUuid = this.$refs.editServiceTable.editServiceUuid;
        if (editServiceUuid) {
          $axios.get(`/itilServiceRequest/toUpdate/${editServiceUuid}`).then(({data}) => {
            if (data) {
              this.$store.commit('setEditDesigner', {uuid: editServiceUuid, editData: data});
              Bus.$emit('goToStep1');
              this.editDialog = false;
            }
          });
        } else {
          this.$message.warning('请选择一个要配置的设计器！');
        }
      }
    },
    created() {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #guide
    .guide-tip, .choice
      font-size 15px
      margin-bottom 30px
    .choice
      margin 40px 0 20px
    ul.guide-text
      li
        padding 6px
</style>
