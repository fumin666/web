<!--
 * @Author: 高建鹏
 * @Description:动态列设置弹窗组件（实现了拖拽排序功能、动态列显示和隐藏设置、全部列显示和隐藏设置、自定义设置。）
 * @Position:src\components\dynamicColumnDialog\DynamicColumnSet.vue
 * @Date: 2019-10-24 17:40:22
 * @LastEditors  : mybells
 -->
<template>
  <div>
      <s-popover popper-class="poppermodal" ref="popover" :width="option.width" placement="bottom-end" trigger="click" @show="show" @hide="hide">
        <div slot="reference">
          <slot name="click"></slot>
          <!-- <i class="iconfont icon-set"></i> -->
        </div>
        <div class="popper_setting">
          <div class="popper_setting_header">
            <div>
              <i class="iconfont icon-set iconposition"></i>
              <span class="fontcolor85" style="font-weight:bold;">{{option.title}}</span>
            </div>
            <div>
              <span class="fontcolor65">全部显示</span>
              <i class="popper_setting_showall iconfont fontcolor65" :class='{"theme_iconcolor":showall,"icon-invisible":!showall,"icon-visible":showall}' @click="showallclick"></i>
            </div>
          </div>
          <s-scrollbar :wrap-style="scrollstyle">
            <draggable
              class="list-group"
              tag="ul"
              :options="{animation: 60,handle:'.list-group-item'}"
              v-model="data"
            >
              <transition-group type="transition" name="flip-list">
                <li
                  class="list-group-item"
                  v-for="(element,index) in data"
                  :key="element[option.key]"
                >
                  <s-col :span="20" style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
                    <span style="font-size:12px;" class="fontcolor65">{{ index+1 }}</span>
                    {{ element[option.nameKey] }}
                  </s-col>
                  <s-col :span="4" style="text-align: right">
                    <i class="iconfont"
                       style="font-size:16px;vertical-align: middle;cursor: pointer"
                       @click="showclick(element)"
                       :class='{theme_iconcolor:element[option.showKey],
                       "icon-invisible":!element[option.showKey],"icon-visible":element[option.showKey],
                       "is-disabled": option.disabledKey ? !element[option.disabledKey] : false}'></i>
                    <i style="font-size:20px;" class="iconfont icon-dragable handle"></i>
                  </s-col>
                </li>
              </transition-group>
            </draggable>
            <slot name="otherSetting"></slot>
          </s-scrollbar>
          <s-row style="float: right;margin-right: 10px;margin-top: 20px;">
            <s-button @click="saveform()">保 存</s-button>
            <s-button @click="close()" class="s-button-cancel">取 消</s-button>
          </s-row>
        </div>
      </s-popover>
  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import {cloneDeep} from 'lodash';
  export default {
    components: {
      draggable
    },
    props: {
      dynamicData: {
        type: Array,
        default: function() {
          return []
        }
      },
      option: {
        type: Object,
        default: function() {
          return {
            title: '列显示设置',
            key: 'uuid', // key
            nameKey: '', // 名字key
            showKey: '', // 是否显示key
            sortKey: '', // 排序key
            disabledKey: '', // 是否置灰key
            width: '300',
            height: '500'
          }
        }
      }
    },
    data() {
      return {
        showall: 1,
        data: []
      }
    },
    computed: {
      dragOptions() {
        return {
          animation: 0,
          group: 'description',
          disabled: false,
          ghostClass: 'ghost'
        };
      },
      scrollstyle() {
        return `height:${this.option.height}px;paddingRight:10px;`;
      }
    },
    created() {
    },
    watch: {
      dynamicData() {
        this.getdata();
      }
    },
    methods: {
      hide() {
        this.$emit('hide');
      },
      show() {
        this.$emit('show');
        this.getdata();
      },
      getdata() {
        this.showall = 1;
        this.data = cloneDeep(this.dynamicData);
        this.data.sort((a, b) => a[this.option.sortKey] - b[this.option.sortKey]);
        for (let obj of this.data) {
          if (!obj[this.option.showKey]) {
            this.showall = 0;
            break;
          }
        }
      },
      // 拖拽更新后触发
      handleupdate(obj) {
        // this.data[obj.oldIndex].viewIndex=obj.newIndex
      },
      // 列显示click
      showclick(obj) {
        if (obj.editFlag === 0) {
          return false
        }
        obj[this.option.showKey] = Number(!obj[this.option.showKey]);
        this.showall = 1;
        for (let item of this.data) {
          if (!item[this.option.showKey]) {
            this.showall = 0;
            break;
          }
        }
      },
      // 全部显示click
      showallclick() {
        this.showall = !this.showall;
        if (this.option.disabledKey !== undefined) { // 如果后台数据返回editFlag: 0 就不可编辑
          this.data.map(item => {
            if (item[this.option.disabledKey] !== 0) { // 如果后台数据返回editFlag: 0 就不可编辑
              this.showall ? (item[this.option.showKey] = 1) : (item[this.option.showKey] = 0)
            }
          })
        } else {
          this.data.map(item => {
            this.showall ? (item[this.option.showKey] = 1) : (item[this.option.showKey] = 0)
          })
        }
      },
      saveform() {
        this.data.map((obj, index) => {
          obj[this.option.sortKey] = index;
        })
        this.$emit('save', this.data);
        this.$refs.popover.doClose();
      },
      close() {
        this.$refs.popover.doClose()
      }
    }
  }
</script>

<style lang="stylus">
.popper_setting
  padding-left:10px;
  .popper_setting_header
    display:flex;
    padding-right:10px;
    font-size: 14px;
    justify-content: space-between;
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    .popper_setting_showall
      font-size:16px;
      vertical-align: middle;
      cursor: pointer
  .iconposition
    position:relative;
    top:1px;
  .sx.s-input-number.is-controls-right
    .s-input-inner
      padding-left:5px !important;
      margin-left:0 !important;
.popper_setting
  .flip-list-move
    transition: transform 0.5s;
  .no-move
    transition: transform 0s;
  .ghost
    opacity: 0.5;
    background: #c8ebfb;
  .list-group
    margin-bottom: 20px;
    min-height: 20px;
  .list-group-item
    clear: both;
    list-style: none;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    .handle
        visibility:hidden;
    &:hover
      .handle
        // background: #f5f7fa;
        visibility:visible;
  .list-group-item .handle
    vertical-align: middle;
    cursor: move
  .list-group-item .is-disabled
    -webkit-filter: grayscale(100%)
    -moz-filter grayscale(100%)
    -ms-filter grayscale(100%)
    filter grayscale(100%)
    filter gray;
    cursor not-allowed
//去掉dialog模态框，嵌套dialog必须去除模态框，dialog设置:modal='false'否则会导致设置中的dialog点击不了。
.poppermodal + .v-modal
  position unset
</style>
