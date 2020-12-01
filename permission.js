import router from './router'
import store from './store'
import Sunflower from 'vue-sunflower'
import { cloneDeep } from 'lodash'
import {sysAdminUserName, superAdminName} from 'sunflower-common-utils'
let Load = null
router.beforeEach(function (to, from, next) {
  // 移除所有echarts重绘事件
  Sunflower.EventBus.$off('rebuild');
  if (to.path === from.path || from.path === '/') {
    Load = Sunflower.Loading.service({text: 'loading...'})
  }
  if (to.path !== from.path && from.path !== '/') {
    Sunflower.LoadingBar.start()
  }
  //  判断是否有token和uuid
  if (localStorage.getItem('userName')) {
    // 从storge中获取基本信息
    store.commit('SET_TOKEN')
    if ((to.path === '/login' || to.path === '/') && store.getters.index) {
      next(store.getters.index)
    } else {
      if (to.path === '/login') {
        next('/')
      } else if (to.name === '404') {
        let fullPath = router.getFullPath(to.path)
        if (fullPath === '') {
          window.$message({
            showClose: true,
            message: '您账号权限不足，请联系管理员！',
            type: 'warning'
          });
          setTimeout(function () { Load.close() }, 0)
        } else {
          next(fullPath);
          setTimeout(function () { Load.close() }, 0)
          Sunflower.LoadingBar.finish()
        }
      } else {
        if (store.getters.userName === superAdminName) { // 超级管理员需要验证是否需要配置向导
          store.dispatch('configGuide/getConfigGuide').then(function (firstLogin) {
            // 获取配置向导数据//Q1UE问题优化
            if (to.path === '/ConfigGuide') {
              if (firstLogin) {
                next();
              } else {
                next('/')
              }
            } else {
              if (firstLogin) {
                next('/ConfigGuide');
              } else {
                next()
              }
            }
            // 创建面包屑
            store.commit('getBread', to.fullPath)
          }).catch((err) => {
            console.log(err);
          })
        } else {
          next()
          // 创建面包屑
          store.commit('getBread', to.fullPath)
        }
      }
      // 判断是否有用户数据
      if (!store.getters.userData) {
        // 非系统管理员用户
        if (store.getters.userName !== sysAdminUserName) {
          // 获取用户数据
          Promise.all([
            store.dispatch('getUserData').then(function (data) {
              // 获取用户信息成功
              // console.log(data)
              return store.dispatch('getInitMenu').then(function (data) {
                // 获取asyncRouter
                // console.log(data)
                return store.dispatch('concatRouters').then(function (data) {
                  // 获取asyncRouter
                  // console.log(data)
                }).catch((err) => {
                  console.log(err);
                })
              }).catch((err) => {
                console.log(err);
              })
            })
          ]).then(function () {
            // 登录并获取数据成功后添加路由
            router.addRoutes(cloneDeep(store.getters.addRouters))
          }).catch(function (err) {
            console.log(err);
          })
        } else {
          store.dispatch('getSysUserData');
          store.dispatch('cocatSysRouters');
          router.addRoutes(cloneDeep(store.getters.addRouters))
        }
      }
    }
  } else if (to.path === '/login') {
    next()
  } else if (to.name === 'oauthlogin' || to.name === 'wenjuan' || to.name === 'staticTvWallPage' || to.name === 'OperationalApproval' || to.name === 'ApprovalSuccess') {
    next()
  } else {
    next('/login')
  }
})

router.afterEach((to, from) => {
  if (to.path === from.path || from.path === '/') {
    setTimeout(function () { Load.close() }, 0)
  }
  if (to.path !== from.path && from.path !== '/') {
    Sunflower.LoadingBar.finish()
  }
})
