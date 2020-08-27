<template>
  <div id="ruleDefinition">
    <el-steps :active="1" align-center>
      <el-step title="规则定义" icon="el-icon-edit"></el-step>
      <el-step title="规则配置" icon="el-icon-c-scale-to-original"></el-step>
      <el-step title="规则预览" icon="el-icon-view"></el-step>
    </el-steps>
    <br> <br>

  </div>
</template>

<script>
  export default {
    name: "RuleDefinition",
    data() {
      return {
        form: {
          name: null,
          code: null,
          description: null
        }
      }
    }, methods: {
      reset() {

      },
      nextStep() {
        this.$router.push("/RuleConfig")
      }
    }
  }
</script>

<style scoped>

</style>
