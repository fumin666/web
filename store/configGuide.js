/*
 * @Author: mybells
 * @Version://Q1UE问题优化
 * @Description:初次安装superadmin登录向导
 * @Date: 2020-02-17 12:25:36
 * @LastEditors: mybells
 */
// 首次登录配置向导
import $axios from 'sunflower-ajax'
import { superAdminName } from 'sunflower-common-utils'

const configGuide = {
  namespaced: true,
  state: {
    // 配置向导步骤and状态
    activeStep: null, // 当前step
    firstLogin: false, // 是否初次登录
    register: false, // 是否重新激活注册
    step1: null, // 更改密码
    step2: null, // 产品注册
    step3: null, // 更新组织
    step4: null// 授权管理员
  },
  mutations: {
    SET_ACTIVESTEP(state, payload) {
      state.activeStep = payload;
    },
    SET_ISCOMPLETE(state, payload) {
      state.firstLogin = payload;
    },
    SET_REGISTER(state, payload) {
      state.register = payload;
    },
    SET_STEP1(state, payload) {
      state.step1 = payload;
    },
    SET_STEP2(state, payload) {
      state.step2 = payload;
    },
    SET_STEP3(state, payload) {
      state.step3 = payload;
    },
    SET_STEP4(state, payload) {
      state.step4 = payload;
    }
  },
  actions: {
    getConfigGuide({state, commit, rootGetters}) {
      return new Promise(function (resolve, reject) {
        if (rootGetters.userName === superAdminName) {
          if (state.activeStep) {
            resolve(state.firstLogin);
          } else {
            $axios.post('/firstUsageWizard/judgeSuperadminLoginTime', {userLoginName: rootGetters.userName}).then(function (res) {
              commit('SET_ACTIVESTEP', res.data.step + 1);
              commit('SET_ISCOMPLETE', res.data.firstLogin);
              commit('SET_REGISTER', res.data.register);
              resolve(res.data.firstLogin)
            }).catch((err) => {
              console.log(err);
              reject(err)
            })
          }
        } else {
          resolve(false);
        }
      })
    }
  }
};
export default configGuide;
