<template>
    <el-container class="main-container">
        <el-header>
            <!-- 左侧的 logo -->
            <img src="../../assets/images/logo.png" alt="" />
            <!-- 右侧的菜单 -->
            <el-menu class="el-menu-top" mode="horizontal" background-color="#23262E" text-color="#fff"
                active-text-color="#409EFF">
                <el-submenu index="1">
                    <template slot="title">
                        <!-- 头像 -->
                        <img src="../../assets/images/logo.png" alt="" class="avatar" />
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
                    <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
                    <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
                </el-submenu>
                <el-menu-item index="2" @click="loginout"><i class="el-icon-switch-button"></i>退出</el-menu-item>
            </el-menu>
        </el-header>
        <el-container>
            <!-- 侧边栏区域 -->
            <el-aside width="200px">
                <div class="user-box">
                    <img :src="user_pic" alt="" v-if="user_pic" />
                    <img src="../../assets/images/logo.png" alt="" v-else />
                    <span>欢迎 {{ nickname || username }}</span>
                </div>
                <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :unique-opened="true"
                    background-color="#23262E" text-color="#fff" active-text-color="#409EFF"  router>
                    <template v-for="item in menus">
                    <el-menu-item v-if="!item.children" :index="item.indexPath" :key="item.indexPath">
                        <i :class="item.icon"></i>
                        <span slot="title">{{item.title}}</span>
                    </el-menu-item>
                    <el-submenu  :index="item.indexPath" :key="item.indexPath" v-else>
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span>{{item.title}}</span>
                        </template>

                        <el-menu-item v-for="obj in item.children" :index="obj.indexPath" :key="obj.indexPath">
                            <i :class="obj.icon"></i>
                            <span slot="title">{{obj.title}}</span>
                        </el-menu-item>

                    </el-submenu>

                    </template>
                </el-menu>

            </el-aside>
            <el-container>
                <!-- 页面主体区域 -->
                <el-main>
                    <router-view></router-view>
                </el-main>
                <!-- 底部 footer 区域 -->
                <el-footer>© www.itheima.com - 黑马程序员</el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>
<script>
import { getMenusApi } from '@/api'
import { mapGetters } from 'vuex'
export default {
  name: 'my-layout',
  methods: {
    loginout () {
      this.$confirm('您确定退出吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('updateToken', '')
        this.$store.commit('updateUserInfo', {})
        this.$router.push('/login')
      }).catch((err) => err)
    },
    async getMenusListFn () {
      const { data: res } = await getMenusApi()
      console.log(res)
      this.menus = res.data
    }

  },
  computed: {
    ...mapGetters(
      ['username', 'nickname', 'user_pic']
    )
  },
  data () {
    return {
      menus: []
    }
  },
  created () {
    this.getMenusListFn()
  }

}
</script>
<style lang="less" scoped>
.main-container {
    height: 100%;

    .el-header,
    .el-aside {
        background-color: #23262e;
    }

    .el-header {
        padding: 0;
        display: flex;
        justify-content: space-between;
    }

    .el-main {
        overflow-y: scroll;
        height: 0;
        background-color: #F2F2F2;
    }

    .el-footer {
        background-color: #eee;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.avatar {
    border-radius: 50%;
    width: 35px;
    height: 35px;
    background-color: #fff;
    margin-right: 10px;
    object-fit: cover;
}

// 左侧边栏用户信息区域
.user-box {
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    user-select: none;

    img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: #fff;
        margin-right: 15px;
        object-fit: cover;
    }

    span {
        color: white;
        font-size: 12px;
    }
}
</style>
