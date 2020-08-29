<template>
  <div id="ruleConfig">

    <el-steps :active="2" align-center>
      <el-step title="规则定义" icon="el-icon-edit"></el-step>
      <el-step title="规则定义" icon="el-icon-connection"></el-step>
      <el-step title="规则预览" icon="el-icon-view" class="stepp"></el-step>
    </el-steps>
    <br>
    <br>

    <el-row>
      <el-col :span="6">
        &nbsp;
      </el-col>
      <el-col :span="12">

        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-card class="box-card">
              <div slot="header" class="box-card-header">
                <span>条件集</span>
                <i class="el-icon-circle-plus-outline pointer" @click="addConditionGroup()"
                   style="float: right; padding: 14px 10px;color: #5ba0f8;"></i>
              </div>
              <div>
                <el-card v-for="cg in conditionGroup" class="box-card conditionGroupCard"
                         :body-style="{ padding: '6px 6px 0px 6px' }"
                         :draggable="conditionGroupDraggable"
                         v-on:dragstart.native="handleDragStartCG($event, cg)"
                         v-on:dragover.prevent.native="handleDragOverCG($event)"
                         v-on:dragenter.native="handleDragEnterCG($event, cg, conditionGroup)"
                         v-on:dragend.native="handleDragEndCG($event)">
                  <div slot="header" class="box-card-header">
                    <span><el-input v-model="cg.name" style="width: 200px;margin-left: -20px;"></el-input></span>
                    <i class="el-icon-delete pointer" @click="deleteConditionGroup(cg)"
                       style="float: right; padding: 14px 0;color: #5ba0f8;"></i>
                    <i class="el-icon-circle-plus-outline pointer" @click="addCondition(cg)"
                       style="float: right; padding: 14px 10px;color: #5ba0f8;"></i>
                    <i class="el-icon-rank pointer" style="float: right; padding: 14px 4px;color: #5ba0f8;"
                       @mouseover="conditionGroupDraggable=true"
                       @mouseleave="conditionGroupDraggable=false"></i>
                  </div>

                  <el-alert
                    style="padding: 6px 0 8.5px 0"
                    :id="c.id" class="item"
                    v-for="c in cg.conditionSets"
                    :closable="false"

                    draggable="true"
                    v-on:dragstart.native="handleDragStart($event, c,cg.id)"
                    v-on:dragover.prevent.native="handleDragOver($event)"
                    v-on:dragenter.native="handleDragEnter($event, c, cg.conditionSets,cg.id)"
                    v-on:dragend.native="handleDragEnd($event)">

                    <el-tag style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;font-size: 13px;">
                      （{{c.condition.name}}）
                    </el-tag>
                    &nbsp;

                    <el-tag type="success" style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                      {{getConditionNamePrefix(c.condition.config.leftValue.type)}}
                    </el-tag>
                    <span style="color: #606266">  {{c.condition.config.leftValue.valueName}}</span>

                    &nbsp;
                    <el-tag type="warning" style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                      {{c.condition.config.symbol}}
                    </el-tag>

                    &nbsp;
                    <el-tag type="success" style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                      {{ getConditionNamePrefix(c.condition.config.rightValue.type)}}
                    </el-tag>


                    <span style="color: #606266">   {{c.condition.config.rightValue.valueName}}</span>

                    <i class="el-alert__closebtn el-icon-close" style="color: rgb(91, 160, 248)"
                       @click="removeCondition(cg.conditionSets,c.condition.id)"></i>
                  </el-alert>
                </el-card>
              </div>
            </el-card>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
        </el-row>
        <br> <br>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-card class="box-card">
              <div slot="header" class="box-card-header">
                <span>结果</span>
              </div>
              <div>
                <el-form ref="actionForm" :model="action" :rules="actionRules">
                  <el-form-item prop="type" class="el-col-6">
                    <el-select v-model="action.type" placeholder="请选择数据类型" @change="actionTypeChange()">
                      <el-option label="元素" :value="0"></el-option>
                      <el-option label="变量" :value="1"></el-option>
                      <el-option label="字符串" :value="2"
                                 @click.native="action.valueType='STRING'"></el-option>
                      <el-option label="布尔" :value="3"
                                 @click.native="action.valueType='BOOLEAN'"></el-option>
                      <el-option label="数值" :value="4"
                                 @click.native="action.valueType='NUMBER'"></el-option>
                      <el-option label="集合" :value="5"
                                 @click.native="action.valueType='COLLECTION'"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item class="el-col-1">
                    &nbsp;
                  </el-form-item>

                  <el-form-item prop="value" class="el-col-17">
                    <el-select v-if="action.type===3" v-model="action.value" prop="value"
                               placeholder="请选择数据 ">
                      <el-option label="true" value="true"></el-option>
                      <el-option label="false" value="false"></el-option>
                    </el-select>

                    <el-select prop="value"
                               v-else-if="action.type===0||action.type===1"
                               v-model="action.valueName"
                               filterable
                               remote
                               reserve-keyword
                               placeholder="请输入关键词"
                               :remote-method="actionRemoteMethod"
                               :loading="action.loading">
                      <el-option
                        v-for="item in action.options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        @click.native="actionSelectClick(item)">
                      </el-option>
                    </el-select>

                    <div v-else-if="action.valueType==='NUMBER'">
                      <el-input-number v-model="action.value" :controls="false"
                                       :max="10000000000000" style="width: 193px"></el-input-number>
                    </div>

                    <el-input v-else v-model="action.value" prop="value"></el-input>

                  </el-form-item>

                </el-form>

              </div>

            </el-card>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
        </el-row>
        <br> <br>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">

            <el-card class="box-card">
              <div slot="header" class="box-card-header">
                <span>默认结果</span>
              </div>
              <div>
                <el-switch v-model="enableDefaultAction" :active-value="0" :inactive-value="1"></el-switch>
                <br>
                <br>
                <el-form ref="defaultActionForm" :model="defaultAction" :rules="defaultActionRules">
                  <el-form-item prop="type" class="el-col-6">
                    <el-select v-model="defaultAction.type" placeholder="请选择数据类型"
                               @change="defaultActionTypeChange()">
                      <el-option label="元素" :value="0"></el-option>
                      <el-option label="变量" :value="1"></el-option>
                      <el-option label="字符串" :value="2"
                                 @click.native="defaultAction.valueType='STRING'"></el-option>
                      <el-option label="布尔" :value="3"
                                 @click.native="defaultAction.valueType='BOOLEAN'"></el-option>
                      <el-option label="数值" :value="4"
                                 @click.native="defaultAction.valueType='NUMBER'"></el-option>
                      <el-option label="集合" :value="5"
                                 @click.native="defaultAction.valueType='COLLECTION'"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="el-col-1">
                    &nbsp;
                  </el-form-item>
                  <el-form-item prop="value" class="el-col-17">
                    <el-select v-if="defaultAction.type===3" v-model="defaultAction.value">
                      <el-option label="true" value="true"></el-option>
                      <el-option label="false" value="false"></el-option>
                    </el-select>

                    <el-select
                      v-else-if="defaultAction.type===1||defaultAction.type===0"
                      v-model="defaultAction.valueName"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请输入关键词"
                      :remote-method="defaultActionRemoteMethod"
                      :loading="defaultAction.loading">
                      <el-option
                        v-for="item in defaultAction.options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        @click.native="defaultActionSelectClick(item)">
                      </el-option>
                    </el-select>


                    <div v-else-if="defaultAction.valueType==='NUMBER'">
                      <el-input-number v-model="action.value" :controls="false"
                                       :max="10000000000000" style="width: 193px"></el-input-number>
                    </div>

                    <el-input v-else v-model="defaultAction.value"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>

          </el-col>
          <el-col :span="1">&nbsp;</el-col>
        </el-row>

        <br><br>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-button type="primary" @click="nextStep()" style="float: right;margin-left: 20px">下 一 步</el-button>
            <el-button type="primary" @click="previous()" style="float: right;margin-left: 20px">上 一 步</el-button>
            <el-button type="primary" @click="update()" style="float: right;">保存</el-button>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
        </el-row>

      </el-col>
      <el-col :span="6">
        <el-card class="box-card" :body-style="{ padding: '28px 12px 6px 12px' }" v-if="condition.dialogFormVisible">
          <div slot="header" class="box-card-header">
            <span>选择条件</span>
            <i class="el-icon-close pointer" @click="condition.dialogFormVisible=false "
               style="float: right; padding: 14px 0;color: #5ba0f8;"></i>
          </div>
          <div>
            <el-select
              style="width: 100%"
              v-model="condition.value"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词搜索"
              :remote-method="conditionRemoteMethod"
              :loading="condition.loading">
              <el-option
                v-for="item in condition.options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                @click.native="selectCondition(item)">
              </el-option>
            </el-select>
            <br>
            <br>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
  import uuidv1 from 'uuid/v1'

  export default {
    name: "RuleConfig",
    data() {
      return {
        currentConditionGroupId: null,
        action: {
          value: undefined,
          valueName: null,
          valueType: null,
          type: null,
          loading: false,
          options: []
        },
        actionRules: {
          type: [
            {required: true, message: '请选择规则结果类型', trigger: 'blur'},
          ],
          value: [
            {required: true, message: '请输入结果值', trigger: 'blur'},
          ],
        },
        defaultActionRules: {
          type: [
            {required: true, message: '请选择规则结果类型', trigger: 'blur'},
          ],
          value: [
            {required: true, message: '请输入结果值', trigger: 'blur'},
          ],
        },
        enableDefaultAction: 1,
        defaultAction: {
          value: undefined,
          valueName: null,
          valueType: null,
          type: null,
          loading: false,
          options: [],
        },
        condition: {
          dialogFormVisible: false,
          options: null,
          loading: false,
          value: null,
        },
        id: null,
        conditionGroupDraggable: false,
        currentConditionDragging: null,
        currentConditionCgId: null,
        currentConditionDraggingCG: null,
        conditionGroup: []
      }
    },
    methods: {
      previous() {
        this.$router.push({path: '/RuleDefinition', query: {ruleId: this.id}});
      },
      getConditionNamePrefix(type) {
        if (type === 0) {
          return "元素";
        }
        if (type === 1) {
          return "变量";
        }
        if (type === 2) {
          return "固定值";
        }
      },
      actionSelectClick(item) {
        this.action.valueType = item.valueType;
        this.action.value = item.id;
      },
      defaultActionSelectClick(item) {
        this.defaultAction.valueType = item.valueType;
        this.defaultAction.value = item.id;
      },
      defaultActionRemoteMethod(query) {
        if (query !== '') {
          this.defaultAction.loading = true;
          this.defaultAction.options = [];
          let type = this.defaultAction.type;
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
              this.defaultAction.options = res.data.rows;
            }
            this.defaultAction.loading = false;
          }).catch(function (error) {
            console.log(error);
          });
        } else {
          this.defaultAction.options = [];
        }
      },
      actionRemoteMethod(query) {
        if (query !== '') {
          this.action.loading = true;
          this.action.options = [];
          let type = this.action.type;
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
              this.action.options = res.data.rows;
            }
            this.action.loading = false;
          }).catch(function (error) {
            console.log(error);
          });
        } else {
          this.action.options = [];
        }
      },
      actionTypeChange() {
        this.action.options = [];
        this.action.value = undefined;
        this.action.valueName = null;
      },
      defaultActionTypeChange() {
        this.defaultAction.options = [];
        this.defaultAction.value = undefined;
        this.defaultAction.valueName = null;
      },
      selectCondition(item) {
        this.conditionGroup.forEach((value, index) => {
          if (value.id === this.currentConditionGroupId) {
            let newOrderNo = 1;
            if (value.conditionSets[value.conditionSets.length - 1] !== undefined) {
              newOrderNo = value.conditionSets[value.conditionSets.length - 1].orderNo + 1;
            }
            value.conditionSets.push({
              orderNo: newOrderNo,
              condition: {
                id: item.id,
                name: item.name,
                config: item.config
              }
            });
          }
        });
        this.currentConditionGroupId = null;
        this.condition.dialogFormVisible = false;
        this.condition.value = null;
        this.condition.options = [];
      },
      update() {
        this.$axios.post("/ruleEngine/rule/updateRule", {
          "id": this.id,
          "enableDefaultAction": this.enableDefaultAction,
          "conditionGroup": this.conditionGroup,
          "action": {
            "value": this.action.value,
            "type": this.action.type > 1 ? 2 : this.action.type,
            "valueType": this.action.valueType
          },
          "defaultAction": {
            "value": this.defaultAction.value,
            "type": this.defaultAction.type > 1 ? 2 : this.defaultAction.type,
            "valueType": this.defaultAction.valueType
          }
        }).then(res => {
          let da = res.data;
          if (da) {
            this.$message({
              showClose: true,
              message: '更新成功',
              type: 'success'
            });
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
      },
      nextStep() {
        let ref = this.$refs['actionForm'];
        if (this.enableDefaultAction === 0) {
          ref = this.$refs['actionForm', 'defaultActionForm'];
        }
        ref.validate((valid) => {
          if (valid) {
            //defaultActionForm
            // 先更新规则，到待发布
            this.$axios.post("/ruleEngine/rule/generationRelease", {
              "id": this.id,
              "enableDefaultAction": this.enableDefaultAction,
              "conditionGroup": this.conditionGroup,
              "action": {
                "value": this.action.value,
                "type": this.action.type > 1 ? 2 : this.action.type,
                "valueType": this.action.valueType
              },
              "defaultAction": {
                "value": this.defaultAction.value,
                "type": this.defaultAction.type > 1 ? 2 : this.defaultAction.type,
                "valueType": this.defaultAction.valueType
              }
            }).then(res => {
              let da = res.data;
              if (da) {
                this.$router.push({path: '/RuleViewAndTest', query: {ruleId: this.id}});
              }
            }).catch(function (error) {
              console.log(error);
            });
          }
        });
      },
      conditionRemoteMethod(query) {
        if (query !== '') {
          this.condition.loading = true;
          this.condition.options = [];
          let url = "/ruleEngine/condition/list";
          this.$axios.post(url, {
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
              this.condition.options = res.data.rows;
            }
            this.condition.loading = false;
          }).catch(function (error) {
            console.log(error);
          });
        } else {
          this.condition.options = [];
        }
      },
      addConditionGroup() {
        let length = this.conditionGroup.length;
        let conditionGroupElement = this.conditionGroup[length - 1];
        let newOrderNo = 1;
        if (conditionGroupElement !== undefined) {
          newOrderNo = conditionGroupElement.orderNo + 1;
        }
        let newConditionGroup = {
          id: null,
          uuid: uuidv1(),
          name: "条件组",
          orderNo: newOrderNo,
          conditionSets: []
        };
        this.conditionGroup.push(newConditionGroup);
      },
      deleteConditionGroup(cg) {
        // 删除
        this.conditionGroup.forEach((value, index) => {
          if (this.getUniqueMark(value) === this.getUniqueMark(cg)) {
            this.conditionGroup.splice(index, 1);
          }
        });
      },
      addCondition(cg) {
        // 选择，或者创建
        this.condition.dialogFormVisible = true;
        this.currentConditionGroupId = cg.id;
      },
      removeCondition(conditionSets, id) {
        // 删除
        conditionSets.forEach((value, index) => {
          if (value.condition.id === id) {
            conditionSets.splice(index, 1);
          }
        });
      },
      handleDragStart(e, item, cgId) {
        this.currentConditionDragging = item;
        this.currentConditionCgId = cgId;
      },
      handleDragEnd(e) {
        this.currentConditionDragging = null;
        this.currentConditionCgId = null;
      },
      //首先把div变成可以放置的元素，即重写dragenter/dragover
      handleDragOver(e) {
        // 在dragenter中针对放置目标来设置!
        e.dataTransfer.dropEffect = 'move'
      },
      handleDragEnter(e, item, conditions, cgId) {
        // 如果一个条件组的条件移动到另一个条件组，阻止
        if (cgId !== this.currentConditionCgId) {
          return;
        }
        //为需要移动的元素设置dragstart事件
        e.dataTransfer.effectAllowed = "move";
        // if (item.id === this.currentConditionDragging.id) {
        //   return;
        // }
        let no = item.orderNo;
        let orderNo = this.currentConditionDragging.orderNo;
        conditions.forEach((e) => {
          if (e.condition.id === item.condition.id) {
            e.orderNo = orderNo;
          } else if (e.condition.id === this.currentConditionDragging.condition.id) {
            e.orderNo = no;
          }
        });
        //页面显示排序
        conditions.sort(function (a, b) {
          return a.orderNo - b.orderNo
        });
      }

      , handleDragStartCG(e, item) {
        this.currentConditionDraggingCG = item;
      },
      handleDragEndCG(e) {
        this.currentConditionDraggingCG = null;
      },
      //首先把div变成可以放置的元素，即重写dragenter/dragover
      handleDragOverCG(e) {
        // 在dragenter中针对放置目标来设置!
        e.dataTransfer.dropEffect = 'move';
      },
      handleDragEnterCG(e, item, conditions) {
        //为需要移动的元素设置dragstart事件
        e.dataTransfer.effectAllowed = "move";
        if (item === this.currentConditionDraggingCG) {
          return;
        }
        let no = item.orderNo;
        let orderNo = this.currentConditionDraggingCG.orderNo;
        conditions.forEach((e) => {
          let uniqueMarkE = this.getUniqueMark(e);
          let uniqueMarkItem = this.getUniqueMark(item);
          if (uniqueMarkE === uniqueMarkItem) {
            e.orderNo = orderNo;
          } else if (uniqueMarkE === this.getUniqueMark(this.currentConditionDraggingCG)) {
            e.orderNo = no;
          }
        });
        //页面显示排序
        conditions.sort(function (a, b) {
          return a.orderNo - b.orderNo
        });
      },
      getUniqueMark(value) {
        if (value.id != null) {
          return value.id;
        }
        return value.uuid;
      },
      getRule() {
        if (this.id === undefined) {
          return;
        }
        this.$axios.post("/ruleEngine/rule/getRule", {
          "id": this.id
        }).then(res => {
          let da = res.data;
          if (da != null) {
            this.id = da.id;
            // condition group
            this.conditionGroup = da.conditionGroup;
            // action
            this.action.type = this.getType(da.action.type, da.action.valueType);
            this.action.value = da.action.value;
            this.action.valueName = da.action.valueName;
            this.action.valueType = da.action.valueType;
            // default action
            this.enableDefaultAction = da.enableDefaultAction;
            if (da.defaultAction != null) {
              this.defaultAction.type = this.getType(da.defaultAction.type, da.defaultAction.valueType);
              this.defaultAction.value = da.defaultAction.value;
              this.defaultAction.valueName = da.defaultAction.valueName;
              this.defaultAction.valueType = da.defaultAction.valueType;
            }
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    mounted() {
      this.id = this.$route.query.ruleId;
      this.getRule();
    }
  }
</script>
<style>
  .box-card-header .el-input__inner {
    border: none;
    height: 36px;
    font-size: 16px;
    color: #303133;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }

  .el-input-number .el-input__inner {
    text-align: left;
  }

  .stepp .el-step__title.is-process {
    font-weight: 400;
    color: #C0C4CC;
  }

  .stepp .el-step__icon-inner {
    color: #C0C4CC;
  }
</style>
<style scoped>
  .item {
    line-height: 36px;
    height: 36px;
    padding-left: 6px;
    margin-bottom: 6px;
  }

  .box-card-header {
    margin-top: -20px;
    line-height: 46px;
    height: 24px;
  }

  .conditionGroupCard {
    margin-bottom: 12px;
  }

  .conditionGroupCard:last-child {
    margin-bottom: 0;
  }
</style>
