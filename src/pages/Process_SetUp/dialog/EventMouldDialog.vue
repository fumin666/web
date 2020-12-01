<template>
  <s-form :model="form" ref="Form" :rules="rules" label-width="100px">
    <s-row>
      <s-col span="10">
        <s-form-item prop="serialCode" label="编号:">
          <s-input v-model="form.serialCode" disabled></s-input>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item prop="templateName" label="模板名称:">
          <s-input v-model="form.templateName" :maxlength="50"></s-input>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item prop="briefDesc" label="简要描述:">
          <s-input v-model="form.briefDesc" type="textarea" :maxlength="100" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></s-input>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item prop="detailDesc" label="详细描述:">
          <s-input v-model="form.detailDesc" type="textarea" :maxlength="300" :autosize="{ minRows: 2, maxRows: 4  }" placeholder="请输入内容"></s-input>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item prop="categoryFirst" label="分类一级:">
          <s-cascader
            :options="companyAndCategoryList"
            :props="cascaderConfig"
            :value="companyCategoryValue"
            expand-trigger="hover"
            @change="changeCompanyAndCategory"
            :show-all-levels= "false"
            style="width: 100%;"
          >
          </s-cascader>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item prop="incidentSource" label="事件来源:">
          <s-select v-model="form.incidentSource">
            <s-option v-for="(value, key, index) in options.incidentSourceMap" :label="value"
                      :value="key"  :key="'incidentSourceMap' + index"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item label="分类二级:">
          <s-select v-model="form.categorySecond" @change="changeCategorySecond">
            <s-option v-for="opt in secondary" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item label="紧急性:">
          <s-select v-model="form.criticality">
            <s-option v-for="(value, key, index) in options.criticalityMap" :label="value"
                      :value="key"  :key="'criticalityMap' + index"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item label="分类三级:">
          <s-select v-model="form.categoryThird">
            <s-option v-for="opt in thirdary" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item label="影响度:">
          <s-select v-model="form.effect">
            <s-option v-for="(value, key, index) in options.effectMap" :label="value"
                      :value="key" :key="'effect' + index"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item label="处理组:">
          <s-select v-model="form.assignGroup">
            <s-option v-for="(item, index) in options.groupInfo" :key="'group' + index"
                      :label="item.groupName" :value="item.uuid">
            </s-option>
          </s-select>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item label="优先级:">
          <s-input v-model="priority" disabled></s-input>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item label="处理人:">
          <s-select v-model="form.assignUser">
            <s-option v-for="(item, index) in userList" :key="'user' + index"
                      :label="item.userRealName" :value="item.uuid">
            </s-option>
          </s-select>
        </s-form-item>
      </s-col>
    </s-row>

  </s-form>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  export default {
    data() {
      return {
        form: {
          serialCode: '',
          briefDesc: '',
          detailDesc: '',
          categoryFirst: '',
          categorySecond: '',
          categoryThird: '',
          incidentSource: '',
          criticality: '',
          effect: '',
          priority: '',
          assignGroup: '',
          assignUser: '',
          templateName: '',
          companyUuid: ''
        },
        rules: {
          templateName: [Validaters.NotNull]
        },
        topCategory: [],
        secondary: [],
        thirdary: [],
        options: { // 来源、紧急性、影响度、优先级、处理组下拉选项
          incidentSourceMap: {},
          criticalityMap: {},
          effectMap: {},
          priorityMap: {},
          groupInfo: []
        },
        userList: [],
        templateDialog: null,
        priority: '',
        companyAndCategoryList: [],
        cascaderConfig: {
          label: 'name',
          value: 'uuid',
          children: 'childrenList'
        },
        companyCategoryValue: []
      }
    },
    created() {
      this.axiosOptions();
      this.axiosCategory();
      this.getEventOrderNum();
    },
    methods: {
      changeCompanyAndCategory(val) {
        if (val.length > 0) {
          this.form.companyUuid = val[0];
          this.form.categoryFirst = val[1];
        }
      },
      changeCategorySecond(val) {
        if (val !== '' && this.form.ownerType !== '' && this.form.categoryFirst !== '') {
          let ItilCategory = {
            ownerType: 0,
            categoryFirst: this.form.categoryFirst,
            categorySecond: val
          };
          this.form.categoryThird = '';
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', ItilCategory).then((res) => {
            if (res.status === 200) {
              this.thirdary = res.data;
            }
          })
        }
      },
      initSelOption(field) { // 下拉框默认选中第一项
        let formField = field.slice(0, field.indexOf('Map'));
        if (Object.keys(this.options[field]).length > 0) {
          let key = Object.keys(this.options[field])[0];
          this.form[formField] = key;
        }
      },
      axiosOptions() {
        $axios.get('/itilIncidentCenter/toCreateIncidentOrder').then(({data}) => {
          for (let i in this.options) {
            this.options[i] = data[i]
            if (i !== 'groupInfo') {
              this.initSelOption(i);
            }
          }
        })
      },
      axiosCategory() {
        $axios.get('/ItilCommonWorkflow/getCompanyAndCategory/0').then((res) => {
          if (res.status === 200) {
            this.companyAndCategoryList = res.data;
            this.companyCategoryValue[0] = this.companyAndCategoryList[0].uuid;
            this.companyCategoryValue[1] = this.companyAndCategoryList[0].childrenList[0].uuid;
            this.form.categoryFirst = this.companyAndCategoryList[0].childrenList[0].uuid;
            this.form.companyUuid = this.companyAndCategoryList[0].uuid;
          }
        })
      },
      axiosUser() {
        $axios.get(`/itilIncidentCenter/getIncidentOrderUser/${this.form.assignGroup}`).then(({data}) => {
          this.userList = data;
        })
      },
      getEventOrderNum() {
        $axios.post('/itilWorkflowConfig/getIncidentTemplateSerialCode').then((res) => {
          if (res.status === 200) {
            this.form.serialCode = res.data;
          }
        })
      }
    },
    watch: {
      'form.categoryFirst': {
        deep: true,
        handler: function (val) {
          if (val !== '') {
            let param = {
              ownerType: 0,
              companyUuid: this.form.companyUuid,
              categoryFirst: this.form.categoryFirst
            }
            this.form.categorySecond = '';
            this.form.categoryThird = '';
            this.secondary = [];
            this.thirdary = [];
            $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(res => {
              if (res.status === 200) {
                this.secondary = res.data;
              }
            })
          }
        }
      },
      'form.companyUuid': {
        deep: true,
        handler: function (val) {
          if (val !== '') {
            this.form.assignGroup = '';
            $axios.get('/itilIncidentCenter/getGroup/' + val).then(res => {
              if (res.status === 200) {
                this.options.groupInfo = res.data;
              }
            });
          }
        }
      },
      'form.assignGroup': {
        deep: true,
        click() {
          this.form.assignUser = '';
          this.axiosUser();
        }
      },
      'form.criticality': {
        deep: true,
        handler: function (val) {
          if (val !== '' && this.form.effect !== '') {
            $axios.post('/ItilCommonWorkflow/getPriorityByCriticalityAndEffent/' + val + '/' + this.form.effect).then((res) => {
              if (res.status === 200) {
                switch (res.data) {
                  case 1:
                    this.form.priority = 1;
                    this.priority = '重大';
                    break;
                  case 2:
                    this.form.priority = 2;
                    this.priority = '高';
                    break;
                  case 3:
                    this.form.priority = 3;
                    this.priority = '中';
                    break;
                  case 4:
                    this.form.priority = 4;
                    this.priority = '低';
                    break;
                }
              }
            })
          }
        }
      },
      'form.effect': {
        deep: true,
        handler: function (val) {
          if (val !== '' && this.form.criticality !== '') {
            $axios.post('/ItilCommonWorkflow/getPriorityByCriticalityAndEffent/' + this.form.criticality + '/' + val).then((res) => {
              if (res.status === 200) {
                switch (res.data) {
                  case 1:
                    this.form.priority = 1;
                    this.priority = '重大';
                    break;
                  case 2:
                    this.form.priority = 2;
                    this.priority = '高';
                    break;
                  case 3:
                    this.form.priority = 3;
                    this.priority = '中';
                    break;
                  case 4:
                    this.form.priority = 4;
                    this.priority = '低';
                    break;
                }
              }
            })
          }
        }
      }
    }
  }
</script>
