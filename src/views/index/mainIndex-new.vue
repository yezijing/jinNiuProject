<template>
  <div>
    <div class="dataindex" :style="backgroundDiv" v-if="allShow">
      <h3 class="mtitle">{{systemname}}</h3>
      <el-row :gutter="20">
        <el-col :span="5">
          <div class="dbox">
            <p class="title" :style="titlebackgroundDiv">决策督查</p>
            <div class="itemlist">
              <el-select size="mini" v-model="planval" placeholder="请选择" @change="itemChange2">
                <el-option v-for="item in plans" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
            <div class="chartsbox chartsbox2" id="plandata"></div>
          </div>
          <div class="dbox">
            <p class="title" :style="titlebackgroundDiv">重点经济目标（主城区对比）</p>
            <div class="itemlist">
              <el-select size="mini" v-model="indexval" placeholder="请选择" @change="itemChange">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div class="chartsbox chartsbox2" id="contrast"></div>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="datas">
            <div class="itemwrap">
              <el-carousel
                height="113px"
                :interval="5000"
                indicator-position="none"
                :autoplay="true"
                type="card"
              >
                <el-carousel-item v-for="item in allnumber" :key="item.index">
                  <div class="item" :style="itembackgroundDiv" @click="gotoCenter">
                    <p class="n1">{{item.name}}</p>
                    <p class="num">
                      <span>{{item.number}}</span> 个
                    </p>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          <div class="map" id="map"></div>
        </el-col>
        <el-col :span="8">
          <div class="dbox mesbox">
            <p class="title" :style="titlebackgroundDiv">
              <router-link :to="{path:'/personCenter'}">预警信息</router-link>
            </p>
            <div class="tablebox">
              <el-table
                class="tableinfo tableinfo2"
                border
                :data="earlyData"
                highlight-current-row
                :cell-class-name="cellClassName"
                style="width: 100%;"
                :row-class-name="tableRowClassName"
                height="264px"
              >
                <el-table-column prop="warnName" label="名称" class-name="thname">
                  <template slot-scope="scope">
                    <el-tooltip effect="light" placement="top-start">
                      <div style="max-width:300px;line-height:2;" slot="content">
                        <p>{{scope.row.warnName}}</p>
                      </div>
                      <p
                        class="name"
                        @click="handleDetail(scope.$index, scope.row)"
                      >{{scope.row.warnName}}</p>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="warnType" label="类别">
                  <template slot-scope="scope">
                    <span class="tt" v-if="scope.row.warnType==1">重点项目</span>
                    <span class="tt" v-else-if="scope.row.warnType==2">批交办事项</span>
                    <span class="tt" v-else-if="scope.row.warnType==3">三年行动计划</span>
                    <span class="tt" v-else-if="scope.row.warnType==4">现场办公会</span>
                    <span class="tt" v-else-if="scope.row.warnType==9">区级指标管理</span>
                    <span class="tt" v-else-if="scope.row.warnType==10">承办单位指标管理</span>
                    <span class="tt" v-else-if="scope.row.warnType==7">片区督查</span>
                    <span class="tt" v-else-if="scope.row.warnType==8">片区督查</span>
                    <span class="tt" v-else-if="scope.row.warnType==11">片区督查</span>
                    <span class="tt" v-else-if="scope.row.warnType==12">重点工作</span>
                  </template>
                </el-table-column>
                <el-table-column prop="formstatus" label="材料报送">
                  <template slot-scope="scope">
                    <el-tag size="small">
                      <i class="fa mark" v-if="scope.row.formstatus==1" style="background:#fbe804;"></i>
                      <i
                        class="fa mark"
                        v-else-if="scope.row.formstatus==2"
                        style="background:#f00;"
                      ></i>
                      <i
                        class="fa mark"
                        v-else-if="scope.row.formstatus== -1"
                        style="background:#999;"
                      ></i>
                      <i class="fa mark" v-else></i>
                      <span v-html="formstatusFormat(scope,scope.row.formstatus)"></span>
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="totalstatus" label="总体进度">
                  <template slot-scope="scope">
                    <el-tag size="small">
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
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="flexbox">
            <div class="dbox nodbox" style="flex:1">
              <p class="title" :style="titlebackgroundDiv">
                <router-link :to="{path:'/projectList'}">重点项目</router-link>
              </p>
              <div class="chartsbox" id="project-charts"></div>
            </div>
            <div class="dbox nodbox" style="flex:1">
              <p class="title" :style="titlebackgroundDiv">
                <router-link :to="{path:'/assignList'}">批交办事项</router-link>
              </p>
              <div class="chartsbox" id="matter-charts"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 推送消息 -->
    <el-dialog
      title="推送消息"
      :visible.sync="lastestVisible"
      width="1000px"
      class="report-dialog"
      v-dialogDrag
    >
      <el-table
        class="tableinfo"
        border
        :data="newsData"
        highlight-current-row
        style="width: 100%;"
        height="400px"
      >
        <el-table-column prop="reportdept" label="报送单位"></el-table-column>
        <el-table-column
          prop="pushTypeSearch"
          label="报送类别"
          :filters="watypes"
          :filter-method="filterTagMessage"
          filter-placement="bottom"
        >
          <template slot-scope="scope">
            <span v-html="bstypeFormat(scope,scope.row.pushTypeSearch)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="pushName" label="名称">
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="top-start">
              <div style="max-width:300px;line-height:2;" slot="content">
                <p>{{scope.row.pushName}}</p>
              </div>
              <p class="title-ellipsis">{{scope.row.pushName}}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="formstatus" label="材料报送">
          <template slot-scope="scope">
            <el-tag size="medium">
              <i class="fa mark" v-if="scope.row.formstatus==1" style="background:#fbe804;"></i>
              <i class="fa mark" v-else-if="scope.row.formstatus==2" style="background:#f00;"></i>
              <i class="fa mark" v-else-if="scope.row.formstatus== -1" style="background:#999;"></i>
              <i class="fa mark" v-else-if="scope.row.totalstatus== null" style="display:none;"></i>
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
              <i class="fa mark" v-else-if="scope.row.totalstatus== null" style="display:none;"></i>
              <i class="fa mark" v-else></i>
              <span v-html="totalstatusFormat(scope,scope.row.totalstatus)"></span>
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleNow()" size="small" v-if="nowChuli" type="primary">现在处理</el-button>
        <el-button @click="lastestVisible=false" size="small" type="primary">稍后处理</el-button>
      </div>
    </el-dialog>
    <!-- 牵头单位显示 -->
    <div class="leader-unit" v-if="leaderShow">
      <leader-index :upfile="upfile" :reportVisible.sync="reportVisible"></leader-index>
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
        <el-button @click="saveReport()" size="small" type="primary">保 存</el-button>
        <el-button @click="submitReport()" size="small" type="primary">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import {
  indexData,
  indexnameData,
  getDatabyChange,
  getEcoData,
  getAllNumber,
  getMapData,
  getworkDatas,
  reportTerm,
  savereportInfo
} from "../../api/api";
import { upfile, imgIp } from "../../api/imgUrl";
import {
  getPersonAll,
  getCheckDetail,
  passChange,
  getNewslist,
  repeatReport,
  repeatAssignReport,
  repeatThreeReport
} from "../../api/center";
import { addAssignReport, assignDetail } from "../../api/assignApi";
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
  repeatItemReport
} from "../../api/threework";
import {
  addProgress,
  addShowLasttime,
  getdetailProject
} from "../../api/projectApi";
import {
  showThreeplanLasttime,
  showImportworkLasttime,
  threePlanDetail,
  addPlanReport,
  addImportworkReport,
  importWorkDetailData,
  repeatReportImportwork
} from "../../api/decisionApi";
import leaderIndex from "./leaderIndex"; //牵头单位角色首页显示
import reportContent from "../report"; //进展汇报
import echarts from "echarts";
require("echarts/theme/macarons");
require("echarts/theme/dark");
export default {
  name: "index",
  components: {
    leaderIndex,
    reportContent
  },
  data() {
    return {
      nowChuli: true,
      laststate: "",
      itemShow: 0, //类别
      reportid: -1, //保存id
      reportBasic: {}, //基本信息
      allShow: false,
      leaderShow: true,
      loginid: JSON.parse(this.$store.getters.userdata).id,
      roleType: JSON.parse(this.$store.getters.userdata).roleType,
      systemname: JSON.parse(this.$store.getters.systemInfo).setname,
      isfirst: this.$store.state.isfirst, //消息弹窗点击现在处理后不再显示弹窗控制
      lastestVisible: false,
      backgroundDiv: {
        backgroundImage: "url(" + require("../../assets/bg2.png") + ")"
      },
      itembackgroundDiv: {
        backgroundImage: "url(" + require("../../assets/bg3.png") + ")"
      },
      titlebackgroundDiv: {
        backgroundImage: "url(" + require("../../assets/bg4.png") + ")"
      },
      earlyData: [],
      options: [],
      plans: [
        { id: 1, name: "三年行动计划" },
        { id: 2, name: "现场办公会" },
        { id: 3, name: "片区督查" }
      ],
      econmicData: [],
      indexval: "1",
      planval: 1,
      chartColumn: null,
      chartBar: null,
      chartLine: null,
      chartPie: null,
      myChart: "",
      projectStatus: "",
      projectSum: 0, //项目总数
      projectEnd: 0, //项目完结个数
      projectNormal: 0, //正常项目个数
      projectWarn: 0, //预警项目个数
      projectPost: 0, //逾期项目个数
      projectZhiHou: 0, //项目滞后
      projectYanZhong: 0, //项目严重滞后
      projectCommon: 0, //一般项目个数
      projectKey: 0, //重点项目个数
      meetSum: 0, //批交办总数
      meetEnd: 0, //批交办完结
      meetNormal: 0, //批交办正常
      meetWarn: 0, //批交办预警
      meetPost: 0, //批交办逾期
      meetZhiHou: 0, //批交办滞后
      meetYanZhong: 0, //批交办严重滞后
      projectDatas: [],
      meetDatas: [],
      projectTypes: [],
      assignStatus: "",
      planStatus: "",
      planSum: 0, //三年计划总数
      planEnd: 0, //三年计划完结
      planNormal: 0, //三年计划正常
      planWarn: 0, //三年计划预警
      planPost: 0, //三年计划逾期
      planZhiHou: 0, //三年计划滞后
      planYanZhong: 0, //三年计划严重滞后
      indexType: 0, //指标类型
      typename: "", //目标管理y轴单位
      planDatas: [],
      reportVisible: false,
      reportData: {},
      fileList: [],
      fileArr: [],
      filepath: [],
      upfile: "",
      imgIp: "",
      selfCommit: [
        { value: 0, name: "正常" },
        { value: 1, name: "滞后" },
        { value: 2, name: "严重滞后" }
      ],
      isShowProject: false, //是否显示项目信息
      isShowMeet: false, //是否显示批交办
      isShowThreePartterm: false, //是否显示决策督查
      isShowTarget: false, //是否显示目标管理
      fileArr: [], //项目上传附件list
      fileArr2: [], //批交办上传附件list
      postUnit: true, //是否显示报送单位，区委办角色显示报送单位，牵头单位角色不需要报送单位
      newsData: [],
      boxheight: "",
      width: "50%",
      allindexDatas: [], //经济指标数据（全年目标）
      mapChart: null,
      coverProject: [],
      geoCoordMap: {},
      isCenter: 1,
      allnumber: [
        {
          name: "待审核",
          number: ""
        },
        {
          name: "预警",
          number: ""
        },
        {
          name: "逾期",
          number: ""
        },
        {
          name: "滞后",
          number: ""
        },
        {
          name: "严重滞后",
          number: ""
        }
      ],
      reid: 0,
      reType: 0,
      //预警类别
      watypes: [
        { value: 1, text: "重点项目" },
        { value: 2, text: "批交办事项" },
        { value: 3, text: "三年行动计划" },
        { value: 4, text: "现场办公会" },
        { value: 7, text: "片区督查" },
        { value: 12, text: "重点工作" },
        { value: 9, text: "区级指标管理" },
        { value: 10, text: "承办单位指标管理" }
      ]
    };
  },
  mounted: function() {
    this.selfAdaption();
  },
  created: function() {
    if (this.roleType == 1) {
      this.allShow = true;
      this.leaderShow = false;
      this.nowChuli = true;
      this.getnewsData();
    } else {
      this.allShow = false;
      this.leaderShow = true;
      this.nowChuli = false;
      this.lastestVisible = false;
    }
    this.upfile = upfile;
    this.imgIp = imgIp;
    this.getmapList();
    this.getAllNumberList();
    this.getAllList();
    this.browerHeight();
    this.getIndexList();
    this.getIndexData();
    this.getEcoDatas();
    this.getWorkdata();
  },
  updated: function() {},
  watch: {
    //观察option的变化
  },
  methods: {
    filterTagMessage(value, row) {
      return row.pushTypeSearch === value;
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
        this.reportVisible = false;
      });
    },
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
          }
        } else {
          return;
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
      });
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
              this.reportVisible = false;
            });
        }
      });
    },
    // 批交办报送弹窗
    assignReport() {
      // 基本信息
      this.assignDetailFuc(this.reid);
      // 判断是否重复报送
      let repa = {};
      repa.checkid = this.reid;
      repa.userid = this.loginid;
      repeatAssignReport(repa, data => {
        if (data.data.obj == null) {
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
    repeatDatas() {
      this.filepath = [];
      this.fileList = [];
      this.fileArr = [];
      this.reportData = {};
      this.reportBasic = {};
      this.laststate = "";
      this.reid = 0;
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
          this.reportVisible = true;
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
              this.reportVisible = false;
            });
        }
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
        }
      });
    },
    // 重大项目重复报送
    repeatKeyitem(repa) {
      this.fileList = [];
      this.fileArr = [];
      repeatItemReport(repa, data => {
        if (data.data.obj == null || data.data.obj == false) {
          this.reportData.userid = this.loginid;
          this.reportVisible = true;
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
              this.reportVisible = false;
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
      });
    },
    // 重大项目详情
    keyItemdetailFuc(id) {
      keyitemDetail({ id: id }, data => {
        this.detailData = data.data.obj;
        this.reportBasic = {
          projectname: this.detailData.projectname,
          timenode: this.detailData.timenode,
          yearname: this.detailData.year
        };
        var str = this.detailData.leadername;
        if (str == null) {
          str = "";
          this.reportBasic.leaders = "";
        } else {
          var reg = /,$/gi;
          str = str.replace(reg, "");
          this.reportBasic.leaders = str;
        }
      });
    },

    keyitemReport() {
      this.keyItemdetailFuc(this.reid);
      let repa = {};
      repa.workid = this.reid;
      repa.userid = this.loginid;
      this.repeatKeyitem(repa);
    },
    keyworkReport() {
      this.keyWorkdetailFuc(this.reid);
      let repa = {};
      repa.workid = this.reid;
      repa.userid = this.loginid;
      this.repeatKeywork(repa);
    },
    keyareaReport() {
      this.keyAreadetailFuc(this.reid);
      let repa = {};
      repa.workid = this.reid;
      repa.userid = this.loginid;
      this.repeatKeyarea(repa);
    },
    // 进展汇报弹窗
    handleSubmit(row) {
      this.repeatDatas();
      this.reid = row.bigid;
      this.reType = row.pushType;
      if (this.reType == 1) {
        this.itemShow = 1;
        this.projectReport();
      } else if (this.reType == 2) {
        this.itemShow = 2;
        this.assignReport();
      } else if (this.reType == 3) {
        this.itemShow = 3;
        var typemodel = 1;
        this.threePlanReport(typemodel);
      } else if (this.reType == 4) {
        this.itemShow = 4;
        var typemodel = 2;
        this.threePlanReport(typemodel);
      } else if (this.reType == 5) {
        // 向上
        this.itemShow = 5;
        this.decisionUpReport();
      } else if (this.reType == 6) {
        // 我区
        this.itemShow = 6;
        this.decisionAreaReport();
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
      }
    },
    // 点击进入个人中心
    gotoCenter() {
      this.$router.push({
        path: "/personCenter"
        // query: { projectId: row.pid }
      });
    },
    load() {
      this.allindexDatas += 2;
    },
    // 获取经纬度
    getmapList() {
      let para = { userid: this.loginid };
      getMapData(para, data => {
        this.coverProject = [];
        this.geoCoordMap = {};
        var datas = data.data.obj;
        if (datas == null) {
          this.coverProject = [];
          this.geoCoordMap = {};
        } else {
          for (var i = 0; i < datas.length; i++) {
            var obj = {};
            obj.name = datas[i].pname;
            if (datas[i].ptype == 1) {
              obj.value = 2;
            } else {
              obj.value = 0;
            }
            obj.address = datas[i].paddress;
            obj.pid = datas[i].pid;
            this.coverProject.push(obj);
            if (datas[i].mapitude == null) {
              this.geoCoordMap[datas[i].pname] = [];
            } else {
              var arr = [];
              arr = datas[i].mapitude.split(",");
              this.geoCoordMap[datas[i].pname] = [
                Number(arr[0]),
                Number(arr[1])
              ];
            }
          }
        }
      });
    },
    // 总数据展示
    getAllNumberList() {
      let para = { userid: this.loginid };
      getAllNumber(para, data => {
        this.allnumber[0].number = data.data.obj.toAuditCount;
        this.allnumber[1].number = data.data.obj.warnFormCount;
        this.allnumber[2].number = data.data.obj.yuQiFormCount;
        this.allnumber[3].number = data.data.obj.zhiHouTotalCount;
        this.allnumber[4].number = data.data.obj.yanZhongTotalCount;
      });
    },
    // 经济指标全年指标
    getEcoDatas() {
      getEcoData("", data => {
        var datas = data.data.obj.datas;
        // this.allindexDatas
        for (let i = 0; i < datas.length; i++) {
          let obj = {};
          let num = "";
          let rate = "";
          if (datas[i].economicType == 1) {
            num = datas[i].amplify;
          } else {
            num = datas[i].amount;
          }
          rate = (num / datas[i].cytarget) * 100;
          let number = (num / datas[i].cytarget) * 100;
          number = number.toFixed(2);
          if (rate >= 100) {
            rate = 100;
          }
          obj = {
            name: datas[i].economicName,
            rate: rate + "%",
            number: number
          };
          this.allindexDatas.push(obj);
        }
      });
    },
    // 不同状态标识
    cellClassName({ row, column }) {
      let status = row.warnStatus;
      switch (status) {
        case 1:
          return "yellow";
          break;
        case 2:
          return "red";
          break;
      }
    },
    // 预警信息列表
    getAllList() {
      let para = { userid: this.loginid };
      getPersonAll(para, data => {
        this.earlyData = data.data.obj.warnMessage;
        // this.earlyData = this.earlyData.concat(this.earlyData)
        // this.earlyData = this.earlyData.concat(this.earlyData)
      });
    },
    handleDetail(index, row) {
      if (row.warnType == 1) {
        //项目
        this.$router.push({
          path: "/projectList",
          query: { projectId: row.pid, isCenter: 1 }
        });
      } else if (row.warnType == 2) {
        //批交办
        this.$router.push({
          path: "/assignList",
          query: { checkid: row.pid, isCenter: 1 }
        });
      } else if (row.warnType == 3) {
        // 三年行动计划
        this.$router.push({
          path: "/decision2",
          query: { workid: row.pid, isCenter: 1 }
        });
      } else if (row.warnType == 4) {
        // 领导指示分工
        this.$router.push({
          path: "/working",
          query: {
            workid: row.pid,
            isWorkShow: true,
            isWorkShow2: false,
            isWorkShow3: false,
            activeClass: 0,
            isCenter: 1,
            sortnum: 0
          }
        });
      }
    },
    filterTag(value, row) {
      return row.statsus === value;
    },
    // 获取推送消息列表
    getnewsData() {
      if (this.isfirst) {
        let para = { userid: this.loginid };
        getNewslist(para, data => {
          if (data.data.obj == null || data.data.obj.length == 0) {
            this.lastestVisible = false;
          } else {
            this.newsData = data.data.obj;
            for (var n = 0; n < this.newsData.length; n++) {
              this.newsData[n].pushTypeSearch = this.newsData[n].pushType;
              if (this.newsData[n].pushType == 4) {
                this.newsData[n].pushTypeSearch = 4;
              } else if (
                this.newsData[n].pushType == 7 ||
                this.newsData[n].pushType == 5 ||
                this.newsData[n].pushType == 6
              ) {
                this.newsData[n].pushTypeSearch = 7;
              }
            }
            this.lastestVisible = true;
            this.isFirst = false;
          }
        });
      } else {
        this.lastestVisible = false;
      }
    },
    // 报送类别
    bstypeFormat(scope, value) {
      switch (value) {
        case 1:
          return "重点项目";
          break;
        case 2:
          return "批交办事项";
          break;
        case 3:
          return "三年行动计划";
          break;
        case 4:
          return "现场办公会";
          break;
        case 7:
          return "片区督查";
          break;
        case 9:
          return "区级指标";
          break;
        case 10:
          return "承办单位指标";
          break;
        case 12:
          return "重点工作";
          break;
      }
    },
    // 事务状态
    swstateFormat(scope, value) {
      switch (value) {
        case 2:
          return "审核通过";
          break;
        case 1:
          return "审核未通过";
          break;
        case 0:
          return "已上报待审核";
          break;
        case -1:
          return "未上报";
          break;
      }
    },
    // 现在处理
    handleNow() {
      this.$router.push({
        path: "/personCenter"
      });
      this.$store.state.isfirst = false;
    },
    tableRowClassName({ row, rowIndex }) {
      switch (row.formstatus) {
        case 0:
          return "nobaosong";
          break;
        case -1:
          return "nobaosong";
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
    },
    itemChange() {
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].id == this.indexval) {
          this.indexType = this.options[i].type;
          break;
        }
      }
      if (this.indexType == 1) {
        this.typename = "增幅（%）";
      } else {
        this.typename = "绝对量";
      }
      let para = { economicid: this.indexval };
      getDatabyChange(para, data => {
        this.econmicData = data.data.obj;
        this.contrastChart();
      });
    },
    // 获取指标列表
    getIndexList() {
      let para = { userId: this.loginid };
      indexnameData(para, data => {
        this.options = data.data.obj;
        this.indexval = this.options[0].id;
        this.indexType = this.options[0].type;
        if (this.indexType == 1) {
          this.typename = "增幅（%）";
        } else {
          this.typename = "绝对量";
        }
      });
    },
    getWorkdata() {
      getworkDatas({ type: 1, userid: this.loginid }, data => {
        this.worksData = data.data.obj;
        this.plandataChart();
      });
    },
    // 获取数据
    getIndexData: function() {
      let para = { userid: this.loginid };
      indexData(para, data => {
        let nums = data.data.obj;
        if (nums.isShowProject == 0) {
          this.isShowProject = false;
        } else {
          this.isShowProject = true;
        }
        if (nums.isShowMeet == 0) {
          this.isShowMeet = false;
        } else {
          this.isShowMeet = true;
        }
        if (nums.isShowThreePartterm == 0) {
          this.isShowThreePartterm = false;
        } else {
          this.isShowThreePartterm = true;
        }
        if (nums.isShowTarget == 0) {
          this.isShowTarget = false;
        } else {
          this.isShowTarget = true;
        }
        this.econmicData = nums.dataList;
        this.projectSum = nums.projectSum;
        this.projectEnd = nums.projectEnd;
        this.projectNormal = nums.projectNormal;
        this.projectWarn = nums.projectWarn;
        this.projectPost = nums.projectPost;
        this.projectZhiHou = nums.projectZhiHou;
        this.projectYanZhong = nums.projectYanZhong;

        this.meetSum = nums.meetSum;
        this.meetEnd = nums.meetEnd;
        this.meetNormal = nums.meetNormal;
        this.meetWarn = nums.meetWarn;
        this.meetPost = nums.meetPost;
        this.meetZhiHou = nums.meetZhiHou;
        this.meetYanZhong = nums.meetYanZhong;
        this.projectCommon = nums.projectCommon;
        this.projectKey = nums.projectKey;
        this.planSum = nums.threeParttermSum;
        this.planEnd = nums.threeParttermEnd;
        this.planNormal = nums.threeParttermNormal;
        this.planWarn = nums.threeParttermWarn;
        this.planPost = nums.threeParttermPost;
        this.planZhiHou = nums.threeParttermZhiHou;
        this.planYanZhong = nums.threeParttermYanZhong;
        this.projectDatas = [
          { value: this.projectEnd, name: "完结" },
          { value: this.projectNormal, name: "正常" },
          { value: this.projectZhiHou, name: "滞后" },
          { value: this.projectYanZhong, name: "严重滞后" }
        ];
        this.meetDatas = [
          { value: this.meetEnd, name: "完结" },
          { value: this.meetNormal, name: "正常" },
          { value: this.meetZhiHou, name: "滞后" },
          { value: this.meetYanZhong, name: "严重滞后" }
        ];
        this.planDatas = [
          { value: this.planEnd, name: "完结" },
          { value: this.planNormal, name: "正常" },
          { value: this.planZhiHou, name: "滞后" },
          { value: this.planYanZhong, name: "严重滞后" }
        ];
        this.projectTypes = [
          { value: this.projectCommon, name: "一般项目" },
          { value: this.projectKey, name: "重点项目" }
        ];
        this.drawCharts();
      });
    },
    // 项目数据
    projectChart() {
      this.chartPie = echarts.init(
        document.getElementById("project-charts"),
        "macarons"
      );
      var _this = this;
      this.chartPie.on("click", function(params) {
        let name = params.data.name;
        if (name == "完结") {
          this.projectStatus = -1;
        } else if (name == "逾期") {
          this.projectStatus = 2;
        } else if (name == "预警") {
          this.projectStatus = 1;
        } else if (name == "正常") {
          this.projectStatus = 0;
        } else if (name == "滞后") {
          this.projectStatus = 3;
        } else if (name == "严重滞后") {
          this.projectStatus = 4;
        }
        _this.$router.push({
          path: "/projectList",
          query: { pstatus: this.projectStatus }
        });
      });

      this.chartPie.setOption({
        title: {
          text: this.projectSum + "个",
          left: "center",
          top: "55%",
          textStyle: {
            fontSize: 18,
            fontWeight: "normal",
            color: ["#10d1ea"]
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}个 ({d}%)"
        },
        series: [
          {
            name: "项目信息",
            type: "pie",
            minAngle: 5,
            avoidLabelOverlap: false,
            radius: ["40%", "60%"],
            center: ["50%", "60%"],
            data: this.projectDatas,
            labelLine: {
              normal: {
                length: 8,
                length2: 3,
                smooth: true
              }
            },
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = ["#999", "#078182", "#364e98", "#7c1d77"];
                  return colorList[params.dataIndex];
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    // 批交办事项
    taskChart() {
      this.chartPie = echarts.init(
        document.getElementById("matter-charts"),
        "macarons"
      );
      var _this = this;
      this.chartPie.on("click", function(params) {
        _this.$router.push({ path: "/assignList" });
      });

      this.chartPie.on("click", function(params) {
        let name = params.data.name;
        if (name == "完结") {
          this.assignStatus = -1;
        } else if (name == "严重滞后") {
          this.assignStatus = 4;
        } else if (name == "滞后") {
          this.assignStatus = 3;
        } else if (name == "正常") {
          this.assignStatus = 0;
        }
        _this.$router.push({
          path: "/assignList",
          query: { astatus: this.assignStatus }
        });
      });
      this.chartPie.setOption({
        title: {
          text: this.meetSum + "项",
          left: "center",
          top: "55%",
          textStyle: {
            fontSize: 18,
            fontWeight: "normal",
            color: ["#10d1ea"]
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}个 ({d}%)"
        },
        series: [
          {
            name: "批交办事项",
            type: "pie",
            minAngle: 5,
            avoidLabelOverlap: false,
            radius: ["40%", "60%"],
            center: ["50%", "60%"],
            data: this.meetDatas,
            labelLine: {
              normal: {
                length: 8,
                length2: 3,
                smooth: true
              }
            },
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = ["#999", "#078182", "#364e98", "#7c1d77"];
                  return colorList[params.dataIndex];
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    itemChange2() {
      let para = { type: this.planval, userid: this.loginid };
      getworkDatas(para, data => {
        this.worksData = data.data.obj;
        this.plandataChart();
      });
    },
    // 决策督查数据
    plandataChart() {
      this.chartPie = echarts.init(
        document.getElementById("plandata"),
        "macarons"
      );
      var seriesLabel = {
        normal: {
          show: true,
          textBorderColor: "#1890ff ",
          textBorderWidth: 1
        }
      };
      this.chartPie.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        xAxis: {
          type: "category",
          data: ["正常", "预警", "逾期", "滞后", "严重滞后"],
          axisLabel: {
            interval: 0,
            rotate: 40
          },
          splitLine: {
            lineStyle: {
              color: "#063374"
            }
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}"
          },
          splitLine: {
            lineStyle: {
              color: "#063374"
            }
          }
        },
        series: [
          {
            name: "个数",
            type: "bar",
            data: this.worksData,
            label: seriesLabel,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#00b0ff" },
                  { offset: 0.8, color: "#7052f4" }
                ])
              }
            }
          }
        ]
      });
    },
    // 重点经济指标对比
    contrastChart() {
      this.chartPie = echarts.init(
        document.getElementById("contrast"),
        "macarons"
      );
      var seriesLabel = {
        normal: {
          show: true,
          textBorderColor: "#1890ff ",
          textBorderWidth: 1
        }
      };
      this.chartPie.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: 60
        },
        xAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}"
          },
          splitLine: {
            lineStyle: {
              color: "#063374"
            }
          }
        },
        yAxis: {
          type: "category",
          inverse: true,
          data: ["金牛区", "锦江区", "成华区", "青羊区", "武侯区"],
          splitLine: {
            lineStyle: {
              color: "#063374"
            }
          },
          axisLabel: {
            // formatter: function(value) {
            //   return "{" + value + "| }\n{value|" + value + "}";
            // },
            margin: 20,
            rich: {
              value: {
                lineHeight: 30,
                align: "center"
              },
              jinniu: {
                align: "center"
              },
              wuhou: {
                align: "center"
              },
              qingyang: {
                align: "center"
              },
              chenghua: {
                align: "center"
              },
              jinjiang: {
                align: "center"
              }
            }
          }
        },
        series: [
          {
            name: "指标 ",
            type: "bar",
            data: this.econmicData,
            label: seriesLabel,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#52cce3" },
                  { offset: 0.5, color: "#ab5aff" }
                ])
              }
            },
            markPoint: {
              symbolSize: 1,
              symbolOffset: [0, "50%"],
              label: {
                normal: {
                  formatter: "{a|{a}\n}{b|{b} }{c|{c}}",
                  backgroundColor: "rgb(242,242,242)",
                  borderColor: "#999",
                  borderWidth: 1,
                  borderRadius: 4,
                  padding: [4, 10],
                  lineHeight: 26,
                  position: "right",
                  distance: 20,
                  rich: {
                    a: {
                      align: "center",
                      color: "#fff",
                      fontSize: 18,
                      textShadowBlur: 2,
                      textShadowColor: "#000",
                      textShadowOffsetX: 0,
                      textShadowOffsetY: 1,
                      textBorderColor: "#333",
                      textBorderWidth: 2
                    },
                    b: {
                      color: "#333"
                    },
                    c: {
                      color: "#ff8811",
                      textBorderColor: "#000",
                      textBorderWidth: 1,
                      fontSize: 22
                    }
                  }
                }
              }
            }
          }
        ]
      });
    },
    mapCharts() {
      var geoCoordMap = this.geoCoordMap;
      // 将坐标与值对应并反映在地图上
      var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord.length == 0) {
          } else {
            res.push({
              name: data[i].name,
              address: data[i].address,
              pid: data[i].pid,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
        return res;
      };

      this.mapChart = echarts.init(document.getElementById("map"));
      var option = (option = {
        tooltip: {
          show: true,
          trigger: "item",
          formatter: function(params) {
            if (params.data.address == null) {
              return params.name;
            } else {
              return params.name + "<br/>" + params.data.address;
            }
          }
        },
        visualMap: {
          show: true,
          type: "piecewise",
          left: "center",
          orient: "horizontal",
          textStyle: {
            color: "#fff"
          },
          pieces: [
            { min: 1, label: "重点项目", color: "#ffde00" },
            { min: 0, max: 0, label: "一般项目", color: "#f2595b" }
          ],
          color: ["#ffde00", "#f2595b"]
        },
        geo: {
          map: "jinniu",
          label: {
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: "#0e2a40",
              borderColor: "#10d1ea",
              borderWidth: 1
            },
            label: {
              show: true, //省份是否显示
              textStyle: {
                color: "#fff" //省份字体颜色
              }
            },
            emphasis: {
              areaColor: "#0e2a40" //hover
            }
          },
          regions: [
            {
              name: "金牛区",
              itemStyle: {
                normal: {
                  areaColor: "#0e2a40",
                  color: "#0e2a40"
                }
              }
            }
          ]
        },
        series: [
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            data: convertData(this.coverProject), //覆盖数据
            symbolSize: 12,
            rippleEffect: {
              brushType: "stroke"
            },
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            showEffectOn: "render",
            itemStyle: {
              emphasis: {
                borderColor: "#fff",
                borderWidth: 1
              }
            }
          }
        ]
      });
      this.mapChart.setOption(option, true);

      var _this = this;
      this.mapChart.off("click"); //点击事件之前，要释放之前的点击事件
      this.mapChart.on("click", function(params) {
        scatterClick(params);
      });

      //散点点击事件
      function scatterClick(params) {
        _this.$router.push({
          path: "/projectList",
          query: { projectId: params.data.pid }
        });
      }
    },
    // echart自适应
    selfAdaption() {
      const that = this;
      setTimeout(() => {
        window.onresize = function() {
          // 重点项目
          that.chart = echarts.init(document.getElementById("project-charts"));
          that.chart.resize();
          // 批交办事项
          that.chart2 = echarts.init(document.getElementById("matter-charts"));
          that.chart2.resize();
          // 重点经济指标对比
          that.chart3 = echarts.init(document.getElementById("contrast"));
          that.chart3.resize();
          // 地图
          that.chart4 = echarts.init(document.getElementById("map"));
          that.chart4.resize();
          // 决策督查
          that.chart5 = echarts.init(document.getElementById("plandata"));
          that.chart5.resize();
        };
      }, 10);
    },
    drawCharts() {
      // 数据对比
      this.contrastChart();
      this.plandataChart();
      this.mapCharts();
      // 重点项目
      if (this.isShowProject == true) {
        this.projectChart();
      }
      // 批交办事项
      if (this.isShowMeet == true) {
        this.taskChart();
      }
      if (this.isShowThreePartterm == true) {
        // this.keyCharts();
      }
      if (this.isShowTarget == true) {
        // this.targetChart();
      }
    },
    browerHeight() {
      var bheight = document.body.clientHeight;
      this.boxheight = bheight + "px";
    }
  }
};
</script>

<style lang="scss">
.dataindex {
  background-color: #000b1f;
  background-repeat: no-repeat;
  background-size: auto 90px;
  background-position: center top;
  padding: 0 20px 20px;
  margin: -10px;
  .tablebox {
    margin-top: 20px;
    .tableinfo2 {
      border: 1px solid rgba(16, 209, 234, 0.5);
      background: transparent;
      .name {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 12px;
        color: #10d1ea;
        text-align: left;
        cursor: pointer;
      }
      .el-table__body {
        width: 100% !important;
      }
      .el-table__empty-text {
        color: #10d1ea;
      }
      td {
        background: #000b1f;
        border-right: 1px solid rgba(16, 209, 234, 0.5);
        border-bottom: 1px solid rgba(16, 209, 234, 0.5);
        font-size: 12px;
        padding: 8px 0;
        .cell {
          p {
            color: #10d1ea;
            font-size: 12px;
          }
        }
      }
      th {
        background: #000b1f;
        color: #10d1ea;
        .cell {
          word-break: break-all;
          font-size: 12px;
        }
      }
      th.gutter {
        width: 3px !important;
        border-bottom: 1px solid rgba(16, 209, 234, 0.5);
      }
      th.is-leaf {
        border-color: rgba(16, 209, 234, 0.5);
      }
      th.thname {
        .cell {
          text-align: left;
        }
      }
      .tt {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 12px;
        color: #10d1ea;
        text-align: center;
        cursor: pointer;
      }
    }
    //滚动条的宽度
    ::-webkit-scrollbar {
      width: 17px;
      height: 17px;
      background: rgba(16, 209, 234, 0.3);
    }
    //滚动条的滑块
    ::-webkit-scrollbar-thumb {
      background-color: #10d1ea;
    }
    .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
    .el-table__body tr.current-row > td,
    .el-table__body tr.hover-row.current-row > td,
    .el-table__body tr.hover-row.el-table__row--striped.current-row > td,
    .el-table__body tr.hover-row.el-table__row--striped > td,
    .el-table__body tr.hover-row > td {
      background: #000b1f;
    }
    .el-table--striped .el-table__body tr:hover td,
    .el-table__body tr:hover > td,
    .el-table__body tr:hover > td,
    .el-table__body tr:hover > td,
    .el-table__body tr:hover > td,
    .el-table__body tr:hover > td {
      background: #000b1f;
    }
    .tableinfo2::before {
      display: none;
    }
    .tableinfo2::after {
      display: none;
    }
  }
  .el-table th > .cell.highlight {
    color: #fff;
  }
  .el-table__column-filter-trigger i {
    color: #fff;
    font-size: 14px;
    margin-left: 5px;
  }
  .mtitle {
    font-size: 36px;
    text-align: center;
    color: #10d1ea;
    font-family: "黑体";
    height: 90px;
    line-height: 90px;
    background-image: -webkit-linear-gradient(bottom, #10d1ea, #8de8f3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 10px;
  }
  .map {
    height: 584px;
  }
  .ptitle {
    color: #10d1ea;
    font-size: 24px;
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 34px;
    background-repeat: no-repeat;
    background-position: left center;
    margin-top: 30px;
    a {
      color: #10d1ea;
    }
  }
  .dbox {
    padding: 20px;
    border: 1px solid #10d1ea;
    // margin-bottom: 20px;
    // -webkit-box-shadow: inset 0px 0px 20px 4px rgba(28, 50, 161, 0.5);
    // -moz-box-shadow: inset 0px 0px 20px 4px rgba(28, 50, 161, 0.5);
    box-shadow: inset 0px 0px 20px 4px rgba(28, 50, 161, 0.5);
    .title {
      color: #10d1ea;
      font-size: 16px;
      margin-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-left: 34px;
      background-repeat: no-repeat;
      background-position: left center;
      a {
        color: #10d1ea;
      }
    }
    .title2 {
      color: #10d1ea;
      font-size: 14px;
      text-align: right;
      margin-bottom: 20px;
    }
    .itemlist {
      margin-top: 15px;
      text-align: right;
      .el-select {
        border: 1px solid rgba(17, 208, 234, 0.4);
        .el-input .el-select__caret {
          color: #10d1ea;
        }
      }
      .el-input__inner {
        border: 0;
        background: transparent;
        color: #10d1ea;
      }
      .el-input__prefix,
      .el-input__suffix {
        color: #10d1ea;
      }
    }
    .chartsbox {
      height: 300px;
    }
    .chartsbox2 {
      height: 250px;
    }
    .list {
      li {
        display: flex;
        align-items: center;
        margin-top: 20px;
        p {
          flex: 1;
          color: #10d1ea;
          font-size: 14px;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .wrap {
          width: 130px;
          height: 30px;
          position: relative;
          background: #002069;
          margin-left: 12px;
          .ww {
            position: absolute;
            left: 0;
            height: 30px;
            top: 0;
            left: 0;
            background: #00a2ff;
            span {
              position: absolute;
              color: #000b1f;
              width: 100%;
              height: 30px;
              line-height: 30px;
              padding: 0 10px;
              font-size: 14px;
              left: 0;
              top: 0;
            }
          }
        }
      }
    }
  }
  .dbox + .dbox {
    margin-top: 20px;
  }
  .nodbox {
    border: 0;
    box-shadow: none;
  }
  .mesbox {
    height: 311px;
  }
  .dbox1 {
    height: 300px;
    overflow: hidden;
    padding-right: 0;
    .list {
      height: 932px;
      overflow: auto;
      padding-right: 20px;
    }
    //滚动条的宽度
    .list::-webkit-scrollbar {
      width: 3px;
      height: 3px;
    }
    //滚动条的滑块
    .list::-webkit-scrollbar-thumb {
      background-color: #10d1ea;
      border-radius: 2px;
    }
  }
  .flexbox {
    display: flex;
    padding: 20px;
    margin-top: 20px;
    border: 1px solid #10d1ea;
    // -webkit-box-shadow: inset 0px 0px 20px 4px rgba(28, 50, 161, 0.5);
    // -moz-box-shadow: inset 0px 0px 20px 4px rgba(28, 50, 161, 0.5);
    box-shadow: inset 0px 0px 20px 4px rgba(28, 50, 161, 0.5);
    .dbox {
      padding: 0 10px;
      .chartsbox {
        height: 292px;
      }
    }
    .dbox + .dbox {
      margin-top: 0;
      margin-left: 10px;
    }
    // .dbox {
    //   flex: 1;
    // }
    // .dbox + .dbox {
    //   margin-left: 20px;
    // }
  }
  .datas {
    margin-bottom: 10px;
    margin-top: 30px;
    .itemlist-wrap {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      .item {
        background-position: center;
        background-size: 100% 100%;
        width: 222px;
        height: 113px;
        margin: 0 16px;
      }
    }
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .n1 {
        color: #10d1ea;
        font-size: 18px;
      }
      .num {
        color: #10d1ea;
        font-size: 16px;
        margin-top: 5px;
        span {
          font-size: 36px;
        }
      }
    }
    .itemwrap {
      // width: 70%;
      margin: 0 auto;
      .item {
        background-color: #000b1f;
        background-position: center;
        background-size: 100% 100%;
        max-width: 100%;
        box-sizing: border-box;
        height: 113px;
        width: 222px;
        margin: 0 auto;
      }
      .el-carousel__mask {
        background: #000b1f;
        opacity: 0.5;
      }
    }
  }
}
.el-footer {
  background: #000b1f;
}

.el-select-dropdown {
  max-width: 176px;
}
</style>
