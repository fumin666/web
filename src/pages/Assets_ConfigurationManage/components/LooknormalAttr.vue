<template>
  <section id="look-normal-attr">
    <s-form ref="looknormalForm" :model="looknormalForm" :rules="looknormalRule" label-width="120px">
      <s-form-item label="标签:">
        <s-input v-model="normalData.aliasName" style="width: 90%" disabled></s-input>
      </s-form-item>
      <s-form-item label="属性类型:">
        <s-input v-model="normalData.htmlColumnType" style="width: 90%" disabled></s-input>
      </s-form-item>
      <s-form-item label="类型:" v-if="!(data.htmlColumnType==='udf_date'||data.htmlColumnType==='udf_long')">
        <s-input v-model="normalData.htmlColumnTypeTxt" style="width: 90%" disabled></s-input>
      </s-form-item>
      <s-form-item label="列表选项:" v-if="data.htmlColumnType==='udf_char_list'">
        <s-scrollbar warp-style="max-height: 220px;">
          <s-row class="options bg-purple-light">
            <s-col :span="12"
                   v-for="(option, idx) in data.listvalues"
                   v-text="`${idx+1}、${option.listvalues}`"
                   :key="option.uuid">
            </s-col>
          </s-row>
        </s-scrollbar>
      </s-form-item>
      <s-form-item label="缺省值:" v-if="data.htmlColumnType==='udf_char_single_line'">
        <s-input v-model="normalData.defaultValue" style="width: 90%" disabled></s-input>
      </s-form-item>
      <s-form-item label="描述:">
        <s-input disabled v-model="normalData.columnDesc" type="textarea" :maxlength="300" style="width: 90%"></s-input>
      </s-form-item>
    </s-form>
  </section>
</template>

<script type="text/ecmascript-6">
  import {cloneDeep} from 'lodash';
  export default {
    data() {
      return {
        looknormalForm: {
          aliasName: '',
          defaultValue: ''
        },
        looknormalRule: {},
        normalData: {}
      }
    },
    created() {
      this.normalData = cloneDeep(this.data)
      this.normalData.htmlColumnType = this.data.htmlColumnType === 'udf_char_list' ? '文本' : this.data.htmlColumnType === 'udf_date' ? '日期' : this.data.htmlColumnType === 'udf_long' ? '数值' : this.data.htmlColumnType === 'udf_char_single_line' ? '文本' : ''
      this.normalData.htmlColumnTypeTxt = this.data.htmlColumnType === 'udf_char_list' ? '精选列表' : this.data.htmlColumnType === 'udf_date' ? '日期' : this.data.htmlColumnType === 'udf_long' ? '数值' : this.data.htmlColumnType === 'udf_char_single_line' ? '文本' : ''
    },
    props: {
      data: {
        type: Object
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #look-normal-attr
    .options
      width 90%
      line-height 28px
</style>
