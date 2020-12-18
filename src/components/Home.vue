<template>
  <div>
    <el-form>
      <el-form-item prop="workspace">
        <el-select v-model="workspace.value" placeholder="请选择" @change="changeWorkspace()">
          <el-option v-for="item in workspace.options"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "home",
    data() {
      return {
        workspace: {
          options: [],
          value: null
        },
        workspaceSearch: {
          form: {
            name: null,
            code: null,
          }
        },
      }
    },
    created() {
      this.$axios.post("/workspace/list", {
        "page": {
          "pageIndex": 1,
          "pageSize": 10,
        },
        "query": this.workspaceSearch.form,
        "orders": [
          {
            "columnName": "id",
            "desc": true
          }
        ]
      }).then(res => {
        if (res.data != null && res.data.length !== 0) {
          this.workspace.options = res.data.rows;
        }
      });
      this.$axios.post("/workspace/currentWorkspace", {}).then(res => {
        if (res.data != null) {
          this.workspace.value = res.data.id;
        }
      });
    },
    methods: {
      changeWorkspace() {
        this.$axios.post("/workspace/change", {
          "id": this.workspace.value
        }).then(res => {
          if (res.data != null) {
            this.$message({
              showClose: true,
              message: '切换成功',
              type: 'success'
            });
          }
        });
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
