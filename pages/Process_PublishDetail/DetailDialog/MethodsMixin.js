/**
 * Created by caoLiXin on 2018/3/29.
 */
import $axios from 'sunflower-ajax';

export default {
  data() {
    return {
      // 工单分类级别
      categoryLevels: {
        firstLevel: [],
        secondLevel: [],
        thirdLevel: []
      }
    }
  },
  methods: {
    // 获取变更经理组
    getManagerGroup() {
      $axios.get('/itilChangeOrder/getAllChangeMangerGroup').then(({data}) => {
        if (data && data instanceof Array) {
          return data
        }
      });
    },
    // 获取变更经理组下的人员
    getManagerUser(groupId) {
      $axios.get(`/getAllChangeMangerUserByGroup/${groupId}`).then(({data}) => {
        if (data && data instanceof Array) {
          return data
        }
      });
    },
    // 获取变更管理员组
    getAdminGroup() {
      $axios.get('/itilChangeOrder/getAllChangeAdminGroup').then(({data}) => {
        if (data && data instanceof Array) {
          return data
        }
      });
    },
    // 获取变更管理员组下的人员
    getAdminUser(groupId) {
      $axios.get(`/getAllChangeAdminUserByGroup/${groupId}`).then(({data}) => {
        if (data && data instanceof Array) {
          return data
        }
      });
    },
    /**
     * 获取三个级别下拉菜单(参数：事件0;问题1;变更2;任务3;)
     */
    // 分类一级
    getItilCategory(companyUuid) {
      return new Promise((resolve, reject) => {
        $axios.post('/ItilCommonWorkflow/getItilCategorySelect', {
          ownerType: 3,
          companyUuid
        }).then(({data}) => {
          if (data && data instanceof Array) {
            this.categoryLevels.firstLevel = data
            resolve(1)
          } else {
            reject(0)
          }
        })
      })
    },
    // 分类二级
    getSecondCategory(companyUuid, categoryFirst) {
      return new Promise((resolve, reject) => {
        if (categoryFirst) {
          $axios.post(`/ItilCommonWorkflow/getItilCategorySelect`, {
            ownerType: 3,
            companyUuid,
            categoryFirst
          }).then(({data}) => {
            if (data && data instanceof Array) {
              this.categoryLevels.secondLevel = data
              resolve(1)
            } else {
              reject(0)
            }
          })
        } else {
          reject(0)
        }
      })
    },
    // 分类三级
    getThirdCategory(companyUuid, categoryFirst, categorySecond) {
      return new Promise((resolve, reject) => {
        if (categorySecond && categoryFirst) {
          $axios.post(`/ItilCommonWorkflow/getItilCategorySelect`, {
            ownerType: 3,
            companyUuid,
            categoryFirst,
            categorySecond
          }).then(({data}) => {
            if (data && data instanceof Array) {
              this.categoryLevels.thirdLevel = data
              resolve(1)
            } else {
              reject(0)
            }
          })
        } else {
          reject(0)
        }
      })
    }
  }
}
