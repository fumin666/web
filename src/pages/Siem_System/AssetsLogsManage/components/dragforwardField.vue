<template>
  <s-row ref="dragField" class="drag-field" :gutter="20" style="width: 1000px">
    <s-col ref="itemGroup" class="drag-field-itemFields" :span="3">
      <div
        v-for="(item,index) in items"
        :class="'drag-item ' + (disabled ? '' : 'drag-item-canHover')"
        :data-type="item.attribute"
        :data-name="item.name"
        :key="index"
      >
        {{item.name}}
        <i class="iconfont icon-arrow-right"></i>
      </div>
    </s-col>
    <s-col class="dragField-field my-title-box" :span="20">
      <div class="dragField-fieldTitle my-title-box-title">规则</div>
      <div ref="field" class="dragField-fieldBody my-title-box-body">
        <s-scrollbar ref="fieldScrollBox" wrap-class="dragField-fieldBody-scroll">
          <s-form style="width: calc(100% - 17px)">
            <s-form-item v-for="(item, index) in data" :key="index">
              <s-row>
                <s-col :span="4">
                  <s-select
                    v-if="index !== 0"
                    v-model="item.ruleRelation"
                    :disabled="disabled"
                    style="width: 100px"
                    @change="handleruleRelationChange(item, ruleRelationList)"
                  >
                    <s-option
                      v-for="(item, index) in ruleRelationList"
                      :label="item"
                      :value="index+1"
                      :key="index"
                    ></s-option>
                  </s-select>
                  <div v-else>&nbsp;</div>
                </s-col>
                <s-col :span="4">{{item.attributeName}}</s-col>
                <s-col v-if="item.logField === 'logMessage'" :span="4">
                  <s-select
                    v-model="item.ruleType"
                    :disabled="disabled"
                    @change="handleRuleTypeChange(item, ruleTypeList)"
                    style="width: 120px"
                  >
                    <s-option
                      v-for="(item, index) in ruleTypeListNot"
                      :label="item.name"
                      :value="item.value"
                      :key="index"
                    ></s-option>
                  </s-select>
                </s-col>
                <s-col v-else :span="4">
                  <s-select
                    v-model="item.ruleType"
                    :disabled="disabled"
                    @change="handleRuleTypeChange(item, ruleTypeList)"
                    style="width: 120px"
                  >
                    <s-option
                      v-for="(item, index) in ruleTypeListShort"
                      :label="item.name"
                      :value="item.value"
                      :key="index"
                    ></s-option>
                  </s-select>
                </s-col>
                <!--根据类型显示-->
                <s-col v-if="item.logField === 'logMessage'" :span="10">
                  <s-tooltip class="item" effect="dark" :content="item.content" placement="right">
                    <s-input
                      v-model="item.content"
                      :disabled="disabled"
                      @change="handleContentChange(item)"
                    ></s-input>
                  </s-tooltip>
                </s-col>
                <s-col v-if="item.logField === 'facility'" :span="10">
                  <s-select
                    v-model="item.content"
                    :disabled="disabled"
                    @change="handleContentChange(item, facilityList)"
                  >
                    <s-option
                      v-for="(item, index) in facilityList"
                      :label="item"
                      :value="index + ''"
                      :key="index"
                    ></s-option>
                  </s-select>
                </s-col>
                <s-col v-if="item.logField === 'level'" :span="10">
                  <s-select
                    v-model="item.content"
                    :disabled="disabled"
                    @change="handleContentChange(item, levelList)"
                  >
                    <s-option
                      v-for="(item, index) in levelList"
                      :label="item"
                      :value="index + ''"
                      :key="index"
                    ></s-option>
                  </s-select>
                </s-col>
                <s-col :span="2" v-if="!disabled">
                  <i class="iconfont icon-delete" @click="removeItem(index)"></i>
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
import $axios from 'sunflower-ajax';
import { omit, cloneDeep } from 'lodash';
export default {
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
        };
      },
      // 下拉框
      ruleRelationList: ['且', '或'],
      ruleTypeList: [
        '开始',
        '结束',
        '包含',
        '不包含',
        '正则表达式',
        '通配符',
        '等于',
        '不等于'
      ],
      ruleTypeListShort: [
        { name: '等于', value: 7 },
        { name: '不等于', value: 8 }
      ],
      ruleTypeListNot: [
        { name: '开始', value: 1 },
        { name: '结束', value: 2 },
        { name: '包含', value: 3 },
        { name: '不包含', value: 4 },
        { name: '正则表达式', value: 5 },
        { name: '通配符', value: 6 },
        { name: '等于', value: 7 },
        { name: '不等于', value: 8 }
      ],
      // 事件级别下拉框
      levelList: [
        '应急',
        '警报',
        '致命',
        '错误',
        '警告',
        '提示',
        '信息',
        '诊断',
        '未知'
      ],
      // 日志类型下拉框
      logTypeList: [
        'syslog',
        'mysql',
        'SqlServer',
        'oracle',
        'tomcat',
        'Apache',
        'trap'
      ],
      // 日志特性下拉框
      facilityList: [],
      // 数据
      data: [],
      // 记录拖拽出来的输入框类型
      image: null,
      field: null
    };
  },
  created() {
    this.getData().then(ss => {
      $axios.get('/syslogAuditSetting/getRuleConditionData').then(res => {
        let facilityList = [];
        res.data.logFacilities.map(item => {
          facilityList[item.value] = item.name;
        });
        this.facilityList = facilityList;
        this.data = cloneDeep(this.value).map(item => {
          item.ruleRelationName = this.ruleRelationList[item.ruleRelation - 1];
          item.ruleTypeName = this.ruleTypeList[item.ruleType - 1];
          if (item.logField === 'logMessage') {
            item.attributeName = '日志内容';
            item.contentName = item.content;
          } else if (item.logField === 'facility') {
            item.attributeName = '日志特性';
            item.contentName = this.facilityList[item.content];
          } else if (item.logField === 'level') {
            item.attributeName = '日志级别';
            item.contentName = this.levelList[item.content];
          }
          return item;
        });
      });
    });
  },
  mounted() {
    if (!this.disabled) {
      let self = this;
      let itemGroup = self.$refs.itemGroup.$el;
      this.field = self.$refs.field;
      itemGroup.addEventListener('mousedown', function(e) {
        self.selectAble(false);
        // 创建镜像
        if (e.target.className.indexOf('drag-item') !== -1) {
          self.dragging = true;
          e.stopPropagation();
          self.image = e.target.cloneNode(true);
          self.image.className = 'drag-item-image';
          self.image.style.position = 'fixed';
          self.image.style.zIndex = 99999;
          self.image.style.width = e.target.offsetWidth + 'px';
          self.image.style.height = e.target.offsetHeight + 'px';
          self.image.style.left = e.clientX + 2 + 'px';
          self.image.style.top = e.clientY + 2 + 'px';
          document.body.appendChild(self.image);
          self.field.className =
            self.field.className + ' dragField-fieldBody-hover';
        }
      });
      document.addEventListener('mousemove', self.handleMouseMove);
      this.field.addEventListener('mouseup', function(e) {
        if (self.dragging) {
          self.dragging = false;
          // self.image
          self.data.push(
            self.template(
              self.image.getAttribute('data-type'),
              self.image.getAttribute('data-name')
            )
          );
          // 定位滚动条到最底部
          self.$nextTick(function() {
            self.$refs.fieldScrollBox.$el.querySelector(
              '.dragField-fieldBody-scroll'
            ).scrollTop = 99999;
          });
          self.selectAble(true);
        }
      });
      document.addEventListener('mouseup', self.handleMouseUp);
    }
  },
  beforeDestroy() {
    this.selectAble(true);
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        if (val !== undefined) {
          let data = val.map(function(item) {
            return omit(item, [
              'ruleRelationName',
              'ruleTypeName',
              'contentName'
            ]);
          });
          this.$emit('input', data);
        }
      }
    }
  },
  methods: {
    getData() {
      return new Promise((resolve, reject) => {
        $axios
          .get('/syslogAuditSetting/getRuleConditionData')
          .then(res => {
            this.data = res.data.logForwardRuleList;
            resolve(res.data);
          })
          .catch(function(error) {
            reject(error);
          });
      });
      // $axios.get('/syslogAuditSetting/getRuleConditionData').then((res) => {
      //   console.log(this.data);
      //   this.data = res.data.logForwardRuleList
      // })
    },
    clear() {
      this.data = [];
    },
    selectAble(flag = false) {
      document.body.onselectstart = function() {
        return flag;
      };
    },
    handleMouseMove(e) {
      if (this.dragging) {
        this.image.style.left = e.clientX + 2 + 'px';
        this.image.style.top = e.clientY + 2 + 'px';
      }
    },
    handleMouseUp(e) {
      this.dragging = false;
      if (this.image !== null) {
        document.body.removeChild(this.image);
        this.$nextTick(() => {
          this.image = null;
        });
        this.field.className = this.field.className
          .replace('dragField-fieldBody-hover', '')
          .trim();
        this.selectAble(true);
      }
    },
    removeItem(index) {
      this.data.splice(index, 1);
    },
    handleContentChange(item, relation) {
      if (!relation) {
        item.contentName = item.content;
      } else {
        item.contentName = relation[item.content];
      }
    },
    handleruleRelationChange(item, relation) {
      item.ruleRelationName = relation[Number.parseInt(item.ruleRelation) - 1];
    },
    handleRuleTypeChange(item, relation) {
      item.ruleTypeName = relation[Number.parseInt(item.ruleType) - 1];
    },
    validate() {
      console.log(this.data);
      for (let i in this.data) {
        for (let key in this.data[i]) {
          if (this.data[i][key] === '' || this.data[i][key] === undefined) {
            return false;
          }
        }
      }
      return true;
    }
  },
  props: {
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    disabled: false
  }
};
</script>
