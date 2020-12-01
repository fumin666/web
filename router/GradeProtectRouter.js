import Wrapper from '@/home/Wrapper'
const GradeProtectRouter = [
  {
    path: 'gradeProtect_dbReport',
    name: 'gradeProtect_dbReport',
    component: () => import('@/pages/GradeProtect/GradeLog'),
    meta: {
      name: '等保报表'
    }
  },
  {
    path: 'gradeProtect_reportSubscribe',
    name: 'gradeProtect_reportSubscribe',
    component: () => import('@/pages/GradeProtect/LogSend'),
    meta: {
      name: '报表订阅'
    }
  },
  {
    path: 'gradeProtect_dbRuleSet',
    name: 'gradeProtect_dbRuleSet',
    component: Wrapper,
    meta: {
      name: '等保规则设置'
    },
    children: [
      {
        path: '',
        name: 'gradeProtect_dbRuleSet',
        component: () => import('@/pages/GradeProtect/GradeRuleset')
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
    path: 'gradeProtect_dbWorkflow',
    name: 'gradeProtect_dbWorkflow',
    component: () => import('@/pages/GradeProtect_WorkFlow/GradeProtectWorkflow'),
    meta: {
      name: '等保工作流'
    }
  },
  {
    path: 'safetyBulletin_flowChart/:orderUuid/:taskId',
    name: 'gradeProtect_dbWorkflow',
    component: () => import('@/pages/Safety_BulletinTask/components/dialog/FlowChart'),
    meta: {name: '流程图'}
  },
  {
    path: 'gradeProtect_knowledgeBase',
    name: 'gradeProtect_knowledgeBase',
    component: () => import('@/pages/GradeProtect_Knowledge/GradeKnowledge'),
    meta: {
      name: '等保知识库'
    }
  },
  {
    path: 'gradeProtect_workRemind',
    name: 'gradeProtect_workRemind',
    component: () => import('@/pages/GradeProtect_Remind/WorkRemind'),
    meta: {
      name: '等保工作提醒'
    }
  },
  {
    path: 'safetyBulletin_dispose/:tbUuid',
    name: 'gradeProtect_workRemind',
    component: () => import('@/pages/Safety_BulletinTask/components/DisposeWork'),
    meta: {name: '工单处理'}
  },
  {
    path: 'safetyBulletin_details/:tbUuid',
    name: 'gradeProtect_workRemind',
    component: () => import('@/pages/Safety_BulletinTask/RepairProcessing'),
    meta: {name: '工单详情'}
  }
]

export default GradeProtectRouter;
