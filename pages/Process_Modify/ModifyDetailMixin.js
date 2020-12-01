import DetailUploadDialog from './DetailDialog/DetailUploadDialog.vue';
import $axios from 'sunflower-ajax';
export default {
  data() {
    return {
      uploadDialogFlag: false
    }
  },
  computed: {
    loginUserId() {
      return this.$store.state.userData.uuid
    }
  },
  methods: {
    showUploadDialog() {
      this.uploadDialogFlag = true;
    },
    createTaskHandle() {
      this.createDialog = true
    },
    cancelHandle() {
      this.cancelDialog = true
    },
    // 获取三个级别下拉菜单(参数：事件0;问题1;变更2;任务3;)
    getItilCategory(ownerType, companyUuid) {
      return $axios.post(`/ItilCommonWorkflow/getItilCategorySelect`, {
        ownerType: ownerType,
        companyUuid: companyUuid
      }).then(({data}) => {
        if (data instanceof Array && data.length > 0) {
          this.categoryFirstList = data
        }
      });
    },
    getSecondCategory(ownerType, companyUuid, categoryFirst) {
      return $axios.post(`/ItilCommonWorkflow/getItilCategorySelect`, {
        ownerType: ownerType,
        companyUuid: companyUuid,
        categoryFirst: categoryFirst
      }).then(({data}) => {
        if (data instanceof Array && data.length > 0) {
          this.categorySecondList = data
        }
      })
    },
    getThirdCategory(ownerType, companyUuid, categoryFirst, categorySecond) {
      return $axios.post(`/ItilCommonWorkflow/getItilCategorySelect`, {
        ownerType: ownerType,
        companyUuid: companyUuid,
        categoryFirst: categoryFirst,
        categorySecond: categorySecond
      }).then(({data}) => {
        if (data instanceof Array && data.length > 0) {
          this.categoryThirdList = data
        }
      })
    },
    /**
     * 判断任务单指派与取消功能的可用性
     * @param data    [当前任务单的详情数据]
     */
    judgeAssignCancel(data) {
      // 返回结果初始化
      let loginUserId = this.loginUserId      // 登录用户id
      let loginThreeJudge = (loginUserId === data.assignUser || loginUserId === data.changeManagerUser || loginUserId === data.changeAdminUser)
      // 当前变更状态是正在执行
      if (data.changeStatus === 6) {
        // 当前用户 !== 流程提交人 && 当前用户 !== 任务受派人
        if (loginUserId !== data.createUser && !loginThreeJudge) {
          return {assign: true, cancel: true}
        } else if (loginUserId === data.createUser && !loginThreeJudge) {
          // 当前用户 === 流程提交人 && 当前用户 !== 任务受派人
          if (data.taskStatus === 1) {
            return {assign: false, cancel: true}
          } else {
            return {assign: true, cancel: true}
          }
        } else if (loginThreeJudge && loginUserId !== data.createUser) {
          // 当前用户=== 任务受派人 && 当前用户 !== 流程提交人
          switch (data.taskStatus) {
            case 1:
            case 4:
            case 5:
            case 6:
              return {assign: true, cancel: true}
            case 2:
            case 3:
              return {assign: false, cancel: false}
          }
        } else if (loginUserId === data.createUser && loginThreeJudge) {
          // 当前用户 === 流程提交人 && 当前用户 === 任务受派人
          switch (data.taskStatus) {
            case 1:
              return {assign: false, cancel: true}
            case 2:
            case 3:
              return {assign: false, cancel: false}
            case 4:
            case 5:
            case 6:
              return {assign: true, cancel: true}
          }
        }
      } else {
        // 当前用户 === 流程提交人
        return {assign: true, cancel: true}
      }
    }
  },
  watch: {
    'orderForm.categoryFirst': {
      deep: true,
      handler(val) {
        if (!this.inited) {
          return
        }
        if (val) {
          this.getSecondCategory(2, this.orderForm.companyUuid, val).then(() => {
            this.categoryThirdList = []
            this.orderForm.categorySecond = ''
            this.orderForm.categoryThird = ''
          })
        }
      }
    },
    'orderForm.categorySecond': {
      deep: true,
      handler(val) {
        if (!this.inited) {
          return
        }
        if (this.orderForm.categoryFirst && val) {
          this.getThirdCategory(2, this.orderForm.companyUuid, this.orderForm.categoryFirst, val).then(() => {
            this.orderForm.categoryThird = ''
          })
        }
      }
    }
  },
  components: {
    DetailUploadDialog
  }
}
