<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="search.form" label-width="85px">
      <el-form-item label="决策表名称" prop="name">
        <el-input v-model="search.form.name"/>
      </el-form-item>
      <el-form-item label="决策表编码" prop="code">
        <el-input v-model="search.form.code"/>
      </el-form-item>
      <el-form-item label="决策表状态">
        <el-select v-model="search.form.status"
                   placeholder="请选择数据 ">
          <el-option label="全部" :value="null"/>
          <el-option label="编辑中" value="0"/>
          <el-option label="待发布" value="1"/>
          <el-option label="已发布" value="2"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="list()" icon="el-icon-search">搜索</el-button>
        <el-button type="reset" @click="reset('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="create()">新建决策表</el-button>


    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'id', order: 'descending'}">
      <el-table-column
        prop="id"
        label="编号"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="name"
        label="决策表名称">
      </el-table-column>

      <el-table-column
        prop="code"
        label="编码"
        width="230">
      </el-table-column>

      <el-table-column
        prop="createUserName"
        label="创建人"
        width="180">
      </el-table-column>

      <el-table-column
        label="决策表状态"
        width="180">
        <template slot-scope="scope">
          <!-- !scope.row.isPublish 防止消息队列延迟-->
          <el-tag v-if="scope.row.isPublish||(!scope.row.isPublish&&scope.row.status===2)" @click="show(scope.row)"
                  size="medium" effect="plain" style="cursor: pointer">
            （ 已发布 ）
          </el-tag>
          <el-tag v-if="scope.row.status===0" @click="edit(scope.row)" type="warning" size="medium" effect="plain"
                  style="cursor: pointer">
            （ 编辑中 ）
          </el-tag>
          <el-tag v-else-if="scope.row.status===1" @click="edit(scope.row)" type="success" size="medium" effect="plain"
                  style="cursor: pointer">
            （ 待发布 ）
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="createTime"
        sortable
        width="180"
        label="创建日期">
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>

  </div>
</template>

<script>
  export default {
    name: "DecisionTable",
    data() {
      return {
        search: {
          form: {
            name: null,
            code: null,
            status: null
          }
        },
        tableData: [],
        loading: false,
        page: {
          pageIndex: 1,
          pageSize: 10,
          total: 0
        },
      }
    }, methods: {
      create() {
        alert("敬请期待")
      },
      reset(formName) {
        this.search.form.status = null;
        this.$refs[formName].resetFields();
        this.list();
      },
      edit(row) {

      },
      deleteRow(row) {

      },
      list() {

      },
      handleSizeChange(val) {
        this.page.pageSize = val;
        this.list();
      },
      handleCurrentChange(val) {
        this.page.pageIndex = val;
        this.list();
      },
    }
  }
</script>

<style scoped>

</style>
