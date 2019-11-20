<template>
  <div class="project-wrap content-wrap">
    <div v-if="allShow">
      <div class="tabs">
        <a
          class="item"
          :class="activeClass == index ? 'active':''"
          v-for="(item,index) in tabitem"
          :key="index"
          @click="handleClick(index)"
          href="javascript:;"
        >{{item}}</a>
      </div>
      <div class="project">
        <div v-show="isShow">
          <!--工具条-->
          <el-row id="toolbar">
            <el-col :span="24" class="toolbar">
              <el-form :inline="true" :model="filters" ref="filters" size="small">
                <el-form-item label="项目名称：" prop="pname" class="ld">
                  <el-input v-model="filters.pname" placeholder="请输入" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="牵头区领导：" prop="arealeadid" class="ld" v-if="toolShow">
                  <el-select
                    v-model="filters.arealeadid"
                    clearable
                    filterable
                    placeholder="全部"
                    @change="selectChange"
                  >
                    <el-option
                      v-for="item in leaderUsers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="牵头单位：" prop="leaderid" class="ld">
                  <el-select
                    v-model="filters.leaderid"
                    clearable
                    filterable
                    placeholder="全部"
                    @change="selectChange"
                  >
                    <el-option
                      v-for="item in leadunits"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="项目类别：" prop="category" class="ld" v-if="toolShow">
                  <el-select
                    v-model="filters.category"
                    clearable
                    placeholder="全部"
                    @change="selectChange"
                  >
                    <el-option
                      v-for="item in category"
                      :key="item.value"
                      :label="item.cate"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="材料报送：" prop="formstatus" class="ld" v-if="toolShow">
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
                <el-form-item label="总体进度：" prop="status" class="ld" v-if="toolShow">
                  <el-select
                    v-model="filters.status"
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
                <el-form-item class="rebtns">
                  <el-button @click="getDatas('filters')" type="primary">搜 索</el-button>
                  <el-button @click="resetForm('filters')">重 置</el-button>
                  <el-button @click="moreSearch">{{moreText}}</el-button>
                </el-form-item>
                <div class="toolbtns">
                  <div>
                    <el-button type="primary" size="small" @click="handleAdd" v-if="isAddShow">新 增</el-button>
                    <el-button
                      type="primary"
                      size="small"
                      @click="projectDownload"
                      v-if="isDownShow"
                    >报表下载</el-button>
                    <el-button
                      type="primary"
                      size="small"
                      @click="downMoudle"
                      v-if="isDownShow"
                    >下载模板</el-button>
                    <el-button type="primary" size="small" @click="loadData" v-if="isAddShow">导入数据</el-button>
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

          <!-- 项目列表 -->
          <el-row>
            <el-table
              class="tableinfo"
              empty-text="无"
              border
              :data="listData"
              :row-class-name="tableRowClassName"
              highlight-current-row
              style="width: 100%;"
              v-loading="loading"
              element-loading-text="加载中..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.7)"
            >
              <el-table-column label="序号" width="50" :formatter="numberFormatter"></el-table-column>
              <el-table-column prop="projectName" label="项目名称">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" placement="top-start">
                    <div
                      style="max-width:300px;line-height:1.8;"
                      slot="content"
                    >{{scope.row.projectName}}</div>
                    <p
                      @click="handleDetail(scope.$index, scope.row, scope.row.projectId)"
                      class="title title-ellipsis"
                    >{{scope.row.projectName}}</p>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="aimplan" label="目标任务" v-if="ishidden1">
                <template slot-scope="scope">
                  <el-tooltip effect="dark" placement="top-start">
                    <div style="max-width:300px;line-height:2;" slot="content">
                      <p>{{scope.row.aimplan}}</p>
                    </div>
                    <p class="title-ellipsis">{{scope.row.aimplan}}</p>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="项目地址" v-if="ishidden10">
                <template slot-scope="scope">
                  <el-tooltip effect="dark" placement="top-start">
                    <div style="max-width:300px;line-height:2;" slot="content">
                      <p>{{scope.row.address}}</p>
                    </div>
                    <p class="title-ellipsis">{{scope.row.address}}</p>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="progressList" label="进展情况" v-if="ishidden2">
                <template slot-scope="scope">
                  <div>
                    <el-tooltip effect="dark" placement="top-start">
                      <div style="max-width:300px;line-height:2;" slot="content">
                        <p
                          v-for="(item, index) in scope.row.progressList"
                          :key="index"
                        >{{item.question}}</p>
                      </div>
                      <div>
                        <p
                          v-for="(item, index) in scope.row.progressList"
                          :key="index"
                          style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;text-align:left;"
                        >{{item.question}}</p>
                      </div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="progressList" label="存在问题" v-if="ishidden11">
                <template slot-scope="scope">
                  <div>
                    <el-tooltip effect="dark" placement="top-start">
                      <div style="max-width:300px;line-height:2;" slot="content">
                        <p
                          v-for="(item, index) in scope.row.progressList"
                          :key="index"
                        >{{item.wenti}}</p>
                      </div>
                      <div>
                        <p
                          v-for="(item, index) in scope.row.progressList"
                          :key="index"
                          style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;text-align:left;"
                        >{{item.wenti}}</p>
                      </div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="progressList" label="下步工作计划" v-if="ishidden3">
                <template slot-scope="scope">
                  <div>
                    <el-tooltip effect="dark" placement="top-start">
                      <div style="max-width:300px;line-height:2;" slot="content">
                        <p
                          v-for="(item, index) in scope.row.progressList"
                          :key="index"
                        >{{item.measure}}</p>
                      </div>
                      <div>
                        <p
                          v-for="(item, index) in scope.row.progressList"
                          :key="index"
                          style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;text-align:left;"
                        >{{item.measure}}</p>
                      </div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="leaderDept" label="牵头单位" v-if="ishidden4">
                <template slot-scope="scope">
                  <div>
                    <p v-for="(lead, index) in scope.row.leaderDept" :key="index">{{lead.deptName}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="dutyDept" label="责任单位" v-if="ishidden5">
                <template slot-scope="scope">
                  <div>
                    <p v-for="(lead, index) in scope.row.dutyDept" :key="index">{{lead.deptName}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="ownName" label="项目业主" v-if="ishidden6"></el-table-column>
              <el-table-column prop="areaLeader" label="牵头区领导" v-if="ishidden7">
                <template slot-scope="scope">
                  <div>
                    <p v-for="(lead, index) in scope.row.areaLeader" :key="index">{{lead.name}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="streetDept" label="所属街道" v-if="ishidden8">
                <template slot-scope="scope">
                  <div>
                    <p v-for="(lead, index) in scope.row.streetDept" :key="index">{{lead.name}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="category" label="项目类别" v-if="ishidden9">
                <template slot-scope="scope">
                  <span v-html="categoryFormat(scope,scope.row.category)"></span>
                </template>
              </el-table-column>
              <el-table-column prop="formstatus" label="材料报送" fixed="right">
                <template slot-scope="scope">
                  <div>
                    <i class="fa mark" v-if="scope.row.formstatus==1" style="background:#fbe804;"></i>
                    <i class="fa mark" v-else-if="scope.row.formstatus==2" style="background:#f00;"></i>
                    <i
                      class="fa mark"
                      v-else-if="scope.row.formstatus== -1"
                      style="background:#999;"
                    ></i>
                    <i class="fa mark" v-else></i>
                    <span v-html="formstatusFormat(scope,scope.row.formstatus)"></span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="totalstatus" label="总体进度" fixed="right">
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
                      <i
                        class="fa mark"
                        v-if="scope.row.totalstatus==3"
                        style="background:#364e98;"
                      ></i>
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
                    @click="handleDetail(scope.$index, scope.row, scope.row.projectId)"
                  >详情</el-button>
                  <el-button
                    class="btn nobtn"
                    @click="handleEdit(scope.$index, scope.row, scope.row.projectId)"
                    v-if="isEditShow"
                  >编辑</el-button>
                  <el-button
                    class="btn nobtn"
                    @click="handleDelete(scope.$index, scope.row, scope.row.projectId)"
                    v-if="isEditShow"
                  >删除</el-button>
                  <el-button
                    class="btn nobtn"
                    @click="handelReport(scope.$index, scope.row, scope.row.projectId)"
                    v-if="isReportShow"
                  >进展汇报</el-button>
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
        </div>

        <!-- 导入文件 -->
        <div class="import-data-box">
          <import-file
            :importdataVisible.sync="importdataVisible"
            :upbtnDisabled.sync="upbtnDisabled"
            :showYearbox="showYearbox"
            :itemShow="itemShow"
            :importFileList="importProjectList"
            @getAllList-event="getProjectAll"
          ></import-file>
        </div>

        <!-- 新增 -->
        <div class="project-box" v-if="addShow">
          <add-info
            @my-event="handleBack"
            @getAll-event="getProjectAll"
            v-bind:leadunits="leadunits"
            v-bind:users="users"
            v-bind:leaderUsers="leaderUsers"
            v-bind:streetdatas="streetdatas"
            v-bind:types="types"
            v-bind:theight="theight"
          ></add-info>
        </div>
        <!-- 编辑 -->
        <div class="project-box" v-if="editShow">
          <edit-info
            @my-event="handleBack"
            @mykey-event="getProjectAll"
            v-bind:leadunits="leadunits"
            v-bind:users="users"
            v-bind:projectId="projectId"
            v-bind:basicInfo="basicInfo"
            v-bind:leadsData="leadsData"
            v-bind:dutysData="dutysData"
            v-bind:ruleList="ruleList"
            v-bind:leaderUsers="leaderUsers"
            v-bind:streetdatas="streetdatas"
            v-bind:types="types"
            v-bind:theight="theight"
            v-bind:newReportList="newReportList"
            v-bind:lastprogress="lastprogress"
          ></edit-info>
        </div>
        <!-- 详情 -->
        <div class="project-box" v-if="detailShow">
          <detail-info
            @my-event="handleBack"
            @edit-event="toeditPage"
            v-bind:projectId="projectId"
            v-bind:projectDetailData="projectDetailData"
            v-bind:leadsData="leadsData"
            v-bind:dutysData="dutysData"
            v-bind:ruleList="ruleList"
            v-bind:addheight2="addheight2"
            v-bind:isEditShow="isEditShow"
            v-bind:noEdit="noEdit"
            v-bind:historyHeight="historyHeight"
            v-bind:newReportList="newReportList"
            v-bind:lastprogress="lastprogress"
            v-bind:isCenter="isCenter"
          ></detail-info>
        </div>
      </div>
    </div>

    <!-- 进展填报弹窗 -->
    <el-dialog title="新增进展汇报" :visible.sync="reportVisible" width="1200px" class="report-dialog">
      <report-content
        :reportVisible.sync="reportVisible"
        :fileArr.sync="fileArr"
        :reportBasic="reportBasic"
        :reportData.sync="reportData"
        :fileList.sync="fileList"
        :isExport.sync="isExport"
        :workid="projectId"
        :upfile="upfile"
        :laststate="laststate"
        :itemShow="itemShow"
        ref="reportChild"
      ></report-content>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveReport" size="small" type="primary">保 存</el-button>
        <el-button @click="submitReport()" size="small" type="primary">提 交</el-button>
      </div>
    </el-dialog>

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
import {
  projectListAll,
  projectTypeList,
  addProjectType,
  updateStatus,
  addProgress,
  updateLag,
  updateTotalStatus,
  updateFormStatus,
  getStatusForm,
  getdetailProject,
  importProjectData,
  deleteProject,
  lasttimeProgress,
  addShowLasttime,
  getAllProject
} from "../../api/projectApi";
import {
  allusers,
  alldeptList,
  leaderList,
  streetList,
  isHidden,
  editHidden,
  reportTerm,
  savereportInfo,
  projectImportFileData
} from "../../api/api";
import { getWarnDetail, repeatReport } from "../../api/center";
import { checkFileTypeData } from "../../api/upfileApi";

import addInfo from "./addProject"; //新增项目
import detailInfo from "./projectDetail"; //项目详情
import editInfo from "./projectEdit"; //项目编辑
import batchRule from "../batchrule"; //报送规则
import reportContent from "../report"; //进展汇报
import importFile from "../importItem"; //导入文件
export default {
  name: "project",
  components: {
    addInfo,
    detailInfo,
    editInfo,
    batchRule,
    reportContent,
    importFile
  },
  data() {
    return {
      upbtnDisabled: false,
      showYearbox: false,
      isExport: true,
      itemShow: 1,
      reportid: -1,
      reportBasic: {},
      isCenter: 3,
      allitems: [], //所有项目数据
      laststate: "",
      lastprogress: [],
      isss: true,
      toolShow: false,
      activeClass: 0,
      tabitem: ["全部项目", "重点项目", "一般项目"],
      listData: [],
      datas: [],
      spanArr: [],
      spanIndex: 0,
      loginname: JSON.parse(this.$store.getters.userdata).logname,
      loginid: JSON.parse(this.$store.getters.userdata).id,
      login: JSON.parse(this.$store.getters.userdata),
      projectCheckList: JSON.parse(this.$store.getters.userdata)
        .projectCheckList,
      isAddShow: false,
      isEditShow: false,
      isReportShow: false,
      isOverShow: false,
      isDownShow: false,
      currentPage: 1,
      pageSize: 10,
      totals: 0,
      activeName: "first",
      reportVisible: false,
      loading: true,
      filters: {},
      leadunits: [],
      users: [],
      leaderUsers: [],
      streetdatas: [],
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
      selfCommit: [
        { value: 0, name: "正常" },
        { value: 1, name: "滞后" },
        { value: 2, name: "严重滞后" }
      ],
      wayslist: [
        { value: 0, name: "自动预警" },
        { value: 1, name: "手动预警" },
        { value: -1, name: "完结" }
      ],
      types: [],
      category: [
        { value: 0, cate: "一般项目" },
        { value: 1, cate: "重点项目" }
      ],
      addShow: false,
      isShow: true,
      detailShow: false,
      editShow: false,
      reportData: {},
      fileList: [],
      projectId: "-1",
      projectDetailData: {}, //项目详情数据
      leadsData: [],
      dutysData: [],
      ruleList: [], //报送规则列表
      aims: [],
      filepath: [],
      // 编辑
      basicInfo: {},
      pstatus: "",
      pcategory: 1,
      upfile: "",
      imgIp: "",
      cellhidden: [], //隐藏列
      showitemlist: [
        {
          name: "目标任务",
          value: 1
        },
        {
          name: "进展情况",
          value: 2
        },
        {
          name: "下步工作计划",
          value: 3
        },
        {
          name: "牵头单位",
          value: 4
        },
        {
          name: "责任单位",
          value: 5
        },
        {
          name: "项目业主",
          value: 6
        },
        {
          name: "牵头区领导",
          value: 7
        },
        {
          name: "所属街道",
          value: 8
        },
        {
          name: "项目类别",
          value: 9
        },
        {
          name: "项目地址",
          value: 10
        },
        {
          name: "存在问题",
          value: 11
        }
      ],
      tableHeight: "500px", //设置表格高度
      historyHeight: "500px",
      ishidden1: true,
      ishidden2: true,
      ishidden3: true,
      ishidden4: true,
      ishidden5: true,
      ishidden6: true,
      ishidden7: true,
      ishidden8: true,
      ishidden9: true,
      ishidden10: true,
      ishidden11: true,
      addheight: "height:500px",
      addheight2: "height:500px",
      theight: "400px",
      batchHeight: "",
      colums: "",
      moreText: "更多搜索条件",
      isOpen: 0,
      noEdit: true,
      fileArr: [], //附件list
      defaturl: "",
      importdataVisible: false, //导入数据弹窗
      pdatalist: [], //导入数据文件filelist
      importProjectList: "",
      filedatas: [],
      newReportList: [], //详情进展情况最新
      newFiles: [], //进展汇报最新一条附件列表
      rowinfo: {},
      batchVisible: false,
      allShow: true
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
    this.isshowCheck();
    this.passValue();
    this.getProjectAll();
    this.getDeptlist();
    this.getUsers();
    this.getTypes();
    this.getLeaderList();
    this.getStreetList();
    this.centerDetail();
  },
  methods: {
    // 报表下载
    projectDownload() {
      window.open(this.defaturl + "/report/createProjectReport");
    },
    // 获取所有项目数据
    getAllDatas() {
      getAllProject("", data => {
        if (data.data.obj == null) {
          this.allitems = [];
        } else {
          this.allitems = data.data.obj;
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
      this.getProjectAll();
    },

    // 导入数据
    loadData() {
      this.importdataVisible = true;
      this.showYearbox = false;
      this.upbtnDisabled = false;
    },
    // 下载模板
    downMoudle() {
      window.open(this.defaturl + "/templateDownload/projectTemplateDown");
    },
    // 序号
    numberFormatter(row, column, cellValue, index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize;
    },
    // 手动修改状态 - 总体进度
    totalstateChange(scope, row) {
      let para = { totalstatus: row.totalstatus, projectid: row.projectId };
      updateTotalStatus(para, data => {
        // scope._self.$refs[`popover-${scope.row.projectId}`].doClose();
        this.getProjectAll();
        this.$message({
          type: "success",
          message: "修改状态成功!"
        });
      });
    },
    // 手动修改状态 - 报送进度
    formstateChange(scope, row) {
      let para = { formstatus: row.formstatus, projectid: row.projectId };
      updateFormStatus(para, data => {
        // scope._self.$refs[`popover-${scope.$index}`].doClose();
        this.getProjectAll();
        this.$message({
          type: "success",
          message: "修改状态成功!"
        });
      });
    },
    // 获取浏览器高度，计算table高度
    browerHeight() {
      var bheight = document.body.clientHeight;
      var hh = bheight - 380;
      var hh0 = bheight - 290;
      var hh2 = bheight - 280;
      var hh3 = bheight - 360;
      var rh = bheight - 250;
      this.tableHeight = hh + "px";
      this.historyHeight = hh0 + "px";
      this.batchHeight = rh + "px";
      this.addheight = "height:" + hh + "px";
      this.addheight2 = "height:" + hh2 + "px";
      this.theight = "height:" + hh3 + "px";
    },
    hiddenDatas() {
      let para = { userid: this.loginid, catagory: 0 };
      isHidden(para, data => {
        this.cellhidden = data.data.obj;
        this.showItems();
      });
    },
    // 展开更多搜索条件
    moreSearch() {
      if (this.isOpen == 0) {
        this.isOpen = 1;
        this.toolShow = true;
        this.moreText = "收回";
      } else {
        this.isOpen = 0;
        this.toolShow = false;
        this.moreText = "更多搜索条件";
      }
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
      this.ishidden8 = true;
      this.ishidden9 = true;
      this.ishidden10 = true;
      this.ishidden11 = true;
      // if()
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
          case 8:
            this.ishidden8 = false;
            break;
          case 9:
            this.ishidden9 = false;
            break;
          case 10:
            this.ishidden10 = false;
            break;
          case 11:
            this.ishidden11 = false;
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
      let para = { colums: this.colums, userId: this.loginid, catagory: 0 };
      editHidden(para, data => {
        this.hiddenDatas();
        this.showItems();
        this.colums = "";
      });
    },
    // 按钮操作权限
    isshowCheck() {
      if (this.projectCheckList !== null) {
        for (var i = 0; i < this.projectCheckList.length; i++) {
          let value = this.projectCheckList[i];
          switch (value) {
            case "A-add":
              this.isAddShow = true;
              break;
            case "A-edit":
              this.isEditShow = true;
              break;
            case "A-report":
              this.isReportShow = true;
              break;
            case "A-over":
              this.isOverShow = true;
              break;
            case "A-down":
              this.isDownShow = true;
              break;
          }
        }
      }
    },
    selectChange() {
      this.$forceUpdate();
    },
    // 首页点击饼图后进入页面
    passValue() {
      if (this.$route.query.pstatus == undefined) {
        this.pstatus = "";
        this.getProjectAll();
      } else {
        this.pstatus = this.$route.query.pstatus;
      }
      this.filters.status = this.pstatus;
    },
    // 个人中心点击详情进入详情页
    centerDetail() {
      if (this.$route.query.projectId == undefined) {
        this.projectId = "";
        this.isCenter = 3;
        this.getProjectAll();
      } else {
        this.isShow = false;
        this.isCenter = this.$route.query.isCenter;
        let spara = { projectid: this.projectId };
        getStatusForm(spara, data => {});
        this.projectId = this.$route.query.projectId;
        let para = { type: 1, detailId: this.projectId, userid: this.loginid };
        getWarnDetail(para, data => {
          this.projectDetailData = data.data.obj;
          this.projectDetailData.streets = this.projectDetailData.streetDeptName;
          this.leadsData = this.projectDetailData.leaderDeptList;
          this.dutysData = this.projectDetailData.dutyDeptList;
          this.ruleList = this.projectDetailData.ruleList;
          if (this.projectDetailData.progressList == null) {
            this.projectDetailData.progressList = [];
          }
          this.newReportList = this.projectDetailData.progressList;
          for (var n = 0; n < this.newReportList.length; n++) {
            this.newReportList[n].newFiles = [];
            var arr = this.newReportList[n].filepath;
            if (arr == "" || arr == null) {
              this.newReportList[n].newFiles = [];
            } else {
              arr = arr.split(",");
              var len = arr.length;
              if (arr[len - 1] == "") {
                arr.splice(len - 1, 1);
              }
              var arr2 = arr;
              for (var i = 0; i < arr2.length; i++) {
                var obj = {};
                obj.url = this.imgIp + arr2[i];
                obj.name = arr2[i];
                this.newReportList[n].newFiles.push(obj);
              }
            }
          }

          if (this.projectDetailData.category == 0) {
            this.projectDetailData.category = "一般项目";
          } else {
            this.projectDetailData.category = "重点项目";
          }
          if (this.projectDetailData.totalstatus == -1) {
            this.noEdit = false;
          } else {
            this.noEdit = true;
          }
          this.detailShow = true;
          lasttimeProgress({ projectid: this.projectId }, data => {
            this.lastprogress = data.data.obj;
          });
        });
      }
    },
    // 项目列表all
    getProjectAll: function() {
      this.loading = true;
      let para = this.filters;
      para.userid = this.loginid;
      para.pageSize = this.pageSize;
      para.pageNum = this.currentPage;
      para.status = this.pstatus;
      projectListAll(para, data => {
        if (data.data.obj == null) {
          this.totals = 0;
          this.listData = [];
          this.loading = false;
        } else {
          this.listData = data.data.obj.datas;
          this.totals = data.data.obj.total;
          this.loading = false;
        }
        this.showItems();
      });
    },
    // 分页
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getProjectAll();
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getProjectAll();
    },
    handleClick(index) {
      this.activeClass = index;
      this.$refs["filters"].resetFields();
      if (this.activeClass == 1) {
        //重点项目
        this.filters.category = 1;
        let para = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          category: 1,
          userid: this.loginid
        };
        projectListAll(para, data => {
          if (data.data.obj == null) {
            this.listData = [];
            this.totals = 0;
          } else {
            this.listData = data.data.obj.datas;
            this.totals = data.data.obj.total;
          }
        });
      } else if (this.activeClass == 2) {
        //一般项目
        this.filters.category = 0;
        let para = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          category: 0,
          userid: this.loginid
        };
        projectListAll(para, data => {
          if (data.data.obj == null) {
            this.listData = [];
            this.totals = 0;
          } else {
            this.listData = data.data.obj.datas;
            this.totals = data.data.obj.total;
          }
        });
      } else {
        //全部项目
        this.filters.category = "";
        let para = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          userid: this.loginid
        };
        projectListAll(para, data => {
          if (data.data.obj == null) {
            this.listData = [];
            this.totals = 0;
          } else {
            this.listData = data.data.obj.datas;
            this.totals = data.data.obj.total;
          }
        });
      }
    },

    //   获取部门列表
    getDeptlist: function() {
      alldeptList("", data => {
        this.leadunits = data.data.obj;
      });
    },
    // 获取用户列表
    getUsers: function() {
      allusers("", data => {
        this.users = data.data.obj;
      });
    },
    // 获取领导列表
    getLeaderList: function() {
      leaderList("", data => {
        this.leaderUsers = data.data.obj;
      });
    },
    // 获取街道
    getStreetList: function() {
      streetList("", data => {
        this.streetdatas = data.data.obj;
      });
    },
    // 获取项目类型列表
    getTypes: function() {
      projectTypeList("", data => {
        this.types = data.data.obj;
      });
    },

    // 搜索
    getDatas: function() {
      let para = this.filters;
      para.userid = this.loginid;
      para.pageSize = this.pageSize;
      para.pageNum = this.currentPage;
      projectListAll(para, data => {
        if (data.data.obj == null) {
          this.listData = [];
          this.totals = 0;
        } else {
          this.listData = data.data.obj.datas;
          this.totals = data.data.obj.total;
          this.showItems();
        }
      });
    },
    // 重置
    resetForm(formName) {
      if (this.activeClass == 1) {
        let para = {
          userid: this.loginid,
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          status: "",
          category: 1
        };
        projectListAll(para, data => {
          this.listData = data.data.obj.datas;
          this.totals = data.data.obj.total;
          this.$refs[formName].resetFields();
          this.filters.category = 1;
          this.filters.status = "";
          this.showItems();
        });
      } else if (this.activeClass == 2) {
        let para = {
          userid: this.loginid,
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          status: "",
          category: 0
        };
        projectListAll(para, data => {
          this.listData = data.data.obj.datas;
          this.totals = data.data.obj.total;
          this.$refs[formName].resetFields();
          this.filters.category = 0;
          this.filters.status = "";
          this.showItems();
        });
      } else {
        let para = {
          userid: this.loginid,
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          status: "",
          category: ""
        };
        projectListAll(para, data => {
          this.listData = data.data.obj.datas;
          this.totals = data.data.obj.total;
          this.$refs[formName].resetFields();
          this.filters.category = "";
          this.filters.status = "";
          this.showItems();
        });
      }
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
    // 不同状态标识
    cellClassName({ row, column, rowIndex }) {
      let status = row.totalstatus;
      let status2 = row.formstatus;
      switch (status) {
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
    // 项目类型
    categoryFormat(scope, value) {
      if (value == 0) {
        return "一般项目";
      } else {
        return "重点项目";
      }
    },
    // 详情
    handleDetail: function(index, row, id) {
      this.isShow = false;
      this.detailShow = true;
      this.projectId = id;
      let spara = { projectid: id };
      getStatusForm(spara, data => {});
      let para = { projectid: id };
      if (row.totalstatus == -1) {
        this.noEdit = false;
      } else {
        this.noEdit = true;
      }
      getdetailProject(para, data => {
        this.projectDetailData = data.data.obj;
        this.projectDetailData.streets = this.projectDetailData.streetDeptName;
        if (this.projectDetailData.progressList == null) {
          this.projectDetailData.progressList = [];
        }
        this.newReportList = this.projectDetailData.progressList;

        for (var n = 0; n < this.newReportList.length; n++) {
          this.newReportList[n].newFiles = [];
          var arr = this.newReportList[n].filepath;
          if (arr == "" || arr == null) {
            this.newReportList[n].newFiles = [];
          } else {
            arr = arr.split(",");
            var len = arr.length;
            if (arr[len - 1] == "") {
              arr.splice(len - 1, 1);
            }
            var arr2 = arr;
            for (var i = 0; i < arr2.length; i++) {
              var obj = {};
              obj.url = this.imgIp + arr2[i];
              obj.name = arr2[i];
              this.newReportList[n].newFiles.push(obj);
            }
          }
        }
        this.leadsData = this.projectDetailData.leaderDeptList;
        this.dutysData = this.projectDetailData.dutyDeptList;
        this.ruleList = this.projectDetailData.ruleList;
        if (this.projectDetailData.category == 0) {
          this.projectDetailData.category = "一般项目";
        } else {
          this.projectDetailData.category = "重点项目";
        }
        // 上一次进展情况
        lasttimeProgress({ projectid: this.projectId }, data => {
          this.lastprogress = data.data.obj;
        });
      });
    },
    // 严重滞后
    handleLag(row, id) {
      if (row.status == 4) {
        this.$message({
          message: "已设置严重滞后"
        });
      } else {
        this.$confirm("确定将此项目标设置为严重滞后吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let para = { projectid: id };
            updateLag(para, data => {
              this.$message({
                type: "success",
                message: "操作成功!"
              });
              this.getProjectAll();
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
    updateEnd(row, id) {
      if (row.status == -1) {
        this.$message({
          message: "已完结"
        });
      } else {
        this.$confirm("此操作将完结该项目, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let para = { projectid: id };
            updateStatus(para, data => {
              this.$message({
                type: "success",
                message: "完结成功!"
              });
              this.getProjectAll();
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
    tableRowClassName({ row, rowIndex }) {
      if (row.totalstatus == -1) {
        return "noedit";
      }
      // else if (row.totalstatus == 4) {
      //   return "lagbtn";
      // }
    },
    // 编辑方法
    editFuc(para) {
      getdetailProject(para, data => {
        this.basicInfo.remark = data.data.obj.remark;
        this.basicInfo.address = data.data.obj.address;
        this.basicInfo.name = data.data.obj.projectName;
        this.basicInfo.owndeptid = this.rowinfo.ownid;
        this.basicInfo.category = String(data.data.obj.category);
        this.basicInfo.address = data.data.obj.address;
        this.basicInfo.mapitude = data.data.obj.mapitude;
        this.basicInfo.submitres = data.data.obj.submitres;
        this.basicInfo.remark = data.data.obj.remark;
        let leaderarr = [];
        if (this.rowinfo.areaLeader == null) {
          leaderarr = [];
        } else {
          for (var j = 0; j < this.rowinfo.areaLeader.length; j++) {
            leaderarr.push(this.rowinfo.areaLeader[j].id);
          }
        }
        let arr = [];
        if (this.rowinfo.streetDept == null) {
          arr = [];
        } else {
          for (var i = 0; i < this.rowinfo.streetDept.length; i++) {
            arr.push(this.rowinfo.streetDept[i].id);
          }
        }
        this.basicInfo.arealeadids = leaderarr; //牵头区领导
        this.basicInfo.streetids = arr; //街道
        this.leadsData = data.data.obj.leaderDeptList;
        this.dutysData = data.data.obj.dutyDeptList;
        this.ruleList = data.data.obj.ruleList;
        // 报送内容
        if (data.data.obj.progressList == null) {
          data.data.obj.progressList = [];
        }
        this.newReportList = data.data.obj.progressList;
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
        if (this.leadsData == null) {
          this.leadsData = [];
        }
        if (this.dutysData == null) {
          this.dutysData = [];
        }
        if (this.ruleList == null) {
          this.ruleList = [];
        }
        // 上一次进展情况
        lasttimeProgress({ projectid: this.projectId }, data => {
          this.lastprogress = data.data.obj;
        });
      });
    },
    // 删除
    handleDelete(index, row, id) {
      this.$confirm(
        '<span style="color:#f00;">该操作将删除此条项目信息</span>，确定删除吗?',
        "提示",
        { type: "warning", dangerouslyUseHTMLString: true }
      )
        .then(() => {
          let para = { projectid: id };
          deleteProject(para, data => {
            if (data.data.code == 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getProjectAll();
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
    // 编辑
    handleEdit: function(index, row, id) {
      this.getTypes();
      this.isShow = false;
      this.editShow = true;
      this.projectId = id;
      for (var i = 0; i < this.listData.length; i++) {
        if (this.projectId == this.listData[i].projectId) {
          this.rowinfo = this.listData[i];
          break;
        }
      }
      let para = { projectid: id };
      this.editFuc(para);
    },
    // 详情页进编辑
    toeditPage() {
      this.isShow = false;
      this.detailShow = false;
      this.editShow = true;
      this.getTypes();
      for (var i = 0; i < this.listData.length; i++) {
        if (this.projectId == this.listData[i].projectId) {
          this.rowinfo = this.listData[i];
          break;
        }
      }
      let para = { projectid: this.projectId };
      this.editFuc(para);
    },
    // 返回
    handleBack: function() {
      this.isShow = true;
      this.addShow = false;
      this.detailShow = false;
      this.editShow = false;
    },
    // 新增组件
    handleAdd: function() {
      this.getTypes();
      this.isShow = false;
      this.addShow = true;
    },
    // 详情方法
    detailFuc(id) {
      getdetailProject({ projectid: id }, data => {
        this.reportBasic = data.data.obj;
        this.reportBasic.streets = this.reportBasic.streetDeptName;
        if (this.reportBasic.category == 0) {
          this.reportBasic.category = "一般项目";
        } else {
          this.reportBasic.category = "重点项目";
        }
        var nameArr = [];
        if (data.data.obj.leaderDeptList == null) {
          nameArr = [];
        } else {
          var arr = data.data.obj.leaderDeptList;
          for (var i = 0; i < arr.length; i++) {
            nameArr.push(arr[i].deptName);
          }
        }
        this.reportBasic.leaderDeptName = nameArr.join(", ");
      });
    },
    // 新增进展汇报
    handelReport(index, row, id) {
      this.projectId = id;
      this.filepath = [];
      this.fileList = [];
      this.fileArr = [];
      this.isExport = true;
      // 获取上一次进展情况
      addShowLasttime({ userid: this.loginid, projectid: id }, data => {
        this.laststate = data.data.obj.question;
      });
      // 项目基本信息
      this.detailFuc(id);
      // 判断是否重复报送
      let repa = {};
      repa.projectid = id;
      repa.userid = this.loginid;
      repeatReport(repa, data => {
        if (data.data.obj == null) {
          // 是否有保存内容
          let repara = { userid: this.loginid, termid: id, modeltype: 1 };
          reportTerm(repara, data => {
            var reobj = data.data.obj;
            if (reobj == null) {
              this.reportData = { userid: this.loginid };
              this.reportid = -1;
            } else {
              this.isExport = false;
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
            this.reportVisible = true;
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
              this.reportVisible = true;
              this.reportData.question = data.data.obj.question;
              this.reportData.measure = data.data.obj.measure;
              this.reportData.wenti = data.data.obj.wenti;
              this.reportData.remark = data.data.obj.remark;
              var str = data.data.obj.filepath;
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
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消报送"
              });
              this.reportVisible = false;
            });
        }
      });
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
          if (this.reportid == -1) {
          } else {
            para.id = this.reportid;
          }
          para.modeltype = 1;
          para.filepath = "";
          para.termid = this.projectId;
          para.problem = this.reportData.wenti;
          para.plan = this.reportData.measure;
          savereportInfo(para, data => {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.isExport = false;
            // this.reportVisible = false;
          });
        }
      });
    },
    // 新增新增进展汇报提交
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
          var para = this.reportData;
          para.filepath = files;
          para.validate = 0;
          para.projectid = this.projectId;
          addProgress(para, data => {
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
            this.getProjectAll();
          });
        } else {
          return;
        }
      });
    },

    // 添加附件 移除
    handleRemove(file, fileList) {
      var name = file.name;
      this.fileArr.splice(this.removeArr(this.fileArr, name), 1);
    },
    // 添加附件 移除前提示
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 添加附件 状态改变时
    handleSuccess(file, fileList) {
      let name = file.obj;
      this.fileArr.push(name);
    }
  }
};
</script>

<style lang="scss">
.project .toolbar .el-input__inner {
  width: 100% !important;
}

.project {
  .project-box {
    position: relative;
    top: -40px;
    background: #fff;
  }
  .toolbar {
    .el-form--inline .ld {
      .el-form-item__content {
        width: 100px !important;
        .el-input__inner {
          width: 100px !important;
        }
      }
    }
    .el-form--inline .zt {
      .el-form-item__content {
        width: 80px !important;
        .el-input__inner {
          width: 80px !important;
        }
      }
    }
  }
  .el-tabs__header {
    z-index: 0;
  }
  .el-tabs__content {
    position: relative;
    background: #fff;
    overflow: visible;
  }
}
.project-wrap {
  .tabs {
    border-bottom: 1px solid #ddd;
    .item {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      border-bottom: 2px solid transparent;
      margin-right: 40px;
    }
    .active {
      border-bottom: 2px solid #1890ff;
      color: #1890ff;
    }
  }
}

.tableinfo {
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
}

.importbox {
  .el-upload-list__item.is-success .el-upload-list__item-status-label {
    display: none;
  }
  .el-upload-list__item .el-icon-close {
    display: block;
  }
  .el-upload-list__item {
    background-color: #f5f7fa;
  }
}
</style>

