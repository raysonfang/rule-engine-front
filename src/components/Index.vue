<template>
  <div id="app">
    <el-container v-loading.fullscreen.lock="fullscreenLoading">
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
        <el-aside width="200px">
          <el-menu
            router :default-active="$route.path"
            class="el-menu-vertical-aside"
            @open="handleOpen"
            @close="handleClose">

            <template v-for="(item,index) in menuList">

              <el-menu-item :index="item.menuPath" v-if="item.children.length===0">
                <i :class="item.icon"/>
                <span>{{item.name}}</span>
              </el-menu-item>

              <el-submenu :index="index.toString()" v-else>
                <template slot="title">
                  <i :class="item.icon"/>
                  <span>{{item.name}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="(item,index) in item.children" :index="item.menuPath" :key="index">{{item.name}}
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>

            </template>

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
                fullscreenLoading: false,
                username: null,
                avatar: this.$defaultAvatar,
                menuList: []
            }
        },
        created() {
            this.fullscreenLoading = true;
            this.$userApi.getUserInfo().then(res => {
                let data = res.data;
                if (data != null) {
                    this.username = data.username;
                    this.avatar = data.avatar;
                    sessionStorage.setItem('user', JSON.stringify(data));
                    this.loadMenuTree();
                    this.fullscreenLoading = false;
                } else {
                    this.$message({
                        showClose: true,
                        message: '请先登陆',
                        type: 'warning'
                    });
                    this.$router.push({path: '/login'});
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        methods: {
            loadMenuTree() {
                this.$axios.post("/menu/menuTree")
                    .then(res => {
                        let data = res.data;
                        if (data != null) {
                            this.menuList = data[0].children;
                        } else {
                            this.$message({
                                showClose: true,
                                message: '没有任何访问权限',
                                type: 'warning'
                            });
                        }
                    }).catch(function (error) {
                    console.log(error);
                });
            },
            rightHandleCommand(command) {
                if (command === 'logout') {
                    this.$userApi.logout().then(res => {
                        if (res.data) {
                            localStorage.removeItem('token');
                            sessionStorage.removeItem('user');
                            this.$router.push({path: '/login'});
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                } else if (command === "userInfo") {
                    this.$router.push({path: '/personalSettings'});
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
