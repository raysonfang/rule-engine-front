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
            <el-form ref="form" :model="form" label-width="40px">
              <el-form-item label="名称" prop="name" style="margin-top: -8px;">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="Code" prop="code" style="margin-top: -8px;">
                <el-input v-model="form.code" :readonly="form.id!==null"></el-input>
              </el-form-item>
              <el-form-item label="说明" prop="description" style="margin-top: -8px;">
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
      }
    }, methods: {
      nextStep() {
        // 先执行保存
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
