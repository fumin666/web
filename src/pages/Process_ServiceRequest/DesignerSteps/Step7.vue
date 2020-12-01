/*原来的step8.vue，删除step8后，将原来的step8.vue迁移至step7.vue中*/
<template>
  <section id="deployAffect">
    <s-row class="step-title">
      设置服务请求部署生效时间
      <span class="title-tip">--{{$store.state.serviceRequest.requestName}}</span>
    </s-row>

    <s-form
      :model="deployAffectForm" :rules="deployAffectFormRules"
      ref="deployAffectForm" label-width="120px">
      <s-form-item label="状态:" prop="status">
        <s-select v-model="deployAffectForm.status" :disabled="designeruuid&&inlayarr.indexOf(designeruuid)!=-1">
          <s-option label="在线" :value="0"></s-option>
          <s-option label="已下线" :value="1"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="部署时间:" prop="deployTime">
        <s-date-picker
          v-model="deployAffectForm.deployTime"
          type="datetime" :disabled="designeruuid&&inlayarr.indexOf(designeruuid)!=-1"
          placeholder="请选择日期时间">
        </s-date-picker>
      </s-form-item>
      <s-form-item label="到期时间:" prop="validateTime">
        <s-date-picker
          v-model="deployAffectForm.validateTime"
          type="datetime" :disabled="designeruuid&&inlayarr.indexOf(designeruuid)!=-1"
          placeholder="请选择日期时间">
        </s-date-picker>
      </s-form-item>
    </s-form>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        deployAffectForm: {
          status: 0,
          deployTime: new Date(),
          validateTime: null
        },
        deployAffectFormRules: {}
      }
    },
    methods: {
      // 获取到期时间
      getLicenseInfo() {
        return new Promise((resolve, reject) => {
          $axios.get('/systemmanager/systemsetting/getLicenseInfo').then(({data}) => {
            if (data && data.deadlineDate) {
              this.deployAffectForm.validateTime = new Date(data.deadlineDate);
              resolve();
            } else {
              reject();
            }
          });
        });
      }
    },
    created() {
      if (this.designeruuid && this.inlayarr.indexOf(this.designeruuid) !== -1) {
        this.deployAffectFormRules = {
          status: [{type: 'number', required: true, message: '不能为空', trigger: 'change'}]
        }
      } else {
        this.deployAffectFormRules = {
          status: [{type: 'number', required: true, message: '不能为空', trigger: 'change'}],
          deployTime: [{type: 'date', required: true, message: '不能为空', trigger: 'blur'}],
          validateTime: [{type: 'date', required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    computed: {
      inlayarr() {
        return this.$store.state.serviceRequest.inlayarr
      },
      designeruuid() {
        if (this.$store.state.serviceRequest.editDesigner) {
          return this.$store.state.serviceRequest.editDesigner.uuid
        } else {
          return null;
        }
      }
    },
    // <keep-alive>切换到当前组件触发该钩子
    activated() {
      // 获取到期时间
      this.getLicenseInfo().then(() => {
        let state = this.$store.state.serviceRequest;
        // 编辑设计器时，获取编辑回显数据
        if (state.editDesigner) {
          this.deployAffectForm.status = state.editDesigner.editData.itilRequestDesigner.status;
          this.deployAffectForm.deployTime = new Date(state.editDesigner.editData.itilRequestDesigner.deployTime * 1000);
          this.deployAffectForm.validateTime = new Date(state.editDesigner.editData.itilRequestDesigner.validateTime * 1000);
        }
      });
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
#deployAffect
  margin-bottom 120px
  .s-select .s-input-inner
    width 200px
</style>
