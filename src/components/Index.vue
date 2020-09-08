<template>
  <div id="app">
    <el-container>
      <el-header style="min-width: 1400px">
        <el-row>
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <img src="../assets/logo4.png" class="logo" alt=""/>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="grid-content bg-purple-light">
              &nbsp;
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple user" style="width: 100%">
              <el-dropdown @command="rightHandleCommand" trigger="click">
                <span class="el-dropdown-link username pointer" style="float: right">
                  {{username}}&nbsp;<i class="el-icon-arrow-down"/>
                </span>
                <el-dropdown-menu slot="dropdown" style="width: 96px">
                  <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple">
              <img :src="avatar" class="avatar" alt=""/></div>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="180px">
          <el-menu
            router :default-active="$route.path"
            class="el-menu-vertical-aside"
            @open="handleOpen"
            @close="handleClose">

            <el-menu-item index="/home">
              <i class="el-icon-s-home"/>
              <span>首页</span>
            </el-menu-item>

            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu"/>
                <span>基础组件</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/element">元素</el-menu-item>
                <el-menu-item index="/variable">变量</el-menu-item>
                <el-menu-item index="/function">函数</el-menu-item>
                <el-menu-item index="/condition">条件</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-s-marketing"/>
                <span>功能</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/rule">规则</el-menu-item>
                <el-menu-item index="/decisionTree">决策树</el-menu-item>
                <el-menu-item index="/scoreCard">评分卡</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-s-tools"/>
                <span>设置</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/systemSetting">系统设置</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main style="min-width: 1220px">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: "Index",
    data() {
      return {
        username: null,
        avatar: this.$defaultAvatar
      }
    },
    created() {
      this.$axios
        .post("/user/getUserInfo")
        .then(res => {
          let data = res.data;
          if (data != null) {
            this.username = data.username;
            //this.avatar = data.avatarUrl;
            sessionStorage.setItem('user', JSON.stringify(data));
          } else {
            this.$message({
              showClose: true,
              message: '请先登陆',
              type: 'warning'
            });
            this.$router.push({path: '/login'});
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    methods: {
      rightHandleCommand(command) {
        if (command === 'logout') {
          this.$axios.post("/user/logout")
            .then(res => {
              if (res.data) {
                sessionStorage.removeItem('user');
                this.$router.push({path: '/login'});
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else if (command === "userInfo") {
        }
      },
      handleOpen(key, keyPath) {

      },
      handleClose(key, keyPath) {

      }
    }
  }
</script>

<style scoped>
  .el-header, .el-footer {
    color: #333;
    text-align: center;
    line-height: 60px;
    border-bottom: 0.2px solid #e9e9e9;
  }

  .el-aside {
    color: #333;
    text-align: left;
    line-height: 200px;
    height: 1200px;
  }


  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .bg-purple-light {
  }

  .grid-content {
    border-radius: 4px;
    max-height: 60px;
    line-height: 60px;
  }

  .avatar {
    border-radius: 10px;
    width: 42px;
    height: 42px;
    margin-top: 9px;
  }

  .logo {
    width: 180px;
    height: 59px;
  }

  .user {
    text-align: right;
  }
</style>
