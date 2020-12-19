<template>
  <div id="Workspace">

    <el-form ref="searchForm" :inline="true" :model="search.form" label-width="40px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="search.form.name"/>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="search.form.code"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="list()" icon="el-icon-search">搜索</el-button>
        <el-button type="reset" @click="reset('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="add">新建空间</el-button>

    <el-dialog title="编辑工作空间" :visible.sync="edit.dialogFormVisible" width="700px">
      <el-form ref="editWorkspace" :rules="edit.rules" :model="edit.form" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="edit.form.name"/>
        </el-form-item>

        <el-form-item label="编码" prop="code">
          <el-input v-model="edit.form.code" :disabled="edit.form.id!==null"/>
        </el-form-item>

        <el-form-item label="访问密钥" prop="accessKeyId">
          <el-input v-model="edit.form.accessKeyId" show-password/>
        </el-form-item>

        <el-form-item label="密钥秘密" prop="accessKeySecret">
          <el-input v-model="edit.form.accessKeySecret" show-password/>
        </el-form-item>

        <el-form-item label="说明" prop="description">
          <el-input type="textarea" v-model="edit.form.description"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="edit.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateWorkspace('editWorkspace')">保 存</el-button>
      </div>
    </el-dialog>

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
        label="名称"
        sortable
        width="200">
      </el-table-column>
      <el-table-column
        prop="code"
        label="编码"
        width="200">
      </el-table-column>
      <el-table-column
        prop="createTime"
        sortable
        width="180"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="description"
        label="说明">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="140">
        <template slot-scope="scope">
          <el-button @click="authorization(scope.row)" type="text" size="small">授权</el-button>
          <el-button @click="editRow(scope.row)" type="text" size="small">编辑</el-button>
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
    name: "Workspace",
    data() {
      return {
        loading: false,
        tableData: [],
        page: {
          pageIndex: 1,
          pageSize: 10,
          total: 0
        },
        search: {
          form: {
            name: null,
            code: null,
          }
        },
        edit: {
          form: {
            id: null,
            name: null,
            code: null,
            description: null,
            accessKeyId: null,
            accessKeySecret: null,
          },
          rules: {},
          dialogFormVisible: false
        },
      }
    },
    methods: {
      updateWorkspace(formName) {
        alert("敬请期待")
      },
      reset(formName) {
        this.$refs[formName].resetFields();
        this.list();
      },
      authorization() {
        // 给某些用户授此工作空间权限
        alert("敬请期待，自己新建的工作空间默认只能管理与自己可以查看，一般情况需要授权别人才可以访问")
      },
      add() {
        alert("敬请期待")
      },
      handleSizeChange(val) {
        this.page.pageSize = val;
        this.list();
      },
      handleCurrentChange(val) {
        this.page.pageIndex = val;
        this.list();
      },
      editRow(row) {
        this.edit.form.id = row.id;
        this.edit.form.name = row.name;
        this.edit.form.code = row.code;
        this.edit.form.description = row.description;
        this.$axios.post("/workspace/accessKey", {
          "param": row.code
        }).then(res => {
          let da = res.data;
          if (da != null) {
            this.edit.form.accessKeyId = da.accessKeyId;
            this.edit.form.accessKeySecret = da.accessKeySecret;
            this.edit.dialogFormVisible = true;
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      deleteRow(row) {
        // 如果有在使用了，则不能删除
        alert("敬请期待")
      },
      list() {
        this.loading = true;
        this.$axios.post("/workspace/list", {
          "page": {
            "pageSize": this.page.pageSize,
            "pageIndex": this.page.pageIndex
          },
          "query": this.search.form,
          "orders": [
            {
              "columnName": "id",
              "desc": true
            }
          ]
        }).then(res => {
          if (res.data != null) {
            this.tableData = res.data.rows;
            this.page.total = res.data.page.total;
          } else {
            this.tableData = [];
          }
          this.loading = false;
        }).catch(function (error) {
          console.log(error);
          this.loading = false;
        });
      }
    },
    created() {
      this.list();
    }
  }
</script>

<style scoped>
  #Workspace {

  }
</style>
