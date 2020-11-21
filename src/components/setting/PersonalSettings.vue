<template>
  <div id="personalSettings">

    <el-form ref="form" :rules="rules" :model="form" label-width="100px">

      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="#"
          accept=".jpg,.png"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadImg">
          <img v-if="form.avatar" :src="form.avatar" class="avatar" alt="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <el-progress :percentage="uploadFilePercentage" :stroke-width="4" status="success"
                       v-if="isUploadFilePercentage"></el-progress>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-radio v-model="form.sex" label="男">男</el-radio>
        <el-radio v-model="form.sex" label="女">女</el-radio>
      </el-form-item>


      <el-form-item label="电子邮箱" prop="email">
        <el-input placeholder="请输入邮箱地址" v-model="form.email" class="input-with-select">
        </el-input>
      </el-form-item>

      <el-form-item label="手机" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save('form')">保存信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    export default {
        name: "PersonalSettings",
        data() {
            return {
                isUploadFilePercentage: false,
                uploadFilePercentage: 0,
                form: {
                    id: null,
                    avatar: this.$defaultAvatar,
                    name: null,
                    sex: null,
                    age: 1,
                    email: null,
                    phone: null,
                },
                rules: {
                    email: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                    ]
                },

            }
        },
        created() {
            this.$userApi.getUserInfo().then(res => {
                let data = res.data;
                if (data != null) {
                    this.form.id = data.id;
                    this.form.avatar = data.avatar;
                    this.form.name = data.username;
                    this.form.email = data.email;
                    this.form.sex = data.sex;
                    this.form.phone = data.phone;
                }
            });
        },
        methods: {
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post("/user/updateUserInfo", {
                            "id": this.form.id,
                            "sex": this.form.sex,
                            "age": this.form.age,
                            "avatar": this.form.avatar,
                            "phone": this.form.phone,
                            "email": this.form.email,
                        }).then(res => {
                            if (res.data) {
                                this.$message({
                                    showClose: true,
                                    message: '保存成功',
                                    type: 'success'
                                });
                            }
                        });
                    } else {
                        console.log('error submit!');
                        return false;
                    }
                });
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isLt2M;
            }, uploadImg(file) {
                this.uploadFilePercentage = 0;
                this.isUploadFilePercentage = true;
                let formData = new FormData();
                formData.append('file', file.file);
                this.$axios({
                    url: '/user/uploadAvatar',
                    method: 'post',
                    data: formData,
                    headers: {'Content-Type': 'multipart/form-data'},
                    onUploadProgress: progressEvent => {
                        this.uploadFilePercentage = (progressEvent.loaded / progressEvent.total * 100)
                    }
                }).then(res => {
                    if (res.data != null) {
                        this.form.avatar = res.data;
                    }
                });
            }
        }
    }
</script>

<style scoped>
  #personalSettings {
    background-color: white;
    text-align: left;
    padding: 20px 10px 30px 10px;
  }

  .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar:hover, .el-icon-plus:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    border: 1px dashed #d9d9d9;
    width: 178px;
    height: 178px;
    display: block;
  }

  .el-progress {
    margin-left: -15px;
    width: 230px;
  }

  .el-upload__tip {
    height: 22px;
    line-height: 22px;
    margin-top: 0;
  }

  .el-form {
    width: 360px;
  }
</style>
