/**
 * Created by dgunzi on 2019/04/01.
 */

// 系统
const SystemSetRouter = [
  {
    path: 'sys_diskwarning',
    name: 'systemSet_diskwarning',
    component: () => import('@/pages/SysManage_DiskWarning/DiskWarning'),
    meta: {
      name: '磁盘预警'
    }
  },
  {
    path: 'sys_backup',
    name: 'systemSet_backup',
    component: () => import('@/pages/SysManage_Backup/Backup'),
    meta: {
      name: '系统最新备份'
    }
  },
  {
    path: 'sys_announce',
    name: 'systemSet_announce',
    component: () => import('@/pages/SysManage_Announcement/Announce'),
    meta: {
      name: '系统公告'
    }
  },
  {
    path: 'AdvancedSet',
    name: 'systemSet_advancedSet',
    component: () => import('@/home/SystemSet/AdvancedSet'),
    meta: {
      name: '系统设置面板'
    }
  },
  {
    path: 'OpeLog',
    name: 'systemSet_operLogManager',
    component: () => import('@/pages/SysManage_OpeLog/OpeLog'),
    meta: {
      name: '系统日志管理'
    }
  }
]

export default SystemSetRouter;
