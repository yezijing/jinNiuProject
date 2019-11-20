<template>
  <div class="addproject">
    <div v-if="isDetailShow">
      <div class="pback">
        <el-button @click="goback" size="small" type="primary">返 回</el-button>
        <el-button
          class="editbtn"
          @click="toEdit"
          size="small"
          v-if="isEditShow"
          v-show="noEdit"
          type="primary"
          :class="isCenter==2?'noeditbtn':''"
        >编辑</el-button>
      </div>
      <div class="addcontent" :style="addheight2">
        <el-row class="box abox" :gutter="40">
          <el-col :span="12" class="detail-info">
            <fieldset>
              <legend>基本信息</legend>
              <div class="boxcontent basicbox">
                <el-form label-width="110px" size="small" ref="basicInfo" :model="basicInfo">
                  <el-form-item label="编号：" prop="code">
                    <el-input readonly v-model="basicInfo.code"></el-input>
                  </el-form-item>
                  <el-form-item label="立项时间：" prop="starttime">
                    <el-date-picker
                      v-model="basicInfo.starttime"
                      readonly
                      type="date"
                      class="el-input-datebox"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="任务来源：" prop="tasksource">
                    <el-input readonly v-model="basicInfo.tasksource"></el-input>
                  </el-form-item>
                  <el-form-item label="牵头区领导：" prop="arealeadids" class="qt">
                    <el-select
                      v-model="basicInfo.arealeadids"
                      multiple
                      clearable
                      disabled
                      class="item-select"
                    >
                      <el-option
                        v-for="item in leaderUsers"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="工作要求：" prop="jobrequire" class="lastitem">
                    <el-input type="textarea" :rows="6" readonly v-model="basicInfo.jobrequire"></el-input>
                  </el-form-item>
                </el-form>
                <div class="stateId">
                  <img :src="statusLabel[imgNum]" alt />
                </div>
              </div>
            </fieldset>
          </el-col>
          <el-col :span="12">
            <fieldset>
              <legend>进展汇报</legend>
              <div class="boxcontent">
                <el-button
                  @click="lookHistory"
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
                  <div class="filelist">
                    <p class="tt">附件</p>
                    <div class="list">
                      <div>
                        <div v-for="(item, index) in newReportList" :key="index">
                          <!-- <p class="not" v-if="item.newFiles==[] || item.newFiles==null || item.newFiles==''">无</p> -->
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
        <!-- 督办事项 -->
        <el-row class="box" :gutter="20">
          <el-col :span="12">
            <fieldset>
              <legend>督办事项</legend>
              <div class="boxcontent">
                <el-table
                  border
                  :data="checkMeetList"
                  highlight-current-row
                  style="width: 100%;"
                  class="tableinfo"
                  :cell-class-name="cellClassName"
                  height="200px"
                >
                  <el-table-column prop="remark" label="督办事项">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" placement="top-start">
                        <div
                          style="max-width:150px;line-height:2;"
                          slot="content"
                        >{{scope.row.remark}}</div>
                        <p class="sxtitle">{{scope.row.remark}}</p>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="stoptime" label="时间节点">
                    <template slot-scope="scope">
                      <span>{{scope.row.stoptime | dateformat('YYYY-MM-DD')}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </fieldset>
          </el-col>
          <el-col :span="12">
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
                      <p v-if="scope.row.cycletype==2">
                        <span v-html="weekFormat(scope,scope.row.cycletime)"></span>
                      </p>
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
        <el-row class="box" :gutter="40">
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
        <div class="upfile">
          <p class="tt">附件</p>
          <a
            v-for="(item, index) in fileArr"
            target="_blank"
            :key="index"
            :href="item.url"
          >{{item.name}}</a>
        </div>
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

      <!-- 事项详情 -->
      <el-dialog title="详情" :visible.sync="itemVisible" width="800px" class="task-dialog">
        <el-form
          :model="addItemData"
          label-width="120px"
          size="small"
          ref="addItemData"
          :append-to-body="true"
        >
          <el-form-item label="督办事项：" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5}"
              :readonly="readOn"
              v-model="addItemData.remark"
            ></el-input>
          </el-form-item>
          <el-form-item label="截止报送时间：" prop="stoptime">
            <el-date-picker
              v-model="addItemData.stoptime"
              format="yyyy-MM-dd"
              type="date"
              :readonly="readOn"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="itemVisible = false;" size="small" type="primary">确定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 历史回执 -->
    <div class="history" v-if="isHistoryShow">
      <p class="title">报送历史</p>
      <div class="hbtns">
        <el-button @click="returnDetail" size="small" type="primary">返 回</el-button>
      </div>
      <el-table
        class="tableinfo"
        border
        :data="historyData"
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
        <el-table-column prop="question" label="进展情况"></el-table-column>
        <el-table-column prop="wenti" label="存在问题"></el-table-column>
        <el-table-column prop="measure" label="下步工作计划"></el-table-column>
        <el-table-column prop="filepath" label="附件">
          <template slot-scope="scope">
            <a
              :href="item.url"
              target="_blank"
              style="text-align:left;"
              class="filetitle"
              v-for="(item, index) in scope.row.filepath"
              :key="index"
            >{{index+1}}. {{item.name}}</a>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
import { upfile, imgIp } from "../../api/imgUrl";
import { historyAssign } from "../../api/assignApi";
export default {
  components: {},
  props: [
    "basicInfo",
    "deptlist",
    "checkMeetList",
    "addheight2",
    "histableHeight",
    "aid",
    "leaderUsers",
    "ruleList",
    "checkReceipt",
    "isEditShow",
    "noEdit",
    "leadsData",
    "dutysData",
    "newReportList",
    "fileArr",
    "isCenter"
  ],
  data() {
    return {
      statusLabel: [
        "../../../static/images/s0.png",
        "../../../static/images/s1.png",
        "../../../static/images/s2.png",
        "../../../static/images/s3.png"
      ],
      imgNum: "",
      addItemData: {},
      itemVisible: false,
      readOn: false,
      upfile: "",
      imgIp: "",
      isDetailShow: true,
      isHistoryShow: false,
      historyData: [],
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
      ruleIndex: -1,
      addLeadVisible: false,
      addDutyVisible: false,
      changeNum: "",
      changeWord: "",
      tindex: "-1",
      readOn: false,
      taskTitle: "",
      addLeadData: {},
      addDutyData: {}
    };
  },
  created() {
    this.upfile = upfile;
    this.imgIp = imgIp;
    this.statusImg();
  },
  methods: {
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

    toEdit() {
      this.$emit("edit-event");
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
      var date = new Date(row.stoptime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      // var Y = date.getFullYear() + "-";
      // var M =
      //   (date.getMonth() + 1 < 10
      //     ? "0" + (date.getMonth() + 1)
      //     : date.getMonth() + 1) + "-";
      // var D = date.getDate() + " ";
      // return Y + M + D;

      // this.$moment('string').format("YYYY-DD-MM")

      // return this.$moment(row.stoptime).format("YYYY-DD-MM");
      return row.stoptime | dateformat("YYYY-MM-DD HH:mm:ss");
    },
    enddateToTime(row, column) {
      var date = new Date(row.endtime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      return Y + M + D;
    },

    timestampToTime2(row, column) {
      var date = new Date(row.createtime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate();
      return Y + M + D;
    },
    // 查看历史回执
    lookHistory() {
      let para = { checkid: this.aid };
      historyAssign(para, data => {
        this.historyData = data.data.obj;
        var arr = [];
        for (var i = 0; i < this.historyData.length; i++) {
          var files = this.historyData[i].filepath;
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
          this.historyData[i].filepath = filearr;
        }
      });
      this.isDetailShow = false;
      this.isHistoryShow = true;
    },
    // 查看历史回执-返回
    returnDetail() {
      this.isDetailShow = true;
      this.isHistoryShow = false;
    },
    // 不同状态标识
    statusImg() {
      switch (this.basicInfo.status) {
        case 0:
          return (this.imgNum = 0);
          break;
        case 1:
          return (this.imgNum = 1);
          break;
        case 2:
          return (this.imgNum = 2);
          break;
        case -1:
          return (this.imgNum = 3);
          break;
          return "";
      }
    },
    goback() {
      if (this.isCenter==1) {
        this.$router.push({
          path: "/index"
        });
      } else if(this.isCenter==2) {
        this.$router.push({
          path: "/personCenter"
        });
      }else{
        this.$emit("my-event");
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
    // 详情
    handleDetail(index, row) {
      this.readOn = true;
      this.itemVisible = true;
      this.addItemData = Object.assign({}, row);
    }
  }
};
</script>

<style lang="scss">
.addproject {
  padding-top: 20px;
  .sxtitle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    text-align: left;
  }
  .detail-info {
    .el-select {
      .el-input.is-disabled .el-input__inner {
        cursor: pointer;
        color: #606266;
        background: #fff;
      }
    }
  }
  .lookhistory {
    color: #1890ff;
    font-size: 14px;
    display: block;
    margin-bottom: 15px;
    cursor: pointer;
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
  .assign-left {
    padding-right: 20px;
  }
  .assign-right {
    padding-left: 40px;
  }
  .box {
    margin-bottom: 30px;
    .boxcontent {
      padding: 20px;
      .dbtn {
        margin-bottom: 20px;
        display: block;
        padding: 0 10px;
      }
      .addbtn {
        margin-bottom: 20px;
      }
    }
    .basicbox {
      padding-right: 84px !important;
      position: relative;
      .stateId {
        position: absolute;
        right: -19px;
        top: -29px;
        width: 150px;
        height: 150px;
        img {
          width: 100%;
        }
      }
      .blist {
        display: flex;
        .el-form-item {
          flex: 1;
          display: flex;
          .el-form-item__content {
            flex: 1;
            .el-select {
              width: 100%;
            }
          }
        }
      }
      .qt {
        .el-select {
          width: 100%;
        }
      }
    }
  }
  .abox {
    display: flex;
    align-items: stretch;
    fieldset {
      height: 100%;
    }
  }
  .task-dialog {
    .item-select {
      display: block;
    }
    .taskbox {
      display: flex;
      .day {
        .el-input__inner {
          width: 80px;
          border-radius: 4px;
        }
        .el-input-group__append {
          padding: 0 8px;
          background: #fff;
          border: 0;
        }
      }
    }
    .leabox {
      .el-form-item {
        width: 100%;
      }
    }
  }
  .task-dialog2 {
    .el-form--inline .el-form-item__content {
      width: 260px;
      .el-select {
        width: 100%;
      }
    }
    .leabox2 {
      .el-form-item__content {
        width: 634px;
      }
    }
  }
  .pback {
    margin-bottom: 20px;
  }
  .goback {
    padding: 30px 0 10px;
    display: flex;
    justify-content: flex-end;
    .el-button {
      padding: 10px 30px;
    }
    .el-button + .el-button {
      margin-left: 20px;
    }
  }
  .upfile {
    max-width: 100%;
    .tt {
      color: #1890ff;
      font-size: 14px;
      margin-bottom: 10px;
    }
    a {
      color: #1890ff;
      font-size: 14px;
      display: block;
      line-height: 2;
    }
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item.lastitem {
    margin-bottom: 0;
  }
  .el-form-item.lastitem2 {
    .el-form-item__label {
      line-height: 1.4;
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
  .el-select {
    .el-input.is-disabled .el-input__inner {
      cursor: pointer;
      color: #606266;
      background: #fff;
    }
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
  }
}
</style>
