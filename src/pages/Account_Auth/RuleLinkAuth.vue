<template>
  <div class="rule-link-auth">
    <div class="title">访问规则信息</div>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">访问规则名称</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="rule.ruleName"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">访问规则类型</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="type[rule.ipType]"></div>
      </s-col>
    </s-row>
    <div class="title">登录规则设置</div>
    <s-go
      :title="'已关联授权清单（'+ rule.authInfoList.length + '）'"
      icon="set"
      :data="rule.authInfoList"
      @config="config"
      :prop="['authName']">
    </s-go>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        required: true,
        type: Object
      }
    },
    data() {
      return {
        rule: this.data,
        type: ['禁止', '允许']
      }
    },
    watch: {
      data: {
        deep: true,
        handler: function(val) {
          this.rule = val;
        }
      }
    },
    methods: {
      config() {
        this.$emit('configA');
      }
    }
  }
</script>
