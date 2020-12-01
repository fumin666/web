<!--
 * @Author: 高建鹏
 * @Description: 监控统计图排序设置
 * @Position:
 * @Date: 2019-07-23 13:13:46
 * @LastEditors  : mybells
 -->
<template>
<div class="popper_setting">
    <div class="popper_setting_header">
      <div>
        <i class="iconfont icon-set iconposition"></i>
        <span class="fontcolor85" style="font-weight:bold;">列显示设置</span>
      </div>
      <div>
        <span class="fontcolor65">全部显示</span>
        <i style="popper_setting_showall iconfont" class="iconfont" :class='{"theme_color_default_font":showall,"icon-invisible":!showall,"icon-visible":showall}' @click="showallclick"></i>
      </div>
    </div>
    <s-scrollbar wrap-style="height:500px;padding-right:10px;">
      <draggable
        class="list-group"
        tag="ul"
        :options="{animation: 60,handle:'.list-group-item'}"
        @update="handleupdate"
        v-model="data.configs"
      >
        <transition-group type="transition" name="flip-list">
          <li
            class="list-group-item"
            v-for="(element,index) in data.configs"
            :key="element.uuid"
          >
            <s-col :span="20" style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
              <span style="font-size:12px;">{{ index+1 }}</span>
              {{ element.viewName }}
            </s-col>
            <s-col :span="4" style="text-align: right">
              <i class="iconfont"
                  style="font-size:16px;vertical-align: middle;cursor: pointer"
                  @click="showclick(element)"
                  :class='{theme_iconcolor:element.isShow,
                  "icon-invisible":!element.isShow,"icon-visible":element.isShow,}'></i>
              <i style="font-size:20px;" class="iconfont icon-dragable handle"></i>
            </s-col>
          </li>
        </transition-group>
      </draggable>
      <s-form :model="drawerForm" :rules="drawerFormRules" ref="drawerForm2">
        <s-form-item label="显示TOP" prop="topN" label-width="110px">
          <s-select v-model="drawerForm.topN" placeholder="请选择">
            <s-option :value="5"></s-option>
            <s-option :value="10"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="刷新频率(秒)" prop="refreshPeriod" label-width="110px">
          <s-input-number class="sx" style="width:170px;" v-model="drawerForm.refreshPeriod" :min="180" :max="1000"></s-input-number>
        </s-form-item>
        <s-form-item label="资产范围" prop="assetScop" label-width="110px">
          <s-radio-group v-model="drawerForm.assetScop">
            <s-radio :label='0'>默认</s-radio>
            <s-radio :label='1'>自定义</s-radio>
          </s-radio-group>
          <s-button size="mini" @click="rangeChange(drawerForm.assetScop)" v-if="drawerForm.assetScop===1">设 置</s-button>
        </s-form-item>
      </s-form>
    </s-scrollbar>
    <s-row style="float: right;margin-right: 10px;margin-top: 20px;">
      <s-button @click="saveform()">保 存</s-button>
      <s-button @click="close()" class="s-button-cancel">取 消</s-button>
    </s-row>
  <customSettingDialog v-if="customSettingDialog" :customSettingDialog.sync="customSettingDialog" :monitorCiypeuuid='monitorCiypeuuid' :customData="data.selectItcompList?data.selectItcompList:[]" @selectAsset="selectAsset"></customSettingDialog>
</div>
</template>

<script>
import draggable from 'vuedraggable';
// import {Validaters} from 'sunflower-common-utils';
import $axios from 'sunflower-ajax';
import {cloneDeep} from 'lodash';
import customSettingDialog from './CustomSetting.vue'
export default {
  components: {
    draggable,
    customSettingDialog
  },
  props: {
    monitorCiypeuuid: {// 资产类型
      type: String
    },
    setData: {// 获取数据
      type: Object
    }
  },
  data() {
    let checkNum = (rule, value, callback) => {  // 校验重复num
      if (typeof value === 'number') {
        if (Number.isInteger(value)) {
          if (value < 10) {
            return callback(new Error('必须大于等于10秒!'));
          } else {
            return callback();
          }
        } else {
          return callback(new Error('必须是整数!'));
        }
      } else {
        return callback(new Error('不能为空!'));
      }
    };
    return {
      showall: 1,
      drawerForm: {
        topN: 5,
        assetScop: 0,
        refreshPeriod: 0
      },
      drawerFormRules: {
        refreshPeriod: [
          {required: true, validator: checkNum, trigger: 'blur'}
        ]
      },
      customSettingDialog: false,
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
    }
  },
  created() {
    this.data = cloneDeep(this.setData);
    this.drawerForm.topN = this.data.topN;
    this.drawerForm.assetScop = this.data.assetScop;
    this.drawerForm.refreshPeriod = this.data.refreshPeriod;
    this.data.configs.sort((a, b) => a.viewIndex - b.viewIndex);
    for (let obj of this.data.configs) {
      if (obj.isShow === 0) {
        this.showall = 0;
        break;
      }
    }
    this.data.selectAsset = (this.data.selectItcompList || []).map(item => item.uuid);
  },
  methods: {
    // 拖拽更新后触发
    handleupdate(obj) {
      // this.data.configs[obj.oldIndex].viewIndex=obj.newIndex
    },
    // 全部显示click
    showallclick() {
      this.showall = !this.showall;
      this.data.configs.map(item => {
        this.showall ? (item.isShow = 1) : (item.isShow = 0)
      })
    },
    // 列显示click
    showclick(obj) {
      obj.isShow = Number(!obj.isShow);
    },
    close() {
      this.$emit('close')
    },
    /* 资产范围自定义弹窗 */
    rangeChange(val) {
      if (val === 1) {
        this.customSettingDialog = true;
      }
    },
    // 自定义设置保存
    selectAsset(arr) {
      if (arr.length) {
        this.data.selectAsset = arr.map(item => item.uuid) || [];
        this.data.selectItcompList = arr || [];
        this.customSettingDialog = false;
      } else {
        this.$message.warning('至少选择一个资产！')
      }
    },
    /* 保存 */
    saveform() {
      this.$refs.drawerForm2.validate((valid) => {
        if (valid) {
          let params = cloneDeep(this.data)
          params.topN = this.drawerForm.topN
          params.assetScop = this.drawerForm.assetScop
          params.refreshPeriod = this.drawerForm.refreshPeriod
          params.configs.map((obj, index) => {
            obj.viewIndex = index;
          })
          $axios.post(`/monitorview/setConfig/${this.monitorCiypeuuid}`, params).then((res) => {
            if (res.data && res.data.state) {
              this.$message.success(res.data.errormsg)
              this.$emit('reload')
            } else {
              this.$message.error(res.data.errormsg)
            }
          });
        }
      })
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
