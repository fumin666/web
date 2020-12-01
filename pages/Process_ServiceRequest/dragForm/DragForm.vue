<template>
  <section id="drag-form">
     <draggable v-model="dropLists" @start="drag=true" @end="drag=false">
      <s-row :gutter="15">
        <s-col :span="5">
          <div id="drag-area">
            <div class="drag-item" data-type="udf_char_single_line" draggable='true' @dragstart='dragStart($event)'>
              <i class="iconfont icon-file"></i>文本<i class="iconfont icon-arrow-right"></i>
            </div>
            <div class="drag-item" data-type="udf_char_list" draggable='true' @dragstart='dragStart($event)'>
              <i class="iconfont icon-list"></i>列表<i class="iconfont icon-arrow-right"></i>
            </div>
            <div class="drag-item" data-type="udf_long" draggable='true' @dragstart='dragStart($event)'>
              <i class="iconfont icon-after-change-psw"></i>数值<i class="iconfont icon-arrow-right"></i>
            </div>
            <div class="drag-item" data-type="udf_date" draggable='true' @dragstart='dragStart($event)'>
              <i class="iconfont icon-calendar"></i>日期<i class="iconfont icon-arrow-right"></i>
            </div>
          </div>
        </s-col>
        <s-col :span="19">
          <div id="drop-area" @drop='dropEnd($event)'>
            <s-scrollbar wrap-class="default-dialog-scroll">
              <div class="tip" v-if="dropLists.length===0">请将左侧要定义的字段类型拖拽至此，并填写详细信息</div>
              <s-row :gutter="10">
                <s-col
                  :span="12"
                  v-for="(item, idx) in dropLists"
                  :key="idx">
                  <div class="drop-item">
                    <s-row :gutter="10">
                      <s-col :span="6">
                        <div class="attr-tag">{{item.colnumName}}</div>
                      </s-col>
                      <s-col :span="18">
                      <span class="form-item">
                        <s-input :disabled="true" v-if="item.htmlType==='udf_char_single_line'||item.htmlType==='udf_long'"></s-input>
                        <s-select v-model="selectModel" :disabled="true" v-if="item.htmlType==='udf_char_list'"></s-select>
                        <s-date-picker type="datetime" :disabled="true" v-if="item.htmlType==='udf_date'"></s-date-picker>
                      </span>
                        <span>
                        <i class="iconfont icon-edit" @click="editFormItem(item)" v-if="item.isInherent"></i>
                        <i class="iconfont icon-delete" @click="deleteFormItem(item)" v-if="item.isInherent"></i>
                      </span>
                      </s-col>
                    </s-row>
                  </div>
                </s-col>
              </s-row>
            </s-scrollbar>
          </div>
        </s-col>
      </s-row>
    </draggable>

    <!--定义表单字段-文本/数字/日期-->
    <s-dialog
      v-model="defTxtNumDateDialog"
      v-if="defTxtNumDateDialog"
      :title="`定义表单字段-${dialogTitle}`">
      <def-form-text-num-date ref="defFormTxtNumDate" :dialogTitle="dialogTitle" :editData="editFormItemData"></def-form-text-num-date>
      <template slot="footer">
        <s-button @click="addFormTxtNumDate">确定</s-button>
        <s-button type="cancel" @click="defTxtNumDateDialog=false">取消</s-button>
      </template>
    </s-dialog>

    <!--定义表单字段-列表-->
    <s-dialog
      v-model="defListDialog"
      v-if="defListDialog"
      title="定义表单字段-列表">
      <def-form-list ref="defFormList" :editData="editFormItemData"></def-form-list>
      <template slot="footer">
        <s-button @click="addFormList">确定</s-button>
        <s-button type="cancel" @click="defListDialog=false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import {intersectObj} from 'sunflower-common-utils';
  import draggable from 'vuedraggable';
  import defFormList from '../DesignerDialog/DefFormList.vue'
  import defFormTextNumDate from '../DesignerDialog/DefFormTextNumDate.vue'

  export default {
    data() {
      return {
        currentDragDom: null,             // 拖拽时当前的DOM
        dropLists: [],                    // 最终定义的表单列表
        dialogTitle: '',                  // 定义表单字段弹框标题后缀(文本/数字/日期弹框)
        defTxtNumDateDialog: false,       // 定义表单字段-文本/数字/日期弹框
        defListDialog: false,             // 定义表单字段-列表弹框
        selectModel: '',
        editFormItemData: {}              // 编辑已生成的表单item数据
      }
    },
    components: {
      draggable,
      defFormList,
      defFormTextNumDate
    },
    methods: {
      // 表单item类型英文->中文转换
      switchFormItemType(type) {
        switch (type) {
          case 'udf_char_single_line': return '文本';
          case 'udf_char_list': return '列表';
          case 'udf_long': return '数值';
          case 'udf_date': return '日期';
        }
      },
      // 左侧列表拖拽开始事件，获取当前拖拽的DOM
      dragStart(e) {
        this.currentDragDom = e.target;
      },
      // 拖拽至右侧松开鼠标事件，打开配置弹框
      dropEnd(e) {
        this.editFormItemData = {};     // 将编辑时存留的editFormItemData清空，否则编辑后再添加会判断为编辑状态
        let dragType = this.currentDragDom.getAttribute('data-type');
        if (dragType === 'udf_char_list') {
          this.defListDialog = true;
        } else {
          this.dialogTitle = this.switchFormItemType(dragType);
          this.defTxtNumDateDialog = true;
        }
      },
      // 弹框保存/编辑-文本/数字/日期数据
      addFormTxtNumDate() {
        this.$refs.defFormTxtNumDate.$refs.textNumDateForm.validate(valid => {
          if (valid) {
            if (this.$refs.defFormTxtNumDate.textNumDateForm.itemId) { /* ***编辑*** */
              /* ***同类型重名验证*** */
              let repeatFlag = this.dropLists.find(item => {
                let sameType = item.htmlType === this.$refs.defFormTxtNumDate.textNumDateForm.htmlType;   // 类型相同
                let sameName = item.colnumName === this.$refs.defFormTxtNumDate.textNumDateForm.colnumName;   // 名称相同
                let differentId = item.itemId !== this.$refs.defFormTxtNumDate.textNumDateForm.itemId; // 不同id
                return sameType && sameName && differentId
              });
              if (repeatFlag) {
                this.$message.warning('已存在同名称同类型表单字段！');
                return
              }
              this.dropLists.forEach((item, idx) => {
                // 采用自生成ID匹配
                if (item.itemId === this.$refs.defFormTxtNumDate.textNumDateForm.itemId) {
                  if (item.htmlType === 'udf_long') { // 数值赋值给defaultValue
                    item.defaultValue = this.$refs.defFormTxtNumDate.textNumDateForm.attrValueNum
                  }
                  this.dropLists.splice(idx, 1, this.$refs.defFormTxtNumDate.textNumDateForm);
                }
              });
              this.$message.success('编辑成功！');
            } else { /* ***新增*** */
              /* ***同类型重名验证*** */
              let repeatFlag = this.dropLists.find(item => {
                let sameType = item.htmlType === this.currentDragDom.getAttribute('data-type');   // 类型相同
                let sameName = item.colnumName === this.$refs.defFormTxtNumDate.textNumDateForm.colnumName;   // 名称相同
                let differentId = item.itemId !== this.$refs.defFormTxtNumDate.textNumDateForm.itemId; // 不同id
                return sameType && sameName && differentId
              });
              if (repeatFlag) {
                this.$message.warning('已存在同名称同类型表单字段！');
                return
              }
              let data = {
                ...this.$refs.defFormTxtNumDate.textNumDateForm,
                htmlType: this.currentDragDom.getAttribute('data-type'),
                // type: this.currentDragDom.getAttribute('data-type'),  // form-item类型
                itemId: `${this.currentDragDom.getAttribute('data-type')}-${new Date().getTime()}`,   // 自生成id
                isInherent: 1, // 不是内置数据
                isSelected: 1 // 可以选择
              };
              if (data.htmlType === 'udf_long') { // 数值赋值给defaultValue
                data.defaultValue = this.$refs.defFormTxtNumDate.textNumDateForm.attrValueNum
              }
              this.dropLists.push(data);
              this.$message.success('添加成功！');
            }
            this.defTxtNumDateDialog = false;      // 关闭弹框
          } else {
            return false
          }
        });
      },
      // 弹框保存/编辑-列表数据
      addFormList() {
        this.$refs.defFormList.$refs.listForm.validate(valid => {
          if (valid) {
            if (this.$refs.defFormList.listForm.itemId) { /* ***编辑*** */
              /* ***同类型重名验证*** */
              let repeatFlag = this.dropLists.find(item => {
                let sameType = item.htmlType === this.$refs.defFormList.listForm.htmlType;   // 类型相同
                let sameName = item.colnumName === this.$refs.defFormList.listForm.colnumName;   // 名称相同
                let differentId = item.itemId !== this.$refs.defFormList.listForm.itemId; // 不同id
                return sameType && sameName && differentId
              });
              if (repeatFlag) {
                this.$message.warning('已存在同名称同类型表单字段！');
                return
              }
              this.dropLists.forEach((item, idx) => {
                // 采用自生成ID匹配
                if (item.itemId === this.$refs.defFormList.listForm.itemId) {
                  this.$refs.defFormList.listForm.defaultValue = this.$refs.defFormList.autooption.length > 0 ? this.$refs.defFormList.autooption[0] : null
                  this.dropLists.splice(idx, 1, this.$refs.defFormList.listForm);
                }
              });
              this.$message.success('编辑成功！');
            } else { /* ***新增*** */
              /* ***同类型重名验证*** */
              let repeatFlag = this.dropLists.find(item => {
                let sameType = item.htmlType === this.currentDragDom.getAttribute('data-type');   // 类型相同
                let sameName = item.colnumName === this.$refs.defFormList.listForm.colnumName;    // 名称相同
                let differentId = item.itemId !== this.$refs.defFormList.listForm.itemId;   // 不同id
                return sameType && sameName && differentId
              });
              if (repeatFlag) {
                this.$message.warning('已存在同名称同类型表单字段！');
                return
              }
              let data = {
                ...this.$refs.defFormList.listForm,
                htmlType: 'udf_char_list',     // form-item类型
                itemId: `${this.currentDragDom.getAttribute('data-type')}-${new Date().getTime()}`,   // 自生成id
                isInherent: 1, // 不是内置数据
                isSelected: 1 // 可以选择
              };
              data.defaultValue = this.$refs.defFormList.autooption.length > 0 ? this.$refs.defFormList.autooption[0] : null
              this.dropLists.push(data);
              this.$message.success('添加成功！');
            }
            this.defListDialog = false;    // 关闭弹框
          } else {
            return false
          }
        });
      },
      // 打开编辑生成表单项item的弹框
      editFormItem(formItemData) {
        this.editFormItemData = formItemData;
        if (formItemData.htmlType === 'udf_char_list') {
          // 列表类型
          this.defListDialog = true;
        } else {
          // 文本/数值/date类型
          this.dialogTitle = this.switchFormItemType(formItemData.htmlType)
          this.defTxtNumDateDialog = true;
        }
      },
      // 删除生成表单项item
      deleteFormItem(formItemData) {
        // 过滤掉当前删除项，保留其他项
        this.dropLists = this.dropLists.filter(item => item.itemId !== formItemData.itemId);
      }
    },
    computed: {
      inlayarr() {
        return this.$store.state.serviceRequest.inlayarr
      },
      designeruuid() {
        if (this.$store.state.serviceRequest.editDesigner) {
          return this.$store.state.serviceRequest.editDesigner.uuid
        } else {
          return null;
        }
      }
    },
    // <keep-alive>切换到当前组件触发该钩子
    activated() {
      let state = this.$store.state.serviceRequest;
      // 编辑设计器时，获取编辑回显数据
      if (state.editDesigner) {
        this.dropLists = state.editDesigner.editData.attr.map(item => {
          let baseData = {attributeDesc: '', colnumName: '', htmlType: '', isSyetemAttribute: 0, isInherent: '', isSelected: '', isRequired: '', defaultValue: ''}
          let res = intersectObj(baseData, item);
          res.itemId = item.uuid;
          res.uuid = item.uuid;
          // res.type = item.htmlType;
          if (item.htmlType === 'udf_char_list') {
            res.listvalues = item.listvalues;
          }
          if (item.htmlType === 'udf_long') {
            res.attrValueNum = item.defaultValue;
          }
          return res;
        });
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
#drag-form
  #drag-area
    .drag-item
      font-size 15px
      line-height 36px
      padding-left 15px
      margin-bottom 5px
      cursor move
      .iconfont:first-child
        margin-right 10px
      .icon-arrow-right
        float right
        padding-right 15px
  #drop-area
    min-height 300px
    max-height calc(100vh - 380px)
    padding 0 10px
    .max-drop-area-height
      min-height 320px
      max-height calc(100vh - 380px)
    .tip
      font-size 14px
      text-align center
      line-height 260px
    .drop-item
      line-height 40px
      .attr-tag
        font-size 14px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
      .s-input.is-disabled
        width 80%
      .s-select
        width 80%
        .s-input.is-disabled
          display inline-block
          width 100%
      .iconfont
        cursor pointer
</style>
