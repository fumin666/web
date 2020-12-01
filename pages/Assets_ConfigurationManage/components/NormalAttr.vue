<template>
<div>
  <s-table-page
    ref="multipleTable"
    :data="normalData"
    :header-actions='{show: false}'
    :header-search='{show: false}'
    style="width:100%"
    max-height="400"
  >
    <s-table-column label="属性类型">
      <template slot-scope="scope">
        {{(scope.row.htmlColumnType === 'udf_char_list' ? '文本' : scope.row.htmlColumnType === 'udf_date' ? '日期' : scope.row.htmlColumnType === 'udf_long' ? '数值' : scope.row.htmlColumnType === 'udf_char_single_line' ? '文本': '')}}
        </template>
    </s-table-column>
    <s-table-column prop="aliasName" label="标签"></s-table-column>
    <s-table-column prop="columnDesc" label="描述"></s-table-column>
    <s-table-column label="操作">
      <template slot-scope="scope">
        <i class="iconfont icon-eye" title="查看" @click="lookHandler(scope.row)"></i>
       <!-- <i class="iconfont icon-edit" title="编辑" @click="editHandler(scope.row)"></i>
        <i class="iconfont icon-delete" title="删除" @click="delHandler(scope.row)"></i>-->
      </template>
    </s-table-column>
  </s-table-page>
  <!--查看通用属性-->
  <s-dialog
    v-model="looknormalDialog"
    v-if="looknormalDialog"
    width="700px"
    title="查看"
    append-to-body
  >
    <look-normal-attr ref="looknormal" :data="looknormalData"></look-normal-attr>
    <template slot="footer" class="dialog-footer">
      <s-button type="cancel" @click="looknormalDialog=false">取消</s-button>
    </template>
  </s-dialog>
  <!--编辑通用属性-->
  <s-dialog
    v-model="editnormalDialog"
    v-if="editnormalDialog"
    width="700px"
    title="编辑"
    append-to-body
  >
    <look-normal-attr ref="looknormal"></look-normal-attr>
    <template slot="footer" class="dialog-footer">
      <s-button @click="editnormalOk">保存</s-button>
      <s-button type="cancel" @click="editnormalDialog=false">取消</s-button>
    </template>
  </s-dialog>
</div>
</template>

<script type="text/ecmascript-6">
  import lookNormalAttr from './LooknormalAttr';
  import $axios from 'sunflower-ajax';
  export default {
    components: { lookNormalAttr },
    data() {
      return {
        normalData: [],
        looknormalDialog: false,
        editnormalDialog: false,
        looknormalData: {}
      }
    },
    created() {
    this.getDtata()
    },
    methods: {
    getDtata() {
     $axios.post('/resourcemanager/configurationmanage/assetPublicAttr/attrpage').then(({data}) => {
       let normalData = [...data.udfChar, ...data.udfDate, ...data.udfLong]
       this.normalData = normalData.filter(item => {
       return item.aliasName !== null
       })
       })
    },
      getListActionsDef() {
        return false
      },
      lookHandler(row) {
        this.looknormalData = row
        this.looknormalDialog = true
      },
      looknormalOk() {
        this.looknormalDialog = true
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
