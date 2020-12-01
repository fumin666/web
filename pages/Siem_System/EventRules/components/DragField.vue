<template>
  <s-row ref="dragField" class="drag-fieldevent" :gutter="5">
    <s-col ref="itemGroup" class="" :span="5">
      <div v-for="item in items" :class="'drag-item ' + (disabled ? '' : 'drag-item-canHover')"
           :data-type="item.attribute" :data-name="item.name">
        {{item.name}}
        <i class="iconfont icon-arrow-right"></i>
      </div>
    </s-col>
    <s-col class="dragField-field my-title-box" :span="19">
      <div class="dragField-fieldTitle my-title-box-title">条件</div>
      <div ref="field" class="dragField-fieldBody my-title-box-body">
        <s-scrollbar ref="fieldScrollBox" wrap-class="dragField-fieldBody-scroll">
          <s-form style="width: calc(100% - 17px)">
            <s-form-item v-for="(item, index) in data" key="index">
              <s-row :gutter="20">
                <s-col :span="5">
                  <s-select v-if="index !== 0" v-model="item.ruleRelation" :disabled="disabled"
                            @change="handleruleRelationChange(item, ruleRelationList)">
                    <s-option v-for="(item, index) in ruleRelationList" :label="item" :value="index+1"
                              :key="index"></s-option>
                  </s-select>
                  <div v-else>
                    &nbsp;
                  </div>
                </s-col>
                <s-col :span="4">
                  {{item.attributeName}}
                </s-col>
                <!-- 根据类型显示 -->
                <s-col v-if="item.logField === 'logMessage'" :span="6">
                  <s-select v-model="item.ruleType" :disabled="disabled"
                            @change="handleRuleTypeChange(item, ruleTypeList)">
                    <s-option v-for="(item, index) in ruleTypeList" :label="item" :value="index + 1"
                              :key="index"></s-option>
                  </s-select>
                </s-col>
                <s-col  v-if="item.logField !== 'logMessage'" :span="6">
                  <s-select v-model="item.ruleType" :disabled="disabled"
                            @change="handleRuleTypeChange(item, ruleTypeList)">
                    <s-option v-for="(item, index) in ruleTypeListShort" :label="item.name" :value="item.value + 1"
                              :key="index"></s-option>
                  </s-select>
                </s-col>
                <!--根据类型显示-->
                <s-col v-if="item.logField === 'logMessage'"
                       :span="6">
                  <s-tooltip class="item" effect="dark" placement="right">
                    <span slot="content" style="display: inline-block; min-height: 16px">{{item.content}}</span>
                    <s-input v-model="item.content" :disabled="disabled"
                             @change="handleContentChange(item)"></s-input>
                  </s-tooltip>
                </s-col>
                <s-col v-if="item.logField === 'facility'" :span="6">
                  <s-select v-model="item.content" :title="facilityList[item.content]" :disabled="disabled"
                            @change="handleContentChange(item, facilityList)">
                    <s-option v-for="(item, index) in facilityList" :label="item" :value="index + ''"
                              :key="index"></s-option>
                  </s-select>
                </s-col>
                <s-col v-if="item.logField === 'level'" :span="6">
                  <s-select v-model="item.content" :title="levelList[item.content]" :disabled="disabled"
                            @change="handleContentChange(item, levelList)">
                    <s-option v-for="(item, index) in levelList" :label="item" :value="index + ''"
                              :key="index"></s-option>
                  </s-select>
                </s-col>
                <s-col :span="2" v-if="!disabled">
                  <s-button icon="delete" title="删除" @click="removeItem(index)"></s-button>
                </s-col>
              </s-row>
            </s-form-item>
          </s-form>
        </s-scrollbar>
      </div>
    </s-col>
  </s-row>
</template>

<script type="text/babel">
  import {omit, cloneDeep} from 'lodash'
  import SInput from './input/FormInput'
  export default {
    components: {
      SInput
    },
    data() {
      return {
        dragging: false,
        items: [
          {
            name: '日志内容',
            attribute: 'logMessage'
          },
          {
            name: '日志特性',
            attribute: 'facility'
          },
          {
            name: '日志级别',
            attribute: 'level'
          }
        ],
        template(attribute, name) {
          return {
            ruleRelation: 1, // 且或
            ruleRelationName: '且',
            logField: attribute,
            attributeName: name,
            ruleType: 7,
            ruleTypeName: '等于',
            content: '',
            contentName: ''
          }
        },
        // 下拉框
        ruleRelationList: ['且', '或'],
        ruleTypeList: ['开始', '结束', '包含', '不包含', '正则表达式', '通配符', '等于', '不等于'],
        ruleTypeListShort: [
          {name: '等于', value: 6},
          {name: '不等于', value: 7}
        ],
        // 事件级别下拉框
        levelList: ['应急', '警报', '致命', '错误', '警告', '提示', '信息', '诊断', '未知'],
        // 日志类型下拉框
        logTypeList: ['syslog', 'mysql', 'SqlServer', 'oracle', 'tomcat', 'Apache', 'trap'],
        // 日志特性下拉框
        facilityList: [
          'kernel',
          'user-level',
          'mail',
          'system',
          'security/authorization messages (note 1)',
          'messages generated internally by syslogd',
          'line printer subsystem',
          'network news subsystem',
          'UUCP subsystem',
          'clock',
          'security/authorization messages',
          'FTP daemon',
          'NTP subsystem',
          'log audit',
          'log alert',
          'clock daemon',
          'local use 0  (local0)',
          'local use 1  (local1)',
          'local use 2  (local2)',
          'local use 3  (local3)',
          'local use 4  (local4)',
          'local use 5  (local5)',
          'local use 6  (local6)',
          'local use 7  (local7)',
          'unknown'
        ],
        // 数据
        data: [],
        // 记录拖拽出来的输入框类型
        image: null,
        field: null
      }
    },
    created() {
      let data = cloneDeep(this.value).map((item) => {
        item.ruleRelationName = this.ruleRelationList[item.ruleRelation - 1]
        item.ruleTypeName = this.ruleTypeList[item.ruleType - 1]
        if (item.logField === 'logMessage') {
          item.attributeName = '日志内容'
          item.contentName = item.content
        } else if (item.logField === 'facility') {
          item.attributeName = '日志特性'
          item.contentName = this.facilityList[item.content]
        } else if (item.logField === 'level') {
          item.attributeName = '日志级别'
          item.contentName = this.levelList[item.content]
        }
        return item
      })
      this.data = data
    },
    mounted() {
      if (!this.disabled) {
        let self = this
        let itemGroup = self.$refs.itemGroup.$el
        this.field = self.$refs.field
        itemGroup.addEventListener('mousedown', function (e) {
          self.selectAble(false)
          // 创建镜像
          if (e.target.className.indexOf('drag-item') !== -1) {
            self.dragging = true
            e.stopPropagation()
            self.image = e.target.cloneNode(true)
            self.image.className = 'drag-item-iamge'
            self.image.style.position = 'fixed'
            self.image.style.zIndex = 99999
            self.image.style.width = e.target.offsetWidth + 'px'
            self.image.style.height = e.target.offsetHeight + 'px'
            self.image.style.left = e.clientX + 2 + 'px'
            self.image.style.top = e.clientY + 2 + 'px'
            document.body.appendChild(self.image)
            self.field.className = self.field.className + ' dragField-fieldBody-hover'
          }
        })
        document.addEventListener('mousemove', self.handleMouseMove)
        this.field.addEventListener('mouseup', function (e) {
          if (self.dragging) {
            self.dragging = false
            // self.image
            self.data.push(self.template(self.image.getAttribute('data-type'), self.image.getAttribute('data-name')))
            // 定位滚动条到最底部
            self.$nextTick(function () {
              self.$refs.fieldScrollBox.$el.querySelector('.dragField-fieldBody-scroll').scrollTop = 99999
            })
            self.selectAble(true)
          }
        })
        document.addEventListener('mouseup', self.handleMouseUp)
      }
    },
    beforeDestroy() {
      this.selectAble(true)
    },
    watch: {
      data: {
        deep: true,
        handler(val) {
          this.$emit('clearData')
          if (val.length < 9) {
            let logData = val.filter(item => {
              return (item.attributeName === '日志内容')
            })
            if (logData.length < 5) {
              let data = val.map(function (item) {
                return omit(item, ['ruleRelationName', 'attributeName', 'ruleTypeName', 'contentName'])
              })
              this.$emit('input', data)
            } else {
              /* let unlogData = val.filter(item => {
                return (item.attributeName !== '日志内容')
              })
              logData.splice(4, logData.length)
              val = [...logData, ...unlogData]
              console.log(val) */
              val.splice(val.length - 1, val.length)
              this.$message.error('日志内容最多可添加4条!')
            }
          } else {
             val.splice(8, val.length)
            this.$message.error('最多可添加8条!')
          }
        }
      }
    },
    methods: {
      selectAble(flag = false) {
        document.body.onselectstart = function () {
          return flag
        }
      },
      handleMouseMove(e) {
        if (this.dragging) {
          this.image.style.left = e.clientX + 2 + 'px'
          this.image.style.top = e.clientY + 2 + 'px'
        }
      },
      handleMouseUp(e) {
        this.dragging = false
        if (this.image !== null) {
          document.body.removeChild(this.image)
          this.$nextTick(() => {
            this.image = null
          })
          this.field.className = this.field.className.replace('dragField-fieldBody-hover', '').trim()
          this.selectAble(true)
        }
      },
      removeItem(index) {
        this.data.splice(index, 1)
      },
      handleContentChange(item, relation) {
        if (!relation) {
          item.contentName = item.content
        } else {
          item.contentName = relation[item.content]
        }
      },
      handleruleRelationChange(item, relation) {
        item.ruleRelationName = relation[Number.parseInt(item.ruleRelation) - 1]
      },
      handleRuleTypeChange(item, relation) {
        item.ruleTypeName = relation[Number.parseInt(item.ruleType) - 1]
      },
      validate() {
        for (let i in this.data) {
          for (let key in this.data[i]) {
            if (this.data[i][key] === '' || this.data[i][key] === undefined) {
              return false
            }
          }
        }
        return true
      }
    },
    props: {
      value: {
        type: Array,
        default: function () {
          return []
        }
      },
      disabled: false
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
 /* .drag-fieldevent
    width: calc(100% - 17px)
    .drag-item
      display: flex
      justify-content: space-between
      height: 40px
      line-height: 40px
      background: rgb(4, 41, 72)
      padding: 0 10px
      margin-top: 5px
      color: rgb(52, 195, 242)
      cursor: move
      &.drag-item-canHover:hover
        border: dashed 1px rgb(12, 155, 202)
        height: 38px
        line-height: 38px
    .dragField-field
      margin-top: 5px
      .dragField-fieldBody
        box-sizing: border-box
        height: 130px
        padding: 20px
        border: 1px solid rgb(10, 47, 89)
        overflow: hidden
        &.dragField-fieldBody-hover
          border: 1px dashed rgb(52, 195, 242)
        .s-form .s-form-item
          margin-top: 5px
          margin-bottom: 5px
    .dragField-fieldBody-scroll
      max-height: 110px

  .drag-item-iamge
    display: flex
    justify-content: space-between
    height: 40px
    line-height: 40px
    border: dashed 1px rgb(52, 195, 242)
    background: rgb(4, 41, 72)
    padding: 0 10px
    color: rgb(52, 195, 242)
    cursor: move
  .my-title-box-title {
    position: absolute;
    left: 140px;
    top: 4px;
    transform: translate(0, -50%);
    height: 25px;
    padding: 0 10px;
    text-align: center;
    line-height: 25px;
    background-color: #000a17;
    font-size: 16px;
    font-weight: 600;
    color: rgb(0, 112, 178);
  } */
</style>
