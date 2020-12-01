<template>
  <section>
    <s-scrollbar wrap-class="scrollMaxH">
      <s-row class="title">
        <i class="iconfont icon-tag"></i>
        <span>基本信息</span>
      </s-row>
      <s-row>
        <s-form
          ref="monitorTypeForm"
          :model="monitorTypeBase"
          :rules="monitorTypeBaseRules"
          label-width="140px">
          <s-form-item label="监控项类型:" prop="chName">
            <select-tree
              v-model="monitorTypeBase.chName"
              :url="monitorTypeUrl"
              name="name"
              @selectTreeChange="getMonitorType">
            </select-tree>
          </s-form-item>
          <s-form-item label="基OID:" prop="baseOid" tip="最大长度为100个字符">
            <s-input v-model="monitorTypeBase.baseOid" :maxlength="100"></s-input>
          </s-form-item>
          <s-form-item label="监控项Title:" tip="最大长度20个字符">
            <s-input v-model="monitorTypeBase.titleOid" :maxlength="20"></s-input>
          </s-form-item>
          <s-form-item label="监控项过滤OID:" prop="filterOid" tip="最大长度为100个字符">
            <s-input v-model="monitorTypeBase.filterOid" :maxlength="100"></s-input>
          </s-form-item>
        </s-form>
      </s-row>

      <s-row class="title">
        <i class="iconfont icon-approve"></i>
        <span>中间监控指标</span>
      </s-row>
      <s-row>
        <s-table-page
          ref="middleMonitorIndexTable"
          :data="middleMonitorLists"


          :header-actions="getListActionsDef()"
          :header-search='{show: false}'
          @selection-change="handleSelectionChange">
          <s-table-column
            type="selection"
            width="45">
          </s-table-column>
          <s-table-column
            label="名称"
            prop="key">
          </s-table-column>
          <s-table-column
            label="OID"
            prop="value">
          </s-table-column>
          <s-table-column
            label="正则表达式"
            prop="subRegex">
          </s-table-column>
          <s-table-column
            label="状态定义"
            prop="express">
          </s-table-column>
          <s-table-column
            label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-edit" title="编辑" @click="editMiddleMonitorItem(scope.row, scope.$index)"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-row>

      <s-row class="title">
        <i class="iconfont icon-approve"></i>
        <span>监控指标</span>
      </s-row>
      <s-row>
        <s-table-page
          ref="monitorIndexTable"
          :data="monitorIndexLists"

          :header-search='{show: false}'
          @selection-change="monitorIndexSelectionsChange">
          <s-table-column
            type="selection"
            width="45">
          </s-table-column>
          <s-table-column
            show-overflow-tooltip
            label="名称"
            prop="alias"
            width="160">
          </s-table-column>
          <s-table-column
            show-overflow-tooltip
            label="中文"
            width="150"
            prop="cn">
          </s-table-column>
          <s-table-column
            label="单位"
            width="80"
            prop="unit">
          </s-table-column>
          <s-table-column
            label="表达式"
            width="150">
            <template slot-scope="scope">
              <s-input
                v-model="scope.row.express">
              </s-input>
            </template>
          </s-table-column>
          <s-table-column
            show-overflow-tooltip
            label="AVA数值定义"
            prop="AVAStr">
          </s-table-column>
        </s-table-page>
      </s-row>

      <s-row class="footerRow">
        <s-button type="cancel" @click="cancelAddMonitorType">取消</s-button>
        <s-button @click="addMonitorType">保存</s-button>
      </s-row>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  import Bus from '@/plugins/eventBus'
  import selectTree from '@/components/selectTree/SelectTree.vue'

  export default{
    data() {
      return {
        monitorTypeUrl: '/systemmanager/mibtool/monitorTypeSortTree',
        middleMonitorLists: [],       // 中间监控指标列表
        middleMonitorSelections: [],   // 中间监控指标多选列表
        monitorIndexLists: [],        // 监控指标列表
        monitorIndexSelections: [],   // 监控指标列表多选列表

        monitorTypeBase: {
          chName: '',
          name: '',
          baseOid: '',
          titleOid: '',
          filterOid: ''
        },
        monitorTypeBaseRules: {
          chName: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          baseOid: [{
            required: true, message: '不能为空', trigger: 'blur'
          }, {
            max: 100, message: '最大长度为100个字符', trigger: 'blur'
          }, {
            pattern: /^(\d+\.)+\d+$/, message: '格式不正确', trigger: 'blur'
          }],
          filterOid: [{
            max: 100, message: '最大长度为100个字符', trigger: 'blur'
          }, {
            pattern: /^(\d+\.)+\d+$/, message: '格式不正确', trigger: 'blur'
          }]
        }
      }
    },
    components: {
      selectTree},
    methods: {
      getListActionsDef() {
        let vm = this
        return {
          width: 12,
          actions: [{
            name: '添加',
            icon: 'plus',
            click() {
              vm.addMiddleMonitorIndex()
            }
          }, {
            name: '批量删除',
            icon: 'batch-del',
            click() {
              vm.deleteMiddleMonitorIndex()
            }
          }]
        }
      },
      getMonitorType(data) {
        // 获取监控项类型英文名称
        this.monitorTypeBase.name = data.node.name
        // 刷新中间监控指标列表
        this.middleMonitorLists = []
        // 初始化监控指标列表
        this.monitorIndexLists = []
        data.node.itemDesc.forEach((i) => {
          let temp = {}
          for (let key in i) {
             temp[key] = i[key]
          }
          // this.monitorIndexLists.push(Object.assign({}, i))
          this.monitorIndexLists.push(temp)
        })
        this.monitorIndexLists.forEach((item) => {
          if (item.statusList !== null) {
            let AVAStr = ''
            if (item.statusList.stateList.length !== 0) {
              item.statusList.stateList.forEach((list) => {
                AVAStr += `${list.name}=${list.value}，`
              })
            }
            AVAStr = AVAStr.substring(0, AVAStr.length - 1)
            this.$set(item, 'AVAStr', AVAStr)
            this.$set(item, 'express', item.express)
          }
        })
      },
      // 新建中间监控指标
      addMiddleMonitorIndex() {
        Bus.$emit('showMiddleMonitorDialog', 'addMonitorType')
      },
      // 中间监控指标多选
      handleSelectionChange(val) {
        this.middleMonitorSelections = val
      },
      // 批量删除中间监控指标
      deleteMiddleMonitorIndex() {
        if (this.middleMonitorSelections.length === 0) {
          this.$message({
            type: 'warning',
            message: '请至少选择一项！'
          })
        } else {
          this.middleMonitorSelections.forEach((item) => {
            this.middleMonitorLists.forEach((list, deleteIndex) => {
              if (item.key === list.key) {
                this.middleMonitorLists.splice(deleteIndex, 1)
              }
            })
          })
        }
      },
      // 编辑中间监控指标
      editMiddleMonitorItem(row, $index) {
        Bus.$emit('showMiddleMonitorDialog-edit', {row, $index, callerName: 'addMonitorType'})
      },
      // 监控指标多选
      monitorIndexSelectionsChange(val) {
        this.monitorIndexSelections = val
      },
      /*
       * 添加监控项类型
       */
      addMonitorType() {
        this.$refs['monitorTypeForm'].validate((valid) => {
          if (valid) {
            if (this.monitorIndexSelections.length === 0) {
              this.$message({
                type: 'warning',
                message: '请选择监控指标'
              })
            } else {
              // 传递回显数据
              let addData = {
                itemDescs: this.monitorIndexSelections.concat(),
                tempVariables: this.middleMonitorLists.concat()
              }
              this.$set(this.monitorTypeBase, 'monitorValues', addData)
              Bus.$emit('closeMonitorTypeOver')
              Bus.$emit('addMonitorTypeOver', Object.assign({}, this.monitorTypeBase))
            }
          } else {
            return false
          }
        })
      },
      // 取消
      cancelAddMonitorType() {
        Bus.$emit('closeMonitorTypeOver')
      }
    },
    mounted() {
      // 新增中间监控项指标回显表格数据
      Bus.$on('addMonitorType-closeMiddleMonitorDialog', (data) => {
        this.middleMonitorLists.push(data)
      })
      // 编辑中间监控项指标回显表格数据
      Bus.$on('addMonitorType-closeMiddleMonitorDialog-edit', (data) => {
        this.middleMonitorLists.splice(data.$index, 1, Object.assign({}, data.backData))
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .footerRow
    text-align right
    margin-top 15px
</style>
