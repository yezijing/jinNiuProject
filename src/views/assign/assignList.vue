<template>
  <div class="content-wrap assignlist">
    <div v-if="allShow">
      <p class="navtitle">
        <span>批交办事项</span>
      </p>
      <div v-show="isShow">
        <!--工具条-->
        <el-row>
          <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filters" ref="filters" size="small">
              <el-form-item label="编号：" prop="checkCode" class="lb">
                <el-input v-model="filters.checkCode" placeholder="请输入" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="牵头单位：" prop="leaderDeptId" class="lb">
                <el-select
                  v-model="filters.leaderDeptId"
                  filterable
                  clearable
                  placeholder="全部"
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
              <el-form-item label="材料报送：" prop="formstatus" class="zt">
                <el-select
                  v-model="filters.formstatus"
                  clearable
                  placeholder="全部"
                  @change="selectChange"
                >
                  <el-option
                    v-for="item in formStatus"
                    :key="item.value"
                    :label="item.status"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="总体进度：" prop="totalstatus" class="zt">
                <el-select
                  v-model="filters.totalstatus"
                  clearable
                  placeholder="全部"
                  @change="selectChange"
                >
                  <el-option
                    v-for="item in totalStatus"
                    :key="item.value"
                    :label="item.status"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button @click="getDatas('filters')" type="primary">搜 索</el-button>
                <el-button @click="resetForm('filters')">重 置</el-button>
              </el-form-item>
              <div class="toolbtns">
                <div>
                  <el-button type="primary" size="small" @click="handleAdd" v-if="isAddShow">新 增</el-button>
                  <el-button
                    type="primary"
                    size="small"
                    @click="checkDownload"
                    v-if="isDownShow"
                  >报表下载</el-button>
                  <!-- <el-button type="primary" size="small" @click="downMoudle" v-if="isDownShow">下载模板</el-button>
                  <el-button type="primary" size="small" @click="loadData" v-if="isAddShow">导入数据</el-button>-->
                  <el-button type="primary" size="small" @click="batchRule" v-if="isEditShow">报送规则</el-button>
                </div>
                <el-form-item label="选择隐藏列：" prop="cellhidden">
                  <el-select
                    v-model="cellhidden"
                    multiple
                    collapse-tags
                    placeholder="全部"
                    @change="itemChange"
                  >
                    <el-option
                      v-for="item in showitemlist"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-form>
          </el-col>
        </el-row>
        <!-- 列表 -->
        <el-row>
          <el-table
            class="tableinfo"
            empty-text="无"
            border
            :data="assignDatas"
            highlight-current-row
            :cell-class-name="cellClassName"
            :row-class-name="tableRowClassName"
            style="width: 100%;"
            v-loading="loading"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.7)"
          >
            <el-table-column label="序号" width="60" :formatter="numberFormatter"></el-table-column>
            <el-table-column prop="code" width="120" label="编号" class-name="bh">
              <template slot-scope="scope">
                <div
                  class="title"
                  @click="handleDetail(scope.$index, scope.row, scope.row.id)"
                >{{scope.row.code}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="checkMeetList" label="督办事项">
              <template slot-scope="scope">
                <el-tooltip effect="dark" placement="top-start">
                  <div style="max-width:300px;line-height:2;" slot="content">
                    <p
                      v-for="(item, index) in scope.row.checkMeetList"
                      :key="index"
                    >({{index+1}}) {{item.remark}}</p>
                  </div>
                  <div>
                    <p
                      v-for="(item, index) in scope.row.checkMeetList"
                      :key="index"
                      style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;text-align:left;"
                    >({{index+1}}){{item.remark}}</p>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="jobrequire" label="工作要求" v-if="ishidden1">
              <template slot-scope="scope">
                <el-tooltip effect="dark" placement="top-start">
                  <div style="max-width:300px;line-height:2;" slot="content">
                    <p>{{scope.row.jobrequire}}</p>
                  </div>
                  <p class="title-ellipsis">{{scope.row.jobrequire}}</p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="leaderList" label="牵头单位" v-if="ishidden2">
              <template slot-scope="scope">
                <div>
                  <p v-for="(lead, index) in scope.row.leaderList" :key="index">{{lead.deptName}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="dutyList" label="责任单位" v-if="ishidden3">
              <template slot-scope="scope">
                <div>
                  <p v-for="(lead, index) in scope.row.dutyList" :key="index">{{lead.deptName}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="arealeadNameList" label="牵头区领导" v-if="ishidden7">
              <template slot-scope="scope">
                <div>
                  <p v-for="(item, index) in scope.row.arealeadNameList" :key="index">{{item}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="receiptList" label="总体情况" v-if="ishidden4">
              <template slot-scope="scope">
                <div>
                  <el-tooltip effect="dark" placement="top-start">
                    <div style="max-width:300px;line-height:2;" slot="content">
                      <p
                        v-for="(item, index) in scope.row.receiptList"
                        :key="index"
                      >{{item.question}}</p>
                    </div>
                    <div>
                      <p
                        v-for="(item, index) in scope.row.receiptList"
                        :key="index"
                        style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;text-align:left;"
                      >{{item.question}}</p>
                    </div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="receiptList" label="存在问题" v-if="ishidden5">
              <template slot-scope="scope">
                <div>
                  <el-tooltip effect="dark" placement="top-start">
                    <div style="max-width:300px;line-height:2;" slot="content">
                      <p v-for="(item, index) in scope.row.receiptList" :key="index">{{item.wenti}}</p>
                    </div>
                    <div>
                      <p
                        v-for="(item, index) in scope.row.receiptList"
                        :key="index"
                        style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;text-align:left;"
                      >{{item.wenti}}</p>
                    </div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="receiptList" label="下步工作计划" v-if="ishidden6">
              <template slot-scope="scope">
                <div>
                  <el-tooltip effect="dark" placement="top-start">
                    <div style="max-width:300px;line-height:2;" slot="content">
                      <p
                        v-for="(item, index) in scope.row.receiptList"
                        :key="index"
                      >{{item.measure}}</p>
                    </div>
                    <div>
                      <p
                        v-for="(item, index) in scope.row.receiptList"
                        :key="index"
                        style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;text-align:left;"
                      >{{item.measure}}</p>
                    </div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="formstatus" label="材料报送">
              <template slot-scope="scope">
                <div>
                  <i class="fa mark" v-if="scope.row.formstatus==1" style="background:#fbe804;"></i>
                  <i class="fa mark" v-else-if="scope.row.formstatus==2" style="background:#f00;"></i>
                  <i class="fa mark" v-else-if="scope.row.formstatus== -1" style="background:#999;"></i>
                  <i class="fa mark" v-else></i>
                  <span v-html="formstatusFormat(scope,scope.row.formstatus)"></span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="totalstatus" label="总体进度">
              <template slot-scope="scope">
                <div class="flexbox editbtns" v-if="isEditShow">
                  <i class="fa mark" v-if="scope.row.totalstatus==3" style="background:#364e98;"></i>
                  <i
                    class="fa mark"
                    v-else-if="scope.row.totalstatus==4"
                    style="background:#7c1d77;"
                  ></i>
                  <i
                    class="fa mark"
                    v-else-if="scope.row.totalstatus== -1"
                    style="background:#999;"
                  ></i>
                  <i class="fa mark" v-else></i>
                  <el-select
                    v-model="scope.row.totalstatus"
                    @change="totalstateChange(scope, scope.row)"
                    class="stateSelect"
                  >
                    <el-option
                      v-for="item in totalStatus"
                      :key="item.value"
                      :label="item.status"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <div class="nomask"></div>
                </div>
                <div v-else>
                  <el-tag size="medium">
                    <i class="fa mark" v-if="scope.row.totalstatus==3" style="background:#364e98;"></i>
                    <i
                      class="fa mark"
                      v-else-if="scope.row.totalstatus==4"
                      style="background:#7c1d77;"
                    ></i>
                    <i
                      class="fa mark"
                      v-else-if="scope.row.totalstatus== -1"
                      style="background:#999;"
                    ></i>
                    <i class="fa mark" v-else></i>
                    <span v-html="totalstatusFormat(scope,scope.row.totalstatus)"></span>
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
              <template scope="scope">
                <el-button
                  class="btn"
                  @click="handleDetail(scope.$index, scope.row, scope.row.id)"
                >详情</el-button>
                <el-button
                  class="btn nobtn"
                  @click="handleEdit(scope.$index, scope.row, scope.row.id)"
                  v-if="isEditShow"
                >编辑</el-button>
                <el-button
                  class="btn nobtn"
                  @click="handleDelete(scope.$index, scope.row, scope.row.id)"
                  v-if="isEditShow"
                >删除</el-button>
                <el-button
                  class="btn nobtn"
                  @click="handleReport(scope.$index, scope.row, scope.row.id)"
                  v-if="isReportShow"
                >进展汇报</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 40, 50]"
            :page-size="pageSize"
            layout="total, prev, pager, next, sizes, jumper"
            :total="totals"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <!-- 导入文件 -->
    <div class="import-data-box">
      <import-file
        :importdataVisible.sync="importdataVisible"
        :upbtnDisabled.sync="upbtnDisabled"
        :showYearbox="showYearbox"
        :itemShow="itemShow"
        @getAllList-event="getAssignList"
      ></import-file>
    </div>

    <!-- 选择下载格式 -->
    <el-dialog title="选择下载格式" :visible.sync="downTypeVisible" width="400px">
      <div style="text-align:center;">
        <el-radio-group v-model="downType">
          <el-radio :label="1">Excel</el-radio>
          <el-radio style="margin-left: 56px;" :label="2">Word</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="downDatalist" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增 -->
    <div class="project-box" v-if="addShow">
      <add-assign
        @my-event="handleBack"
        @updateList="getAssignList"
        v-bind:addheight="addheight"
        v-bind:deptlist="deptlist"
        v-bind:leaderUsers="leaderUsers"
      ></add-assign>
    </div>
    <!-- 编辑 -->
    <div class="project-box" v-if="editShow">
      <edit-assign
        @my-event="handleBack"
        @updateList="getAssignList"
        v-bind:deptlist="deptlist"
        v-bind:basicInfo="basicInfo"
        v-bind:checkMeetList="checkMeetList"
        v-bind:addheight="addheight"
        v-bind:ruleList="ruleList"
        v-bind:leaderUsers="leaderUsers"
        v-bind:checkReceipt="checkReceipt"
        v-bind:ccid="ccid"
        v-bind:leadsData="leadsData"
        v-bind:dutysData="dutysData"
        v-bind:newReportList="newReportList"
        v-bind:fileArr="fileArr"
      ></edit-assign>
    </div>
    <!-- 详情 -->
    <div class="project-box" v-if="detailShow">
      <detail-assign
        @my-event="handleBack"
        @edit-event="toeditPage"
        v-bind:basicInfo="basicInfo"
        v-bind:addheight2="addheight2"
        v-bind:checkMeetList="checkMeetList"
        v-bind:deptlist="deptlist"
        v-bind:histableHeight="histableHeight"
        v-bind:aid="aid"
        v-bind:ruleList="ruleList"
        v-bind:leaderUsers="leaderUsers"
        v-bind:checkReceipt="checkReceipt"
        v-bind:isEditShow="isEditShow"
        v-bind:noEdit="noEdit"
        v-bind:leadsData="leadsData"
        v-bind:dutysData="dutysData"
        v-bind:newReportList="newReportList"
        v-bind:fileArr="fileArr"
        v-bind:isCenter="isCenter"
      ></detail-assign>
    </div>

    <!-- 进展填报 -->
    <div class="report-data-box">
      <report-progress
        :reportVisible.sync="reportVisible"
        :reportData="reportData"
        :laststate="laststate"
        :itemShow="itemShow"
        :workid="checkid"
        :reportBasic="reportBasic"
        :fileList.sync="fileList"
        :fileArr.sync="fileArr"
        :isExport.sync="isExport"
        @getAllList-event="getAssignList"
      ></report-progress>
    </div>

    <!-- 报送规则 -->
    <div class="batchrule-box" v-if="batchVisible">
      <batch-rule
        @my-back="batchBack"
        :batchHeight="batchHeight"
        :allitems="allitems"
        :itemShow="itemShow"
      ></batch-rule>
    </div>
  </div>
</template>

<script>
import { upfile, imgIp, importProjectList } from "../../api/imgUrl";
import { defaturl } from "../../api/apiUrl";
import addAssign from "./addAssign"; //新增项目
import editAssign from "./editAssign"; //编辑项目
import detailAssign from "./detailAssign"; //编辑项目
import reportContent from "../report"; //进展汇报
import batchRule from "../batchrule"; //报送规则
import importFile from "../importItem"; //导入文件
import reportProgress from "../reportItem"; //进展汇报
import {
  allusers,
  alldeptList,
  isHidden,
  editHidden,
  leaderList,
  reportTerm,
  savereportInfo
} from "../../api/api";
import {
  assignList,
  addAssignReport,
  meetList,
  assignDetail,
  assignOver,
  threeplanLag,
  changeFormstate,
  changeTotalstate,
  getStatusForm,
  deleteAssign,
  showAssignLasttime,
  getAllAssign
} from "../../api/assignApi";
import { repeatAssignReport } from "../../api/center";
export default {
  name: "assignlive",
  components: {
    addAssign,
    editAssign,
    detailAssign,
    reportContent,
    batchRule,
    importFile,
    reportProgress
  },
  data() {
    return {
      downTypeVisible: false,
      downType: "",
      upbtnDisabled: false,
      showYearbox: false,
      isExport: {visible:true},
      allitems: [],
      batchHeight: "",
      batchVisible: false,
      allShow: true,
      laststate: "", //上一次进展情况
      reportVisible: { visible: false },
      itemShow: 2,
      reportid: -1,
      reportBasic: {},
      isCenter: 3,
      loading: true,
      isShow: true,
      addShow: false,
      detailShow: false,
      editShow: false,
      receiptVisible: false,
      loginid: JSON.parse(this.$store.getters.userdata).id,
      filters: {},
      userlist: [],
      deptlist: [],
      assignId: -1,
      fileList: [],
      filepath: [],
      reportData: {},
      currentPage: 1,
      pageSize: 10,
      totals: 0,
      statuss: [
        { value: 0, status: "正常" },
        { value: 1, status: "预警" },
        { value: 2, status: "逾期" },
        { value: 3, status: "滞后" },
        { value: 4, status: "严重滞后" },
        { value: -1, status: "完结" }
      ],
      assignDetailData: {},
      // 表格数据
      assignDatas: [],
      checkid: "",
      checkId: "-1",
      meets: [],
      detailAssignData: [],
      basicInfo: {},
      checkMeetList: [],
      astatus: "",
      assignCheckList: JSON.parse(this.$store.getters.userdata).assignCheckList,
      isAddShow: false,
      isEditShow: false,
      isReportShow: false,
      isOverShow: false,
      isDownShow: false,
      upfile: "",
      imgIp: "",
      cellhidden: [],
      tableHeight: "500px", //设置表格高度
      histableHeight: "300px",
      ishidden1: true,
      ishidden2: true,
      ishidden3: true,
      ishidden4: true,
      ishidden5: true,
      ishidden6: true,
      ishidden7: true,
      fileArr: [],
      colums: "",
      showitemlist: [
        {
          name: "工作要求",
          value: 1
        },
        {
          name: "牵头单位",
          value: 2
        },
        {
          name: "责任单位",
          value: 3
        },
        {
          name: "总体情况",
          value: 4
        },
        {
          name: "存在问题",
          value: 5
        },
        {
          name: "下步工作计划",
          value: 6
        },
        {
          name: "牵头区领导",
          value: 7
        }
      ],
      addheight: "height:500px",
      addheight2: "height:500px",
      ruleList: [], //报送规则列表
      leaderUsers: [], //牵头区领导
      totalStatus: [
        { value: 0, status: "正常" },
        { value: 3, status: "滞后" },
        { value: 4, status: "严重滞后" },
        { value: -1, status: "完结" }
      ],
      formStatus: [
        { value: 0, status: "正常" },
        { value: 1, status: "预警" },
        { value: 2, status: "逾期" },
        { value: -1, status: "完结" }
      ],
      aid: "", //批交办事项id
      checkReceipt: {}, //回执
      ccid: "",
      noEdit: true,
      leadsData: [],
      dutysData: [],
      defaturl: "",
      importdataVisible: false, //导入数据弹窗
      pdatalist: [], //导入数据文件filelist
      importProjectList: "",
      filedatas: [],
      newReportList: [], //详情进展情况最新
      newFiles: [] //进展汇报最新一条附件列表
    };
  },
  mounted() {},
  created() {
    this.upfile = upfile;
    this.imgIp = imgIp;
    this.defaturl = defaturl;
    this.importProjectList = importProjectList;
    this.hiddenDatas();
    this.browerHeight();
    this.limitChange();
    this.passValue();
    this.getDeptlist();
    this.getUsers();
    this.getAssignList();
    this.getLeaderList(); //牵头区领导数据
    this.centerDetail();
  },
  methods: {
    // 报表下载
    checkDownload() {
      this.downTypeVisible = true;
    },
    downDatalist() {
      if (this.downType == 1) {
        window.open(this.defaturl + "/report/createCheckReport");
      } else {
        window.open(this.defaturl + "/CheckExport2Word/export");
      }
      this.downTypeVisible = false;
    },

    // 获取所有项目数据
    getAllDatas() {
      getAllAssign("", data => {
        if (data.data.obj == null) {
          this.allitems = [];
        } else {
          this.allitems = data.data.obj;
          for (var i = 0; i < this.allitems.length; i++) {
            this.allitems[i].name = this.allitems[i].code;
          }
        }
      });
    },
    // 规则组件
    batchRule() {
      this.allShow = false;
      this.batchVisible = true;
      this.getAllDatas();
    },
    // 规则页面返回
    batchBack() {
      this.allShow = true;
      this.batchVisible = false;
      this.getAssignList();
    },
    // 删除批交办
    handleDelete(index, row, id) {
      this.$confirm(
        '<span style="color:#f00;">该操作将删除该事项信息</span>，确定删除吗?',
        "提示",
        { type: "warning", dangerouslyUseHTMLString: true }
      )
        .then(() => {
          let para = { cid: id };
          deleteAssign(para, data => {
            if (data.data.code == 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getAssignList();
            } else {
              this.$message({
                message: "删除失败",
                type: "error"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            message: "取消删除",
            type: "warning"
          });
        });
    },
    // 添加附件 移除
    dataRemove(file, fileList) {
      let name = file.response.obj;
      this.filedatas.splice(this.removeArr(this.filedatas, name), 1);
      this.errorShow = false;
      this.successShow = false;
      this.sureImport = true;
    },
    // 上传文件超出个数提示
    handleExceed(files, fileList) {
      this.$message.warning({
        message:
          "当前限制只能上传 1 个文件，请先删除已上传的文件，再重新上传！",
        duration: 5000
      });
    },

    // 添加附件 状态改变时
    dataSuccess(file, pdatalist) {
      if (file.code == -1) {
        this.errorShow = true;
        this.successShow = false;
        this.sureImport = true;
      } else {
        this.successShow = true;
        this.errorShow = false;
        this.sureImport = false;
        let name = file.obj;
        this.filedatas.push(name);
        this.getAssignList();
      }
    },
    // 上传之前判断文件类型
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      if (!extension && !extension2) {
        this.$message({
          message: "上传文件只能是 xls、xlsx格式!",
          type: "warning"
        });
      }
      return extension || extension2;
    },
    // 导入数据
    loadData() {
      this.pdatalist = [];
      this.filedatas = [];
      this.sureImport = true;
      this.errorShow = false;
      this.successShow = false;
      this.importdataVisible = true;
    },
    // 确定导入
    sureImportData() {
      this.$refs.uploaddata.submit();
      this.importdataVisible = false;
      this.$message({
        type: "success",
        message: "导入成功!"
      });
    },
    // 下载模板
    downMoudle() {
      window.open(this.defaturl + "/templateDownload/projectTemplateDown");
    },

    // 手动修改状态 - 总体进度
    totalstateChange(scope, row) {
      let para = { totalstatus: row.totalstatus, checkid: row.id };
      changeTotalstate(para, data => {
        this.getAssignList();
        this.$message({
          type: "success",
          message: "修改状态成功!"
        });
      });
    },
    // 手动修改状态 - 报送进度
    formstateChange(scope, row) {
      let para = { formstatus: row.formstatus, checkid: row.id };
      changeFormstate(para, data => {
        this.getAssignList();
        this.$message({
          type: "success",
          message: "修改状态成功!"
        });
      });
    },
    // 总体进度状态
    totalstatusFormat(scope, value) {
      switch (value) {
        case 0:
          return "正常";
          break;
        case 3:
          return "滞后";
          break;
        case 4:
          return "严重滞后";
          break;
        case -1:
          return "完结";
          break;
      }
    },
    // 材料报送状态
    formstatusFormat(scope, value) {
      switch (value) {
        case 0:
          return "正常";
          break;
        case 1:
          return "预警";
          break;
        case 2:
          return "逾期";
          break;
        case -1:
          return "完结";
          break;
      }
    },
    // 序号
    numberFormatter(row, column, cellValue, index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize;
    },
    // 获取牵头区领导数据
    getLeaderList: function() {
      leaderList("", data => {
        this.leaderUsers = data.data.obj;
      });
    },
    // 获取浏览器高度，计算table高度
    browerHeight() {
      var bheight = document.body.clientHeight;
      var hh = bheight - 380;
      var hh2 = bheight - 280;
      var hh3 = bheight - 320;
      var rh = bheight - 250;
      this.batchHeight = rh + "px";
      this.tableHeight = hh + "px";
      this.addheight = "height:" + hh + "px";
      this.addheight2 = "height:" + hh2 + "px";
      this.histableHeight = hh3 + "px";
    },
    hiddenDatas() {
      let para = { userid: this.loginid, catagory: 1 };
      isHidden(para, data => {
        this.cellhidden = data.data.obj;
        this.showItems();
      });
    },
    selectChange() {
      this.$forceUpdate();
    },
    // 表格隐藏显示列
    showItems() {
      this.ishidden1 = true;
      this.ishidden2 = true;
      this.ishidden3 = true;
      this.ishidden4 = true;
      this.ishidden5 = true;
      this.ishidden6 = true;
      this.ishidden7 = true;
      for (var i = 0; i < this.cellhidden.length; i++) {
        var val = this.cellhidden[i];
        switch (val) {
          case 1:
            this.ishidden1 = false;
            break;
          case 2:
            this.ishidden2 = false;
            break;
          case 3:
            this.ishidden3 = false;
            break;
          case 4:
            this.ishidden4 = false;
            break;
          case 5:
            this.ishidden5 = false;
            break;
          case 6:
            this.ishidden6 = false;
            break;
          case 7:
            this.ishidden7 = false;
            break;
        }
      }
    },
    // 选择隐藏列后执行
    itemChange() {
      this.$forceUpdate();
      if (this.cellhidden.length == 0) {
        this.colums = "";
      } else {
        if (this.cellhidden.length == 1) {
          this.colums = this.cellhidden[0] + ",";
        } else {
          this.colums = this.cellhidden.join(",");
        }
      }
      let para = { colums: this.colums, userId: this.loginid, catagory: 1 };
      editHidden(para, data => {
        this.hiddenDatas();
        this.showItems();
        this.colums = "";
      });
    },
    // 按钮操作权限
    limitChange() {
      if (this.assignCheckList !== null) {
        for (var i = 0; i < this.assignCheckList.length; i++) {
          let value = this.assignCheckList[i];
          switch (value) {
            case "B-add":
              this.isAddShow = true;
              break;
            case "B-edit":
              this.isEditShow = true;
              break;
            case "B-report":
              this.isReportShow = true;
              break;
            case "B-over":
              this.isOverShow = true;
              break;
            case "B-down":
              this.isDownShow = true;
              break;
          }
        }
      }
    },
    passValue() {
      this.astatus = this.$route.query.astatus;
      if (
        this.astatus == 0 ||
        this.astatus == 3 ||
        this.astatus == 4 ||
        this.astatus == -1
      ) {
        this.astatus = this.$route.query.astatus;
      } else {
        this.astatus = "";
      }
      this.filters.totalstatus = this.astatus;
    },
    //   获取部门列表
    getDeptlist: function() {
      alldeptList("", data => {
        this.deptlist = data.data.obj;
      });
    },
    // 获取用户列表
    getUsers: function() {
      allusers("", data => {
        this.userlist = data.data.obj;
      });
    },
    // 批交办事项列表
    getAssignList: function() {
      this.loading = false;
      let para = this.filters;
      para.userid = this.loginid;
      para.pageNum = this.currentPage;
      para.pageSize = this.pageSize;
      para.totalstatus = this.astatus;
      assignList(para, data => {
        if (data.data.obj == null) {
          // this.loading = false;
        } else {
          this.totals = data.data.obj.total;
          this.assignDatas = data.data.obj.datas;
          let leanames = "";
          if (this.assignDatas == null) {
            this.assignDatas = [];
          }
          for (var j = 0; j < this.assignDatas.length; j++) {
            if (this.assignDatas[j].leaderNameList == null) {
              leanames = "";
            } else {
              leanames = this.assignDatas[j].leaderNameList;
              leanames = leanames.join("，");
            }
            this.assignDatas[j].leaderNameList = leanames;
          }
          this.showItems();
        }
      });
    },
    // 分页
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getAssignList();
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getAssignList();
    },
    // 返回
    handleBack: function() {
      this.isShow = true;
      this.addShow = false;
      this.detailShow = false;
      this.editShow = false;
    },
    // 搜索
    getDatas: function() {
      this.loading = true;
      let para = this.filters;
      para.userid = this.loginid;
      para.pageNum = this.currentPage;
      para.pageSize = this.pageSize;
      assignList(para, data => {
        if (data.data.obj == null) {
          this.loading = false;
          this.totals = 0;
          this.assignDatas = [];
        } else {
          this.totals = data.data.obj.total;
          this.assignDatas = data.data.obj.datas;
          this.showItems();
          let mnames = "";
          let leanames = "";
          for (var j = 0; j < this.assignDatas.length; j++) {
            if (this.assignDatas[j].leaderNames == null) {
              leanames = "";
            } else {
              leanames = this.assignDatas[j].leaderNames;
              leanames = leanames.split("+");
            }
            this.assignDatas[j].leaderNames = leanames;
          }

          for (var i = 0; i < this.assignDatas.length; i++) {
            if (this.assignDatas[i].meetName == null) {
              mnames = "";
            } else {
              mnames = this.assignDatas[i].meetName;
              mnames = mnames.split("+");
            }
            this.assignDatas[i].meetName = mnames;
          }
          for (var n = 0; n < this.assignDatas.length; n++) {
            var arr = String(this.assignDatas[n].agentname);
            if (arr == "null") {
              var aa = arr.replace("null", "");
              this.assignDatas[n].agentname = aa;
            } else {
              var aa = arr.replace(",null", "");
              this.assignDatas[n].agentname = aa;
            }
          }
          this.loading = false;
        }
      });
    },
    // 严重滞后
    handleLag(row, id) {
      if (row.status == 4) {
        this.$message({
          message: "已设置严重滞后"
        });
      } else {
        this.$confirm("确定设置为严重滞后吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let para = { checkid: id };
            threeplanLag(para, data => {
              this.$message({
                type: "success",
                message: "操作成功!"
              });
              this.getAssignList();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消操作"
            });
          });
      }
    },
    // 完结
    overReceipt(row, id) {
      if (row.status == -1) {
        this.$message({
          message: "已完结"
        });
      } else {
        this.$confirm("此操作将完结该事项, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let para = { checkid: id };
            assignOver(para, data => {
              this.$message({
                type: "success",
                message: "完结成功!"
              });
              this.getAssignList();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消完结"
            });
          });
      }
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.filters.status = "";
      let para = {
        userid: this.loginid,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        status: ""
      };
      assignList(para, data => {
        this.totals = data.data.obj.total;
        this.assignDatas = data.data.obj.datas;
        this.showItems();
        let mnames = "";
        let leanames = "";
        for (var j = 0; j < this.assignDatas.length; j++) {
          if (this.assignDatas[j].leaderNames == null) {
            leanames = "";
          } else {
            leanames = this.assignDatas[j].leaderNames;
            leanames = leanames.split("+");
          }
          this.assignDatas[j].leaderNames = leanames;
        }

        for (var i = 0; i < this.assignDatas.length; i++) {
          if (this.assignDatas[i].meetName == null) {
            mnames = "";
          } else {
            mnames = this.assignDatas[i].meetName;
            mnames = mnames.split("+");
          }
          this.assignDatas[i].meetName = mnames;
        }
        for (var n = 0; n < this.assignDatas.length; n++) {
          var arr = String(this.assignDatas[n].agentname);
          if (arr == "null") {
            var aa = arr.replace("null", "");
            this.assignDatas[n].agentname = aa;
          } else {
            var aa = arr.replace(",null", "");
            this.assignDatas[n].agentname = aa;
          }
        }
      });
    },
    // 状态
    statusFormat(scope, value) {
      switch (value) {
        case 0:
          return "正常";
          break;
        case 1:
          return "预警";
          break;
        case 2:
          return "逾期";
          break;
        case 3:
          return "滞后";
          break;
        case 4:
          return "严重滞后";
          break;
        case -1:
          return "完结";
          break;
      }
    },
    // 不同状态标识
    cellClassName({ row, column }) {
      let status = row.status;
      switch (status) {
        case 1:
          return "yellow";
          break;
        case 2:
          return "red";
          break;
        case 3:
          return "zh";
          break;
        case 4:
          return "zhou";
          break;
        case -1:
          return "gray";
          break;
          return "";
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.totalstatus == -1) {
        return "noedit";
      }
    },
    // 个人中心进入详情页
    centerDetail() {
      if (this.$route.query.checkid == undefined) {
        this.checkid = "";
        this.isCenter = 3;
        this.getAssignList();
      } else {
        this.checkid = this.$route.query.checkid;
        this.isCenter = this.$route.query.isCenter;
        this.aid = this.$route.query.checkid;
        let spara = { checkid: this.checkid };
        getStatusForm(spara, data => {});
        let para = { checkId: this.checkid };
        this.isShow = false;
        this.detailShow = true;
        this.fileArr = [];
        this.detailFuc(para);
      }
    },
    // 详情方法
    detailFuc(para) {
      assignDetail(para, data => {
        let receiveMap = {};
        this.assignDetailData = data.data.obj;
        this.basicInfo.code = this.assignDetailData.code;
        this.basicInfo.starttime = new Date(this.assignDetailData.starttime);
        this.basicInfo.tasksource = this.assignDetailData.tasksource;
        this.basicInfo.jobrequire = this.assignDetailData.jobrequire;
        this.basicInfo.status = this.assignDetailData.totalstatus;
        if (data.data.obj.arealeadidList == null) {
          data.data.obj.arealeadidList = [];
        }
        this.basicInfo.arealeadids = data.data.obj.arealeadidList;
        this.basicInfo.leaderids = data.data.obj.leaderidList;
        this.leadsData = this.assignDetailData.leaderList;
        this.dutysData = this.assignDetailData.dutyList;
        if (this.assignDetailData.receiptList == null) {
          this.assignDetailData.receiptList = [];
        }
        this.newReportList = this.assignDetailData.receiptList;
        for (var n = 0; n < this.newReportList.length; n++) {
          this.newReportList[n].newFiles = [];
          var parr = this.newReportList[n].filepath;
          if (parr == "" || parr == null) {
            this.newReportList[n].newFiles = [];
          } else {
            parr = parr.split(",");
            var len = parr.length;
            if (parr[len - 1] == "") {
              parr.splice(len - 1, 1);
            }
            var parr2 = parr;
            for (var i = 0; i < parr2.length; i++) {
              var obj = {};
              obj.url = this.imgIp + parr2[i];
              obj.name = parr2[i];
              this.newReportList[n].newFiles.push(obj);
            }
          }
        }

        var arr = data.data.obj.filepath;
        if (arr == null) {
          this.fileArr = [];
        } else {
          var farr = arr.split(",");
          var len = farr.length;
          if (farr[len - 1] == "") {
            farr.splice(len - 1, 1);
          }
          var arr2 = farr;
          for (var i = 0; i < arr2.length; i++) {
            if (arr2[i] == "undefined") {
              // return false;
            } else {
              var obj = {};
              obj.url = this.imgIp + arr2[i];
              obj.name = arr2[i];
              this.fileArr.push(obj);
            }
          }
        }
        this.checkReceipt = this.assignDetailData.checkReceipt;
        if (this.checkReceipt == null) {
          this.checkReceipt = {};
        }
        if (this.leadsData == null) {
          this.leadsData = [];
        }
        if (this.dutysData == null) {
          this.dutysData = [];
        }
        this.checkMeetList = this.assignDetailData.checkMeetList;
        this.ruleList = this.assignDetailData.checkRuleList;
        this.isShow = false;
        this.detailShow = true;
      });
    },
    // 详情
    handleDetail: function(index, row, id) {
      this.checkid = id;
      let spara = { checkid: id };
      getStatusForm(spara, data => {});
      this.aid = id;
      this.fileArr = [];
      let para = { checkId: id };
      if (row.totalstatus == -1) {
        this.noEdit = false;
      } else {
        this.noEdit = true;
      }
      this.detailFuc(para);
    },
    // 编辑方法
    editFuc(para) {
      assignDetail(para, data => {
        this.detailAssignData = data.data.obj;
        this.basicInfo.code = this.detailAssignData.code;
        this.basicInfo.id = this.detailAssignData.id;
        this.basicInfo.starttime = new Date(this.detailAssignData.starttime);
        this.basicInfo.tasksource = this.detailAssignData.tasksource;
        this.basicInfo.jobrequire = this.detailAssignData.jobrequire;
        if (data.data.obj.arealeadidList == null) {
          data.data.obj.arealeadidList = [];
        }
        // this.basicInfo.leaderids = data.data.obj.leaderidList;
        this.basicInfo.arealeadids = data.data.obj.arealeadidList;
        this.leadsData = this.detailAssignData.leaderList;
        this.dutysData = this.detailAssignData.dutyList;
        if (this.detailAssignData.receiptList == null) {
          this.detailAssignData.receiptList = [];
        }
        this.newReportList = this.detailAssignData.receiptList;
        for (var n = 0; n < this.newReportList.length; n++) {
          this.newReportList[n].newFiles = [];
          var parr = this.newReportList[n].filepath;
          if (parr == "" || parr == null) {
            this.newReportList[n].newFiles = [];
          } else {
            parr = parr.split(",");
            var len = parr.length;
            if (parr[len - 1] == "") {
              parr.splice(len - 1, 1);
            }
            var parr2 = parr;
            for (var i = 0; i < parr2.length; i++) {
              var obj = {};
              obj.url = this.imgIp + parr2[i];
              obj.name = parr2[i];
              this.newReportList[n].newFiles.push(obj);
            }
          }
        }

        var arr = data.data.obj.filepath;
        if (arr == null) {
          this.fileArr = [];
        } else {
          var farr = arr.split(",");
          var len = farr.length;
          if (farr[len - 1] == "") {
            farr.splice(len - 1, 1);
          }
          var arr2 = farr;
          for (var i = 0; i < arr2.length; i++) {
            if (arr2[i] == "undefined") {
            } else {
              var obj = {};
              obj.url = this.imgIp + arr2[i];
              obj.name = arr2[i];
              this.fileArr.push(obj);
            }
          }
        }
        this.checkReceipt = this.assignDetailData.checkReceipt;
        if (this.checkReceipt == null) {
          this.checkReceipt = {};
        }
        if (this.leadsData == null) {
          this.leadsData = [];
        }
        if (this.dutysData == null) {
          this.dutysData = [];
        }
        this.checkMeetList = this.detailAssignData.checkMeetList;
        this.ruleList = this.detailAssignData.checkRuleList;
        this.isShow = false;
        this.editShow = true;
      });
    },
    // 详情进入编辑
    toeditPage() {
      // this.isShow = false;
      this.detailShow = false;
      // this.editShow = true;
      this.fileArr = [];
      let para = { checkId: this.checkid, userId: this.loginid };
      this.ccid = this.checkid;
      this.editFuc(para);
    },
    // 编辑
    handleEdit: function(index, row, id) {
      this.fileArr = [];
      let para = { checkId: id, userId: this.loginid };
      this.ccid = id;
      this.editFuc(para);
    },
    // 新增
    handleAdd: function() {
      this.isShow = false;
      this.addShow = true;
    },
    redetailFuc(id) {
      assignDetail({ checkId: id }, data => {
        this.reportBasic = data.data.obj;
        var names = data.data.obj.arealeadNameList;
        if (names == null) {
          names = [];
        }
        this.reportBasic.leadername = names.join(",");
        var leaderList = data.data.obj.leaderList;
        var nameArr = [];
        if (leaderList == null) {
          nameArr = [];
        } else {
          for (var i = 0; i < leaderList.length; i++) {
            nameArr.push(leaderList[i].deptName);
          }
        }
        this.reportBasic.leaderDeptName = nameArr.join(", ");
      });
    },
    // 进展汇报
    handleReport(index, row, id) {
      this.checkid = id;
      this.filepath = [];
      this.fileList = [];
      this.reportData = {};
      this.isExport.visible = true;
      // 获取上一次进展情况
      showAssignLasttime({ userid: this.loginid, checkid: id }, data => {
        this.laststate = data.data.obj.question;
      });
      // 基本信息
      this.redetailFuc(id);
      // 判断是否重复报送
      let repa = {};
      repa.checkid = id;
      repa.userid = this.loginid;
      repeatAssignReport(repa, data => {
        if (data.data.obj == null) {
          // 是否有保存内容
          let repara = { userid: this.loginid, termid: id, modeltype: 2 };
          reportTerm(repara, data => {
            var reobj = data.data.obj;
            if (reobj == null) {
              this.reportData = { userid: this.loginid };
              this.reportid = -1;
            } else {
              this.isExport.visible = false;
              this.reportid = reobj.id;
              this.reportData = {
                userid: this.loginid,
                question: reobj.question,
                measure: reobj.plan,
                wenti: reobj.problem,
                remark: reobj.remark
              };
              var str = reobj.filepath;
              var obj = {};
              if (str == null || str == "") {
                this.fileList = [];
                this.fileArr = [];
              } else {
                var reg = /,$/gi;
                var arr = [];
                str = str.replace(reg, "");
                arr = str.split(",");
                for (var i = 0; i < arr.length; i++) {
                  obj.name = arr[i];
                  obj.url = this.imgIp + arr[i];
                  this.fileList.push(obj);
                  this.fileArr.push(obj.name);
                }
              }
            }
            this.reportVisible.visible = true;
          });
        } else {
          this.$confirm(
            "<span style='color:#f00;'>已重复报送</span>，确定继续报送吗？",
            "提示",
            {
              dangerouslyUseHTMLString: true,
              type: "warning",
              center: true,
              modal: false,
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          )
            .then(() => {
              this.reportData.userid = this.loginid;
              this.reportVisible.visible = true;
              this.reportData.question = data.data.obj.question;
              this.reportData.measure = data.data.obj.measure;
              this.reportData.wenti = data.data.obj.wenti;
              this.reportData.remark = data.data.obj.remark;
              var str = data.data.obj.filepath;
              var obj = {};
              if (str == null || str == "") {
                this.fileList = [];
                this.filepath = [];
              } else {
                var reg = /,$/gi;
                var arr = [];
                str = str.replace(reg, "");
                arr = str.split(",");
                for (var i = 0; i < arr.length; i++) {
                  obj.name = arr[i];
                  obj.url = this.imgIp + arr[i];
                  this.fileList.push(obj);
                  this.filepath.push(obj.name);
                }
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消报送"
              });
              this.reportVisible.visible = false;
            });
        }
      });
    },

    // 删除数组中某个元素
    removeArr(arr, value) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === value) {
          return i;
        }
      }
      return false;
    },
    // 移除附件
    handleRemove(file, fileList) {
      let name = file.name;
      this.filepath.splice(this.removeArr(this.filepath, name), 1);
    },
    // 上传附件
    handleSuccess(file, fileList) {
      this.filepath.push(file.obj);
    },
    // 保存报送
    saveReport() {
      var child = this.$refs.reportChild;
      child.$refs.reportData.validate(valid => {
        if (valid) {
          let files = "";
          if (this.fileArr.length == 0) {
            files = "";
          } else {
            let len = this.fileArr.length;
            if (len == 1) {
              files += this.fileArr[0] + ",";
            } else {
              files = this.fileArr.join(",");
            }
          }
          let para = this.reportData;
          para.problem = this.reportData.wenti;
          para.plan = this.reportData.measure;
          if (this.reportid == -1) {
          } else {
            para.id = this.reportid;
          }
          para.modeltype = 2;
          para.filepath = "";
          para.termid = this.checkid;
          savereportInfo(para, data => {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.reportVisible = false;
          });
        }
      });
    },
    // 提交进展汇报
    submitReport() {
      var child = this.$refs.reportChild;
      child.$refs.reportData.validate(valid => {
        if (valid) {
          let files = "";
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
          this.reportData.filepath = files;
          let para = this.reportData;
          para.filepath = files;
          para.checkid = this.checkid;
          para.userid = this.loginid;
          para.validate = 0;
          addAssignReport(para, data => {
            this.$alert(
              "<span style='color:#f00;'>报送成功</span>，请等待上级部门审核通过",
              "提示",
              {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "我知道了",
                type: "success",
                center: true,
                modal: false
              }
            );
            this.reportVisible = false;
            this.fileList = [];
            this.getAssignList();
            this.reportData = {};
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.toolbar {
  .el-form--inline {
    .zt {
      .el-form-item__content {
        width: 100px;
      }
    }
    .ld {
      .el-form-item__content {
        width: 150px;
      }
    }
    .lb {
      .el-form-item__content {
        width: 120px;
      }
    }
  }
}
.import-ts {
  color: #333;
  font-size: 14px;
  margin-bottom: 20px;
  span {
    color: #f00;
  }
}
.assignlist {
  .toolbar {
    .ww1 {
      .el-select {
        width: 120px;
        font-size: 16px;
      }
    }
  }
}
.task-dialog {
  .item-select {
    display: block;
  }
  .upbox {
    padding: 0 20px;
    .btn {
      border: 0;
      font-size: 14px;
    }
  }
}
.tableinfo {
  .bh {
    font-size: 13px;
  }
  .flexbox {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .stateSelect {
    width: 50px;
    margin-left: 5px;
    .el-input__inner {
      background-color: transparent;
      padding: 0;
      border: none;
      height: 26px;
      line-height: 28px;
      font-size: 12px;
      color: #666;
    }
    .el-input__suffix {
      display: none;
    }
  }
  .editbtns {
    .stateSelect {
      .input__inner {
        color: #999;
      }
    }
  }
}
</style>
