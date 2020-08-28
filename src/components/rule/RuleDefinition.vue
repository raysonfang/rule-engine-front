<template>
  <div id="ruleDefinition">

    <el-row>
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
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="Code" prop="code">
                <el-input v-model="form.code" :readonly="form.id!==undefined"></el-input>
              </el-form-item>
              <el-form-item label="说明" prop="description">
                <el-input type="textarea" :autosize="{ minRows: 5}" v-model="form.description"></el-input>
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
        this.$axios.post("/ruleEngine/rule/getRuleDefinition", {
          "id": this.form.id,
        }).then(res => {
          let da = res.data;
          if (da != null) {
            this.form.name = da.name;
            this.form.code = da.code;
            this.form.description = da.description;
          }
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

<style scoped>

</style>
