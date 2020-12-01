/*
create by YOU
*/
<template>
  <div class="businessDefineRule">
    <s-form :model="formData" ref="ruleForm" label-width="100px">
      <s-form-item label="级别">
        <s-select :disabled="!editAble" v-model="formData.businessServicesRuleUuid" placeholder="请选择级别">
          <s-option v-for="item in levels" :label="item.levelName" :value="item.uuid" :key="item.uuid"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="规则">
        <s-button @click="ruleTable = !ruleTable">添加</s-button>
      </s-form-item>
    </s-form>
    <s-table v-show="ruleTable" :data="formData.detailList">
      <s-table-column
        label="逻辑符">
        <template slot-scope="scope">
          <s-select :disabled="!editAble" v-if="scope.$index !== 0" v-model="formData.detailList[scope.$index].andOr"
                    placeholder="请选择逻辑符">
            <s-option label="且" :value="1"></s-option>
            <s-option label="或" :value="2"></s-option>
          </s-select>
        </template>
      </s-table-column>
      <s-table-column
        label="名称">
        <template slot-scope="scope">
          <s-select :disabled="!editAble" v-model="formData.detailList[scope.$index].businessServicesItcompUuid"
                    placeholder="请选择名称">
            <s-option v-for="item in itcomps" :label="item.resource.itcompName" :value="item.uuid"
                      :key="item.uuid"></s-option>
          </s-select>
        </template>
      </s-table-column>
      <s-table-column
        label="运算符">
        <template slot-scope="scope">
          <s-select :disabled="!editAble" v-model="formData.detailList[scope.$index].compare" placeholder="请选择运算符">
            <s-option label="==" value="="></s-option>
            <s-option label="!=" value="!="></s-option>
            <s-option label="<=" value="<="></s-option>
            <s-option label="<" value="<"></s-option>
            <s-option label=">=" value=">="></s-option>
            <s-option label=">" value=">"></s-option>
          </s-select>
        </template>
      </s-table-column>
      <s-table-column
        label="级别">
        <template slot-scope="scope">
          <s-select :disabled="!editAble" v-model="formData.detailList[scope.$index].incidentLevle" placeholder="请选择级别">
            <s-option v-for="item in incendentLevel" :label="item.configName" :value="Number.parseInt(item.configValue)"
                      :key="item.configValue"></s-option>
          </s-select>
        </template>
      </s-table-column>
      <s-table-column
        v-if="editAble"
        label="操作">
        <template slot-scope="scope">
          <i v-if="scope.$index === 0" class="iconfont icon-plus" @click="addColumn"></i>
          <i v-else @click="delColumn(scope.row)" class="iconfont icon-delete"></i>
        </template>
      </s-table-column>
    </s-table>
  </div>
</template>

<script type="text/babel">
  export default {
    data () {
      return {
        formData: {
          uuid: '',
          businessServicesRuleUuid: '',
          detailList: []
        },
        Template: {},
        itcomps: [],
        incendentLevel: [],
        ruleTable: false
      }
    },
    watch: {
      'formData.businessServicesRuleUuid': function (val) {
        this.formData.detailList.map((item) => {
          item.businessServicesRuleUuid = val
        })
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        let _self = this
        let form = _self.formData
        let data = _self.data
        form.businessServicesRuleUuid = _self.levels[0].uuid
        form.uuid = _self.levels[0].businessServicesUuid
        _self.itcomps = data.resourceList
        _self.incendentLevel = data.incendentLevle
        // 模板
        _self.Template = function (index) {
          let data = {
            businessServicesItcompUuid: _self.itcomps[0] ? _self.itcomps[0].uuid : '',
            compare: '=',
            incidentLevle: _self.incendentLevel[0] ? Number.parseInt(_self.incendentLevel[0].configValue) : '',
            num: index || 0,
            businessServicesRuleUuid: form.businessServicesRuleUuid
          }
          if (index !== false) {
            data.andOr = 1
          }
          return data
        }
        _self.formData.detailList.push(new _self.Template(false))
        // 默认数据
        if (_self.data.rulelist && _self.uuid !== '') {
          _self.ruleTable = true
          _self.data.rulelist.map(function (item) {
            if (item.uuid === _self.uuid) {
              _self.formData.detailList = item.detailList
            }
          })
        }
      },
      addColumn () {
        this.formData.detailList.push(new this.Template(this.formData.detailList.length))
      },
      delColumn (row) {
        let list = this.formData.detailList
        list.splice(list.indexOf(row), 1)
      }
    },
    props: {
      editAble: {
        type: Boolean,
        default: true
      },
      uuid: {
        type: String,
        default: ''
      },
      levels: {
        type: Array,
        default: function () {
          return []
        }
      },
      data: {
        type: Object,
        default: function () {
          return {}
        }
      },
      defaultData: {
        type: Object,
        default: function () {
          return {}
        }
      }
    }
  };
</script>
