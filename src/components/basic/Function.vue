<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="search.form" label-width="40px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="search.form.name"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="list()" icon="el-icon-search">搜索</el-button>
        <el-button type="reset" @click="reset('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="addFunctionForm">新建函数</el-button>


    <el-dialog title="函数详情" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" :readonly="true"/>
        </el-form-item>
        <el-form-item label="执行器">
          <el-input v-model="form.executor" :readonly="true"/>
        </el-form-item>

        <el-form-item label="参数" style="margin-top: -8px;">
          <el-input type="textarea" autosize :autosize="{ maxRows: 10}" v-model="form.paramsJson"
                    :readonly="true" resize="none"/>
        </el-form-item>

        <el-form-item label="返回类型">
          <el-select :value="form.returnValueType" :readonly="true">
            <el-option label="布尔" value="BOOLEAN"/>
            <el-option label="集合" value="COLLECTION"/>
            <el-option label="字符串" value="STRING"/>
            <el-option label="数值" value="NUMBER"/>
          </el-select>
        </el-form-item>

        <el-form-item label="说明">
          <el-input type="textarea" v-model="form.description" :readonly="true"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title="函数测试" :visible.sync="run.dialogFormVisible" width="700px">
      <el-form ref="runAddForm" :rules="run.rules" :model="run.form" label-width="80px">

        <el-form-item label="名称" prop="name">
          <el-input v-model="run.form.name" :readonly="true"/>
        </el-form-item>

        <el-form-item label="返回类型">
          <el-select :value="run.form.returnValueType">
            <el-option label="布尔" value="BOOLEAN"/>
            <el-option label="集合" value="COLLECTION"/>
            <el-option label="字符串" value="STRING"/>
            <el-option label="数值" value="NUMBER"/>
          </el-select>
        </el-form-item>

        <el-form-item label="函数参数" v-if="run.form.function.paramValues.length!==0">

          <el-col :span="3" style="margin-top: 26px;">
            <el-form-item v-for="pv in run.form.function.paramValues" :key="pv.code"
                          style="text-align: right;margin-right:10px;margin-top: 19px;overflow: hidden;white-space: nowrap;">
              {{pv.name!==null?pv.name:pv.code}}
            </el-form-item>
          </el-col>

          <el-col :span="4" style="margin-top: 26px">
            <el-form-item v-for="(pv,index) in run.form.function.paramValues" style="margin-top: 18px;" :key="pv.code">
              <el-select :value="pv.valueType" :disabled="true">
                <el-option label="字符串" value="STRING"/>
                <el-option label="布尔" value="BOOLEAN"/>
                <el-option label="数值" value="NUMBER"/>
                <el-option label="集合" value="COLLECTION"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="1"> &nbsp;</el-col>

          <el-col :span="13" style="margin-top: 26px">
            <el-form-item v-for="(pv,index) in run.form.function.paramValues" style="margin-top: 18px;" :key="pv.code">
              <el-select v-if="pv.valueType==='BOOLEAN'" v-model="pv.value" placeholder="请选择数据 ">
                <el-option label="true" value="true"/>
                <el-option label="false" value="false"/>
              </el-select>
              <el-input-number v-else-if="pv.valueType==='NUMBER'" v-model="pv.value" :controls="false"
                               :max="10000000000000" style="width: 100%"/>
              <el-input v-else v-model="pv.value"/>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            &nbsp;
          </el-col>
        </el-form-item>
        <br>
        <el-form-item label="输出">
          <el-input type="textarea" v-model="run.form.output"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="run.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="exe('runForm')">运行</el-button>
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
        label="名称">
      </el-table-column>
      <el-table-column
        prop="executor"
        label="执行器"
        width="240">
      </el-table-column>
      <el-table-column
        prop="returnValueType"
        label="返回值类型"
        width="200">
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
          <el-button @click="test(scope.row)" type="text" size="small">测试</el-button>
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
                run: {
                    dialogFormVisible: false,
                    form: {
                        id: null,
                        name: null,
                        function: {
                            paramValues: []
                        },
                        returnValueType: null,
                        output: null
                    }
                },
                search: {
                    form: {
                        name: null
                    }
                },
                dialogFormVisible: false,
                form: {
                    name: null,
                    returnValueType: null,
                    description: null,
                    executor: null,
                    paramsJson: null
                },
                tableData: [],
                loading: true,
                page: {
                    pageIndex: 1,
                    pageSize: 10,
                    total: 0
                },
            }
        }, methods: {
            exe() {
                this.$axios.post("/ruleEngine/function/run", {
                    "id": this.run.form.id,
                    "paramValues": this.run.form.function.paramValues
                }).then(res => {
                    let da = res.data;
                    if (da != null) {
                        this.run.form.output = da;
                    } else {
                        this.run.form.output = null;
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            addFunctionForm() {
                alert("内测阶段，存在恶意代码安全问题，暂不对外开放，敬请期待！");
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.list();
            },
            handleCurrentChange(val) {
                this.page.pageIndex = val;
                this.list();
            },
            test(row) {
                this.clearValidate();
                this.run.form.returnValueType = row.returnValueType;
                this.run.form.id = row.id;
                this.run.form.name = row.name;
                this.run.form.function.paramValues = Array.from(row.params).map(m => ({
                    "code": m.code,
                    "name": m.name,
                    "value": undefined,
                    "valueType": m.valueType,
                }));
                this.run.dialogFormVisible = true;
                this.run.form.output = null;
            },
            clearValidate() {
                let ref = this.$refs['runAddForm'];
                if (ref != null) {
                    ref.clearValidate();
                }
            },
            view(row) {
                this.$axios.post("/ruleEngine/function/get", {
                    "id": row.id,
                }).then(res => {
                    let da = res.data;
                    if (da != null) {
                        this.form = da;
                        this.form.paramsJson = JSON.stringify(da.params, null, 4);

                        this.dialogFormVisible = true;
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            reset(formName) {
                this.$refs[formName].resetFields();
                this.list();
            },
            list() {
                this.loading = true;
                this.$axios.post("/ruleEngine/function/list", {
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
                });
            }
        }, mounted() {
            this.list();
        }
    }
</script>
<style>
  .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
<style scoped>

</style>
