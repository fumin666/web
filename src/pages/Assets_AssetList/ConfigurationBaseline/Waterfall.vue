/*
create by YOU
*/
<script type="text/babel">
  export default {
    data() {
      return {
        span: 6,
        labelWidth: '120px'
      }
    },
    props: {
      editable: {
        type: Boolean,
        default: false
      },
      cols: {
        type: Number,
        default: 4
      },
      data: {
        type: Object
      }
    },
    created() {
    },
    mounted() {
      this.$nextTick(() => {
        this.resetWaterfall()
      })
    },
    watch: {
      editable(val) {
        this.$nextTick(() => {
          this.resetWaterfall()
        })
      },
      data() {
        this.$nextTick(() => {
          this.resetWaterfall()
        })
      }
    },
    methods: {
      resetWaterfall() {
        let bases = [...this.$refs.waterfall.querySelectorAll('.waterfall-panel')]
        bases.forEach(base => {
          if (!base.classList.contains('mutiply-line')) {
            if (this.editable) {
              base.style.height = 55 + 'px'
            } else {
              base.style.height = 40 + 'px'
            }
          }
        })
      },
      getParent(el, name) {
        let parent = el.parentNode
        while (parent.className.indexOf(name || 'waterfall-item') === -1) {
          parent = parent.parentNode
          if (parent === document.body) {
            return parent
          }
        }
        return parent
      },
      getfirstFormItem(component, tag) {
        let isArray = Array.isArray(tag)
        let co = component
        while (co && co.componentOptions) {
          let options = co.componentOptions
          if ((isArray && (tag.indexOf(options.tag) !== -1)) || (options.tag === (tag || 's-form-item'))) {
            return co
          }
          if (options.children) {
            co = options.children[0]
          } else {
            return null
          }
        }
        return null
      },
      getSelectlabel(selectItem) {
        let value = selectItem.componentOptions.propsData.value
        let options = selectItem.componentOptions.children.filter(item => item.tag)
        for (let option of options) {
          let props = option.componentOptions.propsData
          if (props.value === value) {
            return props.label || props.value
          }
        }
      },
      getShowValue(component) {
        if (!component || !component.tag) {
          return ''
        }
        let returnValue = ''
        let value = component.componentOptions.propsData.value
        switch (component.componentOptions.tag) {
          case 's-select': {
            let options = component.componentOptions.children.filter(item => item.tag)
            for (let option of options) {
              let props = option.componentOptions.propsData
              if (props.value === value) {
                returnValue = props.label || props.value
                break;
              }
            }
          }
            break;
          case 's-date-picker':
            returnValue = value;
            break;
          case 's-radio-group': {
            let options = component.componentOptions.children.filter(item => item.tag)
            for (let option of options) {
              let props = option.componentOptions.propsData
              if (props.label === value) {
                returnValue = props.label === 2 ? '很高' : props.label === 3 ? '高' : props.label === 4 ? '中等' : props.label === 5 ? '低' : props.label === 6 ? '很低' : props.label === 0 ? '否' : '是'
                break;
              }
            }
          }
            break;
          case 's-cascader': {
            let options = component.componentOptions.propsData.options
            returnValue = ''
            if (!value) {
              return ''
            }
            if (!options || options.length === 0) {
              returnValue = value
            } else {
              for (let i = 0; i < value.length; i++) {
                if (options) {
                  if (i !== 0) {
                    returnValue += '/'
                  }
                  let index = options.map(item => item.value).indexOf(value[i])
                  returnValue += options[index].label
                  options = options[index].children
                }
              }
            }
          }
            break;
          default:
            returnValue = value;
        }
        return returnValue
      },
      parseDate(val) {
        let date = new Date(val)
        return date.toLocaleString()
      }
    },
    render(h) {
      this.labelWidth = this.$parent.labelWidth
      const editable = this.$props.editable
      const children = this.$slots.default ? this.$slots.default.filter(child => child.tag) : []
      return (<div>
        <div class="waterfall" ref="waterfall">
          {children.map(child => {
            // let cols = this.cols
            let item = this.getfirstFormItem(child)
            if (!item) {
              return null
            }
            let inputComponent = this.getfirstFormItem(item, [
              's-input', 's-select', 's-date-picker', 's-cascader', 's-radio-group'
            ])
            if (!inputComponent) {
              return null
            }
            let itemClass = 'waterfall-item'
            // if ([2, 3, 4].indexOf(cols) !== -1) {
            //   itemClass += ' waterfall-item-' + cols
            // }
            inputComponent.data.staticClass = 'waterfall-item-base'
            let label = child.componentOptions.propsData.label
            let value = this.getShowValue(inputComponent)
            let waterfallItemBaseClass = 'waterfall-item-base'
            let textarea = false
            if (inputComponent.componentOptions.propsData.type === 'textarea') {
              waterfallItemBaseClass += ' mutiply-line'
              itemClass += ' waterfall-tall-panel';
              textarea = true
            } else {
              itemClass += ' waterfall-panel';
            }
            if (editable) {
              return (<span class={itemClass}>{child}</span>)
            } else {
              if (textarea) {
                return (<s-form-item label={label} class={itemClass}><span class={waterfallItemBaseClass}
                                                                           style="display: inline-block">
                          <s-scrollbar wrap-style="max-height: 130px;">
                            <span
                              style="display: inline-block; box-sizing: border-box; width: 100%; padding: 0 5px; word-break: break-all; line-height: 30px;">{value}</span>
                           </s-scrollbar>
                        </span></s-form-item>)
              } else {
                return (<s-form-item label={label} class={itemClass}><span class={waterfallItemBaseClass}
                                                                           style="display: inline-block; box-sizing: border-box; width: 100%;">
                            <span title={value}
                                  style="display: inline-block; box-sizing: border-box; width: 100%; padding: 0 5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{value}</span>
                        </span></s-form-item>)
              }
            }
          })}
        </div>
      </div>)
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .waterfall-item
    .s-form-item-content
      padding-right 5px
</style>
