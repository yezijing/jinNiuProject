<template>
  <div class="addplan">
    <div v-if="isDetailShow">
      <div class="pbtn">
        <el-button @click="goback" size="small" type="primary">返 回</el-button>
        <el-button @click="toEdit" size="small" v-if="isEditShow" v-show="noEdit" :class="isCenter==2?'noeditbtn':''" type="primary">编辑</el-button>
      </div>
      <div class="addcontent" :style="ddheight">
        <el-row class="box jibeninfo" :gutter="30">
          <el-col :span="12">
            <fieldset>
              <legend>基本信息</legend>
              <div class="boxcontent">
                <el-form ref="basicInfo" size="small" :model="basicInfo" label-width="100px">
                  <el-form-item label="年度：" prop="yearname">
                    <el-input v-model="basicInfo.yearname" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="督查单位：" prop="superdept">
                    <el-input v-model="basicInfo.superdept" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="牵头区领导：" prop="leaders" class="qt">
                    <el-input v-model="basicInfo.leaders" readonly></el-input>
                  </el-form-item>
                  <el-form-item :label="typemodel==1?'恳请协调解决事项：':'协调解决事项：'" prop="nodeplan">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2}"
                      readonly
                      v-model="basicInfo.nodeplan"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="typemodel==1?'工作安排：':'市上总体安排：'" prop="workname">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 3}"
                      readonly
                      v-model="basicInfo.workname"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </fieldset>
          </el-col>
          <el-col :span="12">
            <fieldset>
              <legend>进展填报</legend>
              <div class="boxcontent">
                <el-button
                  @click="lookProgress"
                  style="margin-bottom:15px;"
                  size="small"
                  type="primary"
                >报送历史</el-button>
                <div class="speed">
                  <div class="pbox">
                    <p class="tt">进展情况：</p>
                    <div class="conbox">
                      <p v-for="(item, index) in newReportList" :key="index">{{item.question}}</p>
                    </div>
                  </div>
                  <div class="pbox">
                    <p class="tt">存在问题：</p>
                    <div class="conbox">
                      <p v-for="(item, index) in newReportList" :key="index">{{item.wenti}}</p>
                    </div>
                  </div>
                  <div class="pbox">
                    <p class="tt">下步工作计划：</p>
                    <div class="conbox">
                      <p v-for="(item, index) in newReportList" :key="index">{{item.measure}}</p>
                    </div>
                  </div>
                  <div class="pbox">
                    <p class="tt">经办人：</p>
                    <div class="conbox conbox2">
                      <p v-for="(item, index) in newReportList" :key="index">{{item.username}}</p>
                    </div>
                  </div>
                  <div class="pbox">
                    <p class="tt">联系方式：</p>
                    <div class="conbox conbox2">
                      <p v-for="(item, index) in newReportList" :key="index">{{item.contact}}</p>
                    </div>
                  </div>
                  <div class="filelist">
                    <p class="tt">附件</p>
                    <div class="list">
                      <div>
                        <div v-for="(item, index) in newReportList" :key="index">
                          <!-- <p
                            class="not"
                            v-if="item.newFiles==[] || item.newFiles==null || item.newFiles==''"
                          >无</p>-->
                          <div v-for="(sitem, kk) in item.newFiles" :key="kk">
                            <a
                              :href="sitem.url"
                              target="_blank"
                              style="text-align:left;"
                              class="filetitle"
                            >{{index+1}}. {{sitem.name}}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </el-col>
        </el-row>

        <el-row class="box" :gutter="30">
          <el-col :span="24">
            <fieldset style="width:100%;">
              <legend>报送规则</legend>
              <div class="boxcontent">
                <el-table
                  border
                  :data="ruleList"
                  highlight-current-row
                  style="width: 100%;"
                  class="tableinfo"
                  :cell-class-name="cellClassName"
                  height="200px"
                >
                  <el-table-column prop="stagename" label="阶段"></el-table-column>
                  <el-table-column prop="cycletype" label="报送周期">
                    <template slot-scope="scope">
                      <span v-html="ctypeFormat(scope,scope.row.cycletype)"></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="cycletime" label="日期">
                  <template slot-scope="scope">
                    <!-- 区间 -->
                    <p v-if="scope.row.cycletype==1">每隔{{scope.row.cycletime}}天</p>
                    <!-- 周 -->
                    <p v-if="scope.row.cycletype==2"><span v-html="weekFormat(scope,scope.row.cycletime)"></span></p>
                    <!-- 月 -->
                    <p v-else-if="scope.row.cycletype==3">{{scope.row.cycletime}}日</p>
                    <!-- 季度 -->
                    <p v-else-if="scope.row.cycletype==4">{{scope.row.cycletime}}日</p>
                    <!-- 天 -->
                    <p v-else-if="scope.row.cycletype==5">{{scope.row.cycletime}}</p>
                  </template>
                </el-table-column>
                  <el-table-column prop="warnday" label="提前预警(天)"></el-table-column>
                  <el-table-column prop="starttime" label="开始时间">
                    <template slot-scope="scope">
                      <span>{{scope.row.starttime | dateformat('YYYY-MM-DD')}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="endtime" :formatter="enddateToTime" label="结束时间"></el-table-column>
                  <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                      <div>
                        <el-tag size="medium">
                          <i class="fa mark" v-if="scope.row.status==1" style="background:#364e98;"></i>
                          <i
                            class="fa mark"
                            v-else-if="scope.row.status== 0"
                            style="background:#999;"
                          ></i>
                          <i class="fa mark" v-else></i>
                          <span v-html="stateFormat(scope,scope.row.status)"></span>
                        </el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template scope="scope">
                      <el-button class="btn" @click="detailRuleBtn(scope.$index, scope.row)">详情</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </fieldset>
          </el-col>
        </el-row>
        <!-- 牵头、责任单位 -->
        <el-row class="box" :gutter="30">
          <el-col :span="12">
            <fieldset>
              <legend>牵头单位</legend>
              <div class="boxcontent">
                <el-table
                  border
                  :data="leadsData"
                  highlight-current-row
                  style="width: 100%;"
                  height="250px"
                  class="tableinfo dtable"
                  :cell-class-name="cellClassName"
                >
                  <el-table-column prop="deptName" label="牵头单位"></el-table-column>
                  <el-table-column prop="leadername" label="责任领导"></el-table-column>
                  <el-table-column prop="agentname" label="经办人"></el-table-column>
                  <el-table-column prop="formstatus" label="报送状态">
                    <template slot-scope="scope">
                      <div>
                        <el-tag size="small">
                          <i
                            class="fa mark"
                            v-if="scope.row.formstatus==1"
                            style="background:#fbe804;"
                          ></i>
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
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120">
                    <template scope="scope">
                      <el-button class="btn" @click="handleDetail2(scope.$index, scope.row)">详情</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </fieldset>
          </el-col>
          <el-col :span="12">
            <fieldset>
              <legend>责任单位</legend>
              <div class="boxcontent">
                <el-table
                  border
                  :data="dutysData"
                  height="250px"
                  highlight-current-row
                  style="width: 100%;"
                  class="tableinfo dtable"
                  :cell-class-name="cellClassName"
                >
                  <el-table-column prop="deptName" label="责任单位"></el-table-column>
                  <el-table-column prop="leadername" label="责任领导"></el-table-column>
                  <el-table-column prop="agentname" label="经办人"></el-table-column>
                  <el-table-column label="操作" width="120">
                    <template scope="scope">
                      <el-button class="btn" @click="handleDetail3(scope.$index, scope.row)">详情</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </fieldset>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 历史进展汇报 -->
    <div class="history" v-if="isProgressShow">
      <p class="title">历史进展汇报</p>
      <div class="hbtns">
        <el-button @click="returnDetail2" size="small" type="primary">返 回</el-button>
      </div>
      <el-table
        class="tableinfo"
        border
        :data="progressData"
        highlight-current-row
        style="width: 100%;"
        :height="histableHeight"
      >
        <el-table-column prop="reportdept" label="报送单位"></el-table-column>
        <el-table-column prop="createtime" label="报送时间">
          <template slot-scope="scope">
            <span>{{scope.row.createtime | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="question" label="总体情况"></el-table-column>
        <el-table-column prop="wenti" label="存在问题"></el-table-column>
        <el-table-column prop="measure" label="下步工作计划"></el-table-column>
        <el-table-column prop="validate" label="审核状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.validate == 0" type="info" disable-transitions>
              <span>未审核</span>
            </el-tag>
            <el-tag v-else-if="scope.row.validate == 1" type="warning" disable-transitions>
              <span>审核未通过</span>
            </el-tag>
            <el-tag v-else type="success" disable-transitions>
              <span>审核通过</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="审核不通过原因">
          <template slot-scope="scope">
            <p v-html="nullFormat(scope,scope.row.reason)"></p>
          </template>
        </el-table-column>
        <el-table-column prop="filepath" label="附件">
          <template slot-scope="scope">
            <p v-if="scope.row.filepath==null || scope.row.filepath ==''">无</p>
            <a
              :href="item.url"
              target="_blank"
              style="text-align:left;"
              class="filetitle"
              v-for="(item, index) in scope.row.filepath"
              :key="index"
              v-else
            >{{index+1}}. {{item.name}}</a>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 规则详情 -->
    <el-dialog title="详情" :visible.sync="ruleVisible" width="700px" class="rule-dialog">
      <el-form
        :model="addRuleForm"
        :inline="true"
        label-width="93px"
        ref="addRuleForm"
        :append-to-body="true"
      >
        <el-form-item label="阶段：" prop="stagename">
          <el-input v-model="addRuleForm.stagename" readonly placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="提前：" class="day" prop="warnday">
          <el-input readonly v-model="addRuleForm.warnday">
            <template slot="append">天预警</template>
          </el-input>
        </el-form-item>
        <el-form-item label="报送周期：" prop="cycletype">
          <el-select
            v-model="addRuleForm.cycletype"
            clearable
            disabled
            placeholder="请选择"
            @change="cycleChange()"
          >
            <el-option
              v-for="item in submitType"
              :key="item.value"
              :label="item.type"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 1 区间 -->
        <el-form-item label="每隔：" class="day" prop="region" v-if="dateShow1">
          <el-input v-model="region" readonly>
            <template slot="append">天报送</template>
          </el-input>
        </el-form-item>
        <!-- 2 周 -->
        <el-form-item label="日期：" prop="weekday" v-if="dateShow2">
          <el-select v-model="weekday" disabled clearable placeholder="请选择">
            <el-option
              v-for="item in weekList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 3 月 -->
        <el-form-item label="日期：" prop="monthday" v-if="dateShow3">
          <el-select v-model="monthday" disabled clearable placeholder="请选择">
            <el-option
              v-for="item in timeday"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 4 季度 -->
        <el-form-item label="日期：" prop="quarter" v-if="dateShow4">
          <el-select v-model="quarter" disabled clearable placeholder="请选择">
            <el-option
              v-for="item in timeday"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 5 天 -->
        <el-form-item label="日期：" prop="daytime" v-if="dateShow5">
          <el-date-picker
            v-model="daytime"
            format="yyyy-MM-dd"
            type="date"
            readonly
            value-format="yyyy-MM-dd"
            placeholder="请选择"
          ></el-date-picker>
        </el-form-item>

        <el-form-item
          label="开始时间"
          prop="starttime"
          :rules="[{ required: true, message: '时间不能为空', trigger: 'change' }]"
        >
          <el-date-picker
            v-model="addRuleForm.starttime"
            format="yyyy-MM-dd"
            type="date"
            readonly
            value-format="yyyy-MM-dd"
            placeholder="请选择"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="结束时间"
          prop="endtime"
          :rules="[{ required: true, message: '时间不能为空', trigger: 'change' }]"
        >
          <el-date-picker
            v-model="addRuleForm.endtime"
            format="yyyy-MM-dd"
            type="date"
            readonly
            value-format="yyyy-MM-dd"
            placeholder="请选择"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ruleVisible=false" type="primary">{{ruleBtn}}</el-button>
      </div>
    </el-dialog>

    <!-- 牵头单位 -->
    <el-dialog
      :title="taskTitle"
      :visible.sync="addLeadVisible"
      width="800px"
      class="task-dialog task-dialog2"
    >
      <el-form
        :inline="true"
        :model="addLeadData"
        label-width="100px"
        ref="addLeadData"
        :append-to-body="true"
      >
        <div class="leabox">
          <el-form-item label="牵头单位：" prop="deptName">
            <el-input v-model="addLeadData.deptName"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="责任领导：" prop="leadername">
          <el-input v-model="addLeadData.leadername"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="leaderphone">
          <el-input v-model="addLeadData.leaderphone"></el-input>
        </el-form-item>
        <el-form-item label="经办人：" prop="agentname">
          <el-input v-model="addLeadData.agentname"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="agentphone">
          <el-input v-model="addLeadData.agentphone"></el-input>
        </el-form-item>
        <div class="leabox leabox2">
          <el-form-item label="工作职责：" prop="duty">
            <el-input type="textarea" :autosize="{ minRows: 5}" v-model="addLeadData.duty"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitLead" type="primary">{{changeWord}}</el-button>
      </div>
    </el-dialog>

    <!-- 新增责任单位 -->
    <el-dialog
      :title="taskTitle"
      :visible.sync="addDutyVisible"
      width="800px"
      class="task-dialog task-dialog2"
    >
      <el-form
        :inline="true"
        :model="addDutyData"
        label-width="100px"
        ref="addDutyData"
        :append-to-body="true"
      >
        <div class="leabox">
          <el-form-item label="责任单位：" prop="deptName">
            <el-input v-model="addDutyData.deptName"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="责任领导：" prop="leadername">
          <el-input v-model="addDutyData.leadername"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="leaderphone">
          <el-input v-model="addDutyData.leaderphone" :readonly="readOn"></el-input>
        </el-form-item>
        <el-form-item label="经办人：" prop="agentname">
          <el-input v-model="addDutyData.agentname" :readonly="readOn"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="agentphone">
          <el-input v-model="addDutyData.agentphone" :readonly="readOn"></el-input>
        </el-form-item>
        <div class="leabox leabox2">
          <el-form-item label="工作职责：" prop="duty">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5}"
              :readonly="readOn"
              v-model="addDutyData.duty"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="submitDuty" type="primary">{{changeWord}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reportPlanHistory, reportPlanHistory2 } from "../../api/workApi";
export default {
  props: [
    "ddheight",
    "leadsData",
    "dutysData",
    "isEditShow",
    "noEdit",
    "ruleList",
    "nodeList",
    "basicInfo",
    "reportDetail",
    "workid",
    "histableHeight",
    "typemodel",
    "newReportList"
  ],
  components: {},
  data() {
    return {
      addItemData: {},
      itemTitle: "",
      itemVisible: false,
      readOn: false,
      changeNum: "",
      changeWord: "",
      tindex: 0,
      isProgressShow: false, //进展汇报
      historyData: [], //历史回执
      progressData: [], //进展汇报
      isDetailShow: true,
      addLeadVisible: false,
      addDutyVisible: false,
      taskTitle: "",
      addLeadData: {},
      addDutyData: {},
      ruleVisible: false,
      ruleTitle: "",
      ruleBtn: "",
      addRuleForm: { cycletype: 1 }, //报送规则新增表单
      weekList: [
        { value: "1", name: "周一" },
        { value: "2", name: "周二" },
        { value: "3", name: "周三" },
        { value: "4", name: "周四" },
        { value: "5", name: "周五" },
        { value: "6", name: "周六" },
        { value: "7", name: "周日" }
      ],
      // 报送类型
      submitType: [
        { value: 1, type: "区间" },
        // { value: 2, type: "周" },
        { value: 3, type: "月" },
        { value: 4, type: "季度" },
        { value: 5, type: "天" }
      ],
      // 每月几号报送材料
      timeday: [
        { value: "1", name: "1日" },
        { value: "2", name: "2日" },
        { value: "3", name: "3日" },
        { value: "4", name: "4日" },
        { value: "5", name: "5日" },
        { value: "6", name: "6日" },
        { value: "7", name: "7日" },
        { value: "8", name: "8日" },
        { value: "9", name: "9日" },
        { value: "10", name: "10日" },
        { value: "11", name: "11日" },
        { value: "12", name: "12日" },
        { value: "13", name: "13日" },
        { value: "14", name: "14日" },
        { value: "15", name: "15日" },
        { value: "16", name: "16日" },
        { value: "17", name: "17日" },
        { value: "18", name: "18日" },
        { value: "19", name: "19日" },
        { value: "20", name: "20日" },
        { value: "21", name: "21日" },
        { value: "22", name: "22日" },
        { value: "23", name: "23日" },
        { value: "24", name: "24日" },
        { value: "25", name: "25日" },
        { value: "26", name: "26日" },
        { value: "27", name: "27日" },
        { value: "28", name: "28日" },
        { value: "29", name: "29日" },
        { value: "30", name: "30日" },
        { value: "31", name: "31日" }
      ],
      dateShow1: true, //区间
      dateShow2: false, //月
      dateShow3: false, //季度
      dateShow4: false, //周
      dateShow5: false, //天
      region: "", //区间
      monthday: "", //月
      quarter: "", //季度
      weekday: "", //周
      daytime: "", //天
      cycleNum: 1,
      ruleIndex: -1
    };
  },
  created() {},
  methods: {
    // 周转换
    weekFormat(scope, value) {
      switch (value) {
        case "1":
          return "周一";
          break;
        case "2":
          return "周二";
          break;
        case "3":
          return "周三";
          break;
        case "4":
          return "周四";
          break;
        case "5":
          return "周五";
          break;
        case "6":
          return "周六";
          break;
        case "7":
          return "周日";
          break;
      }
    },
    nullFormat(scope, value) {
      if (value == "null" || value == null) {
        return "<span>/</span>";
      } else {
        return "<span>" + value + "</span>";
      }
    },
    // 材料报送状态
    stateFormat(scope, value) {
      switch (value) {
        case 2:
          return "未执行";
          break;
        case 1:
          return "执行中";
          break;
        case 0:
          return "失效";
          break;
      }
    },
    // 详情
    detailRuleBtn(index, row) {
      var ctype = row.cycletype;
      switch (ctype) {
        case 1:
          this.dateShow1 = true;
          this.dateShow2 = false;
          this.dateShow3 = false;
          this.dateShow4 = false;
          this.dateShow5 = false;
          this.region = row.cycletime;
          break;
        case 2:
          this.dateShow2 = true;
          this.dateShow1 = false;
          this.dateShow3 = false;
          this.dateShow4 = false;
          this.dateShow5 = false;
          this.weekday = row.cycletime;
          break;
        case 3:
          this.dateShow3 = true;
          this.dateShow1 = false;
          this.dateShow2 = false;
          this.dateShow4 = false;
          this.dateShow5 = false;
          this.monthday = row.cycletime;
          break;
        case 4:
          this.dateShow4 = true;
          this.dateShow1 = false;
          this.dateShow2 = false;
          this.dateShow3 = false;
          this.dateShow5 = false;
          this.quarter = row.cycletime;
          break;
        case 5:
          this.dateShow5 = true;
          this.dateShow2 = false;
          this.dateShow3 = false;
          this.dateShow4 = false;
          this.dateShow1 = false;
          this.daytime = row.cycletime;
          break;
      }

      this.ruleVisible = true;
      this.ruleTitle = "报送规则详情";
      this.ruleBtn = "确定";
      this.changeNum = "detail";
      this.addRuleForm = Object.assign({}, row);
      this.addRuleForm.daytime = new Date(this.addRuleForm.daytime);
      this.addRuleForm.starttime = new Date(this.addRuleForm.starttime);
      this.addRuleForm.endtime = new Date(this.addRuleForm.endtime);
      this.ruleIndex = index;
    },
    // 周期
    ctypeFormat(scope, value) {
      switch (value) {
        case 1:
          return "区间";
          break;
        case 2:
          return "周";
          break;
        case 3:
          return "月";
          break;
        case 4:
          return "季度";
          break;
        case 5:
          return "天";
          break;
      }
    },
    // 报送周期不同，日期不同显示
    cycleChange() {
      this.cycleNum = this.addRuleForm.cycletype;
      switch (this.cycleNum) {
        case 1:
          this.dateShow1 = true;
          this.dateShow2 = false;
          this.dateShow3 = false;
          this.dateShow4 = false;
          this.dateShow5 = false;
          break;
        case 2:
          this.dateShow2 = true;
          this.dateShow1 = false;
          this.dateShow3 = false;
          this.dateShow4 = false;
          this.dateShow5 = false;
          break;
        case 3:
          this.dateShow3 = true;
          this.dateShow1 = false;
          this.dateShow2 = false;
          this.dateShow4 = false;
          this.dateShow5 = false;
          break;
        case 4:
          this.dateShow4 = true;
          this.dateShow1 = false;
          this.dateShow2 = false;
          this.dateShow3 = false;
          this.dateShow5 = false;
          break;
        case 5:
          this.dateShow5 = true;
          this.dateShow2 = false;
          this.dateShow3 = false;
          this.dateShow4 = false;
          this.dateShow1 = false;
          break;
      }
    },

    timestampToTime(row, column) {
      var date = new Date(row.stoptime);
      return row.stoptime | dateformat("YYYY-MM-DD HH:mm:ss");
    },
    enddateToTime(row, column) {
      var date = new Date(row.endtime);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      return Y + M + D;
    },

    timestampToTime2(row, column) {
      var date = new Date(row.createtime);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate();
      return Y + M + D;
    },
    toEdit() {
      this.$emit("edit-event");
    },
    // 报送状态
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
    // ----------------------牵头单位-------------------
    // 详情
    handleDetail2(index, row) {
      this.changeNum = "read";
      this.changeWord = "确认";
      this.taskTitle = "详情";
      this.readOn = true;
      this.addLeadVisible = true;
      this.addLeadData = Object.assign({}, row);
    },
    // 牵头单位弹窗-确认
    submitLead: function() {
      this.addLeadVisible = false;
    },
    // 牵头区领导

    // ----------------------责任单位-------------------
    // 详情
    handleDetail3(index, row) {
      this.changeNum = "read";
      this.changeWord = "确认";
      this.taskTitle = "详情";
      this.readOn = true;
      this.addDutyVisible = true;
      this.addDutyData = Object.assign({}, row);
    },
    // 责任单位弹窗-确认
    submitDuty: function() {
      this.addDutyVisible = false;
    },
    // 查看历史进展-返回
    returnDetail2() {
      this.isDetailShow = true;
      this.isProgressShow = false;
    },

    // 进展汇报
    lookProgress() {
      let para = { workid: this.workid };
      if (this.typemodel == 1) {
        reportPlanHistory(para, data => {
          this.progressData = data.data.obj;
          var arr = [];
          for (var i = 0; i < this.progressData.length; i++) {
            var files = this.progressData[i].filepath;
            var filearr = [];
            if (files == null) {
              filearr = [];
            } else {
              arr = files.split(",");
              var ll = arr.length;
              if (arr[ll - 1] == "") {
                arr.splice(ll - 1, 1);
              }
              var arr2 = arr;
              for (var j = 0; j < arr2.length; j++) {
                var obj = {};
                obj.url = this.imgIp + arr2[j];
                obj.name = arr2[j];
                filearr.push(obj);
              }
            }
            this.progressData[i].filepath = filearr;
          }
        });
        this.isDetailShow = false;
        this.isProgressShow = true;
      } else {
        reportPlanHistory2(para, data => {
          this.progressData = data.data.obj;
          var arr = [];
          for (var i = 0; i < this.progressData.length; i++) {
            var files = this.progressData[i].filepath;
            var filearr = [];
            if (files == null) {
              filearr = [];
            } else {
              arr = files.split(",");
              var ll = arr.length;
              if (arr[ll - 1] == "") {
                arr.splice(ll - 1, 1);
              }
              var arr2 = arr;
              for (var j = 0; j < arr2.length; j++) {
                var obj = {};
                obj.url = this.imgIp + arr2[j];
                obj.name = arr2[j];
                filearr.push(obj);
              }
            }
            this.progressData[i].filepath = filearr;
          }
        });
        this.isDetailShow = false;
        this.isProgressShow = true;
      }
    },

    goback() {
      this.$emit("my-event");
    },
    newYear() {
      let para = { name: this.yearname };
      // addProjectType(para, res => {
      //   this.$message({
      //     message: "新增成功",
      //     type: "success"
      //   });
      //   this.getTypes();
      //   this.yearname = "";
      // });
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
    }
  }
};
</script>

<style lang="scss">
.addplan {
  .filelist {
    padding: 0 30px;
    p {
      margin-bottom: 10px;
      font-size: 14px;
      color: #222;
      font-weight: bold;
    }
    .list {
      a {
        color: #1890ff;
        font-size: 14px;
        line-height: 2;
      }
      .not {
        margin-top: 10px;
        font-weight: normal;
      }
    }
  }
  .pbtn {
    margin-bottom: 20px;
  }
  .box {
    margin-bottom: 30px;
    .addbtn {
      margin-bottom: 10px;
    }
  }
  .history {
    .title {
      color: #222;
      font-size: 16px;
      font-weight: bold;
      margin: 0 0 15px;
    }
    .hbtns {
      margin: 10px 0;
    }
    .tableinfo {
      .filetitle {
        display: block;
        color: #1890ff;
        font-size: 13px;
      }
    }
  }
  .boxcontent {
    padding: 20px;
    .lastitem {
      margin-bottom: 0;
    }
    .label-style {
      .el-form-item__label {
        line-height: 1.4;
      }
    }
    .addwrap {
      display: flex;
      .addbox {
        margin-right: 30px;
      }
    }
    .addbox {
      .jiabtn {
        height: 36px;
        line-height: 36px;
        position: relative;
        display: inline-block;
        .icon {
          color: #666;
          font-size: 24px;
          display: inline-block;
          height: 36px;
          line-height: 36px;
          cursor: pointer;
        }
        .awrap {
          position: absolute;
          left: 44px;
          top: 0;
          border: 1px solid #ccc;
          background: #fff;
          width: 250px;
          padding: 5px 10px 10px;
          z-index: 99;
          p {
            color: #666;
          }
          .el-input__inner {
            width: 100%;
            margin-bottom: 10px;
          }
          .buttons {
            display: flex;
            justify-content: center;
            .el-button {
              padding: 8px 18px;
            }
          }
        }
      }
    }
  }
  .plan-dialog {
    .abox {
      .el-input-group__append {
        padding: 0 8px;
        background: #fff;
        border: 0;
        color: #222;
      }
      .el-input--prefix .el-input__inner {
        width: 200px;
      }
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 200px;
      }
      .el-input__inner {
        width: 200px;
      }
    }
    .el-form--inline {
      .abox2 {
        .el-form-item {
          display: block;
        }
        .el-form-item__content {
          .el-textarea {
            width: 535px;
          }
        }
        .el-form-item__label {
          line-height: 1.8;
        }
      }
    }
  }
  .goback {
    padding: 50px 0;
    display: flex;
    justify-content: flex-end;
    .el-button {
      padding: 10px 30px;
    }
    .el-button + .el-button {
      margin-left: 20px;
    }
  }
}
// 规则
.rule-dialog {
  .el-input-group__append,
  .el-input-group__prepend {
    color: #222;
    background: transparent;
    border: 0;
    padding: 0 5px;
  }
  .el-form-item {
    .el-input {
      width: 220px;
    }
  }
  .day {
    .el-input {
      width: 150px;
    }
  }
}
.jibeninfo {
  display: flex;
  align-items: stretch;
  fieldset {
    height: 100%;
  }
}
.speed {
  .pbox {
    display: flex;
    margin-bottom: 10px;
    .tt {
      color: #333;
      font-size: 14px;
      width: 110px;
      text-align: right;
      line-height: 2;
      padding-top: 3px;
      padding-right: 5px;
    }
    .conbox {
      flex: 1;
      color: #333;
      font-size: 14px;
      line-height: 2;
      border: 1px solid #dcdfe6;
      padding: 3px 10px;
      border-radius: 3px;
      min-height: 64px;
    }
    .conbox2 {
      min-height: 36px;
    }
  }
}
</style>
