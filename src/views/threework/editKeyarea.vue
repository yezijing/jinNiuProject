<template>
  <div class="addplan">
    <div class="pbtn">
      <el-button @click="goback" size="small" type="primary">返 回</el-button>
    </div>
    <div class="addcontent" :style="addheight">
      <el-row class="box jibeninfo" :gutter="30">
        <el-col :span="12">
          <fieldset>
            <legend>基本信息</legend>
            <div class="boxcontent editplanwrap">
              <el-form label-width="110px" size="medium" ref="basicInfo" :model="basicInfo">
                <div class="addbox">
                  <el-form-item
                    label="年度："
                    prop="yearid"
                    :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
                  >
                    <el-select
                      v-model="basicInfo.yearid"
                      filterable
                      clearable
                      placeholder="请选择"
                      @focus="getyear"
                      @change="selectChange"
                    >
                      <el-option
                        v-for="item in years"
                        :key="item.id"
                        :label="item.year"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <div class="jiabtn">
                    <i class="icon el-icon-circle-plus" @click="yearShow = true"></i>
                    <div class="awrap" v-if="yearShow">
                      <p>新增</p>
                      <el-input placeholder="请输入" v-model="yearname"></el-input>
                      <div class="buttons">
                        <el-button @click="yearShow = false">取消</el-button>
                        <el-button @click="newYear" type="primary">确定</el-button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="addbox">
                  <el-form-item label="牵头区领导：" prop="arealeadids" class="ww1">
                    <el-select
                      v-model="basicInfo.arealeadids"
                      multiple
                      clearable
                      collapse-tags
                      placeholder="请选择"
                      @change="selectChange"
                    >
                      <el-option
                        v-for="item in leaderlist"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="addbox">
                  <el-form-item label="具体片区：" prop="nodeplan">
                    <el-input placeholder="请输入" v-model="basicInfo.nodeplan"></el-input>
                  </el-form-item>
                </div>
                <div class="addbox">
                  <el-form-item label="项目名称：" prop="workname">
                    <el-input placeholder="请输入" v-model="basicInfo.workname"></el-input>
                  </el-form-item>
                </div>
                <div class="addbox">
                  <el-form-item label="重要时间节点：" prop="timenode">
                    <el-input
                      type="textarea"
                      placeholder="请输入"
                      :autosize="{ minRows: 3}"
                      v-model="basicInfo.timenode"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="addbox">
                  <el-form-item label="督查单位：" prop="superdept">
                    <el-select
                      v-model="basicInfo.superdept"
                      multiple
                      clearable
                      placeholder="请选择"
                      @focus="getSeerList()"
                    >
                      <el-option
                        v-for="item in seeunitList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <div class="jiabtn">
                    <i class="icon el-icon-circle-plus" @click="unitShow = true"></i>
                    <div class="awrap" v-if="unitShow">
                      <p>新增</p>
                      <el-input placeholder="请输入" v-model="unitname"></el-input>
                      <div class="buttons">
                        <el-button @click="unitShow = false">取消</el-button>
                        <el-button @click="newUnit" type="primary">确定</el-button>
                      </div>
                    </div>
                  </div>-->
                </div>
              </el-form>
            </div>
          </fieldset>
        </el-col>
        <el-col :span="12">
          <fieldset style="height:100%;">
            <legend>进展汇报</legend>
            <div class="boxcontent">
              <div class="speed">
                <div class="pbox">
                  <p class="tt">上次进展情况：</p>
                  <div class="conbox">
                    <p>{{lastprogress}}</p>
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

      <el-row class="box">
        <!-- 报送规则 -->
        <el-col :span="24">
          <fieldset>
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
      <!-- 牵头、责任单位 -->
      <el-row class="box" :gutter="30">
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
                height="250px"
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
                    <el-button class="btn" @click="handleEdit2(scope.$index, scope.row)">编辑</el-button>
                    <el-button class="btn" @click="handleDelete2(scope.$index, scope.row)">删除</el-button>
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
              <el-button class="addbtn" @click="addDuty" size="small" type="primary">新 增</el-button>
              <el-table
                border
                :data="dutysData"
                highlight-current-row
                style="width: 100%;"
                height="250px"
                class="tableinfo"
                :cell-class-name="cellClassName"
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
      </el-row>
    </div>
    <div class="goback">
      <el-button @click="goback" size="small" type="warning">取 消</el-button>
      <el-button @click="submitAll" type="primary" size="small">保 存</el-button>
    </div>

    <!-- 新增报送规则 -->
    <el-dialog :title="ruleTitle" :visible.sync="ruleVisible" width="700px" class="rule-dialog">
      <el-form
        :model="addRuleForm"
        :inline="true"
        label-width="93px"
        ref="addRuleForm"
        :append-to-body="true"
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
                v-for="item in deptlist"
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
                v-for="item in deptlist"
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
import { getYear, addYear, addSeer, seerList } from "../../api/decisionApi";
import {
  editKeyArea,
  changeKeyareaFormstate,
  synchKeyareaFormstate
} from "../../api/threework";
export default {
  props: [
    "leaderlist",
    "deptlist",
    "basicInfo",
    "partid",
    "addheight",
    "leadsData",
    "dutysData",
    "ruleList",
    "urlIp",
    "upfile",
    "checkReceipt",
    "workid",
    "typemodel",
    "newReportList",
    "lastprogress",
    "isImport"
  ],
  components: {},
  data() {
    return {
      userid: JSON.parse(this.$store.getters.userdata).id,
      years: [],
      yearShow: false,
      yearname: "",
      unitShow: false,
      unitname: "", //督查单位
      addItemData: {},
      itemTitle: "",
      itemVisible: false,
      readOn: false,
      changeNum: "",
      changeWord: "",
      tindex: -1,
      readOn: false,
      addLeadData: {},
      addDutyData: {},
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
      addRuleForm: {}, //报送规则新增表单
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
      fileList: [],
      fileArr: [],
      fouritemList: [], //四级工作列表
      seeunitList: [], //监查单位列表
      addLeadVisible: false,
      addDutyVisible: false
    };
  },
  created() {
    this.getyear();
    this.getSeerList();
  },
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
    // 获取督查单位列表
    getSeerList() {
      seerList("", data => {
        this.seeunitList = data.data.obj;
      });
    },
    // 督查单位新增
    newUnit() {
      let para = { name: this.unitname };
      addSeer(para, res => {
        this.unitShow = false;
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.unitname = "";
        this.getSeerList();
      });
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
    // 周期
    ctypeFormat(scope, value) {
      this.$forceUpdate();
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
    },
    // 新增提交
    addRuleSubmit() {
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
      this.ruleTitle = "编辑报送规则";
      this.ruleBtn = "保存";
      this.changeNum = "edit";
      this.addRuleForm = Object.assign({}, row);
      this.addRuleForm.daytime = new Date(this.addRuleForm.daytime);
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
      for (var i = 0; i < this.deptlist.length; i++) {
        if (this.deptlist[i].id == this.addLeadData.deptid) {
          deptname = this.deptlist[i].name;
          break;
        }
      }
      this.addLeadData.deptName = deptname;
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
        } else {
          console.log("error");
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
      for (var i = 0; i < this.deptlist.length; i++) {
        if (this.deptlist[i].id == this.addDutyData.deptid) {
          deptname = this.deptlist[i].name;
          break;
        }
      }
      this.addDutyData.deptName = deptname;
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
    selectChange() {
      this.$forceUpdate();
    },
    timestampToTime(row, column) {
      var date = new Date(row.submittime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      return Y + M + D;
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
          this.getyear();
        })
        .catch(() => {
          return false;
        });
    },
    // 年度列表
    getyear() {
      getYear("", data => {
        this.years = data.data.obj;
      });
    },
    // 新增年度
    newYear() {
      let para = { year: this.yearname };
      addYear(para, res => {
        this.yearShow = false;
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.getyear();
        this.yearname = "";
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
    tableRowClassName({ row, rowIndex }) {
      if (row.status == -1) {
        return "noedit";
      } else if (row.status == 3) {
        return "lagbtn";
      }
    },
    // 提交所有数据 ---保存-----------
    submitAll: function() {
      this.$refs.basicInfo.validate(valid => {
        if (valid) {
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
          // 获取年度
          var year = "";
          for (var n = 0; n < this.years.length; n++) {
            if (this.basicInfo.yearid == this.years[n].id) {
              year = this.years[n].year;
              break;
            }
          }
          this.basicInfo.year = year;
          this.basicInfo.createuser = this.userid;
          this.basicInfo.superdept = this.basicInfo.superdept.join(",");
          let opara = { tripleAreaProgress: this.basicInfo };
          opara.tripleAreaProgressLeadDeptList = this.leadsData;
          opara.tripleAreaProgressDutyDeptList = this.dutysData;
          opara.tripleAreaProgressRuleList = this.ruleList;
          opara.tripleAreaProgress.id = this.workid;
          opara = JSON.stringify(opara);
          editKeyArea(opara, res => {
            changeKeyareaFormstate({ workid: this.workid }, data => {
              synchKeyareaFormstate({ workid: this.workid }, ress => {
                this.$emit("my-event");
                this.$emit("add-event");
                this.$message({
                  message: "编辑成功",
                  type: "success"
                });
              });
            });
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.addplan {
  .el-form.el-form--inline {
    display: block;
    .addbox {
      margin-right: 0;
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
  .boxcontent {
    padding: 20px;
    .addwrap {
      display: flex;
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
    .sbdate {
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 100%;
      }
    }
    .tflexbox {
      display: flex;
      .el-form-item {
        flex: 1;
        margin-right: 10px;
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

.task-dialog {
  .item-select {
    display: block;
    .el-select__tags {
      max-width: 100% !important;
      width: 100%;
      .el-input--suffix .el-input__inner {
        width: 100%;
      }
    }
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
        color: #333;
      }
    }
  }
  .taskbox2 {
    .el-input {
      width: 220px;
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
.editplanwrap {
  .addbox {
    display: flex;
    .el-form-item {
      flex: 1;
      .el-select {
        display: block;
      }
    }
    .jiabtn {
      margin-left: 20px;
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
    .conbox2 {
      min-height: 36px;
    }
  }
}
</style>
