<template>
  <div class="content-wrap decision threeyear">
    <div v-if="allShow">
      <p class="navtitle">
        <span>三年行动计划</span>
      </p>
      <div v-show="isShow">
        <!--工具条-->
        <el-row>
          <el-col :span="24" class="toolbar toolbar2">
            <el-form :inline="true" :model="filters" ref="filters" size="small">
              <el-form-item label="年度：" prop="yearid" class="zt">
                <el-select v-model="filters.yearid" clearable placeholder="全部">
                  <el-option
                    v-for="item in years"
                    :key="item.id"
                    :label="item.year"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="牵头区领导："
                prop="arealeaderid"
                filterable
                class="ld"
                @change="selectChange"
              >
                <el-select v-model="filters.arealeaderid" clearable placeholder="全部">
                  <el-option
                    v-for="item in leaderlist"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="牵头单位：" prop="leaderid" class="ld">
                <el-select
                  v-model="filters.leaderid"
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
              <el-form-item label="督查单位：" prop="supDept" class="ld" v-if="toolShow">
                <el-select
                  v-model="filters.supDept"
                  filterable
                  clearable
                  placeholder="全部"
                  @change="selectChange"
                  @focus="getSeerList"
                >
                  <el-option
                    v-for="item in seerlist"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="材料报送：" prop="formstatus" class="zt" v-if="toolShow">
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
              <el-form-item label="总体状态：" prop="totalstatus" class="zt" v-if="toolShow">
                <el-select
                  v-model="filters.totalstatus"
                  clearable
                  placeholder="全部"
                  @change="selectChange"
                >
                  <el-option
                    v-for="item in statuss"
                    :key="item.value"
                    :label="item.status"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
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
                    @click="planDownload"
                    v-if="isDownShow"
                  >报表下载</el-button>
                  <!-- <el-button type="primary" size="small" @click="downMoudle" v-if="isDownShow">下载模板</el-button> -->
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
        <el-table
          class="tableinfo"
          empty-text="无"
          :data="tableData"
          :span-method="typeSpanMethod"
          border
          :height="tableHeight"
          style="width: 100%;"
          :cell-class-name="cellClassName"
          :row-class-name="tableRowClassName"
          :header-cell-style="discountHeaderStyle"
          v-loading="loading"
          element-loading-text="加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.7)"
        >
          <el-table-column label="总体部署安排">
            <el-table-column prop="bigname" label="hide">
              <template slot-scope="scope">
                <p>{{scope.row.bigname}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="minname" label="hide">
              <template slot-scope="scope">
                <p>{{scope.row.minname}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="partname" label="hide">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div
                    style="max-width:300px;line-height:1.8;"
                    slot="content"
                  >{{scope.row.partname}}</div>
                  <p class="title-ellipsis">{{scope.row.partname}}</p>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="workname" label="工作计划" v-if="ishidden8">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div style="max-width:300px;line-height:1.8;" slot="content">{{scope.row.workname}}</div>
                <p class="title-ellipsis">{{scope.row.workname}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="nodeplan" label="节点安排" v-if="ishidden5">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div style="max-width:300px;line-height:1.8;" slot="content">{{scope.row.nodeplan}}</div>
                <p class="title-ellipsis">{{scope.row.nodeplan}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="superdept" label="督查单位" v-if="ishidden9"></el-table-column>
          <el-table-column prop="areaLeaderNames" label="牵头区领导" v-if="ishidden1">
            <template slot-scope="scope">
              <p v-html="namesChange(scope,scope.row.areaLeaderNames)">{{scope.row.nodeplan}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="leaderDeptList" label="牵头单位" v-if="ishidden2">
            <template slot-scope="scope">
              <p v-for="(item, index) in scope.row.leaderDeptList" :key="index">{{item.deptName}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="dutyList" label="责任单位" v-if="ishidden3">
            <template slot-scope="scope">
              <p v-for="(item, index) in scope.row.dutyList" :key="index">{{item.deptName}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="reportList" label="进展情况" v-if="ishidden4">
            <template slot-scope="scope">
              <div>
                <el-tooltip effect="dark" placement="top-start">
                  <div style="max-width:300px;line-height:2;" slot="content">
                    <p v-for="(item, index) in scope.row.reportList" :key="index">{{item.question}}</p>
                  </div>
                  <div>
                    <p
                      v-for="(item, index) in scope.row.reportList"
                      :key="index"
                      style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;text-align:left;"
                    >{{item.question}}</p>
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="reportList" label="存在问题" v-if="ishidden6">
            <template slot-scope="scope">
              <div>
                <el-tooltip effect="dark" placement="top-start">
                  <div style="max-width:300px;line-height:2;" slot="content">
                    <p v-for="(item, index) in scope.row.reportList" :key="index">{{item.wenti}}</p>
                  </div>
                  <div>
                    <p
                      v-for="(item, index) in scope.row.reportList"
                      :key="index"
                      style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;text-align:left;"
                    >{{item.wenti}}</p>
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="reportList" label="解决措施" v-if="ishidden7">
            <template slot-scope="scope">
              <div>
                <el-tooltip effect="dark" placement="top-start">
                  <div style="max-width:300px;line-height:2;" slot="content">
                    <p v-for="(item, index) in scope.row.reportList" :key="index">{{item.measure}}</p>
                  </div>
                  <div>
                    <p
                      v-for="(item, index) in scope.row.reportList"
                      :key="index"
                      style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;text-align:left;"
                    >{{item.measure}}</p>
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="formstatus" label="材料报送" width="100px">
            <template slot-scope="scope">
              <!-- <div class="flexbox" v-if="isEditShow">
              <i class="fa mark" v-if="scope.row.formstatus==1" style="background:#fbe804;"></i>
              <i class="fa mark" v-else-if="scope.row.formstatus==2" style="background:#f00;"></i>
              <i class="fa mark" v-else-if="scope.row.formstatus== -1" style="background:#999;"></i>
              <i class="fa mark" v-else></i>
              <el-select
                v-model="scope.row.formstatus"
                @change="formstateChange(scope, scope.row)"
                class="stateSelect"
              >
                <el-option
                  v-for="item in formStatus"
                  :key="item.value"
                  :label="item.status"
                  :value="item.value"
                ></el-option>
              </el-select>
              </div>-->
              <div>
                <!-- <el-tag size="medium"> -->
                <i class="fa mark" v-if="scope.row.formstatus==1" style="background:#fbe804;"></i>
                <i class="fa mark" v-else-if="scope.row.formstatus==2" style="background:#f00;"></i>
                <i class="fa mark" v-else-if="scope.row.formstatus== -1" style="background:#999;"></i>
                <i class="fa mark" v-else></i>
                <span v-html="formstatusFormat(scope,scope.row.formstatus)"></span>
                <!-- </el-tag> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalstatus" label="总体进度" width="120px">
            <template slot-scope="scope">
              <div class="flexbox" v-if="isEditShow">
                <i class="fa mark" v-if="scope.row.totalstatus==3" style="background:#364e98;"></i>
                <i class="fa mark" v-else-if="scope.row.totalstatus==4" style="background:#7c1d77;"></i>
                <i class="fa mark" v-else-if="scope.row.totalstatus== -1" style="background:#999;"></i>
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
              </div>
              <div v-else>
                <i class="fa mark" v-if="scope.row.totalstatus==3" style="background:#364e98;"></i>
                <i class="fa mark" v-else-if="scope.row.totalstatus==4" style="background:#7c1d77;"></i>
                <i class="fa mark" v-else-if="scope.row.totalstatus== -1" style="background:#999;"></i>
                <i class="fa mark" v-else></i>
                <span v-html="totalstatusFormat(scope,scope.row.totalstatus)"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="edit" label="操作" fixed="right">
            <template scope="scope">
              <el-button
                class="btn"
                @click="handleDetail(scope.$index, scope.row, scope.row.workId)"
              >详情</el-button>
              <el-button
                class="btn"
                @click="handleEdit(scope.$index, scope.row, scope.row.workId)"
                v-if="isEditShow"
              >编辑</el-button>
              <el-button
                class="btn"
                @click="handleDelete(scope.$index, scope.row, scope.row.workId)"
                v-if="isEditShow"
              >删除</el-button>
              <el-button
                class="btn"
                @click="handleEvolve(scope.$index, scope.row)"
                v-if="isReportShow"
              >进展填报</el-button>
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
      </div>
    </div>

    <!-- 导入文件 -->
    <div class="import-data-box">
      <import-file
        :importdataVisible.sync="importdataVisible"
        :showYearbox="showYearbox"
        :itemShow="itemShow"
        :upbtnDisabled.sync="upbtnDisabled"
        :importFileList="importThreePlanList"
        @getAllList-event="getThreePlan"
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
      <add-plan
        @my-event="handleBack"
        @add-event="getThreePlan"
        v-bind:deptlist="deptlist"
        v-bind:leaderlist="leaderlist"
        v-bind:addheight="addheight"
        v-bind:typemodel="typemodel"
        :yearid="yearid"
      ></add-plan>
    </div>
    <!-- 编辑 -->
    <div class="project-box" v-if="editShow">
      <edit-plan
        @my-event="handleBack"
        @add-event="getThreePlan"
        v-bind:deptlist="deptlist"
        v-bind:basicInfo="basicInfo"
        v-bind:addheight="addheight"
        v-bind:leadsData="leadsData"
        v-bind:dutysData="dutysData"
        v-bind:ruleList="ruleList"
        v-bind:nodeList="nodeList"
        v-bind:biglist="biglist"
        v-bind:minlist="minlist"
        v-bind:threeitemList="threeitemList"
        v-bind:upfile="upfile"
        v-bind:imgIp="imgIp"
        v-bind:workid="workid"
        v-bind:leaderlist="leaderlist"
        v-bind:typemodel="typemodel"
        v-bind:newReportList="newReportList"
        v-bind:lastprogress="lastprogress"
      ></edit-plan>
    </div>
    <!-- 详情 -->
    <div class="project-box" v-if="detailShow">
      <detail-plan
        @my-event="handleBack"
        v-bind:basicInfo="basicInfo"
        v-bind:reportDetail="reportDetail"
        v-bind:ruleList="ruleList"
        v-bind:nodeList="nodeList"
        v-bind:leadsData="leadsData"
        v-bind:dutysData="dutysData"
        v-bind:ddheight="ddheight"
        @edit-event="toeditPage"
        v-bind:isEditShow="isEditShow"
        v-bind:noEdit="noEdit"
        v-bind:workid="workid"
        v-bind:histableHeight="histableHeight"
        v-bind:typemodel="typemodel"
        v-bind:newReportList="newReportList"
        v-bind:lastprogress="lastprogress"
        v-bind:isCenter="isCenter"
      ></detail-plan>
    </div>

    <!-- 进展填报 -->
    <div class="report-data-box">
      <report-progress
        :reportVisible.sync="reportVisible"
        :reportData="reportData"
        :laststate="laststate"
        :itemShow="itemShow"
        :workid="workid"
        :reportBasic="reportBasic"
        :fileList.sync="fileList"
        :fileArr.sync="fileArr"
        :isExport.sync="isExport"
        @getAllList-event="getThreePlan"
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
import addPlan from "./addThreePlan"; //新增
import editPlan from "./editThreePlan"; //新增
import detailPlan from "./detailThreePlan"; //详情
import batchRule from "../batchrule"; //报送规则
import importFile from "../importItem"; //导入文件
import reportProgress from "../reportItem"; //进展汇报
import {
  alldeptList,
  leaderList,
  isHidden,
  editHidden,
  reportTerm,
  savereportInfo
} from "../../api/api";
import { defaturl } from "../../api/apiUrl";
import { upfile, imgIp, importThreePlanList } from "../../api/imgUrl";
import {
  getYear,
  threePlanList,
  addPlanReport,
  threePlanDetail,
  bigTermList,
  bigMinList,
  threeworkList,
  changeTotalstate,
  getThreeBypartid,
  repeatReport,
  getStatusForm,
  deletePlan,
  showThreeplanLasttime,
  lasttimeProgress,
  getAllPlanlist,
  seerList
} from "../../api/decisionApi";
import { repeatThreeReport } from "../../api/center";
export default {
  name: "threePlan",
  components: {
    addPlan,
    editPlan,
    detailPlan,
    batchRule,
    reportProgress,
    importFile
  },
  data() {
    return {
      downTypeVisible: false,
      downType: "",
      upbtnDisabled: true,
      showYearbox: true,
      isExport: {visible:true},
      sureImport: true,
      allitems: [],
      batchHeight: "",
      batchVisible: false,
      allShow: true,
      reportData: {},
      laststate: "", //上一次进展情况
      reportVisible: { visible: false },
      itemShow: 3,
      reportid: -1,
      reportBasic: {},
      moreText: "更多搜索条件",
      isOpen: 0,
      toolShow: false,
      seerlist: [], //督查单位列表
      lastprogress: [],
      laststate: "", //上次进展情况
      loading: true,
      chooseyear: {},
      isShow: true,
      addShow: false,
      editShow: false,
      detailShow: false,
      processVisible: false,
      evolveVisible: false,
      deptlist: [],
      userlist: [],
      filters: {},
      years: [],
      statuss: [
        { value: 0, status: "正常" },
        { value: 3, status: "滞后" },
        { value: 4, status: "严重滞后" },
        { value: -1, status: "完结" }
      ],
      tableData: [],
      bitemArr: [],
      bitemPos: 0,
      sitemArr: [],
      sitemPos: 0,
      threeArr: [],
      threePos: 0,
      deptlist: [],
      leaderlist: [], //牵头区领导
      processData: {},
      evolveData: {},
      fileList: [],
      planCheckList: JSON.parse(this.$store.getters.userdata).planCheckList,
      loginid: JSON.parse(this.$store.getters.userdata).id,
      isAddShow: false,
      isEditShow: false,
      isReportShow: false,
      isOverShow: false,
      isDownShow: false,
      isProcessShow: false,
      tasklist: [],
      upfile: "",
      urlIp: "",
      imgIp: "",
      fileArr: [],
      pid: "",
      basicInfo: {},
      workList: [],
      astatus: "",
      cellhidden: [], //隐藏列
      showitemlist: [
        {
          name: "牵头区领导",
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
          name: "进展情况",
          value: 4
        },
        {
          name: "节点安排",
          value: 5
        },
        {
          name: "存在问题",
          value: 6
        },
        {
          name: "解决措施",
          value: 7
        },
        {
          name: "工作计划",
          value: 8
        },
        {
          name: "督查单位",
          value: 9
        }
      ],
      tableHeight: "300px", //设置表格高度
      ishidden1: true,
      ishidden2: true,
      ishidden3: true,
      ishidden4: true,
      ishidden5: true,
      ishidden6: true,
      ishidden7: true,
      ishidden8: true,
      ishidden9: true,
      addheight: "height:500px",
      ddheight: "height:500px",
      histableHeight: "300px",
      colums: "",
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
      leadsData: [],
      dutysData: [],
      nodeList: [],
      noEdit: true,
      ruleList: [],
      currentPage: 1,
      pageSize: 20,
      totals: 0,
      workid: -1,
      reportDetail: {}, //进展填报最新一条数据
      biglist: [], //一级
      minlist: [], //二级
      threeitemList: [], //三级
      typemodel: 1, //1三年行动计划
      newReportList: [], //报送最新一条
      defaturl: "",
      importdataVisible: { visible: false }, //导入数据弹窗
      pdatalist: [], //导入数据文件filelist
      importThreePlanList: "",
      filedatas: [],
      upfile: "",
      urlIp: "",
      otherdata: {},
      isCenter: 3,
      curYear: 2019,
      yearid: 0
    };
  },
  created() {
    this.defaturl = defaturl;
    this.importThreePlanList = importThreePlanList;
    this.upfile = upfile;
    this.imgIp = imgIp;
    this.hiddenDatas();
    this.browerHeight();
    this.passValue();
    this.isshowCheck();
    this.getDeptlist();
    this.getLeaderList();
    this.getyear();
    this.getThreePlan();
    this.centerDetail();
  },
  methods: {
    // 报表下载
    // planDownload() {
    //   window.open(this.defaturl + "/report/createThreeReport");
    // },
    // 报表下载
    planDownload() {
      this.downTypeVisible = true;
    },
    downDatalist() {
      if (this.downType == 1) {
        window.open(this.defaturl + "/report/createThreeReport");
      } else {
        window.open(this.defaturl + "/threeExport2Word/export");
      }
      this.downTypeVisible = false;
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
    // 获取督查单位列表
    getSeerList() {
      seerList("", data => {
        if (data.data.obj == null) {
          this.seerlist = [];
        } else {
          this.seerlist = data.data.obj;
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
      this.getThreePlan();
    },
    // 获取所有项目数据
    getAllDatas() {
      getAllPlanlist({ typemodel: this.typemodel }, data => {
        if (data.data.obj == null) {
          this.allitems = [];
        } else {
          this.allitems = data.data.obj;
          for (var i = 0; i < this.allitems.length; i++) {
            this.allitems[i].name = this.allitems[i].partName;
          }
        }
      });
    },

    // 删除
    handleDelete(index, row, id) {
      this.$confirm(
        '<span style="color:#f00;">该操作将删除此条计划信息</span>，确定删除吗?',
        "提示",
        { type: "warning", dangerouslyUseHTMLString: true }
      )
        .then(() => {
          let para = { wid: id, typemodel: 1 };
          deletePlan(para, data => {
            if (data.data.code == 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getThreePlan();
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
    // 导入数据
    loadData() {
      this.importdataVisible.visible = true;
      this.showYearbox = true;
      this.upbtnDisabled = true;
    },
    // 下载模板
    downMoudle() {
      window.open(this.defaturl + "/templateDownload/threeTemplateDown");
    },
    discountHeaderStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 1) {
        return { display: "none" };
      }
    },
    // 手动修改状态 - 总体进度
    totalstateChange(scope, row) {
      let para = {
        totalstatus: row.totalstatus,
        workid: row.workId,
        typemodel: 1
      };
      changeTotalstate(para, data => {
        this.getThreePlan();
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
    // 牵头区领导去掉最后一个逗号
    namesChange(scope, value) {
      if (value == "" || value == null) {
        return "";
      } else {
        var str = value;
        var reg = /,$/gi;
        str = str.replace(reg, "");
        return str;
      }
    },
    // 获取浏览器高度，计算table高度
    browerHeight() {
      var bheight = document.body.clientHeight;
      var hh = bheight - 390;
      var hh2 = bheight - 280;
      var hh3 = bheight - 350;
      var rh = bheight - 250;
      this.tableHeight = hh + "px";
      this.addheight = "height:" + hh3 + "px";
      this.ddheight = "height:" + hh2 + "px";
      this.histableHeight = hh3 + "px";
      this.batchHeight = rh + "px";
    },
    hiddenDatas() {
      let para = { userid: this.loginid, catagory: 2, typemodel: 1 };
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
      this.ishidden8 = true;
      this.ishidden9 = true;
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
      let para = {
        colums: this.colums,
        userId: this.loginid,
        catagory: 2,
        typemodel: 1
      };
      editHidden(para, data => {
        this.hiddenDatas();
        this.showItems();
        this.colums = "";
      });
    },
    passValue() {
      // this.astatus = this.$route.query.astatus;
      // if (
      //   this.astatus == 1 ||
      //   this.astatus == 0 ||
      //   this.astatus == 2 ||
      //   this.astatus == -1
      // ) {
      //   this.astatus = this.$route.query.astatus;
      // } else {
      //   this.astatus = "";
      // }
      // this.filters.status = this.astatus;
    },
    // 数据列表
    getThreePlan() {
      this.loading = true;
      let para = this.filters;
      para.userid = this.loginid;
      para.pageNum = this.currentPage;
      para.pageSize = this.pageSize;
      para.typemodel = 1;
      threePlanList(para, data => {
        if (data.data.obj == null) {
          this.tableData = [];
          this.totals = 0;
          this.merage();
          this.loading = false;
        } else {
          this.tableData = data.data.obj.datas;
          this.totals = data.data.obj.total;
          this.merage();
          this.loading = false;
        }
      });
    },
    // 分页
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getThreePlan();
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getThreePlan();
    },
    isshowCheck() {
      if (this.planCheckList !== null) {
        for (var i = 0; i < this.planCheckList.length; i++) {
          let value = this.planCheckList[i];
          switch (value) {
            case "C-add":
              this.isAddShow = true;
              break;
            case "C-edit":
              this.isEditShow = true;
              break;
            case "C-report":
              this.isReportShow = true;
              break;
            case "C-over":
              this.isOverShow = true;
              break;
            case "C-down":
              this.isDownShow = true;
              break;
            case "C-process":
              this.isProcessShow = true;
              break;
          }
        }
      }
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
        this.leaderlist = data.data.obj;
      });
    },
    // 年度列表
    getyear() {
      getYear("", data => {
        this.years = data.data.obj;
      });
    },
    // 返回
    handleBack: function() {
      this.isShow = true;
      this.addShow = false;
      this.detailShow = false;
      this.editShow = false;
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
    cellClassName({ row, column, rowIndex }) {
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
      if (row.status == -1) {
        return "noedit";
      } else if (row.status == 4) {
        return "lagbtn";
      }
    },
    merageInit() {
      this.bitemArr = [];
      this.bitemPos = 0;
      this.sitemArr = [];
      this.sitemPos = 0;
      this.threeArr = [];
      this.threePos = 0;
    },
    merage() {
      this.merageInit();
      // this.tableData.forEach((item,index) => {
      //   console.log(item)
      //   console.log(index)
      //   item.index = index;
      //   if (index === 0) {
      //     this.bitemArr.push(1);
      //     this.bitemPos = 0;
      //     this.sitemArr.push(1);
      //     this.sitemPos = 0;
      //     this.threeArr.push(1);
      //     this.threePos = 0;
      //   }else{
      //     // if(item.bigname ===this.tableData[index-1].bigname ){
      //     //   this.bitemArr[this.bitemPos] += 1;
      //     //   this.bitemArr.push(0);
      //     // }else {
      //     //   this.bitemArr.push(1);
      //     //   this.bitemPos = i;
      //     // }
      //     if(item.minname ===this.tableData[index-1].minname && item.bigname ===this.tableData[index-1].bigname){
      //       this.sitemArr[this.sitemPos] += 1;
      //       this.sitemArr.push(0);
      //     }else {
      //       this.sitemArr.push(1);
      //       this.sitemPos = i;
      //     }
      //     if(item.partname ===this.tableData[index-1].partname && item.minname ===this.tableData[index-1].minname && item.bigname ===this.tableData[index-1].bigname ){
      //       this.threeArr[this.threePos] += 1;
      //       this.threeArr.push(0);
      //     }else {
      //       this.threeArr.push(1);
      //       this.threePos = i;
      //     }
      //   }
      // });
      for (var i = 0; i < this.tableData.length; i += 1) {
        // 第1列
        if (i == 0) {
          this.bitemArr.push(1);
          this.bitemPos = 0;
          this.sitemArr.push(1);
          this.sitemPos = 0;
          this.threeArr.push(1);
          this.threePos = 0;
        } else {
          if (this.tableData[i].bigname == this.tableData[i - 1].bigname) {
            this.bitemArr[this.bitemPos] += 1;
            this.bitemArr.push(0);
          } else {
            this.bitemArr.push(1);
            this.bitemPos = i;
          }
          // 第2列
          if (this.tableData[i].minname == this.tableData[i - 1].minname) {
            this.sitemArr[this.sitemPos] += 1;
            this.sitemArr.push(0);
          } else {
            this.sitemArr.push(1);
            this.sitemPos = i;
          }
          // 第3列
          if (this.tableData[i].partname == this.tableData[i - 1].partname) {
            this.threeArr[this.threePos] += 1;
            this.threeArr.push(0);
          } else {
            this.threeArr.push(1);
            this.threePos = i;
          }
        }
      }
    },
    // 合并单元格
    typeSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // 第1列的合并方法
        const row1 = this.bitemArr[rowIndex];
        const col1 = row1 > 0 ? 1 : 0; // 如果被合并了row = 0; 则他这个列需要取消
        return {
          rowspan: row1,
          colspan: col1
        };
      } else if (columnIndex === 1) {
        // 第2列的合并方法
        const row2 = this.sitemArr[rowIndex];
        const col2 = row2 > 0 ? 1 : 0; // 如果被合并了row = 0; 则他这个列需要取消
        return {
          rowspan: row2,
          colspan: col2
        };
      } else if (columnIndex === 2) {
        // 第3列
        const row3 = this.threeArr[rowIndex];
        const col3 = row3 > 0 ? 1 : 0; // 如果被合并了row = 0; 则他这个列需要取消
        return {
          rowspan: row3,
          colspan: col3
        };
      }
    },
    // 搜索
    getDatas: function() {
      this.getThreePlan();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getThreePlan();
    },
    // 过程管理
    handleProcess(index, row) {
      this.pid = row.id;
      this.processVisible = true;
    },
    // 进展基本信息
    redetailFuc(id) {
      threePlanDetail({ workid: id, typemodel: 1 }, data => {
        this.reportBasic = data.data.obj.partterm;
        this.reportBasic.superdept = data.data.obj.superdept;
        this.reportBasic.yearname = data.data.obj.partterm.yearname;
        var str = data.data.obj.areaLeaderNames;
        if (str == null) {
          str = "";
          this.reportBasic.leaders = "";
        } else {
          var reg = /,$/gi;
          str = str.replace(reg, "");
          this.reportBasic.leaders = str;
        }
        this.reportBasic.workname = data.data.obj.workname;
        this.reportBasic.nodeplan = data.data.obj.nodeplan;

        var leaderList = data.data.obj.leaderDeptList;
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
    // 进展填报
    handleEvolve(index, row) {
      this.reportData = {};
      this.workid = row.workId;
      this.filepath = [];
      this.fileList = [];
      this.fileArr = [];
      this.isExport.visible = true;
      // 获取上一次进展情况
      let repa = {};
      repa.workid = this.workid;
      repa.userid = this.loginid;
      repa.typemodel = 1;
      showThreeplanLasttime(
        { userid: this.loginid, workid: this.workid, typemodel: 1 },
        data => {
          this.laststate = data.data.obj.question;
        }
      );
      // 基本信息
      this.redetailFuc(this.workid);
      // 判断是否重复报送
      repeatThreeReport(repa, data => {
        if (data.data.obj == null) {
          // 是否有保存内容
          let repara = {
            userid: this.loginid,
            termid: this.workid,
            modeltype: 3
          };
          reportTerm(repara, data => {
            this.reportVisible.visible = true;
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
              this.reportVisible.visible = true;
              this.reportData.userid = this.loginid;
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
    // 添加附件 移除
    handleRemove(file, fileList) {
      let name = file.response.obj;
      this.fileArr.splice(this.removeArr(this.fileArr, name), 1);
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
    // 添加附件
    handlePreview(file) {},
    // 添加附件 移除前提示
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 添加附件 状态改变时
    handleSuccess(file, fileList) {
      let name = file.obj;
      this.fileArr.push(name);
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
          para.modeltype = 3;
          para.filepath = "";
          para.termid = this.workid;
          savereportInfo(para, data => {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.isExport.visible = false;
          });
        }
      });
    },
    // 进展填报提交
    submitReport: function() {
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

          let para = this.reportData;
          para.workid = this.workid;
          para.validate = 0;
          para.userid = this.loginid;
          para.filepath = files;
          para.typemodel = 1;
          addPlanReport(para, data => {
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
            this.getThreePlan();
          });
        } else {
          return;
        }
      });
    },
    // 详情方法
    detailFuc(para) {
      threePlanDetail(para, data => {
        this.detailData = data.data.obj;
        this.basicInfo = this.detailData.partterm;
        this.basicInfo.superdept = this.detailData.superdept;
        this.basicInfo.nodeplan = this.detailData.nodeplan;
        this.basicInfo.workname = this.detailData.workname;
        this.leadsData = this.detailData.leaderDeptList;
        this.dutysData = this.detailData.dutyList;
        this.ruleList = this.detailData.ruleList;
        var str = this.detailData.areaLeaderNames;
        if (str == null) {
          str = "";
          this.basicInfo.leaders = "";
        } else {
          var reg = /,$/gi;
          str = str.replace(reg, "");
          this.basicInfo.leaders = str;
        }
        if (this.detailData.reportList == null) {
          this.detailData.reportList = [];
        }
        this.newReportList = this.detailData.reportList;
        for (var i = 0; i < this.newReportList.length; i++) {
          this.newReportList[i].newFiles = [];
          var arr = this.newReportList[i].filepath;
          if (arr == "" || arr == null) {
            this.newReportList[i].newFiles = [];
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
              debugger;
              obj.name = arr2[i];
              this.newReportList[i].newFiles.push(obj);
            }
          }
        }
        lasttimeProgress(
          { typemodel: 1, workid: this.workid, userid: this.loginid },
          data => {
            this.lastprogress = data.data.obj;
          }
        );
      });
    },
    // 详情
    handleDetail: function(index, row, id) {
      if (row.totalstatus == -1) {
        this.noEdit = false;
      } else {
        this.noEdit = true;
      }
      this.isShow = false;
      this.detailShow = true;
      this.noEdit = true;
      this.workid = id;
      let para = { workid: id, typemodel: 1 };
      getStatusForm(para, data => {
        let spara = { workid: id, typemodel: 1 };
        this.detailFuc(spara);
      });
    },
    // 详情进入编辑
    toeditPage() {
      let para = { workid: this.workid, typemodel: 1 };
      this.basicInfo = {};
      threePlanDetail(para, data => {
        this.detailData = data.data.obj;
        this.basicInfo = this.detailData.partterm;
        this.basicInfo.partid = this.detailData.partterm.id;
        this.basicInfo.superdept = this.detailData.superdept;
        this.leadsData = this.detailData.leaderDeptList;
        this.dutysData = this.detailData.dutyList;
        this.ruleList = this.detailData.ruleList;
        if (this.detailData.leaderidList == null) {
          this.detailData.leaderidList = [];
        }
        this.basicInfo.arealeadids = this.detailData.leaderidList;
        this.basicInfo.nodeplan = this.detailData.nodeplan;
        this.basicInfo.workname = this.detailData.workname;
        if (this.detailData.reportList == null) {
          this.detailData.reportList = [];
        }
        this.newReportList = this.detailData.reportList;
        for (var i = 0; i < this.newReportList.length; i++) {
          this.newReportList[i].newFiles = [];
          var arr = this.newReportList[i].filepath;
          if (arr == "" || arr == null) {
            this.newReportList[i].newFiles = [];
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
              this.newReportList[i].newFiles.push(obj);
            }
          }
        }
        // 一级
        if (this.basicInfo.yearid == null) {
          this.biglist = [];
        } else {
          let spara = { yearid: this.basicInfo.yearid, typemodel: 1 };
          bigTermList(spara, data => {
            this.biglist = data.data.obj;
          });
        }
        // 二级
        if (this.basicInfo.yearid == null || this.basicInfo.bigid == null) {
          this.minlist = [];
        } else {
          let spara = {
            bigid: this.basicInfo.bigid,
            yearid: this.basicInfo.yearid,
            typemodel: 1
          };
          bigMinList(spara, data => {
            this.minlist = data.data.obj;
          });
        }
        // 三级
        if (
          this.basicInfo.yearid == null ||
          this.basicInfo.bigid == null ||
          this.basicInfo.minid == null
        ) {
          this.threeitemList = [];
        } else {
          let spara = {
            bigid: this.basicInfo.bigid,
            yearid: this.basicInfo.yearid,
            minid: this.basicInfo.minid,
            typemodel: 1
          };
          threeworkList(spara, data => {
            this.threeitemList = data.data.obj;
          });
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
        this.isShow = false;
        this.detailShow = false;
        this.editShow = true;
        lasttimeProgress(
          { typemodel: 1, workid: this.workid, userid: this.loginid },
          data => {
            this.lastprogress = data.data.obj;
          }
        );
      });
    },
    // 个人中心进入详情
    centerDetail() {
      if (this.$route.query.workid == undefined) {
        this.workid = "";
        this.isCenter = 3;
        this.getThreePlan();
      } else {
        this.workid = this.$route.query.workid;
        this.isCenter = this.$route.query.isCenter;
        this.isShow = false;
        this.detailShow = true;
        this.noEdit = true;
        let para = { workid: this.workid, typemodel: 1 };
        getStatusForm(para, data => {});
        this.detailFuc(para);
      }
    },
    // 编辑
    handleEdit: function(index, row, id) {
      this.workid = id;
      this.basicInfo = {};
      let para = { workid: id, typemodel: 1 };
      threePlanDetail(para, data => {
        this.detailData = data.data.obj;
        let partterm = this.detailData.partterm;
        this.basicInfo.bigid = partterm.bigid;
        this.basicInfo.minid = partterm.minid;
        this.basicInfo.yearid = partterm.yearid;
        this.basicInfo.partid = partterm.id;
        this.basicInfo.superdept = this.detailData.superdept;
        if (this.detailData.leaderidList == null) {
          this.detailData.leaderidList = [];
        }
        this.basicInfo.arealeadids = this.detailData.leaderidList;
        this.basicInfo.nodeplan = this.detailData.nodeplan;
        this.basicInfo.workname = this.detailData.workname;
        this.leadsData = this.detailData.leaderDeptList;
        this.dutysData = this.detailData.dutyList;
        this.ruleList = this.detailData.ruleList;
        if (this.detailData.reportList == null) {
          this.detailData.reportList = [];
        }
        this.newReportList = this.detailData.reportList;
        for (var i = 0; i < this.newReportList.length; i++) {
          this.newReportList[i].newFiles = [];
          var arr = this.newReportList[i].filepath;
          if (arr == "" || arr == null) {
            this.newReportList[i].newFiles = [];
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
              this.newReportList[i].newFiles.push(obj);
            }
          }
        }

        // 一级
        if (this.basicInfo.yearid == null) {
          this.biglist = [];
        } else {
          let spara = { yearid: this.basicInfo.yearid, typemodel: 1 };
          bigTermList(spara, data => {
            this.biglist = data.data.obj;
          });
        }
        // 二级
        if (this.basicInfo.yearid == null || this.basicInfo.bigid == null) {
          this.minlist = [];
        } else {
          let spara = {
            bigid: this.basicInfo.bigid,
            yearid: this.basicInfo.yearid,
            typemodel: 1
          };
          bigMinList(spara, data => {
            this.minlist = data.data.obj;
          });
        }
        // 三级
        if (
          this.basicInfo.yearid == null ||
          this.basicInfo.bigid == null ||
          this.basicInfo.minid == null
        ) {
          this.threeitemList = [];
        } else {
          let spara = {
            bigid: this.basicInfo.bigid,
            yearid: this.basicInfo.yearid,
            minid: this.basicInfo.minid,
            typemodel: 1
          };
          threeworkList(spara, data => {
            this.threeitemList = data.data.obj;
          });
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
        this.editShow = true;
        this.isShow = false;
        lasttimeProgress(
          { typemodel: 1, workid: this.workid, userid: this.loginid },
          data => {
            this.lastprogress = data.data.obj;
          }
        );
      });
    },
    currentYear() {
      var nowDate = new Date();
      this.curYear = nowDate.getFullYear();
      for (var i = 0; i < this.years.length; i++) {
        if (this.curYear == this.years[i].year) {
          this.yearid = this.years[i].id;
        }
      }
    },
    // 新增
    handleAdd: function() {
      this.currentYear();
      this.isShow = false;
      this.addShow = true;
    }
  }
};
</script>

<style lang="scss">
.threeyear {
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
      margin-right: 28px;
    }
    .active {
      border-bottom: 2px solid #1890ff;
      color: #1890ff;
    }
  }

  .project-box {
    margin-top: 20px;
  }
  .el-table th.sth {
    padding: 4px 0 !important;
    .cell {
      font-size: 12px;
    }
  }
  .toolbar2 {
    margin-bottom: 20px;
  }
  .el-dialog {
    .dia-style {
      .el-form-item__label {
        line-height: 1.6;
      }
    }
    .dia-task {
      .el-select {
        display: block;
      }
    }
    .dia-input {
      .el-input__inner {
        width: 185px;
      }
    }
    .dia-ww {
      display: flex;
    }
    .upbox {
      padding-left: 40px;
      max-width: 100%;
      .upbtn {
        color: #1890ff;
        border: 0;
        padding: 0;
      }
    }
  }
}

.tableinfo {
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

.ellipsis {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>

