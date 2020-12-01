<template>
  <section
    v-loading.fullscreen.lock="fullScreenLoading"
    element-loading-text="保存中，请稍等...">
    <s-scrollbar wrap-style="max-height:600px;">
    <s-row>
      <s-row class="title">
        <i class="iconfont icon-tag"></i>
        <span>基本信息</span>
      </s-row>
      <s-form
        id="editMibListForm"
        ref="editMibListForm"
        :model="editMibListForm"
        :rules="editMibListFormRules"
        label-width="120px">
        <s-form-item label="模版名称：" prop="template" style="margin-bottom: 15px">
          <s-input v-model="editMibListForm.template" :maxlength="20" style="width:190px"></s-input>
        </s-form-item>
        <s-form-item label="资产类型：">
          {{rowData.threeTypeName}}
        </s-form-item>
        <s-form-item label="资产厂商：">
          {{rowData.manufactName}}
        </s-form-item>
        <s-form-item label="资产型号：">
          {{rowData.productName}}
        </s-form-item>
        <s-form-item label="标识符：">
          <s-input v-model="editMibListForm.keyWord" style="width:190px"></s-input>
        </s-form-item>
        <s-form-item label="企业OID：">
          <s-input v-model="editMibListForm.sysObjectOid" style="width:190px"></s-input>
        </s-form-item>
      </s-form>
    </s-row>

    <s-row>
      <s-row class="title">
        <i class="iconfont icon-approve"></i>
        <span>识别监控信息</span>
      </s-row>
      <s-form label-width="120px">
        <s-form-item label="监控模板：">
          {{`${rowData.productName}【${rowData.template}】`}}
        </s-form-item>
      </s-form>

      <s-row>
        <s-button icon="plus" @click="editMibAddMonitorType">添加监控项类型</s-button>
        <s-button icon="delete" @click="editMultipleDeleteMonitorType">删除</s-button>
      </s-row>
      <s-row>
        <s-table
          :data="editMonitorTypeLists"
          @selection-change="editMonitorTypeMultipleSelect">
          <s-table-column
            type="selection"
            width="45">
          </s-table-column>
          <s-table-column
            label="监控项类型名称"
            prop="chName">
          </s-table-column>
          <s-table-column
            label="操作"
            width="130px">
            <template slot-scope="scope">
              <i class="iconfont icon-edit" @click="editEditMonitorType(scope.$index, scope.row)"></i>
              <i class="iconfont icon-delete" @click="editDeleteMonitorType(scope.$index, scope.row)"></i>
            </template>
          </s-table-column>
        </s-table>
      </s-row>
    </s-row>

    <s-row class="footerRow">
      <s-button type="cancel" @click="cancelUpdateMibList">取消</s-button>
      <s-button @click="updateMibList">更新</s-button>
    </s-row>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus'

  export default{
    data() {
      return {
        fullScreenLoading: false,           // 全屏loading。针对MIB保存速度过慢，无‘保存中’的动态提示bug的修改
        tempRowData: this.rowData,
        editMonitorTypeLists: [],      // 监控项类型列表
        editMonitorTypeSelections: [],        // 监控项类型多选
        // 添加MIB基本信息
        editMibListForm: {
          // name: '',
          threeTypeName: '',
          manufactUuid: '',
          productUuid: '',
          keyWord: '',
          sysObjectOid: '',
          uuid: '',
          template: ''
        },
        editMibListFormRules: {
          template: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    props: {
      rowData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      // MIB列表编辑 -> 新增监控项类型
      editMibAddMonitorType() {
        Bus.$emit('showMonitorTypeDialog')
      },
      // MIB列表编辑 -> 多选监控项类型多选值
      editMonitorTypeMultipleSelect(val) {
        this.editMonitorTypeSelections = val
      },
      // MIB列表编辑 -> 批量删除监控项类型
      editMultipleDeleteMonitorType() {
        if (this.editMonitorTypeSelections.length === 0) {
          this.$message({
            type: 'warning',
            message: '请至少选择一项'
          })
        } else {
          this.editMonitorTypeSelections.forEach((item) => {
            this.editMonitorTypeLists.forEach((list, deleteIndex) => {
              if (item.chName === list.chName) {
                this.editMonitorTypeLists.splice(deleteIndex, 1)
              }
            })
          })
        }
      },
      // MIB列表编辑 -> 编辑监控项类型
      editEditMonitorType(index, row) {
        Bus.$emit('showEditMib_EditMonitorType', row)
      },
      // MIB列表编辑 -> 删除监控项类型
      editDeleteMonitorType(index, row) {
        this.editMonitorTypeLists.splice(index, 1)
      },
      // MIB列表编辑 -> 更新编辑结果
      updateMibList() {
        let updateData = {
          monitorTypes: this.editMonitorTypeLists,
          template: this.editMibListForm
        }
        this.fullScreenLoading = true
        $axios.post('/systemmanager/mibtool/updateMibTempalte', updateData, {
          data: [{template: this.editMibListForm.template}],
          logTemplate: '编辑|模板(#template#)'
        }).then((res) => {
          let resData = res.data
          if (resData === 'success') {
            Bus.$emit('updateMibListSuccess')
            this.fullScreenLoading = false
            this.$message({
              type: 'success',
              message: '修改成功！'
            })
          } else {
            this.fullScreenLoading = false
            this.$message({
              type: 'error',
              message: '修改失败，请重试！'
            })
          }
        })
      },
      // 取消
      cancelUpdateMibList() {
        Bus.$emit('updateMibListSuccess')
      }
    },
    mounted() {
      this.editMonitorTypeLists = this.tempRowData.monitorTypes || []      // 监控项类型列表
      // 添加MIB基本信息
      this.editMibListForm = {
        // name: this.tempRowData.name,
        threeTypeName: this.tempRowData.threeTypeName,
        manufactUuid: this.tempRowData.manufactUuid,
        productUuid: this.tempRowData.productUuid,
        keyWord: this.tempRowData.keyWord,
        sysObjectOid: this.tempRowData.sysObjectOid,
        uuid: this.tempRowData.uuid,
        template: this.tempRowData.template
      }
      /* 监控项类型更改后的数据回显 */
      Bus.$on('editMiblistMonitorTypeOver', (backData) => {
        let flag = null
        this.editMonitorTypeLists.forEach((innerItem, $index) => {
          if (innerItem.chName === backData.chName) {
            flag = $index
          }
        })
        if (flag === null) {
          this.editMonitorTypeLists.push(backData)
        } else {
          this.editMonitorTypeLists.splice(flag, 1, backData)
        }
      })
      /* 监控项类型新增后的数据回显 */
      Bus.$on('addMonitorTypeOver', (backData) => {
        if (this.editMonitorTypeLists.length === 0) {
          this.editMonitorTypeLists.push(backData)
        } else {
          let flag = null
          this.editMonitorTypeLists.forEach((innerItem, $index) => {
            if (innerItem.chName === backData.chName) {
              flag = $index
            }
          })
          if (flag === null) {
            this.editMonitorTypeLists.push(backData)
          } else {
            this.editMonitorTypeLists.splice(flag, 1, backData)
          }
        }
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #editMibListForm
    .s-form-item
      margin-bottom 0
</style>
