<!--
 * @Author: .....
 * @Version: //Q4 添加人员
 * @Description:人员管理 添加
 * @Position:账号管理-人员管理-添加
 * @Date: 2019-11-13 11:11:11
 * @LastEditors: songyf
 -->
<template>
  <s-dialog v-model="dialogFlag" :title="isEdit ? '编辑' : '添加'" width="700px" class="staffAddDialog">
    <s-scrollbar wrap-class="staffAddScrollbar"  wrap-style="max-height:450px;">
      <s-collapse v-model="activeNames" accordion>
        <s-collapse-item title="人员信息" name="1">
          <s-form :model="staffForm" :rules="staffRule" ref="staffForm1" label-width="130px" class="custom-form">
            <s-row type="flex" justify="between">
              <s-col span="18">
                <s-form-item label="真实姓名" prop="userRealName">
                  <s-input v-model="staffForm.userRealName"></s-input>
                </s-form-item>
                <s-form-item label="所属机构" prop="departName">
                  <s-select style="width: 100%" v-model="staffForm.departName" filterable placeholder="请选择所属机构">
                    <s-option v-for="depart in departOptions" :label="depart.departName" :value="depart.uuid" :key="depart.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="Email" prop="userMail">
                  <s-input v-model="staffForm.userMail"></s-input>
                </s-form-item>
                <s-form-item label="手机号码" prop="userCellphone" :required="needPhone">
                  <s-input v-model="staffForm.userCellphone"></s-input>
                </s-form-item>
              </s-col>
              <s-col span="5" style="padding: 4px 0">
                <img width="120px" height="120px" style="margin: 10px 0 0 10px;border-radius: 50%" v-if="imageUrl" :src="imageUrl" class="avatar">
                <s-upload ref="upload" :action="upLoadUrl" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :show-file-list="false">
                  <s-button style="width: 120px;margin: 10px 0 0 10px">修改</s-button>
                </s-upload>
              </s-col>
            </s-row>
            <s-form-item label="个人地址" prop="userAddress">
              <s-input v-model="staffForm.userAddress"></s-input>
            </s-form-item>
            <s-form-item label="备注" prop="remark">
              <s-input type="textarea" :rows="2" v-model="staffForm.remark"></s-input>
            </s-form-item>
            <!-- 动态属性 -->
            <div v-for="(item, index) in peopleAttributeData" :key="item.uuid">
              <!--内置属性-->
              <div v-if="item.internalFlag">
                <s-form-item
                  v-if="item.propertyType === 1"
                  :label="item.propertyName"
                  :title="item.propertyName"
                  :prop="item.propertyKey">
                  <s-input
                    placeholder="请输入内容"
                    v-model="staffForm[item.propertyKey]">
                  </s-input>
                </s-form-item>
                <s-form-item
                  :label="item.propertyName"
                  :title="item.propertyName"
                  :prop="item.propertyKey"
                  v-else>
                  <s-select
                    :clearable="true"
                    placeholder="请选择"
                    v-if="item.propertyType === 3"
                    v-model="staffForm[item.propertyKey]">
                    <s-option
                      v-for="(option, index) in item.dropDownOptionList"
                      :label="option.name"
                      :value="option.value"
                      :key="index"></s-option>
                  </s-select>
                  <s-date-picker
                    v-else-if="item.propertyType === 4"
                    v-model="staffForm[item.propertyKey]"
                    :editable="false"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    type="date"
                    clearable
                    placeholder="选择日期">
                  </s-date-picker>
                  <s-input
                    v-else
                    placeholder="请输入数值"
                    v-model="staffForm[item.propertyKey]"></s-input>
                </s-form-item>
              </div>
              <!--自定义属性-->
              <div v-else>
                <s-form-item
                  v-if="item.propertyType === 1"
                  :label="item.propertyName"
                  :title="item.propertyName"
                  :prop="`customProperty.${item.propertyKey}`">
                  <s-input
                    placeholder="请输入内容"
                    v-model="staffForm.customProperty[item.propertyKey]">
                  </s-input>
                </s-form-item>
                <s-form-item
                  :label="item.propertyName"
                  :title="item.propertyName"
                  :prop="`customProperty.${item.propertyKey}`"
                  v-else>
                  <s-select
                    :clearable="true"
                    placeholder="请选择"
                    v-if="item.propertyType === 3"
                    v-model="staffForm.customProperty[item.propertyKey]">
                    <s-option
                      v-for="(option, index) in item.dropDownOptionList"
                      :label="option.name"
                      :value="option.value"
                      :key="index"></s-option>
                  </s-select>
                  <s-date-picker
                    v-else-if="item.propertyType === 4"
                    v-model="staffForm.customProperty[item.propertyKey]"
                    :editable="false"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    type="date"
                    clearable
                    placeholder="选择日期">
                  </s-date-picker>
                  <s-input
                    v-else
                    placeholder="请输入数值"
                    v-model="staffForm.customProperty[item.propertyKey]"></s-input>
                </s-form-item>
              </div>
            </div>

          </s-form>
        </s-collapse-item>
        <s-collapse-item title="入职信息" name="2" v-if="showInductionMsg">
          <s-form :model="staffForm" :rules="staffRule" ref="staffForm3" label-width="135px">
            <s-form-item label="身份证号码" prop="idCard">
              <s-input v-model="staffForm.idCard"></s-input>
            </s-form-item>
            <s-form-item label="最高学历" prop="lastEducation">
              <s-select style="width: 30%" v-model="staffForm.lastEducation" filterable placeholder="请选择最高学历">
                <s-option label="初中及以下" :value="1"></s-option>
                <s-option label="中专/中技" :value="2"></s-option>
                <s-option label="高中" :value="3"></s-option>
                <s-option label="大专" :value="4"></s-option>
                <s-option label="本科" :value="5"></s-option>
                <s-option label="硕士" :value="6"></s-option>
                <s-option label="博士" :value="7"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="最高学历学校名称" prop="lastSchool">
              <s-input v-model="staffForm.lastSchool"></s-input>
            </s-form-item>
            <s-form-item label="入职日期" prop="entryTime">
              <s-date-picker
                v-model="staffForm.entryTime"
                value-format="yyyy-MM-dd 00:00:00"
                format="yyyy-MM-dd"
                :editable="false"
                type="date"
                clearable
                placeholder="选择日期">
              </s-date-picker>
            </s-form-item>
           <!-- <s-form-item label="直接汇报领导">
              <s-select style="width: 100%" v-model="staffForm.directLeader" filterable placeholder="请选择直接汇报领导">
                <s-option v-for="depart in staffList" :label="depart.userRealName" :value="depart.uuid" :key="depart.uuid"></s-option>
              </s-select>
            </s-form-item>-->
            <s-form-item label="岗位" prop="position">
              <s-input v-model="staffForm.position"></s-input>
            </s-form-item>
            <s-form-item label="人员类型" prop="userClassify" required>
              <s-select style="width: 100%" v-model="staffForm.userClassify">
                <s-option label="内部人员" :value="1"></s-option>
                <s-option label="内部临时" :value="2"></s-option>
                <s-option label="职能人员" :value="3"></s-option>
                <s-option label="应用人员" :value="4"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="工作地点" prop="workLocation">
              <s-input v-model="staffForm.workLocation"></s-input>
            </s-form-item>
          </s-form>
        </s-collapse-item>
      </s-collapse>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';
import {indexOf} from 'lodash';
const photoUrl = 'static/images/system/UserPhoto.png';

export default {
  data() {
    let checkRepeatName = (rule, value, callback) => {  // 校验重复邮箱
      if (value) {
        $axios.post(`/iamUserInfo/checkEmail`, {name: value}).then((res) => {
          if (res.data.state === false) {
            callback(new Error('该邮箱已经存在！'));
          } else {
            callback()
          }
        })
      }
    };
    let checkWorkPosition = (rule, value, callback) => { // 校验重复工号
      if (value) {
        $axios.get(`/iamUserInfo/checkWorkPosition/${value}`).then((res) => {
          if (res.data.state === false) {
            callback(new Error('该工号已经存在！'));
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    };
    return {
      showInductionMsg: false,
      flag: 0,
      activeNames: '1',
      dialogFlag: false,
      imageUrl: photoUrl,
      departOptions: [],
      staffForm: {
        userRealName: '', // 真实姓名
        departName: '', // 所属机构
        departUuid: '', // 所属机构
        userMail: '', // Email
        userCellphone: '', // 手机号码
        userAddress: '', // 个人地址
        remark: '', // 备注
        userPhotopath: '', // 头像
        // userWechat: '', // 微信号
        userGender: 0, // 性别 0:保密
        // userWorkPosition: '', // 工号
        // userPhone: '', // 办公号码
        // userShortNumber: '', // 短信号码
        userWorkStation: '', // 工位
        position: '', // 岗位
        userClassify: 1, // 人员类型 1:内部人员
        idCard: '', // 身份证号码
        lastEducation: 5, // 最高学历 5：本科
        lastSchool: '', // 最高学历学校名称
        entryTime: null, // int型，精确到秒 入职日期
        workLocation: '', // 工作地点
        directLeader: '', // 直接汇报领导人
        customProperty: {} // 自定义属性值列表(input v-model的变量)
      },
      staffRule: {
        userRealName: [
          Validaters.NotNull,
          Validaters.Name,
          Validaters.Max(30)
        ],
        departName: [Validaters.NotNull],
        userMail: [
          Validaters.NotNull,
          Validaters.Email,
          Validaters.Max(50),
          {validator: checkRepeatName, trigger: 'blur'}
        ],
        userCellphone: [
          Validaters.Max(20),
          Validaters.MobilePhone
        ],
        userWechat: [
          Validaters.Max(30)
        ],
        userAddress: [
          Validaters.Max(30)
        ],
        userPhone: [
          Validaters.TelePhone
        ],
        userWorkPosition: [
          {validator: checkWorkPosition, trigger: 'blur'}
        ],
        remark: [Validaters.Max(120)],
        idCard: [
          {pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号码', trigger: 'blur'},
          {trigger: 'blur', message: '请输入数字'}
        ],
        workLocation: [Validaters.NotNull, Validaters.Max(30)],
        lastEducation: [Validaters.NotNull],
        lastSchool: [Validaters.NotNull, Validaters.Max(30)],
        position: [
          Validaters.NotNull,
          Validaters.Max(30)
        ],
        directLeader: [],
        entryTime: [Validaters.NotNull]
      },
      needPhone: false,
      editDefaultName: '',
      upLoadUrl: '',
      staffList: [],
      peopleAttributeData: [], // 人员属性集合
      textMax: [Validaters.Max(30)],
      selectRequire: [Validaters.SelectValNotNull],
      textRequire: [Validaters.NotNull]
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    staff: {
      type: Object
    },
    curUuid: {
      type: String,
      default: ''
    }
  },
  computed: {
    isEdit() {
      return Object.keys(this.staff).length > 0;
    }
  },
  created() {
    let registerModelList = this.$store.state.userData.registerModelList
    if (registerModelList.indexOf('IAM_EXTEND') !== -1) {
      this.showInductionMsg = true
    }
    this.upLoadUrl = $axios.basePath() + '/fileUpload/uploadUserPhoto'
    if (this.isEdit) {
      for (let i in this.staffForm) {
        this.staffForm[i] = this.staff[i];
      }
      this.imageUrl = this.staff.userPhotopath || photoUrl
    }
    $axios.get(`/iamUserInfo/getDepartList`).then(({data}) => {
      this.departOptions = data;
      if (!this.isEdit && data.length > 0) { // 添加
        this.staffForm.departName = this.curUuid;
      }
    });
    // 判断电话号码是否必填
    $axios.get(`/iamUserInfo/getIamSysLoginType`).then(({data}) => {
      if (data === 'true') {
        this.needPhone = true;
      }
    });
    this.getDynamicAttribute() // 获取动态属性
  },
  methods: {
    getDynamicAttribute() { // 获取动态属性
      let vm = this
      $axios.get(`/userProperties/getAll`).then(({data}) => {
        if (data) {
          data.forEach((v) => {
            if (v.editFlag && v.applyFlag) { // 过滤内置和加入弹窗的数
              vm.peopleAttributeData.push(v)
              if (v.internalFlag) { // 如果是内置属性
                vm.$set(vm.staffForm, v.propertyKey, v.defaultValue)
                if (vm.curUuid !== '' && vm.staffForm.departName === null) {
                  vm.staffForm.departName = vm.curUuid;
                }
                if (v.requiredValueFlag) {
                  if (v.propertyType === 3) {
                    vm.$set(vm.staffRule, v.propertyKey, vm.staffRule[v.propertyKey] ? [...vm.selectRequire, ...vm.staffRule[v.propertyKey]] : vm.selectRequire)
                  } else {
                    vm.$set(vm.staffRule, v.propertyKey, vm.staffRule[v.propertyKey] ? [...vm.textRequire, ...vm.textMax, ...vm.staffRule[v.propertyKey]] : [...vm.textRequire, ...vm.textMax])
                  }
                } else {
                  if (v.propertyType !== 3) {
                    vm.$set(vm.staffRule, v.propertyKey, vm.staffRule[v.propertyKey] ? [...vm.textMax, ...vm.staffRule[v.propertyKey]] : vm.textMax)
                  }
                }
              } else {
                vm.$set(vm.staffForm.customProperty, v.propertyKey, v.defaultValue)
                if (v.requiredValueFlag) {
                  if (v.propertyType === 3) {
                    vm.$set(vm.staffRule, `customProperty.${v.propertyKey}`, vm.staffRule[v.propertyKey] ? [...vm.selectRequire, ...vm.staffRule[v.propertyKey]] : vm.selectRequire)
                  } else {
                    vm.$set(vm.staffRule, `customProperty.${v.propertyKey}`, vm.staffRule[v.propertyKey] ? [...vm.textRequire, ...vm.textMax, ...vm.staffRule[v.propertyKey]] : [...vm.textRequire, ...vm.textMax])
                  }
                } else {
                  if (v.propertyType !== 3) {
                    vm.$set(vm.staffRule, `customProperty.${v.propertyKey}`, vm.staffRule[v.propertyKey] ? [...vm.textMax, ...vm.staffRule[v.propertyKey]] : vm.textMax)
                  }
                }
              }
            } else {
              vm.$set(vm.staffForm, v.propertyKey, v.defaultValue)
            }
          });
          this.$nextTick(() => {
            vm.$refs['staffForm1'].clearValidate();
            if (vm.$refs['staffForm3']) {
              vm.$refs['staffForm3'].clearValidate();
            }
          })
        }
      });
    },
    dialogOk() {
      this.$refs.staffForm1.validate(valid1 => {
        if (valid1) {
          if (this.showInductionMsg) {
            this.$refs.staffForm3.validate(valid => {
              if (valid) {
                this.axiosOK()
              } else {
                this.activeNames = '2';
                this.$message({
                  type: 'warning',
                  message: '请按要求填写'
                })
              }
            });
          } else {
            this.axiosOK()
          }
        } else {
          this.activeNames = '1';
          this.$message({
            type: 'warning',
            message: '请按要求填写'
          })
        }
      })
    },
    axiosOK() {
      let logTemplateTxt = ''
      logTemplateTxt = '添加|人员管理>人员(#userRealName#)';
      let param = Object.assign({}, this.staffForm);
      if (this.staffForm.entryTime !== null) {
        param.entryTime = Date.parse(new Date(this.staffForm.entryTime)) / 1000;
      }
      param.uuid = this.staff.uuid;
      param.departUuid = param.departName
      $axios.post(`/departmentInfo/nameValidateByUuid`, {uuid: param.departUuid}).then((res) => {
        let isRepeat = res.data
        if (isRepeat === 'true') {
          $axios.post(`/iamUserInfo/saveUserInfoUnique`, param, {
            data: [{userRealName: this.staffForm.userRealName}],
            logTemplate: logTemplateTxt
          }).then(({data}) => {
            let $parentElId = this.$parent.$el.getAttribute('id');
            if (typeof $parentElId !== 'undefined' && $parentElId === 'accountOrgGraph') {
              if ((!this.isEdit && data.result === true)) {
                this.$parent.staffAddCallback(this.curUuid);
              }
            }
            if ((!this.isEdit && data.result === true) || (this.isEdit && data.result === true)) {
              this.$emit('reload');
              this.$message({showClose: true, message: '保存成功!', type: 'success'});
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: data.message, type: 'error'});
            }
          });
        } else {
          this.$message('该机构已经不存在')
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.staffForm.userPhotopath = res.userPhotopath
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const Image = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp']
      const isLt2M = file.size / 1024 / 1024 < 2;
      let isJPG
      indexOf(Image, file.type) < 0 ? isJPG = false : isJPG = true;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpg,jpeg,png,bmp 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  },
  watch: {
    needPhone(val) {
      if (val) {
        this.staffRule.userCellphone.push(Validaters.NotNull)
      }
    },
    value: {
      immediate: true,
      handler(val) {
        this.dialogFlag = val;
      }
    },
    dialogFlag(val) {
      this.$emit('input', val);
    },
    'staffForm.departName': function(val) {
      if (val) {
        let vm = this;
        $axios.get(`/iamUserInfo/getAllDepartLeaderByDepartUuid/${val}`).then(({data}) => {
          if (data instanceof Array) {
            if (vm.flag === 0) {
              vm.flag = 1
            } else {
              vm.staffForm.directLeader = '';
            }
            vm.$set(vm, 'staffList', data)
          }
        });
      }
    }
  }
}
</script>

<style lang="stylus">
.staffAddDialog {
  .staffAddScrollbar {
    max-height: 400px;
  }
}
</style>
