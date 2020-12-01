/**
* Created by dgunzi on 2019/06/21.
*/
<template>
  <component :is="currentStep" :ref="currentStep"></component>
</template>

<script>
  import roleCheckMixin from '@/common/mixins/roleCheckMixin';
  import Bus from '@/plugins/eventBus';
  export default {
    mixins: [roleCheckMixin],
    name: 'BaseComponet',
    data() {
      return {
        currentStep: ''
      }
    },
    created() {
      this.setDataVal(this.$router.currentRoute.name);
    },
    watch: {
      '$route' (to, from) {
        this.setDataVal(to.name);
      }
    },
    methods: {
      setDataVal(name) {
        let key = name.replace(/([A-Z])/g, '-$1').toLowerCase();
        this.currentStep = 'home-' + key;
        this.diffRolePage();
      },
      /* 针对同一用户具有不同角色权限的页面 */
      diffRolePage() {
        let userData = this.$store.getters.userData;
        // 判断是否有流程模块
        let firstMenu = this.$store.getters.firstMenu;
        let secondMenu = this.$store.getters.secondMenu;
        let firstMenuPc = firstMenu.filter(item => { // 是否注册流程
          return item.keyWord === 'processCenter';
        });
        if (userData.roleUuidsStr.indexOf('tsecondroleinfo00000000000000001') !== -1) { // 是否是安全管理员
          if (this.currentStep === 'home-account-manage') { // 账号管理
            if (secondMenu.f10adc3949ba59abbe56e057f20f88a4.length === 2 || secondMenu.f10adc3949ba59abbe56e057f20f88a4.length === 1) {
              Bus.$emit('specialPage', true)
              if (userData.registerModelList.indexOf('IAM_EXTEND') > -1 || userData.registerModelList.indexOf('OMA') > -1) { // 安全管理员角色(IAM_EXTEND&OMA)
                this.currentStep = 'home-account-security'
              } else { // 安全管理员角色(非IAM或非OMA)
                this.currentStep = 'home-account-non'
              }
            } else {
              Bus.$emit('specialPage', false)
            }
          } else if (this.currentStep === 'home-assets-manage') { // 资产管理
            if ((secondMenu.f10adc3949ba59abbe56e057f20f88a6.length === 1) || (userData.registerModelList.indexOf('THREED') !== -1 && secondMenu.f10adc3949ba59abbe56e057f20f88a6.length === 3)) {
              Bus.$emit('securityUser', true)
              Bus.$emit('specialPage', true)
              this.currentStep = 'home-assets-security'
            } else {
              Bus.$emit('specialPage', false)
            }
          } else if (this.currentStep === 'home-grade-protect') { // 等级保护
            if ((secondMenu['7cc31c86f30a4bcb89cb564346109fdb'].length === 1) || (secondMenu['7cc31c86f30a4bcb89cb564346109fdb'].length === 2)) {
              Bus.$emit('specialPage', true)
              this.currentStep = 'home-grade-security'
            } else {
              Bus.$emit('specialPage', false)
            }
          } else {
            Bus.$emit('specialPage', false)
          }
        }
        if (!this.isSuperAdmin && this.isSystemAdmin) { // 是否是系统管理员
          if (this.currentStep === 'home-operation-center') { // 运维中心
            if (userData.roleUuidsStr.indexOf('tsecondroleinfo00000000000000009') === -1 && userData.roleUuidsStr.indexOf('tsecondroleinfo00000000000000008') === -1) { // 非运维人员并且非团队主管
              Bus.$emit('specialPage', true)
              this.currentStep = 'home-operation-system'
            } else {
              Bus.$emit('specialPage', false)
            }
          } else if (userData.roleName.indexOf('系统管理员') !== -1 && userData.roleName.indexOf('安全通报操作员') === -1 && this.currentStep === 'home-safety-bulletin') { // 安全通报主页面
            Bus.$emit('specialPage', true)
            this.currentStep = 'home-bulletin-set'
          } else if (this.currentStep === 'home-grade-protect') { // 等级保护
            if (secondMenu['7cc31c86f30a4bcb89cb564346109fdb'].length === 1 && secondMenu['7cc31c86f30a4bcb89cb564346109fdb'][0].keyWord === 'gradeProtect_dbRuleSet') {
              Bus.$emit('specialPage', true)
              this.currentStep = 'home-grade-system'
            } else {
              Bus.$emit('specialPage', false)
            }
          } else {
            Bus.$emit('specialPage', false)
          }
        }
        if (userData.roleUuidsStr.indexOf('tsecondroleinfo00000000000000015') !== -1 &&
          firstMenuPc.length > 0 && secondMenu.f10adc3949ba59abbe56e057f20f8812.length === 1 &&
          secondMenu.f10adc3949ba59abbe56e057f20f8812[0].keyWord === 'processCenter_workflowConfig') { // 是否是配置管理员
          if (this.currentStep === 'home-process-center') {
            Bus.$emit('specialPage', true)
            this.currentStep = 'home-process-configuration'
          } else {
            Bus.$emit('specialPage', false)
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
