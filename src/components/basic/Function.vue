<template>
  <div>

    <el-form ref="searchForm" :inline="true" :model="search.form" label-width="40px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="search.form.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="list()" icon="el-icon-search">搜索</el-button>
        <el-button type="reset" @click="reset('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="函数详情" :visible.sync="get.dialogFormVisible">
      <el-form ref="get.form" :model="get.form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="get.form.name" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="执行器">
          <el-input v-model="get.form.executor" :readonly="true"></el-input>
        </el-form-item>

        <el-form-item label="参数" style="margin-top: -8px;">
          <el-input type="textarea" autosize :autosize="{ maxRows: 10}" v-model="get.form.paramsJson"
                    :readonly="true" resize="none"></el-input>
        </el-form-item>

        <el-form-item label="返回类型">
          <el-select :value="get.form.returnValueType" :readonly="true">
            <el-option label="布尔" value="BOOLEAN"></el-option>
            <el-option label="集合" value="COLLECTION"></el-option>
            <el-option label="字符串" value="STRING"></el-option>
            <el-option label="数值" value="NUMBER"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="说明">
          <el-input type="textarea" v-model="get.form.description" :readonly="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="get.dialogFormVisible = false">关 闭</el-button>
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
        prop="executor"
        label="执行器"
        sortable
        width="200">
      </el-table-column>
      <el-table-column
        prop="returnValueType"
        label="返回值类型">
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
          <el-button @click="view(scope.row)" type="text" size="small">查看</el-button>
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
    name: "Function",
    data() {
      return {
        search: {
          form: {
            name: null
          }
        },
        get: {
          dialogFormVisible: false,
          form: {
            name: null,
            returnValueType: null,
            description: null,
            executor: null,
            paramsJson: null
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
      handleSizeChange(val) {
        this.page.pageSize = val;
        this.list();
      },
      handleCurrentChange(val) {
        this.page.pageIndex = val;
        this.list();
      }, view(row) {
        this.$axios.post("/ruleEngine/function/get", {
          "id": row.id,
        }).then(res => {
          let da = res.data;
          if (da != null) {
            this.get.form.name = da.name;
            this.get.form.returnValueType = da.returnValueType;
            this.get.form.description = da.description;
            this.get.form.executor = da.executor;

            this.get.form.paramsJson = JSON.stringify(da.params, null, 4);

            this.get.dialogFormVisible = true;
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      list() {
        this.$axios.post("/ruleEngine/function/list", {
          "page": {
            "pageSize": this.page.pageSize,
            "pageIndex": this.page.pageIndex
          },
          "query": {
            "name": this.search.form.name
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
      }
    }, mounted() {
      this.list();
    }
  }
</script>

<style scoped>

</style>
