<template>
  <div class="userInfo">
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">真实姓名</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.userRealName}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">所属机构</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.departName}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">Email</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.userMail}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">手机号</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.userCellphone | capitalize(phoneClose)}}</div>
        <span class="show-or-hidden">
          <i class="iconfont" :class="phoneClose?'icon-open-eye':'icon-close-eye'"
             @click="phoneClose=!phoneClose" style="position: absolute;right: 10px;"></i>
        </span>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">个人地址</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.userAddress | capitalizeUserAddress(userAddressClose)}}</div>
        <span class="show-or-hidden">
          <i class="iconfont" :class="userAddressClose?'icon-open-eye':'icon-close-eye'"
             @click="userAddressClose=!userAddressClose" style="position: absolute;right: 10px;"></i>
        </span>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">备注</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" style="word-wrap: break-word;">{{data.remark}}</div>
      </s-col>
    </s-row>
    <!--动态属性-->
    <s-row v-for="item in peopleAttributeData" :key="item.uuid">
      <s-col :span="10">
        <div class="grid-content bg-purple">{{item.propertyName}}</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-if="item.internalFlag && item.propertyName !== '微信号'">{{data[item.propertyKey]}}</div>
        <div class="grid-content bg-purple-light" v-else-if="item.internalFlag && item.propertyName === '微信号'">
          <s-col :span="20">{{data[item.propertyKey] | capitalizeUserWechat(userWechatClose)}}</s-col>
          <s-col :span="4">
              <i class="iconfont" :class="userWechatClose?'icon-open-eye':'icon-close-eye'"
                 @click="userWechatClose=!userWechatClose" style="position: absolute;right: 10px;"></i>
          </s-col>
        </div>
        <div class="grid-content bg-purple-light" v-else>{{data.customProperty[item.propertyKey]}}</div>
      </s-col>
    </s-row>

    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">账号名称</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.userLoginName}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">登录方式</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.loginType}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">口令使用期限</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.validTime | unitFilter}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">角色</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.roleName}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">岗位</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.position}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">账号到期时间</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.userExpiryDateStr | dateFilter}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">规则类型</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.ipType | ipTypeFilter}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">IP规则</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.userIpRule}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">多点并发数</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.pointTimes}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">多次并发数</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.manyTimes}}</div>
      </s-col>
    </s-row>
    <div v-if="showInductionMsg">
      <s-row>
        <s-col :span="10">
          <div class="grid-content bg-purple">身份证号码</div>
        </s-col>
        <s-col :span="14">
          <div class="grid-content bg-purple-light">{{data.idCard | capitalizeIdCard(idCardClose)}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="10">
          <div class="grid-content bg-purple">最高学历</div>
        </s-col>
        <s-col :span="14">
          <div class="grid-content bg-purple-light">{{education[data.lastEducation]}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="10">
          <div class="grid-content bg-purple">最高学历学校名称</div>
        </s-col>
        <s-col :span="14">
          <div class="grid-content bg-purple-light">{{data.lastSchool}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="10">
          <div class="grid-content bg-purple">入职时间</div>
        </s-col>
        <s-col :span="14">
          <div class="grid-content bg-purple-light">{{data.entryTimeStr?data.entryTimeStr.substr(0,10) : ''}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="10">
          <div class="grid-content bg-purple">岗位</div>
        </s-col>
        <s-col :span="14">
          <div class="grid-content bg-purple-light">{{data.position}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="10">
          <div class="grid-content bg-purple">人员类型</div>
        </s-col>
        <s-col :span="14">
          <div class="grid-content bg-purple-light">{{userClassify[data.userClassify]}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="10">
          <div class="grid-content bg-purple">工作地点</div>
        </s-col>
        <s-col :span="14">
          <div class="grid-content bg-purple-light">{{data.workLocation}}</div>
        </s-col>
      </s-row>
    </div>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { cloneDeep } from 'lodash';
  export default {
    name: 'UserInfo',
    data() {
      return {
        phoneClose: false,
        userAddressClose: false,
        userWechatClose: false,
        idCardClose: false,
        peopleAttributeData: [],
        showInductionMsg: false,
        userClassify: {
          1: '内部人员',
          2: '内部临时',
          3: '职能人员',
          4: '应用人员'
        },
        education: {
          1: '初中及以下',
          2: '中专/中技',
          3: '高中',
          4: '大专',
          5: '本科',
          6: '硕士',
          7: '博士'
        }
      }
    },
    created() {
      this.getDynamicAttribute(); // 获取动态属性
      let registerModelList = this.$store.state.userData.registerModelList
      if (registerModelList.indexOf('IAM_EXTEND') !== -1) { // 注册模块是否含有IAM
        this.showInductionMsg = true
      }
    },
    props: {
      data: {
        type: Object,
        default: () => {
          return {}
        }
      }
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
      },
      unitFilter(n) {
        if (n <= 0) {
          return '永久使用'
        } else {
          return n + '天'
        }
      },
      dateFilter(n) {
        if (n.substr(0, 4) === '1970') {
          return '无过期时间'
        } else {
          return n
        }
      },
      ipTypeFilter(val) {
        return val ? '允许登录' : '拒绝登录'
      }
    },
    methods: {
      getDynamicAttribute() { // 获取动态属性
        let vm = this
        $axios.get(`/userProperties/getAll`).then(({data}) => {
          if (data) {
            let newArr = cloneDeep(data)
            newArr.forEach((v) => {
              if (v.editFlag && v.applyFlag) { // 过滤内置和加入弹窗的数据
                if (v.propertyKey === 'userGender') {
                  v.propertyKey = 'userGenderName'
                }
                vm.peopleAttributeData.push(v)
              }
            });
          }
        });
      }
    }
  }
</script>
<style>
  .show-or-hidden{
    float: right;
    margin-top: -26px;
    margin-right: 10px;
  }
</style>
