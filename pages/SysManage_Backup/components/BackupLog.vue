<!--
 * @Author: shifeng
 * @Email: shifeng199307@gmail.com
 * @Date: 2019-02-14 10:42:19
 * @LastEditors: shifeng
 * @LastEditEmail: shifeng199307@gmail.com
 * @LastEditTime: 2019-02-28 13:39:07
 * @Description: 备份日志tab
 -->

<template>
  <div>
    <!-- 头部搜索框 -->
      <s-form :inline="true" :model="searchForm" class="search_form" label-width='85px' style="margin-bottom:10px">
        <div>
          <s-form-item label="备份类型：">
              <s-select v-model="searchForm.type" clearable>
                <s-option label="本地备份" :value="0"></s-option>
                <s-option label="FTP远程备份" :value="1"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="方式：">
              <s-select v-model="searchForm.mode" clearable>
                <s-option label="自动" :value="1"></s-option>
                <s-option label="手动" :value="3"></s-option>
              </s-select>
            </s-form-item>
            <!-- <s-form-item label='状态:'>
              <s-select v-model="searchForm.status">
                <s-option v-for="item in statusData" :label="item.name" :value="item.valueInt" :key="item.value"></s-option>
              </s-select>
            </s-form-item> -->
            <s-form-item label="完成时间：">
              <s-date-picker v-model="searchForm.startTime" placeholder="请选择开始时间" type="datetime" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" :value-format-flag="true" @change="getStartTime">
              </s-date-picker>~
              <s-date-picker v-model="searchForm.endTime" placeholder="请选择结束时间" type="datetime" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" :value-format-flag="true" @change="getEndTime">
              </s-date-picker>
            </s-form-item>
        </div>

        <div class="search_btn">
          <s-button icon="magnifier" @click="getBackupLogList">查询</s-button>
          <!-- <s-button icon="refresh-circle" @click="listSearchClean"></s-button> -->
        </div>
      </s-form>

    <!-- 表格 -->
    <s-table-page :data="backupLogList"  :header-search="{show:false}" >
      <s-table-column label="备份类型">
        <template slot-scope="scope">
          <span v-if="!scope.row.ftpUuid">本地备份</span>
          <span v-else>FTP远程备份</span>
        </template>
      </s-table-column>
      <s-table-column label="备份服务器IP" prop="ftpIp"></s-table-column>
      <s-table-column label="文件名" prop="backupFileName"></s-table-column>
      <s-table-column label="方式">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">自动</span>
          <span v-else-if="scope.row.type === 3">手动</span>
        </template>
      </s-table-column>
      <s-table-column label="路径" prop="backupPath"></s-table-column>
      <s-table-column label="完成时间" prop="createTime"></s-table-column>
      <s-table-column label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.stateStr}}</span>
        </template>
      </s-table-column>
      <s-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <i v-if="!scope.row.ftpUuid" class="iconfont icon-download" @click="rowDownload(scope.row)" title="下载"></i>
          <div v-else style="width:20px;margin-right:15px;display:inline-block;"></div>
          <i class="iconfont icon-delete" @click="rowDel(scope.row)" title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>

  </div>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax';

// import {Validaters} from 'sunflower-common-utils';
import {Download} from 'sunflower-common-utils'

export default {

  data() {
    return {
      backupLogList: [], // 备份日志列表
      statusList: [],
      searchForm: {
        type: null,
        mode: null,
        startTime: null,
        endTime: null,
        state: null
      },
      statusData: []
    }
  },
  created() {
    this.getStatusList();
    $axios.get('/archInfo/getArchiveStatusEnumList').then(({data}) => {
      this.statusData = data
    })
  },
  methods: {
    // 获取备份日志列表
    getBackupLogList() {
      $axios.post(`/systemmanager/sysBackupLog/getBackupLog`, this.searchForm).then(({data}) => {
        this.backupLogList = data;
        console.log(this.backupLogList);
      })
    },
    // 获取状态列表
    getStatusList() {
      $axios.get(`/systemmanager/sysBackupLog//getEnumList`).then(({data}) => {
        this.statusList = [...data];
        this.getBackupLogList();
      })
    },
    // 单行下载
    rowDownload(row) {
      $axios.get(`systemmanager/sysBackupLog/checkFilesExist/${row.backupFileName}`).then(({data}) => {
        if (data.state) {
          Download(`/systemmanager/sysBackupLog/downloadBackupFile/${row.uuid}`);
        } else {
          this.$message({type: 'error', message: data.errormsg});
        }
      })
    },
    getStateStr(state) {
      let str = '';
      this.statusList.forEach((item, index) => {
        if (parseInt(item.value) === state) {
          str = item.name;
        }
      })
      return str;
    },
    // 单行删除
    rowDel(row) {
      let vm = this
      vm.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $axios.post('/systemmanager/sysBackupLog/delSysBackupLog', [row.uuid], {
          data: [row],
          logTemplate: '删除|(#backupFileName#备份包)'
        }).then((res) => {
          if (res.data === true) {
            vm.$message({type: 'success', message: '删除成功'});
            vm.getBackupLogList();
          } else {
            vm.$message({type: 'error', message: '删除失败'});
          }
        });
      }).catch(() => {});
    },
    // 列表搜索
    listSearch() {
      // 原理是等待获取列表数据请求完成后再进行四个条件交集的筛选
      this.getBackupLogList(() => {
        let searchForm = {...this.searchForm};

        // 使用扩展运算符解除引用
        let arr = [...this.backupLogList];
        let newArr = [[], [], [], []];
        // let spaceArr = [];
        for (let searchFormKey in searchForm) {
          // 按key进行四个循环

          // 备份类型
          if (searchFormKey === 'type') {
            if (searchForm[searchFormKey] === 0) {  // 如果是本地备份，筛选出ftpUuid无值的，此为后端口头约定
              newArr[0] = arr.filter((item) => !item.ftpUuid);
            } else if (searchForm[searchFormKey] === 1) { // 如果是ftp备份，筛选出ftpUuid无值的，此为后端口头约定
              newArr[0] = arr.filter((item) => !!item.ftpUuid);
            }
            if (searchForm[searchFormKey] === null) {
              newArr[0] = null
            }
          }

          // 备份方式
          if (searchFormKey === 'mode') {
            newArr[1] = arr.filter((item) => searchForm[searchFormKey] === item.type);
            if (searchForm[searchFormKey] === null) {
              newArr[1] = null
            }
          }

          // 开始时间
          if (searchFormKey === 'startTime') {
            newArr[2] = arr.filter((item) => {
              if (searchForm.endTime === null) {
                return this.timeStamp(searchForm[searchFormKey]) <= this.timeStamp(item.createTime)
              } else {
                return (this.timeStamp(searchForm[searchFormKey]) <= this.timeStamp(item.createTime)) && (this.timeStamp(searchForm['endTime']) >= this.timeStamp(item.createTime))
              }
            });
            if (searchForm[searchFormKey] === null) {
              newArr[2] = null
            }
          }

          // 结束时间
          if (searchFormKey === 'endTime') {
            newArr[3] = arr.filter((item) => {
              if (searchForm.startTime === null) {
                return this.timeStamp(searchForm[searchFormKey]) >= this.timeStamp(item.createTime)
              } else {
                return (this.timeStamp(searchForm[searchFormKey]) >= this.timeStamp(item.createTime)) && (this.timeStamp(searchForm['startTime']) <= this.timeStamp(item.createTime))
              }
            });
            if (searchForm[searchFormKey] === null) {
              newArr[3] = null
            }
          }
        }

        // 先去掉空的项
        let noNullArr = newArr.filter((item) => item !== null);

        // 然后按arr.length从大到小排序
        let sortArr = noNullArr.sort(function (a, b) {
          return b.length - a.length;
        });

        // 排序好之后使用reduce 归并方法进行逐一的交集筛选。
        let endArr = sortArr.reduce((prev, cur, index, array) => {
          return [...new Set(cur.filter((item1) => {
            // console.log(prev);
            return prev.map((item2) => item1.uuid === item2.uuid)
          }))]
        });

        // 最后把最终的arr 用扩展运算符解除引用，
        this.backupLogList = [...endArr];

        // 变量置空，清除内存
        searchForm = null;
        arr = null;
        newArr = null;
      });
    },
    // 字符串时间转时间戳
    timeStamp(dateStr) {
      let date = new Date(dateStr);
      return Math.round(date.getTime() / 1000);
    },
    // 列表搜索条件重置
    listSearchClean() {
      this.searchForm = {
        type: null,
        mode: null,
        startTime: null,
        endTime: null
      }
      this.getBackupLogList();
    },
    // 限制搜索时间函数
    getStartTime(val) {
      let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
      let endValue = new Date(Date.parse(this.searchForm.endTime.replace(/-/g, '/'))).getTime();
      if (beginVal >= endValue) {
        this.searchForm.startTime = '';
        this.$message('开始日期不能大于等于结束日期！');
        return false;
      } else {
        this.searchForm.startTime = val;
      }
    },
    getEndTime(val) {
      let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
      let beginValue = new Date(Date.parse(this.searchForm.startTime.replace(/-/g, '/'))).getTime();
      if (endVal <= beginValue) {
        this.searchForm.endTime = '';
        this.$message('开始日期不能大于等于结束日期！');
        return false;
      } else {
        this.searchForm.endTime = val;
      }
    }
  }
}
</script>
