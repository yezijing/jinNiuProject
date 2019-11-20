<template>
  <div class="batchrule">
    <p class="navtitle">
      <span>报送规则</span>
    </p>
    <div class="batch-content">
      <div class="batch-btns">
        <el-button class="batch-back" @click="goback" size="small" type="warning">返回</el-button>
        <el-button class="addrule" @click="addRuleBtn" size="small" type="primary">新 增</el-button>
      </div>
      <el-table
        class="tableinfo"
        border
        :data="ruleList"
        highlight-current-row
        empty-text="无"
        :height="batchHeight"
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="stagename" label="规则名称"></el-table-column>
        <el-table-column prop="createtime" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createtime | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
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
        <el-table-column prop="starttime" label="开始时间">
          <template slot-scope="scope">
            <span>{{scope.row.starttime | dateformat('YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endtime" label="结束时间">
          <template slot-scope="scope">
            <span>{{scope.row.endtime | dateformat('YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button class="btn" @click="editRuleBtn(scope.$index, scope.row)">编辑</el-button>
            <!-- <el-button class="btn" @click="delRuleBtn(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增报送规则 -->
    <el-dialog :title="ruleTitle" :visible.sync="ruleVisible" width="800px" class="rule-dialog">
      <el-row :gutter="20">
        <el-col :span="13">
          <fieldset>
            <legend>报送规则</legend>
            <div style="padding:15px;">
              <el-form
                :model="addRuleForm"
                label-width="93px"
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
            </div>
          </fieldset>
        </el-col>
        <el-col :span="11">
          <fieldset>
            <legend>批量设置（已选{{choosenum}}个）</legend>
            <div class="batch-setting" style="padding:15px;height:300px;overflow:auto;">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >全选</el-checkbox>
              <el-checkbox-group v-model="checkedItems" @change="handleCheckedItemsChange">
                <el-checkbox
                  v-for="item in allitems"
                  :label="item.id"
                  :key="item.id"
                  :class="classObject(item.id)?'isexist':''"
                >
                  <el-tooltip effect="dark" placement="top-start">
                    <div style="max-width:250px;line-height:2;" slot="content">{{item.name}}</div>
                    <p class="name">{{item.name}}</p>
                  </el-tooltip>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </fieldset>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="submitRule" type="primary">{{ruleBtn}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 
<script>
import {
  getAllRulelist,
  addAllRule,
  editAllRule,
  allRuleDetail,
  checkReportRules
} from "../api/projectApi";
import {
  checkPlanReportRules,
  checkImportworkReportRules
} from "../api/decisionApi";
export default {
  name: "batchrule",
  props: ["batchHeight", "allitems", "itemShow"],
  components: {},
  data() {
    return {
      ruleid: 0,
      checkAll: false,
      checkedItems: [],
      isIndeterminate: false,
      choosenum: 0,
      hasitem: [],
      ruleList: [], //规则列表
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
      isfirst: 0
    };
  },
  created() {
    this.getRulelist();
  },
  methods: {
    // 获取规则列表
    getRulelist() {
      getAllRulelist({ modeltype: this.itemShow }, data => {
        this.ruleList = data.data.obj;
      });
    },
    classObject(id) {
      for (var i = 0; i < this.hasitem.length; i++) {
        if (this.hasitem[i] == id) {
          return true;
        }
      }
    },
    // 返回
    goback() {
      this.$emit("my-back");
    },
    // 报送周期
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
    // 规则新增
    addRuleBtn() {
      this.ruleVisible = true;
      this.ruleTitle = "新增报送规则";
      this.ruleBtn = "新增";
      this.changeNum = "add";
      this.region = "";
      this.monthday = "";
      this.quarter = "";
      this.weekday = "";
      this.daytime = "";
      this.addRuleForm = { cycletype: 1 };
      this.cycleChange();
      this.checkedItems = [];
      this.isfirst = 0;
    },
    // 编辑弹窗
    editRuleBtn(index, row) {
      this.isfirst = 0;
      this.ruleid = row.id;
      this.hasitem = [];
      this.checkedItems = [];
      allRuleDetail({ aid: row.id }, data => {
        var haslist = data.data.obj.yesList;
        this.choosenum = haslist.length;
        if (this.choosenum == 0) {
          this.checkedItems = [];
        } else {
          for (var i = 0; i < haslist.length; i++) {
            this.checkedItems.push(haslist[i].id);
          }
        }
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
      });
    },
    editruleFuc() {
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
      para.modeltype = this.itemShow;
      para.iDList = this.checkedItems;
      para.aid = this.ruleid;
      para = JSON.stringify(para);
      editAllRule(para, res => {
        this.ruleVisible = false;
        this.getRulelist();
        this.$message({
          type: "success",
          message: "修改成功!"
        });
      });
    },
    // 编辑提交
    editRuleSubmit() {
      this.$refs.addRuleForm.validate(valid => {
        if (valid) {
          // 开始时间
          var sdate = this.addRuleForm.starttime;
          var date = new Date(sdate);
          var Y = date.getFullYear() + "-";
          var M =
            (date.getMonth() + 1 < 10
              ? "0" + (date.getMonth() + 1)
              : date.getMonth() + 1) + "-";
          var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
          var starttime = Y + M + D;
          // 结束时间
          var edate = this.addRuleForm.endtime;
          var date2 = new Date(edate);
          var Y2 = date2.getFullYear() + "-";
          var M2 =
            (date2.getMonth() + 1 < 10
              ? "0" + (date2.getMonth() + 1)
              : date2.getMonth() + 1) + "-";
          var D2 =
            date2.getDate() < 10 ? "0" + date2.getDate() : date2.getDate();
          var endtime = Y2 + M2 + D2;

          if (this.itemShow == 1) {
            let spara = {
              pidList: this.checkedItems,
              starttime: this.addRuleForm.starttime,
              endtime: this.addRuleForm.endtime
            };
            spara = JSON.stringify(spara);
            this.conflictRuleEdit(spara);
          } else if (this.itemShow == 2) {
            this.editruleFuc();
          } else if (this.itemShow == 3) {
            let spara = {
              widList: this.checkedItems,
              starttime: this.addRuleForm.starttime,
              endtime: this.addRuleForm.endtime,
              typemodel: 1
            };
            spara = JSON.stringify(spara);
            this.conflictRuleEdit(spara);
          } else if (this.itemShow == 4) {
            let spara = {
              widList: this.checkedItems,
              starttime: this.addRuleForm.starttime,
              endtime: this.addRuleForm.endtime,
              typemodel: 2
            };
            spara = JSON.stringify(spara);
            this.conflictRuleEdit(spara);
          } else if (this.itemShow == 12) {
            let spara = {
              pidList: this.checkedItems,
              starttime: this.addRuleForm.starttime,
              endtime: this.addRuleForm.endtime
            };
            spara = JSON.stringify(spara);
            this.conflictRuleImportworkEdit(spara);
          } else {
            this.editruleFuc();
          }
        } else {
          return false;
        }
      });
    },
    // 判断时间是否存在交叉
    conflictRuleEdit(spara) {
      checkReportRules(spara, data => {
        this.hasitem = data.data.obj;
        if (this.hasitem.length > 0) {
          this.$confirm(
            "<span style='color:#f00;'>红色标示的项目报送规则存在冲突</span>，添加此条规则将会覆盖原有规则，是否继续添加？",
            "提示",
            {
              dangerouslyUseHTMLString: true,
              type: "warning",
              center: true,
              modal: false,
              cancelButtonText: "取消",
              confirmButtonText: "确定"
            }
          )
            .then(() => {
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
              para.modeltype = this.itemShow;
              para.iDList = this.checkedItems;
              para.aid = this.ruleid;
              para = JSON.stringify(para);
              editAllRule(para, res => {
                this.ruleVisible = false;
                this.$message({
                  type: "success",
                  message: "修改成功!"
                });
                this.getRulelist();
              });
            })
            .catch(action => {});
        } else {
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
          para.modeltype = this.itemShow;
          para.iDList = this.checkedItems;
          para.aid = this.ruleid;
          para = JSON.stringify(para);
          editAllRule(para, res => {
            this.ruleVisible = false;
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.getRulelist();
          });
        }
      });
    },
    conflictRuleImportworkEdit(spara) {
      checkImportworkReportRules(spara, data => {
        this.hasitem = data.data.obj;
        if (this.hasitem.length > 0) {
          this.$confirm(
            "<span style='color:#f00;'>红色标示的项目报送规则存在冲突</span>，添加此条规则将会覆盖原有规则，是否继续添加？",
            "提示",
            {
              dangerouslyUseHTMLString: true,
              type: "warning",
              center: true,
              modal: false,
              cancelButtonText: "取消",
              confirmButtonText: "确定"
            }
          )
            .then(() => {
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
              para.modeltype = this.itemShow;
              para.iDList = this.checkedItems;
              para.aid = this.ruleid;
              para = JSON.stringify(para);
              editAllRule(para, res => {
                this.ruleVisible = false;
                this.$message({
                  type: "success",
                  message: "修改成功!"
                });
                this.getRulelist();
              });
            })
            .catch(action => {});
        } else {
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
          para.modeltype = this.itemShow;
          para.iDList = this.checkedItems;
          para.aid = this.ruleid;
          para = JSON.stringify(para);
          editAllRule(para, res => {
            this.ruleVisible = false;
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.getRulelist();
          });
        }
      });
    },

    conflictRule(spara) {
      checkReportRules(spara, data => {
        this.hasitem = data.data.obj;
        if (this.hasitem.length > 0) {
          this.$confirm(
            "<span style='color:#f00;'>红色标示的项目报送规则存在冲突</span>，添加此条规则将会覆盖原有规则，是否继续添加？",
            "提示",
            {
              dangerouslyUseHTMLString: true,
              type: "warning",
              center: true,
              modal: false,
              cancelButtonText: "取消",
              confirmButtonText: "确定"
            }
          )
            .then(() => {
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
              para.modeltype = this.itemShow;
              para.iDList = this.checkedItems;
              para = JSON.stringify(para);
              addAllRule(para, res => {
                this.ruleVisible = false;
                this.getRulelist();
                this.$message({
                  type: "success",
                  message: "新增成功!"
                });
              });
            })
            .catch(action => {
            });
        } else {
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
          para.modeltype = this.itemShow;
          para.iDList = this.checkedItems;
          para = JSON.stringify(para);
          addAllRule(para, res => {
            this.ruleVisible = false;
            this.getRulelist();
            this.$message({
              type: "success",
              message: "新增成功!"
            });
          });
        }
      });
    },
    conflictRule2(spara) {
      checkPlanReportRules(spara, data => {
        this.hasitem = data.data.obj;
        if (this.hasitem.length > 0) {
          this.$confirm(
            "<span style='color:#f00;'>红色标示的项目报送规则存在冲突</span>，添加此条规则将会覆盖原有规则，是否继续添加？",
            "提示",
            {
              dangerouslyUseHTMLString: true,
              type: "warning",
              center: true,
              modal: false,
              cancelButtonText: "取消",
              confirmButtonText: "确定"
            }
          )
            .then(() => {
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
              para.modeltype = this.itemShow;
              para.iDList = this.checkedItems;
              para = JSON.stringify(para);
              addAllRule(para, res => {
                this.ruleVisible = false;
                this.getRulelist();
                this.$message({
                  type: "success",
                  message: "新增成功!"
                });
              });
            })
            .catch(action => {});
        } else {
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
          para.modeltype = this.itemShow;
          para.iDList = this.checkedItems;
          para = JSON.stringify(para);
          addAllRule(para, res => {
            this.ruleVisible = false;
            this.getRulelist();
            this.$message({
              type: "success",
              message: "新增成功!"
            });
          });
        }
      });
    },
    conflictRuleImportwork(spara) {
      checkImportworkReportRules(spara, data => {
        this.hasitem = data.data.obj;
        if (this.hasitem.length > 0) {
          this.$confirm(
            "<span style='color:#f00;'>红色标示的项目报送规则存在冲突</span>，添加此条规则将会覆盖原有规则，是否继续添加？",
            "提示",
            {
              dangerouslyUseHTMLString: true,
              type: "warning",
              center: true,
              modal: false,
              cancelButtonText: "取消",
              confirmButtonText: "确定"
            }
          )
            .then(() => {
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
              para.modeltype = this.itemShow;
              para.iDList = this.checkedItems;
              para = JSON.stringify(para);
              addAllRule(para, res => {
                this.ruleVisible = false;
                this.getRulelist();
                this.$message({
                  type: "success",
                  message: "新增成功!"
                });
              });
            })
            .catch(action => {});
        } else {
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
          para.modeltype = this.itemShow;
          para.iDList = this.checkedItems;
          para = JSON.stringify(para);
          addAllRule(para, res => {
            this.ruleVisible = false;
            this.getRulelist();
            this.$message({
              type: "success",
              message: "新增成功!"
            });
          });
        }
      });
    },
    addruleFuc() {
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
      para.modeltype = this.itemShow;
      para.iDList = this.checkedItems;
      para = JSON.stringify(para);
      addAllRule(para, res => {
        this.ruleVisible = false;
        this.getRulelist();
        this.$message({
          type: "success",
          message: "新增成功!"
        });
      });
    },
    // 新增提交
    addRuleSubmit() {
      this.$refs.addRuleForm.validate(valid => {
        if (valid) {
          if (this.itemShow == 1) {
            // 判断时间是否有交叉
            let spara = {
              pidList: this.checkedItems,
              starttime: this.addRuleForm.starttime,
              endtime: this.addRuleForm.endtime
            };
            spara = JSON.stringify(spara);
            this.conflictRule(spara);
          } else if (this.itemShow == 2) {
            this.addruleFuc();
          } else if (this.itemShow == 3) {
            // 判断时间是否有交叉
            let spara = {
              widList: this.checkedItems,
              starttime: this.addRuleForm.starttime,
              endtime: this.addRuleForm.endtime,
              typemodel: 1
            };
            spara = JSON.stringify(spara);
            this.conflictRule2(spara);
          } else if (this.itemShow == 4) {
            let spara = {
              pidList: this.checkedItems,
              starttime: this.addRuleForm.starttime,
              endtime: this.addRuleForm.endtime,
              typemodel: 2
            };
            spara = JSON.stringify(spara);
            this.conflictRule2(spara);
          } else if (this.itemShow == 12) {
            let spara = {
              pidList: this.checkedItems,
              starttime: this.addRuleForm.starttime,
              endtime: this.addRuleForm.endtime
            };
            spara = JSON.stringify(spara);
            this.conflictRuleImportwork(spara);
          } else {
            this.addruleFuc();
          }
        } else {
          return false;
        }
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
    // 删除规则
    delRuleBtn(index, row) {
      this.ruleList.splice(index, 1);
      this.ruleVisible = false;
      this.$message({
        message: "删除成功",
        type: "success"
      });
    },
    // 批量设置
    handleCheckAllChange(val) {
      let arr = [];
      for (var i = 0; i < this.allitems.length; i++) {
        arr.push(this.allitems[i].id);
      }
      this.choosenum = val ? arr.length : 0;
      this.checkedItems = val ? arr : [];
      this.isIndeterminate = false;
    },
    handleCheckedItemsChange(value) {
      this.choosenum = value.length;
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allitems.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.allitems.length;
    }
    // 批量设置 end
  }
};
</script>

<style lang="scss">
.batchrule {
  .batch-content {
    margin-top: 15px;
    .batch-btns {
      margin-bottom: 10px;
    }
  }
}
</style>
