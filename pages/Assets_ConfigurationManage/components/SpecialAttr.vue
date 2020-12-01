<template>
<div>
  <s-table-page
    ref="multipleTable"
    :data="specialData"
    style="width:100%"
    max-height="400"
  >
    <s-table-column label="属性类型">
      <template slot-scope="scope">
        {{(scope.row.htmlType === 'udf_char_list' ? '列表' : scope.row.htmlType === 'udf_date' ? '日期' :
        scope.row.htmlType === 'udf_long' ? '数值' : scope.row.htmlType === 'udf_char_single_line' ? '文本' : '')}}
        </template>
    </s-table-column>
    <s-table-column prop="colnumName" label="属性名称"></s-table-column>
    <s-table-column prop="attributeDesc" label="描述"></s-table-column>
    <s-table-column label="操作" width="80">
      <template slot-scope="scope">
        <i class="iconfont icon-eye" title="查看" @click="lookHanddler(scope.row)"></i>
       <!-- <i class="iconfont icon-edit" title="编辑" @click="editHandler(scope.row)"></i>
         <i class="iconfont icon-delete" title="删除" @click="delHandler(scope.row)"></i>-->
      </template>
    </s-table-column>
  </s-table-page>
  <s-dialog
    v-model="lookspecialDialog"
    v-if="lookspecialDialog"
    width="700px"
    title="查看"
    append-to-body
  >
    <look-special-attr ref="looknormal" :data="lookspecialattrData"></look-special-attr>
  </s-dialog>
</div>
</template>

<script type="text/ecmascript-6">
  import $axios from 'sunflower-ajax';
  import lookSpecialAttr from './LookspecialAttr';
  export default {
  components: {lookSpecialAttr},
  data() {
  return {
    specialData: [],
    lookspecialDialog: false,
    lookspecialattrData: {}
  }
  },
  props: {
    lookspecialData: {
    type: Object,
    default() {
    return {}
    }
    }
  },
  created() {
  this.getDtata()
  },
  methods: {
    getDtata() {
    let uuid = this.lookspecialData.threeTypeUuid ? this.lookspecialData.threeTypeUuid : this.lookspecialData.secondTypeUuid
      $axios.post(`/resourcemanager/configurationmanage/citype/getcitypeDetail/${uuid}`).then(({data}) => {
        this.specialData = data.typeAttributeList
      })
    },
    getListActionsDef() {
    return false
    },
    lookHanddler(row) {
      this.lookspecialattrData = row
      this.lookspecialDialog = true
    },
    editHandler(row) {
    console.log(row)
    },
    delHandler(row) {
    console.log(row)
    }
  }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
