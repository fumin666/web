/**
 * Created by dgunzi on 2019/04/01.
 */

// 事件
const EventRouter = [
  {
    path: 'event_alarmcenter',
    name: 'eventCenter_alarmEvent',
    component: () => import('@/pages/Event_AlarmCenter/Alarm'),
    meta: {name: '告警事件统计'}
  },
  {
    path: 'event_list/:tab/:start/:end',
    name: 'eventCenter_latestEvents',
    component: () => import('@/pages/Event_List/App'),
    meta: {name: '最新事件'}
  },
  {
    path: 'event_alarmcfg',
    name: 'eventCenter_alarmType',
    component: () => import('@/pages/Event_AlarmCfg/Alarm'),
    meta: {name: '告警方式配置'}
  },
  {path: 'event_cmd', name: 'eventCenter_commandSet', component: () => import('@/pages/Event_Cmd/Cmd'), meta: {name: '命令集管理'}},
  {path: 'event_rules', name: 'eventCenter_rule', component: () => import('@/pages/Event_Rules/Rules'), meta: {name: '规则配置'}},
  {
    path: 'event_trend/:type',
    name: 'eventCenter_eventsTrend',
    component: () => import('@/pages/Event_Days/EventTrend'),
    meta: {name: '事件走势'}
  },
  {
    path: 'event_level',
    name: 'eventCenter_eventLevel',
    component: () => import('@/pages/Log_EventAccount/EventAccount'),
    meta: {name: '事件级别统计'}
  }
]

export default EventRouter;
