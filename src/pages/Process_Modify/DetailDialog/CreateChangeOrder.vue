<template>
  <section id="createChangeOrderDialog">
    <s-scrollbar>
      <s-form
        ref="createChangeOrderForm"
        :model="createChangeOrderForm"
        :rules="createChangeOrderFormRules"
        label-width="100px">
        <s-form-item label="变更单号：">
          <s-input v-model="createChangeOrderForm." disabled></s-input>
        </s-form-item>
        <s-form-item label="简要描述：" prop="">
          <s-input v-model="createChangeOrderForm." type="textarea" :rows="3" placeholder="请输入简要描述"></s-input>
        </s-form-item>
        <s-form-item label="详细描述：">
          <s-input v-model="createChangeOrderForm." type="textarea" :rows="3" placeholder="请输入详细描述"></s-input>
        </s-form-item>
        <s-form-item label="变更模板：">
          <s-input v-model="createChangeOrderForm." disabled class="leftInput"></s-input>
          <i class="iconfont icon-info-query" title="点击选择模板"></i>
        </s-form-item>
        <s-form-item label="分类一级：" prop="">
          <s-select v-model="createChangeOrderForm.">
            <s-option v-for="" label="" :value="" :key=""></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="分类二级：" prop="">
          <s-select v-model="createChangeOrderForm.">
            <s-option v-for="" label="" :value="" :key=""></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="分类三级：">
          <s-select v-model="createChangeOrderForm.">
            <s-option v-for="" label="" :value="" :key=""></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="风险等级：" prop="">
          <s-select v-model="createChangeOrderForm." disabled class="leftInput">
            <s-option v-for="" label="" :value="" :key=""></s-option>
          </s-select>
          <i class="iconfont icon-info-query" title="点击进入风险等级问卷"></i>
        </s-form-item>
        <s-form-item label="变更路径：" prop="">
          <s-select v-model="createChangeOrderForm." disabled>
            <s-option v-for="" label="" :value="" :key=""></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="变更动作：" prop="">
          <s-select v-model="createChangeOrderForm.">
            <s-option v-for="" label="" :value="" :key=""></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="变更环境：" prop="">
          <s-select v-model="createChangeOrderForm.">
            <s-option v-for="" label="" :value="" :key=""></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="受影响单位：">
          <s-select v-model="createChangeOrderForm.">
            <s-option v-for="" label="" :value="" :key=""></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="变更经理组：">
          <s-select v-model="createChangeOrderForm.">
            <s-option v-for="" label="" :value="" :key=""></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="变更经理：">
          <s-select v-model="createChangeOrderForm.">
            <s-option v-for="" label="" :value="" :key=""></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="变更管理员组：">
          <s-select v-model="createChangeOrderForm.">
            <s-option v-for="" label="" :value="" :key=""></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="变更管理员：">
          <s-select v-model="createChangeOrderForm.">
            <s-option v-for="" label="" :value="" :key=""></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="附件信息：">
        </s-form-item>
      </s-form>

      <s-row style="text-align: right;">
        <s-button @click="saveCreateChangeOrder">保存</s-button>
        <s-button type="cancel" @click="cancelCreateChangeOrder">取消</s-button>
      </s-row>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default{
    data() {
      return {
        createChangeOrderForm: {
        },
        createChangeOrderFormRules: {
        }
      }
    },
    methods: {
      saveCreateChangeOrder() {
        $axios.post('', this.createChangeOrderForm).then(({data}) => {
          if (data) {
            this.$message({
              type: 'success',
              message: '保存成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '保存失败，请重试！'
            })
          }
        })
      },
      cancelCreateChangeOrder() {
        this.$emit('closeCreate')
      }
    },
    created() {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #createChangeOrderDialog
    .leftInput
      display inline-block
      width 90%
</style>
