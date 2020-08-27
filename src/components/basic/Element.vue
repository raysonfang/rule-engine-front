<template>
  <div id="app">

    <el-form ref="form" :inline="true" :model="search.form" label-width="40px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="search.form.name"></el-input>
      </el-form-item>
      <el-form-item label="Code" prop="code">
        <el-input v-model="search.form.code"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="list()" icon="el-icon-search">搜索</el-button>
        <el-button type="reset" @click="reset('search.form')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="addElementForm">新建元素</el-button>

    <el-dialog :title="add.form.id===null?'新建元素':'更新元素'" :visible.sync="add.dialogFormVisible">
      <el-form ref="add.form" :rules="add.rules" :model="add.form" label-width="70px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="add.form.name"></el-input>
        </el-form-item>

        <el-form-item label="Code" prop="code">
          <el-input v-model="add.form.code"></el-input>
        </el-form-item>

        <el-form-item label="数据类型" prop="valueType">
          <el-select v-model="add.form.valueType" placeholder="请选择数据类型">
            <el-option label="字符串" value="STRING"></el-option>
            <el-option label="布尔" value="BOOLEAN"></el-option>
            <el-option label="数值" value="NUMBER"></el-option>
            <el-option label="集合" value="COLLECTION"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="说明" prop="description">
          <el-input type="textarea" v-model="add.form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save('add.form')">保 存</el-button>
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
        label="Code"
        sortable
        width="200">
      </el-table-column>
      <el-table-column
        prop="valueType"
        label="数据类型">
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
        width="140">
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
    name: "Element",
    data() {
      return {
        tableData: [],
        loading: true,
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
        add: {
          dialogFormVisible: false,
          form: {
            id: null,
            name: null,
            code: null,
            valueType: null,
            description: null,
          },
          rules: {}
        }
      }
    }, methods: {
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.add.form.id === null) {
              this.$axios.post("/ruleEngine/element/add", {
                "name": this.add.form.name,
                "description": this.add.form.description,
                "code": this.add.form.code,
                "valueType": this.add.form.valueType,
              })
                .then(res => {
                  if (res) {
                    this.$message({
                      showClose: true,
                      message: '添加成功',
                      type: 'success'
                    });
                    this.list();
                  }
                  this.$refs[formName].resetFields();
                  this.add.dialogFormVisible = false;
                }).catch(function (error) {
                console.log(error);
              });
            } else {
              this.$axios.post("/ruleEngine/element/update", {
                "id": this.add.form.id,
                "name": this.add.form.name,
                "description": this.add.form.description,
                "code": this.add.form.code,
                "valueType": this.add.form.valueType,
              })
                .then(res => {
                  if (res) {
                    this.$message({
                      showClose: true,
                      message: '更新成功',
                      type: 'success'
                    });
                    this.list();
                  }
                  this.$refs[formName].resetFields();
                  this.add.dialogFormVisible = false;
                }).catch(function (error) {
                console.log(error);
              });
            }

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }, reset(formName) {
        this.$refs[formName].resetFields();
        this.list();
      }, handleSizeChange(val) {
        this.page.pageSize = val;
        this.list();
      },
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.list();
      },
      list() {
        this.$axios.post("/ruleEngine/element/list", {
          "page": {
            "pageSize": this.page.pageSize,
            "pageIndex": this.page.pageIndex
          },
          "query": {
            "name": this.search.form.name,
            "code": this.search.form.code,
          },
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
          }
          this.loading = false;
        }).catch(function (error) {
          console.log(error);
        });
      },
      edit(row) {
        this.$axios.post("/ruleEngine/element/get", {
          "id": row.id
        }).then(res => {
          let da = res.data;
          if (da != null) {
            this.add.form.id = row.id;
            this.add.form.name = da.name;
            this.add.form.code = da.code;
            this.add.form.valueType = da.valueType;
            this.add.form.description = da.description;

            this.add.dialogFormVisible = true;
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      addElementForm() {
        this.add.form = {};
        this.add.form.id = null;
        this.add.dialogFormVisible = true;
      },
      deleteRow(row) {
        this.$axios.post("/ruleEngine/element/delete", {
          "id": row.id
        }).then(res => {
          let da = res.data;
          if (da) {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.list();
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    }, created() {
      this.list();
    }
  }
</script>

<style scoped>

</style>
