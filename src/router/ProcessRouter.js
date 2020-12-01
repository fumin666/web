/**
 * Created by dgunzi on 2019/04/01.
 */
import Wrapper from '@/home/Wrapper'
// ITTL
const ProcessRouter = [
  {
    path: 'ServiceLevelAgreement',
    name: 'processCenter_workflowConfig',
    component: () => import('@/pages/Process_SetUp/components/ServiceLevel.vue'),
    meta: {
      name: '服务级别协议SLA'
    }
  },
  {
    path: 'Process_setup',
    name: 'processCenter_workflowConfig',
    component: Wrapper,
    meta: {
      name: '流程配置'
    },
    children: [
      {
        path: '',
        name: 'processCenter_workflowConfig',
        component: () => import('@/pages/Process_SetUp/ProcessSetUp.vue')
      },
      {
        path: 'ServiceLevelAgreement',
        name: 'ServiceLevelAgreement',
        component: () => import('@/pages/Process_SetUp/components/ServiceLevel.vue'),
        meta: {
          name: '服务级别协议SLA'
        }
      }
    ]
  },
  {
    path: 'WeekWorkAccount/:dateType/:orderType',
    name: 'processCenter_workloadByWeek',
    component: () => import('@/pages/Process_WorkAccount/WeekWorkAccount.vue'),
    meta: {
      name: '本周工作量统计'
    }
  },
  {
    path: 'changeconflict',
    name: 'processCenter_changeConflict',
    component: () => import('@/pages/Process_MyOther/ChangeConflictTest'),
    meta: {name: '变更冲突检测'}
  },
  {
    path: 'eventDetail/:orderUuid',
    name: 'AUTH-TRUE-event',
    component: () => import('@/pages/Process_EventDetail/EventDetail'),
    meta: {name: '事件单详情'}
  },
  {
    path: 'problemDetail/:uuid',
    name: 'AUTH-TRUE-problem',
    component: () => import('@/pages/Process_ProblemDetail/ProblemDetail'),
    meta: {name: '问题单详情'}
  },
  {
    path: 'modifyDetail/:uuid',
    name: 'AUTH-TRUE-modify',
    component: () => import('@/pages/Process_Modify/ModifyDetail'),
    meta: {name: '变更单详情'}
  },
  {
    path: 'taskOrderDetail/:uuid',
    name: 'AUTH-TRUE-task',
    component: () => import('@/pages/Process_Modify/TaskOrderDetail'),
    meta: {name: '任务单详情'}
  },
  {
    path: 'modifyFlowchart/:serialCode/:orderUuid',
    name: 'AUTH-TRUE-modifyFlow',
    component: () => import('@/pages/Process_Modify/ModifyFlowchart'),
    meta: {name: '变更单流程图'}
  },
  {
    path: 'eventFlowchart/:serialCode/:orderUuid',
    name: 'AUTH-TRUE-eventFlow',
    component: () => import('@/pages/Process_EventDetail/EventFlowchart'),
    meta: {name: '事件单流程图'}
  },
  {
    path: 'problemFlowchart/:serialCode/:orderUuid',
    name: 'AUTH-TRUE-problemFlow',
    component: () => import('@/pages/Process_ProblemDetail/ProblemFlowchart'),
    meta: {name: '问题单流程图'}
  },
  {
    path: 'knowledgeFlowchart/:serialCode/:orderUuid',
    name: 'AUTH-TRUE-knowledgeFlow',
    component: () => import('@/pages/Process_Knowledge/KnowledgeFlowchart'),
    meta: {name: '知识流程图'}
  },
  {
    path: 'requestServiceFlowchart/:serialCode/:orderUuid',
    name: 'AUTH-TRUE-requestServiceFlow',
    component: () => import('@/pages/Process_RequestService/ServiceFlowchart.vue'),
    meta: {name: '服务请求流程图'}
  },
  {
    path: 'publishFlowchart/:serialCode/:orderUuid',
    name: 'AUTH-TRUE-publishFlow',
    component: () => import('@/pages/Process_PublishDetail/PublishFlowChart.vue'),
    meta: {name: '发布单流程图'}
  },
  {
    path: 'modifycalendar',
    name: 'AUTH-TRUE-calendar',
    component: () => import('@/pages/Process_Modify/ModifyCalendar'),
    meta: {name: '变更日历'}
  },
  {
    path: 'myWillDone',
    name: 'processCenter_undealOrder', // 写其他的会显示没有权限
    component: () => import('@/pages/Process_Components/MyWillDone'),
    meta: {name: '我的待办'}
  },

  {
    path: 'myApproval',
    name: 'processCenter_approveOrder',
    component: () => import('@/pages/Process_Components/MyApproval'),
    meta: {name: '我的审批'}
  },
  {
    path: 'knowledgeLibrary',
    name: 'processCenter_knowledge',
    component: () => import('@/pages/Process_Knowledge/Knowledge'),
    meta: {name: '知识库'}
  },
  {
    path: 'searchKnowledge',
    name: 'AUTH-TRUE-processCenter_searchKnowledge',
    component: () => import('@/pages/Process_Knowledge/SearchKnowledge'),
    meta: {name: '搜索知识库'}
  },
  {
    path: 'knowDetail/:uuid',
    name: 'AUTH-TRUE-knowledge',
    component: () => import('@/pages/Process_Knowledge/KnowDetail'),
    meta: {name: '知识库详情'}
  },
  {
    path: 'publishDetail/:uuid',
    name: 'AUTH-TRUE-publish',
    component: () => import('@/pages/Process_PublishDetail/PublishDetail'),
    meta: {name: '发布单详情'}
  },
  {
    path: 'publishTaskOrderDetail/:uuid',
    name: 'AUTH-TRUE-publishTaskOrder',
    component: () => import('@/pages/Process_PublishDetail/PublishTaskOrderDetail'),
    meta: {name: '任务单详情'}
  },
  {
    path: 'serviceRequest',
    name: 'processCenter_serviceRequest',
    component: () => import('@/pages/Process_ServiceRequest/Console'),
    meta: {name: '服务请求控制台'}
  },
  {
    path: 'designer',
    name: 'AUTH-TRUE-processCenter_designer',
    component: () => import('@/pages/Process_ServiceRequest/Designer'),
    meta: {name: '服务请求设计器'}
  },
  {
    path: 'requestServiceDetail/:uuid',
    name: 'AUTH-TRUE-requestService',
    component: () => import('@/pages/Process_RequestService/RequestService'),
    meta: {name: '服务请求详情'}
  }
]

export default ProcessRouter;
