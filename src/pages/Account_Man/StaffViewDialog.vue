/**
* Created by alex on 2018/10/17.
*/
<template>
  <s-scrollbar wrap-style="max-height:450px;">
    <s-collapse v-model="activeName" accordion>
      <s-collapse-item title="人员信息" name="1">
        <view-module :data="staffList"></view-module>
      </s-collapse-item>
      <s-collapse-item v-if="viewObj.isUser === 1" title="账号信息" name="2">
        <view-module :data="accountList"></view-module>
      </s-collapse-item>
      <s-collapse-item title="入职信息" name="3" v-if="showInductionMsg">
        <view-module :data="entryList"></view-module>
      </s-collapse-item>
    </s-collapse>
  </s-scrollbar>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import viewModule from '@/components/commonView/DialogView'
export default {
  data() {
    return {
      showInductionMsg: false,
      activeName: '1',
      peopleAttributeData: {}, // 人员属性集合
      staffList: [],
      accountList: [],
      entryList: [],
      dataStaffTemplate: {},
      dataAccountTemplate: {
        userLoginName: '账号名称',
        validTime: '口令使用期限',
        userChangePasswdStr: '下次登录修改口令',
        userExpiryDateStr: '账号到期时间',
        roleName: '角色',
        ipType: '规则类型',
        userIpRule: 'IP规则',
        pointTimes: '多点并发数',
        manyTimes: '多次并发数',
        statusName: '状态'
      },
      dataEntryTemplate: {
        idCard: '身份证号码',
        lastEducation: '最高学历',
        lastSchool: '最高学历学校名称',
        entryTimeStr: '入职日期',
        position: '岗位',
        userClassify: '人员类型',
        workLocation: '工作地点'
      },
      education: {
        1: '初中及以下',
        2: '中专/中技',
        3: '高中',
        4: '大专',
        5: '本科',
        6: '硕士',
        7: '博士'
      },
      userClassify: {
        1: '内部人员',
        2: '内部临时',
        3: '职能人员',
        4: '应用人员'
      }
    };
  },
  props: {
    viewObj: {
      type: Object
    }
  },
  created() {
    this.getDynamicAttribute(); // 获取动态属性
    let registerModelList = this.$store.state.userData.registerModelList
    if (registerModelList.indexOf('IAM_EXTEND') !== -1) {
      this.showInductionMsg = true
    }
    let keyArr = Object.keys(this.viewObj)
    for (let key in this.dataEntryTemplate) {
      if (keyArr.indexOf(key) > -1) {
        if (key === 'lastEducation') { // 最高学历 1: 初中及以下 2: 中专/中技 3: 高中 4: 大专 5: 本科 6: 硕士 7: 博士
          let name = this.education[this.viewObj[key]];
          this.entryList.push({name: this.dataEntryTemplate[key], content: name})
        } else if (key === 'entryTimeStr') {
          this.entryList.push({name: this.dataEntryTemplate[key], content: this.viewObj[key] ? this.viewObj[key].substr(0, 10) : ''})
        } else if (key === 'userClassify') {
          let name = this.userClassify[this.viewObj[key]];
          this.entryList.push({name: this.dataEntryTemplate[key], content: name})
        } else {
          this.entryList.push({name: this.dataEntryTemplate[key], content: this.viewObj[key]})
        }
      }
    }
    if (this.viewObj.isUser === 1) {
      for (let key in this.dataAccountTemplate) {
        if (keyArr.indexOf(key) > -1) {
          if (key === 'validTime' && this.viewObj[key] === 0) {
            this.accountList.push({name: this.dataAccountTemplate[key], content: '永不过期'})
          } else if (key === 'userExpiryDateStr' && (this.viewObj[key] === '0')) {
            this.accountList.push({name: this.dataAccountTemplate[key], content: '永不过期'})
          } else {
            if (key === 'ipType') {
              this.viewObj[key] === 0 ? this.accountList.push({name: this.dataAccountTemplate[key], content: '拒绝登录'}) : this.accountList.push({name: this.dataAccountTemplate[key], content: '允许登录'})
            } else {
              this.accountList.push({name: this.dataAccountTemplate[key], content: this.viewObj[key]})
            }
          }
        }
      }
    }
  },
  methods: {
    getDynamicAttribute() { // 获取动态属性
      let vm = this
      $axios.get(`/userProperties/getAll`).then(({data}) => {
        if (data) {
          data.forEach((v) => {
            if (v.applyFlag) { // 过滤内置和加入弹窗的数据
              vm.peopleAttributeData[v.propertyKey] = v.propertyName
            }
          });
        }
        for (let key in vm.peopleAttributeData) { // 整合人员信息数据
          if (key.split('_')[0] === 'custom') {
            vm.staffList.push({name: vm.peopleAttributeData[key], content: vm.viewObj.customProperty[key]})
          } else {
            if (key === 'userGender') { // 如果是性别取userGenderName字段
              vm.staffList.push({name: vm.peopleAttributeData[key], content: vm.viewObj['userGenderName']})
            } else {
              vm.staffList.push({name: vm.peopleAttributeData[key], content: vm.viewObj[key]})
            }
          }
        }
      });
    }
  },
  components: {
    viewModule
  }
}
</script>
