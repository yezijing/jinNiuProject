<template>
  <div class="tablebox">
    <el-table
      class="tableinfo"
      empty-text="无"
      border
      :data="passData"
      highlight-current-row
      :height="passHeight"
    >
      <el-table-column
        width="100px"
        prop="reportdept"
        label="报送单位"
        v-if="overpostUnit"
        :filters="reportDepts"
        :filter-method="filterDepts"
        filter-placement="bottom"
      ></el-table-column>
      <el-table-column
        prop="transTypeSearch"
        label="类别"
        :filters="reportTypes"
        :filter-method="filterReportTypes"
        filter-placement="bottom"
        width="110px"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.transTypeSearch==1">重点项目</span>
          <span v-else-if="scope.row.transTypeSearch==2">批交办事项</span>
          <span v-else-if="scope.row.transTypeSearch==3">三年行动计划</span>
          <span v-else-if="scope.row.transTypeSearch==6">现场办公会</span>
          <span v-else-if="scope.row.transTypeSearch==11">片区督查</span>
          <span v-else-if="scope.row.transTypeSearch==12">重点工作</span>
          <span v-else-if="scope.row.transTypeSearch==4">承办单位指标管理</span>
          <span v-else-if="scope.row.transTypeSearch==5">区级指标管理</span>
        </template>
      </el-table-column>
      <el-table-column prop="transName" label="名称">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div style="max-width:300px;line-height:1.8;" slot="content">{{scope.row.transName}}</div>
            <p class="title title-ellipsis">{{scope.row.transName}}</p>
            <!-- @click="handleExamineDetail(scope.row)" -->
            <!-- <p class="title title-ellipsis">{{scope.row.transName}}</p> -->
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="auditTime" label="审核时间" sortable width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.auditTime | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="statsus"
        width="80px"
        label="状态"
        :filters="[{ text: '未通过', value: 1 }, { text: '通过', value: 2 }]"
        :filter-method="filterState"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statsus == 1" type="danger" disable-transitions>
            <span>未通过</span>
          </el-tag>
          <el-tag v-else type="success" disable-transitions>
            <span>通过</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="审核不通过原因">
        <template slot-scope="scope">
          <span v-if="scope.row.reason=='null'">/</span>
          <span v-else>{{scope.row.reason}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60px">
        <template scope="scope">
          <el-button class="btn" @click="handleVerifyDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情查看 -->
    <el-dialog title="详情" :visible.sync="examineVisible" width="1200px" class="report-dialog">
      <examine-content
        :examineVisible.sync="examineVisible"
        :examineFileArr.sync="examineFileArr"
        :reportBasic="reportBasic"
        :examineData.sync="examineData"
        :laststate="laststate"
        :itemShow="itemShow"
        :noneFile="noneFile"
        :reasonShow="reasonShow"
        ref="examineChild"
      ></examine-content>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="examineVisible=false">确定</el-button>
      </div>
    </el-dialog>

    <!-- 区县填报数据报表 -->
    <el-dialog title="指标数据详情" :visible.sync="indexVisible" width="1200px" class="task-dialog">
      <el-table
        class="tableinfo"
        border
        :data="preDatas"
        highlight-current-row
        style="width: 100%;"
        height="400px"
      >
        <el-table-column :label="viewTitle">
          <el-table-column prop="districtName" label="区（市）县"></el-table-column>
          <el-table-column prop="cytarget" label="市下达全年目标"></el-table-column>
          <el-table-column label="目标完成额">
            <el-table-column label="绝对量" prop="amount" v-if="isNumshow"></el-table-column>
            <el-table-column label="五城区排名" prop="amountfiverank" v-if="isNumshow"></el-table-column>
            <el-table-column label="中心城区排名" prop="amountcentralrank" v-if="isNumshow"></el-table-column>
            <el-table-column label="全市排名" prop="amountcityrank" v-if="isNumshow"></el-table-column>
            <el-table-column label="增幅" prop="amplify" v-if="isZengshow">
              <template slot-scope="scope">
                <p v-if="scope.row.amplify<0" style="color:#f00;">{{scope.row.amplify}}%</p>
                <p v-else-if="scope.row.amplify==null">/</p>
                <p v-else>{{scope.row.amplify}}%</p>
              </template>
            </el-table-column>
            <el-table-column label="五城区排名" prop="amplifyfiverank" v-if="isZengshow"></el-table-column>
            <el-table-column label="中心城区排名" prop="amplifycentralrank" v-if="isZengshow"></el-table-column>
            <el-table-column label="全市排名" prop="amplifycityrank" v-if="isZengshow"></el-table-column>
          </el-table-column>
          <el-table-column label="目标完成率">
            <el-table-column label="完成进度" prop="fschedule" v-if="isNumshow"></el-table-column>
            <el-table-column label="五城区排名" prop="fschedulefiverank" v-if="isNumshow"></el-table-column>
            <el-table-column label="中心城区排名" prop="fschedulecentralrank" v-if="isNumshow"></el-table-column>
            <el-table-column label="全市排名" prop="fschedulecityrank" v-if="isNumshow"></el-table-column>
            <el-table-column label="超目标百分点" prop="overtarget" v-if="isZengshow">
              <template slot-scope="scope">
                <p v-if="scope.row.overtarget<0" style="color:#f00;">{{scope.row.overtarget}}%</p>
                <p v-else-if="scope.row.overtarget==null">/</p>
                <p v-else>{{scope.row.overtarget}}%</p>
              </template>
            </el-table-column>
            <el-table-column label="五城区排名" prop="overtargetfiverank" v-if="isZengshow"></el-table-column>
            <el-table-column label="中心城区排名" prop="overtargetcentralrank" v-if="isZengshow"></el-table-column>
            <el-table-column label="全市排名" prop="overtargetcityrank" v-if="isZengshow"></el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="indexVisible=false">确定</el-button>
      </div>
    </el-dialog>
    <!-- 承办单位数据报表 -->
    <el-dialog title="指标数据详情" :visible.sync="indexAreaVisible" width="1200px" class="task-dialog">
      <el-table
        class="tableinfo"
        border
        :data="areaDatas"
        highlight-current-row
        style="width: 100%;"
        :span-method="typeSpanMethod"
        height="500px"
      >
        <el-table-column :label="choosename">
          <el-table-column prop="deptcategory" label="类别"></el-table-column>
          <el-table-column prop="deptName" label="街道"></el-table-column>
          <el-table-column prop="fscrank" label="进度排名"></el-table-column>
          <el-table-column prop="amountrank" label="总量排名"></el-table-column>
          <el-table-column prop="cytarget" label="任务计划">
            <template slot-scope="scope">
              <p v-if="scope.row.cytarget<0" style="color:#f00;">{{scope.row.cytarget}}</p>
              <p v-else-if="scope.row.cytarget==null">/</p>
              <p v-else>{{scope.row.cytarget}}</p>
            </template>
          </el-table-column>
          <el-table-column label="完成情况">
            <el-table-column label="完成总量" prop="amount" v-if="isNumshow">
              <template slot-scope="scope">
                <p v-if="scope.row.amount<0" style="color:#f00;">{{scope.row.amount}}</p>
                <p v-else-if="scope.row.amount==null">/</p>
                <p v-else>{{scope.row.amount}}</p>
              </template>
            </el-table-column>
            <el-table-column label="完成进度" prop="fschedule" v-if="isNumshow">
              <template slot-scope="scope">
                <p v-if="scope.row.fschedule<0" style="color:#f00;">{{scope.row.fschedule}}</p>
                <p v-else-if="scope.row.fschedule==null">/</p>
                <p v-else>{{scope.row.fschedule}}</p>
              </template>
            </el-table-column>
            <el-table-column label="增幅（%）" prop="amplify" v-if="isZengshow">
              <template slot-scope="scope">
                <p v-if="scope.row.amplify<0" style="color:#f00;">{{scope.row.amplify}}</p>
                <p v-else-if="scope.row.amplify==null">/</p>
                <p v-else>{{scope.row.amplify}}</p>
              </template>
            </el-table-column>
            <el-table-column label="超目标百分点（%）" prop="overtarget" v-if="isZengshow">
              <template slot-scope="scope">
                <p v-if="scope.row.overtarget<0" style="color:#f00;">{{scope.row.overtarget}}%</p>
                <p v-else-if="scope.row.overtarget==null">/</p>
                <p v-else>{{scope.row.overtarget}}%</p>
              </template>
            </el-table-column>
            <el-table-column label="是否完成任务计划" prop="isfinish">
              <template slot-scope="scope">
                <p v-if="scope.row.isfinish==0">是</p>
                <p v-else style="color:#f00">否</p>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="indexAreaVisible=false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>   

 
<script>
import examineContent from "../views/examine"; //审核详情
import {
  getCheckDetail,
  showLasttimeState,
  showLasttimeState3
} from "../api/center";
import { getdetailProject } from "../api/projectApi";
import { assignDetail } from "../api/assignApi";
import {
  threePlanDetail,
  showImportworkLasttime,
  importWorkDetailData
} from "../api/decisionApi";
import { threeUpDetail, threePlanDetail2 } from "../api/workApi";
import { alldeptList } from "../api/api";
import { areaViewReport, otherViewReport } from "../api/targetApi2";
import {
  keyitemDetail,
  keyAreaDetail,
  keyWorkDetail,
  lasttimeKeyworkProgress,
  lasttimeKeyareaProgress,
  lastKeyitemProgress
} from "../api/threework";

export default {
  name: "tablelist",
  props: ["passHeight", "passData", "overpostUnit"],
  components: {
    examineContent
  },
  data() {
    return {
      choosename: "",
      preDatas: [],
      areaDatas: [],
      indexVisible: false,
      indexAreaVisible: false,
      reasonShow: false, //是否显示不通过原因
      examineVisible: false,
      examineFileArr: [],
      reportBasic: {},
      examineData: {},
      laststate: "",
      noneFile: false,
      itemShow: 0,
      examineId: 0,
      examineType: 0,
      bigid: 0,
      //报送类别
      reportTypes: [
        { value: 1, text: "重点项目" },
        { value: 2, text: "批交办事项" },
        { value: 3, text: "三年行动计划" },
        { value: 6, text: "现场办公会" },
        { value: 9, text: "片区督查" },
        { value: 12, text: "重点工作" },
        { value: 4, text: "承办单位指标管理" },
        { value: 5, text: "区级指标管理" }
      ],
      loginid: JSON.parse(this.$store.getters.userdata).id,
      reportDepts: [],
      reportType: 0,
      addnum: 0,
      isNumshow: true,
      isZengshow: true,
      spanPos: 0,
      spanArr: [],
      viewTitle: ""
    };
  },
  created() {
    this.getDeptlist();
  },
  watch: {
    passData: function(newValue, oldValue) {
      this.$emit("update:passData", newValue);
    }
  },
  methods: {
    // 点击标题进入页面详情
    handleExamineDetail(row) {
      if (row.transType == 1) {
        //项目
        this.$router.push({
          path: "/projectList",
          query: { projectId: row.bigid, isCenter: 2 }
        });
      } else if (row.transType == 2) {
        //批交办
        this.$router.push({
          path: "/assignList",
          query: { checkid: row.bigid, isCenter: 2 }
        });
      } else if (row.transType == 3) {
        // 三年行动计划
        this.$router.push({
          path: "/decision2",
          query: { workid: row.bigid, isCenter: 2 }
        });
      } else if (row.transType == 6) {
        // 领导指示工作分工
        this.$router.push({
          path: "/working",
          query: {
            workid: row.bigid,
            isWorkShow: true,
            isWorkShow2: false,
            isWorkShow3: false,
            activeClass: 0,
            isCenter: 2,
            sortnum: 0
          }
        });
      } else if (row.transType == 7) {
        // 向上争取协调解决工作分工
        this.$router.push({
          path: "/working",
          query: {
            workid: row.bigid,
            isWorkShow2: true,
            isWorkShow: false,
            isWorkShow3: false,
            activeClass: 1,
            isCenter: 2,
            sortnum: 1
          }
        });
      } else if (row.transType == 8) {
        // 需我区协调解决工作分工
        this.$router.push({
          path: "/working",
          query: {
            workid: row.bigid,
            isWorkShow3: true,
            isWorkShow2: false,
            isWorkShow: false,
            activeClass: 2,
            isCenter: 2,
            sortnum: 2
          }
        });
      } else if (row.transType == 9) {
        // 重点工作
        this.$router.push({
          path: "/threework",
          query: {
            workid: row.bigid,
            isWorkShow: true,
            isWorkShow2: false,
            isWorkShow3: false,
            activeClass: 0,
            isCenter: 2,
            sortnum: 0
          }
        });
      } else if (row.transType == 10) {
        // 重要片区
        this.$router.push({
          path: "/threework",
          query: {
            workid: row.bigid,
            isWorkShow: false,
            isWorkShow2: true,
            isWorkShow3: false,
            activeClass: 1,
            isCenter: 2,
            sortnum: 1
          }
        });
      } else if (row.transType == 11) {
        // 重大项目
        this.$router.push({
          path: "/threework",
          query: {
            workid: row.bigid,
            isWorkShow: false,
            isWorkShow2: false,
            isWorkShow3: true,
            activeClass: 2,
            isCenter: 2,
            sortnum: 2
          }
        });
      } else {
        return false;
      }
    },
    //   查看审核详情
    handleVerifyDetail(row) {
      this.reportType = row.transType;
      if (row.transType == 4) {
        this.indexAreaVisible = true;
        this.areaDatas = [];
        this.addnum = row.reportid;
        this.choosename = row.transName;
        let para = { economicid: row.bigid, addnum: row.reportid };
        otherViewReport(para, data => {
          if (data.data.obj == null) {
            this.areaDatas = [];
            this.isNumshow = true;
            this.isZengshow = true;
          } else {
            this.areaDatas = data.data.obj;
            if (this.areaDatas[0].economicType == 0) {
              this.isNumshow = true;
              this.isZengshow = false;
            } else {
              this.isNumshow = false;
              this.isZengshow = true;
            }
          }
          this.merage();
        });
      } else if (row.transType == 5) {
        //各区市县填报
        this.indexVisible = true;
        this.preDatas = [];
        this.addnum = row.reportid;
        this.viewTitle = row.transName;
        let para = { economicid: row.bigid, addnum: row.reportid };
        areaViewReport(para, data => {
          if (data.data.obj == null) {
            this.preDatas = [];
            this.isNumshow = true;
            this.isZengshow = true;
          } else {
            this.preDatas = data.data.obj;
            if (this.preDatas[0].economicType == 0) {
              this.isNumshow = true;
              this.isZengshow = false;
            } else {
              this.isNumshow = false;
              this.isZengshow = true;
            }
          }
        });
      } else {
        this.resetFuc();
        if (row.statsus == 1) {
          this.reasonShow = true;
        } else {
          this.reasonShow = false;
        }
        this.bigid = row.bigid;
        this.examineId = row.reportid;
        this.examineType = row.transType;
        let para = { type: row.transType, detailId: row.reportid };
        getCheckDetail(para, data => {
          if (data.data.obj == "") {
            this.examineFileArr = [];
          } else {
            this.examineData = data.data.obj;
            var arr = data.data.obj.filepath;
            if (arr == "" || arr == null) {
              this.examineFileArr = [];
              this.noneFile = true;
            } else {
              this.noneFile = false;
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
                this.examineFileArr.push(obj);
              }
            }
          }

          if (row.transType == 1) {
            //项目
            this.itemShow = 1;
            let projectpara = {
              projectid: row.bigid,
              reportDept: row.reportdept
            };
            showLasttimeState(projectpara, sdata => {
              this.laststate = sdata.data.obj;
            });
            this.projectDetailFuc(this.bigid);
          } else if (row.transType == 2) {
            //批交办
            this.itemShow = 2;
            this.assignDetailFuc(this.bigid);
          } else if (row.transType == 3) {
            //三年行动计划
            this.itemShow = 3;
            let threepara = {
              typemodel: 1,
              workid: row.bigid,
              reportDept: row.reportdept
            };
            showLasttimeState3(threepara, sdata => {
              this.laststate = sdata.data.obj;
            });
            var threetype = 1;
            this.threeDetailFuc(this.bigid, threetype);
          } else if (row.transType == 6) {
            //领导指示
            this.itemShow = 4;
            let leaderpara = {
              typemodel: 2,
              workid: row.bigid,
              reportDept: row.reportdept
            };
            showLasttimeState3(leaderpara, sdata => {
              this.laststate = sdata.data.obj;
            });
            var leadertype = 2;
            this.threeDetailFuc(this.bigid, leadertype);
          } else if (row.transType == 9) {
            // 重点工作
            this.itemShow = 7;
            lasttimeKeyworkProgress({ workid: this.bigid }, data => {
              if (data.data.obj == null) {
                this.laststate = "";
              } else {
                this.laststate = data.data.obj.question;
              }
            });
            this.keyWorkdetailFuc(this.bigid);
          } else if (row.transType == 10) {
            // 重要片区
            this.itemShow = 8;
            lasttimeKeyareaProgress({ workid: this.bigid }, data => {
              if (data.data.obj == null) {
                this.laststate = "";
              } else {
                this.laststate = data.data.obj.question;
              }
            });
            this.keyAreadetailFuc(this.bigid);
          } else if (row.transType == 11) {
            // 重大项目
            this.itemShow = 9;
            lastKeyitemProgress(
              { sid: this.bigid, userid: this.loginid },
              data => {
                this.laststate = data.data.obj.question;
              }
            );
            this.keyItemdetailFuc(this.bigid);
          } else if (row.transType == 12) {
            // 新增重点工作
            this.itemShow = 10;
            showImportworkLasttime(
              { userid: this.loginid, pointid: this.bigid },
              data => {
                this.laststate = data.data.obj.question;
              }
            );
            this.importworkDetailFuc(this.bigid);
          }
          this.examineVisible = true;
        });
      }
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
    // 新增的重点工作详情
    importworkDetailFuc(id) {
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
    // 重点工作详情
    keyWorkdetailFuc(id) {
      keyWorkDetail({ workid: id }, data => {
        this.detailData = data.data.obj;
        this.reportBasic = this.detailData.tripleWorkProgress;
        this.reportBasic.yearname = this.detailData.tripleWorkProgress.year;
        this.reportBasic.leaders = this.detailData.tripleWorkProgress.dutyleadname;
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
    filterReportTypes(value, row) {
      return row.transTypeSearch === value;
    },
    filterState(value, row) {
      return row.statsus === value;
    },
    filterDepts(value, row) {
      return row.reportdept === value;
    },
    //   获取部门列表
    getDeptlist: function() {
      alldeptList("", data => {
        var leadunits = data.data.obj;
        if (leadunits == null) {
          this.reportDepts = [];
        } else {
          for (var i = 0; i < leadunits.length; i++) {
            var obj = {};
            obj.text = leadunits[i].name;
            obj.value = leadunits[i].name;
            this.reportDepts.push(obj);
          }
        }
      });
    },
    // 重置
    resetFuc() {
      this.examineFileArr = [];
      this.reportBasic = {};
      this.examineData = {};
      this.noneFile = false;
      this.laststate = "";
      this.reasonShow = false;
    },
    merageInit() {
      this.spanArr = [];
      this.spanPos = 0;
    },
    merage() {
      this.merageInit();
      for (let i = 0; i < this.areaDatas.length; i += 1) {
        // 第1列
        if (i === 0) {
          this.spanArr.push(1);
          this.spanPos = 0;
        } else {
          if (
            this.areaDatas[i].deptcategory ===
            this.areaDatas[i - 1].deptcategory
          ) {
            this.spanArr[this.spanPos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.spanPos = i;
          }
        }
      }
    },
    // 合并单元格
    typeSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // 第1列的合并方法
        const row = this.spanArr[rowIndex];
        const col = row > 0 ? 1 : 0; // 如果被合并了row = 0; 则他这个列需要取消
        return {
          rowspan: row,
          colspan: col
        };
      }
    }
  }
};
</script>

<style lang="scss">
</style>
