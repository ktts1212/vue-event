<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix header-box">
                <span>文章分类</span>
                <el-button type="primary" size="mini" @click="addarccateFn">添加分类</el-button>
                <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @close="closedialogFn">
                    <span>
                        <!-- 添加的表单 -->
                        <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
                            <el-form-item label="分类名称" prop="cate_name">
                                <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
                            </el-form-item>
                            <el-form-item label="分类别名" prop="cate_alias">
                                <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
                            </el-form-item>
                        </el-form>
                    </span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="canceldialog">取 消</el-button>
                        <el-button type="primary" @click="confirmdialog">确 定</el-button>
                    </span>
                </el-dialog>
            </div>

            <el-table :data="cateList" style="width: 100%" border stripe>

                <el-table-column type="index" label="序号" width="100"></el-table-column>
                <el-table-column prop="cate_name" label="分类名称"></el-table-column>
                <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                    <el-button type="primary" size="mini" @click="updateartFn(scope.row)">修改</el-button>
                    <el-button type="danger" size="mini" @click="deleteartFn(scope.row.id)">删除</el-button>
                </template>
                </el-table-column>

            </el-table>
        </el-card>

    </div>
</template>

<script>
import { getArtCateListApi, addArtCateListApi, updateArtCateListApi, deleteArtCateListApi } from '@/api'
export default {
  name: 'ArtCate',
  data () {
    return {
      cateList: [],
      dialogVisible: false,
      isEdit: false,
      EditID: '',
      // ...其他
      addForm: { // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: { // 添加表单的验证规则对象
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getArtCateFn()
  },
  methods: {
    async getArtCateFn () {
      const { data: res } = await getArtCateListApi()
      console.log(res)
      this.cateList = res.data
    },
    addarccateFn () {
      this.dialogVisible = true
      this.isEdit = false
    },
    canceldialog () {
      this.dialogVisible = false
    },
    confirmdialog () {
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          if (this.isEdit) {
            this.addForm.id = this.EditID
            const { data: res } = await updateArtCateListApi(this.addForm)
            if (res.code !== 0) {
              this.$message.error(res.message)
            } else {
              this.$message.success(res.message)
              this.dialogVisible = false
              this.getArtCateFn()
            }
          } else {
            const { data: res } = await addArtCateListApi(this.addForm)
            if (res.code !== 0) {
              this.$message.error(res.message)
            } else {
              this.$message.success(res.message)
              this.dialogVisible = false
              this.getArtCateFn()
            }
          }
        } else {
          return false
        }
      })
    },
    closedialogFn () {
      this.$refs.addRef.resetFields()
    },
    updateartFn (obj) {
      console.log(obj)
      this.dialogVisible = true
      this.isEdit = true
      this.EditID = obj.id
      this.$nextTick(() => {
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    deleteartFn (id) {
      this.$confirm('此操作将永久删除，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // this.deleteartByid(parseInt(id))
        const { data: res } = await deleteArtCateListApi(id)
        if (res.code !== 0) {
          this.$message.error(res.message)
        } else {
          this.$message.success('删除成功!')
          this.getArtCateFn()
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    async deleteartByid (id) {
      const { data: res } = await deleteArtCateListApi(id)
      if (res.code !== 0) {
        this.$message.error(res.message)
      } else {
        this.$message.success('删除成功!')
        this.getArtCateFn()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
