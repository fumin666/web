<!--<script src="../../plugins/ajax/index.js"></script>-->
<template>
  <section>
    <s-scrollbar wrap-class="scrollMaxH">
      <s-row class="title">
        <i class="iconfont icon-tag"></i>
        <span>基本信息</span>
      </s-row>
      <s-row>
        <s-form
          ref="eidtMonitorTypeForm"
          :model="editMonitorTypeBase"
          :rules="editMonitorTypeBaseRules"
          label-width="140px">
          <s-form-item label="监控项类型:" prop="chName">
            <select-tree
              v-model="editMonitorTypeBase.chName"
              :url="editMonitorTypeUrl"
              name="name"
              @selectTreeChange="editGetMonitorType">
            </select-tree>
          </s-form-item>
          <s-form-item label="基OID:" prop="baseOid">
            <s-input v-model="editMonitorTypeBase.baseOid"></s-input>
          </s-form-item>
          <s-form-item label="监控项Title:">
            <s-input v-model="editMonitorTypeBase.titleOid"></s-input>
          </s-form-item>
          <s-form-item label="监控项过滤OID:">
            <s-input v-model="editMonitorTypeBase.filterOid"></s-input>
          </s-form-item>
        </s-form>
      </s-row>

      <s-row class="title">
        <i class="iconfont icon-approve"></i>
        <span>中间监控指标</span>
      </s-row>
      <s-row>
        <s-row>
          <s-button icon="plus" @click="editAddMiddleMonitorIndex">添加</s-button>
          <s-button icon="delete" @click="editDeleteMiddleMonitorIndex">删除</s-button>
        </s-row>
        <s-row>
          <s-table
            ref="editMiddleMonitorIndexTable"
            :data="editMiddleMonitorLists"
            @selection-change="editHandleSelectionChange">
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
          </s-table>
        </s-row>
      </s-row>

      <s-row class="title">
        <i class="iconfont icon-approve"></i>
        <span>监控指标</span>
      </s-row>
      <s-row>
        <s-table
          ref="editMonitorIndexTable"
          :data="editMonitorIndexLists"
          @selection-change="editMonitorIndexSelectionsChange">
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
        </s-table>
      </s-row>

      <s-row class="footerRow">
        <s-button type="cancel" @click="cancelEditAddMonitorType">取消</s-button>
        <s-button @click="editAddMonitorType">添加</s-button>
      </s-row>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  import selectTree from '@/components/selectTree/SelectTree.vue'
  import Bus from '@/plugins/eventBus'

  export default{
    data() {
      return {
        tempInitData: this.initData,
        editMonitorTypeUrl: '/systemmanager/mibtool/monitorTypeSortTree',
        editMiddleMonitorLists: [],           // 中间监控指标列表
        editMiddleMonitorSelections: [],      // 中间监控指标多选列表
        editMonitorIndexLists: [],            // 监控指标列表
        editMonitorIndexSelections: [],       // 监控指标多选列表

        /* 解决中间监控指标初始化时赋值后又被刷新为空的问题 */
        isFirst: true,

        editMonitorTypeBase: {
          chName: this.initData.chName,
          name: this.initData.name,
          baseOid: this.initData.baseOid,
          titleOid: this.initData.titleOid,
          filterOid: this.initData.filterOid
        },
        editMonitorTypeBaseRules: {
          chName: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    props: {
      initData: {
        type: Object,
      default() {
          return {}
        }
      }
    },
    components: {
      selectTree
    },
    methods: {
      /* select-tree 选择节点数据获取 */
      editGetMonitorType(data) {
        // 获取监控项类型英文名称
        this.editMonitorTypeBase.name = data.node.name
        // 刷新中间监控指标列表
        if (this.isFirst === true) {
          // 第一次加载页面，触发该函数，中间监控指标列表不刷新
            // this.editMonitorIndexSelections = this.tempInitData.monitorValues.itemDescs      // 监控指标多选列表
          this.isFirst = false
        } else {
          // 选择监控项类型，刷新中间监控指标列表
          this.editMiddleMonitorLists = []
        }
        // 初始化监控指标列表
        this.editMonitorIndexLists = []
        data.node.itemDesc.forEach((i) => {
          let temp = {}
          for (let key in i) {
            temp[key] = i[key]
          }
          this.editMonitorIndexLists.push(temp)
          // this.editMonitorIndexLists.push(Object.assign({}, i))
        })
        this.editMonitorIndexLists.forEach((item) => {
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
        this.$nextTick(() => {
          this.editMonitorIndexSelections.forEach((list) => {
            this.editMonitorIndexLists.forEach((item) => {
              if (item.alias === list.alias) {
                this.$refs['editMonitorIndexTable'].toggleRowSelection(item, true)
                item.express = list.express
              }
            })
          })
        })
      },
      /* 新建中间监控指标 */
      editAddMiddleMonitorIndex() {
        Bus.$emit('showMiddleMonitorDialog', 'editMonitorType')
      },
      /* 中间监控指标多选 */
      editHandleSelectionChange(val) {
        this.editMiddleMonitorSelections = val
      },
      /* 删除中间监控指标 */
      editDeleteMiddleMonitorIndex() {
        if (this.editMiddleMonitorSelections.length === 0) {
          this.$message({
            type: 'warning',
            message: '请至少选择一项！'
          })
        } else {
          this.$confirm('确定删除所选数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.editMiddleMonitorSelections.forEach((slc) => {
              this.editMiddleMonitorLists.forEach((origin, deleteFlag) => {
                if (slc.key === origin.key) {
                  this.editMiddleMonitorLists.splice(deleteFlag, 1)
                }
              })
            })
          }).catch(() => {})
        }
      },
      /* 编辑中间监控指标 */
      editMiddleMonitorItem(row, $index) {
        Bus.$emit('showMiddleMonitorDialog-edit', {row, $index, callerName: 'editMonitorType'})
      },
      /* 监控指标多选 */
      editMonitorIndexSelectionsChange(val) {
        this.editMonitorIndexSelections = val
      },
      /* 编辑后 添加监控项类型 */
      editAddMonitorType() {
        if (this.editMonitorIndexSelections.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择监控类型'
          })
        } else {
          // 传递回显数据
          let tempData = {
            itemDescs: this.editMonitorIndexSelections.concat(),
            tempVariables: this.editMiddleMonitorLists.concat()
          }
          this.$set(this.editMonitorTypeBase, 'monitorValues', Object.assign({}, tempData))
          Bus.$emit('editMiblistMonitorTypeOver', this.editMonitorTypeBase)
          // 关闭弹框
          Bus.$emit('editMonitorTypeOver')
        }
      },
      cancelEditAddMonitorType() {
        Bus.$emit('editMonitorTypeOver')
      }
    },
    mounted() {
      // 添加中间监控指标
      Bus.$on('editMonitorType-closeMiddleMonitorDialog', (data) => {
        this.editMiddleMonitorLists.push(data)
      })
      this.editMiddleMonitorLists = this.tempInitData.monitorValues.tempVariables.concat() || []       // 中间监控指标列表
      this.editMonitorIndexSelections = this.tempInitData.monitorValues.itemDescs.concat()             // 监控指标多选列表

      // 添加中间监控指标
      Bus.$on('editMonitorType-closeMiddleMonitorDialog-edit', (data) => {
        console.log(data)
        this.editMiddleMonitorLists.splice(data.$index, 1, Object.assign({}, data.backData))
      })
    },
     beforeDestroy() {
      this.isFirst = true
    }
  }
</script>
