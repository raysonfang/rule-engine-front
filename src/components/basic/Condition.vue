<template>
  <div id="app">

    <el-form ref="searchForm" :inline="true" :model="search.form" label-width="40px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="search.form.name"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="list()" icon="el-icon-search">搜索</el-button>
        <el-button type="reset" @click="reset('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="addConditionForm">新建条件</el-button>

    <el-dialog :title="add.form.id===null?'新建条件':'更新条件'" :visible.sync="add.dialogFormVisible" width="700px">
      <el-form ref="add.form" :rules="add.rules" :model="add.form" label-width="70px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="add.form.name"></el-input>
        </el-form-item>


        <el-form-item label="条件配置" prop="valueType">

          <el-form-item label="左值" class="conditionConfigItem">
            <el-col :span="10">
              <el-form-item prop="leftValueType">
                <el-select v-model="add.form.config.leftValue.type" placeholder="请选择数据类型"
                           @change="leftValueTypeChange()">
                  <el-option label="元素" :value="0"></el-option>
                  <el-option label="变量" :value="1"></el-option>
                  <el-option label="字符串" :value="2"
                             @click.native="add.form.config.leftValue.valueType='STRING'"></el-option>
                  <el-option label="布尔" :value="3"
                             @click.native="add.form.config.leftValue.valueType='BOOLEAN'"></el-option>
                  <el-option label="数值" :value="4"
                             @click.native="add.form.config.leftValue.valueType='NUMBER'"></el-option>
                  <el-option label="集合" :value="5"
                             @click.native="add.form.config.leftValue.valueType='COLLECTION'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="leftValue">

                <el-select v-if="add.form.config.leftValue.type===3" v-model="add.form.config.leftValue.value"
                           placeholder="请选择数据 ">
                  <el-option label="true" value="true"></el-option>
                  <el-option label="false" value="false"></el-option>
                </el-select>

                <el-input
                  v-else-if="add.form.config.leftValue.type>1"
                  v-model="add.form.config.leftValue.value"></el-input>

                <el-select
                  v-else
                  v-model="add.form.config.leftValue.valueName"
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
              </el-form-item>
            </el-col>
            <el-col :span="5">
              &nbsp;
            </el-col>
          </el-form-item>

          <el-form-item label="运算符" prop="symbol" class="conditionConfigItem">
            <el-select v-model="add.form.config.symbol" placeholder="请选择运算符">
              <el-option
                v-for="item in symbolSelect.options"
                :key="item.name"
                :label="item.explanation"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="右值" class="conditionConfigItem">
            <el-col :span="10">
              <el-form-item prop="rightValueType">
                <el-select v-model="add.form.config.rightValue.type" placeholder="请选择数据类型"
                           @change="rightValueTypeChange()">
                  <el-option label="元素" :value="0"></el-option>
                  <el-option label="变量" :value="1"></el-option>
                  <el-option v-if="isRightTypeSelectView('STRING')"
                             label="字符串" :value="2"
                             @click.native="add.form.config.rightValue.valueType='STRING'"></el-option>
                  <el-option v-if="isRightTypeSelectView('BOOLEAN')"
                             label="布尔" :value="3"
                             @click.native="add.form.config.rightValue.valueType='BOOLEAN'"></el-option>
                  <el-option v-if="isRightTypeSelectView('NUMBER')"
                             label="数值" :value="4"
                             @click.native="add.form.config.rightValue.valueType='NUMBER'"></el-option>
                  <el-option v-if="isRightTypeSelectView('COLLECTION')"
                             label="集合" :value="5"
                             @click.native="add.form.config.rightValue.valueType='COLLECTION'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="rightValue">
                <el-select v-if="add.form.config.rightValue.type===3" v-model="add.form.config.rightValue.value"
                           placeholder="请选择数据 ">
                  <el-option label="true" value="true"></el-option>
                  <el-option label="false" value="false"></el-option>
                </el-select>

                <el-input
                  v-else-if="add.form.config.rightValue.type>1"
                  v-model="add.form.config.rightValue.value"></el-input>

                <el-select
                  v-else
                  v-model="add.form.config.rightValue.valueName"
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
              </el-form-item>
            </el-col>
            <el-col :span="5">
              &nbsp;
            </el-col>
          </el-form-item>
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
        add: {
          dialogFormVisible: false,
          form: {
            id: null,
            name: null,
            config: {
              leftValue: {
                value: null,
                valueName: null,
                valueType: null,
                type: null,
              },
              symbol: null,
              rightValue: {
                value: null,
                valueName: null,
                valueType: null,
                type: null,
              }
            },
            description: null,
          },
          rules: {}
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
      addConditionForm() {
        this.add.dialogFormVisible = true;
        this.add.form = {
          id: null,
          name: null,
          config: {
            leftValue: {
              value: null,
              valueName: null,
              valueType: null,
              type: null,
            },
            symbol: null,
            rightValue: {
              value: null,
              valueName: null,
              valueType: null,
              type: null,
            }
          },
          description: null,
        };
      },
      isRightTypeSelectView(valueType) {
        if (this.add.form.config.leftValue.valueType === valueType) {
          return true;
        }
        // 如果左值为集合时
        if (this.add.form.config.leftValue.valueType === 'COLLECTION') {
          if (this.add.form.config.symbol === null) {
            return true;
          }
          // 并且 只有左值为CONTAIN/NOT_CONTAIN 返回所有的类型
          return this.add.form.config.symbol === 'CONTAIN' || this.add.form.config.symbol === 'NOT_CONTAIN';
        }
      },
      leftValueChange() {
        //左面发生改变，右边也改变
        this.add.form.config.symbol = '';
        this.add.form.config.rightValue.value = '';
        this.add.form.config.rightValue.valueName = '';
        this.add.form.config.rightValue.type = '';
        this.rightSelect.options = [];
      },
      leftValueTypeChange() {
        this.add.form.config.leftValue.value = '';
        this.add.form.config.leftValue.valueName = '';
        this.leftSelect.options = [];
        this.add.form.config.symbol = '';
        //左面发生改变，右边也改变
        this.add.form.config.rightValue.value = '';
        this.add.form.config.rightValue.valueName = '';
        this.add.form.config.rightValue.type = '';
        this.rightSelect.options = [];
      },
      rightValueTypeChange() {
        this.add.form.config.rightValue.value = '';
        this.add.form.config.rightValue.valueName = '';
        this.rightSelect.options = [];
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.add.form.id === null) {
              this.$axios.post("/ruleEngine/condition/add", {
                "name": this.add.form.name,
                "description": this.add.form.description,
                "config": {
                  "leftValue": {
                    "value": this.add.form.config.leftValue.value,
                    "valueType": this.add.form.config.leftValue.valueType,
                    "type": this.add.form.config.leftValue.type > 1 ? 2 : this.add.form.config.leftValue.type,
                  },
                  "symbol": this.add.form.config.symbol,
                  "rightValue": {
                    "value": this.add.form.config.rightValue.value,
                    "valueType": this.add.form.config.rightValue.valueType,
                    "type": this.add.form.config.rightValue.type > 1 ? 2 : this.add.form.config.rightValue.type,
                  }
                }
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
              this.$axios.post("/ruleEngine/condition/update", {
                "id": this.add.form.id,
                "name": this.add.form.name,
                "description": this.add.form.description,
                "config": {
                  "leftValue": {
                    "value": this.add.form.config.leftValue.value,
                    "valueType": this.add.form.config.leftValue.valueType,
                    "type": this.add.form.config.leftValue.type > 1 ? 2 : this.add.form.config.leftValue.type,
                  },
                  "symbol": this.add.form.config.symbol,
                  "rightValue": {
                    "value": this.add.form.config.rightValue.value,
                    "valueType": this.add.form.config.rightValue.valueType,
                    "type": this.add.form.config.rightValue.type > 1 ? 2 : this.add.form.config.rightValue.type,
                  }
                }
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
      },
      rightSelectClick(item) {
        this.add.form.config.rightValue.valueType = item.valueType;
        this.add.form.config.rightValue.value = item.id;
      },
      leftSelectClick(item) {
        this.add.form.config.leftValue.valueType = item.valueType;
        this.add.form.config.leftValue.value = item.id;
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
      leftRemoteMethod(query) {
        if (query !== '') {
          this.leftSelect.loading = true;
          this.leftSelect.options = [];
          let type = this.add.form.config.leftValue.type;
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
      }, rightRemoteMethod(query) {
        if (query !== '') {
          this.rightSelect.loading = true;
          this.rightSelect.options = [];
          let type = this.add.form.config.rightValue.type;
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
              "valueType": this.add.form.config.leftValue.type === 5 ? null : this.add.form.config.leftValue.valueType
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
      }, edit(row) {
        this.$axios.post("/ruleEngine/condition/get", {
          "id": row.id
        }).then(res => {
          let da = res.data;
          if (da != null) {
            this.add.form = da;
            this.add.form.config.leftValue.type = this.getType(da.config.leftValue.type, da.config.leftValue.valueType);
            this.add.form.config.rightValue.type = this.getType(da.config.rightValue.type, da.config.rightValue.valueType);

            this.add.dialogFormVisible = true;
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      getType(type, valueType) {
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
      }, deleteRow(row) {
        this.$axios.post("/ruleEngine/condition/delete", {
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
      //增加对名称的监听事件
      this.$watch('add.form.config.leftValue.valueType', (newVal, oldVal) => {
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

</style>
<style scoped>
  .conditionConfigItem {
    margin-top: 16px;
  }
</style>
