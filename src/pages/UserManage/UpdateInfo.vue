<!--
 * @Author: .....
 * @Version: //Q4 修改个人信息
 * @Description:
 * @Position:个人信息
 * @Date: 2019-11-21 11:11:11
 * @LastEditors: songyf
 -->
<template>
  <div>
    <s-scrollbar wrap-class="staffAddScrollbar"  wrap-style="max-height:450px;">
      <s-collapse v-model="activeNames" accordion>
        <s-collapse-item title="人员信息" name="1">
          <s-form :model="staffForm" :rules="staffRule" ref="staffForm1" label-width="130px" class="custom-form">
            <s-row type="flex" justify="between">
              <s-col span="18">
                <s-form-item label="真实姓名" prop="userRealName">
                  <s-input v-model="staffForm.userRealName"></s-input>
                </s-form-item>
                <s-form-item label="Email" prop="userMail">
                  <s-input v-model="staffForm.userMail"></s-input>
                </s-form-item>
                <s-form-item label="手机号码" prop="userCellphone" :required="needPhone">
                  <s-input :value="staffForm.userCellphone | capitalize(phoneClose)" @input="handlerPhone"></s-input>
                  <i class="iconfont" :class="phoneClose?'icon-open-eye':'icon-close-eye'" @click="phoneClose=!phoneClose" style="position: absolute;right: 10px;"></i>
                </s-form-item>
              </s-col>
              <s-col span="5" style="padding: 4px 0">
                <img width="120px" height="120px" style="margin: 10px 0 0 10px;border-radius: 50%" v-if="imageUrl" :src="imageUrl" class="avatars">
                <s-upload ref="upload" :action="upLoadUrl" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :show-file-list="false">
                  <s-button style="width: 120px;margin: 10px 0 0 10px">修改</s-button>
                </s-upload>
              </s-col>
            </s-row>
            <s-form-item label="个人地址" prop="userAddress">
              <s-input :value="staffForm.userAddress | capitalizeUserAddress(userAddressClose)" @input="handlerUserAddress"></s-input>
              <i class="iconfont" :class="userAddressClose?'icon-open-eye':'icon-close-eye'" @click="userAddressClose=!userAddressClose" style="position: absolute;right: 10px;"></i>
            </s-form-item>
            <s-form-item label="备注" prop="remark">
              <s-input type="textarea" :rows="2" v-model="staffForm.remark"></s-input>
            </s-form-item>
            <!-- 动态属性 -->
            <div v-for="(item, $idx) in peopleAttributeData" :key="$idx">
              <!--内置属性-->
              <div v-if="item.internalFlag">
                <s-form-item
                  v-if="item.propertyType === 1 && item.propertyName !== '微信号'"
                  :label="item.propertyName"
                  :title="item.propertyName"
                  :prop="item.propertyKey">
                  <s-input
                    placeholder="请输入内容"
                    v-model="staffForm[item.propertyKey]">
                  </s-input>
                </s-form-item>
                <s-form-item v-else-if="item.propertyType === 1 && item.propertyName === '微信号'" :label="item.propertyName" prop="userWechat">
                  <s-input :value="staffForm.userWechat | capitalizeUserWechat(userWechatClose)" @input="handlerUserWechat"></s-input>
                  <i class="iconfont" :class="userWechatClose?'icon-open-eye':'icon-close-eye'" @click="userWechatClose=!userWechatClose" style="position: absolute;right: 10px;"></i>
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
                    clearable
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    type="date"
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
          <s-form :model="staffForm" :rules="staffRule" ref="staffForm" label-width="135px">
            <s-form-item label="身份证号码" prop="idCard">
              <s-input :value="staffForm.idCard | capitalizeIdCard(idCardClose)" @input="handlerIdCard"></s-input>
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
                clearable
                type="date"
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
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { Validaters, intersectObj } from 'sunflower-common-utils';
  import { indexOf } from 'lodash';
  const photoUrl = 'static/images/system/UserPhoto.png'

  export default {
    props: {
      data: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      let checkWorkPosition = (rule, value, callback) => { // 校验重复工号
        if (value !== this.editDefaultOrderNumber) {
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
        } else {
          callback()
        }
      };
      let checkEmailName = (rule, value, callback) => {
        if (value !== this.editDefaultEmail) {
          if (value) {
            $axios.post(`/iamUserInfo/checkEmail`, {name: value}).then((res) => {
              if (res.data.state === false) {
                callback(new Error('该邮箱已经存在！'));
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
        phoneClose: false, // 眼睛展开还是关闭
        phoneFlag: true, // 标志位，第一次输入的时候清空，后面都不会清空
        userAddressClose: false,
        userWechatClose: false,
        userAddressFlag: true,
        idCardClose: false,
        idCardFlag: true,
        showInductionMsg: false,
        flag: 0,
        activeNames: '1',
        imageUrl: photoUrl,
        editDefaultOrderNumber: '',
        staffForm: {
          uuid: '',
          userRealName: '', // 真实姓名
          userMail: '', // Email
          userCellphone: '', // 手机号码
          userAddress: '', // 个人地址
          remark: '', // 备注
          userPhotopath: '', // 头像
          userWorkStation: '', // 工位
          userWechat: '',
          userGender: '',
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
          userMail: [
            Validaters.NotNull,
            Validaters.Email,
            Validaters.Max(50),
            {validator: checkEmailName, trigger: 'blur'}
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
            Validaters.Max(30),
            Validaters.TelePhone
          ],
          userWorkPosition: [
            Validaters.Max(18),
            {validator: checkWorkPosition, trigger: 'blur'}
          ],
          remark: [Validaters.Max(120)],
          idCard: [
            {pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号码', trigger: 'blur'},
            {trigger: 'blur', message: '请输入数字'}
          ],
          workLocation: [Validaters.NotNull, Validaters.Max(30)],
          lastEducation: [Validaters.SelectValNotNull],
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
        editDefaultEmail: '',
        peopleAttributeData: [], // 人员属性集合
        textMax: [Validaters.Max(30)],
        selectRequire: [Validaters.SelectValNotNull],
        textRequire: [Validaters.NotNull]
      }
    },
    computed: {
    },
    created() {
      this.getDynamicAttribute() // 获取动态属性
      let registerModelList = this.$store.state.userData.registerModelList
      if (registerModelList.indexOf('IAM_EXTEND') !== -1) { // 注册模块是否含有IAM
        this.showInductionMsg = true
      }
      $axios.get(`/iamUserInfo/getAllDepartLeaderByDepartUuid/${this.data.departUuid}`).then(({data}) => {
        if (data instanceof Array) {
          this.staffList = data;
        }
      });
      // 判断电话号码是否必填
      $axios.get(`/iamUserInfo/getIamSysLoginType`).then(({data}) => {
        if (data === 'true') {
          this.needPhone = true;
        }
      });
    },
    filters: {
      capitalize: (value, flag) => {
        if (!value) return ''
        if (value.length > 3 && !flag) {
          return value.substring(0, 3) + '****' + value.substring((value.length - 4), value.length)
        } else {
          return value
        }
      },
      capitalizeUserWechat: (value, flag) => {
        if (!value) return ''
        if (value.length > 0 && !flag) {
          return value.substring(0, 1) + '******'
        } else {
          return value
        }
      },
      capitalizeUserAddress: (value, flag) => {
        if (!value) return ''
        if (value.length > 0 && !flag) {
          return value.substring(0, 1) + '******'
        } else {
          return value
        }
      },
      capitalizeIdCard: (value, flag) => {
        if (!value) return ''
        if (value.length > 0 && !flag) {
          return value.substring(0, 1) + '****************' + value.substring(17, 18)
        } else {
          return value
        }
      }
    },
    methods: {
      handlerPhone(value) {
        this.phoneClose = true
        if (this.phoneFlag && this.staffForm.userCellphone !== '' && this.staffForm.userCellphone !== null) {
          this.staffForm.userCellphone = ''
          this.phoneFlag = false
        } else {
          this.staffForm.userCellphone = value
        }
      },
      handlerUserWechat(value) {
        this.userWechatClose = true
        if (this.userWechatFlag && this.staffForm.userWechat !== '' && this.staffForm.userWechat !== null) {
          this.staffForm.userWechat = ''
          this.userWechatFlag = false
        } else {
          this.staffForm.userWechat = value
        }
      },
      handlerUserAddress(value) {
        this.userAddressClose = true
        if (this.userAddressFlag && this.staffForm.userAddress !== '' && this.staffForm.userAddress !== null) {
          this.staffForm.userAddress = ''
          this.userAddressFlag = false
        } else {
          this.staffForm.userAddress = value
        }
      },
      handlerIdCard(value) {
        this.idCardClose = true
        if (this.idCardFlag && this.staffForm.idCard !== '' && this.staffForm.idCard !== null) {
          this.staffForm.idCard = ''
          this.idCardFlag = false
        } else {
          this.staffForm.idCard = value
        }
      },
      getDynamicAttribute() { // 获取动态属性
        let vm = this
        $axios.get(`/userProperties/getAll`).then(({data}) => {
          if (data) {
            data.forEach((v) => {
              if (v.editFlag && v.applyFlag) { // 过滤内置和加入弹窗的数
                vm.peopleAttributeData.push(v)
                if (v.internalFlag) { // 如果是内置属性
                  vm.$set(vm.staffForm, v.propertyKey, null)
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
                  vm.$set(vm.staffForm.customProperty, v.propertyKey, null)
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
              }
            });
            this.$nextTick(() => {
              vm.$refs['staffForm1'].clearValidate();
            })
            vm.upLoadUrl = $axios.basePath() + '/fileUpload/uploadUserPhoto'
            if (vm.data.roleUuidsStr === 'er0adc3949ba59abbe56e057f20f883e' || vm.data.roleUuidsStr === 'er0adc3949ba59abbe56e057f20f8838') {
              vm.ruleShow = true
            }
            vm.staffForm = intersectObj(vm.staffForm, vm.data)
            vm.staffForm.userGender = vm.staffForm.userGender === 0 ? '0' : vm.staffForm.userGender !== null ? vm.staffForm.userGender.toString() : null
            vm.editDefaultEmail = vm.staffForm.userMail;
            vm.staffForm.entryTime = vm.staffForm.entryTime ? new Date(vm.staffForm.entryTime * 1000) : null;
            vm.imageUrl = vm.staffForm.userPhotopath || photoUrl
            vm.editDefaultOrderNumber = vm.staffForm.userWorkPosition;
          }
        });
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
