<template>
  <div class="addproject">
    <div class="back">
      <el-button @click="goback" size="small" type="primary">返回</el-button>
    </div>
    <div class="addcontent" :style="theight">
      <el-row class="box" :gutter="20" style="display:flex;align-items:stretch;">
        <el-col :span="12">
          <fieldset style="height:100%;">
            <legend>基本信息</legend>
            <div class="boxcontent basicbox detail-basic2">
              <el-form
                label-width="120px"
                size="medium"
                ref="basicInfo"
                :rules="rules"
                :model="basicInfo"
              >
                <el-form-item label="项目名称：" prop="name">
                  <el-input placeholder="请输入名称" v-model="basicInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="项目业主：" prop="owndeptid">
                  <el-select
                    v-model="basicInfo.owndeptid"
                    filterable
                    clearable
                    placeholder="请选择"
                    @change="selectChange()"
                  >
                    <el-option
                      v-for="item in leadunits"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="牵头区领导：" prop="arealeadids" class="ww1">
                  <el-select
                    v-model="basicInfo.arealeadids"
                    filterable
                    collapse-tags
                    multiple
                    clearable
                    placeholder="请选择"
                    @change="selectChange"
                  >
                    <el-option
                      v-for="item in leaderUsers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属街道：" prop="streetids" class="ww1">
                  <el-select
                    v-model="basicInfo.streetids"
                    filterable
                    multiple
                    collapse-tags
                    clearable
                    placeholder="请选择"
                    @change="selectChange"
                  >
                    <el-option
                      v-for="item in streetdatas"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="项目类别：" prop="category">
                  <el-radio @change="selectChange" v-model="basicInfo.category" label="0">一般项目</el-radio>
                  <el-radio @change="selectChange" v-model="basicInfo.category" label="1">重点项目</el-radio>
                </el-form-item>
                <el-form-item label="项目地址：" prop="address">
                  <el-input placeholder="请输入" v-model="basicInfo.address"></el-input>
                </el-form-item>
                <el-form-item label="经纬度：" prop="mapitude">
                  <el-input placeholder="请输入" v-model="basicInfo.mapitude"></el-input>
                </el-form-item>
                <el-form-item label="报送要求：" prop="submitres">
                  <el-input type="textarea" :rows="2" v-model="basicInfo.submitres"></el-input>
                </el-form-item>
                <el-form-item label="项目描述：" prop="remark">
                  <el-input type="textarea" :rows="2" v-model="basicInfo.remark"></el-input>
                </el-form-item>
                <el-form-item label="目标任务：" prop="aimplan">
                  <el-input type="textarea" :rows="2" v-model="basicInfo.aimplan"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </fieldset>
        </el-col>
        <!-- 报送材料 -->
        <el-col :span="12">
          <fieldset class="plist" style="height:100%;overflow:hidden;">
            <legend>报送材料</legend>
            <div class="unitbox" style="padding:15px;">
              <div class="speed">
                <div class="pbox">
                  <p class="tt">上次进展情况：</p>
                  <div class="conbox">
                    <p v-for="(item, index) in lastprogress" :key="index">{{item.question}}</p>
                  </div>
                </div>
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
                        <div v-for="(sitem, index) in item.newFiles" :key="index">
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
      <!-- 牵头、责任单位 -->
      <el-row class="box" :gutter="40">
        <el-col :span="12">
          <fieldset>
            <legend>牵头单位</legend>
            <div class="boxcontent">
              <el-button class="addbtn" @click="addLead" size="small" type="primary">新 增</el-button>
              <el-table
                border
                :data="leadsData"
                highlight-current-row
                style="width: 100%;"
                class="tableinfo"
                :cell-class-name="cellClassName"
                height="150px"
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
                    <el-button class="btn" @click="handleEdit2(scope.$index, scope.row)">编辑</el-button>
                    <el-button class="btn" @click="handleDelete2(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </fieldset>
          <br />
          <fieldset>
            <legend>责任单位</legend>
            <div class="boxcontent">
              <el-button class="addbtn" @click="addDuty" size="small" type="primary">新 增</el-button>
              <el-table
                border
                :data="dutysData"
                highlight-current-row
                style="width: 100%;"
                class="tableinfo"
                :cell-class-name="cellClassName"
                height="150px"
              >
                <el-table-column prop="deptName" label="责任单位"></el-table-column>
                <el-table-column prop="leadername" label="责任领导"></el-table-column>
                <el-table-column prop="agentname" label="经办人"></el-table-column>
                <el-table-column label="操作" width="120">
                  <template scope="scope">
                    <el-button class="btn" @click="handleEdit3(scope.$index, scope.row)">编辑</el-button>
                    <el-button class="btn" @click="handleDelete3(scope.$index, scope.row)">删除</el-button>
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
              <el-button class="addbtn" @click="addRuleBtn" size="small" type="primary">新 增</el-button>
              <el-table
                border
                :data="ruleList"
                highlight-current-row
                style="width: 100%;"
                class="tableinfo"
                :cell-class-name="cellClassName"
                height="435px"
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
                    <p v-if="scope.row.cycletype==2">{{scope.row.cycletime}}</p>
                    <!-- 月 -->
                    <p v-else-if="scope.row.cycletype==3">{{scope.row.cycletime}}日</p>
                    <!-- 季度 -->
                    <p v-else-if="scope.row.cycletype==4">{{scope.row.cycletime}}日</p>
                    <!-- 天 -->
                    <p v-else-if="scope.row.cycletype==5">{{scope.row.cycletime}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="warnday" width="110px" label="提前预警(天)"></el-table-column>
                <el-table-column prop="starttime" :formatter="starttimeToTime" label="开始时间"></el-table-column>
                <el-table-column prop="endtime" :formatter="endtimeToTime" label="结束时间"></el-table-column>
                <el-table-column label="操作">
                  <template scope="scope">
                    <el-button class="btn" @click="editRuleBtn(scope.$index, scope.row)">编辑</el-button>
                    <el-button class="btn" @click="delRuleBtn(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </fieldset>
        </el-col>
      </el-row>
    </div>
    <div class="goback">
      <el-button @click="goback" type="warning" size="small">取 消</el-button>
      <el-button @click="projectSubmitAll" size="small" type="primary">保 存</el-button>
    </div>

    <!-- 新增报送规则 -->
    <el-dialog :title="ruleTitle" :visible.sync="ruleVisible" width="700px" class="rule-dialog">
      <el-form
        :model="addRuleForm"
        label-width="93px"
        :inline="true"
        ref="addRuleForm"
        :append-to-body="true"
        size="small"
      >
        <el-form-item label="阶段：" prop="stagename">
          <el-input v-model="addRuleForm.stagename" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="提前：" class="day" prop="warnday">
          <el-input v-model="addRuleForm.warnday">
            <template slot="append">天预警</template>
          </el-input>
        </el-form-item>
        <el-form-item label="报送周期：" prop="cycletype">
          <el-select
            v-model="addRuleForm.cycletype"
            clearable
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
          <el-input v-model="region">
            <template slot="append">天报送</template>
          </el-input>
        </el-form-item>
        <!-- 2 周 -->
        <el-form-item label="日期：" prop="weekday" v-if="dateShow2">
          <el-select v-model="weekday" clearable placeholder="请选择">
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
          <el-select v-model="monthday" clearable placeholder="请选择">
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
          <el-select v-model="quarter" clearable placeholder="请选择">
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
            value-format="yyyy-MM-dd"
            placeholder="请选择"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitRule" type="primary">{{ruleBtn}}</el-button>
      </div>
    </el-dialog>

    <!-- 新增牵头单位 -->
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
          <el-form-item
            label="牵头单位："
            prop="deptid"
            :rules="[{ required: true, message: '请选择牵头单位', trigger: 'change' }]"
          >
            <el-select
              v-model="addLeadData.deptid"
              clearable
              filterable
              placeholder="请选择"
              @change="deptChange"
            >
              <el-option
                v-for="item in leadunits"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
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
            <el-input type="textarea" :autosize="{ minRows: 10}" v-model="addLeadData.duty"></el-input>
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
          <el-form-item
            label="责任单位："
            prop="deptid"
            :rules="[{ required: true, message: '请选择责任单位', trigger: 'change' }]"
          >
            <el-select
              v-model="addDutyData.deptid"
              @change="deptChange2"
              clearable
              filterable
              :readonly="readOn"
              placeholder="请选择"
            >
              <el-option
                v-for="item in leadunits"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
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
              :autosize="{ minRows: 10}"
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
import {
  projectTypeList,
  addProjectType,
  editProject,
  targetOver,
  targetbyId,
  targetLag,
  changeFormstate,
  synchFormstate,
  getAllProject,
  checkReportRules
} from "../../api/projectApi";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  props: [
    "leadunits",
    "users",
    "projectId",
    "basicInfo",
    "leadsData",
    "dutysData",
    "leaderUsers",
    "types",
    "streetdatas",
    "theight",
    "ruleList",
    "newReportList",
    "lastprogress"
  ],
  components: {},
  data() {
    return {
      checkAll: false,
      checkedItems: [],
      allitems: [],
      isIndeterminate: false,
      choosenum: 0,
      hasitem: [],
      // end
      newtask: "",
      taskShow: false,
      addTaskData: { status: 0 },
      addLeadData: {},
      addDutyData: {},
      rules: {
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        arealeadids: [
          { required: true, message: "请选择牵头区领导", trigger: "blur" }
        ],
        typeid: [{ required: true, message: "请选择项目类型", trigger: "blur" }]
      },
      addTaskVisible: false,
      addLeadVisible: false,
      addDutyVisible: false,
      changeNum: "",
      changeWord: "",
      tindex: "-1",
      readOn: false,
      taskTitle: "",
      ruleVisible: false,
      dateShow1: false, //区间
      dateShow2: false, //月
      dateShow3: false, //季度
      dateShow4: false, //周
      dateShow5: false, //天
      region: "", //区间
      monthday: "", //月
      quarter: "", //季度
      weekday: "", //周
      daytime: "", //天
      ruleTitle: "",
      ruleBtn: "",
      cycleNum: 0,
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
      ruleIndex: -1,
    };
  },
  created() {
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
    endtimeToTime(row, column) {
      var date = new Date(row.endtime);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate();
      return Y + M + D;
    },
    starttimeToTime(row, column) {
      var date = new Date(row.starttime);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate();
      return Y + M + D;
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
    // 报送规则新增
    addRuleBtn() {
      this.ruleVisible = true;
      this.ruleTitle = "新增报送规则";
      this.ruleBtn = "新增";
      this.changeNum = "add";
      this.addRuleForm = { cycletype: 1 };
      this.cycleChange();
    },
    // 新增提交
    addRuleSubmit() {
      this.$refs.addRuleForm.validate(valid => {
        if (valid) {
          this.cycleNum = this.addRuleForm.cycletype;
          if (this.cycleNum == 1) {
            this.addRuleForm.cycletime = this.region; //区间
          } else if (this.cycleNum == 2) {
            this.addRuleForm.cycletime = this.weekday; //周
          } else if (this.cycleNum == 3) {
            this.addRuleForm.cycletime = this.monthday; //月
          } else if (this.cycleNum == 4) {
            this.addRuleForm.cycletime = this.quarter; //季度
          } else if (this.cycleNum == 5) {
            this.addRuleForm.cycletime = this.daytime; //天
          }
          let para = Object.assign({}, this.addRuleForm);
          this.ruleList.push(para);
          this.$refs["addRuleForm"].resetFields();
          this.ruleVisible = false;
          this.ruleTitle = "";
          this.ruleBtn = "";
          this.changeNum = "";
          this.cycleNum = 0;
        } else {
          return false;
        }
      });
    },
    // 编辑
    editRuleBtn(index, row) {
      if (row.pidList) {
        this.checkedItems = row.pidList;
      } else {
        this.checkedItems = [];
      }
      this.hasitem = [];
      var ctype = row.cycletype;
      this.cycleNum = row.cycletype;
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
      this.ruleTitle = "编辑报送规则";
      this.ruleBtn = "保存";
      this.changeNum = "edit";
      this.addRuleForm = Object.assign({}, row);
      this.addRuleForm.endtime = new Date(this.addRuleForm.endtime);
      this.addRuleForm.starttime = new Date(this.addRuleForm.starttime);
      this.addRuleForm.endtime = new Date(this.addRuleForm.endtime);
      this.ruleIndex = index;
    },
    // 编辑提交
    editRuleSubmit() {
      this.$refs.addRuleForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addRuleForm);
          this.cycleNum = this.addRuleForm.cycletype;
          if (this.cycleNum == 1) {
            para.cycletime = this.region; //区间
          } else if (this.cycleNum == 2) {
            para.cycletime = this.weekday; //周
          } else if (this.cycleNum == 3) {
            para.cycletime = this.monthday; //月
          } else if (this.cycleNum == 4) {
            para.cycletime = this.quarter; //季度
          } else if (this.cycleNum == 5) {
            para.cycletime = this.daytime; //天
          }
          this.ruleList.splice(this.ruleIndex, 1, para);
          this.$refs["addRuleForm"].resetFields();
          this.ruleVisible = false;
          this.ruleIndex = -1;
          this.ruleTitle = "";
          this.ruleBtn = "";
          this.changeNum = "";
          this.cycleNum = 0;
        } else {
          return false;
        }
      });
    },
    // 删除
    delRuleBtn(index, row) {
      this.ruleList.splice(index, 1);
      this.ruleVisible = false;
      this.$message({
        message: "删除成功",
        type: "success"
      });
    },
    // 报送规则提交
    submitRule() {
      if (this.changeNum == "add") {
        this.addRuleSubmit();
      } else {
        this.editRuleSubmit();
      }
    },
    selectChange() {
      this.$forceUpdate();
    },
    timestampToTime(row, column) {
      var date = new Date(row.stoptime);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      return Y + M + D;
    },
    // 获取项目类型列表
    getTypes: function() {
      projectTypeList("", data => {
        this.types = data.data.obj;
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status == -1) {
        return "noedit";
      } else if (row.status == 3) {
        return "lagbtn";
      }
    },
    // 新增项目类型
    newTask() {
      let para = { name: this.newtask };
      addProjectType(para, res => {
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.getTypes();
        this.newtask = "";
      });
    },
    goback() {
      this.$confirm(
        "<span style='color:#f00;'>数据未保存</span>，确定返回列表吗？",
        "提示",
        {
          dangerouslyUseHTMLString: true,
          type: "warning",
          center: true,
          modal: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(() => {
          this.$emit("my-event");
        })
        .catch(() => {
          return false;
        });
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
    testFuc() {
      console.log(this.basicInfo.streetids);
    },

    // ----------------------牵头单位-------------------
    // 新增牵头单位
    addLead: function() {
      this.changeNum = "add";
      this.changeWord = "新增";
      this.taskTitle = "新增牵头单位";
      this.readOn = false;
      this.addLeadVisible = true;
    },
    // 详情
    handleDetail2(index, row) {
      this.changeNum = "read";
      this.changeWord = "确认";
      this.taskTitle = "详情";
      this.readOn = true;
      this.addLeadVisible = true;
      this.addLeadData = Object.assign({}, row);
    },
    // 编辑
    handleEdit2(index, row) {
      this.changeNum = "edit";
      this.changeWord = "保存";
      this.taskTitle = "编辑牵头单位";
      this.readOn = false;
      this.addLeadVisible = true;
      this.addLeadData = Object.assign({}, row);
      this.tindex = index;
    },
    // 牵头单位弹窗-确认
    submitLead: function() {
      if (this.changeNum == "read") {
        this.addLeadVisible = false;
      } else if (this.changeNum == "add") {
        this.addLeadSubmit();
      } else {
        this.editLeadSubmit();
      }
    },
    deptChange() {
      let deptname = "";
      let leadid = "";
      let deptphone = "";
      let leadname = "";
      for (var i = 0; i < this.leadunits.length; i++) {
        if (this.leadunits[i].id == this.addLeadData.deptid) {
          deptname = this.leadunits[i].name;
          leadid = this.leadunits[i].deptLeader;
          deptphone = this.leadunits[i].deptphone;
          break;
        }
      }
      for (var j = 0; j < this.users.length; j++) {
        if (this.users[j].id == leadid) {
          leadname = this.users[j].name;
          break;
        }
      }
      this.addLeadData.deptName = deptname;
      this.addLeadData.leaderid = leadid;
      this.addLeadData.leadername = leadname;
      this.addLeadData.leaderphone = deptphone;
    },
    // 新增牵头单位提交
    addLeadSubmit: function() {
      this.$refs.addLeadData.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addLeadData);
          this.leadsData.push(para);
          this.$refs["addLeadData"].resetFields();
          this.addLeadVisible = false;
        } else {
          console.log("error");
          return false;
        }
      });
    },
    // 编辑牵头单位提交
    editLeadSubmit: function() {
      this.$refs.addLeadData.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addLeadData);
          this.leadsData.splice(this.tindex, 1, para);
          this.$refs["addLeadData"].resetFields();
          this.addLeadVisible = false;
          console.log(this.leadsData)
        } else {
          return false;
        }
      });
    },

    // 删除牵头单位
    handleDelete2(index, row) {
      this.leadsData.splice(index, 1);
      this.$refs["addLeadData"].resetFields();
      this.addLeadVisible = false;
      this.$message({
        message: "删除成功",
        type: "success"
      });
    },

    // ----------------------责任单位-------------------
    // 新增责任单位
    addDuty: function() {
      this.changeNum = "add";
      this.changeWord = "新增";
      this.taskTitle = "新增责任单位";
      this.readOn = false;
      this.addDutyVisible = true;
    },
    // 详情
    handleDetail3(index, row) {
      this.changeNum = "read";
      this.changeWord = "确认";
      this.taskTitle = "详情";
      this.readOn = true;
      this.addDutyVisible = true;
      this.addDutyData = Object.assign({}, row);
    },
    // 编辑
    handleEdit3(index, row) {
      this.changeNum = "edit";
      this.changeWord = "保存";
      this.taskTitle = "编辑责任单位";
      this.readOn = false;
      this.addDutyVisible = true;
      this.addDutyData = Object.assign({}, row);
      this.tindex = index;
    },
    // 责任单位弹窗-确认
    submitDuty: function() {
      if (this.changeNum == "read") {
        this.addDutyVisible = false;
      } else if (this.changeNum == "add") {
        this.addDutySubmit();
      } else {
        this.editDutySubmit();
      }
    },
    deptChange2() {
      let deptname = "";
      let leadid = "";
      let deptphone = "";
      let leadname = "";
      for (var i = 0; i < this.leadunits.length; i++) {
        if (this.leadunits[i].id == this.addDutyData.deptid) {
          deptname = this.leadunits[i].name;
          leadid = this.leadunits[i].deptLeader;
          deptphone = this.leadunits[i].deptphone;
          break;
        }
      }
      for (var j = 0; j < this.users.length; j++) {
        if (this.users[j].id == leadid) {
          leadname = this.users[j].name;
          break;
        }
      }
      this.addLeadData.leaderid = leadid;
      this.addDutyData.deptName = deptname;
      this.addDutyData.leadername = leadname;
      this.addDutyData.leaderphone = deptphone;
    },
    // 新增责任单位提交
    addDutySubmit: function() {
      this.$refs.addDutyData.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addDutyData);
          this.dutysData.push(para);
          this.$refs["addDutyData"].resetFields();
          this.addDutyVisible = false;
        } else {
          return false;
        }
      });
    },
    // 编辑责任单位提交
    editDutySubmit: function() {
      this.$refs.addDutyData.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addDutyData);
          this.dutysData.splice(this.tindex, 1, para);
          this.$refs["addDutyData"].resetFields();
          this.addDutyVisible = false;
        } else {
          return false;
        }
      });
    },
    // 删除责任单位
    handleDelete3(index, row) {
      this.dutysData.splice(index, 1);
      this.$refs["addDutyData"].resetFields();
      this.addDutyVisible = false;
      this.$message({
        message: "删除成功",
        type: "success"
      });
    },

    // 提交所有数据 ---保存-----------
    projectSubmitAll: function() {
      // this.$refs.basicInfo.validate(valid => {
      //   if (valid) {
      var str = "";
      for (var i = 0; i < this.basicInfo.streetids.length; i++) {
        str += this.basicInfo.streetids[i] + ",";
      }
      this.basicInfo.streetids = str;
      if (this.basicInfo.streetids.length > 1) {
        str = str.substr(0, str.length - 1);
      }

      // 牵头区领导id集合
      if (this.basicInfo.arealeadids.length == 0) {
        this.basicInfo.arealeadids = "";
      } else {
        if (this.basicInfo.arealeadids.length == 1) {
          this.basicInfo.arealeadids = this.basicInfo.arealeadids[0] + ",";
        } else {
          this.basicInfo.arealeadids = this.basicInfo.arealeadids.join(",");
        }
      }
      let para = this.basicInfo;
      para.leaderList = this.leadsData;
      para.dutyList = this.dutysData;
      para.ruleList = this.ruleList;
      para.id = this.projectId;
      para = JSON.stringify(para);

      editProject(para, res => {
        let cpara = { pid: this.projectId };
        changeFormstate(cpara, data => {
          synchFormstate({ pid: this.projectId }, ress => {
            this.$emit("my-event");
            this.$emit("mykey-event");
            this.$message({
              message: "提交成功",
              type: "success"
            });
          });
        });
      });
      // } else {
      //   return false;
      // }
      // });
    }
  }
};
</script>

<style lang="scss">
.addproject {
  padding-top: 20px;
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
  .sxtitle {
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    // cursor: pointer;
    text-align: left;
  }
  .addcontent {
    overflow-y: auto;
    overflow-x: hidden;
    padding: 8px;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
  }
  .back {
    margin-bottom: 20px;
  }
  .jiabtn {
    height: 36px;
    line-height: 36px;
    position: relative;
    .icon {
      color: #666;
      font-size: 24px;
      display: inline-block;
      height: 36px;
      line-height: 36px;
      padding: 0 10px;
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
      .el-textarea {
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
  .box {
    margin-bottom: 30px;
    .boxcontent {
      padding: 20px;
      .addbtn {
        margin-bottom: 20px;
      }
    }
    .detail-basic2 {
      .el-form-item {
        margin-bottom: 18px;
      }
      .el-select {
        display: block;
      }
    }
    .basicbox {
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
    }
  }
  .task-dialog {
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
}
.filelist {
  padding: 0 30px;
  .tt {
    color: #222;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .list {
    a {
      display: block;
      line-height: 2;
      font-size: 14px;
      color: #1890ff;
    }
    .not {
      margin-top: 15px;
      font-weight: normal;
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
</style>
