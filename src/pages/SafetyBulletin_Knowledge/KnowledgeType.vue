<!--
 * @Author: mybells
 * @Version://Q1知识库
 * @Description:安全通报->知识库->知识分类
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->
<template>
  <div>
    <s-table-page :data="list" :header-search="searchDef()" :header-actions='getActionsDef()' @selection-change='selection' style="width: 100%;">
      <s-table-column type="selection" width="45"></s-table-column>
      <s-table-column prop="code" label="知识编号" show-overflow-tooltip></s-table-column>
      <s-table-column prop="title" label="标题" show-overflow-tooltip></s-table-column>
      <s-table-column prop="safeTypeName" label="知识分类" show-overflow-tooltip></s-table-column>
      <s-table-column prop="classify" label="知识类别" :filters="filtersState" :filter-method="filterType" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.classify === 1">问题解决方案</span>
          <span v-if="scope.row.classify === 2">操作指引</span>
        </template>
      </s-table-column>
      <s-table-column prop="createByName" label="提交人" show-overflow-tooltip></s-table-column>
      <s-table-column prop="createTime" label="提交时间" show-overflow-tooltip></s-table-column>
      <s-table-column label="操作" width="180">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" @click="eye(scope.row)" title="查看知识" ></i>
          <i class="iconfont icon-edit" @click="edit(scope.row)" title="编辑知识" ></i>
          <i class="iconfont icon-delete" @click="del([scope.row.uuid], [scope.row])" title="删除知识" ></i>
          <i class="iconfont icon-star-empty" v-if="!scope.row.isConcerned" @click="attention([scope.row.uuid], [scope.row])" title="关注知识" ></i>
          <i class="iconfont icon-star-full" v-if="scope.row.isConcerned" @click="noAttention([scope.row.uuid], [scope.row])" title="取消关注" ></i>
        </template>
      </s-table-column>
    </s-table-page>
    <!-- 添加编辑知识库表单 -->
    <AddEditKnowledge v-if="addEditDialog" :addEditDialog.sync="addEditDialog" :tabKey="tabKey" :isAdd="isAdd" :rowUuid="rowUuid" @reload="getList"></AddEditKnowledge>
    <!-- 查看知识库表单 -->
    <EyeKnowledge v-if="viewDialog" :viewDialog.sync="viewDialog" :rowUuid="rowUuid"></EyeKnowledge>
  </div>
</template>

<script>
import $axios from 'sunflower-ajax';
import AddEditKnowledge from './Dialog/AddEditKnowledge'
import EyeKnowledge from './Dialog/EyeKnowledge'
  export default {
    components: {
      AddEditKnowledge,
      EyeKnowledge
    },
    props: {
      tabKey: String
    },
    data() {
      return {
        filtersState: [
          {text: '问题解决方案', value: 1},
          {text: '操作指引', value: 2}
        ],
        list: [],
        selectionList: [],
        rowData: {},
        rowUuid: '',
        addEditDialog: false,
        isAdd: true,
        viewDialog: false
      }
    },
    created() {
      this.getList();
    },
    methods: {
      filterType(value, row) {
        return row.classify === value
      },
      searchDef() {
        return {
          width: 10,
          offset: 20,
          placeholder: '请输入关键字',
          searchProps: ['code', 'title', 'safeTypeName']
        }
      },
      getActionsDef() {
        let self = this
        return {
          width: 14,
          actions: [{
            name: '添加',
            icon: 'plus',
            click() {
              self.addEditDialog = true;
              self.isAdd = true;
            }
          }, {
            name: '批量删除',
            icon: 'delete',
            click() {
              let uuidArr = self.selectionList.map(item => item.uuid);
              self.del(uuidArr, self.selectionList);
            }
          }, {
            name: '批量关注',
            icon: 'star-empty',
            click() {
              let uuidArr = self.selectionList.map(item => item.uuid);
              self.attention(uuidArr, self.selectionList);
            }
          }]
        }
      },
      selection(arr) {
        this.selectionList = arr;
      },
      getList() {
        $axios.get(`/safetyPlatform/knowledge/getKnowledgesBySafeType/${this.tabKey}`).then(res => {
          this.list = res.data || [];
        })
      },
      eye(row) {
        this.viewDialog = true;
        this.rowUuid = row.uuid;
      },
      edit(row) {
        this.addEditDialog = true;
        this.isAdd = false;
        this.rowUuid = row.uuid;
      },
      del(uuidArr, arr) {
        if (uuidArr.length) {
          this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post(`/safetyPlatform/knowledge/removeKnowledges`, {knowledgeUuids: uuidArr}, {
              data: arr,
              logTemplate: '删除|知识(#code#)'
            }).then(({data}) => {
              if (data.state === true) {
                this.$message({message: '删除成功!', type: 'success'});
                this.getList();
              } else {
                this.$message({message: data.errormsg, type: 'error'});
              }
            });
          }).catch(() => {});
        } else {
          this.$message({
            message: '请选择要删除的数据！',
            type: 'warning'
          });
        }
      },
      attention(uuidArr, arr) {
        if (uuidArr.length) {
          $axios.post(`/safetyPlatform/knowledge/concernKnowledges`, {knowledgeUuids: uuidArr, userUuid: this.$store.getters.userData.uuid}, {
            data: arr,
            logTemplate: '关注|知识(#code#)'
          }).then(({data}) => {
            if (data.state === true) {
              this.$message({message: '关注成功!', type: 'success'});
              this.getList();
            } else {
              this.$message({message: data.errormsg, type: 'error'});
            }
          });
        } else {
          this.$message({
            message: '请选择要关注的数据！',
            type: 'warning'
          });
        }
      },
      noAttention(uuidArr, arr) {
        if (uuidArr.length) {
          $axios.post(`/safetyPlatform/knowledge/cancelConcernKnowledges`, {knowledgeUuids: uuidArr, userUuid: this.$store.getters.userData.uuid}, {
            data: arr,
            logTemplate: '取消关注|知识(#code#)'
          }).then(({data}) => {
            if (data.state === true) {
              this.$message({message: '取消成功!', type: 'success'});
              this.getList();
            } else {
              this.$message({message: data.errormsg, type: 'error'});
            }
          });
        } else {
          this.$message({
            message: '请选择要关注的数据！',
            type: 'warning'
          });
        }
      }
    }
  }
</script>

<style>

</style>
