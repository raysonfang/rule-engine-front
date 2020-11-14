<template>
  <div id="ruleDefinition">
    <el-steps :active="1" align-center>
      <el-step title="规则定义" icon="el-icon-edit"/>
      <el-step title="规则配置" icon="el-icon-connection" class="stepp"/>
      <el-step title="规则预览" icon="el-icon-view" class="stepp"/>
    </el-steps>
    <br>
    <br>

    <el-row v-loading="loading">
      <el-col :span="6">
        &nbsp;
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" :body-style="{ padding: '28px 12px 0px 12px' }">
          <div slot="header" class="box-card-header">
            <span>基本信息</span>
          </div>
          <div>
            <el-form ref="form" :model="form" :rules="rules" label-width="60px">
              <el-form-item label="名称" prop="name">
                <el-input v-model="form.name"/>
              </el-form-item>
              <el-form-item label="Code" prop="code">
                <el-input v-model="form.code" :disabled="form.id!==undefined"/>
              </el-form-item>
              <el-form-item label="说明" prop="description">
                <el-input type="textarea" :autosize="{ minRows: 5}" v-model="form.description"/>
              </el-form-item>
            </el-form>
          </div>
        </el-card>

        <br>
        <br>

        <el-button type="primary" @click="nextStep()" style="float: right;">下 一 步</el-button>

      </el-col>
      <el-col :span="6">
        &nbsp;
      </el-col>
    </el-row>

  </div>
</template>

<script>
    export default {
        name: "RuleDefinition",
        data() {
            return {
                loading: false,
                form: {
                    id: null,
                    name: null,
                    code: null,
                    description: null
                },
                rules: {
                    name: [
                        {required: true, message: '请输入规则名称', trigger: 'blur'},
                        {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入规则Code', trigger: 'blur'},
                        {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
                    ],
                }
            }
        }, methods: {
            nextStep() {
                // 先执行保存
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$axios.post("/ruleEngine/rule/saveOrUpdateRuleDefinition", {
                            "id": this.form.id,
                            "code": this.form.code,
                            "name": this.form.name,
                            "description": this.form.description,
                        }).then(res => {
                            let da = res.data;
                            if (da != null) {
                                this.form.id = da;
                                this.$router.push({path: '/RuleConfig', query: {ruleId: da}});
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    } else {
                        console.log('error submit!');
                        return false;
                    }
                });
            }, getRuleDefinition() {
                if (this.form.id === undefined) {
                    return;
                }
                this.loading = true;
                this.$axios.post("/ruleEngine/rule/getRuleDefinition", {
                    "id": this.form.id,
                }).then(res => {
                    let da = res.data;
                    if (da != null) {
                        this.form.name = da.name;
                        this.form.code = da.code;
                        this.form.description = da.description;
                    }
                    this.loading = false;
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }, mounted() {
            this.form.id = this.$route.query.ruleId;
            this.getRuleDefinition();
        }
    }
</script>

<style>
  .stepp .el-step__title.is-process {
    font-weight: 400;
    color: #C0C4CC;
  }

  .stepp .el-step__icon-inner {
    color: #C0C4CC;
  }
</style>
<style scoped>

</style>
