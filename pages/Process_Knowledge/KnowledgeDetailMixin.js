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
          this.getSecondCategory(4, this.orderForm.companyUuid, val).then(() => {
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
          this.getThirdCategory(4, this.orderForm.companyUuid, this.orderForm.categoryFirst, val).then(() => {
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
