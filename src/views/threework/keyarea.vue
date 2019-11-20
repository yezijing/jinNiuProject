<template>
  <div class="content-wrap">
    <div v-if="allShow">
      <div v-show="isShow">
        <!--工具条-->
        <el-row>
          <el-col :span="24" class="toolbar toolbar2">
            <el-form :inline="true" :model="filters" ref="filters" size="small">
              <el-form-item label="年度：" prop="yearId" class="zt">
                <el-select v-model="filters.yearId" clearable placeholder="全部">
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
                prop="areaLeadId"
                filterable
                class="ld"
                @change="selectChange"
              >
                <el-select v-model="filters.areaLeadId" clearable placeholder="全部">
                  <el-option
                    v-for="item in leaderlist"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="牵头单位：" prop="leaderDeptId" class="ld">
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
                    @click="keyareaDownload"
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
          border
          :height="tableHeight"
          :span-method="typeSpanMethod"
          style="width: 100%;"
          :cell-class-name="cellClassName"
          :row-class-name="tableRowClassName"
          v-loading="loading"
          element-loading-text="加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.7)"
        >
          <el-table-column label="序号" width="60" :formatter="numberFormatter"></el-table-column>
          <el-table-column prop="tripleAreaProgress" label="具体片区">
            <template slot-scope="scope">
              <p>{{scope.row.tripleAreaProgress.nodeplan}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="tripleAreaProgress" label="项目名称">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div
                  style="max-width:300px;line-height:1.8;"
                  slot="content"
                >{{scope.row.tripleAreaProgress.workname}}</div>
                <p
                  class="title-ellipsis title"
                  @click="handleDetail(scope.$index, scope.row, scope.row.tripleAreaProgress.id)"
                >{{scope.row.tripleAreaProgress.workname}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="tripleAreaProgress" label="重要时间节点" v-if="ishidden5">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div
                  style="max-width:300px;line-height:1.8;"
                  slot="content"
                >{{scope.row.tripleAreaProgress.timenode}}</div>
                <p class="title-ellipsis">{{scope.row.tripleAreaProgress.timenode}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="tripleAreaProgress" label="督查单位">
            <template slot-scope="scope">
              <p class="title-ellipsis">{{scope.row.tripleAreaProgress.superdept}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="areaLeaderNames" label="牵头区领导" v-if="ishidden1">
            <template slot-scope="scope">
              <p v-html="namesChange(scope,scope.row.areaLeaderNames)"></p>
            </template>
          </el-table-column>
          <el-table-column prop="tripleAreaProgressLeadDeptList" label="牵头单位" v-if="ishidden2">
            <template slot-scope="scope">
              <p
                v-for="(item, index) in scope.row.tripleAreaProgressLeadDeptList"
                :key="index"
              >{{item.deptName}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="tripleAreaProgressDutyDeptList" label="责任单位" v-if="ishidden3">
            <template slot-scope="scope">
              <p
                v-for="(item, index) in scope.row.tripleAreaProgressDutyDeptList"
                :key="index"
              >{{item.deptName}}</p>
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
          <el-table-column prop="tripleAreaProgress" label="材料报送" width="100px">
            <template slot-scope="scope">
              <div>
                <i
                  class="fa mark"
                  v-if="scope.row.tripleAreaProgress.formstatus==1"
                  style="background:#fbe804;"
                ></i>
                <i
                  class="fa mark"
                  v-else-if="scope.row.tripleAreaProgress.formstatus==2"
                  style="background:#f00;"
                ></i>
                <i
                  class="fa mark"
                  v-else-if="scope.row.tripleAreaProgress.formstatus== -1"
                  style="background:#999;"
                ></i>
                <i class="fa mark" v-else></i>
                <span v-html="formstatusFormat(scope,scope.row.tripleAreaProgress.formstatus)"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="tripleAreaProgress" label="总体进度" width="120px">
            <template slot-scope="scope">
              <div class="flexbox" v-if="isEditShow">
                <i
                  class="fa mark"
                  v-if="scope.row.tripleAreaProgress.totalstatus==3"
                  style="background:#364e98;"
                ></i>
                <i
                  class="fa mark"
                  v-else-if="scope.row.tripleAreaProgress.totalstatus==4"
                  style="background:#7c1d77;"
                ></i>
                <i
                  class="fa mark"
                  v-else-if="scope.row.tripleAreaProgress.totalstatus== -1"
                  style="background:#999;"
                ></i>
                <i class="fa mark" v-else></i>
                <el-select
                  v-model="scope.row.tripleAreaProgress.totalstatus"
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
                <i
                  class="fa mark"
                  v-if="scope.row.tripleAreaProgress.totalstatus==3"
                  style="background:#364e98;"
                ></i>
                <i
                  class="fa mark"
                  v-else-if="scope.row.tripleAreaProgress.totalstatus==4"
                  style="background:#7c1d77;"
                ></i>
                <i
                  class="fa mark"
                  v-else-if="scope.row.tripleAreaProgress.totalstatus== -1"
                  style="background:#999;"
                ></i>
                <i class="fa mark" v-else></i>
                <span v-html="totalstatusFormat(scope,scope.row.tripleAreaProgress.totalstatus)"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="edit" label="操作" fixed="right">
            <template scope="scope">
              <el-button
                class="btn"
                @click="handleDetail(scope.$index, scope.row, scope.row.tripleAreaProgress.id)"
              >详情</el-button>
              <el-button
                class="btn"
                @click="handleEdit(scope.$index, scope.row, scope.row.tripleAreaProgress.id)"
                v-if="isEditShow"
              >编辑</el-button>
              <el-button
                class="btn"
                @click="handleDelete(scope.$index, scope.row, scope.row.tripleAreaProgress.id)"
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
        :importFileList="importKeyareaList"
        :upbtnDisabled.sync="upbtnDisabled"
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
      <add-keyarea
        @my-event="handleBack"
        @add-event="getThreePlan"
        v-bind:deptlist="deptlist"
        v-bind:leaderlist="leaderlist"
        v-bind:addheight="addheight"
        v-bind:typemodel="typemodel"
        :yearid="yearid"
        :isImport="isImport"
      ></add-keyarea>
    </div>
    <!-- 编辑 -->
    <div class="project-box" v-if="editShow">
      <edit-keyarea
        @my-event="handleBack"
        @add-event="getThreePlan"
        v-bind:deptlist="deptlist"
        v-bind:basicInfo="basicInfo"
        v-bind:addheight="addheight"
        v-bind:leadsData="leadsData"
        v-bind:dutysData="dutysData"
        v-bind:ruleList="ruleList"
        v-bind:checkReceipt="checkReceipt"
        v-bind:upfile="upfile"
        v-bind:imgIp="imgIp"
        v-bind:workid="workid"
        v-bind:leaderlist="leaderlist"
        v-bind:typemodel="typemodel"
        v-bind:newReportList="newReportList"
        :lastprogress="lastprogress"
        :isImport="isImport"
      ></edit-keyarea>
    </div>
    <!-- 详情 -->
    <div class="project-box" v-if="detailShow">
      <detail-keyarea
        @my-event="handleBack"
        v-bind:basicInfo="basicInfo"
        v-bind:reportDetail="reportDetail"
        v-bind:ruleList="ruleList"
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
        v-bind:isCenter="isCenter"
        :lastprogress="lastprogress"
        :isImport="isImport"
      ></detail-keyarea>
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
import addKeyarea from "./addKeyarea"; //新增
import editKeyarea from "./editKeyarea"; //新增
import detailKeyarea from "./detailKeyarea"; //详情
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
import { getYear } from "../../api/decisionApi";
import {
  keyAreaList,
  keyAreaDetail,
  repeatReportKeyarea,
  addKeyareaReport,
  changeTotalstateKeyarea,
  deleteKeyarea,
  getAllKeyarea,
  lasttimeKeyareaProgress,
  showKeyareaLastReport
} from "../../api/threework";
import { defaturl } from "../../api/apiUrl";
import { upfile, imgIp, importKeyareaList } from "../../api/imgUrl";
export default {
  name: "threePlan",
  components: {
    addKeyarea,
    editKeyarea,
    detailKeyarea,
    reportProgress,
    batchRule,
    importFile
  },
  data() {
    return {
      downTypeVisible: false,
      downType: "",
      upbtnDisabled: true,
      showYearbox: true,
      lastprogress: "",
      isCenter: 3,
      reportData: {},
      laststate: "", //上一次进展情况
      reportVisible: { visible: false },
      itemShow: 8,
      reportid: -1,
      reportBasic: {},
      allitems: [],
      batchHeight: "",
      batchVisible: false,
      allShow: true,
      chooseyear: {},
      otherdata: {},
      isShow: true,
      addShow: false,
      editShow: false,
      detailShow: false,
      processVisible: false,
      deptlist: [],
      userlist: [],
      filters: {},
      years: [],
      statuss: [
        { value: 0, status: "正常" },
        { value: 1, status: "预警" },
        { value: 2, status: "逾期" },
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
          name: "市上总体安排",
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
          name: "协调解决事项",
          value: 8
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
      pageSize: 10,
      totals: 0,
      workid: -1,
      reportDetail: {}, //进展填报最新一条数据
      checkReceipt: {}, //进展汇报数据
      biglist: [], //一级
      minlist: [], //二级
      threeitemList: [], //三级
      newReportList: [], //报送最新一条
      defaturl: "",
      importdataVisible: { visible: false }, //导入数据弹窗
      pdatalist: [], //导入数据文件filelist
      importKeyareaList: "",
      filedatas: [],
      typemodel: 2,
      loading: true,
      curYear: 2019,
      yearid: 0,
      isImport: true,
      isExport: { visible: true }
    };
  },
  created() {
    this.upfile = upfile;
    this.imgIp = imgIp;
    this.defaturl = defaturl;
    this.importKeyareaList = importKeyareaList;
    this.hiddenDatas();
    this.browerHeight();
    this.isshowCheck();
    this.getDeptlist();
    this.getLeaderList();
    this.getyear();
    this.getThreePlan();
    this.centerDetail();
  },
  methods: {
    // 报表下载
    keyareaDownload() {
      this.downTypeVisible = true;
    },
    downDatalist() {
      if (this.downType == 1) {
        window.open(
          this.defaturl + "/tripleAreaProgress/tripleAreaExportExcel"
        );
      } else {
        window.open(this.defaturl + "/tripleAreaProgress/tripleAreaExport");
      }
      this.downTypeVisible = false;
    },

    // 获取所有项目数据
    getAllDatas() {
      getAllKeyarea("", data => {
        if (data.data.obj == null) {
          this.allitems = [];
        } else {
          this.allitems = data.data.obj;
          for (var i = 0; i < this.allitems.length; i++) {
            this.allitems[i].name = this.allitems[i].workname;
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
      this.getThreePlan();
    },
    // 合并单元格
    typeSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        // 第1列的合并方法
        const row1 = this.bitemArr[rowIndex];
        const col1 = row1 > 0 ? 1 : 0; // 如果被合并了row = 0; 则他这个列需要取消
        return {
          rowspan: row1,
          colspan: col1
        };
      }
    },
    merage() {
      this.bitemArr = [];
      this.bitemPos = 0;
      for (var i = 0; i < this.tableData.length; i += 1) {
        // 第1列
        if (i == 0) {
          this.bitemArr.push(1);
          this.bitemPos = 0;
        } else {
          if (
            this.tableData[i].tripleAreaProgress.nodeplan ==
            this.tableData[i - 1].tripleAreaProgress.nodeplan
          ) {
            this.bitemArr[this.bitemPos] += 1;
            this.bitemArr.push(0);
          } else {
            this.bitemArr.push(1);
            this.bitemPos = i;
          }
        }
      }
      console.log(this.bitemArr);
    },
    // 删除
    handleDelete(index, row, id) {
      this.$confirm(
        '<span style="color:#f00;">该操作将删除此条信息</span>，确定删除吗?',
        "提示",
        { type: "warning", dangerouslyUseHTMLString: true }
      )
        .then(() => {
          let para = { id: id };
          deleteKeyarea(para, data => {
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
    // 添加附件 移除
    dataRemove(file, fileList) {
      let name = file.response.obj;
      this.filedatas.splice(this.removeArr(this.filedatas, name), 1);
    },
    // 上传文件超出个数提示
    handleExceed(files, fileList) {
      this.$message.warning({
        message:
          "当前限制只能上传 1 个文件，请先删除已上传的文件，再重新上传！",
        duration: 5000
      });
    },
    hasYear() {
      this.upfileDisabled = false;
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
    // 添加附件 状态改变时
    dataSuccess(file, fileList) {
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
        this.getThreePlan();
      }
    },
    // 导入数据
    loadData() {
      // this.pdatalist = [];
      // this.filedatas = [];
      // this.sureImport = true;
      // this.errorShow = false;
      // this.successShow = false;
      // this.importdataVisible.visible = true;
      this.importdataVisible.visible = true;
      this.showYearbox = true;
      this.upbtnDisabled = false;
    },
    // 确定导入
    sureImportData() {
      this.$refs.chooseyear.validate(valid => {
        if (valid) {
          this.otherdata.year = parseInt(this.chooseyear.year);
          this.otherdata.createuser = this.loginid;
          this.$refs.uploaddata.submit();
          this.importdataVisible = false;
          this.$message({
            type: "success",
            message: "导入成功!"
          });
          this.getThreePlan();
        }
      });
    },
    // 下载模板
    downMoudle() {
      window.open(this.defaturl + "/templateDownload/tripleAreaImportTemplate");
    },
    // 序号
    numberFormatter(row, column, cellValue, index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize;
    },
    // tab切换
    tabsClick(index) {
      this.activeClass = index;
    },
    // 手动修改状态 - 总体进度
    totalstateChange(scope, row) {
      let para = {
        totalstatus: row.tripleAreaProgress.totalstatus,
        workid: row.tripleAreaProgress.id
      };
      changeTotalstateKeyarea(para, data => {
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
    // 获取浏览器高度，计算table高度
    browerHeight() {
      var bheight = document.body.clientHeight;
      var hh = bheight - 390;
      var hh2 = bheight - 280;
      var hh3 = bheight - 350;
      var rh = bheight - 250;
      this.batchHeight = rh + "px";
      this.tableHeight = hh + "px";
      this.addheight = "height:" + hh3 + "px";
      this.ddheight = "height:" + hh2 + "px";
      this.histableHeight = hh3 + "px";
    },
    // 隐藏显示表格列
    hiddenDatas() {
      let para = {
        userid: this.loginid,
        catagory: 2,
        typemodel: this.typemodel
      };
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
      let para = { colums: this.colums, userId: this.loginid, catagory: 2 };
      editHidden(para, data => {
        this.hiddenDatas();
        this.showItems();
        this.colums = "";
      });
    },
    // 数据列表
    getThreePlan() {
      this.loading = true;
      let para = this.filters;
      para.userid = this.loginid;
      para.pageNum = this.currentPage;
      para.pageSize = this.pageSize;
      keyAreaList(para, data => {
        if (data.data.obj == null || data.data.obj == []) {
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
    // 权限控制
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
    // 搜索
    getDatas: function() {
      this.getThreePlan();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getThreePlan();
    },
    // 进展基本信息
    redetailFuc(id) {
      keyAreaDetail({ workid: id }, data => {
        this.detailData = data.data.obj;
        this.reportBasic = this.detailData.tripleAreaProgress;
        this.reportBasic.yearname = this.detailData.tripleAreaProgress.year;
        var str = this.detailData.tripleAreaProgress.arealeadnames;
        if (str == null) {
          str = "";
          this.reportBasic.leaders = "";
        } else {
          var reg = /,$/gi;
          str = str.replace(reg, "");
          this.reportBasic.leaders = str;
        }
        var leaderList = data.data.obj.tripleAreaProgressLeadDeptList;
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
      this.fileList = [];
      this.fileArr = [];
      this.laststate = "";
      this.isExport.visible = true;
      this.workid = row.tripleAreaProgress.id;
      // 基本信息
      this.redetailFuc(this.workid);
      // 上一次进展情况
      lasttimeKeyareaProgress({ workid: this.workid }, data => {
        if (data.data.obj == null) {
          this.laststate = "";
        } else {
          this.laststate = data.data.obj.question;
        }
      });
      let repa = {};
      repa.workid = this.workid;
      repa.userid = this.loginid;
      repeatReportKeyarea(repa, data => {
        if (data.data.obj == true) {
          this.isExport.visible = false;
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
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消报送"
              });
              this.reportVisible.visible = false;
            });
        } else {
          // 是否有保存内容
          let repara = {
            userid: this.loginid,
            termid: this.workid,
            modeltype: 8
          };
          reportTerm(repara, data => {
            var reobj = data.data.obj;
            this.isExport.visible = true;
            if (reobj == null) {
              this.reportData = { userid: this.loginid };
              this.reportid = -1;
            } else {
              this.isExport.visible = false;
              this.workid = false;
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
          para.modeltype = 8;
          para.filepath = "";
          para.termid = this.workid;
          savereportInfo(para, data => {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.isExport.visible = false;
            // this.reportVisible = false;
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
          para.files = files;
          addKeyareaReport(para, data => {
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
      keyAreaDetail(para, data => {
        this.detailData = data.data.obj;
        this.basicInfo = this.detailData.tripleAreaProgress;
        this.basicInfo.yearname = this.detailData.tripleAreaProgress.year;
        var str = this.detailData.tripleAreaProgress.arealeadnames;
        if (str == null) {
          str = "";
          this.basicInfo.leaders = "";
        } else {
          var reg = /,$/gi;
          str = str.replace(reg, "");
          this.basicInfo.leaders = str;
        }
        this.leadsData = this.detailData.tripleAreaProgressLeadDeptList;
        this.dutysData = this.detailData.tripleAreaProgressDutyDeptList;
        this.ruleList = this.detailData.tripleAreaProgressRuleList;
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
        lasttimeKeyareaProgress({ workid: this.workid }, data => {
          if (data.data.obj == null) {
            this.lastprogress = "";
          } else {
            this.lastprogress = data.data.obj.question;
          }
        });
      });
    },
    // 详情
    handleDetail: function(index, row, id) {
      if (row.tripleAreaProgress.totalstatus == -1) {
        this.noEdit = false;
      } else {
        this.noEdit = true;
      }
      this.isShow = false;
      this.detailShow = true;
      this.noEdit = true;
      this.workid = id;
      let para = { workid: id };
      this.detailFuc(para);
    },
    // 个人中心进入详情
    centerDetail() {
      if (this.$route.query.workid == undefined) {
        this.workid = "";
        this.isCenter = 3;
        this.getThreePlan();
      } else {
        if (this.$route.query.sortnum == 1) {
          this.isCenter = this.$route.query.isCenter;
          this.workid = this.$route.query.workid;
          this.isShow = false;
          this.detailShow = true;
          this.noEdit = true;
          let para = { workid: this.workid };
          this.detailFuc(para);
        } else {
          return false;
        }
      }
    },
    // 编辑方法
    editFuc(para) {
      keyAreaDetail(para, data => {
        this.editShow = true;
        this.isShow = false;
        this.detailData = data.data.obj;
        this.basicInfo = this.detailData.tripleAreaProgress;
        this.basicInfo.superdept = this.detailData.tripleAreaProgress.superdept.split(
          ","
        );
        // 牵头区领导
        var aids = this.detailData.tripleAreaProgress.arealeadids;
        var aidarr = [];
        if (aids == null || aids == "") {
          aidarr = [];
          this.basicInfo.arealeadids = [];
        } else {
          aids =
            aids.substring(aids.length - 1) == ","
              ? aids.substring(0, aids.length - 1)
              : aids;
          aidarr = aids.split(",");
          this.basicInfo.arealeadids = aidarr.map(Number);
        }
        // 牵头单位、责任单位、报送规则
        this.leadsData = this.detailData.tripleAreaProgressLeadDeptList;
        this.dutysData = this.detailData.tripleAreaProgressDutyDeptList;
        this.ruleList = this.detailData.tripleAreaProgressRuleList;
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
        if (this.leadsData == null) {
          this.leadsData = [];
        }
        if (this.dutysData == null) {
          this.dutysData = [];
        }
        if (this.ruleList == null) {
          this.ruleList = [];
        }

        lasttimeKeyareaProgress({ workid: this.workid }, data => {
          if (data.data.obj == null) {
            this.lastprogress = "";
          } else {
            this.lastprogress = data.data.obj.question;
          }
        });
      });
    },
    // 详情进入编辑
    toeditPage() {
      this.detailShow = false;
      let para = { workid: this.workid };
      this.basicInfo = {};
      this.editFuc(para);
    },
    // 编辑
    handleEdit: function(index, row, id) {
      this.workid = id;
      this.basicInfo = {};
      let para = { workid: id };
      this.editFuc(para);
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

