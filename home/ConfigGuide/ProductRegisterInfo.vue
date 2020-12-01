<!--
 * @Author: mybells
 * @Version://Q1UE问题优化
 * @Description:配置向导-产品注册信息展示
 * @Date: 2020-01-19 10:09:14
 * @LastEditors: mybells
 -->
<template>
  <div class="product_register">
    <p class="font_color word">{{ wordStr }}</p>
    <s-scrollbar wrap-style="max-height:320px;padding-right:10px;">
      <view-module-item v-for="item in datalist"
                        :key="item.content"
                        :title="item.name"
                        v-if="registerData[item.content] || !item.toggle"
                        :content="registerData[item.content] ? registerData[item.content] : item.default ? item.default : ''">
      </view-module-item>
    </s-scrollbar>
  </div>
</template>

<script>
  import viewModuleItem from '@/components/commonView/DialogViewItem'

  export default {
    components: {
      viewModuleItem
    },
    props: {
      registerData: Object
    },
    data() {
      return {
        datalist: [
          {
            name: '客户名称',
            content: 'customerName'
          },
          {
            name: '版本类型',
            content: 'verType'
          },
          {
            name: '产品序列号',
            content: 'snNumber'
          },
          {
            name: '产品版本',
            content: 'prodctVersion'
          },
          {
            name: '内部版本',
            content: 'innerVersion'
          },
          {
            name: '注册状态',
            content: 'regStatus',
            default: '未注册'
          },
          {
            name: '激活时间',
            content: 'regTime'
          },
          {
            name: '服务时限',
            content: 'serviceDays'
          },
          {
            name: '使用时限',
            content: 'workDays'
          },
          {
            name: 'IAM数',
            content: 'iamCount'
          },
          {
            name: 'CMDB数',
            content: 'cmdbAccount'
          },
          {
            name: '资产监控数',
            content: 'devCount',
            toggle: true
          },
          {
            name: '数据库审计数',
            content: 'dbaCount',
            toggle: true
          },
          {
            name: '运维审计数',
            content: 'opCount',
            toggle: true
          },
          {
            name: '日志审计数',
            content: 'logNodeCount',
            toggle: true
          },
          {
            name: '移动设备数',
            content: 'mobileCount',
            toggle: true
          },
          {
            name: '3D机房',
            content: 'active3dRoom'
          }
        ],
        wordStr: '注册信息'
      }
    },
    created() {
      this.getCode();
    },
    computed: {
      activeStep: {
        get() {
          return this.$store.state.configGuide.activeStep;
        },
        set(val) {
          this.$store.commit('configGuide/SET_ACTIVESTEP', val);
        }
      }
    },
    methods: {
      submitForm: function() {
        this.activeStep++;
      }
    }
  }
</script>

<style lang="stylus">
.product_register{
  .word{
    margin:20px 0 30px 0;
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
  }
  .indent{
    .s-form-item-label{
      padding-left: 10px;
    }
  }
}
</style>
