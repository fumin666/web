<template>
  <section id="look-special-attr">
    <s-row>
      <s-col :span="10"><div class="grid-content bg-purple">属性类型</div></s-col>
      <s-col :span="14"><div class="grid-content bg-purple-light" :title="data.propertyName">
        <p>{{ (data.htmlType === 'udf_char_list' ? '列表' : data.htmlType === 'udf_date' ? '日期' :
          data.htmlType === 'udf_long' ? '数值' : data.htmlType === 'udf_char_single_line' ? '文本' : '') }}</p></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10"><div class="grid-content bg-purple">属性名称</div></s-col>
      <s-col :span="14"><div class="grid-content bg-purple-light">
        <p>{{ data.colnumName }}</p>
      </div></s-col>
    </s-row>
    <!--设置选项-->
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple" v-if="data.htmlType === 'udf_char_list'">选项及默认值</div>
        <div class="grid-content bg-purple" v-else>默认值</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-if="data.htmlType === 'udf_char_list'">
          <s-scrollbar wrap-style="max-height: 200px;">
            <li class="listyle" :title="item.listvalues" v-for="(item) in data.listvalues">
              <span v-if="item.listvalues === data.defaultValue">{{item.listvalues}} (默认值)</span>
              <span v-else>{{item.listvalues}}</span>
            </li>
          </s-scrollbar>
        </div>
        <div v-else class="grid-content bg-purple-light"><p>{{data.defaultValue}}</p></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10"><div class="grid-content bg-purple">描述</div></s-col>
      <s-col :span="14"><div class="grid-content bg-purple-light">{{ data.attributeDesc }}</div></s-col>
    </s-row>
    <s-row>
      <s-col :span="10"><div class="grid-content bg-purple">是否必填</div></s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">
          <span v-if="data.isRequired === 1">是</span>
          <span v-else>否</span>
        </div>
      </s-col>
    </s-row>
  </section>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
      }
    },
    props: {
      data: {
        type: Object
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #look-special-attr
    .listyle{
      list-style: none;
      height:30px;
      line-height: 30px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .options
      width 90%
      line-height 28px
</style>

