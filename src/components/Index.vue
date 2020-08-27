<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <img src="../assets/logo4.png" class="logo"/>
            </div>
          </el-col>
          <el-col :span="19">
            <div class="grid-content bg-purple-light">
              &nbsp;
            </div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple user">
              <el-dropdown @command="rightHandleCommand" trigger="click">
          <span class="el-dropdown-link username pointer">
            {{username}}&nbsp;<i class="el-icon-arrow-down"></i>
          </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple">
              <img :src="avatar" class="avatar"/></div>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            router :default-active="$route.path"
            class="el-menu-vertical-aside"
            @open="handleOpen"
            @close="handleClose">

            <el-menu-item index="/home">
              <i class="el-icon-s-home"></i>
              <span>首页</span>
            </el-menu-item>

            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>基础组件</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/element">元素</el-menu-item>
                <el-menu-item index="/variable">变量</el-menu-item>
                <el-menu-item index="/function">函数</el-menu-item>
                <el-menu-item index="/condition">条件</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-menu-item index="/rule">
              <i class="el-icon-s-marketing"></i>
              <span>规则</span>
            </el-menu-item>


            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-s-tools"></i>
                <span>设置</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/setting">系统设置</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main style="min-width: 1200px">
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

    },
    methods: {
      rightHandleCommand(command) {
        if (command === 'logout') {
        } else if (command === "userInfo") {
        }
      },
      handleOpen(key, keyPath) {
        //console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        //console.log(key, keyPath);
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
