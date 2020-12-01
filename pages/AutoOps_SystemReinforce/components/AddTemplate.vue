/**
* Created by alex on 2018/8/21.
*/
<template>
  <div>
    <s-collapse v-if="!editData" v-model="activeNames" accordion>
      <s-collapse-item title="基础设定" name="base">
        <s-form :model="form" ref="AddForm" :rules="formRules" label-width="120px" class="accountAddForm">
          <!--<s-form-item label="加固项名称" prop="name">-->
          <!--<s-input v-model="form.name"></s-input>-->
          <!--</s-form-item>-->
          <s-form-item label="模版名称" prop="templateUuid">
            <s-select :disabled="edit" v-model="form.templateUuid" clearable @change="getTemplateName">
              <s-option v-for="(item, index) in systemFastenTemplates" :value="item.uuid" :label="item.name"
                        :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="加固项类型" prop="itemTypeUuid">
            <s-select v-model="form.itemTypeUuid" clearable @change="getItemTypeName">
              <s-option v-for="(item, index) in itemType" :value="item.uuid" :label="item.name"
                        :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="状态">
            <s-radio-group v-model="form.isOpen">
              <s-radio :label="1">启用</s-radio>
              <s-radio :label="0">禁用</s-radio>
            </s-radio-group>
          </s-form-item>
        </s-form>
      </s-collapse-item>
      <s-collapse-item title="选择脚本" name="selectScript">
        <s-form :model="form" ref="AddForm1" :rules="formRules" label-width="70px" class="accountAddForm">
          <s-form-item label="脚本库" prop="scriptLibUuid">
            <input-tree :disabled="edit" v-model="form.scriptLibUuid" :data="allScriptLib" :props="myProps" @select-change="changeSriptHandler" style="width: 150px;" name="uuid"></input-tree>
          </s-form-item>
          <s-table-page
            :data="scriptList"
            :show-header-checkbox="true"
            @selection-change="handleSelectionChange"
            :header-search="getSearchDef()">
            <s-table-column type="selection" width="65"></s-table-column>
            <s-table-column prop="scriptName" label="脚本名称"></s-table-column>
            <s-table-column prop="createUserName" label="创建人"></s-table-column>
            <s-table-column prop="createTime" label="创建时间"></s-table-column>
            <s-table-column prop="description" label="备注"></s-table-column>
          </s-table-page>
        </s-form>
      </s-collapse-item>
    </s-collapse>
    <s-form :model="form" ref="AddForm" :rules="formRules" v-else label-width="120px" class="accountAddForm">
      <!--<s-form-item label="加固项名称" prop="name">-->
      <!--<s-input v-model="form.name"></s-input>-->
      <!--</s-form-item>-->
      <s-form-item label="模版名称" prop="templateUuid">
        <s-select :disabled="edit" v-model="form.templateUuid" clearable @change="getTemplateName">
          <s-option v-for="(item, index) in systemFastenTemplates" :value="item.uuid" :label="item.name"
                    :key="index"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="加固项类型" prop="itemTypeUuid">
        <s-select v-model="form.itemTypeUuid" clearable @change="getItemTypeName">
          <s-option v-for="(item, index) in itemType" :value="item.uuid" :label="item.name"
                    :key="index"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="状态">
        <s-radio-group v-model="form.isOpen">
          <s-radio :label="1">启用</s-radio>
          <s-radio :label="0">禁用</s-radio>
        </s-radio-group>
      </s-form-item>
      <s-form-item label="备注" prop="description">
        <s-input type="textarea" v-model="form.description"></s-input>
      </s-form-item>
    </s-form>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import { intersectObj, Validaters } from 'sunflower-common-utils'
  import InputTree from '@/components/inputTree/InputTree'
  export default {
    data() {
      return {
        edit: false,
        activeNames: 'base',
        form: {
          name: '',
          itemTypeUuid: '',
          templateUuid: '',
          scriptUuid: '',
          scriptLibUuid: '',
          description: '',
          isOpen: 1,
          scriptPath: '',
          templateName: '',
          itemTypeName: '',
          uuid: ''
        },
        ajaxData: [],
        systemFastenTemplates: [],
        allScriptLib: [],
        itemType: [],
        myProps: {
          children: 'childrenList',
          label: 'name',
          value: 'uuid'
        },
        multipleSelection: [],
        scriptList: [],
        uuid: '',
        formRules: {
          name: [
            Validaters.NotNull,
            Validaters.Max(30)
          ],
          description: [Validaters.Max(120)],
          itemTypeUuid: [Validaters.NotNull],
          scriptUuid: [Validaters.NotNull],
          scriptLibUuid: [Validaters.NotNull],
          templateUuid: [Validaters.NotNull]
        }
      }
    },
    components: {
      InputTree
    },
    props: {
      editData: {
        type: Object
      },
      checkSystemList: {
        type: Array
      }
    },
    created() {
      if (this.editData !== undefined) {
        if (this.editData.isBuiltin === 1) {
          this.edit = true
        }
        this.form = intersectObj(this.form, this.editData)
      }
      this.getSelectList()
    },
    mounted() {
      this.changeSriptHandler(this.form.scriptLibUuid)
      $axios.get('/scriptConsole/scriptLibTreeNode').then((res) => {
        if (res.data) {
          this.allScriptLib = res.data
        } else {
          return false
        }
      })
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      getItemTypeName(val) {
        let arr = this.itemType.filter(node => node.uuid === val);
        this.form.itemTypeName = arr[0].name
      },
      getTemplateName(val) {
        let arr = this.systemFastenTemplates.filter(node => node.uuid === val);
        this.form.templateName = arr[0].name
      },
      getSearchDef () {
        return {
          width: 12,
          offset: 6,
          placeholder: '请输入查询内容',
          searchProps: ['name', 'itemTypeName', 'templateName', 'description']
        }
      },
      getData(uuid) { // 根据脚本库获取脚本
        $axios.get(`/scriptConsole/getScriptFromLibIsNotSysFasten/${uuid}`).then(res => {
          this.scriptList = res.data
        })
      },
      changeSriptHandler(val) {
        this.getData(val.uuid)
      },
      getSelectList() {
        $axios.get('/automateSystemFasten/getSystemFastenItemScriptLibAndScriptAndType').then((res) => {
          this.ajaxData = res.data
          this.systemFastenTemplates = res.data.systemFastenTemplates
          // this.allScriptLib = res.data.allScriptLib
          this.itemType = res.data.itemType
          // if (this.editData !== undefined) {
          //   this.changeSriptHandler(this.form.scriptLibUuid)
          // }
        })
      }
    }
  }
</script>
