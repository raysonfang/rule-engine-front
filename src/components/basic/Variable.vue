<template>
  <div id="app">
    <el-form ref="form" :inline="true" :model="search.form" label-width="40px">

      <el-form-item label="名称" prop="name">
        <el-input v-model="search.form.name"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="list()" icon="el-icon-search">搜索</el-button>
        <el-button type="reset" @click="reset('search.form')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="addVarForm()">新建变量</el-button>

    <el-dialog :title="add.form.id!==null?'更新变量':'新建变量'" :visible.sync="add.dialogFormVisible">
      <el-form ref="add.form" :rules="add.rules" :model="add.form" label-width="70px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="add.form.name"></el-input>
        </el-form-item>

        <el-form-item label="数据类型" prop="valueType">
          <el-select v-model="add.form.type" placeholder="请选择数据类型"
                     @change="typeChange()">
            <el-option label="函数" :value="6"></el-option>
            <el-option label="字符串" :value="2"
                       @click.native="add.form.valueType='STRING'"></el-option>
            <el-option label="布尔" :value="3"
                       @click.native="add.form.valueType='BOOLEAN'"></el-option>
            <el-option label="数值" :value="4"
                       @click.native="add.form.valueType='NUMBER'"></el-option>
            <el-option label="集合" :value="5"
                       @click.native="add.form.valueType='COLLECTION'"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="函数" prop="valueType" v-if="add.form.type===6">
          <el-select
            v-model="add.form.function.name"
            filterable
            remote
            reserve-keyword
            placeholder="请搜索函数名称"
            :remote-method="remoteMethod"
            :loading="add.form.loading">
            <el-option
              v-for="item in add.form.options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              @click.native="selectClick(item)">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="函数参数"
                      v-if="add.form.function.paramValues.length!==0&&add.form.type===6&&add.form.value!=null">

          <el-col :span="3" style="margin-top: 20px;">
            <el-form-item v-for="pv in add.form.function.paramValues"
                          style="text-align: right;margin-right:20px;margin-top: 7px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
              {{pv.name!==null?pv.name:pv.code}}
            </el-form-item>
          </el-col>

          <el-col :span="4" style="margin-top: 20px">

            <el-form-item v-for="pv in add.form.function.paramValues" style="margin-top: 6px;">
              <el-select v-model="pv.type" @change="leftValueTypeChange(pv)">
                <el-option label="元素" :value="0"></el-option>
                <el-option label="变量" :value="1"></el-option>
                <el-option label="字符串" :value="2"
                           @click.native="pv.valueType='STRING'" v-if="pv.valueType==='STRING'"></el-option>
                <el-option label="布尔" :value="3"
                           @click.native="pv.valueType='BOOLEAN'" v-if="pv.valueType==='BOOLEAN'"></el-option>
                <el-option label="数值" :value="4"
                           @click.native="pv.valueType='NUMBER'" v-if="pv.valueType==='NUMBER'"></el-option>
                <el-option label="集合" :value="5"
                           @click.native="pv.valueType='COLLECTION'" v-if="pv.valueType==='COLLECTION'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1"> &nbsp;</el-col>
          <el-col :span="13" style="margin-top: 20px">
            <el-form-item v-for="pv in add.form.function.paramValues" style="margin-top: 6px;">

              <el-select v-if="pv.type===3" v-model="pv.value" placeholder="请选择数据 ">
                <el-option label="true" value="true"></el-option>
                <el-option label="false" value="false"></el-option>
              </el-select>

              <el-input-number v-else-if="pv.type===4" v-model="pv.value" :controls="false"
                               :max="10000000000000" style="width: 193px"></el-input-number>

              <el-select
                v-else-if="pv.type===1||pv.type===2"
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

              <el-input v-else v-model="pv.value"></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="3">
            &nbsp;
          </el-col>
        </el-form-item>

        <el-form-item label="变量值" v-if="add.form.type!==6" prop="value">

          <el-input-number v-if="add.form.valueType==='NUMBER'" v-model="add.form.value" :controls="false"
                           :max="10000000000000" style="width: 193px"></el-input-number>

          <el-select v-else-if="add.form.valueType==='BOOLEAN'" v-model="add.form.value">
            <el-option label="true" value="true"></el-option>
            <el-option label="false" value="false"></el-option>
          </el-select>

          <el-input type="textarea" v-else-if="add.form.valueType==='COLLECTION'" v-model="add.form.value"></el-input>

          <el-input v-else v-model="add.form.value"></el-input>

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
        prop="valueType"
        label="数据类型"
        width="200">
      </el-table-column>

      <el-table-column
        prop="value"
        label="变量值">
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
        add: {
          dialogFormVisible: false,
          form: {
            loading: false,
            options: [],
            id: null,
            name: '',
            value: null,
            type: null,
            valueType: null,
            description: null,
            function: {
              returnValueType: null,
              name: '',
              paramValues: []
            }
          },
          rules: {}
        }
      }
    }, methods: {
      leftSelectClick(pv, item) {
        pv.valueType = item.valueType;
        pv.value = item.id;
        this.options = [];
      },
      typeChange() {
        this.add.form.options = [];
        this.add.form.value = '';
        this.add.form.valueName = '';
      },
      leftRemoteMethod(query, pv) {
        if (query !== '') {
          pv.loading = true;
          pv.options = [];
          let type = pv.type;
          let url = "/ruleEngine/element/list";
          if (type === 1) {
            url = "/ruleEngine/variable/list";
          }
          this.$axios.post(url, {
            "page": {
              "pageSize": 10,
              "pageIndex": 1
            },
            "query": {
              "name": query,
              "valueType": pv.type === 5 ? null : pv.valueType
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
        pv.value = '';
        pv.valueName = '';
        pv.options = [];
      },
      remoteMethod(query) {
        if (query !== '') {
          this.add.form.loading = true;
          this.add.form.options = [];
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
              this.add.form.options = res.data.rows;
            }
            this.add.form.loading = false;
          }).catch(function (error) {
            console.log(error);
          });
        } else {
          this.add.form.options = [];
        }
      },
      selectClick(item) {
        this.add.form.valueType = item.returnValueType;
        this.add.form.value = item.id;
        this.add.form.function.paramValues = Array.from(item.params)
          .map(m => ({
            name: m.name,
            code: m.code,
            type: this.getTypeOld(m.type, m.valueType),
            value: m.value,
            valueName: m.valueName,
            valueType: m.valueType,
            loading: false,
            options: [],
          }));

      },
      addVarForm() {
        this.add.dialogFormVisible = true;
        this.add.form = {
          loading: false,
          options: [],
          id: null,
          name: '',
          value: null,
          type: null,
          valueType: null,
          description: null,
          function: {
            returnValueType: null,
            name: '',
            paramValues: []
          }
        };
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.add.form.id != null) {
              this.$axios.post("/ruleEngine/variable/update", {
                "id": this.add.form.id,
                "name": this.add.form.name,
                "description": this.add.form.description,
                "value": this.add.form.value,
                "valueType": this.add.form.valueType,
                "type": this.add.form.type === 6 ? 3 : 2,
                "paramValues": Array.from(this.add.form.function.paramValues).map(m => ({
                  "code": m.code,
                  "name": m.name,
                  "type": m.type > 1 ? 2 : m.type,
                  "value": m.value,
                  "valueType": m.valueType,
                  "valueName": m.valueName,
                }))
              }).then(res => {
                if (res) {
                  this.$message({
                    showClose: true,
                    message: '更新成功',
                    type: 'success'
                  });
                  this.list();
                  this.$refs[formName].resetFields();
                  this.add.dialogFormVisible = false;
                }
              }).catch(function (error) {
                console.log(error);
              });
            } else {
              this.$axios.post("/ruleEngine/variable/add", {
                "name": this.add.form.name,
                "description": this.add.form.description,
                "value": this.add.form.value,
                "valueType": this.add.form.valueType,
                "type": this.add.form.type === 6 ? 3 : 2,
                "paramValues": Array.from(this.add.form.function.paramValues).map(m => ({
                  "code": m.code,
                  "name": m.name,
                  "type": m.type > 1 ? 2 : m.type,
                  "value": m.value,
                  "valueType": m.valueType,
                  "valueName": m.valueName,
                }))
              }).then(res => {
                if (res) {
                  this.$message({
                    showClose: true,
                    message: '添加成功',
                    type: 'success'
                  });
                  this.list();
                  //this.$refs[formName].resetFields();
                  this.add.dialogFormVisible = false;
                }
              }).catch(function (error) {
                console.log(error);
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      reset(formName) {
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
        this.$axios.post("/ruleEngine/variable/list", {
          "page": {
            "pageSize": this.page.pageSize,
            "pageIndex": this.page.pageIndex
          },
          "query": {
            "name": this.search.form.name,
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
      getVarInfo(id) {
        this.add.form.id = id;
        // 查询到变量信息
        this.$axios.post("/ruleEngine/variable/get", {
          "id": id
        }).then(res => {
          let da = res.data;
          if (da != null) {
            this.add.form.name = da.name;
            this.add.form.value = da.value;
            this.add.form.type = this.getType(da.type, da.valueType);
            this.add.form.valueType = da.valueType;
            this.add.form.description = da.description;
            if (da.function != null) {
              this.add.form.function.paramValues = Array.from(da.function.paramValues)
                .map(item => ({
                  name: item.name,
                  code: item.code,
                  type: this.getTypeOld(item.type, item.valueType),
                  value: item.value,
                  valueName: item.valueName,
                  valueType: item.valueType,
                  loading: false,
                  options: [],
                }));
              this.add.form.function.name = da.function.name;
            }
            this.add.dialogFormVisible = true;
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      getType(type, valueType) {
        if (type === 3) {
          return 6;
        }
        if (type > 1) {
          if (valueType === "COLLECTION") {
            return 5;
          } else if (valueType === "STRING") {
            return 2;
          } else if (valueType === "BOOLEAN") {
            return 3;
          } else if (valueType === "NUMBER") {
            return 4;
          }
        }
        return type;
      },
      getTypeOld(type, valueType) {
        if (type > 1) {
          if (valueType === "COLLECTION") {
            return 5;
          } else if (valueType === "STRING") {
            return 2;
          } else if (valueType === "BOOLEAN") {
            return 3;
          } else if (valueType === "NUMBER") {
            return 4;
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
