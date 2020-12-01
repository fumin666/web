import $axios from 'sunflower-ajax';
import { delDiffArray, Validaters } from 'sunflower-common-utils'

export default {
  data() {
    let vm = this;
    let checkisPeriodicTask = (rule, value, callback) => {
      if (value === 0 || value === 1) {
        if (value === 0) {
          callback();
        } else {
          let reg = /^\d+$/;
          if (!reg.test(vm.generateForm.day)) {
            callback(new Error(`请输入天数`));
          } else {
            if (vm.generateForm.day > 0) {
              callback();
            } else {
              callback(new Error(`请输入天数`));
            }
          }
        }
      } else {
        callback(new Error('不能为空！'));
      }
    };
    let checkinputNum = (rule, value, callback) => {
      if (value === 'defined') {
        let reg = /^\d+$/;
        if (!reg.test(vm.generateForm.defined)) {
          callback(new Error(`请输入导出条数`));
        } else {
          if (vm.generateForm.defined <= 200000) {
            callback();
          } else {
            callback(new Error(`不能超过200000条`));
          }
        }
      } else {
        callback();
      }
    };
    let checkEmail = (rule, value, callback) => {
      if (value.length) {
        callback()
      } else {
        callback(new Error('至少添加一条信息'));
      }
    };
    return {
      selectionDelEmail: [],
      bloomEmail: false,
      bloomUser: false,
      userList: [],
      hasSelectUser: [],
      generateForm: {
        isPeriodicTask: null,
        day: null,
        inputNum: 'all',
        defined: null,
        tReportSendTaskNotices: []
      },
      generateRules: {
        isPeriodicTask: [{validator: checkisPeriodicTask, trigger: 'change'}, Validaters.SelectValNotNull],
        inputNum: [{validator: checkinputNum, trigger: 'change'}, Validaters.SelectValNotNull],
        tReportSendTaskNotices: [{validator: checkEmail, trigger: 'change'}, Validaters.SelectValNotNull]
      }
    }
  },
  computed: {
    styleInput() {
      if (this.generateForm.inputNum === 'defined') {
        return {width: '100px'}
      } else {
        return {width: '300px'}
      }
    },
    styleTask() {
      if (this.generateForm.isPeriodicTask === 1) {
        return {width: '100px'}
      } else {
        return {width: '300px'}
      }
    }
  },
  methods: {
    getUsers() {
      $axios.post('/iamUserInfo/list', {}).then((res) => {
        if (res.data && res.data instanceof Array) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].userUuid = res.data[i].uuid;
            res.data[i].userPhone = res.data[i].userCellphone;
          }
          this.userList = res.data;
        }
      });
    },
    showMyEmail() {
      this.bloomEmail = true
    },
    linkEmail() {
      this.hasSelectUser = this.generateForm.tReportSendTaskNotices
      this.bloomUser = true
    },
    myEmailOk() {
      this.$refs.myEmail.$refs.myEmailForm.validate((valid) => {
        if (valid) {
          this.generateForm.tReportSendTaskNotices.unshift(this.$refs.myEmail.myEmailForm);
          this.$refs.generateForm.clearValidate('tReportSendTaskNotices')
          this.bloomEmail = false;
        } else {
          return false;
        }
      });
    },
    myUserOk() {
      let userData = this.$refs['myUser'].$refs['myUserList'].getAllSelectedData();
      let arr = [];
      for (let obj of userData) {
        let flag = true;
        for (let obj2 of this.generateForm.tReportSendTaskNotices) {
          if (obj2.userUuid) {
            if (obj2.userUuid === obj.userUuid) {
              flag = false;
              break;
            }
          }
        }
        if (flag) {
          arr.push(obj);
        }
      }
      this.generateForm.tReportSendTaskNotices = arr.concat(this.generateForm.tReportSendTaskNotices)
      this.$refs.generateForm.clearValidate('tReportSendTaskNotices')
      this.bloomUser = false;
    },
    handleEmailSelect(val) {
      this.selectionDelEmail = val;
    },
    delEmailList() {
      if (this.selectionDelEmail.length < 1) {
        this.$message({
          type: 'info',
          message: '请选择要删除的数据'
        });
      } else {
        this.$confirm('是否删除引用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delDiffArray(this.generateForm.tReportSendTaskNotices, this.selectionDelEmail);
          this.$refs.generateForm.validateField('tReportSendTaskNotices');
        }).catch(() => {});
      }
    },
    // 表内操作列功能初始化
    getRowActionsDef() {
      let vm = this;
      if (this.isAdd !== 'eye') {
        return [{
          name: '删除',
          icon: 'delete',
          click: (row) => {
            vm.$confirm('是否删除引用?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              delDiffArray(vm.generateForm.tReportSendTaskNotices, [row]);
              this.$refs.generateForm.validateField('tReportSendTaskNotices');
            }).catch(() => {});
          }
        }]
      } else {
        return [];
      }
    }
  }
}
