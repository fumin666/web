/**
* Created by alex on 2018/10/23.
*/
<template>
    <div>
      <s-table-page
        v-if="type === 'org'"
        :data="data"
        :header-search='getSearchDef()'
        height="520">
        <s-table-column
          prop="departName"
          label="机构名称"></s-table-column>
        <s-table-column
          prop="departParentName"
          label="上级机构"></s-table-column>
        <s-table-column
          prop="departCode"
          label="机构编号"></s-table-column>
        <s-table-column
          prop="departLeaderName"
          label="机构负责人"></s-table-column>
      </s-table-page>
      <s-table-page
        :data="data"
        v-if="type === 'staff'"
        :header-search='getSearchDef1()'
        height="520">
        <s-table-column
          prop="userRealName"
          label="真实姓名"></s-table-column>
       <!-- <s-table-column
          prop="userGenderName"
          label="性别"></s-table-column>-->
        <s-table-column
          prop="departName"
          label="所属机构"></s-table-column>
        <s-table-column
          prop="userMail"
          label="Email"></s-table-column>
        <s-table-column
          prop="userCellphone"
          label="手机号码">
          <template slot-scope="scope">
            <span>{{scope.row.userCellphone | capitalize()}}</span>
          </template>
        </s-table-column>
      </s-table-page>
    </div>
</template>

<script type="text/babel">
  export default {
    props: {
      data: {
        type: Array
      },
      type: {
        type: String
      }
    },
    filters: {
      capitalize: (value) => {
        if (!value) return ''
        if (value.length > 3) {
          return value.substring(0, 3) + '****' + value.substring((value.length - 4), value.length)
        } else {
          return value
        }
      }
    },
    methods: {
      getSearchDef() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询内容',
          searchProps: ['departName', 'departCode', 'departParentName', 'departLeaderName']
        }
      },
      getSearchDef1() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询内容',
          searchProps: ['userRealName', 'userGenderName', 'departName', 'userMail', 'userCellphone']
        }
      }
    }
  }
</script>
