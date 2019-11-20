<template>
  <div class="other-summary">
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters" ref="filters" size="small">
          <el-form-item label="牵头领导：" prop="leaderId" class="ld">
            <el-select v-model="filters.leaderId" clearable placeholder="全部">
              <el-option
                v-for="item in leadlist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否存在问题：" prop="isExist" class="zt">
            <el-select v-model="filters.isExist" clearable placeholder="全部">
              <el-option
                v-for="item in questions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDatas('filters')" type="primary">搜 索</el-button>
            <el-button @click="resetForm('filters')">重 置</el-button>
          </el-form-item>
          <div class="toolbtns">
            <el-button type="primary" size="small" @click="handleAdd" v-if="isAddShow">新 增</el-button>
            <el-button type="primary" size="small" v-if="isDownShow">报表下载</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        class="tableinfo"
        border
        :data="tableData"
        :height="tableHeight"
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" width="60" :formatter="formatter"></el-table-column>
        <el-table-column prop="itemsname" label="考评项目"></el-table-column>
        <el-table-column prop="contents" label="指标内容"></el-table-column>
        <el-table-column prop="problems" label="存在问题"></el-table-column>
        <el-table-column prop="nextworks" label="下一步工作措施"></el-table-column>
        <el-table-column prop="leadernames" label="分管区领导">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.leadernames" :key="index">{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="deptnames" label="牵头单位">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.deptnames" :key="index">{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="chengdeptnames" label="承办单位">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.chengdeptnames" :key="index">{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="shideptid" label="市级牵头单位"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button class="btn" @click="handleEdit(scope.$index, scope.row)" v-if="isEditShow">编辑</el-button>
            <el-button class="btn" @click="handleReport(scope.$index, scope.row)" v-if="isReportShow">进展汇报</el-button>
            <el-button class="btn" @click="handleAddDuty(scope.$index, scope.row)" v-if="isProgressShow">添加承办单位</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 40]"
        :page-size="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, sizes, jumper"
        :total="totals"
      ></el-pagination>
    </el-row>

    <!-- 新增 -->
    <el-dialog :title="formTitle" :visible.sync="addFormVisible" width="800px">
      <el-form :model="addForm" label-width="130px" ref="addForm" :append-to-body="true" size="small">
        <div class="dlist">
          <el-form-item
            label="考评项目："
            prop="itemsname"
          >
            <el-input v-model="addForm.itemsname"></el-input>
          </el-form-item>
          <el-form-item
            label="分管区领导："
            prop="fenleaderid"
            :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
          >
            <el-select
              v-model="addForm.fenleaderid"
              placeholder="请选择"
              multiple
              @change="selectChange"
            >
              <el-option
                v-for="item in leadlist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dlist">
          <el-form-item
            label="牵头单位："
            prop="qiandeptid"
            :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
          >
            <el-select
              v-model="addForm.qiandeptid"
              placeholder="请选择"
              multiple
              @change="selectChange"
            >
              <el-option
                v-for="item in deptlist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="市级牵头单位："
            prop="shideptid"
            :rules="[{ required: true, message: '请输入', trigger: 'change' }]"
          >
            <el-input v-model="addForm.shideptid"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="指标内容：" prop="contents">
          <el-input type="textarea" :autosize="{ minRows: 5}" v-model="addForm.contents"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="formSubmit" type="primary">{{btnWord}}</el-button>
      </div>
    </el-dialog>

    <!-- 进展汇报 -->
    <el-dialog title="新增进展汇报" :visible.sync="reportVisible" width="1000px" class="report-dialog">
      <el-form :model="reportForm" label-width="120px" ref="reportForm" :append-to-body="true" size="small">
        <el-row :gutter="40">
          <el-col :span="15">
            <el-form-item
              label="进展情况："
              prop="progress"
              :rules="[{ required: true, message: '进展情况不能为空', trigger: 'change' }]"
            >
              <el-input type="textarea" :autosize="{ minRows: 4}" v-model="reportForm.progress"></el-input>
            </el-form-item>
            <el-form-item label="下步工作措施：" prop="nextplan">
              <el-input type="textarea" :autosize="{ minRows: 4}" v-model="reportForm.nextplan"></el-input>
            </el-form-item>
            <el-form-item label="是否存在问题：" prop="exist">
              <el-radio v-model="reportForm.exist" @change="isQuestion" label="0">否</el-radio>
              <el-radio v-model="reportForm.exist" @change="isQuestion" label="1">是</el-radio>
            </el-form-item>
            <el-form-item label="问题描述：" prop="problem" class="lastitem" v-if="questionShow">
              <el-input type="textarea" :autosize="{ minRows: 4}" v-model="reportForm.problem"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="upwrap">
            <fieldset>
              <legend>上传附件</legend>
              <div class="upbox">
                <el-upload
                  class="upload-demo"
                  :action="upfile"
                  :file-list="fileList"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                >
                  <el-button size="small" type="primary">添加附件</el-button>
                </el-upload>
              </div>
            </fieldset>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="reportSubmit" type="primary">新增</el-button>
      </div>
    </el-dialog>

    <!-- 添加承办单位 -->
    <el-dialog title="添加承办单位" :visible.sync="dutyVisible" width="700px" class="report-dialog">
      <el-form :model="dutyForm" label-width="120px" ref="dutyForm" :append-to-body="true" size="small">
        <el-form-item
          label="承办单位："
          prop="organizerid"
          :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
          class="dutyunit"
        >
          <el-select
            v-model="dutyForm.organizerid"
            placeholder="请选择"
            multiple
            @change="selectChange"
          >
            <el-option v-for="item in deptlist" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作职责：" prop="duty">
          <el-input type="textarea" :autosize="{ minRows: 6}" v-model="dutyForm.duty"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adddutySubmit" type="primary" size="small">新增</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { leaderList, alldeptList } from "../../api/api";
import { upfile, imgIp } from "../../api/imgUrl";
import {
  addSummary,
  getmicList,
  editSummary,
  summarylistId,
  addSummartReport,
  adddutyReport
} from "../../api/targetApi";
export default {
  name: "otherSummary",
  props: [],
  components: {},
  data() {
    return {
      filters: {},
      // 表格数据
      tableData: [],
      targetCheckList: JSON.parse(this.$store.getters.userdata).targetCheckList,
      loginid: JSON.parse(this.$store.getters.userdata).id,
      isAddShow: false,
      isEditShow: false,
      isDownShow: false,
      isProgressShow: false,
      isReportShow:false,
      currentPage: 1,
      pageSize: 10,
      questionShow:false,
      totals: 10,
      addFormVisible: false, //弹窗是否显示
      formTitle: "", //弹窗标题
      addForm: {}, //弹窗form
      btnWord: "", //弹窗按钮文字
      currentStatus: "", //弹窗是编辑还是新增状态
      leadlist: [],
      deptlist: [],
      reportVisible: false, //进展汇报
      reportForm: { exist: "0" },
      fileList: [],
      upfile: "", //文件上传地址
      imgIp: "",
      sid: "",
      fileArr: [], //文件上传后名字数组
      questions: [{ value: "1", name: "是" }, { value: "0", name: "否" }],
      dutyVisible: false,
      dutyForm: {},
      tableHeight:'450px'
    };
  },
  mounted() {},
  created() {
    this.browerHeight();
    this.upfile = upfile;
    this.imgIp = imgIp;
    this.limitChange();
    this.getDeptlist();
    this.getLeaderList();
    this.getAllList();
  },
  methods: {
    // 获取浏览器高度，计算table高度
    browerHeight() {
      var bheight = document.body.clientHeight;
      var hh = bheight - 380;
      this.tableHeight = hh + "px";
    },
    //   获取部门列表
    getDeptlist: function() {
      alldeptList("", data => {
        this.deptlist = data.data.obj;
      });
    },
    // 获取领导列表
    getLeaderList: function() {
      leaderList("", data => {
        this.leadlist = data.data.obj;
      });
    },
    // 获取表格数据列表
    getAllList() {
      let para = { pageSize: this.pageSize, pageNum: this.currentPage, userid:this.loginid };
      getmicList(para, data => {
        console.log(data.data.obj.datas);
        this.tableData = data.data.obj.datas;
        this.totals = data.data.obj.total;
      });
    },
    // 分页点击
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getAllHonor();
    },
    // 分页点击
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getAllHonor();
    },
    // 页面按钮权限控制
    limitChange: function() {
      if (this.targetCheckList !== null) {
        for (var i = 0; i < this.targetCheckList.length; i++) {
          let value = this.targetCheckList[i];
          switch (value) {
            case "D-add":
              this.isAddShow = true;
              break;
            case "D-edit":
              this.isEditShow = true;
              break;
            case "D-down":
              this.isDownShow = true;
              break;
            case "D-process":
              this.isProgressShow = true;
              break;
            case "D-report":
              this.isReportShow = true;
              break;
          }
        }
      }
    },
    selectChange() {
      this.$forceUpdate();
    },
    formatter(row, column, cellValue, index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize;
    },
    // 搜索
    getDatas: function() {
      let para = this.filters;
      para.pageSize = this.pageSize;
      para.pageNum = this.currentPage;   
      para.userid = this.loginid;
      getmicList(para, data => {
        this.tableData = data.data.obj.datas;
        this.totals = data.data.obj.total;
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getAllList();
    },
    // 详情
    handleDetail: function(index, row) {},
    // 编辑
    handleEdit: function(index, row) {
      this.currentStatus = "edit";
      this.formTitle = "编辑";
      this.btnWord = "保存";
      this.addFormVisible = true;
      let para = { id: row.id };
      summarylistId(para, data => {
        this.addForm = data.data.obj;
        if (this.addForm.depts == null) {
          this.addForm.depts = [];
        }
        if (this.addForm.leaders == null) {
          this.addForm.leaders = [];
        }
        this.addForm.qiandeptid = this.addForm.depts;
        this.addForm.fenleaderid = this.addForm.leaders;
      });
      console.log(this.addForm);
    },
    // 新增
    handleAdd: function() {
      this.currentStatus = "add";
      this.formTitle = "新增";
      this.btnWord = "新增";
      this.addFormVisible = true;
    },
    // 提交
    formSubmit() {
      if (this.currentStatus == "add") {
        this.addSubmit();
      } else {
        this.editSubmit();
      }
    },
    // 数组转字符串
    changeArrToString() {
      if (this.addForm.fenleaderid == [] || this.addForm.fenleaderid == null) {
        this.addForm.fenleaderid = "";
      } else {
        if (this.addForm.fenleaderid.length == 1) {
          this.addForm.fenleaderid = this.addForm.fenleaderid.join(",");
          this.addForm.fenleaderid = this.addForm.fenleaderid + ",";
        } else {
          this.addForm.fenleaderid = this.addForm.fenleaderid.join(",");
        }
      }

      if (this.addForm.qiandeptid == [] || this.addForm.qiandeptid == null) {
        this.addForm.qiandeptid = "";
      } else {
        if (this.addForm.qiandeptid.length == 1) {
          this.addForm.qiandeptid = this.addForm.qiandeptid.join(",");
          this.addForm.qiandeptid = this.addForm.qiandeptid + ",";
        } else {
          this.addForm.qiandeptid = this.addForm.qiandeptid.join(",");
        }
      }
      console.log(this.addForm);
    },
    // 新增提交
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.changeArrToString();
          let para = Object.assign({}, this.addForm);
          console.log(para);
          addSummary(para, data => {
            this.getAllList();
            this.$message({
              message: "新增成功",
              type: "success"
            });
            this.addFormVisible = false;
            this.currentStatus = "";
            this.$refs["addForm"].resetFields();
          });
        }
      });
    },
    // 编辑提交
    editSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.changeArrToString();
          let para = Object.assign({}, this.addForm);
          console.log(para);
          editSummary(para, data => {
            this.getAllList();
            this.$message({
              message: "编辑成功",
              type: "success"
            });
            this.addFormVisible = false;
            this.currentStatus = "";
            this.$refs["addForm"].resetFields();
          });
        }
      });
    },
    // 进展汇报
    handleReport: function(index, row) {
      this.reportVisible = true;
      this.sid = row.id;
    },
    // 是否存在问题
    isQuestion(){
      if(this.reportForm.exist == "1"){
        this.questionShow = true;
      }else{
        this.questionShow = false;
      }
    },
    // 添加附件-移除
    handleRemove(file, fileList) {
      let name = file.response.obj;
      this.fileArr.splice(this.removeArr(this.fileArr, name), 1);
      console.log(this.fileArr);
    },
    // 添加附件-成功
    handleSuccess(res, file) {
      this.fileArr.push(res.obj);
      console.log(this.fileArr);
    },
    // 添加承办单位
    handleAddDuty(index, row) {
      this.dutyVisible = true;
      this.sid = row.id;
    },
    // 进展汇报提交
    reportSubmit: function() {
      this.$refs.reportForm.validate(valid => {
        if (valid) {
          let files = "";
          let para = Object.assign({}, this.reportForm);
          if (this.fileArr == []) {
            files = "";
          } else {
            let len = this.fileArr.length;
            if (len == 1) {
              files += this.fileArr[0] + ",";
            } else {
              files = this.fileArr.join(",");
            }
          }
          para.accessory = files;
          para.nid = this.sid;
          console.log(para);
          addSummartReport(para, data => {
            this.fileArr = [];
            this.getAllList();
            this.$message({
              message: "新增成功",
              type: "success"
            });
            this.reportVisible = false;
            this.sid = "";
            this.$refs["reportForm"].resetFields();
          });
        }
      });
    },
    // 添加承办单位
    adddutySubmit: function() {
      this.$refs.dutyForm.validate(valid => {
        if (valid) {
          if (
            this.dutyForm.organizerid == [] ||
            this.dutyForm.organizerid == null
          ) {
            this.dutyForm.organizerid = "";
          } else {
            if (this.dutyForm.organizerid.length == 1) {
              this.dutyForm.organizerid = this.dutyForm.organizerid.join(",");
              this.dutyForm.organizerid = this.dutyForm.organizerid + ",";
            } else {
              this.dutyForm.organizerid = this.dutyForm.organizerid.join(",");
            }
          }
          let para = Object.assign({}, this.dutyForm);
          para.nid = this.sid;
          console.log(para);
            adddutyReport(para, data => {
              this.getAllList();
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.dutyVisible = false;
              this.sid = "";
              this.$refs["dutyForm"].resetFields();
            });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.toolbar {
  .ww1 {
    .el-select {
      width: 120px;
    }
  }
  .ww2 {
    margin-right: 50px;
  }
}
.other-summary {
  .el-dialog {
    .dlist {
      display: flex;
      justify-content: space-between;
    }
    .el-dialog__body {
      padding-right: 60px;
      .el-input {
        width: 200px;
      }
    }
  }
  .report-dialog {
    .el-row {
      display: flex;
      align-items: stretch;
      .el-col-9 {
        fieldset {
          height: 100%;
          .upbox {
            padding: 20px;
          }
        }
      }
      .lastitem {
        margin-bottom: 0;
      }
    }
    .dutyunit {
      .el-select {
        display: block;
        .el-input {
          width: 100%;
        }
      }
    }
  }
}
</style>
