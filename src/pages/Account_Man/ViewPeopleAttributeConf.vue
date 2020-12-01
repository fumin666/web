<!--
 * @Author: songyf
 * @Version: //Q4人员属性配置
 * @Description:查看人员属性配置列表
 * @Position:账号管理-组织机构管理-人员属性配置-查看弹窗
 * @Date: 2019-11-12 11:11:11
 * @LastEditors: 佩奇
 -->
<template>
  <s-dialog v-model="viewDialog" title="查看" width="550px" :before-close="dialogClose" class="people-attribute-view">
    <s-scrollbar wrap-style="max-height:600px;">
      <s-row>
        <s-col :span="10"><div class="grid-content bg-purple">属性名称</div></s-col>
        <s-col :span="14"><div class="grid-content bg-purple-light" :title="rowData.propertyName">
          <p>  {{ rowData.propertyName }}</p>
        </div></s-col>
      </s-row>
      <s-row>
        <s-col :span="10"><div class="grid-content bg-purple">属性类型</div></s-col>
        <s-col :span="14"><div class="grid-content bg-purple-light">
          <p>{{ type[rowData.propertyType] }}</p>
        </div></s-col>
      </s-row>
      <!--设置选项-->
      <s-row>
        <s-col :span="10">
          <div class="grid-content bg-purple" v-if="rowData.propertyType === 3">选项及默认值</div>
          <div class="grid-content bg-purple" v-else>默认值</div>
        </s-col>
        <s-col :span="14">
          <div class="grid-content bg-purple-light" v-if="rowData.propertyType === 3">
            <s-scrollbar wrap-style="max-height: 200px;">
              <li class="listyle" :title="i.listvalues" v-for="(i, idx) in rowData.dropDownOptionList">
                <span v-if="rowData.defaultValue === i.value">{{i.name}} (默认值)</span>
                <span v-else>{{i.name}}</span>
              </li>
            </s-scrollbar>
          </div>
          <div v-else class="grid-content bg-purple-light"><p>{{rowData.defaultValue}}</p></div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="10"><div class="grid-content bg-purple">是否加入人员弹窗</div></s-col>
        <s-col :span="14"><div class="grid-content bg-purple-light">{{ judge[rowData.applyFlag] }}</div></s-col>
      </s-row>
      <s-row>
        <s-col :span="10"><div class="grid-content bg-purple">是否必填项</div></s-col>
        <s-col :span="14"><div class="grid-content bg-purple-light">{{ judge[rowData.requiredValueFlag] }}</div></s-col>
      </s-row>
      <s-row>
        <s-col :span="10"><div class="grid-content bg-purple">是否支持批量编辑</div></s-col>
        <s-col :span="14"><div class="grid-content bg-purple-light">{{ judge[rowData.batchFlag] }}</div></s-col>
      </s-row>
      <s-row>
        <s-col :span="10"><div class="grid-content bg-purple">备注</div></s-col>
        <s-col :span="14"><div class="grid-content bg-purple-light">
          <p> {{ rowData.propertyDesc }}</p>
        </div></s-col>
      </s-row>
    </s-scrollbar>
  </s-dialog>
</template>

<script type="text/babel">
export default {
  data() {
    return {
      judge: {
        0: '否',
        1: '是'
      },
      type: {
        1: '文本',
        2: '数值',
        3: '列表',
        4: '日期'
      }
    };
  },
  props: {
    viewDialog: {
      type: Boolean
    },
    rowData: {
      type: Object
    }
  },
  created() {
  },
  components: {
  },
  filters: {
    filtersDropOption(data) {

    }
  },
  methods: {
    dialogClose() {
      this.$emit('update:viewDialog', false)
    }
  }
}
</script>
<style>
  .people-attribute-view .bg-purple-light p{
    width: 266px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .listyle{
    list-style: none;
    height:30px;
    line-height: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
