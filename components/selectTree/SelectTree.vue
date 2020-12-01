<template>
  <input-tree
    :data="data"
    :name="name"
    :node-key="name"
    :props="props"
    :muti="muti"
    :value="valueTemp"
    :disabled="disabled"
    @select-change="inputTreeChange"
    @check-change="inputTreeMutiChange"
    @input="input">
  </input-tree>
</template>

<script type="text/babel">
  import inputTree from '@/components/inputTree/InputTree'
  import $axios from 'sunflower-ajax'

  export default{
    data() {
      return {
        data: [],
        valueTemp: ''
      }
    },
    components: {
      inputTree
    },
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      // 获取原始数据需要请求的URL
      url: {
        type: String,
        default: '/systemmanager/mibtool/getCiTypeTree'
      },
      // 需要返回的字段(v-model要绑定的字段)
      name: {
        require: true,
        type: String,
        default: 'uuid'
      },
      props: {
        type: Object,
        default() {
          return {
            children: 'childrenList',   // 指定子树为节点标签的某个字段
            label: 'name'               // 指定节点标签文本为节点的某个字段
          }
        }
      },
      // 下拉选项默认初始值
      value: {
        type: [String, Number, Array],
        default: ''
      },
      // 是否多选
      muti: {
        type: Boolean,
        default: false
      },
      // 多选时返回空/全部选项
      returnEmpty: {
        type: Boolean,
        default: false
      },
      /**
       * 列表末尾追加"自定义"选项的自定义name值(解决MIB"资产厂商"自动识别后，名称回显的问题)
       */
      customName: {
        type: String,
        default: '自定义'
      }
    },
    watch: {
      customName(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.data[this.data.length - 1].name = newVal
        }
      },
      value: {
        immediate: true,
        handler(val) {
          if (val) {
            this.valueTemp = val
          }
        }
      },
      valueTemp(val) {
        if (val) {
          this.$emit('input', val)
        }
      }
    },
    methods: {
      inputTreeChange(nodeData) {
        this.$emit('selectTreeChange', nodeData)
      },
      inputTreeMutiChange(checkedNodes) {
        if (checkedNodes.length > 0 && checkedNodes[0].uuid === 'allSelection') {
          if (!this.returnEmpty) {
            this.$emit('selectMutiTreeChange', checkedNodes.slice(1))
          } else {
            this.$emit('selectMutiTreeChange', [])
          }
        } else {
          this.$emit('selectMutiTreeChange', checkedNodes)
        }
      },
      input(nameData) {
        this.$emit('input', nameData)
      },
      rename(arr) {
        for (let i = 0; i < arr.length; i++) {
          arr[i].name = arr[i].name.split('(')[0];
          if (arr[i].childrenList && arr[i].childrenList.length > 0) {
            this.rename(arr[i].childrenList);
          }
        }
        this.data = arr;
      }
    },
    created() {
      if (this.url === '/systemmanager/mibtool/getManufactTree') {
        $axios.get(this.url).then((res) => {
          let resData = res.data
          let resTreeData = []
          resData.forEach((item) => {
            if (item.dataobj.parentUuid === '0') {
              let tempParentObj = {
                name: item.dataobj.caption,
                parent: item.dataobj.parentUuid,
                uuid: item.dataobj.uuid,
                node: item.dataobj,
                childrenList: []
              }
              resData.forEach((list) => {
                if (list.dataobj.parentUuid === tempParentObj.uuid) {
                  let tempChildrenObj = {
                    name: list.dataobj.caption,
                    parent: list.dataobj.parentUuid,
                    uuid: list.dataobj.uuid,
                    node: list.dataobj
                  }
                  tempParentObj.childrenList.push(tempChildrenObj)
                }
              })
              resTreeData.push(tempParentObj)
            }
          })
          let custom = {
            name: this.customName,
            parent: true,
            uuid: 'custom',
            node: {
              name: this.customName,
              parent: true,
              uuid: 'custom'
            }
          }
          resTreeData.push(custom)
          this.data = resTreeData
        })
      } else if (this.url === '/systemmanager/mibtool/monitorTypeSortTree') {
        $axios.get(this.url).then((res) => {
          let resData = res.data
          let resTreeData = []
          resData.forEach((item) => {
            if (item.dataobj.parentUuid === '0') {
              let tempParentObj = {
                name: item.dataobj.cName,
                parent: item.dataobj.parentUuid,
                uuid: item.dataobj.uuid,
                node: item.dataobj,
                childrenList: []
              }
              resData.forEach((list) => {
                if (list.dataobj.parentUuid === tempParentObj.uuid) {
                  let tempChildrenObj = {
                    name: list.dataobj.cName,
                    parent: list.dataobj.parentUuid,
                    uuid: list.dataobj.uuid,
                    node: list.dataobj
                  }
                  tempParentObj.childrenList.push(tempChildrenObj)
                }
              })
              resTreeData.push(tempParentObj)
            }
          })
          this.data = resTreeData
        })
      } else if (this.url === '/resourcemanager/configurationmanage/citype/getCountCitypeTree') {
        $axios.get(this.url).then((res) => {
          if (res.data && res.data instanceof Array) {
            this.rename(res.data);
          }
        })
      } else if (this.url === '/departmentInfo/getAllDepartmentInfoForTree') {
        $axios.get(this.url).then((res) => {
          let resData = res.data.treeNodeList;
          if (resData && resData instanceof Array) {
            if (!this.muti) {
              this.data = resData
            } else {
              this.data = [{
                uuid: 'allSelection',
                name: '全选',
                parent: 'allSelectionTop',
                node: {
                  uuid: 'allSelection',
                  name: '全选',
                  parent: 'allSelectionTop'
                },
                childrenList: resData
              }]
              this.valueTemp = 'allSelection'
            }
          }
        })
      } else {
        $axios.get(this.url).then((res) => {
          let resData = res.data
          if (resData && resData instanceof Array) {
            if (!this.muti) {
              this.data = resData
            } else {
              this.data = [{
                uuid: 'allSelection',
                name: '全选',
                parent: 'allSelectionTop',
                node: {
                  uuid: 'allSelection',
                  name: '全选',
                  parent: 'allSelectionTop'
                },
                childrenList: resData
              }]
              this.valueTemp = 'allSelection'
            }
          }
        })
      }
    }
  }
</script>
