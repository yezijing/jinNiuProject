<template>
  <div class="leaderunit-box">
    <!-- 数据 -->
    <div class="datas">
      <div class="list">
        <p class="t1">预警</p>
        <p class="t2">
          <span>{{warnCounter}}</span>个
        </p>
      </div>
      <div class="list">
        <p class="t1">逾期</p>
        <p class="t2">
          <span>{{lastCounter}}</span>个
        </p>
      </div>
      <div class="list">
        <p class="t1">滞后</p>
        <p class="t2">
          <span>{{zhiHouCounter}}</span>个
        </p>
      </div>
      <div class="list">
        <p class="t1">严重滞后</p>
        <p class="t2">
          <span>{{yanZhongCounter}}</span>个
        </p>
      </div>
    </div>
    <el-row :gutter="20" style="margin-bottom:15px;">
      <!-- 预警信息 -->
      <el-col :span="15">
        <el-card class="box-card">
          <div slot="header">
            <span class="card-title">预警信息</span>
          </div>
          <el-table
            class="tableinfo"
            empty-text="无"
            border
            height="400px"
            :data="leaderWarn"
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column
              prop="warnTypeSearch"
              label="类别"
              :filters="warntypes"
              :filter-method="filterTag"
              filter-placement="bottom"
              width="100px"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.warnTypeSearch==1">重点项目</span>
                <span v-else-if="scope.row.warnTypeSearch==2">批交办事项</span>
                <span v-else-if="scope.row.warnTypeSearch==3">三年行动计划</span>
                <span v-else-if="scope.row.warnTypeSearch==4">现场办公会</span>
                <span v-else-if="scope.row.warnTypeSearch==7">片区督查</span>
                <span v-else-if="scope.row.warnTypeSearch==9">区级指标管理</span>
                <span v-else-if="scope.row.warnTypeSearch==10">承办单位指标管理</span>
                <span v-else-if="scope.row.warnTypeSearch==12">重点工作</span>
              </template>
            </el-table-column>
            <el-table-column prop="warnName" label="名称">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div
                    style="max-width:300px;line-height:1.8;"
                    slot="content"
                  >{{scope.row.warnName}}</div>
                  <p
                    @click="handleDetail(scope.row)"
                    class="title title-ellipsis"
                  >{{scope.row.warnName}}</p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="截止时间" prop="endTime" width="100px">
              <template slot-scope="scope">
                <p v-if="scope.row.endTime==null">/</p>
                <span v-else>{{scope.row.endTime | dateformat('YYYY-MM-DD')}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="formstatus"
              label="材料报送"
              :filters="[{ text: '预警', value: 1 }, { text: '逾期', value: 2 }, { text: '完结', value: -1 }, { text: '正常', value: 0 }]"
              :filter-method="filterFormstatus"
              filter-placement="bottom"
            >
              <template slot-scope="scope">
                <el-tag size="medium">
                  <i class="fa mark" v-if="scope.row.formstatus==1" style="background:#fbe804;"></i>
                  <i class="fa mark" v-else-if="scope.row.formstatus==2" style="background:#f00;"></i>
                  <i class="fa mark" v-else-if="scope.row.formstatus== -1" style="background:#999;"></i>
                  <i class="fa mark" v-else-if="scope.row.formstatus== null" style="display:none;"></i>
                  <i class="fa mark" v-else></i>
                  <span v-html="formstatusFormat(scope,scope.row.formstatus)"></span>
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="totalstatus" label="总体进度">
              <template slot-scope="scope">
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
                  <i
                    class="fa mark"
                    v-else-if="scope.row.totalstatus== 1"
                    style="background:#fbe804;"
                  ></i>
                  <i class="fa mark" v-else-if="scope.row.totalstatus== null" style="display:none;"></i>
                  <i class="fa mark" v-else></i>
                  <span v-html="totalstatusFormat(scope,scope.row.totalstatus)"></span>
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="auditStatus"
              label="状态"
              :filters="stateTypes"
              :filter-method="filterState"
              filter-placement="bottom"
            >
              <template slot-scope="scope">
                <el-tag size="medium" type="info" v-if="scope.row.auditStatus=='未上报'">未上报</el-tag>
                <el-tag size="medium" type="warning" v-else-if="scope.row.auditStatus=='待审核'">待审核</el-tag>
                <el-tag size="medium" type="danger" v-else-if="scope.row.auditStatus=='审核未通过'">审核未通过</el-tag>
                <p v-else>/</p>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="64px">
              <template scope="scope">
                <p v-if="scope.row.warnTypeSearch==9 || scope.row.warnTypeSearch==10">/</p>
                <el-button v-else class="btn" @click="handleSubmit(scope.row)">报送</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <!-- 审核通过信息 -->
      <el-col :span="9">
        <el-card class="box-card">
          <div slot="header">
            <span class="card-title">已审核信息</span>
          </div>
          <pass-table
            :passHeight="passHeight"
            :passData="passData"
            :overpostUnit="overpostUnit"
            :isLeaderUnit="isLeaderUnit"
          ></pass-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header">
            <span class="card-title">考评积分</span>
          </div>
          <div class="databox" id="mycharts-one"></div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card">
          <div slot="header">
            <span class="card-title">数据统计</span>
          </div>
          <div class="databox" style="display:flex;">
            <div class="leader-chartbox" id="mycharts-two"></div>
            <div class="leader-chartbox" id="mycharts-three"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="report-data-box">
      <report-progress
        :reportVisible.sync="reportVisible"
        :reportData="reportData"
        :laststate="laststate"
        :itemShow="itemShow"
        :workid="reid"
        :reportBasic="reportBasic"
        :fileList.sync="fileList"
        :fileArr.sync="fileArr"
        :isExport.sync="isExport"
        @getAllList-event="getProjectAll"
      ></report-progress>
    </div>

    <!-- 牵头单位推送消息 -->
    <el-dialog
      title="推送消息"
      :visible.sync="leaderNewsVisible"
      width="1000px"
      class="report-dialog"
      v-dialogDrag
    >
      <el-table
        class="tableinfo"
        empty-text="无"
        border
        height="400px"
        :data="leaderWarn"
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          prop="warnTypeSearch"
          label="类别"
          :filters="warntypes"
          :filter-method="filterTag"
          filter-placement="bottom"
          width="100px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.warnTypeSearch==1">重点项目</span>
            <span v-else-if="scope.row.warnTypeSearch==2">批交办事项</span>
            <span v-else-if="scope.row.warnTypeSearch==3">三年行动计划</span>
            <span v-else-if="scope.row.warnTypeSearch==4">现场办公会</span>
            <span v-else-if="scope.row.warnTypeSearch==7">片区督查</span>
            <span v-else-if="scope.row.warnTypeSearch==9">区级指标管理</span>
            <span v-else-if="scope.row.warnTypeSearch==10">承办单位指标管理</span>
            <span v-else-if="scope.row.warnTypeSearch==12">重点工作</span>
          </template>
        </el-table-column>
        <el-table-column prop="warnName" label="名称">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div style="max-width:300px;line-height:1.8;" slot="content">{{scope.row.warnName}}</div>
              <p
                @click="handleDetail(scope.row)"
                class="title title-ellipsis"
              >{{scope.row.warnName}}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="截止时间" prop="endTime" width="100px">
          <template slot-scope="scope">
            <p v-if="scope.row.endTime==null">/</p>
            <span v-else>{{scope.row.endTime | dateformat('YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="formstatus" label="材料报送">
          <template slot-scope="scope">
            <el-tag size="medium">
              <i class="fa mark" v-if="scope.row.formstatus==1" style="background:#fbe804;"></i>
              <i class="fa mark" v-else-if="scope.row.formstatus==2" style="background:#f00;"></i>
              <i class="fa mark" v-else-if="scope.row.formstatus== -1" style="background:#999;"></i>
              <i class="fa mark" v-else-if="scope.row.formstatus== null" style="display:none;"></i>
              <i class="fa mark" v-else></i>
              <span v-html="formstatusFormat(scope,scope.row.formstatus)"></span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalstatus" label="总体进度">
          <template slot-scope="scope">
            <el-tag size="medium">
              <i class="fa mark" v-if="scope.row.totalstatus==3" style="background:#364e98;"></i>
              <i class="fa mark" v-else-if="scope.row.totalstatus==4" style="background:#7c1d77;"></i>
              <i class="fa mark" v-else-if="scope.row.totalstatus== -1" style="background:#999;"></i>
              <i class="fa mark" v-else-if="scope.row.totalstatus== 1" style="background:#fbe804;"></i>
              <i class="fa mark" v-else-if="scope.row.totalstatus== null" style="display:none;"></i>
              <i class="fa mark" v-else></i>
              <span v-html="totalstatusFormat(scope,scope.row.totalstatus)"></span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="auditStatus"
          label="状态"
          :filters="stateTypes"
          :filter-method="filterState"
          filter-placement="bottom"
        >
          <template slot-scope="scope">
            <el-tag size="medium" type="info" v-if="scope.row.auditStatus=='未上报'">未上报</el-tag>
            <el-tag size="medium" type="warning" v-else-if="scope.row.auditStatus=='待审核'">待审核</el-tag>
            <el-tag size="medium" type="danger" v-else-if="scope.row.auditStatus=='审核未通过'">审核未通过</el-tag>
            <p v-else>/</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="64px">
          <template scope="scope">
            <p v-if="scope.row.warnTypeSearch==9 || scope.row.warnTypeSearch==10">/</p>
            <el-button v-else class="btn" @click="handleSubmit(scope.row)">报送</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="leaderNewsVisible=false" size="small" type="primary">稍后处理</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 
<script>
import echarts from "echarts";
import { upfile, imgIp } from "../../api/imgUrl";
import {
  getLeaderEarly,
  reportTerm,
  savereportInfo,
  getLeaderDatas
} from "../../api/api";
import {
  addProgress,
  addShowLasttime,
  getdetailProject
} from "../../api/projectApi";
import {
  addAssignReport,
  assignDetail,
  showAssignLasttime
} from "../../api/assignApi";
import {
  showThreeplanLasttime,
  showImportworkLasttime,
  threePlanDetail,
  addPlanReport,
  addImportworkReport,
  importWorkDetailData,
  repeatReportImportwork
} from "../../api/decisionApi";
import {
  repeatReport,
  repeatAssignReport,
  repeatThreeReport,
  getPersonAll,
  getCheckDetail,
  getLeaderCharts
} from "../../api/center";
import {
  threeUpDetail,
  threePlanDetail2,
  repeatReportDecisionUp,
  repeatReportDecisionArea
} from "../../api/workApi";
import {
  keyitemDetail,
  keyAreaDetail,
  keyWorkDetail,
  repeatReportKeywork,
  repeatReportKeyarea,
  repeatItemReport,
  addKeyworkReport,
  addKeyareaReport,
  addItemReport,
  lasttimeKeyworkProgress,
  lasttimeKeyareaProgress,
  lastKeyitemProgress
} from "../../api/threework";
import { areaViewReport, otherViewReport } from "../../api/targetApi2";
import reportProgress from "../reportItem"; //进展汇报
import passTable from "../../components/passTable"; //已审核信息table
export default {
  name: "leaderindex",
  components: {
    reportProgress,
    passTable
  },
  data() {
    return {
      isExport: { visible: true },
      leaderNewsVisible: false,
      isLeaderUnit: false,
      overpostUnit: false,
      reid: 0,
      reType: 0,
      reportVisible: { visible: false },
      fileArr: [],
      fileList: [],
      reportBasic: {},
      reportData: {},
      laststate: "",
      itemShow: 0,
      loginid: JSON.parse(this.$store.getters.userdata).id,
      leaderWarn: [], //预警信息
      passData: [], //已审核信息
      stateTypes: [
        { value: "待审核", text: "待审核" },
        { value: "未上报", text: "未上报" },
        { value: "审核未通过", text: "审核未通过" }
      ],
      // 报送类别
      warntypes: [
        { value: 1, text: "重点项目" },
        { value: 2, text: "批交办事项" },
        { value: 3, text: "三年行动计划" },
        { value: 4, text: "现场办公会" },
        { value: 7, text: "片区督查" },
        { value: 12, text: "重点工作" },
        { value: 9, text: "区级指标管理" },
        { value: 10, text: "承办单位指标管理" }
      ],
      imgIp: "",
      upfile: "",
      warnCounter: 0,
      lastCounter: 0,
      zhiHouCounter: 0,
      yanZhongCounter: 0,
      passHeight: "400px",
      nopassData: [
        { value: 0, name: "重点项目" }, // 变量对应的具体数据
        { value: 0, name: "批交办事项" },
        { value: 0, name: "三年行动计划" },
        { value: 0, name: "现场办公会" },
        { value: 0, name: "片区督查" }
      ],
      overdueData: [
        { value: 0, name: "重点项目" }, // 变量对应的具体数据
        { value: 0, name: "批交办事项" },
        { value: 0, name: "三年行动计划" },
        { value: 0, name: "现场办公会" },
        { value: 0, name: "片区督查" }
      ]
    };
  },
  created() {
    this.upfile = upfile;
    this.imgIp = imgIp;
    this.leaderYujinList();
    this.getPassList();
    this.leaderChartsData();
  },
  watch: {},
  mounted: function() {
    this.drawCharts();
    this.leaderDataList();
  },
  methods: {
    leaderChartsData() {
      getLeaderCharts({ userid: this.loginid }, data => {
        var str = data.data.obj;
        this.nopassData = [
          { value: str.proValidate, name: "重点项目" },
          { value: str.checkValidate, name: "批交办事项" },
          { value: str.threeValidate, name: "三年行动计划" },
          { value: str.liDaoValidate, name: "现场办公会" },
          { value: str.qingkuangValidate, name: "片区督查" },
          { value: str.pointValidate, name: "重点工作" }
        ];
        this.overdueData = [
          { value: str.proOver, name: "重点项目" },
          { value: str.checkOver, name: "批交办事项" },
          { value: str.threeOver, name: "三年行动计划" },
          { value: str.liDaoOver, name: "现场办公会" },
          { value: str.qingkuangOver, name: "片区督查" },
          { value: str.pointOver, name: "重点工作" }
        ];
        this.drawCharts();
      });
    },
    filterFormstatus(value, row) {
      return row.formstatus === value;
    },
    // 保存报送
    saveReport() {
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
      para.modeltype = this.itemShow;
      para.filepath = files;
      para.termid = this.reid;
      savereportInfo(para, data => {
        this.$message({
          type: "success",
          message: "保存成功"
        });
        this.isExport.visible = false;
        // this.reportVisible = false;
      });
    },
    // 报送提交
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
          para.userid = this.loginid;
          para.validate = 0;
          // 项目
          if (this.reType == 1) {
            para.projectid = this.reid;
            addProgress(para, data => {
              this.alertFuc();
              this.reportVisible = false;
            });
          } else if (this.reType == 2) {
            //批交办
            para.checkid = this.reid;
            addAssignReport(para, data => {
              this.alertFuc();
              this.reportVisible = false;
            });
          } else if (this.reType == 3) {
            //三年行动计划
            para.workid = this.reid;
            para.typemodel = 1;
            addPlanReport(para, data => {
              this.alertFuc();
              this.reportVisible = false;
            });
          } else if (this.reType == 4) {
            //领导指示分工
            para.workid = this.reid;
            para.typemodel = 2;
            addPlanReport(para, data => {
              this.alertFuc();
              this.reportVisible = false;
            });
          } else if (this.reType == 7) {
            //重要工作
            para.workid = this.reid;
            addKeyworkReport(para, data => {
              this.alertFuc();
              this.reportVisible = false;
            });
          } else if (this.reType == 8) {
            //重要片区
            para.workid = this.reid;
            addKeyareaReport(para, data => {
              this.alertFuc();
              this.reportVisible = false;
            });
          } else if (this.reType == 11) {
            // 重大项目
            para.situationid = this.reid;
            addItemReport(para, data => {
              this.alertFuc();
              this.reportVisible = false;
            });
          } else if (this.reType == 12) {
            //新 重点工作
            para.pointid = this.reid;
            addImportworkReport(para, data => {
              this.alertFuc();
              this.reportVisible = false;
            });
          }
        } else {
          return;
        }
      });
    },
    // 弹窗提示
    alertFuc() {
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
    },
    // 项目进展汇报弹窗
    projectReport() {
      // 获取上一次进展情况
      addShowLasttime({ userid: this.loginid, projectid: this.reid }, data => {
        this.laststate = data.data.obj.question;
      });
      // 项目基本信息
      this.projectDetailFuc(this.reid);
      // 判断是否重复报送
      let repa = {};
      repa.projectid = this.reid;
      repa.userid = this.loginid;
      repeatReport(repa, data => {
        if (data.data.obj == null) {
          this.isExport.visible = true;
          // 是否有保存内容
          let repara = {
            userid: this.loginid,
            termid: this.reid,
            modeltype: 1
          };
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
              this.isExport.visible = false;
              this.reportVisible = true;
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
    // 批交办报送弹窗
    assignReport() {
      // 获取上一次进展情况
      showAssignLasttime({ userid: this.loginid, checkid: this.reid }, data => {
        this.laststate = data.data.obj.question;
      });
      // 基本信息
      this.assignDetailFuc(this.reid);
      // 判断是否重复报送
      let repa = {};
      repa.checkid = this.reid;
      repa.userid = this.loginid;
      repeatAssignReport(repa, data => {
        if (data.data.obj == null) {
          this.isExport.visible = true;
          // 是否有保存内容
          let repara = {
            userid: this.loginid,
            termid: this.reid,
            modeltype: 2
          };
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
              this.isExport.visible = false;
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
              this.reportVisible = false;
            });
        }
      });
    },
    // 三年行动计划报送弹窗
    threePlanReport(type) {
      // 获取上一次进展情况
      showThreeplanLasttime(
        { userid: this.loginid, workid: this.reid, typemodel: type },
        data => {
          this.laststate = data.data.obj.question;
        }
      );
      // 基本信息
      this.threeDetailFuc(this.reid, type);
      // 判断是否重复报送
      let repa = {};
      repa.workid = this.reid;
      repa.userid = this.loginid;
      repa.typemodel = type;
      repeatThreeReport(repa, data => {
        if (data.data.obj == null) {
          this.isExport.visible = true;
          this.reportVisible.visible = true;
          // 是否有保存内容
          let repara = {
            userid: this.loginid,
            termid: this.reid,
            modeltype: this.itemShow
          };
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
              this.isExport.visible = false;
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
    // 进展基本信息
    redetailFuc(id) {
      importWorkDetailData({ pointid: id }, data => {
        this.reportBasic = data.data.obj;
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

    // 重点工作新增报送弹窗
    importworkReport() {
      // 获取上一次进展情况
      let repa = {};
      repa.pointid = this.reid;
      repa.userid = this.loginid;
      showImportworkLasttime(
        { userid: this.loginid, pointid: this.reid },
        data => {
          this.laststate = data.data.obj.question;
        }
      );
      // 基本信息
      this.redetailFuc(this.reid);
      // 判断是否重复报送
      repeatReportImportwork(repa, data => {
        if (data.data.obj == null) {
          this.isExport.visible = true;
          this.reportVisible.visible = true;
          // 是否有保存内容
          let repara = {
            userid: this.loginid,
            termid: this.reid,
            modeltype: 12
          };
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
              this.isExport.visible = false;
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
    // 项目详情
    projectDetailFuc(id) {
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
    // 批交办详情
    assignDetailFuc(id) {
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
    // 三年行动计划详情
    threeDetailFuc(id, type) {
      threePlanDetail({ workid: id, typemodel: type }, data => {
        this.reportBasic = data.data.obj.partterm;
        this.reportBasic.superdept = data.data.obj.superdept;
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
    // 向上争取工作详情
    threeUpdetailFuc(id) {
      threeUpDetail({ workid: id }, data => {
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
    // 向上报送弹窗
    decisionUpReport() {
      this.threeUpdetailFuc(this.reid);
      let repa = {};
      repa.workid = this.reid;
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
    // 我区工作详情
    threeAreadetailFuc(id) {
      threePlanDetail2({ workid: id }, data => {
        this.reportBasic = data.data.obj.decisionIArea;
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
    decisionAreaReport() {
      this.threeAreadetailFuc(this.reid);
      let repa = {};
      repa.workid = this.reid;
      repa.userid = this.loginid;
      repeatReportDecisionArea(repa, data => {
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
            modeltype: 6
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

    // 重点工作重复报送
    repeatKeywork(repa) {
      this.fileList = [];
      this.fileArr = [];
      repeatReportKeywork(repa, data => {
        if (data.data.obj == true) {
          this.isExport.visible = true;
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
            modeltype: 7
          };
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
        }
      });
    },
    // 重要片区重复报送
    repeatKeyarea(repa) {
      this.fileList = [];
      this.fileArr = [];
      repeatReportKeyarea(repa, data => {
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
    // 重大项目重复报送
    repeatKeyitem(repa) {
      this.fileList = [];
      this.fileArr = [];
      repeatItemReport(repa, data => {
        if (data.data.obj == null || data.data.obj == false) {
          this.reportVisible.visible = true;
          // 是否有保存内容
          let repara = {
            userid: this.loginid,
            termid: this.workid,
            modeltype: 9
          };
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
              this.isExport.visible = false;
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
    // 重点工作详情
    keyWorkdetailFuc(id) {
      keyWorkDetail({ workid: id }, data => {
        this.detailData = data.data.obj;
        this.reportBasic = this.detailData.tripleWorkProgress;
        this.reportBasic.yearname = this.detailData.tripleWorkProgress.year;
        this.reportBasic.leaders = this.detailData.tripleWorkProgress.dutyleadname;
        this.reportBasic.leaderDeptName = "";
        if (this.detailData.tripleWorkProgressLeadDeptList == null) {
          this.reportBasic.leaderDeptName = "";
        } else {
          var arr = this.detailData.tripleWorkProgressLeadDeptList;
          for (var i = 0; i < arr.length; i++) {
            this.reportBasic.leaderDeptName += arr[i].deptName;
          }
        }

        var leaderList = data.data.obj.tripleWorkProgressLeadDeptList;
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
    // 重要片区详情
    keyAreadetailFuc(id) {
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
    // 重大项目详情
    keyItemdetailFuc(id) {
      keyitemDetail({ id: id }, data => {
        this.detailData = data.data.obj;
        this.reportBasic = {
          projectname: this.detailData.projectname,
          timenode: this.detailData.timenode,
          yearname: this.detailData.yearname
        };
        var str = this.detailData.leadername;
        if (str == null) {
          this.reportBasic.leaders = "";
        } else {
          this.reportBasic.leaders = str.join(",");
        }
        var leaderList = data.data.obj.ldeptList;
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

    keyitemReport() {
      lastKeyitemProgress({ sid: this.reid, userid: this.loginid }, data => {
        this.laststate = data.data.obj.question;
      });
      this.keyItemdetailFuc(this.reid);
      let repa = {};
      repa.situationid = this.reid;
      repa.userid = this.loginid;
      this.repeatKeyitem(repa);
    },
    keyworkReport() {
      lasttimeKeyworkProgress({ workid: this.reid }, data => {
        if (data.data.obj == null) {
          this.laststate = "";
        } else {
          this.laststate = data.data.obj.question;
        }
      });
      this.keyWorkdetailFuc(this.reid);
      let repa = {};
      repa.workid = this.reid;
      repa.userid = this.loginid;
      this.repeatKeywork(repa);
    },
    keyareaReport() {
      lasttimeKeyareaProgress({ workid: this.reid }, data => {
        if (data.data.obj == null) {
          this.laststate = "";
        } else {
          this.laststate = data.data.obj.question;
        }
      });
      this.keyAreadetailFuc(this.reid);
      let repa = {};
      repa.workid = this.reid;
      repa.userid = this.loginid;
      this.repeatKeyarea(repa);
    },
    // 进展汇报弹窗
    handleSubmit(row) {
      this.repeatDatas();
      this.isExport.visible = true;
      this.reid = row.pid;
      this.reType = row.warnType;
      this.reportData = {};
      if (this.reType == 1) {
        // 项目
        this.itemShow = 1;
        this.projectReport();
      } else if (this.reType == 2) {
        // 批交办
        this.itemShow = 2;
        this.assignReport();
      } else if (this.reType == 3) {
        //  三年行动计划
        this.itemShow = 3;
        var typemodel = 1;
        this.threePlanReport(typemodel);
      } else if (this.reType == 4) {
        // 领导指示
        this.itemShow = 4;
        var typemodel = 2;
        this.threePlanReport(typemodel);
      } else if (this.reType == 7) {
        // 重点工作
        this.itemShow = 7;
        this.keyworkReport();
      } else if (this.reType == 8) {
        // 重要片区
        this.itemShow = 8;
        this.keyareaReport();
      } else if (this.reType == 11) {
        // 重大项目
        this.itemShow = 9;
        this.keyitemReport();
      } else if (this.reType == 12) {
        //  新增的重点工作模块
        this.itemShow = 10;
        this.importworkReport();
      }
    },
    // reset
    repeatDatas() {
      this.fileList = [];
      this.fileArr = [];
      this.reportData = {};
      this.reportBasic = {};
      this.laststate = "";
      this.reid = 0;
    },
    // 牵头单位预警信息
    leaderYujinList() {
      getLeaderEarly({ userid: this.loginid }, data => {
        this.leaderWarn = data.data.obj.warnMessage;
        if (this.leaderWarn == null || this.leaderWarn.length == 0) {
          this.leaderWarn = [];
          this.leaderNewsVisible = false;
        } else {
          this.leaderNewsVisible = true;
          for (var n = 0; n < this.leaderWarn.length; n++) {
            var wtype = this.leaderWarn[n].warnType;
            if (wtype == 4 || wtype == 5 || wtype == 6) {
              this.leaderWarn[n].warnTypeSearch = 4;
            } else if (wtype == 7 || wtype == 8 || wtype == 11) {
              this.leaderWarn[n].warnTypeSearch = 7;
            } else {
              this.leaderWarn[n].warnTypeSearch = wtype;
            }
          }
        }
      });
    },
    // 已审核信息
    getPassList() {
      let para = { userid: this.loginid };
      getPersonAll(para, data => {
        this.passData = data.data.obj.accessMessage;
        if (this.passData == null || this.passData.length == 0) {
          this.passData = [];
        } else {
          for (var i = 0; i < this.passData.length; i++) {
            var type = this.passData[i].transType;
            if (type == 6 || type == 7 || type == 8) {
              this.passData[i].transTypeSearch = 6;
            } else if (type == 9 || type == 10 || type == 11) {
              this.passData[i].transTypeSearch = 11;
            } else {
              this.passData[i].transTypeSearch = type;
            }
          }
        }
      });
    },
    leaderDataList() {
      getLeaderDatas({ userid: this.loginid }, res => {
        this.yanZhongCounter = res.data.obj.yanZhongCounter;
        this.zhiHouCounter = res.data.obj.zhiHouCounter;
        this.lastCounter = res.data.obj.lastCounter;
        this.warnCounter = res.data.obj.warnCounter;
      });
    },
    // 报送类别筛选
    filterTag(value, row) {
      return row.warnTypeSearch === value;
    },
    filterState(value, row) {
      return row.auditStatus === value;
    },
    filterPassTag(value, row) {
      return row.transTypeSearch === value;
    },
    filterPass(value, row) {
      return row.statsus === value;
    },
    // 逾期统计
    overdueCharts() {
      let myChart = echarts.init(document.getElementById("mycharts-two"));
      var _this = this;
      myChart.on("click", function(params) {
        _this.alldataVisible = true;
      });
      myChart.setOption({
        textStyle: {
          color: "#000",
          fontSize: 20 // 调节字体大小
        },
        title: {
          text: "逾期统计", // 主标题名称
          subtext: "", // 副标题名称
          x: "center" // 标题的位置
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/>{a} : {c}次"
        },
        legend: {
          x: "center", // 标签的位置
          y: "bottom",
          textStyle: {
            color: "#333",
            fontSize: 12
          },
          data: [
            "重点项目",
            "批交办事项",
            "三年行动计划",
            "现场办公会",
            "片区督查"
          ]
        }, // 标签变量名称
        calculable: true,
        color: ["#336666", "#FF9900", "#663366", "#999900", "#990033"], //自己设置扇形图颜色
        series: [
          {
            name: "逾期次数", // 图表名称
            type: "pie", // 图表类型
            radius: [20, 100], // 图表内外半径大小
            center: ["50%", "50%"], // 图表位置
            roseType: "area",
            label: {
              normal: {
                show: true,
                formatter: "{b}{c}次" // 显示百分比
              }
            },
            data: this.overdueData,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{c}次",
                  textStyle: {
                    fontSize: 12
                  }
                },
                //标线长度，宽度
                labelLine: {
                  show: true,
                  length: 10,
                  lineStyle: {
                    width: 1
                  }
                }
              }
            }
          }
        ]
      });
    },
    // 资料审核未通过
    nopassCharts() {
      let myChart = echarts.init(document.getElementById("mycharts-three"));
      myChart.setOption({
        textStyle: {
          color: "#000",
          fontSize: 20 // 调节字体大小
        },
        title: {
          text: "材料审核未通过", // 主标题名称
          subtext: "",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/>{a} : {c}个"
        },
        legend: {
          x: "center", // 标签的位置
          y: "bottom",
          textStyle: {
            color: "#333",
            fontSize: 12
          },
          data: [
            "重点项目",
            "批交办事项",
            "三年行动计划",
            "现场办公会",
            "片区督查"
          ]
        }, // 标签变量名称
        calculable: true,
        color: ["#336666", "#FF9900", "#663366", "#999900", "#990033"], //自己设置扇形图颜色
        series: [
          {
            name: "审核未通过", // 图表名称
            type: "pie", // 图表类型
            radius: [20, 100], // 图表内外半径大小
            center: ["50%", "50%"], // 图表位置
            roseType: "area",
            label: {
              normal: {
                show: true,
                formatter: "{b}{c}个" // 显示百分比
              }
            },
            data: this.nopassData,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{c}次",
                  textStyle: {
                    fontSize: 12
                  }
                },
                //标线长度，宽度
                labelLine: {
                  show: true,
                  length: 10,
                  lineStyle: {
                    width: 1
                  }
                }
              }
            }
          }
        ]
      });
    },
    // 积分charts
    integralCharts() {
      let myChart = echarts.init(document.getElementById("mycharts-one"));
      myChart.setOption({
        title: {
          x: "center",
          bottom: 50,
          subtext: "当前积分",
          subtextStyle: {
            color: "#000"
          }
        },
        tooltip: {
          show: true,
          backgroundColor: "#F7F9FB",
          borderColor: "#92DAFF",
          borderWidth: "1px",
          textStyle: {
            color: "black"
          },
          formatter: function(param) {
            return (
              '当前积分：<span style="color:' +
              param.color +
              ';">' +
              param.value +
              "</span> 分"
            );
          }
        },
        series: [
          {
            name: "信用分",
            type: "gauge",
            radius: "85%",
            min: 0,
            max: 100,
            axisLine: {
              show: true,
              lineStyle: {
                width: 30,
                shadowBlur: 0,
                color: [
                  [0.4, "#E43F3D"],
                  [0.6, "#E98E2C"],
                  [0.7, "#DDBD4D"],
                  [0.8, "#7CBB55"],
                  [1, "#999933"]
                ]
              }
            },
            axisTick: {
              show: true,
              splitNumber: 1
            },
            splitLine: {
              show: true,
              length: 30
            },
            axisLabel: {
              formatter: function(e) {
                switch (e + "") {
                  case "40":
                    return "较差";
                  case "60":
                    return "达标";
                  case "70":
                    return "良好";
                  case "80":
                    return "优秀";
                  case "100":
                    return "非常好";
                  default:
                    return e;
                }
              },
              textStyle: {
                fontSize: 12,
                fontWeight: ""
              }
            },
            pointer: {
              show: true
            },
            detail: {
              formatter: "{value}",
              offsetCenter: [0, "50%"],
              textStyle: {
                fontSize: 36
              }
            },
            data: [
              {
                name: "",
                value: 72
              }
            ]
          }
        ]
      });
    },
    drawCharts() {
      this.integralCharts();
      this.overdueCharts();
      this.nopassCharts();
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
        case null:
          return "/";
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
        case null:
          return "/";
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.leader-chartbox {
  flex: 1;
  height: 400px;
}
.leader-chartbox + .leader-chartbox {
  margin-left: 20px;
}
</style>

