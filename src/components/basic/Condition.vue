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

    <el-button type="primary" @click="addConditionForm">新建条件</el-button>

    <el-dialog :title="form.id===null?'新建条件':'更新条件'" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="addForm" :rules="rules" :model="form" label-width="70px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>


        <el-form-item label="条件配置">
          <el-form-item label="左值" style="margin-top: 18px">
            <el-col :span="10">
              <el-form-item prop="config.leftValue.type">
                <el-select v-model="form.config.leftValue.type" placeholder="请选择数据类型"
                           @change="leftValueTypeChange()">
                  <el-option label="元素" :value="0"/>
                  <el-option label="变量" :value="1"/>
                  <el-option label="字符串" :value="5" @click.native="form.config.leftValue.valueType='STRING'"/>
                  <el-option label="布尔" :value="6" @click.native="form.config.leftValue.valueType='BOOLEAN'"/>
                  <el-option label="数值" :value="7" @click.native="form.config.leftValue.valueType='NUMBER'"/>
                  <el-option label="集合" :value="8" @click.native="form.config.leftValue.valueType='COLLECTION'"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="config.leftValue.value">
                <el-input-number v-if="form.config.leftValue.type===7" v-model="form.config.leftValue.value"
                                 :controls="false" :max="10000000000000"
                                 style="width: 193px"/>

                <el-select v-else-if="form.config.leftValue.type===6" v-model="form.config.leftValue.value"
                           placeholder="请选择数据 ">
                  <el-option label="true" value="true"/>
                  <el-option label="false" value="false"/>
                </el-select>

                <el-select
                  v-else-if="form.config.leftValue.type===0||form.config.leftValue.type===1"
                  v-model="form.config.leftValue.valueName"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="leftRemoteMethod"
                  :loading="leftSelect.loading"
                  @change="leftValueChange()">
                  <el-option
                    v-for="item in leftSelect.options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    @click.native="leftSelectClick(item)">
                  </el-option>
                </el-select>

                <el-input v-else v-model="form.config.leftValue.value"/>

              </el-form-item>
            </el-col>
            <el-col :span="5">
              &nbsp;
            </el-col>
          </el-form-item>

          <el-form-item label="运算符" prop="config.symbol" style="margin-top: 18px">
            <el-select v-model="form.config.symbol" placeholder="请选择运算符">
              <el-option
                v-for="item in symbolSelect.options"
                :key="item.name"
                :label="item.explanation"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="右值" style="margin-top: 18px">
            <el-col :span="10">
              <el-form-item prop="config.rightValue.type">
                <el-select v-model="form.config.rightValue.type" placeholder="请选择数据类型"
                           @change="rightValueTypeChange()">
                  <el-option v-if="form.config.leftValue.type!=null" label="元素" :value="0"/>
                  <el-option v-if="form.config.leftValue.type!=null" label="变量" :value="1"/>
                  <el-option v-if="isRightTypeSelectView('STRING')" label="字符串" :value="5"/>
                  <el-option v-if="isRightTypeSelectView('BOOLEAN')" label="布尔" :value="6"/>
                  <el-option v-if="isRightTypeSelectView('NUMBER')" label="数值" :value="7"/>
                  <el-option v-if="isRightTypeSelectView('COLLECTION')" label="集合" :value="8"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="config.rightValue.value">

                <el-input-number v-if="form.config.rightValue.type===7" v-model="form.config.rightValue.value"
                                 :controls="false" :max="10000000000000"
                                 style="width: 193px"/>

                <el-select v-else-if="form.config.rightValue.type===6" v-model="form.config.rightValue.value"
                           placeholder="请选择数据 ">
                  <el-option label="true" value="true"/>
                  <el-option label="false" value="false"/>
                </el-select>

                <el-select
                  v-else-if="form.config.rightValue.type===0||form.config.rightValue.type===1"
                  v-model="form.config.rightValue.valueName"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="rightRemoteMethod"
                  :loading="rightSelect.loading">
                  <el-option
                    v-for="item in rightSelect.options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    @click.native="rightSelectClick(item)">
                  </el-option>
                </el-select>

                <el-input v-else v-model="form.config.rightValue.value"/>

              </el-form-item>
            </el-col>
            <el-col :span="5">
              &nbsp;
            </el-col>
          </el-form-item>
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
        width="200">
      </el-table-column>

      <el-table-column
        prop="configInfo"
        label="配置信息">
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
    name: "Condition",
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
          id: null,
          name: null,
          config: {
            leftValue: {
              value: undefined,
              valueName: null,
              valueType: null,
              type: null,
            },
            symbol: null,
            rightValue: {
              value: undefined,
              valueName: null,
              valueType: null,
              type: null,
            }
          },
          description: null,
        },
        rules: {
          name: [
            {required: true, message: '请输入条件名称', trigger: ['blur']},
            {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: ['blur']}
          ],
          config: {
            leftValue: {
              type: [
                {required: true, message: '请选择类型', trigger: ['blur']},
              ],
              value: [
                {required: true, message: '值不能为空', trigger: ['blur']},
              ],
            },
            symbol: [
              {required: true, message: '请选择运算符', trigger: ['blur']}
            ],
            rightValue: {
              type: [
                {required: true, message: '请选择类型', trigger: ['blur']},
              ],
              value: [
                {required: true, message: '值不能为空', trigger: ['blur']},
              ],
            }
          }
        },
        leftSelect: {
          loading: false,
          options: [],
          query: {
            name: null,
          }
        },
        rightSelect: {
          loading: false,
          options: [],
          query: {
            name: null,
          }
        },
        symbolSelect: {
          options: [],
        }
      }
    },
    methods: {
      clearValidate() {
        let ref = this.$refs['addForm'];
        if (ref != null) {
          ref.clearValidate()
        }
      },
      addConditionForm() {
        this.clearValidate();
        this.form = {
          id: null,
          name: null,
          config: {
            leftValue: {
              value: undefined,
              valueName: null,
              valueType: null,
              type: null,
            },
            symbol: null,
            rightValue: {
              value: undefined,
              valueName: null,
              valueType: null,
              type: null,
            }
          },
          description: null,
        };
        this.dialogFormVisible = true;
      },
      isRightTypeSelectView(valueType) {
        if (this.form.config.leftValue.valueType === null) {
          return false;
        }
        if (this.form.config.leftValue.valueType === valueType) {
          return true;
        }
        // 如果左值为集合时
        if (this.form.config.leftValue.valueType === 'COLLECTION') {
          if (this.form.config.symbol === null) {
            return true;
          }
          // 并且 只有左值为CONTAIN/NOT_CONTAIN 返回所有的类型
          return this.form.config.symbol === 'CONTAIN' || this.form.config.symbol === 'NOT_CONTAIN';
        }
      },
      leftValueChange() {
        //左面发生改变，右边也改变
        this.form.config.symbol = '';
        this.form.config.rightValue.value = undefined;
        this.form.config.rightValue.valueName = '';
        this.form.config.rightValue.type = '';
        this.rightSelect.options = [];
      },
      leftValueTypeChange() {
        this.form.config.leftValue.value = undefined;
        this.form.config.leftValue.valueName = '';
        // 如果是变量或者元素
        if (this.form.config.leftValue.type === 1 || this.form.config.leftValue.type === 0) {
          this.form.config.leftValue.valueType = null;
        }
        this.leftSelect.options = [];
        this.form.config.symbol = '';
        //左面发生改变，右边也改变
        this.form.config.rightValue.value = undefined;
        this.form.config.rightValue.valueName = '';
        this.form.config.rightValue.type = '';
        this.rightSelect.options = [];
      },
      rightValueTypeChange() {
        this.form.config.rightValue.value = undefined;
        this.form.config.rightValue.valueName = '';
        this.rightSelect.options = [];
      },
      saveOrUpdate(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post(this.form.id === null ? "/ruleEngine/condition/add" : "/ruleEngine/condition/update", {
              "id": this.form.id,
              "name": this.form.name,
              "description": this.form.description,
              "config": {
                "leftValue": {
                  "value": this.form.config.leftValue.value,
                  "valueType": this.getValueType(this.form.config.leftValue.type, this.form.config.leftValue.valueType),
                  "type": this.form.config.leftValue.type > 5 ? 2 : this.form.config.leftValue.type,
                },
                "symbol": this.form.config.symbol,
                "rightValue": {
                  "value": this.form.config.rightValue.value,
                  "valueType": this.getValueType(this.form.config.rightValue.type, this.form.config.rightValue.valueType),
                  "type": this.form.config.rightValue.type > 5 ? 2 : this.form.config.rightValue.type,
                }
              }
            }).then(res => {
              if (res) {
                this.list();
              }
              this.$refs[formName].resetFields();
              this.dialogFormVisible = false;
            }).catch(function (error) {
              console.log(error);
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      rightSelectClick(item) {
        this.form.config.rightValue.valueType = item.valueType;
        this.form.config.rightValue.value = item.id;
      },
      leftSelectClick(item) {
        this.form.config.leftValue.valueType = item.valueType;
        this.form.config.leftValue.value = item.id;
      },
      reset(formName) {
        this.$refs[formName].resetFields();
        this.list();
      }, handleSizeChange(val) {
        this.page.pageSize = val;
        this.list();
      },
      handleCurrentChange(val) {
        this.page.pageIndex = val;
        this.list();
      },
      list() {
        this.$axios.post("/ruleEngine/condition/list", {
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
      leftRemoteMethod(query) {
        if (query !== '') {
          this.leftSelect.loading = true;
          this.leftSelect.options = [];
          let type = this.form.config.leftValue.type;
          this.$axios.post(type === 1 ? "/ruleEngine/variable/list" : "/ruleEngine/element/list", {
            "page": {
              "pageSize": 10,
              "pageIndex": 1
            },
            "query": {
              "name": query,
            },
            "orders": []
          }).then(res => {
            if (res.data != null) {
              this.leftSelect.options = res.data.rows;
            }
            this.leftSelect.loading = false;
          }).catch(function (error) {
            console.log(error);
          });
        } else {
          this.leftSelect.options = [];
        }
      },
      rightRemoteMethod(query) {
        if (query !== '') {
          this.rightSelect.loading = true;
          this.rightSelect.options = [];
          let type = this.form.config.rightValue.type;
          this.$axios.post(type === 1 ? "/ruleEngine/variable/list" : "/ruleEngine/element/list", {
            "page": {
              "pageSize": 10,
              "pageIndex": 1
            },
            "query": {
              "name": query,
              "valueType": this.form.config.leftValue.valueType === 'COLLECTION' ? null : this.form.config.leftValue.valueType
            },
            "orders": []
          }).then(res => {
            if (res.data != null) {
              this.rightSelect.options = res.data.rows;
            }
            this.rightSelect.loading = false;
          }).catch(function (error) {
            console.log(error);
          });
        } else {
          this.rightSelect.options = [];
        }
      },
      edit(row) {
        this.clearValidate();
        this.$axios.post("/ruleEngine/condition/get", {
          "id": row.id
        }).then(res => {
          let da = res.data;
          if (da != null) {
            this.form = da;
            this.form.config.leftValue.type = this.getType(da.config.leftValue.type, da.config.leftValue.valueType);
            this.form.config.rightValue.type = this.getType(da.config.rightValue.type, da.config.rightValue.valueType);

            this.dialogFormVisible = true;
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      deleteRow(row) {
        this.$axios.post("/ruleEngine/condition/delete", {
          "id": row.id
        }).then(res => {
          let da = res.data;
          if (da) {
            this.list();
          }
        }).catch(function (error) {
          console.log(error);
        });
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
    },
    created() {
      this.list();
      //增加对名称的监听事件
      this.$watch('form.config.leftValue.valueType', (newVal, oldVal) => {
        if (newVal == null) {
          return;
        }
        this.symbolSelect.options = [];
        this.$axios.post("/ruleEngine/symbol/getByType", {
          "param": newVal
        }).then(res => {
          if (res.data != null) {
            this.symbolSelect.options = res.data;
          }
        }).catch(function (error) {
          console.log(error);
        });
      });
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
