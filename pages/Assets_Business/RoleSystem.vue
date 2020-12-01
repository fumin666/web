
<template>
  <section>
      <s-row :gutter="10">
        <s-col :span="4" class="noPrint">
          <s-tab>
            <s-tab-pane label="业务系统">
              <ul class="business-ul" :v-model="activeTabs">
                <li :class="activeTabs === index ? 'activeLi' : 'business-li'"
                    :key="business.uuid" v-for="(business,index) in businessRole"
                    @click="handleNodeClick(business.uuid,index)"
                >
                  <span slot="label"><img src="../../../static/images/asseticon/files.png" alt="" style="vertical-align: middle;"> {{business.name}}</span>
                </li>
              </ul>
            </s-tab-pane>
          </s-tab>
        </s-col>
        <s-col :span="20" style="margin-top: 10px">
          <s-table-page
            :data="checkSystemList"
            :header-actions="getActionsDef()"
            @selection-change="handleSelectChange"
            :header-search="getSearchDef()">
            <s-table-column
              type="selection"
              width="45">
            </s-table-column>
            <s-table-column
              prop="name"
              label="名称">
            </s-table-column>
            <s-table-column
              prop="remark"
              label="描述">
            </s-table-column>
            <s-table-column label="操作">
              <template slot-scope="scope">
                <i class="iconfont icon-eye" @click="eyeHandler(scope.row)" title="查看"></i>
                <i class="iconfont icon-edit" @click="editHandler(scope.row)" title="编辑"></i>
                <i class="iconfont icon-tool" @click="toolHandler(scope.row)" title="同步"></i>
                <i class="iconfont icon-user" @click="userHandler(scope.row)" title="人员"></i>
                <i class="iconfont icon-delete" @click="deleteHandler(scope.row.uuid)" title="删除"></i>
              </template>
            </s-table-column>
          </s-table-page>
        </s-col>
      </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  export default {
    data () {
      return {
        businessRole: [],
        checkSystemList: [],
        currentNodeValue: '',
        currentUuid: '',
        selectUuid: [],
        defaultProps: {
          label: 'name'
        },
        activeTabs: 0
      }
    },
    created () {
      this.getTree()
    },
    methods: {
      handleSelectChange(val) {
        this.selectUuid = val.map(item => item.uuid)
      },
      getActionsDef () {
        let vm = this
        return {
          width: 12,
          actions: [{
              name: '批量同步',
              icon: 'union',
              click() {
                vm.$message('当前无对接业务系统')
            }
          },
            {
              name: '批量导入',
              icon: 'import',
              click() {
                vm.$message('当前无对接业务系统')
              }
            },
            {
              name: '批量导出',
              icon: 'export',
              click() {
                vm.$message('当前无对接业务系统')
              }
            },
            {
              name: '批量删除',
              icon: 'delete',
              click() {
                vm.$message('当前无对接业务系统')
              }
            }
            ]
        }
      },
      getSearchDef () {
        return {
          width: 6,
          offset: 6,
          placeholder: '请输入查询内容',
          searchProps: ['name', 'remark']
        }
      },
      getTree () {
        $axios.get('/iamBusinessSystem/list').then((res) => {
          this.businessRole = res.data
          this.currentUuid = this.businessRole[0].uuid
          this.getTreeItemTable()
        })
      },
      getTreeItemTable() {
        $axios.get(`/iamBusinessRole/list/${this.currentUuid}`).then((res) => {
          this.checkSystemList = res.data
        })
      },
      renderContent (h, {node}) {
        let img = ''
        node.level === 1 ? img = 'static/images/asseticon/files.png' : img = 'static/images/asseticon/Server.png'
        return (
          <span>
          <span><img style="vertical-align: middle;margin-right: 3px" src={img}></img></span>
          <span style="font-size:14px">{node.label}</span>
        </span>)
      },
      deleteHandler (uuid) {
        let arr = [uuid]
        $axios.post('/iamBusinessRole/delete', arr).then((res) => {
          if (res.data) {
            this.$message.success('删除成功');
            this.getTreeItemTable()
          } else {
            this.$message.error('删除失败');
          }
        })
      },
      handleNodeClick(uuid, index) {
        this.activeTabs = index
        this.currentUuid = uuid
        this.getTreeItemTable(this.currentUuid);
      },
      // 查看
      eyeHandler(row) {
        this.$message('暂无对接业务系统')
      },
      // 编辑
      editHandler (row) {
        this.$message('暂无对接业务系统')
      },
      // 同步
      toolHandler (row) {
        this.$message('暂无对接业务系统')
      }
    }
  }
</script>

<style scoped lang="stylus">
 .listChunk .s-table span.ip
      cursor pointer
 .business-ul .business-li{
   padding: 10px
   cursor pointer
 }
   .business-ul li{
     font-size:14px
   }
 .business-ul .business-li:hover{
   background: #e5e5e5
 }
   .business-ul .activeLi{
     color: #ffa954;
     padding: 10px
     cursor pointer
   }
 .content .listChunk .searchBtChunk
    margin-bottom: -2%;
</style>

