<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-06 13:38:21
 * @LastEditTime: 2019-09-26 13:42:02
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="diy">
    <!--头部-->
    <s-header></s-header>
    <!--左侧模版／首页-->
    <div class="diy-left" :style="{left: leftLeft}">
      <div class="diy-left-menu" v-if="isOma"  :class="{'is-active': showOmaList}" @click="showList()">
        <i class="iconfont icon-home"></i>
        <div>推荐首页</div>
      </div>
      <div class="diy-left-menu" :class="{'is-active': activeMenu === 1}" @click="handleMenuClick(1)">
        <i class="iconfont icon-add-column"></i>
        <div>内置模版</div>
      </div>
      <div class="diy-left-menu" :class="{'is-active': activeMenu === 2}" @click="handleMenuClick(2)">
        <i class="iconfont icon-engine-room"></i>
        <div>自定义模版</div>
      </div>
      <div class="diy-left-menu" v-if="isShow" :class="{'is-active': activeMenu === 3||activeMenu === 4}" @click="handleMenuClick(3)">
        <i class="iconfont icon-add-column"></i>
        <div>当前模版</div>
      </div>

      <div style="flex: 1"></div>
      <div class="diy-left-menu is-active" @click="handleLockClick">
        <i class="iconfont icon-deblock"></i>
      </div>
    </div>
    <!--权限模块列表-->
    <div class="diy-drawer-left" :style="{left: drawerLeft}">
      <div v-for="items in drawerData" :key="items.name">
        <h3>{{items.name}}</h3>
        <s-row>
          <draggable
            :list="items.children"
            :move="onMove"
            :options="{group: { name: 'people', pull: 'clone', put: false }, sort: false }">
            <template v-for="item in items.children">
              <s-col span="12" :key="item.uuid">
                <i :class="item.disabled ? 'iconfont icon-position' : 'iconfont icon-out-column'"></i>
                <span :title="item.name">{{item.name}}</span>
              </s-col>
            </template>
          </draggable>
        </s-row>
      </div>
      <div v-if="drawerData.length === 0">无可自定义模块</div>
    </div>
    <!--选择人员 资产 视角-->
    <div class="diy-right-a" v-if="activeMenu === 1" key="1">
      <div :style="{width: spaceWidth}"></div>
      <div class="diy-right-a-set">
        <div class="diy-right-a-card">
          <i class="iconfont icon-account-only"></i>
          <h3>人员视角-模版</h3>
          <div class="desc">账号信息、权限清单、运维资产、流程审批</div>
          <s-button @click="handleNext('user')" :disabled="!hasDiyUser">下一步</s-button>
        </div>
        <div style="width: 30px"></div>
        <div class="diy-right-a-card">
          <i class="iconfont icon-nav-asset-monitor"></i>
          <h3>资产管理视角-模版</h3>
          <div class="desc">资产发现、资产管理、资产监控、运维脚本</div>
          <s-button @click="handleNext('asset')" :disabled="!hasDiyAsset">下一步</s-button>
        </div>
      </div>
    </div>
    <div :style={paddingLeft:spaceWidth} v-else-if="activeMenu === 4" key="4">
      <div :style="{width: spaceWidth}"></div>
      <div v-if="uaMode === 'safeadministrator'">
        <s-grid>
            <!-- <s-grid-item> -->
              <diy-safeadministrator v-if="isSafeAdministrator===true" />
            <!-- </s-grid-item> -->
        </s-grid>
        <s-footer />
      </div>
      <div v-else-if="uaMode === 'omateamLeader'">
        <s-grid>
            <s-grid-item>
              <diy-omateamLeader v-if="isOMATeamLeader===true" />
            </s-grid-item>
        </s-grid>
        <s-footer/>
      </div>
      <div v-else-if="uaMode === 'omaadministrator'">
        <s-grid>
          <s-grid-item>
            <diy-omaadministrator v-if="isSystemAdmin===true" />
          </s-grid-item>
        </s-grid>
        <s-footer style="z-index:1"/>
      </div>
      <div v-else-if="uaMode === 'omaoperation'">
        <s-grid>
          <s-grid-item>
            <diy-omaoperation v-if="isOperation===true" />
          </s-grid-item>
        </s-grid>
        <s-footer/>
      </div>
      <div v-else-if="uaMode === 'auditadministrator'">
            <diy-auditadministrator style="z-index:1" v-if="isAuditAdministrator===true" />
        <s-footer/>
      </div>
    </div>
    <!--人员 资产 视角-->
    <div class="diy-right-a" v-else-if="activeMenu === 3" key="3">
      <div :style="{width: spaceWidth}"></div>

      <!--人员视角页-->
      <div class="diy-user" v-if="uaMode === 'user'">
        <s-grid>
          <div style="width: 295px;">
            <s-grid direction="column">
              <div style="height: 216px; padding: 17px 2px 7px 12px; box-sizing: border-box">
                <diy-user-info/>
              </div>
              <s-grid-item :flex="1" style="padding: 3px 10px 0 20px">
                <diy-user-list/>
              </s-grid-item>
            </s-grid>
          </div>
          <s-grid-item :flex="1">
            <s-grid direction="column">
              <div style="height: 410px">
                <s-grid direction="row">
                  <s-grid-item :flex="1">
                    <s-grid direction="column">
                      <div style="height: 210px; padding: 20px 10px 10px 10px; box-sizing: border-box">
                        <diy-user-permission/>
                      </div>
                      <s-grid-item :flex="1" style="padding: 10px 10px 10px 10px; box-sizing: border-box">
                        <diy-user-ops-log/>
                      </s-grid-item>
                    </s-grid>
                  </s-grid-item>
                  <s-grid-item :flex="1">
                    <s-grid direction="column">
                      <s-grid-item style="height: 210px; padding: 20px 20px 10px 10px; box-sizing: border-box">
                        <diy-user-process-todo/>
                      </s-grid-item>
                      <s-grid-item :flex="1" style="padding: 10px 20px 10px 10px; box-sizing: border-box">
                        <diy-user-ops-asset/>
                      </s-grid-item>
                    </s-grid>
                  </s-grid-item>
                </s-grid>
              </div>
              <s-grid-item :flex="1" style="padding: 10px 20px 0 10px; box-sizing: border-box">
                <diy-user-process-order/>
              </s-grid-item>
            </s-grid>
          </s-grid-item>
        </s-grid>
        <s-footer/>
      </div>
      <!--资产视角页-->
      <div class="diy-asset" v-else-if="uaMode === 'asset'">
        <s-grid>
          <s-grid-item :flex="1">
            <s-grid direction="column">
              <s-grid-item :flex="1" style="padding: 10px;">
                <diy-asset-asset-manage/>
              </s-grid-item>
              <s-grid-item :felx="1" style="padding: 10px;">
                <diy-asset-asset-list/>
              </s-grid-item>
            </s-grid>
          </s-grid-item>
          <s-grid-item :flex="1">
            <s-grid direction="column">
              <s-grid-item :flex="1" style="padding: 10px;">
                <diy-asset-asset-monitor/>
              </s-grid-item>
              <s-grid-item :felx="1" style="padding: 10px;">
                <diy-asset-ops-script/>
              </s-grid-item>
            </s-grid>
          </s-grid-item>
        </s-grid>
        <s-footer/>
      </div>

      <!--单注册模块-多角色-->
      <div class="diy-imp-siem-dba" v-else-if="['imp', 'siem', 'dba'].includes(uaMode)"></div>
      <!--单注册IMP-安全管理员-->
      <div class="diy-imp-safe" v-else-if="uaMode === 'imp-safe'">
        <s-grid direction="column">
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 20px 10px 10px 20px">
                <diy-single-event-monitor />
              </s-grid-item>
              <s-grid-item style="padding: 20px 10px 10px 10px">
                <diy-single-monitor-alarm />
              </s-grid-item>
              <s-grid-item style="padding: 20px 20px 10px 10px">
                <diy-single-asset-alarm />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 10px 20px 20px">
                <event-day />
              </s-grid-item>
              <s-grid-item style="padding: 10px 10px 20px 10px">
                <event-week />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <event-month />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
        </s-grid>
      </div>
      <!--单注册IMP-审计管理员-->
      <div class="diy-imp-audit" v-else-if="uaMode === 'imp-audit'">
        <s-grid direction="column">
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 20px 10px 10px 20px">
                <diy-single-event-monitor />
              </s-grid-item>
              <s-grid-item style="padding: 20px 10px 10px 10px">
                <diy-single-monitor-alarm />
              </s-grid-item>
              <s-grid-item style="padding: 20px 20px 10px 10px">
                <diy-single-event-recover :type="1" :system="1"/>
              </s-grid-item>
            </s-grid>
          </s-grid-item>
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 10px 20px 20px">
                <diy-single-asset-event />
              </s-grid-item>
              <s-grid-item style="padding: 10px 10px 20px 10px">
                <diy-single-asset-alarm />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-single-event-recover :type="0" :system="1"/>
              </s-grid-item>
            </s-grid>
          </s-grid-item>
        </s-grid>
      </div>
      <!--单注册IMP-系统管理员-->
      <div class="diy-imp-sys" v-else-if="uaMode === 'imp-sys'">
        <s-grid direction="column">
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 20px 10px 10px 20px">
                <diy-single-asset-monitor />
              </s-grid-item>
              <s-grid-item style="padding: 20px 10px 10px 10px">
                <monitor-attention />
              </s-grid-item>
              <s-grid-item style="padding: 20px 20px 10px 10px">
                <diy-single-event-monitor />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 10px 20px 20px">
                <monitor-rank-top10 />
              </s-grid-item>
              <s-grid-item style="padding: 10px 10px 20px 10px">
                <monitor-service-manage />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-single-sys-status />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
        </s-grid>
      </div>
      <!--单注册IMP-监控运维人员-->
      <div class="diy-imp-ops" v-else-if="uaMode === 'imp-ops'">
        <s-grid direction="column">
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 20px 10px 10px 20px">
                <diy-single-asset-monitor />
              </s-grid-item>
              <s-grid-item style="padding: 20px 10px 10px 10px">
                <monitor-attention />
              </s-grid-item>
              <s-grid-item style="padding: 20px 20px 10px 10px">
                <diy-single-event-monitor />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 10px 20px 20px">
                <monitor-rank-top10 />
              </s-grid-item>
              <s-grid-item style="padding: 10px 10px 20px 10px">
                <monitor-service-manage />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-single-event-recover :type="0" :system="1"/>
              </s-grid-item>
            </s-grid>
          </s-grid-item>
        </s-grid>
      </div>

      <!--单注册SIEM-安全管理员-->
      <div class="diy-siem-safe" v-else-if="uaMode === 'siem-safe'">
        <s-grid direction="column">
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-siem-log-level />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-siem-log-event />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-potential-hazards />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <event-day />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <event-week />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <event-month />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
        </s-grid>
      </div>
      <!--单注册SIEM-审计管理员-->
      <div class="diy-siem-audit" v-else-if="uaMode === 'siem-audit'">
        <s-grid direction="column">
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-siem-log-level />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-siem-log-quantity-time />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-siem-log-event />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-siem-log-source />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-potential-hazards />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-single-asset-event />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
        </s-grid>
      </div>
      <!--单注册SIEM-系统管理员-->
      <div class="diy-siem-sys" v-else-if="uaMode === 'siem-sys'">
        <s-grid direction="column">
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-siem-log-level />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-siem-log-quantity-time />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-siem-log-event />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-siem-log-source />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-potential-hazards />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-single-sys-status />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
        </s-grid>
      </div>
      <!--单注册SIEM-日志运维人员-->
      <div class="diy-siem-ops" v-else-if="uaMode === 'siem-ops'">
        <s-grid direction="column">
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-siem-log-level />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-siem-log-quantity-time />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-siem-log-event />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-siem-log-source />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-single-asset-event />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-single-event-recover :system="4"/>
              </s-grid-item>
            </s-grid>
          </s-grid-item>
        </s-grid>
      </div>

      <!--单注册DBA-安全管理员-->
      <div class="diy-dba-safe" v-else-if="uaMode === 'dba-safe'">
        <s-grid direction="column">
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-dba-audit-event />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-dba-audit-warning />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-dba-most-alarm />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <event-day />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <event-week />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <event-month />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
        </s-grid>
      </div>
      <!--单注册DBA-审计管理员-->
      <div class="diy-dba-audit" v-else-if="uaMode === 'dba-audit'">
        <s-grid direction="column">
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-dba-audit-record-time />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-dba-warning-record-time />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-dba-audit-event />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item :flex="2" style="padding: 10px 20px 20px 10px">
                <diy-dba-audit-target />
              </s-grid-item>
              <s-grid-item :flex="1" style="padding: 10px 20px 20px 10px">
                <diy-single-event-recover :type="2" :system="2"/>
              </s-grid-item>
            </s-grid>
          </s-grid-item>
        </s-grid>
      </div>
      <!--单注册DBA-系统管理员-->
      <div class="diy-dba-sys" v-else-if="uaMode === 'dba-sys'">
        <s-grid direction="column">
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-dba-audit-record-time />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-dba-warning-record-time />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-dba-audit-event />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item :flex="2" style="padding: 10px 20px 20px 10px">
                <diy-dba-audit-target />
              </s-grid-item>
              <s-grid-item :flex="1" style="padding: 10px 20px 20px 10px">
                <diy-single-sys-status />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
        </s-grid>
      </div>
      <!--单注册DBA-DBA运维人员-->
      <div class="diy-dba-ops" v-else-if="uaMode === 'dba-ops'">
        <s-grid direction="column">
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-dba-audit-record-time />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-dba-warning-record-time />
              </s-grid-item>
              <s-grid-item style="padding: 10px 20px 20px 10px">
                <diy-dba-audit-event />
              </s-grid-item>
            </s-grid>
          </s-grid-item>
          <s-grid-item :flex="1">
            <s-grid>
              <s-grid-item :flex="2" style="padding: 10px 20px 20px 10px">
                <diy-dba-audit-target />
              </s-grid-item>
              <s-grid-item :flex="1" style="padding: 10px 20px 20px 10px">
                <diy-single-event-recover :type="2" :system="2"/>
              </s-grid-item>
            </s-grid>
          </s-grid-item>
        </s-grid>
      </div>
    </div>

    <!--无模版自定义首页-->
    <div class="diy-right-b" v-else key="2" style="overflow-y:auto;">
      <div :style="{width: spaceWidth}"></div>
      <draggable
        :list="diyData"
        :options="{group: 'people', draggable: '.portlet'}"
        style="flex: 1; overflow-y: auto">
        <div v-for="(item, index) in diyData" :key="index" :style="{ width: item.width, height: item.height }" class="portlet" @click="handlePress(item.breadcrumb)">
          <template v-if="item !== 'null'">
            <component :is="item.component"></component>
          </template>
          <i class="iconfont icon-error-bold diy-right-b-close" v-if="(mode !== 'view') && (item !== 'null')" @click="handleDelete(item)"></i>
        </div>
      </draggable>
    </div>

    <!--底部保存条-->
    <div class="diy-drawer-bottom" :style="{bottom: bottom}">
      <div style="display: inline-block">确定保存自定义首页？解锁即可再次编辑。</div>
      <s-button @click="handleLockSave">保存</s-button>
      <s-button type="cancel" @click="handleLockCancel">取消</s-button>
    </div>
    <!--左下角解锁按钮-->
    <div class="diy-unlock is-active" style="z-index:10" @click="handleUnlockClick" v-if="mode === 'view'">
      <i class="iconfont icon-lock"></i>
    </div>
    <!-- 推荐首页 -->
    <div class="Recommend" v-if="showOmaList">
      <div v-if="isOperation" class="Recommend_a" @click="handlerem('omaoperation',0)"><div class="boxa"><div v-show="color === 0" class="icon iconfont icon-correct"></div></div><div class="font">运维人员</div></div>
      <div v-if="isOMATeamLeader" class="Recommend_a" @click="handlerem('omateamLeader',1)"><div class="boxa"><div v-show="color === 1" class="icon iconfont icon-correct"></div></div><div class="font">团队主管</div></div>
      <div v-if="isAuditAdministrator" class="Recommend_a" @click="handlerem('auditadministrator',2)"><div class="boxa"><div v-show="color === 2" class="icon iconfont icon-correct"></div></div><div class="font">审计管理员</div></div>
      <div v-if="isSystemAdmin" class="Recommend_a" @click="handlerem('omaadministrator',3)"><div class="boxa"><div v-show="color === 3" class="icon iconfont icon-correct"></div></div><div class="font">系统管理员</div></div>
      <div v-if="isSafeAdministrator" class="Recommend_a" @click="handlerem('safeadministrator',4)"><div class="boxa"><div v-show="color === 4" class="icon iconfont icon-correct"></div></div><div class="font">安全管理员</div></div>
    </div>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import draggable from 'vuedraggable';
  import Header from '@/components/header/Header';
  import Footer from '@/components/footer/Footer';
  import COMPONENT from '@/common/utils/component';
  import roleCheckMixin from '@/common/mixins/roleCheckMixin'
  import authCheck from '@/common/mixins/auth.js'

  export default {
    mixins: [roleCheckMixin, authCheck],
    components: {
      draggable,
      's-header': Header,
      's-footer': Footer
    },
    data() {
      return {
        showOmaList: false,
        color: 0,
        Jurisdiction: [],
        isShow: false,
        isOma: false,
        activeMenu: 2,        // 控制显示 人员资产视角／自定义
        mode: 'view',         // edit, view
        tmplType: '',         // 人员／资产
        roles: [],            // 单模块下的多角色
        diyData: [],          // 自定义数据
        drawerData: [],       // 左侧树
        leftLeft: '-60px',    // 左侧菜单
        drawerLeft: '-320px', // 左侧树
        bottom: '-59px',      // 底部保存条
        spaceWidth: 0,        // 左侧菜单占位
        componentList: []     // 服务器端存储的自定义页面
      }
    },

    computed: {
      userUuid() {
        return this.$store.state.userData.uuid;
      },

      hasDiyUser() {
        return this.OmaAuth && this.DbaAuth && this.WorkFlowAuth;
      },

      hasDiyAsset() {
        return this.ImpAuth && this.OmaAuth && this.AutoAuth;
      },

      uaMode() { // 模版 '', user, asset, imp, imp-safe, imp-audit, imp-sys, imp-ops, siem, siem-safe, siem-audit, siem-sys, siem-ops, dba, dba-safe, dba-audit, dba-sys, dba-ops
        if (this.isShow) {
          if (this.tmplType === 'user') {
            return 'user';
          } else if (this.tmplType === 'asset') {
            return 'asset';
          } else if (this.tmplType === 'omateamLeader') {
            return 'omateamLeader';
          } else if (this.tmplType === 'omaoperation') {
            return 'omaoperation';
          } else if (this.tmplType === 'omaadministrator') {
            return 'omaadministrator';
          } else if (this.tmplType === 'safeadministrator') {
            return 'safeadministrator';
          } else if (this.tmplType === 'auditadministrator') {
            return 'auditadministrator';
          }
        }
        if (this.componentList.length > 0) { // 已设置自定义首页
          if (this.componentList[0].component === 'diy-user') {
            return 'user';
          } else if (this.componentList[0].component === 'diy-asset') {
            return 'asset';
          } else if (this.componentList[0].component === 'diy-omateamLeader') {
            return 'omateamLeader';
          } else if (this.componentList[0].component === 'diy-omaoperation') {
            return 'omaoperation';
          } else if (this.componentList[0].component === 'diy-omaadministrator') {
            return 'omaadministrator';
          } else if (this.componentList[0].component === 'diy-safeadministrator') {
            return 'safeadministrator';
          } else if (this.componentList[0].component === 'diy-auditadministrator') {
            return 'auditadministrator';
          } else if (this.componentList[0].component.indexOf('imp') !== -1 || this.componentList[0].component.indexOf('siem') !== -1 || this.componentList[0].component.indexOf('dba') !== -1) {
            return this.componentList[0].component;
          } else {
            if (this.tmplType === 'user') {
              return 'user';
            } else if (this.tmplType === 'asset') {
              return 'asset';
            } else if (this.tmplType === 'omateamLeader') {
              return 'omateamLeader';
            } else if (this.tmplType === 'omaoperation') {
              return 'omaoperation';
            } else if (this.tmplType === 'omaadministrator') {
              return 'omaadministrator';
            } else if (this.tmplType === 'safeadministrator') {
              return 'safeadministrator';
            } else if (this.tmplType === 'auditadministrator') {
              return 'auditadministrator';
            } else {
              return '';
            }
          }
        } else {
          // 未设置自定义首页
          let registerModelList = this.$store.state.userData.registerModelList;
          let roleList = this.$store.state.userData.roleName.split(',');
          if (registerModelList.length === 1) { // 注册了单模块
            if (registerModelList[0] === 'IMP') {
              let multiRole = this.multiRole(roleList, 'imp');
              if (multiRole.length === 1) {
                return multiRole[0].class;
              } else {
                this.roles = multiRole;
                return 'imp';
              }
            } else if (registerModelList[0] === 'SIEM') {
              let multiRole = this.multiRole(roleList, 'siem');
              if (multiRole.length === 1) {
                return multiRole[0].class;
              } else {
                this.roles = multiRole;
                return 'siem';
              }
            } else if (registerModelList[0] === 'DBA') {
              let multiRole = this.multiRole(roleList, 'dba');
              if (multiRole.length === 1) {
                return multiRole[0].class;
              } else {
                this.roles = multiRole;
                return 'dba';
              }
            } else {
              return '';
            }
          } else { // 注册了多模块
            if (this.tmplType === 'user') {
              return 'user';
            } else if (this.tmplType === 'asset') {
              return 'asset';
            } else if (this.tmplType === 'omateamLeader') {
              return 'omateamLeader';
            } else if (this.tmplType === 'omaoperation') {
              return 'omaoperation';
            } else if (this.tmplType === 'omaadministrator') {
              return 'omaadministrator';
            } else if (this.tmplType === 'safeadministrator') {
              return 'safeadministrator';
            } else if (this.tmplType === 'auditadministrator') {
              return 'auditadministrator';
            } else {
              return '';
            }
          }
        }
      }
    },

    watch: {
      diyData: function(val) {
      this.setList(val);
      }
    },

    created() {
      // 判断是否是单注册OMA
      if (this.$store.state.userData.registerModelList.length === 1 && this.$store.state.userData.registerModelList[0] === 'OMA') {
          this.isOma = true
      }
      // todo： 临时处理 - 自己造权限数据
      // this.$store.commit('SET_MODEL', ['IMP']);  // 单模块   ['IMP', 'SIEM', 'DBA']
      // this.$store.commit('SET_ROLE', '系统管理员'); // 模块下的角色 '安全管理员，审计管理员，系统管理员，日志运维人员'
      this.getDiy();
  },

    methods: {
      showList() {
        this.showOmaList = true;
        this.drawerLeft = '-320px'
        this.activeMenu = 4
        if (this.Jurisdiction.length <= 0) {
          let role = [ {state: this.isOperation}, {state: this.isOMATeamLeader}, {state: this.isAuditAdministrator}, {state: this.isSystemAdmin}, {state: this.isSafeAdministrator} ]
          for (let i = 0; i < role.length; i++) {
             if (role[i].state === true && i === 0) {
              this.activeMenu = 4;
              this.tmplType = 'omaoperation';
              this.color = i
              return false
              }
            if (role[i].state === true && i === 1) {
                this.activeMenu = 4;
                this.tmplType = 'omateamLeader';
                this.color = i
                return false
              }
              if (role[i].state === true && i === 2) {
                this.activeMenu = 4;
                this.tmplType = 'auditadministrator';
                this.color = i
                return false
              }
              if (role[i].state === true && i === 3) {
                this.activeMenu = 4;
                this.tmplType = 'omaadministrator';
                this.color = i
                return false
              }
              if (role[i].state === true && i === 4) {
                this.activeMenu = 4;
                this.tmplType = 'safeadministrator';
                this.color = i
                return false
              }
          }
        }
      },
      go() {
        this.$router.push('/AccountManage/Operation');
      },
      // 记录操作模块，供记录日志使用
      handlePress(name) {
        localStorage.diyBreadcrumb = name;
      },
      // 获取服务端自定义数据
      getDiy() {
        $axios.get(`/topHomeCustom/getCustoms/${this.userUuid}`).then((res) => {
          this.Jurisdiction = res.data
          if (res.data && res.data instanceof Array) {
            this.componentList = res.data;
            if (this.componentList.length !== 0) {
              if (this.componentList[0].name === '团队主管') {
                this.color = 1
              } else if (this.componentList[0].name === '运维人员') {
                this.color = 0
              } else if (this.componentList[0].name === '系统管理员') {
                this.color = 3
              } else if (this.componentList[0].name === '安全管理员') {
                this.color = 4
              } else if (this.componentList[0].name === '审计管理员') {
                this.color = 2
              }
            }
          }
          this.getTree();
        });
      },
      // 权限列表树筛选
      getTree() {
        $axios.get(`/iamUserInfo/getMenuTreeByUser/${this.userUuid}`).then((res) => {
          let list = [];
          let arr = res.data.filter(item => {
            return ['报表中心', '系统设置'].indexOf(item.name) === -1;
          });
          for (let i = 0; i < arr.length; i++) {
            let type = arr[i].name;
            list.push({
              name: type,
              children: []
            });
            for (let j = 0; j < arr[i].childrenList.length; j++) {
              if (arr[i].childrenList[j].node.shape < 4) {
                let name = arr[i].childrenList[j].name;
                let component = COMPONENT[type][name];
                if (component === undefined) {
                  console.log(`自定义首页模块不存在: ${name}`);
                } else {
                  list[i].children.push({
                    name: name,
                    component: component.name,
                    disabled: false,
                    parentIdx: i,
                    width: component.width,
                    height: component.height,
                    breadcrumb: `${type}>${name}`
                  });
                }
              }
            }
          }
          this.drawerData = list;
          this.getMode();
        });
      },
      // 分析结果，确定模式 mode
      getMode() {
        if (this.componentList.length > 0) {
          this.mode = 'view';
          if (this.componentList[0] && this.componentList[0].component === 'diy-user') {
            // 人员视角
            this.isShow = true;
            this.activeMenu = 3;
            this.diyData = [];
          } else if (this.componentList[0] && this.componentList[0].component === 'diy-asset') {
            // 资产视角
            this.isShow = true;
            this.activeMenu = 3;
            this.diyData = [];
          } else if (this.componentList[0] && this.componentList[0].component === 'diy-omateamLeader') {
              this.isShow = true;
              this.activeMenu = 4;
              this.diyData = [];
          } else if (this.componentList[0] && this.componentList[0].component === 'diy-safeadministrator') {
            // 单注册oma 安全管理员
            this.isShow = true;
            this.activeMenu = 4;
            this.diyData = [];
          } else if (this.componentList[0] && this.componentList[0].component === 'diy-omaadministrator') {
            // 单注册oma 系统管理员
            this.isShow = true;
            this.activeMenu = 4;
            this.diyData = [];
          } else if (this.componentList[0] && this.componentList[0].component === 'diy-omaoperation') {
            // 单注册oma 运维管理员
            this.isShow = true;
            this.activeMenu = 4;
            this.diyData = [];
          } else if (this.componentList[0] && this.componentList[0].component === 'diy-auditadministrator') {
            // 单注册oma 审计管理员
            this.isShow = true;
            this.activeMenu = 4;
            this.diyData = [];
          } else {
            this.isShow = false;
            this.mode = 'view';
            this.activeMenu = 2;
            this.diyData = this.componentList;
          }
        } else { // 无数据，进入编辑模式
            if (this.uaMode.indexOf('imp') !== -1 || this.uaMode.indexOf('dba') !== -1 || this.uaMode.indexOf('siem') !== -1) {
            // 单独注册视角
            this.isShow = true;
            this.activeMenu = 3;
            this.diyData = [];
            let roleList = this.$store.state.userData.roleName.split(',');
            if (roleList[0] === '超级管理员') {
              this.isShow = false;
              this.mode = 'edit';
              this.activeMenu = 2;
              this.leftLeft = 0;
              this.spaceWidth = '60px';
              this.drawerLeft = '60px';
            }
          } else {
            this.isShow = false;
            this.mode = 'edit';
            this.leftLeft = 0;
            this.spaceWidth = '60px';
            this.drawerLeft = '60px';
          }
      }
      },
      // 左侧菜单点击，切换人员资产视角／自定义
      handleMenuClick(num) {
        this.showOmaList = false;
        let vm = this;
        this.activeMenu = num;
        if (num === 1 || num === 2) { // 如果当前模板没有保存，点击内置模板或者自定义模板隐藏当前模板按钮。
          let arr = vm.componentList;
          if (arr.length) {
            let flag = false;
            arr.forEach(function(item) {
              if (item.name === '人员视角' || item.name === '资产视角') {
                flag = true;
              }
            })
            if (flag) {
              vm.isShow = true;
            } else {
              // vm.isShow = false;
            }
          } else {
            // vm.isShow = false;
          }
        }

        if (num === 2) { // 显示／隐藏左侧权限列表树
          this.drawerLeft = this.drawerLeft === '60px' ? '-320px' : '60px';
        } else if (num === 1) {
          this.drawerLeft = '-320px';
          this.mode = 'edit';
        } else {
          this.drawerLeft = '-320px';
          this.mode = 'edit';
          this.tmplType = '';
        }
      },

      handleLockClick() {
        if (this.mode === 'view') {
          this.mode = 'edit';
        } else {
          if (this.activeMenu === 1) {
            this.$message({type: 'error', message: '请选择模版'});
          } else {
            // 弹出 drawer-bottom
            this.drawerLeft = '-320px';
            this.bottom = 0;
          }
        }
      },

      handleLockSave() {
        this.drawerLeft = '-320px';
        if (this.activeMenu === 3) {
          if (this.uaMode === 'user') {
            this.diyData = [{
              name: '人员视角',
              component: 'diy-user',
              parentIdx: 0
            }];
          } else if (this.uaMode === 'asset') {
            this.diyData = [{
              name: '资产视角',
              component: 'diy-asset',
              parentIdx: 0
            }]
          } else if (this.uaMode.indexOf('imp') !== -1 || this.uaMode.indexOf('dba') !== -1 || this.uaMode.indexOf('siem') !== -1) {
            this.diyData = [{
              name: '单独注册视角',
              component: this.uaMode,
              parentIdx: 0
            }]
          }
        } else if (this.activeMenu === 4) {
          if (this.uaMode === 'omaadministrator') {
            this.diyData = [{
              name: '系统管理员',
              component: 'diy-omaadministrator',
              parentIdx: 0
            }];
          }
          if (this.uaMode === 'safeadministrator') {
            this.diyData = [{
              name: '安全管理员',
              component: 'diy-safeadministrator',
              parentIdx: 0
            }];
          }
          if (this.uaMode === 'omaoperation') {
            this.diyData = [{
              name: '运维人员',
              component: 'diy-omaoperation',
              parentIdx: 0
            }];
          }
          if (this.uaMode === 'omateamLeader') {
            this.diyData = [{
              name: '团队主管',
              component: 'diy-omateamLeader',
              parentIdx: 0
            }];
          }
          if (this.uaMode === 'auditadministrator') {
            this.diyData = [{
              name: '审计管理员',
              component: 'diy-auditadministrator',
              parentIdx: 0
            }];
          }
        }
        $axios.post(`/topHomeCustom/saveCustoms/${this.userUuid}`, this.diyData).then((res) => {
          if (res.data && res.data.state === true) {
            this.mode = 'view';
            this.bottom = '-59px';
            this.leftLeft = '-60px';
            this.spaceWidth = 0;
            this.showOmaList = false
            this.$message({type: 'success', message: '保存成功'});
            this.getDiy();
          } else {
            this.$message({type: 'error', message: '保存失败'});
          }
        })
      },

      handleLockCancel() {
        this.mode = 'edit';
        this.bottom = '-59px';
      },

      handleUnlockClick() {
        this.mode = 'edit';
        this.leftLeft = 0;
        this.spaceWidth = '60px';
      },

      handleDelete(item) {
        this.diyData.splice(this.diyData.indexOf(item), 1);
      },

      handleNext(mode) {
        this.activeMenu = 3;
        this.isShow = true;
        this.tmplType = mode;
      },
      handlerem(mode, col) {
        this.activeMenu = 4;
        this.isShow = true;
        this.showOmaList = false;
        this.tmplType = mode;
        this.color = col
      },

      setList(diyData) {
        this.resetData();
        for (let i = 0; i < diyData.length; i++) {
          let children = this.drawerData[diyData[i].parentIdx].children;
          for (let j = 0; j < children.length; j++) {
            if (children[j].name === diyData[i].name) {
              children[j].disabled = true;
            }
          }
        }
      },

      resetData() {
        for (let i = 0; i < this.drawerData.length; i++) {
          for (let j = 0; j < this.drawerData[i].children.length; j++) {
            this.drawerData[i].children[j].disabled = false;
          }
        }
      },

      onMove({ draggedContext }) {
        return (!!draggedContext.element && !!draggedContext.element.component && !draggedContext.element.disabled)
      },
      // 单模块的多角色检测
      multiRole(roles, prefix) {
        let items = [
          { name: '安全管理员', class: `${prefix}-safe` },
          { name: '审计管理员', class: `${prefix}-audit` },
          { name: '系统管理员', class: `${prefix}-sys` },
          { name: '运维人员', class: `${prefix}-ops` },
          { name: '日志运维人员', class: `${prefix}-ops` },
          { name: '监控运维人员', class: `${prefix}-ops` },
          { name: 'DBA运维人员', class: `${prefix}-ops` }
        ];
        return items.filter(item => {
          return roles.includes(item.name);
        });
      }
    }
  }
</script>

<style>
  .diy {
    height: 100%;
    width: 100%;
    display: flex;
    min-width: 1200px;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
  .diy-left {
    width: 60px;
    height: calc(100% - 45px);
    position: fixed;
    left: -60px;
    top: 45px;
    overflow: hidden;
    z-index: 9991;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
  }
  .diy-left-menu {
    text-align: center;
    padding-top: 12px;
    padding-bottom: 12px;
    background-color: transparent;
  }
  .diy-left-menu .iconfont {
    font-size: 32px;
  }
  .diy-left-menu div {
    font-size: 14px;
  }
  .diy-right-a {
    flex: 1;
    display: flex;
    flex-direction: row;
  }
  .diy-right-a-set {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .diy-user,
  .diy-asset,
  .diy-imp-safe,
  .diy-imp-sys,
  .diy-imp-audit,
  .diy-imp-ops,
  .diy-siem-safe,
  .diy-siem-audit,
  .diy-siem-sys,
  .diy-siem-ops,
  .diy-dba-safe,
  .diy-dba-audit,
  .diy-dba-sys,
  .diy-dba-ops{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .diy-user>.s-grid,
  .diy-asset>.s-grid,
  .diy-asset>.s-grid {
    height: calc(100% - 66px);
  }
  .diy-right-a-card {
    width: 360px;
    text-align: center;
    padding: 40px 10px 34px 10px;
  }
  .diy-right-a-card .iconfont {
    font-size: 80px;
  }
  .diy-right-a-card h3 {
    font-size: 18px;
    font-weight: 800;
    margin-top: 20px;
  }
  .diy-right-a-card .desc {
    font-size: 14px;
  }
  .diy-right-a-card .s-button {
    width: 60%;
    margin-top: 28px;
  }
  .diy-drawer-left {
    width: 320px;
    height: calc(100% - 45px);
    position: fixed;
    left: -320px;
    top: 45px;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 9990;
    transition: all 0.2s;
  }
  .diy-drawer-left>div {
    padding-left: 20px;
    padding-right: 10px;
  }
  .diy-drawer-left h3 {
    font-size: 18px;
    height: 42px;
    line-height: 42px;
  }
  .diy-drawer-left .s-col {
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    cursor: move;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .diy-right-b {
    flex: 1;
    display: flex;
    flex-direction: row;
  }
  .diy-right-b-close {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 22px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
  .diy-right-b-close:before {
    position: absolute;
    top: 2px;
    right: 3px;
  }
  .diy-right-b .s-row {
    margin: 0;
  }
  .diy-right-b .s-card {
    /* background-color: white; TODO: 处理颜色 */
    width: calc(100% - 18px);
    height: calc(100% - 14px);
  }
  .diy-right-b .s-card-body {
    height: calc(100% - 32px);
  }
  .diy-drawer-bottom {
    width: calc(100% - 60px);
    height: 59px;
    line-height: 59px;
    position: fixed;
    bottom: -59px;
    right: 0;
    overflow: hidden;
    z-index: 9991;
    transition: all 0.3s;
    text-align: center;
  }
  .diy-unlock {
    position: absolute;
    left: -40px;
    bottom: -45px;
    opacity: 0.5;
    width: 100px;
    height: 100px;
    border-radius: 40px;
  }
  .diy-unlock:hover {
    opacity: 1;
  }
  .diy-unlock .iconfont {
    font-size: 32px;
  }
  .diy-unlock .iconfont:before {
    position: absolute;
    bottom: 50px;
    left: 50px;
  }
  .diy .portlet {
    position: relative;
    float: left;
  }
  .diy .portlet>div {
    width: calc(100% - 8px);
    height: calc(100% - 8px);
    padding: 4px;
  }
  .Recommend{
    position: absolute;
    background:#041729;
    color:#fff;
    margin:60px 0 0 60px;
    border-radius: 0 5px 5px 0;
    z-index: 10
  }
  .Recommend .Recommend_a {
    width:200px;
    height:40px;
    line-height:40px;
    cursor: pointer;
  }
  .Recommend .Recommend_a .boxa {
    width:20px;
    height: 40px;
    margin-left:20px;
    color: orange;
    float: left;
  }
  .Recommend .Recommend_a .font {
    margin-left:20px;
    float: left;
  }
</style>
