<template>
  <div class="manage-index">
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters" ref="filters" size="small">
          <el-form-item label="指标名称：" prop="name">
            <el-input v-model="filters.name" placeholder="请输入" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="年度：" prop="year" class="ybox">
            <el-date-picker v-model="filters.year" type="year" value-format="yyyy" placeholder="全部"></el-date-picker>
          </el-form-item>
          <el-form-item label="牵头区领导：" prop="leadleaderid" class="ld">
            <el-select v-model="filters.leadleaderid" filterable clearable placeholder="全部">
              <el-option
                v-for="item in leaderList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                @change="selectChange"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDatas('filters')" type="primary">搜 索</el-button>
            <el-button @click="resetForm('filters')">重 置</el-button>
          </el-form-item>
          <div class="toolbtns">
            <el-button type="primary" @click="handleAdd" size="small" v-if="isAddShow">新 增</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-row>
      <el-table
        class="tableinfo"
        border
        :height="tableHeight"
        :data="tableData"
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" width="100" :formatter="numberFormatter"></el-table-column>
        <el-table-column prop="year" width="100" label="年度"></el-table-column>
        <el-table-column prop="name" label="指标名称"></el-table-column>
        <el-table-column prop="type" label="指标类型">
          <template slot-scope="scope">
            <span v-html="typeFormat(scope,scope.row.type)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="计量单位"></el-table-column>
        <el-table-column prop="leadleadername" label="牵头区领导"></el-table-column>
        <el-table-column prop="dytarget" label="区定全年排位目标"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="formstatus" label="材料报送">
          <template slot-scope="scope">
            <div>
              <i class="fa mark" v-if="scope.row.formstatus==1" style="background:#fbe804;"></i>
              <i class="fa mark" v-else-if="scope.row.formstatus==2" style="background:#f00;"></i>
              <i class="fa mark" v-else-if="scope.row.formstatus== -1" style="background:#999;"></i>
              <i class="fa mark" v-else></i>
              <span v-html="formstatusFormat(scope,scope.row.formstatus)"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalstatus" label="总体进度">
          <template slot-scope="scope">
            <div class="flexbox" v-if="isEditShow">
              <i class="fa mark" v-if="scope.row.totalstatus==3" style="background:#364e98;"></i>
              <i class="fa mark" v-else-if="scope.row.totalstatus==4" style="background:#7c1d77;"></i>
              <i class="fa mark" v-else-if="scope.row.totalstatus== -1" style="background:#999;"></i>
              <i class="fa mark" v-else></i>
              <el-select
                v-model="scope.row.totalstatus"
                @change="totalstateChange(scope, scope.row)"
                class="stateSelect"
              >
                <el-option
                  v-for="item in totalStatus"
                  :key="item.value"
                  :label="item.status"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div v-else>
              <i class="fa mark" v-if="scope.row.totalstatus==3" style="background:#364e98;"></i>
              <i class="fa mark" v-else-if="scope.row.totalstatus==4" style="background:#7c1d77;"></i>
              <i class="fa mark" v-else-if="scope.row.totalstatus== -1" style="background:#999;"></i>
              <i class="fa mark" v-else></i>
              <span v-html="totalstatusFormat(scope,scope.row.totalstatus)"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button class="btn" @click="handleLook(scope.$index, scope.row)">详情</el-button>
            <el-button class="btn" @click="handleEdit(scope.$index, scope.row)" v-if="isEditShow">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 40, 50]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes, jumper"
        :total="totals"
      ></el-pagination>
    </el-row>
    <!-- 新增 -->
    <el-dialog class="managebox" :title="formTitle" :visible.sync="addFormVisible" width="1200px">
      <el-row class="addrow">
        <el-col :span="24">
          <fieldset>
            <legend>基本信息</legend>
            <div class="boxcontent" style="padding-left:0;">
              <el-form :model="addForm" label-width="140px" ref="addForm" size="small">
                <el-form-item
                  label="指标名称："
                  prop="name"
                  :rules="[{ required: true, message: '指标名称不能为空'}]"
                >
                  <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <div class="flexbox">
                  <el-form-item
                    label="年度："
                    prop="year"
                    :rules="[{ required: true, message: '请选择'}]"
                  >
                    <el-date-picker
                      v-model="addForm.year"
                      type="year"
                      value-format="yyyy"
                      placeholder="请选择"
                      @change="selectChange"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="计量单位：" prop="unit">
                    <el-input v-model="addForm.unit"></el-input>
                  </el-form-item>
                  <el-form-item
                    label="指标类型："
                    prop="type"
                    :rules="[{ required: true, message: '指标名称不能为空'}]"
                  >
                    <el-radio v-model="addForm.type" label="0">绝对量</el-radio>
                    <el-radio v-model="addForm.type" label="1">增幅</el-radio>
                  </el-form-item>
                </div>
                <div class="flexbox">
                  <el-form-item label="牵头区领导：" prop="leadleaderid">
                    <el-select
                      v-model="addForm.leadleaderid"
                      placeholder="请选择"
                      filterable
                      clearable
                      @change="selectChange"
                    >
                      <el-option
                        v-for="item in leaderList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="市下达全年目标：" prop="cytarget">
                    <el-input v-model="addForm.cytarget" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item label="区定全年目标：" prop="dytarget">
                    <el-input placeholder="请输入" v-model="addForm.dytarget"></el-input>
                  </el-form-item>
                </div>
                <el-form-item label="备注：" prop="remark" class="remark">
                  <el-input type="textarea" :autosize="{ minRows: 3}" v-model="addForm.remark"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </fieldset>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="index-leader">
        <el-col :span="12">
          <fieldset>
            <legend>牵头单位</legend>
            <div class="boxcontent">
              <el-button class="addbtn" @click="addLead" size="small" type="primary">新 增</el-button>
              <el-table
                height="200px"
                border
                :data="leadsData"
                highlight-current-row
                class="tableinfo"
              >
                <el-table-column prop="deptName" label="牵头单位"></el-table-column>
                <el-table-column prop="leadername" label="责任领导"></el-table-column>
                <el-table-column prop="agentname" label="经办人"></el-table-column>
                <el-table-column prop="formstatus" label="报送状态" v-if="isStateShow">
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
                <el-table-column label="操作">
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
            <legend>报送规则</legend>
            <div class="boxcontent">
              <el-button class="addbtn" @click="addRuleBtn" size="small" type="primary">新 增</el-button>
              <el-table
                border
                :data="ruleList"
                highlight-current-row
                style="width: 100%;"
                class="tableinfo"
                height="200px"
              >
                <el-table-column prop="stagename" label="阶段"></el-table-column>
                <el-table-column prop="cycletype" label="报送周期">
                  <template slot-scope="scope">
                    <p v-if="scope.row.cycletype==3">每月</p>
                    <p v-else-if="scope.row.cycletype==4">季度</p>
                  </template>
                </el-table-column>
                <el-table-column prop="warnday" label="提前预警(天)"></el-table-column>
                <el-table-column prop="endtime" label="结束时间"></el-table-column>
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveSubmit('addForm')">{{btnWord}}</el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog class="managebox" title="详情" :visible.sync="detailFormVisible" width="1200px">
      <el-row class="addrow">
        <el-col :span="24">
          <fieldset>
            <legend>基本信息</legend>
            <div class="boxcontent" style="padding-left:0;">
              <el-form :model="detailForm" label-width="140px" ref="detailForm" size="small">
                <el-form-item label="指标名称：" prop="name">
                  <el-input v-model="detailForm.name" readonly></el-input>
                </el-form-item>
                <div class="flexbox">
                  <el-form-item label="年度：" prop="year">
                    <el-input v-model="detailForm.year" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="计量单位：" prop="unit">
                    <el-input v-model="detailForm.unit" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="指标类型：" prop="type">
                    <el-input v-model="detailForm.type" readonly></el-input>
                    <!-- <el-radio v-model="detailForm.type" label="0">绝对量</el-radio>
                    <el-radio v-model="detailForm.type" label="1">增幅</el-radio>-->
                  </el-form-item>
                </div>
                <div class="flexbox">
                  <el-form-item label="牵头区领导：" prop="leadername">
                    <el-input v-model="detailForm.leadername" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="市下达全年目标：" prop="cytarget">
                    <el-input v-model="detailForm.cytarget" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="区定全年目标：" prop="dytarget">
                    <el-input readonly v-model="detailForm.dytarget"></el-input>
                  </el-form-item>
                </div>
                <el-form-item label="备注：" prop="remark" class="remark">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 3}"
                    readonly
                    v-model="detailForm.remark"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </fieldset>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="index-leader">
        <el-col :span="12">
          <fieldset>
            <legend>牵头单位</legend>
            <div class="boxcontent">
              <el-table
                border
                :data="leadsData"
                height="200px"
                highlight-current-row
                class="tableinfo"
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
                <el-table-column label="操作">
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
            <legend>报送规则</legend>
            <div class="boxcontent">
              <el-table
                border
                :data="ruleList"
                highlight-current-row
                style="width: 100%;"
                class="tableinfo"
                height="200px"
              >
                <el-table-column prop="stagename" label="阶段"></el-table-column>
                <el-table-column prop="cycletype" label="报送周期" width="80">
                  <template slot-scope="scope">
                    <p v-if="scope.row.cycletype==3">每月</p>
                    <p v-else-if="scope.row.cycletype==4">季度</p>
                  </template>
                </el-table-column>
                <el-table-column prop="warnday" label="提前预警(天)"></el-table-column>
                <el-table-column prop="endtime" label="结束时间"></el-table-column>
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
                <el-table-column label="操作" width="60">
                  <template scope="scope">
                    <el-button class="btn" @click="detailRuleBtn(scope.$index, scope.row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </fieldset>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="detailFormVisible = false">确定</el-button>
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
              placeholder="请选择"
              @change="deptChange"
            >
              <el-option
                v-for="item in deptList"
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

    <!-- 预警设置 -->
    <el-dialog :title="ruleTitle" :visible.sync="ruleVisible" width="420px" class="rule-dialog">
      <el-form :model="ruleForm" label-width="100px" ref="ruleForm" size="small">
        <el-form-item label="阶段：" prop="stagename">
          <el-input v-model="ruleForm.stagename" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="预警条件：" prop="condition">
          <el-select v-model="condition" placeholder="请选择" @change="cycleChange()">
            <el-option
              v-for="item in warnlist"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预警时间：" prop="date2">
          <el-select v-model="date2" clearable placeholder="请选择" @change="selectChange">
            <el-option
              v-for="item in timeday"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提前：" class="day" prop="warnday">
          <el-input v-model="ruleForm.warnday">
            <template slot="append">天预警</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="开始时间："
          prop="starttime"
          :rules="[{ required: true, message: '时间不能为空', trigger: 'change' }]"
        >
          <el-date-picker
            v-model="ruleForm.starttime"
            type="date"
            placeholder="请选择"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            @change="selectChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="结束时间："
          prop="endtime"
          :rules="[{ required: true, message: '时间不能为空', trigger: 'change' }]"
        >
          <el-date-picker
            v-model="ruleForm.endtime"
            type="date"
            placeholder="请选择"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            @change="selectChange"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitRule" type="primary">{{ruleBtn}}</el-button>
      </div>
    </el-dialog>
    <!-- 预警设置详情 -->
    <el-dialog title="规则详情" :visible.sync="detailRuleVisible" class="rule-dialog" width="420px">
      <div>
        <el-form :model="ruledetailForm" label-width="120px" ref="ruledetailForm" size="small">
          <el-form-item label="预警条件：" prop="stagename">
            <el-input readonly v-model="ruledetailForm.stagename"></el-input>
          </el-form-item>
          <el-form-item label="预警条件：" prop="dcondition">
            <el-input readonly v-model="dcondition"></el-input>
          </el-form-item>
          <el-form-item label="预警日期：" prop="date2">
            <el-input readonly v-model="date2"></el-input>
          </el-form-item>
          <el-form-item label="提前：" class="day" prop="warnday">
            <el-input readonly v-model="ruledetailForm.warnday">
              <template slot="append">天预警</template>
            </el-input>
          </el-form-item>
          <el-form-item label="开始时间：" prop="starttime">
            <el-date-picker
              v-model="ruledetailForm.starttime"
              type="date"
              readonly
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              @change="selectChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="endtime">
            <el-date-picker
              v-model="ruledetailForm.endtime"
              type="date"
              readonly
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              @change="selectChange"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailRuleVisible=false" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  adddDistrictEconomic,
  allIndexlist,
  indexByIdDistrict,
  editIndexDistrict,
  getDistrictIndexlist,
  changeChengFormState,
  changeChengTotalState
} from "../../api/targetApi";
export default {
  name: "target",
  props: ["leaderList", "deptList"],
  data() {
    return {
      ruledetailForm: {},
      detailRuleVisible: false,
      ruleIndex: -1,
      checkAll: false,
      checkedItems: [],
      allitems: [],
      isIndeterminate: false,
      choosenum: 0,
      hasitem: [],
      choosenum: 0,
      ruleTitle: "",
      ruleVisible: false,
      ruleBtn: "",
      isStateShow: false,
      taskTitle: "",
      changeWord: "",
      changeNum: "",
      readOn: false,
      leadsData: [], //牵头区领导列表
      addLeadVisible: false,
      addLeadData: {},
      warnlist: [{ value: 4, name: "季度" }, { value: 3, name: "每月" }],
      condition: "",
      filters: {},
      addFormVisible: false,
      detailFormVisible: false,
      tableData: [],
      addForm: {},
      currentPage: 1,
      pageSize: 20,
      totals: 0,
      detailForm: {},
      newyear: "",
      formTitle: "",
      btnWord: "",
      change: "",
      // tableData: [],
      targetCheckList: JSON.parse(this.$store.getters.userdata).targetCheckList,
      isAddShow: false,
      isEditShow: false,
      tableHeight: "500px",
      curyear: "",
      totalStatus: [
        { value: 0, status: "正常" },
        { value: 3, status: "滞后" },
        { value: 4, status: "严重滞后" },
        { value: -1, status: "完结" }
      ],
      formStatus: [
        { value: 0, status: "正常" },
        { value: 1, status: "预警" },
        { value: 2, status: "逾期" },
        { value: -1, status: "完结" }
      ],
      dateshow1: true,
      dateshow1: false,
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
      dateshow1: true,
      dateshow2: false,
      cycleNum: 0,
      date1: "",
      date2: "",
      dcondition: "",
      ruleForm: {},
      ruleList: []
    };
  },
  mounted() {},
  created() {
    this.browerHeight();
    if (this.targetCheckList !== null) {
      for (var i = 0; i < this.targetCheckList.length; i++) {
        let value = this.targetCheckList[i];
        switch (value) {
          case "D-add":
            this.isAddShow = true;
            break;
          case "D-edit":
            this.isEditShow = true;
            break;
        }
      }
    }
    this.getAlldata();
  },
  methods: {
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
    },
    // 批量设置 end
    selectChange() {
      this.$forceUpdate();
    },
    // 报送规则
    // 新增
    addRuleBtn() {
      this.ruleVisible = true;
      this.ruleTitle = "新增报送规则";
      this.ruleBtn = "新增";
      this.changeNum = "add";
      this.hasitem = [];
      this.checkedItems = [];
      this.ruleForm = {};
      this.condition = "";
      this.date2 = "";
    },
    // 编辑
    editRuleBtn(index, row) {
      this.hasitem = [];
      this.ruleVisible = true;
      this.ruleTitle = "编辑报送规则";
      this.ruleBtn = "保存";
      this.changeNum = "edit";
      this.ruleForm = Object.assign({}, row);
      this.condition = row.cycletype;
      this.date2 = String(row.cycletime);
      this.ruleIndex = index;
    },
    // 报送规则详情
    detailRuleBtn(index, row) {
      this.detailRuleVisible = true;
      this.ruledetailForm = Object.assign({}, row);
      if (row.cycletype == 4) {
        this.dcondition = "季度";
      } else if (row.cycletype == 3) {
        this.dcondition = "每月";
      } else {
        this.dcondition = "";
      }
      if (row.cycletime == null) {
        this.date2 = "";
      } else {
        this.date2 = row.cycletime + "日";
      }
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
    // 新增规则提交
    submitRule() {
      if (this.changeNum == "add") {
        this.addRuleSubmit();
      } else {
        this.editRuleSubmit();
      }
    },
    // 新增提交
    addRuleSubmit() {
      // 判断时间是否有交叉
      // this.hasitem = [2, 3];
      // var array1 = this.checkedItems;
      // var array2 = this.hasitem;
      // var tempArray1 = [];
      // var tempArray2 = [];
      // for (var m = 0; m < array2.length; m++) {
      //   tempArray1[array2[m]] = true; //将数array2 中的元素值作为tempArray1 中的键，值为true；
      // }
      // for (var i = 0; i < array1.length; i++) {
      //   if (!tempArray1[array1[i]]) {
      //     tempArray2.push(array1[i]); //过滤array1 中与array2 相同的元素；
      //   }
      // }
      // this.checkedItems = tempArray2;

      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.ruleForm.cycletype = this.condition;
          this.ruleForm.cycletime = this.date2;
          this.ruleList.push(this.ruleForm);
          this.ruleVisible = false;
        } else {
          return false;
        }
      });
    },
    // 编辑提交
    editRuleSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.ruleForm);
          para.cycletype = this.condition;
          para.cycletime = this.date2;
          this.ruleList.splice(this.ruleIndex, 1, para);
          this.ruleVisible = false;
        } else {
          return false;
        }
      });
    },
    // 报送规则end
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
      for (var i = 0; i < this.deptList.length; i++) {
        if (this.deptList[i].id == this.addLeadData.deptid) {
          deptname = this.deptList[i].name;
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
          console.log(this.leadsData);
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
    // 报送周期不同，日期不同显示
    cycleChange() {
      this.$forceUpdate();
      this.cycleNum = this.condition;
      switch (this.cycleNum) {
        case 0:
          this.dateshow1 = true;
          this.dateshow2 = false;
          break;
        case 1:
          this.dateshow2 = true;
          this.dateshow1 = false;
          break;
      }
    },
    // 手动修改状态 - 总体进度
    totalstateChange(scope, row) {
      let para = { totalstatus: row.totalstatus, id: row.id };
      changeChengTotalState(para, data => {
        this.getAlldata();
        this.$message({
          type: "success",
          message: "修改状态成功!"
        });
      });
    },
    // 手动修改状态 - 报送进度
    formstateChange(scope, row) {
      let para = { formstatus: row.formstatus, id: row.id };
      changeChengFormState(para, data => {
        this.getAlldata();
        this.$message({
          type: "success",
          message: "修改状态成功!"
        });
      });
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
    // 序号
    numberFormatter(row, column, cellValue, index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize;
    },
    // 类型
    typeFormat(scope, value) {
      switch (value) {
        case 1:
          return "增幅";
          break;
        case 0:
          return "绝对量";
          break;
      }
    },
    // 获取浏览器高度，计算table高度
    browerHeight() {
      var bheight = document.body.clientHeight;
      var hh = bheight - 380;
      this.tableHeight = hh + "px";
    },
    // 指标列表
    getAlldata() {
      let para = { pageNum: this.currentPage, pageSize: this.pageSize };
      getDistrictIndexlist(para, data => {
        this.tableData = data.data.obj.datas;
        this.totals = data.data.obj.total;
      });
    },
    timestampToTime(row, column) {
      var date = new Date(row.startyear); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear();
      var M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var D = date.getDate() + " ";
      return Y;
    },
    timestampToTime2(row, column) {
      var date = new Date(row.endyear); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var D = date.getDate() + " ";
      return Y + M;
    },
    // 搜索
    getDatas: function() {
      let para = this.filters;
      para.pageNum = this.currentPage;
      para.pageSize = this.pageSize;
      getDistrictIndexlist(para, data => {
        this.tableData = data.data.obj.datas;
        this.totals = data.data.obj.total;
      });
    },
    selectChange() {
      this.$forceUpdate();
    },

    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getAlldata();
    },
    // 分页
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getAlldata();
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getAlldata();
    },
    getcurYear() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      this.curyear = year + "-" + month + "-" + strDate;
      return this.curyear;
    },
    // 新增
    handleAdd() {
      this.date2 = "";
      this.isStateShow = false;
      this.getcurYear();
      this.addFormVisible = true;
      this.formTitle = "新增经济指标";
      this.btnWord = "新增";
      this.change = "add";
      this.condition = "";
      this.leadsData = [];
      this.ruleForm = {};
      this.ruleList = [];
      this.addForm = {
        type: "0",
        year: this.curyear,
        condition: 3
      };
    },
    // 详情
    handleLook(index, row) {
      this.date2 = "";
      let para = { id: row.id };
      this.detailForm = {};
      this.leadsData = [];
      this.ruleForm = {};
      this.ruleList = [];
      indexByIdDistrict(para, data => {
        this.detailForm = data.data.obj;
        this.detailForm.leadername = row.leadleadername;
        if (this.detailForm.type == 0) {
          this.detailForm.type = "绝对量";
        } else {
          this.detailForm.type = "增幅";
        }
        if (data.data.obj.leaderList == null) {
          data.data.obj.leaderList = [];
        }
        this.leadsData = data.data.obj.leaderList;
        // 报送规则
        if (
          data.data.obj.ruleList == null ||
          data.data.obj.ruleList.length == 0
        ) {
          this.ruleList = [];
        } else {
          this.ruleList = data.data.obj.ruleList;
          for (var n = 0; n < this.ruleList.length; n++) {
            // 开始时间
            var sdate = this.ruleList[n].starttime;
            var date = new Date(sdate);
            var Y = date.getFullYear() + "-";
            var M =
              (date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1) + "-";
            var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            this.ruleList[n].starttime = Y + M + D;
            // 结束时间
            var edate = this.ruleList[n].endtime;
            var date2 = new Date(edate);
            var Y2 = date2.getFullYear() + "-";
            var M2 =
              (date2.getMonth() + 1 < 10
                ? "0" + (date2.getMonth() + 1)
                : date2.getMonth() + 1) + "-";
            var D2 =
              date2.getDate() < 10 ? "0" + date2.getDate() : date2.getDate();
            this.ruleList[n].endtime = Y2 + M2 + D2;
          }
        }
        this.detailFormVisible = true;
      });
    },
    // 编辑
    handleEdit(index, row) {
      this.addForm = {};
      this.date1 = "";
      this.date2 = "";
      this.leadsData = [];
      let para = { id: row.id, ishand: 1, formstatus: row.formstatus };
      indexByIdDistrict(para, data => {
        let datas = data.data.obj;
        if (datas.year == null) {
          datas.year = "";
        } else {
          datas.year = datas.year + "-01-01";
        }
        this.addForm = datas;
        this.addForm.id = row.id;
        if (datas.ischeck == 1) {
          this.addForm.ischeck = true;
        } else {
          this.addForm.ischeck = false;
        }
        this.addForm.type = String(row.type);
        // 报送规则
        if (datas.ruleList == null || datas.ruleList.length == 0) {
          this.ruleList = [];
        } else {
          this.ruleList = datas.ruleList;
          for (var n = 0; n < this.ruleList.length; n++) {
            // 开始时间
            var sdate = this.ruleList[n].starttime;
            var date = new Date(sdate);
            var Y = date.getFullYear() + "-";
            var M =
              (date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1) + "-";
            var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            this.ruleList[n].starttime = Y + M + D;
            // 结束时间
            var edate = this.ruleList[n].endtime;
            var date2 = new Date(edate);
            var Y2 = date2.getFullYear() + "-";
            var M2 =
              (date2.getMonth() + 1 < 10
                ? "0" + (date2.getMonth() + 1)
                : date2.getMonth() + 1) + "-";
            var D2 =
              date2.getDate() < 10 ? "0" + date2.getDate() : date2.getDate();
            this.ruleList[n].endtime = Y2 + M2 + D2;
          }
        }

        if (data.data.obj.leaderList == null) {
          data.data.obj.leaderList = [];
        }
        this.leadsData = data.data.obj.leaderList;
        this.formTitle = "编辑经济指标";
        this.btnWord = "保存";
        this.addFormVisible = true;
        this.change = "edit";
      });
    },
    saveSubmit() {
      if (this.change == "add") {
        this.addSubmit();
      } else {
        this.editSubmit();
      }
    },
    // 新增提交
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          if (this.addForm.ischeck == true) {
            this.addForm.ischeck = 1;
          } else {
            this.addForm.ischeck = 0;
          }
          var y = this.addForm.year;
          var n = y.slice(0, 4);
          this.addForm.year = n;
          let para = Object.assign({}, this.addForm);
          para.ishand = 0;
          para.formstatus = 0;
          para.totalstatus = 0;
          para.leaderList = this.leadsData;
          para.ruleList = this.ruleList;
          para = JSON.stringify(para);
          adddDistrictEconomic(
            para,
            res => {
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getAlldata();
            },
            () => {
              this.$message({
                message: "新增失败",
                type: "error"
              });
              this.addFormVisible = false;
            }
          );
        }
      });
    },
    // 编辑提交
    editSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          if (this.addForm.ischeck == true) {
            this.addForm.ischeck = 1;
          } else {
            this.addForm.ischeck = 0;
          }
          var y = this.addForm.year;
          var n = y.slice(0, 4);
          this.addForm.year = n;
          let para = Object.assign({}, this.addForm);
          if (this.condition == 0) {
            para.warndate = this.date1;
          } else {
            para.warnday = this.date2;
          }
          let { createtime, updatetime, ...others } = para;
          para = others;
          para.leaderList = this.leadsData;
          para.ruleList = this.ruleList;
          para = JSON.stringify(para);
          editIndexDistrict(
            para,
            res => {
              this.$message({
                message: "编辑成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getAlldata();
            },
            () => {
              this.$message({
                message: "编辑失败",
                type: "error"
              });
            }
          );
        }
      });
    }
  }
};
</script>


<style lang="scss">
.tableinfo .btn {
  color: #1890ff;
  background: transparent;
  border: 0;
  padding: 0 3px;
  margin: 0;
}
.managebox {
  .addrow {
    display: flex;
    align-items: stretch;
    fieldset {
      height: 100%;
    }
  }
  .boxcontent {
    padding: 20px;
    .day {
      .el-input__inner {
        width: 80px;
        border-radius: 4px;
      }
      .el-input-group__append {
        padding: 0 8px;
        background: #fff;
        border: 0;
        color: #222;
      }
      .el-input-group {
        display: flex;
        align-items: center;
      }
    }
  }
  .detail-check {
    .el-checkbox__input.is-disabled + span.el-checkbox__label {
      color: #222;
    }
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
      background-color: #409eff;
      border-color: #409eff;
    }
    .el-checkbox__input.is-disabled .el-checkbox__inner {
      background: #fff;
    }
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    color: #fff;
    border-color: #fff;
  }
  // .el-input__inner {
  //   width: 200px;
  // }
  // .el-date-editor.el-input,
  // .managebox .el-date-editor.el-input__inner {
  //   width: 200px;
  // }
  // .deptarea {
  //   .el-textarea__inner {
  //     width: 200px;
  //   }
  // }
  // .remark {
  //   display: block;
  //   .el-textarea__inner {
  //     width: 550px;
  //   }
  // }
  .yearbox {
    position: relative;
    width: 350px;
    margin-right: 10px;
    display: inline-block;
    .jiabtn {
      height: 36px;
      line-height: 36px;
      position: absolute;
      right: 0;
      top: 0;
      .icon {
        color: #666;
        font-size: 24px;
        display: inline-block;
        height: 40px;
        line-height: 40px;
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
  }
}
.manage-index {
  .toolbar {
    .el-form--inline .ybox {
      margin-right: 5px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 150px;
    }
  }
}

.tableinfo {
  .flexbox {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .stateSelect {
    width: 50px;
    margin-left: 5px;
    .el-input__inner {
      background-color: transparent;
      padding: 0;
      border: none;
      height: 26px;
      line-height: 28px;
      font-size: 12px;
      color: #666;
    }
    .el-input__suffix {
      display: none;
    }
  }
}
</style>