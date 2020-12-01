/**
 * Created by dgunzi on 2019/04/01.
 */

// 二级路由（按一级模块划分列出全部用于匹配）
import AccountRouter from './AccountRouter'
import AssetsRouter from './AssetsRouter'
import AssetsMonitorRouter from './AssetsMonitorRouter'
import AutoOpsRouter from './AutoOpsRouter'
import OperationRouter from './OperationRouter'
import EventRouter from './EventRouter'
import ProcessRouter from './ProcessRouter'
import LogRouter from './LogRouter'
import SystemSetRouter from './SystemSetRouter'
import SafetyBulletin from './SafetyBulletin'
import GradeProtectRouter from './GradeProtectRouter'
import ConfigPageRouter from './ConfigPageRouter'

export const SecondRouterObj = {
  accountManage: AccountRouter,
  assetsManage: AssetsRouter,
  assetsMonitor: AssetsMonitorRouter,
  autoOperationCenter: AutoOpsRouter,
  operationCenter: OperationRouter,
  eventCenter: EventRouter,
  processCenter: ProcessRouter,
  logCenter: LogRouter,
  systemSet: SystemSetRouter,
  safetyBulletin: SafetyBulletin,
  gradeProtect: GradeProtectRouter,
  ConfigurationWizard: ConfigPageRouter// Q1UE问题优化
}
