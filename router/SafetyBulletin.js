/**
 * Created by songyf on 2020/1/19.
 */

import Wrapper from '@/home/Wrapper'
// 系统
const safetyBulletin = [
  {
    path: 'safetyBulletin_tbTask',
    name: 'safetyBulletin_tbTask',
    component: () => import('@/pages/Safety_BulletinTask/SafetyBulletinTask'),
    meta: {name: '安全通报任务'}
  },
  {
    path: 'safetyBulletin_tbconfig',
    component: Wrapper,
    name: 'safetyBulletin_tbconfig',
    meta: {
      name: '通报类型设置'
    },
    children: [
      {
        path: '',
        name: 'safetyBulletin_tbconfig',
        component: () => import('@/pages/Safety_BulletinTypeSet/BulletinTypeSetList')
      },
      {
        path: 'safetyBulletin_designer',
        name: 'safetyBulletin_designer',
        meta: {name: '通报类型设计器'},
        component: () => import('@/pages/Safety_BulletinTypeSet/BulletinTypeSetDesign')
      },
      {
        path: 'safetyBulletin_view/:tbUuid',
        name: 'safetyBulletin_view',
        meta: {name: '查看通报类型'},
        component: () => import('@/pages/Safety_BulletinTypeSet/ViewBulletinTypeSet')
      }
    ]
  },
  {
    path: 'safetyBulletin_dbWork',
    name: 'safetyBulletin_dbWork',
    component: () => import('@/pages/Safety_BulletinTask/SafetyBulletinTask'),
    meta: {name: '等保工作'}
  },
  {
    path: 'safetyBulletin_myToDo',
    name: 'safetyBulletin_myToDo',
    component: () => import('@/pages/Safety_BulletinTask/MyWillDone'),
    meta: {name: '我的待办'}
  },
  {
    path: 'safetyBulletin_myApproval',
    name: 'safetyBulletin_myToDo',
    component: () => import('@/pages/Safety_BulletinTask/MyApproval'),
    meta: {name: '我的审批'}
  },
  {
    path: 'safetyBulletin_myInformationReceipt',
    name: 'safetyBulletin_myToDo',
    component: () => import('@/pages/Safety_BulletinTask/MyInformationReceipt'),
    meta: {name: '信息回执'}
  },
  {
    path: 'safetyBulletin_dispose/:tbUuid',
    name: 'safetyBulletin_knowledgeBase',
    component: () => import('@/pages/Safety_BulletinTask/components/DisposeWork'),
    meta: {name: '工单处理'}
  },
  {
    path: 'safetyBulletin_details/:tbUuid',
    name: 'safetyBulletin_knowledgeBase',
    component: () => import('@/pages/Safety_BulletinTask/RepairProcessing'),
    meta: {name: '工单详情'}
  },
  {
    path: 'safetyBulletin_flowChart/:orderUuid/:taskId',
    name: 'safetyBulletin_knowledgeBase',
    component: () => import('@/pages/Safety_BulletinTask/components/dialog/FlowChart'),
    meta: {name: '流程图'}
  },
  {
    path: 'safetyBulletin_knowledgeBase',
    name: 'safetyBulletin_knowledgeBase',
    component: () => import('@/pages/SafetyBulletin_Knowledge'),
    meta: {name: '知识库'}
  }
]

export default safetyBulletin;
