<template>
  <s-dialog class="org-add" v-model="bloom" :title="title">
    <s-form :model="departmentinfo" :rules="rules" ref="departmentinfo" label-width="110px">
      <s-form-item label="机构名称" prop="departName">
        <s-input v-model="departmentinfo.departName"></s-input>
      </s-form-item>
      <s-form-item label="上级机构" prop="departParentUuid">
        <s-input v-model="departParentName" v-if="add" :readonly="true"></s-input>
        <s-select v-model="departmentinfo.departParentUuid" filterable v-if="edit && !rootCell" placeholder="请选择">
          <s-option v-for="item in parents" :label="item.label" :value="item.value" :key="item.value"></s-option>
        </s-select>
        <s-input v-model="departParentName" v-if="edit && rootCell" :readonly="true"></s-input>
      </s-form-item>
      <s-form-item label="机构编号" prop="departCode">
        <s-input v-model="departmentinfo.departCode"></s-input>
      </s-form-item>
      <s-input v-model="departmentinfo.departParentUuid" v-if="add" v-show="false"></s-input>
      <s-form-item label="机构负责人" prop="departLeaderUuid">
        <s-select v-model="departmentinfo.departLeaderUuidList" multiple filterable placeholder="请选择"
                  style="width:100%;">
          <s-option v-for="item in leaders" :label="item.label" :value="item.value" :key="item.value"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="机构地址" prop="departPlace">
        <s-input v-model="departmentinfo.departPlace"></s-input>
      </s-form-item>
      <s-form-item label="电话" prop="departPhone">
        <s-input v-model="departmentinfo.departPhone"></s-input>
      </s-form-item>
      <s-form-item label="备注" prop="remark">
        <s-input v-model="departmentinfo.remark" type="textarea"></s-input>
      </s-form-item>
    </s-form>
    <template slot="footer">
      <s-button @click="ok">确定</s-button>
      <s-button @click="cancel" type="cancel">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {intersectObj} from 'sunflower-common-utils'

  export default {
    data() {
      let checkName = (rule, value, callback) => {
        if (value) {
          let res = value.search(/[^-|\w|\u4e00-\u9fa5]/g);
          if (res > -1) {
            callback(new Error('由中文、字母、数字、-、_组成'));
          } else {
            callback()
          }
        }
      };
      let checkRepeatName = (rule, value, callback) => {
        if (value !== this.editRepeatName) {
          if (value) {
            $axios.post(`/departmentInfo/nameValidate`, {name: value}).then((res) => {
              let isRepeat = res.data
              if (isRepeat === 'true') {
                callback(new Error('该名称已经存在'));
              } else {
                callback()
              }
            })
          }
        } else {
          callback()
        }
      };
      return {
        bloom: false,
        editRepeatName: '',
        editRepeatCode: '',
        departParentName: '',
        departmentinfo: {
          departName: '',
          departCode: '',
          departParentUuid: '',
          departLeaderUuidList: [],
          departPlace: '',
          departPhone: '',
          remark: '',
          uuid: ''
        },
        rules: {
          departName: [
            {required: true, message: '请输入机构名称', trigger: 'blur'},
            {max: 30, message: '最大长度30', trigger: 'change'},
            {validator: checkName, trigger: 'blur'},
            {validator: checkRepeatName, trigger: 'blur'}
          ],
          departParentUuid: [
            {required: true, message: '请选择上级机构', trigger: 'change'}
          ],
          departCode: [
            {max: 30, message: '最大长度30', trigger: 'change'}
          ],
          departViceLeaderUuid: [],
          departPlace: [
            {max: 50, message: '最大长度50', trigger: 'blur'}
          ],
          departPhone: [
            {pattern: /^[0-9\-]{3,30}$/, message: '号码可以由数字和-组成，不超过30位', trigger: 'blur'}
          ],
          remark: [
            {max: 120, message: '最大长度120', trigger: 'blur'}
          ]
        },
        parents: [],
        leaders: [],
        vices: [],
        edit: false,
        add: false,
        rootCell: false
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '新增组织机构'
      }
    },
    watch: {
      value: {
        immediate: true,
        handler: function (val) {
          this.bloom = val;
        }
      },
      bloom(val) {
        this.$emit('input', val);
      }
    },
    mounted() {
      let vm = this
      let departUuid = this.$parent.showOrgEdit ? this.$parent.tempCell.uuid : null;
      $axios.post(`/departmentInfo/getDepartAndUserInfo/${departUuid}`).then((res) => {
        let leaderAry = [];
        for (let i = 0, length = res.data.listUserInfo.length; i < length; i++) {
          leaderAry.push({label: res.data.listUserInfo[i].realNameAndEmail, value: res.data.listUserInfo[i].uuid});
        }
        vm.leaders = leaderAry;
        vm.vices = leaderAry;
        vm.departParentName = vm.$parent.tempCell.departName;
        vm.add = vm.$parent.showOrgAdd;
        vm.edit = vm.$parent.showOrgEdit;
        if (vm.edit) {
          vm.departmentinfo = intersectObj(vm.departmentinfo, vm.$parent.allNodes[vm.$parent.tempCell.uuid]);
          vm.editRepeatName = vm.departmentinfo.departName
          vm.editRepeatCode = vm.departmentinfo.departCode
          if (vm.$parent.tempCell.level === 1) {
            vm.rootCell = true;
            vm.departParentName = '无';
          }
          vm.getAllNodes(res.data.listDepart);
        } else {
          vm.departmentinfo.departParentUuid = this.$parent.tempCell.uuid;
        }
      });
    },
    methods: {
      getAllNodes(data) {
        data.map(item => {
          this.parents.push({'label': item.departName, 'value': item.uuid});
        })
        // for (var key in this.$parent.allNodes) {
        //   if (this.$parent.tempCell.uuid !== this.$parent.allNodes[key].uuid) {
        //     this.parents.push({'label': this.$parent.allNodes[key].departName, 'value': this.$parent.allNodes[key].uuid});
        //   }
        // }
      },
      ok() {
        if (this.add) {
          // 添加操作
          let form = {
            code: this.departmentinfo.departCode,
            uuid: this.departmentinfo.departParentUuid
          }
          $axios.post(`/departmentInfo/codeValidate`, form).then((res) => {
            if (res.data === 'true') {
              this.$message({
                type: 'error',
                message: '该机构编号已经存在'
              });
            } else {
              this.$refs.departmentinfo.validate((valid) => {
                if (valid === false) {
                  return false;
                }
                $axios.post('/departmentInfo/saveDepartInfo', this.departmentinfo, {
                  data: [{departName: this.departmentinfo.departName}],
                  logTemplate: '添加|组织机构(#departName#)'
                }).then((res) => {
                  if (res.status === 200) {
                    if (res.data !== null) {
                      this.$message({
                        type: 'success',
                        message: '添加成功'
                      });
                      this.$parent.addChild(res.data);
                    }
                  } else {
                    this.$message({
                      type: 'error',
                      message: '添加失败'
                    });
                  }
                  this.bloom = false;
                });
              })
            }
          })
        } else {
          // 编辑操作
          let form = {
            code: this.departmentinfo.departCode,
            uuid: this.departmentinfo.departParentUuid
          }
          if (form.code !== this.editRepeatCode) {
            $axios.post(`/departmentInfo/codeValidate`, form).then((res) => {
              if (res.data === 'true') {
                this.$message({
                  type: 'error',
                  message: '该机构编号已经存在'
                });
              } else {
                this.$refs.departmentinfo.validate((valid) => {
                  if (valid === false) {
                    return false;
                  }
                  $axios.post('/departmentInfo/updateDepartmentInfo', this.departmentinfo, {
                    data: [{departName: this.departmentinfo.departName}],
                    logTemplate: '编辑|组织机构(#departName#)'
                  }).then((res) => {
                    if (res.status === 200) {
                      if (res.data !== 'success') {
                        this.$message({
                          type: 'success',
                          message: '编辑成功'
                        });
                        this.$parent.updateChild();
                      }
                    } else {
                      this.$message({
                        type: 'error',
                        message: '编辑失败'
                      });
                    }
                    this.bloom = false;
                  });
                })
              }
            })
          } else {
            this.$refs.departmentinfo.validate((valid) => {
              if (valid === false) {
                return false;
              }
              $axios.post('/departmentInfo/updateDepartmentInfo', this.departmentinfo, {
                data: [{departName: this.departmentinfo.departName}],
                logTemplate: '编辑|组织机构(#departName#)'
              }).then((res) => {
                if (res.status === 200) {
                  if (res.data !== 'success') {
                    this.$message({
                      type: 'success',
                      message: '编辑成功'
                    });
                    this.$parent.updateChild();
                  }
                } else {
                  this.$message({
                    type: 'error',
                    message: '编辑失败'
                  });
                }
                this.bloom = false;
              });
            })
          }
        }
      },
      cancel() {
        this.bloom = false;
      }
    }
  }
</script>
