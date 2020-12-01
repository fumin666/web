<template>
  <div class="inputTree" v-clickoutside="closeTree">
    <s-input :value="node.label" @click.native="flag=!flag" :disabled="disabled" readonly ref="input" v-if="!muti">
    </s-input>
    <s-input :value="mutiValue" @click.native="flag=!flag" :disabled="disabled" readonly ref="input" v-else>
    </s-input>
    <span class="iconContainer" style="line-height: 33px; font-weight: 600;">
    <i class="iconfont icon-plus" @click="flag=!flag"></i>
      <i class="iconfont icon-delete" v-if="hasDelIcon && (value || value === 0)" @click="clear"></i>
    </span>
    <div class="treeContainer" v-show="flag && !disabled">
      <s-scrollbar wrap-class="inputTreeHeight" :expand-on-click-node="false">
        <s-tree :data="data" :props="props" v-if="!muti"
                :highlight-current="true"
                @node-click="nodeClick"
                :node-key="name"
                :current-node-key="innerValue"
                :expand-on-click-node="false"
                :default-expand-all="true"
                ref="tree"
        >
        </s-tree>
        <s-tree :data="data" :props="props" v-else
                show-checkbox
                @check-change="checkChange"
                :node-key="name"
                :default-checked-keys="innerValue"
                :expand-on-click-node="false"
                :default-expand-all="true"
                ref="tree"
        >
        </s-tree>
      </s-scrollbar>
    </div>
  </div>
</template>

<script>
  import Clickoutside from './clickoutside';

  export default {
    data() {
      return {
        flag: false,
        node: {},
        innerValue: '',
        mutiValue: ''
      }
    },
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default() {
          return []
        }
      },
      name: {
        require: true,
        type: String,
        default: ''
      },
      props: {
        type: Object,
        default() {
          return {
            children: 'children',
            label: 'label'
          }
        }
      },
      value: [String, Number, Array],
      muti: {
        type: Boolean,
        default: false
      },
      hasDelIcon: {
        type: Boolean,
        default: false
      }
    },
    directives: {Clickoutside},
    methods: {
      checkChange() {
        if (this.muti) {
          this.cycleCheckNodes();
        }
      },
      nodeClick(nodeData, node) {
        this.node = node;
        if (!this.muti) {
          this.flag = false;
        }
      },
      closeTree() {
        this.flag = false;
      },
      selectDefaultNode() { // 单选树默认选中默认值对应的节点
        let _this = this;
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(_this.innerValue);
          filterNode(this.$refs.tree.root.childNodes);
        });
        // 默认选中节点
        function filterNode (nodeArr) {
          let childNodeArr = [];
          nodeArr.forEach(node => {
            if (node.data[_this.name] === _this.innerValue) {
              _this.node = node;
              return;
            } else if (node.childNodes.length !== 0) {
              childNodeArr.push(...node.childNodes);
              filterNode(childNodeArr);
            }
          });
        }
      },
      isArray(val) {
        return Object.prototype.toString.call(val).indexOf('Array') !== -1;
      },
      showDefaultNode() { // 复选树默认展示真实值对应的节点
        let resultArr = [];
        let childField = this.props.children;
        let labelField = this.props.label;
        let _this = this;

        function cycle (arr) {
          arr.forEach(item => {
            if (item[childField] && item[childField].length > 0) {
              cycle(item[childField])
            } else {
              let result = _this.innerValue.filter(innerItem => {
                return innerItem === item[_this.name]
              });
              if (result) {
                resultArr.push(item[labelField]);
              }
            }
          })
        }

        cycle(this.data);
        return resultArr.join(',');
      },
      cycleCheckNodes(field) {
        this.$nextTick(() => {
          let checkedNodes = this.$refs.tree.getCheckedNodes();
          let childField = this.props.children;
          let labelField = this.props.label;
          // 只显示子节点，父节点不显示，父节点只用作分组
          let arr = checkedNodes.filter(item => {
            return !item[childField] || item[childField].length === 0;
          }).map(item => {
            return item;
          });
          this.mutiValue = arr.map(item => {
            return item[labelField];
          }).join(',');
          let realVal = arr.map(item => {
            return item[this.name];
          }).join(',');
          this.$emit('check-change', checkedNodes);
          this.$emit('input', realVal);
        });
      },
      clear() {
        this.$refs.tree.setCurrentKey(null);
        this.$emit('input', null);
        this.flag = false
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (this.muti && !this.isArray(val)) {
            this.innerValue = (val + '').split(',');
          } else if (!this.muti && this.isArray(val)) {
            this.innerValue = val.join('');
          } else {
            this.innerValue = val ? (val + '') : '';
          }
          if (this.data.length === 0) return;
          if (!val) {
            if (!this.muti) {
              this.node = {
                label: '',
                data: ''
              };
            }
            return;
          }
          if (!this.muti) {
            this.selectDefaultNode();
          } else {
            this.cycleCheckNodes();
          }
        }
      },
      data: {
        immediate: true,
        handler(val) {
          if (val.length === 0 || !this.value) return;
          if (!this.muti) {
            this.selectDefaultNode();
          } else {
            this.cycleCheckNodes();
          }
        }
      },
      'node.data': { // 此处watch  node.data，如果watch  node,这是一个dom节点，会触发两次watch回调
        deep: true,
        handler(data) {
          if (this.muti || !data) return
          if (this.name !== '') {
            this.$emit('input', data[this.name]);
          } else {
            this.$emit('input', data);
          }
          this.$emit('select-change', data)
          // 下面代码是为了验证生效，因为选中值时是先blur再绑定值，所以需要在绑定值之后在手动blur
          let inputEl = this.$refs.input.$el.children[0];
          inputEl.focus();
          inputEl.blur();
        }
      },
      flag(val) {
//        if (!val && this.muti) {
//          let checkedNodes = this.$refs.tree.getCheckedNodes();
//          this.$emit('check-change', checkedNodes);
//          this.cycleCheckNodes();
//        }
      }
    }
  }
</script>
