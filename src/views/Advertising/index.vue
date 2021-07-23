<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="searchForm" label-width="80px" size="mini">
      <el-row class="header">
        <el-col :span="20">
          <el-form-item class="dictSearch" label="广告名称">
            <el-input v-model="searchForm.name" class="dictInput" clearable max-length="50" placeholder="请输入广告名称" />
          </el-form-item>
          <el-form-item class="dictSearch" label="商家名称">
            <el-input v-model="searchForm.business" class="dictInput" clearable max-length="50" placeholder="请输入商家名称" />
          </el-form-item>
          <el-form-item class="dictSearch" label="生效日期">
            <el-date-picker v-model="searchForm.createDate" type="daterange"  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" style="width: 283px;" clearable />
          </el-form-item>
          <el-form-item class="dictSearch" label="轮播时间">
            <el-time-picker
              v-model="searchForm.createTime"
              is-range
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              style="width: 283px;"
              value-format="HH:mm:ss"
              clearable
            />

          </el-form-item>
        </el-col>
        <el-col :span="4" style="text-align: right;">
          <el-button size="small" type="primary" class="search" @click="queryTable">查询</el-button>
          <el-button size="small" class="clearSearch" @click="clearSearch">清空</el-button>
          <el-button size="small" class="addData" @click="addDetail">新增</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="商家名称">
        <template slot-scope="scope">
          {{ scope.row.business }}
        </template>
      </el-table-column>
      <el-table-column label="广告名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="轮播图片" align="center">
        <template slot-scope="scope">
          <img style="width: 150px; height: 63px" :src=" baseUrl + '/system/files/download?uuid=' + scope.row.fileuuid + '&cropType=trim'">
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="生效日期" align="center">
        <template scope="scope">
          <span>{{ scope.row.startdate.split(" ")[0] }} 至
            {{ scope.row.enddate.split(" ")[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime1" label="轮播时间" align="center">
        <template scope="scope">
          <span>{{ scope.row.starttime }} 至 {{ scope.row.endtime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="option" label="操作" align="center" width="240">
        <template scope="scope">
          <el-button size="mini" class="seeButton" plain @click="handleDetail(scope.row)">查看</el-button>
          <el-button size="mini" class="editButton" type="primary" plain @click="editDetail(scope.row)">编辑</el-button>
          <el-button size="mini" class="delButton" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchData"
    />
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" top="50px" @click="dialogFormVisible = true">
      <el-form :model="form">
        <el-form-item label="商家名称" prop="business" :label-width="formLabelWidth" :rules="[{required: !editFlag, message: '商家名称为必填项', trigger: 'blur'}]">
          <el-input v-model="form.business" autocomplete="off" :disabled="editFlag" placeholder="请输入商家名称" />
        </el-form-item>
        <el-form-item label="广告名称" prop="name" :label-width="formLabelWidth" :rules="[{required: !editFlag, message: '广告名称为必填项', trigger: 'blur'}]">
          <el-input v-model="form.name" autocomplete="off" :disabled="editFlag" placeholder="请输入广告名称" />
        </el-form-item>
        <el-form-item label="广告说明" prop="introduce" :label-width="formLabelWidth" :rules="[{required: !editFlag, message: '广告说明为必填项', trigger: 'blur'}]">
          <el-input v-model="form.introduce" type="textarea" autocomplete="off" :disabled="editFlag" placeholder="请输入广告说明" />
        </el-form-item>
        <el-form-item label="广告链接" prop="connecturl" :label-width="formLabelWidth" :rules="[{required: !editFlag, message: '广告链接为必填项', trigger: 'blur'}]">
          <el-input v-model="form.connecturl" autocomplete="off" :disabled="editFlag" placeholder="请输入广告链接" />
        </el-form-item>
        <el-form-item label="生效日期" :label-width="formLabelWidth" :rules="[{required: !editFlag, message: '生效日期必填项', trigger: 'change'}]">
          <el-date-picker v-model="form.startdate" type="date" :disabled="editFlag" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 200px;" clearable /> - <el-date-picker v-model="form.enddate" type="date" :disabled="editFlag" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 200px;" clearable />
        </el-form-item>
        <el-form-item label="轮播时间" :label-width="formLabelWidth" :rules="[{required: !editFlag, message: '轮播时间必填项', trigger: 'change'}]">
          <el-time-picker v-model="form.starttime" :disabled="editFlag" placeholder="选择开始时间" style="width: 200px;" value-format="HH:mm:ss" clearable /> -
          <el-time-picker v-model="form.endtime" :disabled="editFlag" placeholder="选择结束时间" style="width: 200px;" value-format="HH:mm:ss" clearable />
        </el-form-item>
        <el-form-item label="轮播图片" :label-width="formLabelWidth" :rules="[{required: !editFlag, message: '轮播图片必填项', trigger: 'change'}]">
          <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            accept="image/*"
            :data="uploadDataParams"
            :disabled="editFlag"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.titleImagePath" :src="baseUrl + form.titleImagePath" class="avatar" style="width: 375px;height: 187.5px">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getList } from '@/api/table'
// import { mapState, mapActions } from 'vuex'
import { get, post_array } from '@/utils/axios'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import Pagination from '@/components/Pagination'
import Cookies from 'js-cookie'
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination
  },
  data() {
    return {
      baseUrl: Cookies.get('BASE_URL'),
      dialogFormVisible: false,
      listLoading: true,
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 5
      },
      form: {},
      dialogTitle: '',
      searchForm: {
        name: '',
        business: '',
        createTime1: '',
        createDate: ''
      },
      formLabelWidth: '120px',
      editFlag: false,
      action: Cookies.get('BASE_URL') + '/system/files/fileUpload?token=' + getToken(),
      uploadDataParams: { 'json': JSON.stringify([{ 'width': '375', 'height': '187.5', 'name': 'trim' }, { 'width': '355', 'height': '150', 'name': 'list' }]) }
    }
  },
  computed: {
    // ...mapState('Advertising', ['list', 'total', 'listQuery', 'listLoading', 'form', 'formLabelWidth', 'editFlag', 'token', 'uploadDataParams'])
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      get('Advertisement/page', {
        currentPage: this.listQuery.page,
        pageSize: this.listQuery.limit,
        name: this.searchForm.name,
        business: this.searchForm.business,
        starttime: this.searchForm.createTime ? this.searchForm.createTime[0] : '',
        endtime: this.searchForm.createTime ? this.searchForm.createTime[1] : '',
        startdate: this.searchForm.createDate ? this.searchForm.createDate[0] + ' ' + '00:00:00' : '',
        enddate: this.searchForm.createDate ? this.searchForm.createDate[1] + ' ' + '23:59:59' : ''
      }).then((response) => {
        console.log(response)
        this.total = Number(response.data.total)
        this.list = response.data.list
        this.listLoading = false
      })
    },
    // 编辑
    editDetail(data) {
      console.log(data)
      this.dialogTitle = '编辑广告'
      this.form = data
      this.form.titleImagePath = '/system/files/download?uuid=' + data.fileuuid + '&cropType=trim'
      this.form.createTime1 = [data.starttime, data.endtime]
      this.dialogFormVisible = true
      this.editFlag = false
    },
    // 查看
    handleDetail(data) {
      this.dialogTitle = '查看广告'
      this.form = data
      this.form.titleImagePath = '/system/files/download?uuid=' + data.fileuuid + '&cropType=trim'
      this.form.createTime1 = [data.starttime, data.endtime]
      this.dialogFormVisible = true
      this.editFlag = true
    },
    // 删除
    handleDelete(data) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        post_array('/Advertisement/remove', { id: data.id }).then((res) => {
          if (res.data.code === '0') {
            Message({
              message: '操作成功！',
              type: 'success',
              duration: 1000
            })
            this.fetchData()
            this.dialogFormVisible = false
            // this.dialogFormVisible = false
          } else {
            Message({
              message: res.data.msg,
              type: 'error',
              duration: 1000
            })
          }
          console.log(res)
        })
      })
    },
    // 标题图片前校验
    beforeAvatarUpload(file) {
      var isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        Message({
          message: '上传文件大小不能超过 2MB!',
          type: 'error',
          duration: 1000
        })
        return false
      }
    },
    // 标题图片上传成功
    handleAvatarSuccess(response, file) {
      this.form.titleImagePath = '/system/files/download?uuid=' + response.fileInfo.uuid + '&cropType=trim'
      this.form.fileuuid = response.fileInfo.uuid
      this.$set(this.form)
    },
    handleClose() {
      this.form = {}
      this.fetchData()
      this.dialogFormVisible = false
    },
    handleSave() {
      console.log(this.dialogTitle)
      const param = {}
      param.titleImagePath = this.form.titleImagePath
      param.connecturl = this.form.connecturl
      param.fileuuid = this.form.fileuuid
      param.name = this.form.name
      param.business = this.form.business
      param.introduce = this.form.introduce
      param.starttime = this.form.starttime
      param.endtime = this.form.endtime
      param.startdate = this.form.startdate + ' ' + '00:00:00'
      param.enddate = this.form.enddate + ' ' + '23:59:59'
      console.log(param)
      if (this.dialogTitle === '编辑广告') {
        param.id = this.form.id
        post_array('/Advertisement/update', param).then((res) => {
          if (res.data.code === '0') {
            Message({
              message: '操作成功！',
              type: 'success',
              duration: 1000
            })
            this.fetchData()
            this.dialogFormVisible = false
            // this.dialogFormVisible = false
          }
          console.log(res)
        })
      } else if (this.dialogTitle === '新增广告') {
        post_array('/Advertisement/save', param).then((res) => {
          if (res.data.code === '0') {
            Message({
              message: '操作成功！',
              type: 'success',
              duration: 1000
            })
            this.fetchData()
            this.dialogFormVisible = false
            // this.dialogFormVisible = false
          }
          console.log(res)
        })
      }
    },
    offlineDateAfter(context) {
      // 动态起始时间
      const startTimestamp = Date.parse(this.form.startdate) * 1
      console.log(startTimestamp)
      return {
        disabledDate(time) {
          const timestamp = time.getTime()
          if (timestamp >= startTimestamp) {
            return false
          }
          return true
        }
      }
    },
    addDetail() {
      this.dialogTitle = '新增广告'
      this.dialogFormVisible = true
    },
    queryTable() {
      this.listQuery.page = 1
      console.log(this.searchForm)
      this.fetchData()
    },
    clearSearch() {
      this.searchForm = {
        name: '', // 栏目名称
        business: '', // 栏目分类
        createDate: '',
        createTime: ''
      }
      this.fetchData()
      console.log(2)
    }
  }
}
</script>
