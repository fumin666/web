<!--
 * @Author: 高建鹏
 * @Description:操作栏按钮显示与隐藏组件
 * @Position:src\components\tableHandleHidden\buttonSet.vue
 * @Date: 2019-10-28 09:43:34
 * @LastEditors  : mybells
 -->
<template>
  <div class="buttonSet_all">
    <div v-if="data.length===1">
      <i v-for="(item, index) in data[0]" :key="index" :class="`iconfont icon-${item.icon}`" @click="item.handler(scope.row,scope,$event)" :title="item.name"></i>
    </div>
    <div v-else-if="data.length>1">
      <i v-for="(obj, index) in data[0]" :key="index" :class="`iconfont icon-${obj.icon}`" @click="obj.handler(scope.row,scope,$event)" :title="obj.name"></i>
      <s-popover
        popper-class="buttonSet_style"
        :append-to-table="option.appendId?option.appendId:''"
        :ref="'popover'+scope.row.uuid"
        :placement="option.placement?option.placement:'left'"
        :trigger="option.trigger?option.trigger:'click'"
      >
        <ul class="s-dropdown-menu button-set-box" style="width:120px;">
          <li style="overflow:hidden;text-overflow: ellipsis; white-space: nowrap;  padding-left: 10px; padding-right: 10px;" class="s-dropdown-item" v-for="(obj, index) in data[1]" :key="index" @click="obj.handler(scope.row,scope,$event)">
            <i :class="`iconfont icon-${obj.icon}`" :title="obj.name" style="font-size:14px; margin-right: 3px; color: #199FED"></i>
            <span :title="obj.name">{{obj.name}}</span>
          </li>
        </ul>
      <i class="iconfont icon-more" slot="reference"></i>
      </s-popover>
    </div>
  </div>
</template>

<script>
// import {chunk} from 'lodash';
  export default {
    props: {
      btnData: {
        type: Array,
        default: function() {
          return []
        }
      },
      scope: {
        type: Object
      },
      option: {
        type: Object,
        default: function() {
          return {
            isHidden: true,
            showNum: 3,
            appendId: '.s-table',
            trigger: 'click',
            placement: 'left'
          }
        }
      }
    },
    data() {
      return {
        data: []
      }
    },
    computed: {},
    created() {
      this.init();
    },
    watch: {
      scope(val) {
        this.init();
      }
    },
    methods: {
      init() {
        let arr = [];
        this.btnData.map(item => {
          if (item.v_if && item.v_noBtn) {
            if (item.v_if(this.scope.row, this.scope) && this.permissionJudge(item.v_noBtn))arr.push(item);
          } else if (item.v_if && !item.v_noBtn) {
            if (item.v_if(this.scope.row, this.scope))arr.push(item);
          } else if (!item.v_if && item.v_noBtn) {
            if (this.permissionJudge(item.v_noBtn))arr.push(item);
          } else {
            arr.push(item);
          }
        })
        if (arr.length > this.option.showNum && this.option.isHidden) {
          this.data = [arr.slice(0, this.option.showNum), arr.slice(this.option.showNum)];
        } else {
          this.data = [arr];
        }
      },
      permissionJudge(value) {
        let authMenu = this.$store.getters.authMenu;// 获取所有一级目录
        for (let item of authMenu) {
          if (item.keyWord === value) {
            return true;
          }
        }
        return false;
      }
    },
    beforeDestroy() {
      // eslint-disable-next-line no-undef
      $('.buttonSet_style').remove()
    }
  }
</script>

<style lang="stylus">
.buttonSet_style{
  padding:10px 0;
}
.button-set-box .s-dropdown-item:hover > i{
  color #fff!important
}

// .buttonSet_style{
//   padding:6px 8px;
//   color: #199FED;//#6da0cb
//   background:#fff;//#19232e;
//   .popper-arrow:after{
//     border-left-color:#fff !important;
//   }
//   .iconfont{
//     font-size: 20px;
//     cursor:pointer;
//     margin:0 2px;
//   }
// }
</style>
