<template>
  <s-scrollbar wrap-class="scrollMaxheight">
    <div>
      <view-module-item v-for="item in datalist"
                        :key="item.content"
                        :title="item.name"
                        v-if="info[item.content] || !item.toggle"
                        :content="info[item.content] ? info[item.content] : item.default ? item.default : ''">
      </view-module-item>
    </div>
    <s-row>
      <s-col offset="10" span="4">
        <s-button style="width:100%;margin-top:10px;" @click="register">注册</s-button>
      </s-col>
    </s-row>
  </s-scrollbar>
</template>

<script type="text/babel">
  import viewModuleItem from '@/components/commonView/DialogViewItem'

  export default {
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
        ]
      }
    },
    components: {
      viewModuleItem
    },
    methods: {
      register() {
        this.$emit('register', true)
      }
    },
    props: {
      info: {
        type: Object,
        default: function () {
          return {}
        }
      }
    }
  }
</script>
