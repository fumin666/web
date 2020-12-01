<template>
  <s-scrollbar wrap-style="max-height:450px;">
    <s-collapse v-model="activeName" accordion>
      <s-collapse-item title="人员信息" name="1">
        <s-form :model="staffForm" :rules="staffRule" ref="staffForm1" label-width="130px"  class="custom-form">
          <s-row type="flex" justify="between">
            <s-col span="18">
              <s-form-item label="真实姓名" prop="userRealName">
                <s-input v-model="staffForm.userRealName"></s-input>
              </s-form-item>
              <s-form-item label="所属机构" prop="departUuid">
                <s-select style="width: 100%" v-model="staffForm.departUuid" filterable placeholder="请选择所属机构">
                  <s-option v-for="depart in departOptions" :label="depart.departName" :value="depart.uuid"
                            :key="depart.uuid"></s-option>
                </s-select>
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
              <img width="120px" height="120px" style="margin: 10px 0 0 10px;border-radius: 50%" v-if="imageUrl" :src="imageUrl"
                   class="avatar">
              <s-upload ref="upload" :action="upLoadUrl" :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload" :show-file-list="false">
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
                  :clearable="true"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="date"
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
                  :clearable="true"
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

      <s-collapse-item v-if="editObj.isUser === 1 && showAccount" title="账号信息" name="2">
        <s-form :model="staffForm" :rules="staffRule" ref="staffForm2" label-width="130px">
          <s-form-item label="账号名称" prop="userLoginName">
            <s-input v-model="staffForm.userLoginName"></s-input>
          </s-form-item>
          <s-form-item label="登录方式" v-if="loginTypeShow" prop="loginTypeUuid">
            <s-select style="width: 250px" v-model="staffForm.loginTypeUuid" placeholder="请登录方式"
                      @change="handlerChange">
              <s-option v-for="item in loginTypeList" :label="item.loginType" :value="item.uuid"
                        :key="item.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="口令使用期限" prop="validTime" class="validTime">
            <div style="float: left">
              <s-input-number style="width: 250px" v-model="staffForm.validTime" :min="0" :max="1000000000"
                              :disabled="staffForm.validTime===0"></s-input-number>
            </div>
            <div style="float: left;margin-left: 8px;line-height: 30px">
              <span class="unit">天</span>
              <s-checkbox v-model="staffForm.validTime" :true-label="0" :false-label="1">永久使用</s-checkbox>
            </div>
          </s-form-item>
          <s-form-item label="下次登录修改口令">
            <s-radio-group v-model="staffForm.userChangePasswd">
              <s-radio :label="1">是</s-radio>
              <s-radio :label="0">否</s-radio>
            </s-radio-group>
          </s-form-item>
          <s-form-item label="账号到期时间" prop="userExpiryDateStr">
            <s-date-picker style="width: 250px"
                           class="fl"
                           type="datetime"
                           :editable="false"
                           clearable
                           :disabled="neveCheckValue"
                           value-format="yyyy-MM-dd HH:mm:ss"
                           format="yyyy-MM-dd HH:mm:ss"
                           placeholder="选择日期"
                           :picker-options="pickerOptions"
                           v-model="staffForm.userExpiryDateStr"></s-date-picker>
            <div style="float: left;margin-left: 8px; line-height: 36px">
              <s-checkbox v-model="neveCheckValue" @change="neveCheck">永不过期</s-checkbox>
            </div>
          </s-form-item>
          <s-form-item label="角色" prop="sysRoleUuidList">
            <s-select style="width: 250px" v-model="staffForm.sysRoleUuidList" @change="roleChange" filterable collapse-tags multiple clearable
                      placeholder="请选择角色">
              <s-option v-for="role in roleOptions" :label="role.roleName" :value="role.uuid"
                        :key="role.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="规则类型" prop="ipType" class="ip-rule-box">
            <s-select style="width: 200px" v-model="staffForm.ipType" placeholder="请选择规则">
              <s-option label="允许登录" :value="1"></s-option>
              <s-option label="拒绝登录" :value="0"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="IP规则" prop="userIpRule">
            <s-input v-model="staffForm.userIpRule"  type='textarea' :rows="3" style="width: 455px"></s-input>
            <s-tooltip class="tip"
                       content="支持对IPV4和IPV6地址进行限制。多个IP(段)以英文逗号分割(例如: *, 192.168.1.*, 192.168.[2,3].[1-5,15,25,35,45],FF01::101, FF01::101-FF01::AC01); '*'或不填表示不对登录IP地址做限制"
                       placement="right">
              <i class="iconfont icon-help"></i>
            </s-tooltip>
          </s-form-item>
          <s-form-item label="多点并发数" prop="pointTimes">
            <s-input v-model="staffForm.pointTimes" style="width: 95%"></s-input>
            <s-tooltip class="tip" content="该字段标识了同一账号在同一资产上可登录的浏览器个数;'*'或不填表示不对多点并发数做限制" placement="right">
              <i class="iconfont icon-help"></i>
            </s-tooltip>
          </s-form-item>
          <s-form-item label="多次并发数" prop="manyTimes">
            <s-input v-model="staffForm.manyTimes" style="width: 95%"></s-input>
            <s-tooltip class="tip" content="该字段标识了同一账号在不同资产上可登录的个数;'*'或不填表示不对多次并发数做限制" placement="right">
              <i class="iconfont icon-help"></i>
            </s-tooltip>
          </s-form-item>
          <s-form-item label="状态">
            <s-select style="width: 250px" v-model="staffForm.userStatus" @change="changeStatus">
              <s-option v-for="item in status" :label="item.name" :value="item.val" :key="item.id"></s-option>
            </s-select>
          </s-form-item>
        </s-form>
      </s-collapse-item>

      <s-collapse-item title="入职信息" name="3" v-if="showInductionMsg">
        <s-form :model="staffForm" :rules="staffRule" ref="staffForm3" label-width="135px">
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
              placeholder="选择日期"
              @change="getStartDate">
            </s-date-picker>
          </s-form-item>
          <s-form-item label="岗位" prop="position">
            <s-input v-model="staffForm.position"></s-input>
          </s-form-item>
          <s-form-item label="人员类型" prop="userClassify">
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
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters, parseNumAllTime, intersectObj} from 'sunflower-common-utils';
  import {indexOf, difference} from 'lodash';

  const photoUrl = 'static/images/system/UserPhoto.png'

  export default {
    data() {
      let validatorNum = function (rule, value, callback) {
        if (value.trim() === '*') {
          callback();
          return;
        }
        ;
        if (Validaters.isNum(value)) {
          callback();
        } else {
          callback(new Error(`只能填写数字`));
        }
      };
      let checkRepeatName = (rule, value, callback) => {
        if (value !== this.editDefaultName) {
          if (value) {
            let validParam = {
              name: value,
              uuid: this.staffForm.uuid
            };
            $axios.post(`/iamUserInfo/nameValidate`, validParam).then(({data}) => {
              if (data === 'true') {
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
      // 校验正整数(包含0)
      let checkInt = (rule, value, callback) => {
        if (value || value === 0) {
          let reg = /^([1-9]\d*|[0]{1,1})$/;
          if (!reg.test(value)) {
            callback(new Error('请输入正整数值'));
          } else {
            callback();
          }
        } else {
          callback(new Error('不能为空'));
        }
      };
      return {
        phoneClose: false, // 眼睛展开还是关闭
        phoneFlag: true, // 标志位，第一次输入的时候清空，后面都不会清空
        userAddressClose: false,
        userWechatClose: false,
        userAddressFlag: true,
        userWechatFlag: true,
        idCardClose: false,
        idCardFlag: true,
        showInductionMsg: false,
        neveCheckValue: false, // 永不过期开关
        flag: 0,
        activeName: '1',
        departOptions: [],
        roleOptions: [],
        status: [
          {name: '激活', val: 1},
          {name: '未激活', val: 0},
          {name: '锁定', val: 2},
          {name: '注销', val: 3},
          {name: '待开启', val: 5},
          {name: '离职', val: 7}
        ],
        staffForm: {
          uuid: '',
          userRealName: '',
          userGender: '',
          departUuid: '',
          userMail: '',
          userCellphone: '',
          userChangePasswd: 1, // 下次登录修改口令
          userAddress: '',
          position: '',
          remark: '',
          userWechat: '',
          userPhotopath: '',
          userLoginName: '',
          validTime: '',
          loginTypeUuid: '',
          sysRoleUuidList: [],
          userExpiryDateStr: null,
          userIpRule: '*',
          pointTimes: '*',
          manyTimes: '*',
          userStatus: '',
          ipType: 1,
          userClassify: 1, // 人员类型 1:内部人员
          idCard: '', // 身份证号码
          lastEducation: 5, // 最高学历 5：本科
          lastSchool: '', // 最高学历学校名称
          directLeader: '', // 直接汇报领导人
          entryTime: null, // int型，精确到秒
          workLocation: '', // 工作地点
          customProperty: {} // 自定义属性值列表(input v-model的变量)
        },
        staffRule: {
          userRealName: [
            Validaters.NotNull,
            Validaters.Name,
            Validaters.Max(30)
          ],
          departUuid: [Validaters.NotNull],
          userExpiryDateStr: [Validaters.NotNull],
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
          userWorkPosition: [
            {validator: checkWorkPosition, trigger: 'blur'}
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
          validTime: [Validaters.NotNull, {validator: checkInt, trigger: 'blur'}],
          remark: [Validaters.Max(120)],
          loginTypeUuid: [
            Validaters.NotNull
          ],
          userLoginName: [
            Validaters.NotNull,
            Validaters.Max(30),
            {
              pattern: /^[a-zA-Z0-9_\-\.$][a-zA-Z0-9_\-\.@\\$]{0,29}$/,
              message: '只能由字母、数字、符号[_-.@\\$]构成,不能以[@,\\]开头',
              trigger: 'blur'
            },
            {validator: checkRepeatName, trigger: 'blur'}
          ],
          sysRoleUuidList: [{type: 'array', required: true, message: '不能为空', trigger: 'change'}],
          userIpRule: [
            Validaters.OMAIP
          ],
          pointTimes: [
            {validator: validatorNum, trigger: 'blur'}
          ],
          manyTimes: [
            {validator: validatorNum, trigger: 'blur'}
          ],
          idCard: [
            {
              pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
              message: '请输入正确的身份证号码',
              trigger: 'blur'
            },
            {trigger: 'blur', message: '请输入数字'}
          ],
          userClassify: [Validaters.SelectValNotNull],
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
        loginTypeShow: false,
        loginTypeList: [],
        editDefaultName: '',
        editDefaultEmail: '',
        editDefaultOrderNumber: '',
        upLoadUrl: $axios.basePath() + '/fileUpload/uploadUserPhoto',
        imageUrl: photoUrl,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
          }
        },
        staffList: [],
        peopleAttributeData: [], // 人员属性集合
        textMax: [Validaters.Max(30)],
        selectRequire: [Validaters.SelectValNotNull],
        textRequire: [Validaters.NotNull],
        staffForm_sysrole_temp: []
      }
    },
    props: {
      editObj: {
        type: Object
      },
      curUuid: {
        type: String
      },
      isEdit: {
        type: Boolean,
        default: true
      },
      showAccount: {
        type: Boolean,
        default: true
      }
      // staffList: {
      //   type: Array
      // }
    },
    created() {
      this.getDynamicAttribute(); // 获取动态属性
      let registerModelList = this.$store.state.userData.registerModelList
      if (registerModelList.indexOf('IAM_EXTEND') !== -1) {
        this.showInductionMsg = true
      }
      if (!this.staffForm.validTime && this.staffForm.validTime !== 0) this.staffForm.validTime = 7;
      $axios.get('/iamUserInfo/getRoleList').then(({data}) => {
        this.roleOptions = data
      });
      $axios.get(`/iamUserInfo/getDepartList`).then(({data}) => {
        this.departOptions = data;
      });
      $axios.get('/login/isGoogleAuthLoginType').then(({data}) => {
        if (data) {
          if (this.editObj.userStatus === 1) {
            this.status = [
              {name: '激活', val: 1},
              {name: '待开启', val: 5},
              {name: '未激活', val: 0},
              {name: '锁定', val: 2},
              {name: '注销', val: 3},
              {name: '离职', val: 7}
            ];
            // this.staffForm.userStatus = 1
          } else {
            this.status = [
              {name: '待开启', val: 5},
              {name: '未激活', val: 0},
              {name: '锁定', val: 2},
              {name: '注销', val: 3},
              {name: '离职', val: 7}
            ];
            // this.staffForm.userStatus = 5
          }
        } else {
          $axios.post('/sysLoginType/getDoubleLoginType').then((res) => {
            let SysDoubleType = res.data.SysDoubleType
            if ((this.staffForm.loginTypeUuid === 'tsyslogininit0000000000000000011') || ((this.staffForm.loginTypeUuid === 'tsyslogininit0000000000000000002') && ((SysDoubleType.firstUuid === 'tsyslogininit0000000000000000011') || (SysDoubleType.secondUuid === 'tsyslogininit0000000000000000011')))) {
              if (this.editObj.userStatus === 1) {
                this.status = [
                  {name: '激活', val: 1},
                  {name: '待开启', val: 5},
                  {name: '未激活', val: 0},
                  {name: '锁定', val: 2},
                  {name: '注销', val: 3},
                  {name: '离职', val: 7}
                ];
                // this.staffForm.userStatus = 1
              } else {
                this.status = [
                  {name: '待开启', val: 5},
                  {name: '未激活', val: 0},
                  {name: '锁定', val: 2},
                  {name: '注销', val: 3},
                  {name: '离职', val: 7}
                ];
                // this.staffForm.userStatus = 5
              }
            } else {
              this.status = [
                {name: '激活', val: 1},
                {name: '未激活', val: 0},
                {name: '锁定', val: 2},
                {name: '注销', val: 3},
                {name: '离职', val: 7},
                {name: '过期', val: 6}
              ];
            }
          })
        }
      });
      $axios.get('/iamUserInfo/getMixloginTypeList').then(response => {
        this.loginTypeList = response.data;
      });
      $axios.get('/sysLoginType/isMixloginType').then(response => {
        this.loginTypeShow = response.data;
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
      capitalizeUserAddress: (value, flag) => {
        if (!value) return ''
        if (value.length > 0 && !flag) {
          return value.substring(0, 1) + '******'
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
      roleChange(arr) {
        if (this.editObj.isAuthedAdmin === 1) { // 如果是授权管理员，不能移除系统管理员角色
          let diff = difference(this.staffForm_sysrole_temp, this.staffForm.sysRoleUuidList);
          if (diff.length === 1 && diff[0] === 'tsecondroleinfo00000000000000042') { // 系统管理员角色
            this.$message({
              message: '授权管理员，不能移除系统管理员角色!',
              type: 'warning'
            });
            this.staffForm.sysRoleUuidList = [...this.staffForm_sysrole_temp];
            this.$refs.staffForm2.validateField('sysRoleUuidList')
          } else if (diff.length > 1 && diff.includes('tsecondroleinfo00000000000000042')) {
            this.$message({
              message: '授权管理员，不能移除系统管理员角色!',
              type: 'warning'
            });
            this.staffForm.sysRoleUuidList = ['tsecondroleinfo00000000000000042'];
            this.staffForm_sysrole_temp = [...this.staffForm.sysRoleUuidList]
            this.$refs.staffForm2.validateField('sysRoleUuidList')
          } else {
            this.staffForm_sysrole_temp = [...this.staffForm.sysRoleUuidList]
          }
        }
      },
      handlerPhone(value) {
        this.phoneClose = true
        if (this.phoneFlag && this.staffForm.userCellphone !== '' && this.staffForm.userCellphone !== null) {
          this.staffForm.userCellphone = ''
          this.phoneFlag = false
        } else {
          this.staffForm.userCellphone = value
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
      handlerUserWechat(value) {
        this.userWechatClose = true
        if (this.userWechatFlag && this.staffForm.userWechat !== '' && this.staffForm.userWechat !== null) {
          this.staffForm.userWechat = ''
          this.userWechatFlag = false
        } else {
          this.staffForm.userWechat = value
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
            vm.staffForm = intersectObj(vm.staffForm, vm.editObj)
            vm.staffForm.userGender = vm.staffForm.userGender === 0 ? '0' : vm.staffForm.userGender !== null ? vm.staffForm.userGender.toString() : null
            vm.staffForm_sysrole_temp = [...vm.editObj.sysRoleUuidList];
            vm.staffForm.entryTime = vm.staffForm.entryTime ? new Date(vm.staffForm.entryTime * 1000) : null;
            vm.imageUrl = vm.staffForm.userPhotopath || photoUrl
            vm.editDefaultName = vm.editObj.userLoginName;
            vm.editDefaultEmail = vm.editObj.userMail;
            vm.editDefaultOrderNumber = vm.editObj.userWorkPosition;
            if (vm.staffForm.userExpiryDateStr === '0') {
              vm.staffForm.userExpiryDateStr = 0
              vm.neveCheckValue = true
            } else {
              vm.neveCheckValue = false
            }
          }
        });
      },
      neveCheck(val) { // 永不过期控制
        this.staffForm.userExpiryDateStr = val ? 0 : null
      },
      handlerChange(val) {
        $axios.post('/sysLoginType/getDoubleLoginType').then((res) => {
          let SysDoubleType = res.data.SysDoubleType
          if ((val === 'tsyslogininit0000000000000000008') || ((val === 'tsyslogininit0000000000000000002') && ((SysDoubleType.firstUuid === 'tsyslogininit0000000000000000008') || (SysDoubleType.secondUuid === 'tsyslogininit0000000000000000008')))) {
            this.needPhone = true
          } else {
            this.needPhone = false
          }
          if ((val === 'tsyslogininit0000000000000000011') || ((val === 'tsyslogininit0000000000000000002') && ((SysDoubleType.firstUuid === 'tsyslogininit0000000000000000011') || (SysDoubleType.secondUuid === 'tsyslogininit0000000000000000011')))) {
            if (this.staffForm.userStatus === 1) {
              this.status = [
                {name: '激活', val: 1},
                {name: '待开启', val: 5},
                {name: '未激活', val: 0},
                {name: '锁定', val: 2},
                {name: '注销', val: 3},
                {name: '离职', val: 7}
              ];
            } else {
              this.status = [
                {name: '待开启', val: 5},
                {name: '未激活', val: 0},
                {name: '锁定', val: 2},
                {name: '注销', val: 3},
                {name: '离职', val: 7}
              ];
              this.staffForm.userStatus = 5
            }
          } else {
            this.status = [
              {name: '激活', val: 1},
              {name: '未激活', val: 0},
              {name: '锁定', val: 2},
              {name: '注销', val: 3},
              {name: '离职', val: 7}
            ];
            this.staffForm.userStatus = 1
          }
        })
      },
      getStartDate(val) {
        if (!val) {
          this.$refs['staffForm'].clearValidate('entryTime')
        }
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
      },
      changeStatus() {
        if (this.staffForm.userStatus === 6) {
          this.neveCheckValue = false
          this.staffForm.userExpiryDateStr = parseNumAllTime(Date.parse(new Date()) / 1000)
        } else if (this.staffForm.userStatus === 1) {
          this.neveCheckValue = true
          this.staffForm.userExpiryDateStr = 0
        }
      }
    },
    watch: {
      needPhone(val) {
        if (val) {
          this.staffRule.userCellphone.push(Validaters.NotNull)
        } else {
          this.staffRule.userCellphone.splice((this.staffRule.userCellphone.length - 1), 1)
        }
      },
      'staffForm.departUuid': function (val) {
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
<style>
  #rowsy1 {
    margin-left: 28px
  }

  #rowsy2 {
    margin-left: 28px
  }
</style>
