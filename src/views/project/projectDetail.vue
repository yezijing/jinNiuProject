<template>
  <div class="addproject">
    <div v-if="isDetailShow" class="isDetailShow">
      <div class="back">
        <el-button @click="goback" size="small" type="primary">返回</el-button>
        <el-button
          @click="toEdit"
          size="small"
          v-if="isEditShow"
          v-show="noEdit"
          type="primary"
          :class="isCenter==2?'noeditbtn':''"
        >编辑</el-button>
      </div>
      <div class="addcontent" :style="addheight2">
        <el-row class="box" :gutter="40" style="display:flex;align-items:stretch;">
          <el-col :span="12">
            <fieldset style="height:100%;">
              <legend>基本信息</legend>
              <div class="detail-basic">
                <el-form
                  size="medium"
                  label-width="96px"
                  ref="projectDetailData"
                  :model="projectDetailData"
                >
                  <div class="blist">
                    <el-form-item label="项目名称：" prop="projectName">
                      <el-input v-model="projectDetailData.projectName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="项目业主：" prop="ownName">
                      <el-input v-model="projectDetailData.ownName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="牵头区领导：" prop="arealeaderNames">
                      <el-input v-model="projectDetailData.arealeaderNames" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="所属街道：" prop="streets">
                      <el-input v-model="projectDetailData.streets" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="项目类别：" prop="category">
                      <el-input v-model="projectDetailData.category" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="项目地址：" prop="address">
                      <el-input readonly v-model="projectDetailData.address"></el-input>
                    </el-form-item>
                    <el-form-item label="经纬度：" prop="mapitude">
                      <el-input placeholder="请输入" v-model="projectDetailData.mapitude"></el-input>
                    </el-form-item>
                    <el-form-item label="报送要求：" prop="submitres">
                      <el-input
                        type="textarea"
                        :rows="2"
                        readonly
                        v-model="projectDetailData.submitres"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="项目描述：" prop="remark">
                      <el-input
                        type="textarea"
                        :rows="2"
                        readonly
                        v-model="projectDetailData.remark"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="目标任务：" prop="aimplan">
                      <el-input
                        type="textarea"
                        :rows="2"
                        readonly
                        v-model="projectDetailData.aimplan"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-form>
                <div class="stateId">
                  <img :src="statusLabel[imgNum]" alt />
                </div>
              </div>
            </fieldset>
          </el-col>
          <!-- 报送材料 -->
          <el-col :span="12">
            <fieldset class="plist" style="height:100%;overflow:hidden;">
              <legend>报送材料</legend>
              <div class="unitbox">
                <el-button
                  @click="lookHistory"
                  style="margin:15px 30px;"
                  size="small"
                  type="primary"
                >报送历史</el-button>
                <br />
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
                  height="160px"
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
            <br />
            <fieldset>
              <legend>责任单位</legend>
              <div class="boxcontent">
                <el-table
                  border
                  :data="dutysData"
                  height="160px"
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
          <el-col :span="12">
            <fieldset>
              <legend>报送规则</legend>
              <div class="boxcontent">
                <el-table
                  border
                  :data="ruleList"
                  highlight-current-row
                  style="width: 100%;"
                  class="tableinfo"
                  height="400px"
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
                  <el-table-column prop="warnday" label="提前预警(天)"></el-table-column>
                  <el-table-column prop="starttime" :formatter="starttimeToTime" label="开始时间"></el-table-column>
                  <el-table-column prop="endtime" :formatter="endtimeToTime" label="结束时间"></el-table-column>
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
      </div>

      <!-- 查看照片 -->
      <el-dialog :visible.sync="imgVisible" width="800px" class="img-dialog">
        <el-carousel height="500px">
          <el-carousel-item v-for="item in dimgs" :key="item">
            <img :src="item" alt />
          </el-carousel-item>
        </el-carousel>
      </el-dialog>

      <!-- 目标任务 -->
      <el-dialog
        :title="taskTitle"
        :visible.sync="addTaskVisible"
        width="800px"
        class="task-dialog"
      >
        <el-form :model="addTaskData" label-width="100px" ref="addTaskData" :append-to-body="true">
          <el-form-item label="目标任务：" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5}"
              :readonly="readOn"
              v-model="addTaskData.remark"
            ></el-input>
          </el-form-item>
          <div class="taskbox">
            <el-form-item label="最后截止时间" prop="stoptime">
              <el-date-picker
                v-model="addTaskData.stoptime"
                format="yyyy-MM-dd"
                type="date"
                :readonly="readOn"
                placeholder="请选择"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="提前：" class="day" prop="warntime">
              <el-input v-model="addTaskData.warntime" :readonly="readOn">
                <template slot="append">天预警</template>
              </el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submitTask" type="primary">{{changeWord}}</el-button>
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

    <!-- 报送规则详情 -->
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
          <el-select v-model="addRuleForm.cycletype" clearable disabled>
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
          <el-select v-model="weekday" clearable readonly>
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
          <el-select v-model="monthday" clearable readonly>
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
          <el-select v-model="quarter" clearable readonly>
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
            readonly
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="开始时间" prop="starttime">
          <el-date-picker
            v-model="addRuleForm.starttime"
            format="yyyy-MM-dd"
            type="date"
            readonly
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endtime">
          <el-date-picker
            v-model="addRuleForm.endtime"
            format="yyyy-MM-dd"
            type="date"
            readonly
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitRule" type="primary">确定</el-button>
      </div>
    </el-dialog>

    <!-- 历史回执 -->
    <div class="history" v-if="isHistoryShow">
      <p class="title">历史回执</p>
      <div class="hbtns">
        <el-button @click="returnDetail" size="small" type="primary">返 回</el-button>
      </div>
      <el-table
        class="tableinfo"
        border
        :data="historyData"
        highlight-current-row
        style="width: 100%;overflow:auto;"
        :height="historyHeight"
      >
        <el-table-column prop="reportdept" label="报送单位"></el-table-column>
        <el-table-column prop="question" label="进展情况"></el-table-column>
        <el-table-column prop="wenti" label="存在问题"></el-table-column>
        <el-table-column prop="measure" label="下步工作计划"></el-table-column>
        <el-table-column prop="validate" label="审核状态">
          <template slot-scope="scope">
            <span v-html="validateFormat(scope,scope.row.validate)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="填报时间" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.createtime | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
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
  </div>
</template>

<script>
import { upfile, imgIp } from "../../api/imgUrl";
import {
  projectTypeList,
  addProjectType,
  addProject,
  lookProjectHistory
} from "../../api/projectApi";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  props: [
    "leadunits",
    "users",
    "projectDetailData",
    "leadsData",
    "dutysData",
    "addheight2",
    "projectId",
    "ruleList",
    "isEditShow",
    "noEdit",
    "historyHeight",
    "newReportList",
    "lastprogress",
    "isCenter"
  ],
  components: {},
  data() {
    return {
      statusLabel: [
        "../../../static/images/s0.png",
        "../../../static/images/s1.png",
        "../../../static/images/s2.png",
        "../../../static/images/s3.png"
      ],
      dimgs: [
        "../../../static/images/1.jpg",
        "../../../static/images/2.jpg",
        "../../../static/images/3.jpg"
      ],
      imgNum: "",
      types: [], //项目类型
      addTaskData: {},
      addLeadData: {},
      addDutyData: {},
      addTaskVisible: false,
      addLeadVisible: false,
      addDutyVisible: false,
      imgVisible: false,
      changeNum: "",
      changeWord: "",
      tindex: "-1",
      readOn: false,
      taskTitle: "",
      upfile: "",
      imgIp: "",
      isDetailShow: true,
      isHistoryShow: false, //是否显示历史记录
      historyData: [], //历史记录列表数据
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
      ]
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
    // 报送规则详情
    detailRuleBtn(index, row) {
      console.log(row);
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
      this.addRuleForm = Object.assign({}, row);
      this.addRuleForm.endtime = new Date(this.addRuleForm.endtime);
      this.addRuleForm.starttime = new Date(this.addRuleForm.starttime);
      this.addRuleForm.endtime = new Date(this.addRuleForm.endtime);
    },
    submitRule() {
      this.ruleVisible = false;
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
    validateFormat(scope, value) {
      switch (value) {
        case 0:
          return "未审核";
          break;
        case 1:
          return "审核未通过";
          break;
        case 2:
          return "审核通过";
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
    // 查看历史记录
    lookHistory() {
      console.log(this.projectId);
      let para = { projectid: this.projectId };
      lookProjectHistory(para, data => {
        this.historyData = data.data.obj;
        console.log(this.historyData);
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
          console.log(filearr);
        }
        this.isDetailShow = false;
        this.isHistoryShow = true;
      });
    },
    // 查看历史记录-返回
    returnDetail() {
      this.isDetailShow = true;
      this.isHistoryShow = false;
    },
    timestampToTime(row, column) {
      var date = new Date(row.stoptime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      return Y + M + D;
    },
    // 不同状态提醒
    statusImg() {
      switch (this.projectDetailData.status) {
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
    // 查看照片
    lookimg() {
      this.imgVisible = true;
    },
    goback() {
      if (this.isCenter == 1) {
        this.$router.push({
          path: "/index"
        });
      } else if (this.isCenter == 2) {
        this.$router.push({
          path: "/personCenter"
        });
      } else {
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
    // ----------------------目标任务-------------------
    // 详情
    handleDetail(index, row) {
      this.changeNum = "read";
      this.changeWord = "确认";
      this.taskTitle = "详情";
      this.readOn = true;
      this.addTaskVisible = true;
      this.addTaskData = Object.assign({}, row);
    },
    // 目标任务弹窗-确认提交
    submitTask: function() {
      this.addTaskVisible = false;
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
    }
  }
};
</script>

<style lang="scss">
.addproject {
  padding-top: 20px;
  .sxtitle2 {
    text-align: left;
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
  .addcontent {
    overflow-y: auto;
    overflow-x: hidden;
    padding: 8px;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
  }
  .el-carousel__container {
    .el-carousel__item img {
      width: 100%;
      height: 100%;
    }
  }
  .img-dialog {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 20px;
    }
  }
  .back {
    margin-bottom: 20px;
  }
  .box {
    margin-bottom: 30px;
    .boxcontent {
      padding: 20px;
      .addbtn {
        margin-bottom: 20px;
      }
    }
    .detail-basic {
      padding: 20px 20px 20px 20px;
      position: relative;
      .el-form-item {
        margin-bottom: 10px;
      }
      .flexbox {
        display: flex;
        justify-content: space-between;
      }
      .stateId {
        position: absolute;
        right: -19px;
        top: -29px;
        width: 150px;
        height: 150px;
        display: none;
        img {
          width: 100%;
        }
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
    .lookhistory {
      color: #1890ff;
      font-size: 14px;
      display: block;
      margin-bottom: 15px;
      cursor: pointer;
    }
    .unitbox {
      padding: 10px;
      .unitlist {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li {
          width: 45%;
          box-shadow: 5px 5px 14px 0px rgba(0, 0, 0, 0.4);
          border: 1px solid #eee;
          padding: 10px;
          margin-bottom: 20px;
          position: relative;
          .name {
            color: #993300;
            font-size: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            a {
              color: #1890ff;
              font-size: 14px;
            }
          }
          .list {
            color: #333;
            font-size: 14px;
            line-height: 2;
            p {
              display: flex;
              justify-content: space-between;
              span {
                display: inline-block;
                margin-right: 10px;
              }
            }
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
            min-height: 70px;
          }
        }
      }
    }
    .plist + .plist {
      margin-top: 20px;
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
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #dcdfe6;
    color: #606266;
    cursor: pointer;
  }
  .el-select .el-input.is-disabled .el-input__inner {
    cursor: pointer;
  }
}
.filelist {
  padding: 0 30px;
  .tt {
    color: #222;
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .list {
    a {
      display: block;
      line-height: 2;
      font-size: 14px;
      color: #1890ff;
    }
  }
}
</style>
