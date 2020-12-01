/**
* Created by dgunzi on 2018/8/16.
 */

<template>
  <s-form label-width="55px" ref="attrForm" :model="attrForm" :rules="attrRules">
    <s-form-item label="名称" prop="name">
      <s-input v-model="attrForm.name" v-if="readonlyFlag" readonly>
        <s-button slot="suffix" icon="association" size="mini" title="关联" @click.stop="linkAsset" v-if="showLink"></s-button>
      </s-input>
      <s-input v-model="attrForm.name" v-if="!readonlyFlag">
        <s-button slot="suffix" icon="association" size="mini" title="关联" @click.stop="linkAsset" v-if="showLink"></s-button>
      </s-input>
    </s-form-item>
    <s-form-item label="长度" prop="depth">
      <s-input-number v-model="attrForm.depth" :step="0.1" :min="0.1" :max="10000" style="width: 120px"></s-input-number> cm
    </s-form-item>
    <s-form-item label="宽度" prop="width">
      <s-input-number v-model="attrForm.width" :step="0.1" :min="0.1" :max="10000" style="width: 120px"></s-input-number> cm
    </s-form-item>
    <s-form-item label="高度" prop="height">
      <s-input-number v-model="attrForm.height" :step="0.1" :min="0.1" :max="10000" style="width: 120px"></s-input-number> cm
    </s-form-item>
    <s-form-item>
      <s-checkbox label="固定位置" v-model="attrForm.fixed"></s-checkbox>
    </s-form-item>
    <s-row>
      <s-col span="12">
        <s-button icon="correct" @click="changeValue" title="应用设置">应用设置</s-button>
      </s-col>
      <s-col span="12">
        <s-button icon="delete" @click="deleteItem" title="删除物品">删除物品</s-button>
      </s-col>
    </s-row>

  </s-form>
</template>
<script type="text/babel">
  import {Validaters} from 'sunflower-common-utils'

  export default {
    data () {
      return {
        attrForm: {
          depth: 0,
          width: 0,
          height: 0,
          name: '',
          fixed: false
        },
        attrRules: {
          name: [
            Validaters.NotNull,
            {max: 20, message: '最大长度为20', trigger: 'blur'}
          ],
          depth: [
            Validaters.NotNull
          ],
          width: [
            Validaters.NotNull
          ],
          height: [
            Validaters.NotNull
          ]
        },
        showLink: false,
        readonlyFlag: false
      }
    },
    methods: {
      deleteItem() { // 删除操作
        window.oasis3d.model.scene.removeItem(this.selectedItem);
        window.oasis3d.three.needsUpdate();
      },
      changeValue() {
        this.$refs.attrForm.validate((valid) => {
          if (valid) {
            this.selectedItem.resize(
              this.attrForm.height,
              this.attrForm.width,
              this.attrForm.depth
            );
            this.selectedItem.metadata.name = this.attrForm.name;
            this.selectedItem.setFixed(this.attrForm.fixed);
            window.oasis3d.three.getController().setSelectedObject(null);
          }
        });
      },
      cmToIn(cm) { // 厘米转换为英寸
        return cm / 2.54;
      },
      inToCm(inches) { // 英寸转换为厘米
        return inches * 2.54;
      },
      linkAsset() {
        this.$emit('cabinetLinkAsset');
      },
      // 更新值
      updateVal() {
        this.attrForm.depth = this.selectedItem.getDepth().toFixed(1);
        this.attrForm.height = this.selectedItem.getHeight().toFixed(1);
        this.attrForm.width = this.selectedItem.getWidth().toFixed(1);
        this.attrForm.name = this.selectedItem.metadata.name;
        this.attrForm.fixed = this.selectedItem.fixed === true || this.selectedItem.fixed === 1;
      }
    },
    props: {
      selectedItem: {
        required: true
      }
    },
    watch: {
      selectedItem(val, oldVal) {
        if (val !== null) {
          console.log(val);
          this.attrForm.depth = val.getDepth().toFixed(1);
          this.attrForm.height = val.getHeight().toFixed(1);
          this.attrForm.width = val.getWidth().toFixed(1);
          this.attrForm.name = val.metadata.name;
          this.attrForm.fixed = val.fixed === true || val.fixed === 1;
          // 此处仅仅为机柜增加关联
          if (val.metadata.ctype === 'emptyCabinet') {
            this.showLink = true;
          } else {
            this.showLink = false;
          }
          if (val.uuid.indexOf('-') === -1) {
            this.readonlyFlag = true;
          } else {
            this.readonlyFlag = false;
          }
        }
      }
    }
  }
</script>
