<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="selectFn">筛选</el-button>
            <el-button type="info" size="small" @click="resetselectFn">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="showpubDialogFn">发表文章</el-button>

      </div>
      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%;" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template v-slot="{ row }">
            <el-link type="primary" @click="showDetailFn(row.id)">{{ row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="{ row }">
            <span>{{ $formatDate(row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" size="mini" @click="removeFn(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]" :page-size="q.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- 发表文章的 Dialog 对话框 -->
      <el-dialog title="发表文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose"
        @close="dialogCloseFn">
        <span>
          <!-- 发布文章的对话框 -->
          <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类" prop="cate_id">
              <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
                <el-option :label="item.cate_name" :value="item.id" v-for="item in cateList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
              <!-- 使用 v-model 进行双向的数据绑定 -->
              <quill-editor v-model="pubForm.content" @blur="onEditorChange"></quill-editor>
            </el-form-item>
            <el-form-item label="文章封面" prop="cover_img">
              <!-- 用来显示封面的图片 -->
              <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
              <br />
              <!-- 文件选择框，默认被隐藏 -->
              <input type="file" style="display: none;" accept="image/*" ref="iptFileRef" @change="onCoverChangeFn" />
              <!-- 选择封面的按钮 -->
              <el-button type="text" @click="chooseimageFn">+ 选择封面</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
              <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
            </el-form-item>
          </el-form>
        </span>
      </el-dialog>
      <!-- 查看文章详情的对话框 -->
      <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
        <h1 class="title">{{ artDetail.title }}</h1>

        <div class="info">
          <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
          <span>发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
          <span>所属分类：{{ artDetail.cate_name }}</span>
          <span>状态：{{ artDetail.state }}</span>
        </div>

        <!-- 分割线 -->
        <el-divider></el-divider>

        <!-- 文章的封面 -->
        <img :src="baseURL + artDetail.cover_img" alt="" />

        <!-- 文章的详情 -->
        <div v-html="artDetail.content" class="detail-box"></div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getArtCateListApi, updateArticleApi, getArticleListApi, getArtDetailApi, delArticleApi } from '@/api'
import defaultImg from '@/assets/images/cover.jpg'
import { baseURL } from '@/utils/request'

export default {
  name: 'ArtList',
  data () {
    return {
      baseURL,
      pubDialogVisible: false,
      artList: [],
      total: 0,
      detailVisible: false,
      artDetail: [],
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      cateList: [],
      pubForm: { // 表单的数据对象
        title: '',
        cate_id: '',
        content: '',
        cover_img: null,
        state: ''
      },
      pubFormRules: { // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章标题', trigger: 'change' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        cover_img: [{ required: true, message: '请选择文章封面', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async handleClose (done) {
      const confirmResult = await this.$confirm('此操作将导致文章信息丢失,是否继续', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'cancel') { return }
      done()
    },
    showpubDialogFn () {
      this.pubDialogVisible = true
    },
    async getCateListFn () {
      const { data: res } = await getArtCateListApi()
      console.log(res.message)
      this.cateList = res.data
    },
    chooseimageFn () {
      this.$refs.iptFileRef.click()
    },
    onCoverChangeFn (e) {
      const files = e.target.files

      if (files.length === 0) {
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        this.pubForm.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      this.$refs.pubFormRef.validateField('cover_img')
    },
    pubArticleFn (state) {
      this.pubForm.state = state
      this.$refs.pubFormRef.validate(async (valid) => {
        if (valid) {
          const fd = new FormData()
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('content', this.pubForm.content)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('state', this.pubForm.state)
          const { data: res } = await updateArticleApi(fd)
          if (res.code === 0) {
            this.$message.success(res.message)
            this.pubDialogVisible = false
            this.getArticleListFn()
          } else {
            this.$message.error(res.message)
          }
        } else {
          return false
        }
      })
    },
    onEditorChange () {
      this.$refs.pubFormRef.validateField('content')
    },
    dialogCloseFn () {
      this.$refs.pubFormRef.resetFields()
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    async getArticleListFn () {
      const { data: res } = await getArticleListApi(this.q)
      console.log(res)
      if (res.code !== 0) {
        this.$message.error(res.message)
      } else {
        this.artList = res.data

        this.total = res.total
      }
    },
    handleSizeChange (val) {
      this.q.pagesize = val
      this.q.pagenum = 1
      this.getArticleListFn()
    },
    handleCurrentChange (val) {
      this.q.pagenum = val
      this.getArticleListFn()
    },
    selectFn () {
      this.getArticleListFn()
      this.q.pagenum = 1
      this.q.pagesize = 2
      console.log('测试')
      console.log(this.artList)
    },
    resetselectFn () {
      this.q.cate_id = ''
      this.q.state = ''
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.getArticleListFn()
    },
    async showDetailFn (id) {
      const { data: res } = await getArtDetailApi(id)
      if (res.code !== 0) {
        this.$message.error(res.message)
      } else {
        this.detailVisible = true
        this.artDetail = res.data
        this.$message.success(res.message)
      }
    },
    async removeFn (id) {
      const { data: res } = await delArticleApi(id)
      if (res.code !== 0) {
        this.$message.error(res.message)
      } else {
        if (this.artList.length === 1) {
          if (this.q.pagenum > 1) { --this.q.pagenum }
        }
        this.$message.success(res.message)
        this.getArticleListFn()
      }
    }
  },
  created () {
    this.getCateListFn()
    this.getArticleListFn()
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .btn-pub {
    margin-top: 5px;
  }
}

// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}

// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}

.el-pagination {
  margin-top: 15px;
}

.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;

  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
  img {
    width: 500px;
  }
}
</style>
