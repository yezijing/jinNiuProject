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
              <el-form-item label="状态：" prop="status" class="zt" v-if="toolShow">
                <el-select
                  v-model="filters.status"
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
                  <el-button type="primary" size="small" v-if="isDownShow">报表下载</el-button>
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
          :data="tableData"
          empty-text="无"
          border
          :height="tableHeight"
          style="width: 100%;"
          :cell-class-name="cellClassName"
          :row-class-name="tableRowClassName"
          v-loading="loading"
          element-loading-text="加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.7)"
        >
          <el-table-column label="序号" width="60" :formatter="numberFormatter"></el-table-column>
          <el-table-column prop="decisionUp" label="恳请协调解决事项">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div
                  style="max-width:300px;line-height:1.8;"
                  slot="content"
                >{{scope.row.decisionUp.nodeplan}}</div>
                <p
                  class="title-ellipsis title"
                  @click="handleDetail(scope.$index, scope.row, scope.row.decisionUp.id)"
                >{{scope.row.decisionUp.nodeplan}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="decisionUp" label="工作安排" v-if="ishidden5">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div
                  style="max-width:300px;line-height:1.8;"
                  slot="content"
                >{{scope.row.decisionUp.workname}}</div>
                <p class="title-ellipsis">{{scope.row.decisionUp.workname}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="areaLeaderNames" label="牵头区领导" v-if="ishidden1">
            <template slot-scope="scope">
              <p v-html="namesChange(scope,scope.row.areaLeaderNames)"></p>
            </template>
          </el-table-column>
          <el-table-column prop="decisionUpLeadDeptList" label="牵头单位" v-if="ishidden2">
            <template slot-scope="scope">
              <p
                v-for="(item, index) in scope.row.decisionUpLeadDeptList"
                :key="index"
              >{{item.deptName}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="decisionUpDutyDeptList" label="责任单位" v-if="ishidden3">
            <template slot-scope="scope">
              <p
                v-for="(item, index) in scope.row.decisionUpDutyDeptList"
                :key="index"
              >{{item.deptName}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="reportList" label="进展情况" v-if="ishidden4">
            <template slot-scope="scope">
              <div>
                <!-- <p
                class="title-ellipsis"
                v-for="(item, index) in scope.row.reportList"
                :key="index"
                >{{item.question}}</p>-->
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
          <el-table-column prop="wenti" label="存在问题" v-if="ishidden6">
            <template slot-scope="scope">
              <div>
                <el-tooltip effect="dark" placement="top-start">
                  <div style="max-width:300px;line-height:2;" slot="content">
                    <p v-for="(item, index) in scope.row.progressList" :key="index">{{item.wenti}}</p>
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
          <el-table-column prop="reportList" label="解决措施" v-if="ishidden7">
            <template slot-scope="scope">
              <div>
                <el-tooltip effect="dark" placement="top-start">
                  <div style="max-width:300px;line-height:2;" slot="content">
                    <p v-for="(item, index) in scope.row.progressList" :key="index">{{item.measure}}</p>
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
          <el-table-column prop="decisionUp" label="材料报送" width="100px">
            <template slot-scope="scope">
              <div>
                <i
                  class="fa mark"
                  v-if="scope.row.decisionUp.formstatus==1"
                  style="background:#fbe804;"
                ></i>
                <i
                  class="fa mark"
                  v-else-if="scope.row.decisionUp.formstatus==2"
                  style="background:#f00;"
                ></i>
                <i
                  class="fa mark"
                  v-else-if="scope.row.decisionUp.formstatus== -1"
                  style="background:#999;"
                ></i>
                <i class="fa mark" v-else></i>
                <span v-html="formstatusFormat(scope,scope.row.decisionUp.formstatus)"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="decisionUp" label="总体进度" width="120px">
            <template slot-scope="scope">
              <div class="flexbox" v-if="isEditShow">
                <i
                  class="fa mark"
                  v-if="scope.row.decisionUp.totalstatus==3"
                  style="background:#364e98;"
                ></i>
                <i
                  class="fa mark"
                  v-else-if="scope.row.decisionUp.totalstatus==4"
                  style="background:#7c1d77;"
                ></i>
                <i
                  class="fa mark"
                  v-else-if="scope.row.decisionUp.totalstatus== -1"
                  style="background:#999;"
                ></i>
                <i class="fa mark" v-else></i>
                <el-select
                  v-model="scope.row.decisionUp.totalstatus"
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
                  v-if="scope.row.decisionUp.totalstatus==3"
                  style="background:#364e98;"
                ></i>
                <i
                  class="fa mark"
                  v-else-if="scope.row.decisionUp.totalstatus==4"
                  style="background:#7c1d77;"
                ></i>
                <i
                  class="fa mark"
                  v-else-if="scope.row.decisionUp.totalstatus== -1"
                  style="background:#999;"
                ></i>
                <i class="fa mark" v-else></i>
                <span v-html="totalstatusFormat(scope,scope.row.decisionUp.totalstatus)"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="edit" label="操作" fixed="right">
            <template scope="scope">
              <el-button
                class="btn"
                @click="handleDetail(scope.$index, scope.row, scope.row.decisionUp.id)"
              >详情</el-button>
              <el-button
                class="btn"
                @click="handleEdit(scope.$index, scope.row, scope.row.decisionUp.id)"
                v-if="isEditShow"
              >编辑</el-button>
              <el-button
                class="btn"
                @click="handleDelete(scope.$index, scope.row, scope.row.decisionUp.id)"
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
    <!-- 导入数据 -->
    <el-dialog title="导入数据" :visible.sync="importdataVisible" width="500px">
      <p class="import-ts">
        <span>请使用模板导入数据</span>，如未使用模板，请先下载模板后再导入数据！
      </p>
      <el-form :model="chooseyear" ref="chooseyear" size="small">
        <el-form-item
          label="年度："
          prop="year"
          :rules="[{ required: true, message: '请选择年度', trigger: 'change' }]"
        >
          <el-date-picker
            v-model="chooseyear.year"
            value-format="yyyy"
            type="year"
            placeholder="选择年度"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <el-upload
        class="upload-demo"
        :action="importUpWorkList"
        :on-remove="dataRemove"
        :on-success="dataSuccess"
        :file-list="pdatalist"
        :on-exceed="handleExceed"
        :multiple="false"
        :limit="1"
        :auto-upload="false"
        ref="uploaddata"
        :data="otherdata"
      >
        <el-button size="small" type="primary">上传文件</el-button>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="importdataVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="sureImportData">确定导入</el-button>
      </div>
    </el-dialog>
    <!-- 新增 -->
    <div class="project-box" v-if="addShow">
      <add-worksharing
        @my-event="handleBack"
        @add-event="getThreePlan"
        v-bind:deptlist="deptlist"
        v-bind:leaderlist="leaderlist"
        v-bind:addheight="addheight"
        v-bind:typemodel="typemodel"
      ></add-worksharing>
    </div>
    <!-- 编辑 -->
    <div class="project-box" v-if="editShow">
      <edit-worksharing
        @my-event="handleBack"
        @add-event="getThreePlan"
        v-bind:deptlist="deptlist"
        v-bind:basicInfo="basicInfo"
        v-bind:addheight="addheight"
        v-bind:leadsData="leadsData"
        v-bind:dutysData="dutysData"
        v-bind:ruleList="ruleList"
        v-bind:nodeList="nodeList"
        v-bind:upfile="upfile"
        v-bind:imgIp="imgIp"
        v-bind:workid="workid"
        v-bind:leaderlist="leaderlist"
        v-bind:typemodel="typemodel"
        v-bind:newReportList="newReportList"
      ></edit-worksharing>
    </div>
    <!-- 详情 -->
    <div class="project-box" v-if="detailShow">
      <detail-worksharing
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
      ></detail-worksharing>
    </div>

    <!-- 进展填报弹窗 -->
    <el-dialog title="新增进展汇报" :visible.sync="reportVisible" width="1200px" class="report-dialog">
      <report-content
        :reportVisible.sync="reportVisible"
        :fileArr.sync="fileArr"
        :reportBasic="reportBasic"
        :reportData.sync="reportData"
        :fileList.sync="fileList"
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
import addWorksharing from "./addWorkSharing"; //新增
import editWorksharing from "./editWorkSharing"; //新增
import detailWorksharing from "./detailWorkSharing"; //详情
import reportContent from "../report"; //进展汇报
import batchRule from "../batchrule"; //报送规则
import {
  alldeptList,
  leaderList,
  isHidden,
  editHidden,
  reportTerm,
  savereportInfo
} from "../../api/api";
import { getYear, seerList } from "../../api/decisionApi";
import {
  threePlanList,
  threePlanDetail,
  repeatReportDecisionUp,
  addPlanReport,
  changeTotalstate,
  deleteUp,
  getAllDup
} from "../../api/workApi";
import { defaturl } from "../../api/apiUrl";
import { upfile, imgIp, importUpWorkList } from "../../api/imgUrl";
export default {
  name: "threePlan",
  components: {
    addWorksharing,
    editWorksharing,
    detailWorksharing,
    reportContent,
    batchRule
  },
  data() {
    return {
      allitems: [],
      batchHeight: "",
      batchVisible: false,
      allShow: true,
      loading: true,
      chooseyear: {},
      otherdata: {},
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
        { value: 1, status: "预警" },
        { value: 2, status: "逾期" },
        { value: 3, status: "滞后" },
        { value: 4, status: "严重滞后" },
        { value: -1, status: "完结" }
      ],
      tableData: [],
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
          name: "工作安排",
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
          name: "恳请协调解决事项",
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
      biglist: [], //一级
      minlist: [], //二级
      threeitemList: [], //三级
      newReportList: [], //报送最新一条
      defaturl: "",
      importdataVisible: false, //导入数据弹窗
      pdatalist: [], //导入数据文件filelist
      importUpWorkList: "",
      filedatas: [],
      typemodel: 1,
      seerlist: [],
      moreText: "更多搜索条件",
      isOpen: 0,
      toolShow: false,
      reportData: {},
      laststate: "", //上一次进展情况
      reportVisible: false,
      itemShow: 5,
      reportid: -1,
      reportBasic: {}
    };
  },
  created() {
    this.upfile = upfile;
    this.urlIp = imgIp;
    this.defaturl = defaturl;
    this.importUpWorkList = importUpWorkList;
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
    // 获取所有项目数据
    getAllDatas() {
      getAllDup("", data => {
        if (data.data.obj == null) {
          this.allitems = [];
        } else {
          this.allitems = data.data.obj;
          for (var i = 0; i < this.allitems.length; i++) {
            this.allitems[i].name = this.allitems[i].nodeplan;
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
    // 删除
    handleDelete(index, row, id) {
      this.$confirm(
        '<span style="color:#f00;">该操作将删除此条信息</span>，确定删除吗?',
        "提示",
        { type: "warning", dangerouslyUseHTMLString: true }
      )
        .then(() => {
          let para = { id: id };
          deleteUp(para, data => {
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
    // 添加附件 状态改变时
    dataSuccess(file, fileList) {
      let name = file.obj;
      this.filedatas.push(name);
      this.getThreePlan();
    },
    // 导入数据
    loadData() {
      this.pdatalist = [];
      this.filedatas = [];
      this.importdataVisible = true;
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
        }
      });
    },
    // 下载模板
    downMoudle() {
      window.open(this.defaturl + "/templateDownload/projectTemplateDown");
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
        totalstatus: row.decisionUp.totalstatus,
        workid: row.decisionUp.id
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
      threePlanList(para, data => {
        if (data.data.obj == null) {
          this.tableData = [];
          this.totals = 0;
          this.loading = false;
        } else {
          this.tableData = data.data.obj.datas;
          this.totals = data.data.obj.total;
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
      // let para = this.filters;
      // para.userid = this.loginid;
      // para.typemodel=this.typemodel;
      // threePlanList(para, data => {
      //   this.tableData = data.data.obj;
      // });
      this.getThreePlan();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getThreePlan();
    },
    // 进展基本信息
    redetailFuc(id) {
      threePlanDetail({ workid: id }, data => {
        this.reportBasic = data.data.obj.decisionUp;
        var str = this.reportBasic.arealeadnames;
        if (str == null) {
          str = "";
          this.reportBasic.arealeadnames = "";
        } else {
          var reg = /,$/gi;
          str = str.replace(reg, "");
          this.reportBasic.arealeadnames = str;
        }
      });
    },
    // 进展填报
    handleEvolve(index, row) {
      this.reportData = {};
      this.filepath = [];
      this.fileList = [];
      this.fileArr = [];
      this.laststate = "";
      this.workid = row.decisionUp.id;
      // 获取上一次进展情况
      // showThreeplanLasttime(
      //   { userid: this.loginid, workid: this.workid, typemodel: 1 },
      //   data => {
      //     this.laststate = data.data.obj.question;
      //   }
      // );
      // 基本信息
      this.redetailFuc(this.workid);
      // 重复报送验证
      let repa = {};
      repa.workid = this.workid;
      repa.userid = this.loginid;
      repeatReportDecisionUp(repa, data => {
        if (data.data.obj == true) {
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
              this.reportVisible = true;
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消报送"
              });
              this.reportVisible = false;
            });
        } else {
          this.reportVisible = true;
          // 是否有保存内容
          let repara = {
            userid: this.loginid,
            termid: this.workid,
            modeltype: 5
          };
          reportTerm(repara, data => {
            var reobj = data.data.obj;
            if (reobj == null) {
              this.reportData = { userid: this.loginid };
              this.reportid = -1;
            } else {
              this.reportid = reobj.id;
              this.reportData = {
                userid: this.loginid,
                question: reobj.question,
                measure: reobj.measure,
                wenti: reobj.wenti,
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
          if (this.reportid == -1) {
          } else {
            para.id = this.reportid;
          }
          para.modeltype = 5;
          para.filepath = "";
          para.termid = this.workid;
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
        this.basicInfo = this.detailData.decisionUp;
        this.basicInfo.leaders = this.detailData.decisionUp.arealeadnames;
        this.basicInfo.yearname = this.detailData.decisionUp.year;
        this.leadsData = this.detailData.decisionUpLeadDeptList;
        this.dutysData = this.detailData.decisionUpDutyDeptList;
        this.ruleList = this.detailData.decisionUpRuleList;
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
      });
    },
    // 详情
    handleDetail: function(index, row, id) {
      if (row.decisionUp.totalstatus == -1) {
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
        this.getThreePlan();
      } else {
        if (this.$route.query.sortnum == 1) {
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
      threePlanDetail(para, data => {
        this.detailData = data.data.obj;
        this.basicInfo = this.detailData.decisionUp;
        // 牵头区领导
        var aids = this.detailData.decisionUp.arealeadids;
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

        this.leadsData = this.detailData.decisionUpLeadDeptList;
        this.dutysData = this.detailData.decisionUpDutyDeptList;
        this.ruleList = this.detailData.decisionUpRuleList;
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
        this.editShow = true;
        this.isShow = false;
      });
    },
    // 编辑
    handleEdit: function(index, row, id) {
      this.workid = id;
      this.basicInfo = {};
      let para = { workid: id };
      this.editFuc(para);
    },
    // 详情进入编辑
    toeditPage() {
      this.detailShow = false;
      let para = { workid: this.workid };
      this.basicInfo = {};
      this.editFuc(para);
    },
    // 新增
    handleAdd: function() {
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

