<template>
  <div class="mainindex">
    <section class="chart-container">
      <div class="cwrap">
        <div class="list list0">
          <div class="ww ww2">
            <p class="num" style="margin-bottom:10px;">
              <router-link :to="{path:'/personCenter'}">最新预警消息</router-link>
            </p>
            <div class="car">
              <el-table
                class="tableinfo"
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
                      class="title"
                      @click="handleDetail(scope.$index, scope.row)"
                    >{{scope.row.warnName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="warnType" label="类别">
                  <template slot-scope="scope">
                    <span v-html="typeFormat(scope,scope.row.warnType)"></span>
                  </template>
                </el-table-column>
                <el-table-column prop="endTime" :formatter="timestampToTime2" label="截止时间"></el-table-column>
                <el-table-column prop="formstatus" label="材料报送">
                  <template slot-scope="scope">
                    <el-tag size="medium">
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
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template scope="scope">
                    <el-button class="btn" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
                    <el-button class="btn baobtn" @click="handleSubmit(scope.$index, scope.row)">报送</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="cwrap">
        <!-- 项目信息 -->
        <div class="list" v-if="isShowProject">
          <div class="ww">
            <p class="num">
              <router-link :to="{path:'/projectList'}">项目总数：{{projectSum}}个</router-link>
            </p>
            <div class="car" id="chart01"></div>
          </div>
        </div>
        <!-- 批交办事项 -->
        <div class="list" v-if="isShowMeet">
          <div class="ww">
            <p class="num">
              <router-link :to="{path:'/assignList'}">批交办事项：{{meetSum}}项</router-link>
            </p>
            <div class="car" id="chart2"></div>
          </div>
        </div>
        <!-- 决策督查 -->
        <div class="list" v-if="isShowThreePartterm">
          <div class="ww">
            <p class="num">
              <router-link :to="{path:'/decision2'}">决策督查：{{meetSum}}个</router-link>
            </p>
            <div class="car" id="chart4"></div>
          </div>
        </div>
        <!-- 目标管理 -->
        <div class="list" v-if="isShowTarget">
          <div class="ww">
            <div class="numwrap">
              <p class="num">
                <router-link :to="{path:'/targetTabs'}">目标管理</router-link>
              </p>
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
            </div>
            <div class="car" id="chart3"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 进展汇报 -->
    <el-dialog title="添加进展汇报" :visible.sync="reportVisible" width="800px" class="report-dialog">
      <el-form
        :model="reportData"
        label-width="120px"
        ref="reportData"
        :append-to-body="true"
        size="small"
      >
        <el-row>
          <el-form-item label="进展情况：" prop="question">
            <el-input type="textarea" :autosize="{ minRows: 3}" v-model="reportData.question"></el-input>
          </el-form-item>
          <el-form-item label="下步工作计划：" prop="measure">
            <el-input type="textarea" :autosize="{ minRows: 3}" v-model="reportData.measure"></el-input>
          </el-form-item>
          <el-form-item label="自我评价：" prop="remark" class="lastitem" :rules="[{ required: true, message: '请选择', trigger:'blur'}]">
            <!-- <el-select v-model="reportData.remark" @change="selectChange">
              <el-option
                v-for="item in selfCommit"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>-->
            <el-radio-group v-model="reportData.remark">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">滞后</el-radio>
              <el-radio :label="2">严重滞后</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="存在问题：" prop="wenti">
            <el-input type="textarea" :autosize="{ minRows: 3}" v-model="reportData.wenti"></el-input>
          </el-form-item>
          <div class="upbox">
            <el-upload
              class="upload-demo"
              :action="upfile"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :before-remove="beforeRemove"
              :file-list="fileList"
              ref="upload"
            >
              <el-button class="btn">添加附件</el-button>
            </el-upload>
          </div>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitReport" size="small" type="primary">新增</el-button>
      </div>
    </el-dialog>

    <!-- 添加回执 -->
    <el-dialog title="添加回执" :visible.sync="receiptVisible" width="810px" class="task-dialog">
      <el-form
        :model="receiptData"
        label-width="120px"
        ref="receiptData"
        :append-to-body="true"
        size="small"
      >
        <el-form-item label="总体情况：" prop="general">
          <el-input type="textarea" :rows="3" v-model="receiptData.general"></el-input>
        </el-form-item>
        <el-form-item label="时间节点安排：" prop="planthing">
          <el-input type="textarea" :rows="3" v-model="receiptData.planthing"></el-input>
        </el-form-item>
        <el-form-item label="经办人：" prop="agentname">
          <el-input placeholder="请输入" v-model="receiptData.agentname"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="agentphone">
          <el-input placeholder="请输入" v-model="receiptData.agentphone"></el-input>
        </el-form-item>
        <div class="upbox">
          <el-upload
            class="upload-demo"
            :action="upfile"
            :on-remove="handleRemove2"
            :on-success="handleSuccess2"
            :before-remove="beforeRemove2"
            :file-list="fileList2"
            ref="upload"
          >
            <el-button class="btn">添加附件</el-button>
          </el-upload>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="receiptSubmit" type="primary">提 交</el-button>
      </div>
    </el-dialog>

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
          :filters="[{ text: '审核通过', value: 2 }, { text: '审核未通过', value: 1 }]"
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
import { indexData, indexnameData, getDatabyChange } from "../../api/api";
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
  name: "mainIndex",
  data() {
    return {
      loginid: JSON.parse(this.$store.getters.userdata).id,
      isfirst: this.$store.state.isfirst, //消息弹窗点击现在处理后不再显示弹窗控制
      lastestVisible: false,
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
      newsData: []
    };
  },
  mounted: function() {
    this.getIndexData();
    this.getIndexList();
    this.drawCharts();
    this.selfAdaption();
  },
  created: function() {
    this.upfile = upfile;
    this.imgIp = imgIp;
    this.getnewsData();
    this.getAllList();
  },
  updated: function() {
    this.drawCharts();
  },
  watch: {
    //观察option的变化
  },
  methods: {
    filterTag(value, row) {
      return row.statsus === value;
    },
    // 获取推送消息列表
    getnewsData() {
      if (this.isfirst) {
        let para = { userid: this.loginid };
        getNewslist(para, data => {
          console.log(data.data.obj)
          if (data.data.obj.length ==0) {
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
          return "重点项目";
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
    // 获取浏览器高度，计算table高度
    browerHeight() {
      var bheight = document.body.clientHeight;
      var hh = bheight - 300;
      this.carheight = "height:" + hh / 2 + "px";
    },
    // 状态
    statusFormat(scope, value) {
      switch (value) {
        case 1:
          return "预警";
          break;
        case 2:
          return "逾期";
          break;
      }
    },
    typeFormat(scope, value) {
      switch (value) {
        case 1:
          return "项目";
          break;
        case 2:
          return "批交办事项";
          break;
      }
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
    timestampToTime2(row, column) {
      var date = new Date(row.endTime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      return Y + M + D;
    },
    // 预警信息列表
    getAllList() {
      let para = { userid: this.loginid };
      getPersonAll(para, data => {
        this.earlyData = data.data.obj.warnMessage;
      });
    },
    // 报送
    handleSubmit(index, row) {
      console.log(row.warnType);
      if (row.warnType == 1) {
        this.checkid = row.id;
        this.reportVisible = true;
        this.reportData.aimname = row.messageDetil;
      } else {
        this.checkid = row.id;
        this.receiptVisible = true;
        this.receiptData.meetname = row.messageDetil;
      }
    },
    // 详情
    handleDetail(index, row) {
      //项目
      this.$router.push({
        path: "/projectList",
        query: { projectId: row.pid }
      });
    },
    // 进展汇报提交
    submitReport() {
      this.reportData.pid = this.checkid;
      this.reportData.userid = this.loginid;
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
      para.userId = this.loginid;
      para.validate = 0;
      console.log(para);
      addProgress(para, data => {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        this.$refs["reportData"].resetFields();
        this.reportVisible = false;
      });
    },
    // 回执提交
    receiptSubmit() {
      this.receiptData.pid = this.checkid;
      this.reportData.userid = this.loginid;
      let files = "";
      if (this.fileArr2 == []) {
        files = "";
      } else {
        let len = this.fileArr2.length;
        if (len == 1) {
          files += this.fileArr2[0] + ",";
        } else {
          files = this.fileArr2.join(",");
        }
      }
      this.receiptData.filepath = files;
      let para = this.receiptData;
      para.userId = this.loginid;
      para.validate = 0;
      console.log(para);
      addReceipt(para, data => {
        this.receiptVisible = false;
        this.$refs["receiptData"].resetFields();
        this.fileList = [];
        this.$message({
          message: "提交成功",
          type: "success"
        });
      });
    },
    selectChange() {
      this.$forceUpdate();
    },
    // 项目上传附件
    // 添加附件 移除
    handleRemove(file, fileList) {
      let name = file.response.obj;
      this.fileArr.splice(this.removeArr(this.fileArr, name), 1);
      console.log(this.fileArr);
    },
    // 添加附件 移除前提示
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 添加附件 状态改变时
    handleSuccess(file, fileList) {
      let name = file.obj;
      this.fileArr.push(name);
    },

    // 批交办上传附件
    handleRemove2(file, fileList) {
      let name = file.response.obj;
      this.fileArr2.splice(this.removeArr(this.fileArr2, name), 1);
      console.log(this.fileArr2);
    },
    beforeRemove2(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleSuccess2(file, fileList) {
      let name = file.obj;
      this.fileArr2.push(name);
    },

    // 获取指标列表
    getIndexList() {
      let para = { userId: this.loginid };
      indexnameData(para, data => {
        this.options = data.data.obj;
        this.indexval = this.options[0].id;
        this.indexType = this.options[0].type;
        console.log(this.options);
        console.log(this.indexType);
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
          // { value: this.projectWarn, name: "预警" },
          { value: this.projectZhiHou, name: "滞后" },
          { value: this.projectYanZhong, name: "严重滞后" }
          // { value: this.projectPost, name: "逾期" }
        ];
        this.meetDatas = [
          { value: this.meetEnd, name: "完结" },
          { value: this.meetNormal, name: "正常" },
          // { value: this.meetWarn, name: "预警" },
          { value: this.meetZhiHou, name: "滞后" },
          { value: this.meetYanZhong, name: "严重滞后" }
          // { value: this.meetPost, name: "逾期" }
        ];
        this.planDatas = [
          { value: this.planEnd, name: "完结" },
          { value: this.planNormal, name: "正常" },
          // { value: this.planWarn, name: "预警" },
          { value: this.planZhiHou, name: "滞后" },
          { value: this.planYanZhong, name: "严重滞后" }
          // { value: this.planPost, name: "逾期" }
        ];
        this.projectTypes = [
          { value: this.projectCommon, name: "一般项目" },
          { value: this.projectKey, name: "重点项目" }
        ];
        this.drawCharts();
      });
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
        console.log(data.data.obj);
        this.econmicData = data.data.obj;
        this.targetChart();
      });
    },
    // echart自适应
    selfAdaption() {
      const that = this; //因为箭头函数会改变this指向，指向windows。所以先把this保存
      setTimeout(() => {
        window.onresize = function() {
          that.chart = echarts.init(document.getElementById("chart3"));
          that.chart2 = echarts.init(document.getElementById("chart2"));
          that.chart3 = echarts.init(document.getElementById("chart01"));
          that.chart4 = echarts.init(document.getElementById("chart4"));
          that.chart.resize();
          that.chart2.resize();
          that.chart3.resize();
          that.chart4.resize();
        };
      }, 10);
    },
    // 项目信息
    projectChart() {
      this.chartPie = echarts.init(
        document.getElementById("chart01"),
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
        // legend: {
        //   x: 'left',
        //   orient: 'vertical',
        //   data: ["完结", "正常", "预警", "逾期"]
        // },
        series: [
          {
            name: "项目信息",
            type: "pie",
            minAngle: 5,
            avoidLabelOverlap: true,
            radius: "55%",
            label: {
              formatter: "{b}: {@2012}个 ({d}%)",
              textStyle: { fontSize: 12 }
            },
            center: ["50%", "60%"],
            data: this.projectDatas,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    "#999",
                    "#078182",
                    // "#f6bd16",
                    "#364e98",
                    "#7c1d77"
                    // "#e85a1c"
                  ];
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
        document.getElementById("chart2"),
        "macarons"
      );
      var _this = this;
      this.chartPie.on("click", function(params) {
        console.log(params.data.name);
        _this.$router.push({ path: "/assignList" });
      });

      var _this = this;
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
        // legend: {
        //   x: 'left',
        //   orient: 'vertical',
        //   data: ["完结", "正常", "预警", "逾期"]
        // },
        series: [
          {
            name: "批交办事项",
            type: "pie",
            minAngle: 5,
            radius: "55%",
            label: {
              formatter: "{b}: {@2012}项 ({d}%)",
              textStyle: { fontSize: 12 }
              // show: false
            },
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

    // 目标管理
    targetChart() {
      this.chartColumn = echarts.init(
        document.getElementById("chart3"),
        "macarons"
      );
      var _this = this;
      this.chartColumn.on("click", function(params) {
        console.log(params.data.name);
        _this.$router.push({ path: "/targetTabs" });
      });
      this.chartColumn.setOption({
        // title: { text: "目标管理", x: "left" },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            label: {
              backgroundColor: "#000"
            }
          }
        },
        xAxis: {
          data: ["金牛区", "锦江区", "成华区", "青羊区", "武侯区"],
          textStyle: { fontSize: 16 }
        },
        // legend: {
        //   x: 'left',
        //   orient: 'vertical',
        //   data: ["金牛区", "锦江区", "成华区", "青羊区", "武侯区"]
        // },
        yAxis: {
          name: this.typename,
          type: "value"
        },
        series: [
          {
            name: this.typename,
            type: "bar",
            barWidth: 50,
            label: {
              formatter: "{b}: {@2012}个 ({d}%)",
              normal: {
                show: true,
                position: "inside"
              }
            },
            data: this.econmicData,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    "#7831b9",
                    "#1890ff",
                    "#47ab47",
                    "#fb882b",
                    "#e84d4d"
                  ];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      });
    },
    // 三年行动计划
    keyCharts() {
      this.chartPie = echarts.init(
        document.getElementById("chart4"),
        "macarons"
      );

      var _this = this;
      this.chartPie.on("click", function(params) {
        console.log(params.data.name);
        _this.$router.push({ path: "/decision2" });
      });

      var _this = this;
      this.chartPie.on("click", function(params) {
        let name = params.data.name;
        if (name == "完结") {
          this.planStatus = -1;
        } else if (name == "逾期") {
          this.planStatus = 2;
        } else if (name == "严重滞后") {
          this.planStatus = 4;
        } else if (name == "滞后") {
          this.planStatus = 3;
        } else if (name == "预警") {
          this.planStatus = 1;
        } else if (name == "正常") {
          this.planStatus = 0;
        }
        _this.$router.push({
          path: "/decision2",
          query: { astatus: this.planStatus }
        });
      });

      this.chartPie.setOption({
        // title: { text: "三年行动计划" + this.meetSum + "个", x: "center" },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}个 ({d}%)"
        },
        // legend: {
        //   x: 'left',
        //   orient: 'vertical',
        //   data: ["完结", "正常", "预警", "逾期"]
        // },
        series: [
          {
            name: "项目类别",
            type: "pie",
            minAngle: 5,
            radius: "55%",
            label: {
              formatter: "{b}: {@2012}个 ({d}%)",
              textStyle: { fontSize: 12 }
            },
            center: ["50%", "60%"],
            data: this.planDatas,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    "#999",
                    "#078182",
                    "#f6bd16",
                    "#364e98",
                    "#7c1d77",
                    "#e85a1c"
                  ];
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
    // 经济指标数据
    dataCharts() {
      this.myChart = echarts.init(document.getElementById("mycharts"));
      var option = {
        color: ["#009999", "#FF7400", "#006363", "#FF4040"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            label: {
              backgroundColor: "#1890FF"
            }
          }
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        legend: {
          data: ["金牛区", "武侯区", "高新区", "青羊区"],
          itemGap: 5
        },
        grid: {
          top: "12%",
          left: "1%",
          right: "10%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [
              "经济指标一",
              "经济指标二",
              "经济指标三",
              "经济指标三",
              "经济指标四",
              "经济指标四",
              "新签约引进重大项目注册数",
              "经济指标四"
            ]
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "指标数据"
          }
        ],
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 100
          },
          {
            type: "inside",
            start: 94,
            end: 100
          },
          {
            show: true,
            yAxisIndex: 0,
            filterMode: "empty",
            width: 30,
            height: "80%",
            showDataShadow: false,
            left: "93%"
          }
        ],
        series: [
          {
            name: "金牛区",
            type: "bar",
            barGap: 0,
            data: [320, 332, 301, 334, 390, 320, 420, 260]
          },
          {
            name: "武侯区",
            type: "bar",
            data: [220, 182, 191, 234, 290, 200, 350, 420]
          },
          {
            name: "高新区",
            type: "bar",
            data: [150, 232, 201, 154, 190, 180, 200, 400]
          },
          {
            name: "青羊区",
            type: "bar",
            data: [98, 77, 101, 99, 40, 60, 480, 500]
          }
        ]
      };
      this.myChart.setOption(option);
    },
    drawCharts() {
      // this.dataCharts();
      if (this.isShowProject == true) {
        this.projectChart();
      }
      if (this.isShowMeet == true) {
        this.taskChart();
      }
      if (this.isShowThreePartterm == true) {
        this.keyCharts();
      }
      if (this.isShowTarget == true) {
        this.targetChart();
      }
    }
  }
};
</script>

<style lang="scss">
.mainindex {
  .el-table th>.cell.highlight{color:#fff;}
  .el-table__column-filter-trigger i{color: #fff;font-size: 14px;margin-left: 5px;}
  .flexbox {
    display: flex;
    align-items: stretch;
    fieldset {
      height: 100%;
      .upbox {
        padding: 20px;
        p {
          color: #1890ff;
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
      max-width: 400px;
      color: #1890ff;
      .btn {
        color: #1890ff;
        border: 0;
        font-size: 14px;
      }
    }
    .files {
      margin-top: 10px;
      a {
        display: block;
      }
    }
  }
}
.chart-container {
  width: 100%;
  .cwrap {
    display: flex;
    margin: 0 -5px 10px;
    flex-wrap: wrap;
    .list {
      width: 50%;
      margin-bottom: 10px;
      padding: 0 5px;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      .ww {
        background: #fff;
        padding: 20px;
        .numwrap {
          display: flex;
          justify-content: space-between;
        }
        .num {
          color: #000;
          font-size: 16px;
          padding-left: 10px;
          position: relative;
          margin-bottom: 10px;
          a {
            color: #000;
            font-size: 16px;
          }
        }
        .num::after {
          content: "";
          position: absolute;
          left: 0;
          height: 16px;
          top: 50%;
          margin-top: -7px;
          background: #1e98d3;
          width: 3px;
        }
        .car {
          height: 320px;
        }
      }
      .ww2 {
        height: auto;
        .car {
          height: auto;
        }
      }
    }
    .list0 {
      width: 100%;
    }
  }
}
.report-dialog {
  .upbox {
    padding: 0 20px;
    max-width: 400px;
    color: #1890ff;
    p {
      color: #333;
      font-size: 14px;
    }
    .btn {
      color: #1890ff;
      border: 0;
      font-size: 14px;
    }
  }
  .files {
    margin-top: 10px;
    a {
      display: block;
      line-height: 2;
    }
  }
  .el-select {
    .el-input.is-disabled .el-input__inner {
      cursor: pointer;
      color: #606266;
      background: #fff;
    }
    .el-input__suffix-inner {
      cursor: pointer;
      pointer-events: none;
    }
  }
}
.chartswrap {
  background: #fff;
  padding: 30px 10px 30px 30px;
  width: 100%;
  box-sizing: border-box;
  .title {
    color: #333;
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
  }
}
</style>
