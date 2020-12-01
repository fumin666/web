|-- AssetsMonitor_View -Q3监控视图模块
    |-- MonitorList.vue -监控列表
    |-- MonitorView.vue -监控统计图
    |-- README.md -说明
    |-- components -基础组件和业务组件
    |   |-- vCard.vue -卡片组件
    |   |-- vCirclar.vue -环形图组件
    |   |-- vLine.vue -折线图组件
    |   |-- vLiquidfill.vue -水球图组件
    |   |-- vMoreline.vue -多折线图组件（一个图中有多个折线）
    |   |-- vProcess.vue -进度图组件
    |   |-- vStatus.vue -状态组件
    |   |-- businessComponents -业务组件
    |       |-- circlarBusiness.vue -没有tab（分页）的环形图业务组件
    |       |-- lineBusiness.vue -折线业务组件
    |       |-- liquidfillBusiness.vue -水球图业务组件
    |       |-- moreCirclarBusiness.vue -有tab的环形业务组件
    |       |-- morelineBusiness.vue -多折线业务组件
    |       |-- moreProcessBusiness.vue -有tab的进度业务组件
    |       |-- sigleProcessBusiness.vue -没tab的进度业务组件
    |       |-- statusBusiness.vue -状态业务组件
    |       |-- vGrid.vue -Grid业务组件，为了展示架构
    |-- dialog -设置弹窗
    |   |-- CustomSetting.vue -视图自定义设置弹窗
    |   |-- MonitorListSetting.vue -列表设置组件
    |   |-- MonitorViewSetting.vue -统计图设置组件
    |-- viewpage -不同模块的视图
        |-- commonMixins.js -对于各个基础模块中对于不同基础组件的数据处理（核心）
        |-- DataBase.vue -数据库模块
        |-- HostSystem.vue -主机系统模块
        |-- Memory.vue -内存模块
        |-- MiddleWare.vue -中间件模块
        |-- NetworkDevices.vue -网络设备模块
        |-- relation.js -各个模块中的需要使用的基础组件和默认设置
        |-- ServerHardware.vue -主机硬件模块
        |-- Terminal.vue -终端模块

业务线：
MonitorView.vue -> HostSystem.vue -> vGrid.vue -> vCard.vue -> circlarBusiness.vue -> vCirclar.vue