/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 15:24:55
 * @LastEditTime: 2020-03-20 15:21:16
 * @LastEditors: mybells
 */
/**
 * Created by dgunzi on 2019/04/01.
 */

import Wrapper from '@/home/Wrapper'

// IAM_EXTEND
const AccountRouter = [
  {
    path: 'orgTopo',
    meta: {name: '组织机构管理'},
    component: Wrapper,
    children: [
      {
        path: '',
        name: 'accountManage_org',
        component: () => import('@/pages/Account_Organization/TotalAccountManage')
      },
      {
        path: 'importList/:modelName',
        name: 'importList',
        component: () => import('@/pages/Account_Organization/ImportList'),
        meta: {
          name(path) {
            if (/AD/.test(path)) {
              return 'AD域导入'
            } else {
              return 'LDAP导入'
            }
          }
        }
      }
    ]
  },
  {
    path: 'accountManage_passwordExpiration/:tabIndex',
    name: 'accountManage_passwordExpiration',
    component: () => import('@/pages/Log_Usage/UsageTab'),
    meta: {name: '过期账号统计'}
  },
  {
    path: 'accountAudit',
    name: 'accountManage_accountAudit',
    component: () => import('@/pages/Account_Audit/Audit'),
    meta: {name: '账号稽核'}
  },
  {
    path: 'accountSysPrivilege',
    name: 'accountManage_systemRights',
    component: () => import('@/pages/Account_SysPrivilege/SysPrivilege'),
    meta: {name: '用户权限管理'}
  },
  {
    path: 'account_auth',
    name: 'accountManage_AuthPolicy',
    component: () => import('@/pages/Account_Auth/Auth'),
    meta: {name: '授权策略管理'}
  },
  {
    path: 'accountManage_accountAudit',
    name: 'accountManage_accountAudit',
    component: () => import('@/pages/Account_TimedTask/Audit'),
    meta: {name: '账号稽核'}
  },
  {
    path: 'accountManage_accountImproved',
    name: 'accountManage_accountImproved',
    component: () => import('@/pages/Account_TimedTask/ChangePass'),
    meta: {name: '账号改密'}
  },
  {
    path: 'accountManage_accountTimeTask',
    name: 'accountManage_accountTimeTask',
    component: () => import('@/pages/Account_TimedTask/AssetsSync'),
    meta: {name: '账号同步'}
  },
  {// Q1IAM模块功能增强
    path: 'appSystemManage',
    name: 'appSystemManage',
    component: () => import('@/pages/Account_BusinessAuth/BusinessAuth'),
    meta: { name: '业务权限管理' }
  }
];

export default AccountRouter;
