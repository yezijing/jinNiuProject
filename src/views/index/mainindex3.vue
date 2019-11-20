<template>
  <div class="dataindex" :style="backgroundDiv">
    <h3 class="mtitle">{{systemname}}</h3>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="dbox dbox1">
          <p class="title" :style="titlebackgroundDiv">经济指标（全年目标）</p>
          <ul class="list infinite-list">
            <li v-for="item in allindexDatas" :key="item.index" class="infinite-list-item">
              <p>{{item.name}}</p>
              <div class="wrap">
                <div class="ww" :style="{width:item.rate}">
                  <span>{{item.number}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="datas">
          <!-- <div class="itemwrap">
            <el-carousel
              height="94px"
              :direction="vertical"
              :interval="3000"
              indicator-position="none"
              :autoplay="true"
              type="card"
            >
              <el-carousel-item v-for="item in allnumber" :key="item.index">
                <div class="item">
                  <p class="n1">{{item.name}}</p>
                  <p class="num">
                    <span>{{item.number}}</span> 个
                  </p>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>-->
          <div class="itemlist-wrap">
            <div
              class="item"
              :style="itembackgroundDiv"
              v-for="item in allnumber"
              :key="item.index"
            >
              <p class="n1">{{item.name}}</p>
              <p class="num">
                <span>{{item.number}}</span> 个
              </p>
            </div>
          </div>
        </div>
        <div class="map" id="map"></div>
        <div class="flexbox">
          <div class="dbox">
            <p class="title" :style="titlebackgroundDiv">
              <router-link :to="{path:'/projectList'}">项目（{{projectSum}}个）</router-link>
            </p>
            <div class="chartsbox" id="project-charts"></div>
          </div>
          <div class="dbox">
            <p class="title" :style="titlebackgroundDiv">
              <router-link :to="{path:'/assignList'}">批交办事项（{{meetSum}}项）</router-link>
            </p>
            <div class="chartsbox" id="matter-charts"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="dbox mesbox">
          <p class="title" :style="titlebackgroundDiv">预警信息</p>
          <div class="tablebox">
            <el-table
              class="tableinfo tableinfo2"
              border
              :data="earlyData"
              highlight-current-row
              :cell-class-name="cellClassName"
              style="width: 100%;"
              :row-class-name="tableRowClassName"
            >
              <el-table-column prop="warnName" label="名称">
                <template slot-scope="scope">
                  <div
                    class="name"
                    @click="handleDetail(scope.$index, scope.row)"
                  >{{scope.row.warnName}}</div>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="warnType" label="类别">
              <template slot-scope="scope">
                <span v-html="typeFormat(scope,scope.row.warnType)"></span>
              </template>
              </el-table-column>-->
              <el-table-column prop="formstatus" label="材料报送">
                <template slot-scope="scope">
                  <el-tag size="small">
                    <i class="fa mark" v-if="scope.row.formstatus==1" style="background:#fbe804;"></i>
                    <i class="fa mark" v-else-if="scope.row.formstatus==2" style="background:#f00;"></i>
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
                </template>
              </el-table-column>
              <!-- <el-table-column label="操作">
              <template scope="scope">
                <el-button class="btn" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
                <el-button class="btn baobtn" @click="handleSubmit(scope.$index, scope.row)">报送</el-button>
              </template>
              </el-table-column>-->
            </el-table>
          </div>
        </div>
        <div class="dbox">
          <p class="title" :style="titlebackgroundDiv">重点经济目标（主城区对比）</p>
          <div class="itemlist">
            <el-select size="mini" v-model="indexval" placeholder="请选择" @change="itemChange">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="chartsbox chartsbox2" id="contrast"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 最新消息 -->
    <el-dialog title="推送消息" :visible.sync="lastestVisible" width="1000px" class="report-dialog">
      <el-table
        class="tableinfo"
        border
        :data="newsData"
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column prop="reportdept" label="报送单位" v-if="postUnit"></el-table-column>
        <el-table-column prop="pushType" label="报送类别">
          <template slot-scope="scope">
            <span v-html="bstypeFormat(scope,scope.row.pushType)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="pushName" label="名称"></el-table-column>
        <el-table-column prop="formstatus" label="材料报送">
          <template slot-scope="scope">
            <el-tag size="medium">
              <i class="fa mark" v-if="scope.row.formstatus==1" style="background:#fbe804;"></i>
              <i class="fa mark" v-else-if="scope.row.formstatus==2" style="background:#f00;"></i>
              <i class="fa mark" v-else-if="scope.row.formstatus== -1" style="background:#999;"></i>
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
              <i class="fa mark" v-else></i>
              <span v-html="totalstatusFormat(scope,scope.row.totalstatus)"></span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="validate"
          label="状态"
          :filters="[{ text: '审核通过', value: 2 }, { text: '审核未通过', value: 1 }, { text: '未审核', value: 0 }, { text: '未上报', value: -1 }]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.validate == 1" type="danger" disable-transitions>
              <span v-html="swstateFormat(scope,scope.row.validate)"></span>
            </el-tag>
            <el-tag v-else-if="scope.row.validate == 2" type="success" disable-transitions>
              <span v-html="swstateFormat(scope,scope.row.validate)"></span>
            </el-tag>
            <el-tag v-else-if="scope.row.validate == 0" type="warning" disable-transitions>
              <span v-html="swstateFormat(scope,scope.row.validate)"></span>
            </el-tag>
            <el-tag v-else type="info" disable-transitions>
              <span v-html="swstateFormat(scope,scope.row.validate)"></span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="不通过原因"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleNow()" size="small" type="primary">现在处理</el-button>
        <el-button @click="lastestVisible=false" size="small" type="primary">稍后处理</el-button>
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
  getAllNumber
} from "../../api/api";
import { upfile, imgIp } from "../../api/imgUrl";
import {
  getPersonAll,
  getCheckDetail,
  passChange,
  getNewslist
} from "../../api/center";
import { addReceipt } from "../../api/assignApi";
import { addProgress } from "../../api/projectApi";
import echarts from "echarts";

require("echarts/theme/macarons");
require("echarts/theme/dark");
export default {
  name: "index",
  data() {
    return {
      loginid: JSON.parse(this.$store.getters.userdata).id,
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
      econmicData: [],
      indexval: "1",
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
      receiptVisible: false,
      reportData: { remark: 0 },
      receiptData: {},
      fileList: [],
      filepath: [],
      fileList2: [],
      filepath2: [],
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
      script: [
        {
          src:
            "src: 'http://webapi.amap.com/maps?v=1.3&key=6e7239cd1f1aaf595bca3753a67986f8'"
        }
      ],
      coverProject: [
        { name: "金牛区项目", value: 0, address: "四川省成都市武侯区玉林街" },
        { name: "新金牛公园", value: 0, address: "四川省成都市金牛区" },
        { name: "青羊区项目", value: 0, address: "四川省成都市青羊区" },
        { name: "项目1", value: 0, address: "四川省成都市成都大学" },
        { name: "项目测试区", value: 0, address: "四川省成都市郫县" },
        { name: "其他项目", value: 2, address: "四川省成都市牛市口" }
      ],
      geoCoordMap: {},
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
      ]
    };
  },
  mounted: function() {
    // this.getLocation();
    // this.drawCharts();
    this.selfAdaption();
  },
  created: function() {
    this.getAllNumberList();
    this.getAllList();
    this.browerHeight();
    this.getIndexList();
    this.getIndexData();
    this.getnewsData();
    this.getEcoDatas();
  },
  updated: function() {
    // this.drawCharts();
  },
  watch: {
    //观察option的变化
  },
  methods: {
    load() {
      this.allindexDatas += 2;
    },
    // 总数据展示
    getAllNumberList(){
      let para = { userid: this.loginid }
      getAllNumber(para, data => {
        this.allnumber[0].number = data.data.obj.toAuditCount;
        this.allnumber[1].number = data.data.obj.warnFormCount;
        this.allnumber[2].number = data.data.obj.yuQiFormCount;
        this.allnumber[3].number = data.data.obj.zhiHouTotalCount;
        this.allnumber[4].number = data.data.obj.yanZhongTotalCount;
      })
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
          // if (data[i].cytarget == null) {
          //   data[i].cytarget = num;
          // }
          rate = (num / datas[i].cytarget) * 100;
          let number = (num / datas[i].cytarget) * 100;
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
        console.log(this.allindexDatas);
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
      });
    },
    // 详情
    handleDetail(index, row) {
      //项目
      this.$router.push({
        path: "/projectList",
        query: { projectId: row.pid }
      });
    },
    filterTag(value, row) {
      return row.statsus === value;
    },
    // 获取推送消息列表
    getnewsData() {
      if (this.isfirst) {
        let para = { userid: this.loginid };
        getNewslist(para, data => {
          if (data.data.obj == null) {
            this.lastestVisible = false;
          } else {
            if (data.data.obj[0].checkRoleIsShow == 0) {
              this.newsData = data.data.obj;
              this.postUnit = true;
            } else {
              this.newsData = data.data.obj;
              this.postUnit = false;
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
          return "项目";
          break;
        case 2:
          return "批交办事项";
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
          return "未审核";
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
        console.log(params.data.name);
        _this.$router.push({ path: "/assignList" });
      });

      // var _this = this;
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
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}个 ({d}%)"
        },
        series: [
          {
            name: "批交办事项",
            type: "pie",
            minAngle: 5,
            radius: "55%",
            center: ["50%", "60%"],
            data: this.meetDatas,
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
          }
        },
        yAxis: {
          type: "category",
          inverse: true,
          data: ["金牛区", "锦江区", "成华区", "青羊区", "武侯区"],
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
    // getLocation() {
    //   let coverProject = this.coverProject;
    //   let that = this;
    //   for (let i = 0; i < coverProject.length; i++) {
    //     let point = [];
    //     let arr = [];
    //     axios
    //       .get("https://restapi.amap.com/v3/geocode/geo", {
    //         params: {
    //           key: "6e7239cd1f1aaf595bca3753a67986f8",
    //           address: coverProject[i].address
    //         }
    //       })
    //       .then(function(response) {
    //         arr = response.data.geocodes[0].location.split(",");
    //         point[0] = parseFloat(arr[0]);
    //         point[1] = parseFloat(arr[1]);
    //         that.geoCoordMap[coverProject[i].name] = point;
    //       })
    //       .catch(function(error) {
    //         point = [];
    //         that.geoCoordMap[coverProject[i].name] = point;
    //       });
    //   }
    // },
    mapCharts() {
      // this.getLocation();
      var geoCoordMap = {
        其他项目: [104.059558, 30.695616],
        新金牛公园: [104.047772, 30.68866],
        金牛区项目: [104.061283, 30.689157],
        青羊区项目: [104.049209, 30.711266],
        项目1: [104.072494, 30.697603],
        项目测试区: [104.050647, 30.721697]
      };
      // 将坐标与值对应并反映在地图上
      var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              address: data[i].address,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
        console.log(res)
        return res;
        
      };

      this.mapChart = echarts.init(document.getElementById("map"));
      var option = (option = {
        tooltip: {
          show: true,
          trigger: "item",
          formatter: function(params) {
            return params.name + "<br/>" + params.data.address;
          }
        },
        visualMap: {
          type: "piecewise",
          left: "center",
          orient: "horizontal",
          textStyle: {
            color: "#fff"
          },
          pieces: [
            { min: 1, label: "重点项目", color: "#ffde00" },
            { min: 0, max: 1, label: "一般项目", color: "#f2595b" }
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
            // label: {
            //   emphasis: {
            //     show: true,
            //     position: "right",
            //     formatter: "{b}"
            //   }
            // },
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
        console.log(params);
        // _this.$router.push({ path: "/assignList" });
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
        };
      }, 10);
    },
    drawCharts() {
      // 数据对比
      this.contrastChart();
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
      console.log(this.boxheight);
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
      border: 1px solid #10d1ea;
      // border-right: 0;
      // border-bottom: 0;
      background: #000b1f;
      //   //滚动条的宽度
      // ::-webkit-scrollbar {
      //   width: 2px;
      //   height: 2px;
      // }
      // //滚动条的滑块
      // ::-webkit-scrollbar-thumb {
      //   background-color: #10d1ea;
      //   border-radius: 2px;
      // }
      .name {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 12px;
        color: #10d1ea;
      }
      .el-table__body {
        width: 100% !important;
      }
      .el-table__empty-text{color: #10d1ea;}
      td {
        background: #000b1f;
        border-right: 1px solid #10d1ea;
        border-bottom: 1px solid #10d1ea;
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
        width: 2px !important;
        border-bottom: 1px solid #10d1ea;
      }
      th.is-leaf {
        border-color: #10d1ea;
      }
    }
    //滚动条的宽度
    .tableinfo2 .el-table__body-wrapper::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    //滚动条的滑块
    .tableinfo2 .el-table__body-wrapper::-webkit-scrollbar-thumb {
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
    height: 520px;
    margin-bottom: 20px;
  }
  .dbox {
    padding: 20px;
    border: 1px solid #10d1ea;
    margin-bottom: 20px;
    -webkit-box-shadow: inset 0px 0px 20px 4px rgba(28, 50, 161, 0.5);
    -moz-box-shadow: inset 0px 0px 20px 4px rgba(28, 50, 161, 0.5);
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
      margin-top: 23px;
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
      height: 400px;
    }
    .list {
      li {
        display: flex;
        align-items: center;
        margin-top: 36px;
        p {
          flex: 1;
          color: #10d1ea;
          font-size: 14px;
          text-align: right;
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
  .mesbox {
    height: 430px;
  }
  .dbox1 {
    height: 964px;
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
    .dbox {
      flex: 1;
    }
    .dbox + .dbox {
      margin-left: 20px;
    }
  }
  .datas {
    margin-bottom: 10px;
    margin-top: 56px;
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
        font-size: 16px;
      }
      .num {
        color: #10d1ea;
        font-size: 16px;
        margin-top: 5px;
        span {
          font-size: 32px;
        }
      }
    }
    .itemwrap {
      width: 70%;
      margin: 0 auto;
      .item {
        background: #000b1f;
        width: 100%;
        box-sizing: border-box;
      }
      .el-carousel__mask {
        background: #000b1f;
        opacity: 0.5;
      }
      .el-carousel__item--card.is-active .item {
        border: 2px solid #10d1ea;
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
