<template>
  <div>

    <el-steps :active="3" align-center>
      <el-step title="规则定义" icon="el-icon-edit"/>
      <el-step title="规则定义" icon="el-icon-connection"/>
      <el-step title="规则预览" icon="el-icon-view"/>
    </el-steps>
    <br>
    <br>

    <el-row>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="box-card-header">
            <span>规则</span>
          </div>
          <div>

          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-card class="box-card">
              <div slot="header" class="box-card-header">
                <span>配置信息</span>
              </div>
              <div>

                <el-timeline>
                  <el-timeline-item
                    style="padding-bottom: 0"
                    color="#afd792"
                    :size="cgi===0?'large':'normal'"
                    v-for="(cg, cgi) in conditionGroup" :key="cg.id">
                    <span style="color: #606266;font-size: 14px;" v-if="0===cgi">如果</span>
                    <span style="color: #606266;font-size: 14px;" v-else>或者</span>
                    <div v-for="(c,ci) in cg.conditionGroupCondition" style="margin-left: 20px;">
                      <el-tag class="item" type="info" effect="plain" style="margin-top: 2px">
                        <el-tag type="success" style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                          {{getConditionNamePrefix(c.condition.config.leftValue.type)}}
                        </el-tag>
                        <span style="color: #606266">{{c.condition.config.leftValue.variableValue!=null?c.condition.config.leftValue.variableValue:c.condition.config.leftValue.valueName}}</span>

                        &nbsp;
                        <el-tag type="warning" style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                          {{c.condition.config.symbol}}
                        </el-tag>

                        &nbsp;
                        <el-tag type="success" style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                          {{ getConditionNamePrefix(c.condition.config.rightValue.type)}}
                        </el-tag>
                        <span style="color: #606266"> {{c.condition.config.rightValue.variableValue!=null?c.condition.config.rightValue.variableValue:c.condition.config.rightValue.valueName}}</span>
                      </el-tag>

                      <br>
                      <span style="color: #606266;font-size: 14px;">   {{cg.conditionGroupCondition.length-1===ci?'':'并且'}}</span>
                    </div>
                  </el-timeline-item>
                </el-timeline>


                <span style="color: #606266;font-size: 14px;">返回</span>
                <br>
                <div style="margin-left: 20px;">
                  <el-alert :closable="false" type="success" style="padding: 6px 0 8px 0">
                    {{action.variableValue!=null?action.variableValue:(action.valueName===''?'空':action.valueName)}}
                  </el-alert>
                </div>

                <span style="color: #606266;font-size: 14px;">否则返回</span>
                <br>
                <div style="margin-left: 20px;">
                  <el-alert :closable="false" type="warning" style="padding: 6px 0 8px 0">
                    {{defaultAction.enableDefaultAction===0?(defaultAction.variableValue!=null?defaultAction.variableValue:(defaultAction.valueName===''?'空':defaultAction.valueName)):'null'}}
                  </el-alert>
                </div>

              </div>
            </el-card>


          </el-col>
          <el-col :span="1">&nbsp;</el-col>
        </el-row>
        <br>
        <br>
      </el-col>

      <el-col :span="6">

        <el-card class="box-card" :body-style="{ padding: '28px 12px 0px 12px' }">
          <div slot="header" class="box-card-header">
            <span>接口地址/参数</span>
            <i class="el-icon-document-copy pointer"
               style="float: right; padding: 14px 0;color: #5ba0f8;"/>
          </div>
          <div>
            <el-form label-width="40px">
              <el-form-item label="接口" style="margin-top: -8px;">
                <el-input v-model="request.url" :readonly="true"/>
              </el-form-item>
              <el-form-item label="入参" style="margin-top: -8px;">
                <el-input type="textarea" autosize :autosize="{ maxRows: 10}" v-model="request.paramJson"
                          :readonly="true"/>
              </el-form-item>
            </el-form>
          </div>
        </el-card>

        <br><br>

        <el-card class="box-card" :body-style="{ padding: '28px 12px 0px 12px' }">
          <div slot="header" class="box-card-header">
            <span>模拟运行</span>

            <i class="el-icon-video-play pointer"
               style="float: right; padding: 14px 0;color: #5ba0f8;" @click="run"/>

            <i class=" el-icon-back pointer"
               style="float: right; padding: 14px 9px;color: #5ba0f8;" @click="runGoBack" v-if="runEnd"/>
          </div>

          <div style="min-height: 150px" v-if="!runEnd">

            <el-form label-width="0px" v-if="runPercentage===10">
              <div style="min-height: 150px;text-align: center;font-size: 15px;color: #606266;"
                   v-if="request.param.length===0">
                无入参
              </div>
              <el-form-item v-else style="margin-top: -18px;" v-for="param in request.param" :key="param.code">
                {{param.name}}
                <div v-if="param.valueType==='NUMBER'">
                  <el-input-number v-model="param.value" :controls="false"
                                   :max="10000000000000" style="width: 100%"/>
                </div>
                <div v-else-if="param.valueType==='BOOLEAN'">
                  <el-select v-model="param.value">
                    <el-option label="true" value="true"/>
                    <el-option label="false" value="false"/>
                  </el-select>
                </div>
                <div v-else-if="param.valueType==='COLLECTION'">
                  <el-input type="textarea" :autosize="{ minRows: 2,maxRows:6}" v-model="param.value"/>
                </div>
                <el-input v-model="param.value" v-else max="1000"/>
              </el-form-item>
            </el-form>

            <div v-else style="text-align: center">
              <el-progress type="circle" :percentage="runPercentage"/>
            </div>

          </div>

          <div style="min-height: 150px" v-else>
            <el-form label-width="40px">
              <el-form-item label="结果" style="margin-top: -8px;">
                <el-input type="textarea" :autosize="{ minRows: 5.5}" v-model="runData.value"
                          :readonly="true"/>
              </el-form-item>
            </el-form>
          </div>

        </el-card>

      </el-col>
    </el-row>

    <el-backtop/>

  </div>
</template>

<script>
  export default {
    name: "RuleViewAndTest",
    data() {
      return {
        id: null,
        name: null,
        code: null,
        description: null,
        request: {
          url: null,
          paramJson: null,
          param: [{
            name: null,
            value: null,
            code: null,
            valueType: null,
          }],
          example: null
        },
        runPercentage: 10,
        conditionGroup: [],
        action: {
          value: null,
          valueName: null,
          variableValue: null,
          valueType: null,
          type: null,
          loading: false,
          options: []
        },
        runData: {
          value: null,
          valueType: null,
        },
        runEnd: false,
        defaultAction: {
          enableDefaultAction: 1,
          value: null,
          valueName: null,
          variableValue: null,
          valueType: null,
          type: null,
          loading: false,
          options: [],
        }
      }
    }, methods: {
      runGoBack() {
        this.runPercentage = 10;
        this.runEnd = false;
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
      run() {
        this.runEnd = false;
        this.runPercentage = 20;
        const params = {};
        this.request.param.forEach((e) => {
          params[e.code] = e.value === undefined ? '' : e.value;
        });
        let requestJson = {
          "ruleCode": this.code,
          "param": params
        };
        this.runPercentage = 40;
        this.$axios.post("/ruleEngine/execute", requestJson).then(res => {
          let da = res.data;
          if (da != null) {
            this.runData.value = da.value + "";
            this.runData.valueType = da.valueType;
            this.runPercentage = 100;
            setTimeout(() => {
              this.runEnd = true;
              this.runPercentage = 10;
            }, 1000);
          } else {
            this.runPercentage = 10;
          }
        }).catch(error => {
          this.runPercentage = 10;
          console.log(error);
        });
      },
      getPublishRule(id) {
        this.$axios.post("/ruleEngine/rule/getPublishRule", {
          "id": id
        }).then(res => {
          let da = res.data;
          if (da != null) {
            this.id = da.id;
            this.code = da.code;
            this.name = da.name;
            this.description = da.description;
            // condition group
            this.conditionGroup = da.conditionGroup;
            // action
            this.action.value = da.action.value;
            this.action.valueName = da.action.valueName;
            this.action.variableValue = da.action.variableValue;

            // default action
            if (da.defaultAction !== null) {
              this.defaultAction.enableDefaultAction = da.defaultAction.enableDefaultAction;
              this.defaultAction.value = da.defaultAction.value;
              this.defaultAction.valueName = da.defaultAction.valueName;
              this.defaultAction.variableValue = da.defaultAction.variableValue;
            }
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    }, mounted() {
      let ruleId = this.$route.query.ruleId;
      this.getPublishRule(ruleId);
      this.$axios.post("/ruleEngine/rule/ruleInterfaceDescription", {
        "id": ruleId
      }).then(res => {
        let da = res.data;
        if (da) {
          this.request.url = da.requestUrl;
          this.request.paramJson = JSON.stringify(da.parameters, null, 4);
          this.request.param = da.parameters;
        }
      }).catch(function (error) {
        console.log(error);
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

</style>
