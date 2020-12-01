/**
 * Created by YOU on 2017/7/18.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import $axios from 'sunflower-ajax'
import { asyncRouter, asyncRouterConfigCenter, constRouter } from '@/router'
import processCenter from './processCenter.js'
import assetsManage from './assetsMamage.js'
import serviceRequest from './serviceRequest.js'
import safetyBulletin from './safetyBulletin.js'
import scanningSteps from './Assets_Ipam/scanningSteps.js'
import addressScanSteps from './Assets_Ipam/addressScanSteps.js'
import addressAllocationSteps from './Assets_Ipam/addressAllocationSteps.js'
import itilStore from './itilStore.js'
import assetFindAgain from './assetFindAgain.js'
import configGuide from './configGuide'
import { SecondRouterObj } from '../router/ChildModuleRouter'
import { sysAdminMenus, sysAdminUserName, superAdminName } from 'sunflower-common-utils'

Vue.use(Vuex)
let store = new Vuex.Store({
  state: {
    theme: 'fanta',
    userName: null,
    role: null,
    // 用户数据
    userData: null,
    // 初始路由
    routers: constRouter,
    // 动态添加路由
    addRouters: [],
    index: null,
    // 角色权限树
    firstMenu: null,
    secondMenu: null,
    authMenu: null,
    authSafetyBulletin: null,
    // 手机口令牌登录设置
    phoneTokenData: null,
    // 菜单
    menu: [{
        class: 'icon-nav-account-manage',
        title: '账号管理',
        to: '/AccountManage',
        keyWord: 'accountManage',
        icon: 'nav-account-manage',
        msg: '组织机构、人员账号、授权策略',
        background: '#60ACFC',
        url: 'static/images/homePages/dark/nav-account-manage.svg',
        sub: 0
      },
      {
        class: 'icon-nav-asset-manage',
        title: '资产管理',
        to: '/AssetsAll',
        keyWord: 'assetsManage',
        icon: 'nav-asset-manage',
        msg: '资产发现、资产管理、配置管理',
        background: '#32D3EB',
        url: 'static/images/homePages/dark/nav-asset-manage.svg',
        sub: 0
      },
      {
        class: 'icon-nav-asset-monitor',
        title: '资产监控',
        to: '/AssetsMonitor',
        keyWord: 'assetsMonitor',
        icon: 'nav-asset-monitor',
        msg: '资产监控、拓扑视图、业务服务',
        background: '#1ECFA9',
        url: 'static/images/homePages/dark/nav-asset-monitor.svg',
        sub: 0
      },
      {
        class: 'icon-nav-oper-auto',
        title: '自动化运维',
        to: '/AutoOpsCenter',
        keyWord: 'autoOperationCenter',
        icon: 'nav-oper-auto',
        msg: '脚本编辑、执行、结果回放',
        background: '#FEB64D',
        url: 'static/images/homePages/dark/nav-oper-auto.svg',
        sub: 0
      },
      {
        class: 'icon-nav-oper-center',
        title: '运维中心',
        to: '/OperationCenter',
        keyWord: 'operationCenter',
        icon: 'nav-oper-center',
        msg: '运维、双人协作、客户端下载',
        background: '#FF7190',
        url: 'static/images/homePages/dark/nav-oper-center.svg',
        sub: 0
      },
      {
        class: 'icon-nav-event-center',
        title: '事件中心',
        to: '/EventCenter',
        keyWord: 'eventCenter',
        icon: 'nav-event-center',
        msg: '告警、异常事件、规则',
        background: '#FF8F4C',
        url: 'static/images/homePages/dark/nav-event-center.svg',
        sub: 0
      },
      {
        class: 'icon-nav-process-center',
        title: '流程中心',
        to: '/ProcessCenter',
        keyWord: 'processCenter',
        icon: 'nav-process-center',
        msg: '工单创建、处理、流程设置',
        background: '#5589FF',
        url: 'static/images/homePages/dark/nav-process-center.svg',
        sub: 0
      },
      {
        class: 'icon-nav-anquantongbao',
        title: '安全通报',
        to: '/SafetyBulletin',
        keyWord: 'safetyBulletin',
        icon: 'nav-anquantongbao',
        msg: '工单创建、处理、流程设置',
        background: '#EFB64D',
        url: 'static/images/homePages/dark/nav-anquantongbao.svg',
        sub: 0
      },
      {
        class: 'icon-nav-dengjibaohu',
        title: '等级保护',
        to: '/GradeProtect',
        keyWord: 'gradeProtect',
        icon: 'nav-dengjibaohur',
        msg: '数据统计、报表导出',
        background: '#838FFF',
        url: 'static/images/homePages/dark/nav-dengjibaohur.svg',
        sub: 0
      },
      {
        class: 'icon-nav-report-center',
        title: '报表中心',
        to: '/LogCenter',
        keyWord: 'logCenter',
        icon: 'nav-report-center',
        msg: '数据统计、报表导出',
        background: '#FF656E',
        url: 'static/images/homePages/dark/nav-report-center.svg',
        sub: 0
      },
      {
        class: 'icon-nav-system-set',
        title: '系统设置',
        to: '/SystemSet',
        keyWord: 'systemSet',
        icon: 'nav-system-set',
        msg: '自检、备份、公告、注册升级',
        background: '#7D859A',
        url: 'static/images/homePages/dark/nav-system-set.svg',
        sub: 0
      }
    ],
    // 面包屑
    bread: [],
    // 授权
    authCurrent: 0,
    docData: {
      isShow: '',
      selectDocList: []
    },
    assetData: {
      isShow: '',
      selectAssetList: []
    },
    namecard: {
      show: false,
      data: null,
      x: 0,
      y: 0
    },
    graphData: []
  },
  getters: {
    userName: state => state.userName,
    userData: state => state.userData,
    routers: state => state.routers,
    addRouters: state => state.addRouters,
    index: state => state.index,
    firstMenu: state => state.firstMenu,
    secondMenu: state => state.secondMenu,
    authMenu: state => state.authMenu,
    authSafetyBulletin: state => state.authSafetyBulletin,
    menu: state => {
      let menus = [];
      if (state.userName === sysAdminUserName) {
        menus = sysAdminMenus;
      } else {
        // 过滤一级菜单（footer)
        let menuList = state.firstMenu || [];
        let keyWords = menuList.map(function (item) {
          return item.keyWord
        })
        menus = state.menu.filter(function (item) {
          if (keyWords.indexOf(item.keyWord) !== -1) {
            return true
          }
          return false
        })
      }
      return menus;
    },
    bread: state => state.bread,
    authCurrentText: state => {
      if (state.authCurrent === 3) {
        return '保存'
      } else {
        return '下一步'
      }
    },
    theme: state => {
      switch (state.theme) {
        case 'dark':
          return { color: '#cdcdcd', background: '#000009' };
        case 'chalk':
          return { color: '#000', background: '#fff' };
        case 'tea':
          return { color: '#000', background: '#fff' };
        case 'fanta':
          return { color: '#000', background: '#fff' };
      }
    }
  },
  mutations: {
    SET_ROUTER(state, router) {
      state.addRouters = router
      // 设置/对应的路由
      state.index = state.addRouters[1].path
      state.routers = constRouter.concat(asyncRouter)
    },
    SET_SYS_ROUTER(state, router) {
      state.addRouters = router
      // 设置/对应的路由
      state.index = state.addRouters[1].path
      state.routers = constRouter.concat(asyncRouterConfigCenter)
    },
    SET_TOKEN(state) {
      state.userName = localStorage.getItem('userName')
    },
    getBread(state, fullPath) {
      fullPath = fullPath.length > 1 ? fullPath.replace(/\/$/, '') : fullPath
      let pathTemp = '/'
      let paths = fullPath.split('/').slice(1).map(function (route) {
        let to = pathTemp + route
        pathTemp = to + '/'
        return {
          path: route,
          to: to
        }
      })
      let addRouters = state.addRouters

      deepBread(paths, addRouters)

      function deepBread(paths, routers, index) {
        let k = index || 0
        for (let i = 0; i < routers.length; i++) {
          // 匹配路由
          if (routers[i].path.toLowerCase().indexOf(paths[k].path.split('?')[0].toLowerCase()) !== -1) {
            paths[k] = {
              ...paths[k],
              title: routers[i].meta && routers[i].meta.name ? routers[i].meta.name : '未知'
            }
            // 如果存在动态路由，去掉query参数
            if (routers[i].path.indexOf('/') > 0) {
              let add = routers[i].path.split('/').length - 1
              while (add-- > 0) {
                paths[k].to += ('/' + paths[k + 1].path)
                paths.splice(k + 1, 1)
              }
              // function传入当前path并执行自定义方法生成title
              if (typeof paths[k].title === 'function') {
                paths[k].title = paths[k].title(paths[k].to)
              }
            }
            // 下一级路由
            if (paths[k + 1]) {
              deepBread(paths, routers[i].children, k + 1)
            }
            return false
          }
        }
        return false
      }

      paths.unshift({
        path: 'HomePage',
        to: '/HomePage',
        title: '首页'
      })
      state.bread = paths
    },
    authIncrement(state) {
      state.authCurrent++
      if (state.authCurrent > 3) {
        state.authCurrent = 0
      }
    },
    authZero(state) {
      state.authCurrent = 0
    },
    getDocList(state, val) {
      state.docData.selectDocList = val
    },
    openDocDialog(state, val = true) {
      state.docData.isShow = val
    },
    getAssetList(state, val) {
      state.assetData.selectAssetList = val
    },
    openAssetDialog(state, val = true) {
      state.assetData.isShow = val
    },
    graphData(state, value) {
      state.graphData = value;
    },
    nameCardShow(state, val) {
      state.namecard.show = true
      state.namecard.data = val.data
      let windowWidth = val.event.view.innerWidth; // 获取当前视窗宽度
      let windowHeight = val.event.view.innerHeight; // 获取当前视窗高度
      state.namecard.x = parseInt(val.event.clientX) - 40
      state.namecard.y = parseInt(val.event.clientY) + 20
      if (parseInt(val.event.clientX) + 650 > windowWidth) {
        let x_ = state.namecard.x - parseInt(val.event.clientX + 650 - windowWidth) - 640
        state.namecard.x = (x_ < 0) ? 0 : x_;
      }
      if (parseInt(val.event.clientY) + 400 > windowHeight) {
        state.namecard.y -= parseInt(val.event.clientY + 400 - windowHeight)
      }
    },
    nameCardHide(state) {
      state.namecard = {
        show: false,
        data: null,
        x: 0,
        y: 0
      }
    },
    SET_FIRSTMENU(state, payload) {
      state.firstMenu = payload.firstMenu;
    },
    SET_PHONETOKEN(state, payload) {
      state.phoneTokenData = payload.phoneTokenData;
    },
    SET_SECONDMENU(state, payload) {
      state.secondMenu = payload.secondMenu;
    },
    SET_THIRDMENU(state, payload) {
      state.authMenu = payload.authMenu;
    },
    SET_AUTHSAFETY(state, payload) {
      state.authSafetyBulletin = payload.authSafetyBulletin;
    },
    SET_USERDATA(state, payload) {
      state.userData = payload.userData;
    },
    SET_USERNAME(state, payload) {
      state.userName = payload.userName;
    },
    SET_CHANGEPWDFLAG(state, payload) {
      state.changePwdFlag = payload.changePwdFlag;
    },
    SET_TEMPOBJ(state, payload) {
      state.tempObj = payload.tempObj;
    },
    // 修改用户数据
    SET_MODEL(state, payload) {
      state.userData.registerModelList = payload;
    },
    // 修改用户数据
    SET_ROLE(state, payload) {
      state.userData.roleName = payload;
    },
    // 修改menu数据
    SET_MENU(state, payload) {
      state.menu.forEach(item => {
        item.sub = ((payload || {})[item.keyWord]) || 0
      })
    },
    // 直接修改menu数据
    SET_MENU_DIRECT(state, payload) {
      state.menu = payload;
    },
    // 设置主题
    setTheme(state, payload) {
      state.theme = payload;
    }
  },
  actions: {
    login({ dispatch, state, commit }, params) {
      // 记录用户名
      // state.userName = params.userLoginName
      commit('SET_USERNAME', { userName: params.userLoginName });
      return new Promise((resolve, reject) => {
        $axios.post('/baseLogin', params).then(({ data }) => {
          if (params.userLoginName !== superAdminName) { // 普通登录
            if (data.picPath) {
              // 显示手机口令牌设置弹框
              commit('SET_PHONETOKEN', { phoneTokenData: data });
              resolve(data)
            } else {
              // 重置手机口令牌设置弹框(不显示)
              commit('SET_PHONETOKEN', { phoneTokenData: null });
              if (data.status === 'true') {
                // 如果用户需要改密
                if (data.changePwd) {
                  commit('SET_CHANGEPWDFLAG', { changePwdFlag: true });
                  let tempObj = {
                    userName: params.userLoginName,
                    authorizationModel: JSON.stringify(data.authorizationModel)
                  };
                  commit('SET_TEMPOBJ', { tempObj: tempObj });
                } else {
                  commit('SET_CHANGEPWDFLAG', { changePwdFlag: false });
                  localStorage.setItem('userName', params.userLoginName)
                  localStorage.setItem('authorizationModel', JSON.stringify(data.authorizationModel))
                }
                resolve(data)
              } else {
                reject(data); // 接口返回异常数据
              }
            }
          } else { // superadmin登录
            if (data.status === 'false') { // superadmin登录失败false
              reject(data)
            } else {
              dispatch('superadminLogin').then(res => {
                commit('configGuide/SET_ACTIVESTEP', res.data.step + 1); // step是已完成的步数
                commit('configGuide/SET_ISCOMPLETE', res.data.firstLogin);
                commit('configGuide/SET_REGISTER', res.data.register);
                if (res.data.firstLogin) {
                  localStorage.setItem('userName', params.userLoginName)
                  resolve(data);
                } else if (!res.data.firstLogin) {
                  // 系统管理员重置密码（配置向导后系统管理员用superadmin登陆）//Q1UE问题优化
                  resolve(data);
                }
              }).catch(e => {
                reject(e);
              })
            }
          }
        })
      })
    },
    superadminLogin() {
      // 是否初次登录系统显示向导流程
      return $axios.post('/firstUsageWizard/judgeSuperadminLoginTime', { userLoginName: superAdminName })
    },
    sysLogin({ state, commit }, params) {
      return new Promise((resolve, reject) => {
        $axios.post('/configcenter/loginout/login', params).then(function ({ data }) {
          if (data.result) {
            localStorage.setItem('userName', params.userLoginName);
            resolve(data);
          } else {
            reject(data);
          }
        });
      })
    },
    logout({ state }) {
      return new Promise(function (resolve, reject) {
        $axios.get('/logout').then(function ({ data }) {
          if (data === true) {
            let theme = localStorage.getItem('theme')
            localStorage.clear()
            if (theme !== null) {
              localStorage.setItem('theme', theme)
            }
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    },
    sysLoginout({ state }) {
      return new Promise(function (resolve, reject) {
        $axios.get('/configcenter/loginout/logout').then(function ({ data }) {
          if (data.result) {
            let theme = localStorage.getItem('theme')
            localStorage.clear()
            if (theme !== null) {
              localStorage.setItem('theme', theme)
            }
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    },
    getUserData({ state, commit }) {
      return new Promise((resolve, reject) => {
        $axios.post('/iamUserInfo/getUserInfoDetail').then(function ({ data }) {
          // state.userData = data
          commit('SET_USERDATA', { userData: data });
          localStorage.setItem('userUuid', data.uuid)
          localStorage.setItem('userName', data.userLoginName)
          // 申请服务端创建聊天室，发送footer告警推送
          $axios.get($axios.basePath().replace(/\/$/, '') + '/iamUserInfo/createPageConnection/' + state.userData.uuid)
          resolve(data)
        })
      })
    },
    getSysUserData({ state, commit }) {
      commit('SET_USERDATA', { userData: { userLoginName: sysAdminUserName } });
    },
    getInitMenu({ state, commit }) {
      return new Promise((resolve, reject) => {
        $axios.get('iamUserInfo/getMenuAndRoleByUser').then(function ({ data }) {
          // state.firstMenu = data.firstMenu
          commit('SET_FIRSTMENU', { firstMenu: data.firstMenu });
          // state.secondMenu = data.secondMenu;
          commit('SET_SECONDMENU', { secondMenu: data.secondMenu });
          // 合并secondMenu和lastThirdMenu
          let newSecondMenuArr = [];
          Object.keys(data.secondMenu).forEach(function (key) {
            newSecondMenuArr.push(...data.secondMenu[key])
          });
          commit('SET_THIRDMENU', { authMenu: newSecondMenuArr.concat(data.lastThirdMenu) }); // 权限
          commit('SET_AUTHSAFETY', { authSafetyBulletin: data.safetyBulletin }); // 权限
          resolve(data)
        })
      })
    },
    concatRouters({ state, commit }) {
      return new Promise(function (resolve, reject) {
        let firstMenu = state.firstMenu
        let ajaxMenu = [].concat.apply([], Object.values(state.secondMenu))
        let keyNameList = ajaxMenu.map(item => item.keyWord)
        const pathList = firstMenu.map(item => item.keyWord)
        // 资产管理部分内容
        const assetsManagePathList = SecondRouterObj['assetsManage'].map(item => item.path)
        // 如果有自动化运维
        if (pathList.indexOf('autoOperationCenter') > -1) {
          SecondRouterObj['assetsManage'].splice(assetsManagePathList.indexOf('admin_set/:type'), 2)
        }
        // 过滤懒加载路由
        let routers = asyncRouter.filter((item) => {
          for (let i = 0; i < firstMenu.length; i++) {
            if (!item.hasOwnProperty('children') || item.children[0].name === firstMenu[i].keyWord) {
              if (item.hasOwnProperty('children')) {
                item.meta.uuid = firstMenu[i].uuid
              }
              return item
            }
          }
        })
        // 过滤权限设置为true的 直接让其访问
        if (state.userData && state.userData.registerModelList.length === 1 && state.userData.registerModelList[0] === 'OMA') { // 过滤资产列表的路由
          SecondRouterObj.assetsManage[1].children.splice(0, 1)
          SecondRouterObj.ConfigurationWizard[2].children.splice(0, 1)// 配置向导也有这个
        } else {
          SecondRouterObj.assetsManage[1].children.splice(1, 1)
          SecondRouterObj.ConfigurationWizard[2].children.splice(1, 1)// 配置向导也有这个
        }
        routers.map((item) => {
          if (item.hasOwnProperty('children')) {
            let arr = SecondRouterObj[item.children[0].name] || []
            for (let i = 0; i < arr.length; i++) {
              let name = (arr[i].name || arr[i].children[0].name) || ''
              if (keyNameList.indexOf(name) > -1 || name.indexOf('AUTH-TRUE') > -1) {
                item.children.push(arr[i])
              }
            }
          }
        })
        commit('SET_ROUTER', routers)
        resolve(asyncRouter)
      })
    },
    cocatSysRouters({ state, commit }) {
      commit('SET_SYS_ROUTER', asyncRouterConfigCenter)
    },
    nameCardShow({ state, commit }, params) {
      let val = {}
      $axios.get(`/iamUserInfo/viewUserInfo/${params.useruuid}`).then(({ status, data }) => {
        if (status === 200 || status === 304) {
          Object.assign(val, { event: params.event, data: data });
          store.commit('nameCardShow', val);
        }
      });
    },
    nameCardHide({ state, commit }) {
      store.commit('nameCardHide');
    },
    nameCardToggle({ state, commit }, params) {
      if (state.namecard.show) {
        store.dispatch('nameCardHide');
      } else {
        store.dispatch('nameCardShow', params)
      }
    }
  },
  modules: {
    safetyBulletin,
    processCenter,
    assetsManage,
    serviceRequest,
    itilStore,
    assetFindAgain, // 资产发现
    scanningSteps, // 子网扫描
    addressScanSteps, // ip地址扫描
    addressAllocationSteps, // ip地址分配
    configGuide // 首次登录配置向导
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store
