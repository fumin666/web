<template>
  <s-row style="margin-left: -18px;">
    <s-col :span="5">
      <s-tree id="itAssetsTree" ref="hostGroupTree"
              :data="cmdTreeData" :props="cmdTreeProps"
              @node-click="handleTreeNodeClick"
              :highlight-current="true"
              :default-expand-all="expandAll"
              node-key="uuid"
              show-checkbox
              @check="handleCheckChange"
              :current-node-key="curNodeUuid"
              :expand-on-click-node="false">
      </s-tree>
    </s-col>
    <s-col :span="19">
      <s-table-page :data="list" :header-search="getHeaderSearch()" ref="cmdTable" @selection-change="handleCmdSelectChange" :show-header-checkbox="true" height="480">
        <s-table-column type="selection" width="55px" :reserve-selection="true"></s-table-column>
        <s-table-column label="命令" prop="commandName" show-overflow-tooltip></s-table-column>
        <s-table-column label="参数" prop="commandPara" show-overflow-tooltip></s-table-column>
        <s-table-column
          label="匹配类型"
          prop="type"
          :filters="[{text: '精确匹配', value: 0}, {text: '模糊匹配', value: 1}, {text: '任意匹配', value: 2}]"
          :filter-method="filterType">
          <template slot-scope="scope">
            <span v-text="getType(scope.row.type)"></span>
          </template>
        </s-table-column>
        <s-table-column label="命令模板" prop="templateName" show-overflow-tooltip></s-table-column>
      </s-table-page>
    </s-col>
  </s-row>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    data() {
      return {
        selectedList: [],
        cmdTreeData: [],
        list: [],
        templateUuid: [],
        checked: false,
        flag: false,
        expandAll: true,          // 是否全部展开树节点
        curNodeUuid: '',
        cmdTreeProps: {
          children: 'childrenList',
          label: 'name'
        }
      }
    },
    props: {
      selectedData: {
        type: Array,
        default: []
      },
      mode: {
        type: Number,
        default: 0
      },
      checkKeys: {
        type: Array,
        default: []
      }
    },
    methods: {
      getCmdTreeData(callback = () => {
      }) {
        this.$refs.hostGroupTree.setCheckedKeys(this.checkKeys, true);
        $axios.get('/commandTemplate/getCommandTemplateTree').then(res => {
          if (res.data) {
            this.cmdTreeData = res.data
            if (this.curNodeUuid === '') {
              this.$nextTick(function() {
                this.curNodeUuid = this.cmdTreeData[0].uuid
                this.$refs.hostGroupTree.setCurrentKey(this.cmdTreeData[0].uuid)
              })
            } else {
              this.$nextTick(function() {
                this.$refs.hostGroupTree.setCurrentKey(this.curNodeUuid)
              })
            }
            callback()
          }
        })
      },
      handleTreeNodeClick(data) {
        this.checked = true
        this.curNodeUuid = data.uuid;
        if (this.templateUuid.includes(data.uuid)) {
          this.flag = true
        } else {
          this.flag = false
        }
        this.getList([data.uuid])
      },
      handleCheckChange(data, checked) {
        this.checked = true
        this.templateUuid = checked.checkedKeys
        if (this.templateUuid.length) {
          this.flag = true
          this.getList(this.templateUuid)
        } else {
          this.flag = false
          this.getList([this.cmdTreeData[0].uuid])
        }
      },
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入命令或命令模板进行查询',
          searchProps: ['commandName', 'templateName']
        }
      },
      getList(uuid) {
        let vm = this;
        $axios.post(`/commandInfo/getAllCommandByTemplateInfo`, uuid).then((res) => {
          if (res.data && res.data instanceof Array) {
            vm.list = res.data;
            vm.selectedData.forEach((selectItem) => {
              vm.list.forEach((element, index) => {
                if (element.commandId === selectItem.commandId) {
                  if (selectItem.cmdType !== vm.mode) {
                    vm.list.splice(index, 1)
                  }
                }
              })
            });
          }
          vm.$nextTick(() => {
            for (let i = 0; i < vm.list.length; i++) {
              let cmd = vm.list[i];
              if (!vm.flag) {
                if (vm.selectedData.length > 0) {
                  let index = vm.selectedData.findIndex((element) => { return element.commandId === cmd.commandId });
                  if (index !== -1) {
                    vm.$refs.cmdTable.toggleRowSelection(cmd);
                  }
                }
              } else {
                vm.$refs.cmdTable.toggleRowSelection(cmd)
              }
            }
          })
        });
      },
      getType(type) {
        let types = ['精确匹配', '模糊匹配', '任意匹配'];
        return types[type];
      },
      handleCmdSelectChange(val) {
        this.selectedList = val;
      },
      filterType(value, row) {
        return row.type === value;
      }
    },
    mounted() {
      this.templateUuid = this.checkKeys
      this.getCmdTreeData(() => {
        this.getList([this.cmdTreeData[0].uuid]);
      })
    }
  }
</script>
