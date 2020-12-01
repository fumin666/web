/**
 * @author fumin
 * @date 2019/11/1
 * @Description: 报表订阅-报表选择添加
*/
<template>
  <section>
    <s-scrollbar wrap-style="max-height:660px;" >
      <s-tree
        :data="list"
        show-checkbox
        node-key="uuid"
        accordion
        ref="tree"
        highlight-current
        :props="defaultProps">
      </s-tree>
    </s-scrollbar>
    <div style="float: right;margin: 20px 0 10px 0;">
      <s-button @click="getCheckList()">确定</s-button>
      <s-button type="cancel" @click="closeLogDialog()">取消</s-button>
    </div>
  </section>
</template>
<script type="text/babel">
  import $axios from 'sunflower-ajax';
  export default {
    data () {
      return {
        activeNames: '',
        list: {},
        defaultProps: {
          label: 'name',
          children: 'childrenList',
          uuid: 'uuid'
        },
        checkListUuids: {}, // 所选项uuid集合
        checkList: [], // 所选项全部信息
        allList: [],  // 提取的所有报表全部信息集合
        // isIndeterminate: false,
        checkAll: false,
        indeterminateArr: {},
        selectarr: [], // 选中的uuid集合
        checkAllArr: {} // 当前选项是否全选
      }
    },
    props: {
      checkLists: {
        type: Array
      }
    },
    methods: {
      getCheckList() {
        let vm = this
        for (var key in vm.list) {
          let list = vm.list[key]
          vm.allList.push(...list)
        }
        // 拿到uuid集合和所选择项的集合（最底层的报表）
        vm.checkListUuids = this.$refs.tree.getCheckedNodes(true)
        vm.selectarr = this.$refs.tree.getCheckedKeys()
        vm.$emit('getLogList', vm.checkListUuids, vm.selectarr)
      },
      closeLogDialog() {
        this.$parent.$parent.addLogDialog = false
      }
    },
    watch: {
    },
    mounted() {
      this.$refs.tree.setCheckedKeys(this.checkLists, true)
    },
    created() {
      this.list = []
      $axios.get('/gradeProtection/reportSubscribe').then(res => {
        if (Object.keys(res.data).length > 0) {
          this.list = res.data;
          for (let i in res.data) {
            this.$set(this.indeterminateArr, i, false)
            this.$set(this.checkAllArr, i, false)
            this.$set(this.checkListUuids, i, [])
          }
        }
      })
  }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
