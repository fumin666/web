/*
create by YOU
*/
<template>
  <div class="my-tb set-key-index">
    <s-row>
      <s-col :span="2">
        <s-checkbox v-model="checkAll" @change="toggleAll(checkAll)"></s-checkbox>
      </s-col>
      <s-col :span="22">关键指标项</s-col>
    </s-row>
    <s-row v-for="(item, index) in data.ztreeNodeList" :key="index">
      <s-col :style="{paddingLeft: item.parentName ? '38px' : '8px'}" :span="24">
        <s-checkbox @change="handleChange(item, index)" v-model="item.checked">
          {{ item.dataobj.name ? item.dataobj.name : item.dataobj.monitorName }}
        </s-checkbox>
      </s-col>
      <s-col style="padding-left: 68px" v-if="item.objectList" :span="24">
        <s-checkbox v-for="(i, key) in item.objectList" v-model="i.checked" @change="handleItemChange(i, item)"
                    :key="key">{{ i.name }}
        </s-checkbox>
      </s-col>
    </s-row>
  </div>
</template>

<script type="text/babel">
  export default {
    props: {
      data: {
        type: Object,
        default: function () {
          return {
            ztreeNodeList: [],
            relationList: []
          }
        }
      }
    },
    data () {
      return {
        checkAll: false
      }
    },
    watch: {
      data () {
        this.init()
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        let _self = this
        _self.$nextTick(function () {
          _self.data.ztreeNodeList.map(function (item) {
            _self.$set(item, 'checked', false)
          })
        })
      },
      toggleAll (checked) {
        let _self = this
        _self.$nextTick(function () {
          _self.data.ztreeNodeList.map(function (item, index) {
            if (item.parent) {
              _self.handleChange(item, index, checked)
            }
          })
        })
      },
      handleChange (item, index, checked) {
        let _self = this
        if (checked !== undefined) {
          item.checked = checked
        }
        this.$nextTick(function () {
          let list = _self.data.ztreeNodeList
          if (item.parent) {
            let parentName = item.dataobj.name
            for (let i = index + 1; i < list.length; i++) {
              if (parentName === list[i].parentName) {
                console.log(parentName)
                list[i].checked = item.checked
                let arr = list[i]
                if (!arr.parent) {
                  if (arr.objectList) {
                    for (let i = 0; i < arr.objectList.length; i++) {
                      arr.objectList[i].checked = item.checked
                    }
                  }
                }
              } else {
                break;
              }
            }
          } else {
            if (item.objectList) {
              for (let i = 0; i < item.objectList.length; i++) {
                item.objectList[i].checked = item.checked
              }
            }
          }
        })
      },
      handleItemChange (item, parentItem) {
        this.$nextTick(() => {
          if (!item.checked) {
            parentItem.checked = false
          } else {
            let checked = true
            parentItem.objectList.map(item => {
              if (item.checked === false) {
                checked = false
              }
            })
            parentItem.checked = checked
          }
        })
      }
    }
  };
</script>
