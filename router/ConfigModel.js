/**
 * Created by dgunzi on 2019/04/01.
 */

let tmpConfig = ['配置项采集配置', '管理员配置'];

const ConfigModel = [
  {
    path: 'admin_set/:type',
    name: 'autoOperationCenter_adminSet',
    component: () => import('@/pages/AutoOps_ConfigCollect/AdminConfig.vue'),
    meta: {
      name: function (to) {
        let x = to.substr(-1)
        return tmpConfig[x]
      }
    }
  },
  {
    path: 'config_collect',
    component: () => import('@/pages/AutoOps_ConfigCollect/ConfigCollect.vue'),
    meta: {
      name: '配置项采集'
    },
    children: [
      {
        path: '',
        name: 'autoOperationCenter_collectTask'
      },
      {
        path: 'collect_task',
        name: 'collect_task',
        component: () => import('@/pages/AutoOps_ConfigCollect/CollectTask.vue'),
        meta: {
          name: '任务',
          index: 0
        }
      },
      {
        path: 'collect_statement',
        name: 'collect_statement',
        component: () => import('@/pages/AutoOps_ConfigCollect/CollectStatement.vue'),
        meta: {
          name: '报表',
          index: 1
        }
      }
    ]
  }
]

export default ConfigModel;
