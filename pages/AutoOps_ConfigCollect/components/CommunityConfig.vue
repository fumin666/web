/**
* Created by alex on 2018/8/13.
*/
<template>
  <div class="step1">
    <s-form :model="step1Form" :rules="step1Rules" ref="step1Form" label-width="240px">
      <s-form-item label="共同体类型:">
        <s-radio-group v-model="step1Form.version">
          <s-radio class="radio" :label="1">v1</s-radio>
          <s-radio class="radio" :label="2">v2</s-radio>
          <s-radio class="radio" :label="3">v3</s-radio>
        </s-radio-group>
      </s-form-item>
      <s-form-item label="共同体名称" prop="community" v-if="step1Form.version!==3">
        <s-input v-model="step1Form.community"></s-input>
      </s-form-item>
      <s-form-item label="用户名:" prop="userName" v-if="step1Form.version===3">
        <s-input v-model="step1Form.userName"></s-input>
      </s-form-item>
      <s-form-item label="密码:" prop="snmpPassword" v-if="step1Form.version===3">
        <s-col span="11">
          <s-input v-model="step1Form.snmpPassword" type="password"></s-input>
        </s-col>
        <s-col span="11" offset="2">
          <s-select v-model="step1Form.encryption">
            <s-option label="MD5" value="0"></s-option>
            <s-option label="SHA" value="1"></s-option>
          </s-select>
        </s-col>
      </s-form-item>
      <s-form-item>
        <s-button @click="submitVerify()">提交凭证</s-button>
      </s-form-item>
    </s-form>
    <div class="delete" style="margin-bottom: 5px">
      <s-button icon="delete" @click="deleteVerify">删除</s-button>
    </div>
    <s-table :data="step1List" ref="table" reborder style="width: 100%"
             @selection-change="selectionChange">
      <s-table-column type="selection" width="45">
      </s-table-column>
      <s-table-column label="版本号">
        <template slot-scope="scope">
          v{{scope.row.version}}
        </template>
      </s-table-column>
      <s-table-column label="凭证">
        <template slot-scope="scope">
          {{scope.row.community || scope.row.userName}}
        </template>
      </s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-delete" @click="delCurVerify(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';

  export default {
    data () {
      return {
        step1List: [],
        selections: [],
        step1Rules: {
          userName: [
            Validaters.NotNull,
            Validaters.NotSpace,
            Validaters.Min(8),
            Validaters.Max(50)
          ],
          snmpPassword: [
            Validaters.NotNull,
            Validaters.NotSpace,
            Validaters.Min(8),
            Validaters.Max(30)
          ],
          community: [
            Validaters.NotNull,
            Validaters.Max(30),
            {pattern: /^[^!#$&！ ][\S]*$/, message: '第一个字符不能为! # $ &,不能包含空格', trigger: 'blur'}
          ]
        },
        step1Form: {
          version: 2,
          userName: '',
          snmpPassword: '',
          encryption: '0',
          community: ''
        }
      }
    },
    created() {
      this.getStep1List();
    },
    methods: {
      getStep1List() {
        $axios.get('/systemmanager/sysConfig/getCommunityList').then((response) => {
          let { status, msg, data } = response;
          if (status === 200 && data !== '') {
            this.step1List = data;
          } else {
            this.$message({
              title: '错误',
              message: msg,
              type: 'error'
            });
          }
        })
      },
      submitVerify () {
        this.$refs.step1Form.validate(valid => {
          if (!valid) {
            return false;
          }
          // 验证凭证是否重名
          let communityName = this.step1Form.version === 3 ? this.step1Form.userName : this.step1Form.community;
          $axios.get(`/systemmanager/sysConfig/checkCommunity/${communityName}/${this.step1Form.version}`).then(({data}) => {
            if (data) {
              this.$message({type: 'warning', message: '该凭证已经存在，请重新输入！'});
              return;
            }
            let param = {};
            if (this.step1Form.version === 3) {
              for (let i in this.step1Form) {
                if (i !== 'community') {
                  param[i] = this.step1Form[i];
                }
              }
            } else {
              param.community = this.step1Form.community;
              param.version = this.step1Form.version;
            }
            $axios.post('/systemmanager/sysConfig/saveCommunity', param, {
              data: [],
              logTemplate: '配置|采集配置>端口设置'
            }).then(response => {
              if (response.status === 200 && response.data !== 'error') {
                this.$message({
                  showClose: true,
                  message: '添加成功!',
                  type: 'success'
                });
                // 提交成功后重置表单
                this.step1Form = {
                  version: 2,
                  userName: '',
                  snmpPassword: '',
                  encryption: '0',
                  community: ''
                };
                this.getStep1List();
              }
            });
          });
        });
      },
      axiosDeleteVerify(params) {
        this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.post('/systemmanager/sysConfig/deleteCommunitys', params).then(response => {
            if (response.status === 200 && response.data === 'success') {
              this.$message({
                showClose: true,
                message: '删除成功!',
                type: 'success'
              });
              this.getStep1List();
            }
          });
        }).catch(() => {});
      },
      deleteVerify () {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '请先选择凭证!', type: 'info'});
          return;
        }
        this.axiosDeleteVerify(this.selections.map(function (item) {
          return item.uuid;
        }));
      },
      delCurVerify(row) {
        this.axiosDeleteVerify([row.uuid]);
      },
      selectionChange(rows) {
        this.selections = rows;
      },
      next() {
        if (this.selections.length <= 0) {
          this.$message({
            showClose: true,
            message: '请选择凭证',
            type: 'error'
          });
        } else {
          this.$store.commit('next');
        }
      }
    }
  }
</script>

