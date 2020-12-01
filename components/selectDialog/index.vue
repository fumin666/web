/*
create by YOU
*/
<template>
  <span>
    <s-select
      ref="select"
      v-model="data"
      :multiple="multiple"
      :clearable="clearable"
      :disabled="disabled"
      :style="styles"
      @visible-change="onVisibleChange"
      @click.native="handleClick"
      @remove-tag="onRemoveTag"
      @change="onChange"
      placeholder="请选择">
      <slot></slot>
    </s-select>
  </span>
</template>

<script type="text/babel">
  import Vue from 'vue'
  import Dialog from './Dialog.vue'
  export default {
    data () {
      return {
        dialog: null,
        data: ''
      }
    },
    created () {
    },
    mounted () {
      let _self = this
      // 创建dialog
      let dialogConstructor = Vue.extend(Dialog)
      _self.dialog = new dialogConstructor({
        data: {
          value: false,
          options: _self.options,
          config: _self.config,
          multiple: _self.multiple,
          valueProp: _self.valueProp,
          title: _self.title,
          selected: [],
          selectable: function () {
            return true
          },
          searchColumns: this.config.map(item => item.value)
        }
      })
      _self.dialog.vm = _self.dialog.$mount()
      // 挂载
      document.body.appendChild(_self.dialog.vm.$el)
      // 监听数据
      this.dialog.$on('submit', function (data) {
        _self.data = data
        _self.$emit('input', data)
      })
      // 此为新加，如果有readyData则首先展示readyData  10.16  shifeng
      if (!this.readyData) {
        return
      } else {
        this.data = this.readyData
      }
    },
    watch: {
      value (val) {
        this.data = val
      },
      options (val) {
        this.dialog.options = val
        this.data = this.value
      },
      selectable (val) {
        this.dialog.selectable = val
      }
    },
    methods: {
      handleClick (e) {
        if (!this.disabled) {
          this.dialog.value = true
          this.dialog.changeSelected(this.data)
        }
      },
      onVisibleChange () {
        this.$refs.select.visible = false
      },
      onRemoveTag (val) {
        this.$emit('remove-tag', val)
      },
      onChange (val) {
        this.$emit('change', val)
      }
    },
    props: {
      readyData: {
        type: String,
        default: ''
      },
      multiple: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      options: {
        type: Array,
        default: function () {
          return []
        },
        required: true
      },
      config: {
        type: Array,
        default: function () {
          return []
        },
        required: true
      },
      value: {
        type: [String, Array],
        default: '',
        required: true
      },
      dialogWidth: {
        type: String,
        default: '500px'
      },
      valueProp: {
        type: String,
        default: 'uuid'
      },
      title: {
        type: String,
        default: ''
      },
      styles: {
        type: String,
        default: ''
      },
      selectable: {
        type: Function,
        default: function () {
          return true
        }
      }
    }
  };
</script>
