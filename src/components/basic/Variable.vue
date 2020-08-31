<template>
  <div id="app">

    <el-form ref="searchForm" :inline="true" :model="search.form" label-width="40px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="search.form.name"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="list()" icon="el-icon-search">搜索</el-button>
        <el-button type="reset" @click="reset('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="addVarForm()">新建变量</el-button>

    <el-dialog :title="form.id!==null?'更新变量':'新建变量'" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="addForm" :rules="rules" :model="form" label-width="80px">

        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>

        <el-form-item label="数据类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择数据类型" @change="typeChange()" :disabled="form.id!=null">
            <el-option label="函数" :value="3"/>
            <el-option label="字符串" :value="5"/>
            <el-option label="布尔" :value="6"/>
            <el-option label="数值" :value="7"/>
            <el-option label="集合" :value="8"/>
          </el-select>
        </el-form-item>

        <el-form-item label="函数名称" prop="function.name" v-if="form.type===3">
          <el-select
            :disabled="form.id!=null"
            v-model="form.function.name"
            filterable
            remote
            reserve-keyword
            placeholder="请搜索函数名称"
            :remote-method="remoteMethod"
            :loading="form.loading">
            <el-option
              v-for="item in form.options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              @click.native="selectClick(item)">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="函数参数" v-if="form.function.paramValues.length!==0&&form.type===3&&form.value!=null">

          <el-col :span="3" style="margin-top: 26px;">
            <el-form-item v-for="pv in form.function.paramValues" :key="pv.code"
                          style="text-align: right;margin-right:20px;margin-top: 19px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
              {{pv.name!==null?pv.name:pv.code}}
            </el-form-item>
          </el-col>

          <el-col :span="4" style="margin-top: 26px">
            <el-form-item v-for="(pv,index) in form.function.paramValues" style="margin-top: 18px;"
                          :key="pv.code"
                          :prop="'function.paramValues.' + index + '.type'"
                          :rules="{ required: true, message: '类型不能为空', trigger: ['blur', 'change'] }">
              <el-select v-model="pv.type" @change="leftValueTypeChange(pv)">
                <el-option label="元素" :value="0"/>
                <el-option label="变量" :value="1"/>
                <el-option label="字符串" :value="5" v-if="pv.valueType==='STRING'"/>
                <el-option label="布尔" :value="6" v-else-if="pv.valueType==='BOOLEAN'"/>
                <el-option label="数值" :value="7" v-else-if="pv.valueType==='NUMBER'"/>
                <el-option label="集合" :value="8" v-else-if="pv.valueType==='COLLECTION'"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="1"> &nbsp;</el-col>

          <el-col :span="13" style="margin-top: 26px">
            <el-form-item v-for="(pv,index) in form.function.paramValues" style="margin-top: 18px;"
                          :key="pv.code"
                          :prop="'function.paramValues.' + index + '.value'"
                          :rules="{  required: true, message: pv.name+'参数不能为空', trigger: 'blur' }">
              <el-select v-if="pv.type===6" v-model="pv.value" placeholder="请选择数据 ">
                <el-option label="true" value="true"/>
                <el-option label="false" value="false"/>
              </el-select>
              <el-input-number v-else-if="pv.type===7" v-model="pv.value" :controls="false"
                               :max="10000000000000" style="width: 193px;"/>
              <el-select
                v-else-if="pv.type===1||pv.type===0"
                v-model="pv.valueName"
                filterable
                remote
                placeholder="请输入关键词"
                :remote-method="(query)=>{leftRemoteMethod(query,pv)}"
                :loading="pv.loading">
                <el-option
                  v-for="item in pv.options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  @click.native="leftSelectClick(pv,item)">
                </el-option>
              </el-select>
              <el-input v-else v-model="pv.value"/>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            &nbsp;
          </el-col>
        </el-form-item>

        <el-form-item label="变量值" v-if="form.type!==3" prop="value">
          <el-input-number v-if="form.type===7" v-model="form.value" :controls="false"
                           :max="10000000000000" style="width: 193px"/>
          <el-select v-else-if="form.type===6" v-model="form.value">
            <el-option label="true" value="true"/>
            <el-option label="false" value="false"/>
          </el-select>

          <el-input type="textarea" v-else-if="form.type===8" v-model="form.value"/>

          <el-input v-else v-model="form.value"/>

        </el-form-item>

        <el-form-item label="说明" prop="description">
          <el-input type="textarea" v-model="form.description"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate('addForm')">保 存</el-button>
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
        prop="valueType"
        label="数据类型"
        width="200">
      </el-table-column>

      <el-table-column
        label="变量值">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 3" size="medium" effect="plain">（ 函数 ）</el-tag>
          <span v-else>{{scope.row.value}}</span>
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
        width="140">
        <template slot-scope="scope">
          <el-button @click="getVarInfo(scope.row.id)" type="text" size="small">编辑</el-button>
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
    name: "Variable",
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
          }
        },
        dialogFormVisible: false,
        form: {
          loading: false,
          options: [],
          id: null,
          name: '',
          value: '',
          type: null,
          valueType: null,
          description: null,
          function: {
            returnValueType: null,
            name: '',
            paramValues: []
          }
        },
        rules: {
          name: [
            {required: true, message: '请输入变量名称', trigger: 'blur'},
            {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
          ],
          function: {
            name: [
              {required: true, message: '请输入函数名称', trigger: 'blur'}
            ],
          },
          type: [
            {required: true, message: '请选择变量类型', trigger: 'blur'}
          ],
          value: [
            {required: true, message: '值不能为空', trigger: 'blur'}
          ]
        }
      }
    }, methods: {
      leftSelectClick(pv, item) {
        pv.valueType = item.valueType;
        pv.value = item.id;
        this.options = [];
      },
      typeChange() {
        this.form.options = [];
        this.form.value = undefined;
        this.form.valueName = '';
      },
      leftRemoteMethod(query, pv) {
        if (query !== '') {
          pv.loading = true;
          pv.options = [];
          this.$axios.post(pv.type === 1 ? "/ruleEngine/variable/list" : "/ruleEngine/element/list", {
            "page": {
              "pageSize": 10,
              "pageIndex": 1
            },
            "query": {
              "name": query,
              "valueType": pv.valueType === 'COLLECTION' ? null : pv.valueType
            },
            "orders": []
          }).then(res => {
            if (res.data != null) {
              pv.options = res.data.rows;
            }
            pv.loading = false;
          }).catch(function (error) {
            console.log(error);
          });
        } else {
          pv.options = [];
        }
      },
      leftValueTypeChange(pv) {
        pv.value = undefined;
        pv.valueName = '';
        pv.options = [];
      },
      remoteMethod(query) {
        if (query !== '') {
          this.form.loading = true;
          this.form.options = [];
          this.$axios.post("/ruleEngine/function/list", {
            "page": {
              "pageSize": 10,
              "pageIndex": 1
            },
            "query": {
              "name": query
            },
            "orders": []
          }).then(res => {
            if (res.data != null) {
              this.form.options = res.data.rows;
            }
            this.form.loading = false;
          }).catch(function (error) {
            console.log(error);
          });
        } else {
          this.form.options = [];
        }
      },
      selectClick(item) {
        this.form.valueType = item.returnValueType;
        this.form.value = item.id;
        this.form.function.paramValues = this.getParamValues(item.params);
      },
      clearValidate() {
        let ref = this.$refs['addForm'];
        if (ref != null) {
          ref.clearValidate()
        }
      },
      addVarForm() {
        this.clearValidate();
        this.form = {
          loading: false,
          options: [],
          id: null,
          name: null,
          type: null,
          value: undefined,
          description: null,
          valueType: null,
          function: {
            returnValueType: null,
            name: '',
            paramValues: []
          }
        };
        this.dialogFormVisible = true;
      },
      saveOrUpdate(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post(this.form.id != null ? "/ruleEngine/variable/update" : "/ruleEngine/variable/add", {
              "id": this.form.id,
              "name": this.form.name,
              "description": this.form.description,
              "value": this.form.value,
              "valueType": this.getValueType(this.form.type, this.form.valueType),
              "type": this.form.type === 3 ? 3 : 2,
              "paramValues": Array.from(this.form.function.paramValues).map(m => ({
                "code": m.code,
                "name": m.name,
                "type": m.type >= 5 ? 2 : m.type,
                "value": m.value,
                "valueType": this.getValueType(m.type, m.valueType),
                "valueName": m.valueName,
              }))
            }).then(res => {
              if (res) {
                this.list();
                this.dialogFormVisible = false;
              }
            }).catch(function (error) {
              console.log(error);
            });
          }
        });
      },
      reset(formName) {
        this.$refs[formName].resetFields();
        this.list();
      },
      handleSizeChange(val) {
        this.page.pageSize = val;
        this.list();
      },
      handleCurrentChange(val) {
        this.page.pageIndex = val;
        this.list();
      },
      list() {
        this.$axios.post("/ruleEngine/variable/list", {
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
          }
          this.loading = false;
        }).catch(function (error) {
          console.log(error);
        });
      },
      getVarInfo(id) {
        this.clearValidate();
        this.form.id = id;
        // 查询到变量信息
        this.$axios.post("/ruleEngine/variable/get", {
          "id": id
        }).then(res => {
          let da = res.data;
          if (da != null) {
            this.form.name = da.name;
            this.form.value = da.value;
            this.form.type = this.getType(da.type, da.valueType);
            this.form.valueType = da.valueType;
            this.form.description = da.description;
            if (da.function != null) {
              this.form.function.paramValues = this.getParamValues(da.function.paramValues);
              this.form.function.name = da.function.name;
            }
            this.dialogFormVisible = true;
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      getParamValues(paramValues) {
        return Array.from(paramValues)
          .map(item => ({
            // 搜索用元素变量用
            loading: true,
            options: [],
            // ...
            name: item.name,
            code: item.code,
            type: this.getType(item.type, item.valueType),
            value: item.value,
            valueName: item.valueName,
            valueType: item.valueType,
          }));
      },
      getValueType(type, valueType) {
        if (type === 5) {
          return "STRING";
        } else if (type === 6) {
          return "BOOLEAN";
        } else if (type === 7) {
          return "NUMBER";
        } else if (type === 8) {
          return "COLLECTION";
        }
        return valueType;
      },
      getType(type, valueType) {
        if (type === 2) {
          if (valueType === "COLLECTION") {
            return 8;
          } else if (valueType === "STRING") {
            return 5;
          } else if (valueType === "BOOLEAN") {
            return 6;
          } else if (valueType === "NUMBER") {
            return 7;
          }
        }
        return type;
      },
      deleteRow(row) {
        this.$axios.post("/ruleEngine/variable/delete", {
          "id": row.id
        }).then(res => {
          let da = res.data;
          if (da) {
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
<style>
  .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
<style scoped>

</style>
