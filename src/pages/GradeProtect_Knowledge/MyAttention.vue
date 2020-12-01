<!--
 * @Author: mybells
 * @Version://Q1知识库
 * @Description:安全通报->知识库->我的关注
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
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" @click="eye(scope.row)" title="查看" ></i>
          <i class="iconfont icon-star-full" @click="del([scope.row.uuid])" title="取消关注" ></i>
        </template>
      </s-table-column>
    </s-table-page>
    <!-- 查看知识库表单 -->
    <EyeKnowledge v-if="viewDialog" :viewDialog.sync="viewDialog" :rowUuid="rowUuid"></EyeKnowledge>
  </div>
</template>

<script>
import $axios from 'sunflower-ajax';
import EyeKnowledge from './Dialog/EyeKnowledge'
  export default {
    components: {
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
        rowUuid: '',
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
            name: '取消关注',
            click() {
              let uuidArr = self.selectionList.map(item => item.uuid);
              self.del(uuidArr);
            }
          }]
        }
      },
      selection(arr) {
        this.selectionList = arr;
      },
      getList() {
        // 获取我的关注列表
        $axios.get(`/safetyPlatform/knowledge/getConcernKnowledges/${this.$store.getters.userData.uuid}`).then(res => {
          this.list = res.data || [];
        })
      },
      eye(row) {
        this.viewDialog = true;
        this.rowUuid = row.uuid;
      },
      del(arr) {
        if (arr.length) {
          this.$confirm('确定取消关注?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post(`/safetyPlatform/knowledge/cancelConcernKnowledges`, {knowledgeUuids: arr, userUuid: this.$store.getters.userData.uuid}).then(({data}) => {
              if (data.state === true) {
                this.$message({message: '取消成功!', type: 'success'});
                this.getList();
              } else {
                this.$message({message: data.errormsg, type: 'error'});
              }
            });
          }).catch(() => {});
        } else {
          this.$message({
            message: '请选择要取消关注的数据！',
            type: 'warning'
          });
        }
      }
    }
  }
</script>

<style>

</style>
