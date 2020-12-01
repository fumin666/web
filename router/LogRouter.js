/**
 * Created by dgunzi on 2019/04/01.
 */

// 报表
const LogRouter = [
  {
    path: 'logCenter_reportSubscription',
    name: 'logCenter_reportSubscription',
    component: () => import('@/pages/Log_Send/LogSend'),
    meta: {
      name: '报表订阅'
    }
  },
  {
    path: 'logCenter_reportClassify', // 后台返回的报表分类，path和name修改为NavButton里面一样的值
    name: 'logCenter_reportClassify',
    component: () => import('@/pages/Log_ProcessReport/LogClassification.vue'),
    meta: {
      name: '分类报表'
    }
  }
]

export default LogRouter;
