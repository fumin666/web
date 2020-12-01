<template>
  <div class="pollingResultDetail">
    <div class="back">
      <s-button icon="export" @click="resultExport">导出</s-button>
    </div>
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="基础信息" v-if = "isSafetyScoreSee === false">
        <div class="baseData">
          <s-row>
          <span class="title">
            <i class="iconfont icon-tag"></i>常用属性
          </span>
          </s-row>
          <s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">资产IP</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.ipAddress}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">资产名称</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.assetName}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">分类</div>
                  </s-col>
                  <s-col span="14" v-if="isAssets">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.assetType}}</div>
                  </s-col>
                  <s-col span="14" v-if="!isAssets">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.ciType}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">资产型号</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.assetProduct}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">资产编码</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.confCode}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">配置管理员机构</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.operationDepartment}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">使用部门</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.org}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">配置管理员</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.dealUser}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">资产描述</div>
                  </s-col>
                  <s-col span="14">
                    <s-tooltip :content="data.assetBaseInfo.desc">
                      <div class="grid-content bg-purple-light">{{data.assetBaseInfo.desc}}</div>
                    </s-tooltip>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">维护人</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light" :title="data.assetBaseInfo.takeUser">{{data.assetBaseInfo.takeUser}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
         <!-- <s-row>
         &lt;!&ndash; <span class="title">
            <i class="iconfont icon-tag"></i>资产属性
          </span>&ndash;&gt;
          </s-row>-->
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">资产状态</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.assetStatus}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">序列号</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.assetSeries}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">公司名称</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.departParentName}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">购买日期</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.purchaseDate}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">价格(RMB)</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.orderingCost}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">环境类型</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.environment}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">CPU型号</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.cpuModle}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">服务到期日</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.guaranteeDate}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">光驱</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.driver}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">显示器</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.manufacturerName}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">内存(MB)</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.memory}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">磁盘(MB)</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.capacity}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">关联合同号</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.contract}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">服务方式</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.serviceMode}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <!--附加属性-->
            <s-row>
              <s-scrollbar wrap-style="max-height:200px;">
              <s-col span="12" v-for="(value, key) in (data.assetBaseInfo.appendInfo || {})" :key="key">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">{{key}}</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{value}}</div>
                  </s-col>
                </s-row>
              </s-col>
              </s-scrollbar>
            </s-row>
          </s-row>
          <s-row v-if="hasCustomAttr">
          <span class="title">
            <i class="iconfont icon-tag"></i>特殊属性
          </span>
          </s-row>
          <s-row>
            <s-col span="12" v-for="(value, key) in data.assetBaseInfo.customInfo" :key="key">
              <s-row>
                <s-col span="10">
                  <div class="grid-content bg-purple">{{key}}</div>
                </s-col>
                <s-col span="14">
                  <div class="grid-content bg-purple-light">{{value}}</div>
                </s-col>
              </s-row>
            </s-col>
          </s-row>
        </div>
        <!--<div class="baseData" v-if="!isAssets">
          <s-row>
          <span class="title">
            <i class="iconfont icon-tag"></i>常规属性
          </span>
          </s-row>
          <s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">IP地址</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.ipAddress}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">资产名称</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.assetName}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">资产类型</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.assetType}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">资产型号</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.assetProduct}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">业务名称</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.businessName}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">MAC地址</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.mac}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">所属机构</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.org}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">责任人</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.dealUser}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">描述</div>
                  </s-col>
                  <s-col span="14">
                    <s-tooltip :content="data.assetBaseInfo.desc">
                      <div class="grid-content bg-purple-light">{{data.assetBaseInfo.desc}}</div>
                    </s-tooltip>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">位置</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light" :title="data.assetBaseInfo.location">{{data.assetBaseInfo.location}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
          </s-row>

          <s-row>
          <span class="title">
            <i class="iconfont icon-tag"></i>资产属性
          </span>
          </s-row>
          <s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">资产状态</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.assetStatus}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">序列号</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.assetSeries}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">条形码</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.barCode}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">购进日期</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.purchaseDate}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">订购成本（￥）</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.orderingCost}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">资产标签</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.assetTag}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">有效期限</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.effectiveDate}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">担保期</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{data.assetBaseInfo.guaranteeDate}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            &lt;!&ndash;附加属性&ndash;&gt;
            <s-row>
              <s-col span="12" v-for="(value, key) in (data.assetBaseInfo.appendInfo || {})" :key="key">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">{{key}}</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{value}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
          </s-row>

          <s-row v-if="hasCustomAttr">
          <span class="title">
            <i class="iconfont icon-tag"></i>自定义属性
          </span>
          </s-row>
          <s-row>
            <s-col span="12" v-for="(value, key) in data.assetBaseInfo.customInfo" :key="key">
              <s-row>
                <s-col span="10">
                  <div class="grid-content bg-purple">{{key}}</div>
                </s-col>
                <s-col span="14">
                  <div class="grid-content bg-purple-light">{{value}}</div>
                </s-col>
              </s-row>
            </s-col>
          </s-row>
        </div>-->
      </s-tab-pane>
      <s-tab-pane label="可用性信息" v-if = "isSafetyScoreSee === false">
        <!-- 包含echart时如果width为百分比，需要在选项卡激活时才渲染，不然会尺寸不匹配 -->
        <div v-if="activeTab === showTab">
          <s-row>
            <s-box :data="tabUserData" :bars="summaryLayout"></s-box>
          </s-row>
          <s-card  class="box-card" style="height: 400px;">
            <div slot="header" class="clearfix">
              <span class="card-title">
                <i class="iconfont icon-panel"></i>
                资产可用率
              </span>
            </div>
            <s-row class="chartContainer">
              <s-col span="8" v-for="(item, index) in avaChart" :key="index">
                <div>
                  <s-chart :chart="item.chartData"></s-chart>
                </div>
                <s-row class="chartName">{{item.chartName}}</s-row>
              </s-col>
              <div class="clearfix"></div>
            </s-row>
          </s-card>
        </div>
      </s-tab-pane>
      <s-tab-pane label="维护信息" v-if = "isSafetyScoreSee === false">
        <s-table-page :data="data.assetOptInfo"  max-height="658">
          <s-table-column label="会话ID" prop="sessionId" show-overflow-tooltip></s-table-column>
          <s-table-column label="会话类型" prop="sessionType" show-overflow-tooltip></s-table-column>
          <s-table-column label="操作人" prop="optUser" show-overflow-tooltip></s-table-column>
          <s-table-column label="人员所属组织机构" prop="org" show-overflow-tooltip></s-table-column>
          <s-table-column label="客户端IP" prop="clientIp" width="150" show-overflow-tooltip></s-table-column>
          <s-table-column label="目标资产IP" prop="deviceIp" show-overflow-tooltip></s-table-column>
          <s-table-column label="端口" prop="port" show-overflow-tooltip></s-table-column>
          <s-table-column label="协议" prop="protocolName" show-overflow-tooltip></s-table-column>
          <s-table-column label="账号名" prop="accountName" show-overflow-tooltip></s-table-column>
          <s-table-column label="会话时间" prop="accessTime" show-overflow-tooltip></s-table-column>
          <s-table-column label="时长" prop="longTime" show-overflow-tooltip></s-table-column>
          <s-table-column label="会话状态" prop="sessionStatus" show-overflow-tooltip></s-table-column>
          <s-table-column label="审核状态" prop="auditResult" show-overflow-tooltip></s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="安全性信息" v-if="(isAssets || (isSafetyScoreSee === false && !isAssets && assetSecurityInfo !== null))">
        <s-row>
          <s-box :data="tab4SummaryData" :bars="summaryLayout"></s-box>
        </s-row>
        <s-card  class="box-card">
          <div slot="header" class="clearfix">
              <span class="card-title">
                <i class="iconfont icon-panel"></i>
                得分详情
              </span>
          </div>
          <s-row class="scoreDetail">
            <s-row v-for="(value, key) in data.assetSecurityInfo.minWeightMap" :key="key">
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">最小权重指标</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{key}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">权重值</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{value}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-row v-for="(value, key) in data.assetSecurityInfo.minScoreMap" :key="key">
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">最小得分指标</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{key}}</div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span="12">
                <s-row>
                  <s-col span="10">
                    <div class="grid-content bg-purple">得分值</div>
                  </s-col>
                  <s-col span="14">
                    <div class="grid-content bg-purple-light">{{value}}</div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
            <s-table :data="data.assetSecurityInfo.controlPointList" style="width: 100%;">
              <s-table-column type="expand">
                <template slot-scope="scope">
                  <s-row>
                    <s-col span="10">
                      <div class="grid-content bg-purple">测评项</div>
                    </s-col>
                    <s-col span="2">
                      <div class="grid-content bg-purple">结果记录</div>
                    </s-col>
                    <s-col span="10">
                      <div class="grid-content bg-purple">说明</div>
                    </s-col>
                    <s-col span="2">
                      <div class="grid-content bg-purple">得分值</div>
                    </s-col>
                  </s-row>
                  <s-row v-for="(item, index) in scope.row.assetTestItemList" :key="index">
                    <s-col span="10" :title="item.itemName">
                      <div class="grid-content bg-purple-light textOver">
                        {{item.itemName}}
                      </div>
                    </s-col>
                    <s-col span="2">
                      <div class="grid-content bg-purple-light" @dblclick="tab4CellDbClick(item, 'result')">
                        <s-select v-model="item.result" v-if="item.showSelect" @change="resultChange(item)">
                          <s-option label="满足" value="满足"></s-option>
                          <s-option label="不满足" value="不满足"></s-option>
                        </s-select>
                        <div v-if="!item.showSelect">{{item.result}}</div>
                      </div>
                    </s-col>
                    <s-col span="10">
                      <div class="grid-content bg-purple-light" @dblclick="tab4CellDbClick(item, 'introduce')">
                        <s-input v-model="item.introduce" v-if="item.showInput" @blur="introduceSave(item)" @keyup.enter="introduceSave(item)"></s-input>
                        <div :title="item.introduce" v-if="!item.showInput" class="textOver">
                          {{item.introduce}}
                        </div>
                      </div>
                    </s-col>
                    <s-col span="2">
                      <div class="grid-content bg-purple-light">
                        {{ item.score }}
                      </div>
                    </s-col>
                  </s-row>
                </template>
              </s-table-column>
              <s-table-column prop="controlName" label="控制点名称"></s-table-column>
              <s-table-column prop="level" label="等级"></s-table-column>
              <s-table-column prop="currentScore" label="当前得分"></s-table-column>
              <s-table-column prop="weight" label="权重值"></s-table-column>
              <s-table-column prop="endScore" label="最终得分"></s-table-column>
            </s-table>
          </s-row>
        </s-card>
      </s-tab-pane>
      <s-tab-pane label="配置信息" v-if="!isAssets">
        <div>
          <s-row>
            <s-box :data="tabSummaryData" :bars="summaryLayout"></s-box>
          </s-row>
          <s-card  class="box-card">
            <div slot="header" class="clearfix">
              <span class="card-title">
                <i class="iconfont icon-panel"></i>
                配置变更信息
              </span>
            </div>
            <s-table-page :data="data.autoReviewBaselineHisStructs" :default-sort="{prop: 'updateTimeStr', order: 'descending'}">
              <s-table-column label="配置项名称" prop="attrName" show-overflow-tooltip></s-table-column>
              <s-table-column label="变更形式" prop="typeStr" show-overflow-tooltip ></s-table-column>
              <s-table-column label="变更内容" prop="content" show-overflow-tooltip width="500"></s-table-column>
              <s-table-column label="变更人" prop="userName" show-overflow-tooltip></s-table-column>
              <s-table-column label="变更时间" prop="updateTimeStr" sortable show-overflow-tooltip ></s-table-column>
            </s-table-page>
          </s-card>
        </div>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';

  import {cloneDeep} from 'lodash';
  import {Download} from 'sunflower-common-utils';
  export default {
    data() {
      return {

        activeTab: 0,
        showTab: 1,
        data: {
          assetBaseInfo: {
            customInfo: {}
          },
          assetAvaInfo: {},
          assetOptInfo: [],
          assetSecurityInfo: {
            controlPointList: [],
            minScoreMap: {},
            minWeightMap: {}
          },
          autoReviewBaselineHisStructs: []
        },
        tabUserData: [],
        tab2SummaryData: [
          {
            icon: 'screen',
            title: '',
            des: '资产名称'
          },
          {
            icon: 'config-ip',
            title: '',
            des: 'IP地址'
          },
          {
            icon: 'hardware',
            title: '',
            des: '资产类别'
          },
          {
            icon: 'not-pass',
            title: '',
            des: '资产状态'
          },
          {
            icon: 'unknow',
            title: '',
            des: '资产可用性'
          }
        ],
        tab21SummaryData: [
          {
            icon: 'screen',
            title: '',
            des: '资产名称'
          },
          {
            icon: 'config-ip',
            title: '',
            des: 'IP地址'
          },
          {
            icon: 'hardware',
            title: '',
            des: '资产型号'
          },
          {
            icon: 'not-pass',
            title: '',
            des: '资产状态'
          },
          {
            icon: 'unknow',
            title: '',
            des: '资产可用性'
          }
        ],
        tabSummaryData: [],
        tab5SummaryData: [
          {
            icon: 'screen',
            title: '',
            des: '资产名称'
          },
          {
            icon: 'config-ip',
            title: '',
            des: 'IP地址'
          },
          {
            icon: 'hardware',
            title: '',
            des: '资产类别'
          },
          {
            icon: 'not-pass',
            title: '',
            des: '资产状态'
          },
          {
            icon: 'alter',
            title: '',
            des: '配置变更数'
          }
        ],
        manageInfoData: [{
        prop: 'prop'
        },
          {
            prop: 'prop'
          }, {
            prop: 'prop'
          }],
        tab4SummaryData: [
          {
            icon: 'screen',
            title: '',
            des: '资产名称'
          },
          {
            icon: 'config-ip',
            title: '',
            des: 'IP地址'
          },
          {
            icon: 'hardware',
            title: '',
            des: '资产类别'
          },
          {
            icon: 'not-pass',
            title: '',
            des: '资产状态'
          },
          {
            icon: 'trophy',
            title: '',
            des: '安全性得分'
          }
        ],
        summaryLayout: [2, 2, 2, 2, 2],
        avaChart: [],
        isSafetyScoreSee: false,
        isAssets: true,
        assetSecurityInfo: null
      }
    },
    computed: {
      hasCustomAttr() {
        return Object.keys(this.data.assetBaseInfo.customInfo).length > 0;
      }
    },
    created() {
      this.axiosData(data => {
        for (let i in this.data) {
          this.data[i] = data[i] || this.data[i];
        }
        this.setSummaryData();
        this.setAvaChart();
        this.assetSecurityInfo = data.assetSecurityInfo
      });
      if (this.$route.query.hasOwnProperty('safetyScoreSee')) {
        this.isSafetyScoreSee = true;
      }
      if (this.$route.name === 'AssetsAll_pollingResultDetail') {
        this.isAssets = true
        this.tabSummaryData = this.tab4SummaryData
        this.tabUserData = this.tab2SummaryData
      } else {
        this.isAssets = false
        this.tabSummaryData = this.tab5SummaryData
        this.tabUserData = this.tab21SummaryData
      }
    },
    methods: {
      axiosData(callback = () => {}) {
        $axios.get(`/assetInspectHistory/view/${this.$route.params.uuid}`).then(({data}) => {
          callback(data);
        });
      },
      setSummaryData() {
        let info = this.data.assetAvaInfo;
        let summaryArr = [info.assetName, info.ipAddress];
        for (let i = 0; i < 5; i++) {
          if (i < 2) {
            this.tabUserData[i].title = summaryArr[i];
            this.tab4SummaryData[i].title = summaryArr[i];
            this.tab5SummaryData[i].title = summaryArr[i];
          } else if (i === 2) {
            this.tabUserData[i].title = this.isAssets ? info.assetType : this.data.assetBaseInfo.assetProduct;
            this.tab4SummaryData[i].title = info.assetType
            this.tab5SummaryData[i].title = this.data.assetBaseInfo.assetProduct
          } else if (i === 3) {
            this.tabUserData[i].title = this.data.assetAvaInfo.assetStatus;
            this.tab4SummaryData[i].title = this.data.assetSecurityInfo.assetStatus;
            this.tab5SummaryData[i].title = this.data.assetAvaInfo.assetStatus;
          } else {
            this.tabUserData[i].title = this.data.assetAvaInfo.avaStatus;
            this.tab4SummaryData[i].title = this.data.assetSecurityInfo.securityScore;
            this.tab5SummaryData[i].title = this.data.autoReviewBaselineHisStructs.length;
          }
        }
      },
      setAvaChart() {
        let info = this.data.assetAvaInfo;
        let chartValArr = [info.ava_6, info.ava_12, info.ava_24];
        this.avaChart = chartValArr.map((val, index) => {
          return {
            chartData: {
              name: 'chart' + index,
              itemName: '可用率',
              type: 'gaugeChart',
              width: '100%',
              height: '260px',
              data: val
            },
            chartName: '最近' + 6 * Math.pow(2, index) + '小时'
          }
        });
      },
      tab4CellDbClick(row, column) {
        if (row.isauto === 0) { // 非自动化的才可编辑
          if (column === 'result') {
            this.$set(row, 'showSelect', true)
          } else if (column === 'introduce') {
            this.$set(row, 'showInput', true)
          }
        }
      },
      resultChange(row) {
        this.axiosUpdateSec(() => {
          row.showSelect = false;
          this.axiosData(data => {
            this.data.assetSecurityInfo = data.assetSecurityInfo;
            this.setSummaryData();
          })
        });
      },
      introduceSave(row) {
        if (row.introduce.length > 20) {
          this.$message({message: '最多只能有20个字符，请重新输入！', type: 'warning'});
          return;
        }
        this.axiosUpdateSec(() => {
          row.showInput = false;
        });
      },
      axiosUpdateSec(callback) {
        let obj = cloneDeep(this.data.assetSecurityInfo);
        obj.controlPointList.forEach(item => {
          item.assetTestItemList.forEach(innerItem => {
            innerItem.showSelect && delete innerItem.showSelect;
            innerItem.showInput && delete innerItem.showInput;
          })
        });
        $axios.post(`/assetInspectHistory/updateSecurityInfo/${this.$route.params.uuid}`, obj).then(({data}) => {
          if (data === true) {
            this.$message({message: '更新成功!', type: 'success'});
            callback();
          } else {
            this.$message({message: '更新失败!', type: 'error'});
          }
        });
      },
      resultExport() {
        if (this.isSafetyScoreSee !== false) {
          if (this.$route.name === 'AssetsAll_pollingResultDetail') {
            Download(`/assetInspectHistory/export/${this.$route.params.uuid}/security`);
          } else {
            Download(`/assetInspectHistory/export/${this.$route.params.uuid}/baseline`);
          }
        } else if (this.$route.name === 'autoOps_pollingResultDetail') {
          Download(`/assetInspectHistory/export/${this.$route.params.uuid}/base_ava_opt_security_baseline`);
        } else {
          Download(`/assetInspectHistory/export/${this.$route.params.uuid}/base_ava_opt_security`);
        }
      }
    }
  }
</script>

<style lang="stylus">
  .textOver
    height 38px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
</style>
