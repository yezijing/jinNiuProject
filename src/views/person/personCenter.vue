<template>
  <div class="content-wrap center">
    <p class="navtitle">
      <span>个人中心</span>
    </p>
    <div class="mycenter-wrap">
      <div class="leftbox">
        <!-- <el-card class="box-card box-card1">
          <div slot="header" class="clearfix">
            <span class="card-title">考评积分</span>
          </div>
          <div class="img" id="mycharts-one"></div>
        </el-card> -->
        <el-card class="box-card box-card1">
          <div slot="header" class="clearfix">
            <span class="card-title">逾期次数</span>
          </div>
          <div class="numbox" id="mycharts-two"></div>
        </el-card>
        <el-card class="box-card box-card1">
          <div slot="header" class="clearfix">
            <span class="card-title">材料审核未通过</span>
          </div>
          <div class="numbox" id="mycharts-three"></div>
        </el-card>
        <el-card class="box-card box-card1">
          <div slot="header" class="clearfix">
            <span class="card-title">工作滞后</span>
          </div>
          <div class="numbox" id="mycharts-four"></div>
        </el-card>
      </div>
      <div class="rightbox">
        <!-- 预警信息 -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="card-title">预警信息</span>
          </div>
          <el-table
            class="tableinfo"
            border
            height="400px"
            :data="earlyData"
            highlight-current-row
            :cell-class-name="cellClassName"
            style="width: 100%;"
            :row-class-name="tableRowClassName"
          >
            <el-table-column prop="warnName" label="名称">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div
                    style="max-width:300px;line-height:1.8;"
                    slot="content"
                  >{{scope.row.warnName}}</div>
                  <p class="title title-ellipsis">{{scope.row.warnName}}</p>
                  <!-- @click="handleDetail(scope.row)" -->
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="warnTypeSearch"
              label="类别"
              :filters="watypes"
              :filter-method="filterTag4"
              filter-placement="bottom"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.warnTypeSearch==1">重点项目</span>
                <span v-else-if="scope.row.warnTypeSearch==2">批交办事项</span>
                <span v-else-if="scope.row.warnTypeSearch==3">三年行动计划</span>
                <span v-else-if="scope.row.warnTypeSearch==4">现场办公会</span>
                <span v-else-if="scope.row.warnTypeSearch==9">区级指标管理</span>
                <span v-else-if="scope.row.warnTypeSearch==10">承办单位指标管理</span>
                <span v-else-if="scope.row.warnTypeSearch==7">片区督查</span>
                <span v-else-if="scope.row.warnTypeSearch==12">重点工作</span>
                <span v-else>/</span>
              </template>
            </el-table-column>
            <el-table-column prop="endTime" :formatter="timestampToTime2" label="截止时间" sortable></el-table-column>
            <el-table-column
              prop="formstatus"
              label="材料报送"
              :filters="[{ text: '预警', value: 1 }, { text: '逾期', value: 2 }, { text: '完结', value: -1 }, { text: '正常', value: 0 }]"
              :filter-method="filterFormstatus"
              filter-placement="bottom"
            >
              <template slot-scope="scope">
                <el-tag size="medium">
                  <i class="fa mark" v-if="scope.row.formstatus==1" style="background:#fbe804;"></i>
                  <i class="fa mark" v-else-if="scope.row.formstatus==2" style="background:#f00;"></i>
                  <i class="fa mark" v-else-if="scope.row.formstatus== -1" style="background:#999;"></i>
                  <i class="fa mark" v-else-if="scope.row.formstatus== null" style="display:none;"></i>
                  <i class="fa mark" v-else></i>
                  <span v-html="formstatusFormat(scope,scope.row.formstatus)"></span>
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="totalstatus" label="总体进度">
              <template slot-scope="scope">
                <el-tag size="medium">
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
                  <i
                    class="fa mark"
                    v-else-if="scope.row.totalstatus== 1"
                    style="background:#fbe804;"
                  ></i>
                  <i class="fa mark" v-else-if="scope.row.totalstatus== null" style="display:none;"></i>
                  <i class="fa mark" v-else></i>
                  <span v-html="totalstatusFormat(scope,scope.row.totalstatus)"></span>
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button class="btn" @click="handleDetail(scope.row)">详情</el-button>
                <el-button
                  class="btn baobtn"
                  v-if="reportBtnShow"
                  @click="handleSubmit(scope.$index, scope.row)"
                >报送</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <!-- 待审核事务 -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="card-title">待审核事务</span>
          </div>
          <el-table
            class="tableinfo"
            border
            :data="tobeCheck"
            highlight-current-row
            :cell-class-name="cellClassName"
            :row-class-name="shenheRowClassName"
            style="width: 100%;"
            height="400px"
          >
            <el-table-column
              prop="reportdept"
              label="报送单位"
              v-if="postUnit"
              :filters="redetps"
              :filter-method="filterTag2"
              filter-placement="bottom"
            ></el-table-column>
            <el-table-column
              prop="transTypeSearch"
              label="报送类别"
              width="130px"
              :filters="retypes"
              :filter-method="filterTag3"
              filter-placement="bottom"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.transTypeSearch==1">重点项目</span>
                <span v-else-if="scope.row.transTypeSearch==2">批交办事项</span>
                <span v-else-if="scope.row.transTypeSearch==3">三年行动计划</span>
                <span v-else-if="scope.row.transTypeSearch==4">承办单位指标管理</span>
                <span v-else-if="scope.row.transTypeSearch==5">区级指标管理</span>
                <span v-else-if="scope.row.transTypeSearch==6">现场办公会</span>
                <span v-else-if="scope.row.transTypeSearch==9">片区督查</span>
                <span v-else-if="scope.row.transTypeSearch==12">重点工作</span>
                <span v-else>/</span>
              </template>
            </el-table-column>
            <el-table-column prop="transName" label="报送关联事务">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div
                    style="max-width:300px;line-height:1.8;"
                    slot="content"
                  >{{scope.row.transName}}</div>
                  <p class="title title-ellipsis">{{scope.row.transName}}</p>
                  <!-- @click="handleExamineDetail(scope.row)" -->
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="reportTime" label="报送时间" sortable width="170px">
              <template slot-scope="scope">
                <span>{{scope.row.reportTime | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
              <template scope="scope">
                <!-- <el-button class="btn" @click="handleVerifyDetail(scope.$index, scope.row)">详情</el-button> -->
                <el-button
                  class="btn nobtn"
                  v-if="isCheckShow"
                  @click="handleVerifySubmit(scope.$index, scope.row)"
                >审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <!-- 已审核事务 -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="card-title">已审核事务</span>
          </div>
          <pass-table
            :passHeight="passHeight"
            :passData="overCheck"
            :isLeaderUnit="isLeaderUnit"
            :overpostUnit="overpostUnit"
          ></pass-table>
        </el-card>
      </div>
      <div class="clear"></div>
    </div>
    <!-- -------------------- 报送 ---------------- -->
    <!-- 进展填报弹窗 -->
    <div class="report-data-box">
      <report-progress
        :reportVisible.sync="reportVisible"
        :reportData="reportData"
        :laststate="laststate"
        :itemShow="itemShow"
        :workid="checkid"
        :reportBasic="reportBasic"
        :fileList.sync="fileList"
        :fileArr.sync="fileArr"
        :isExport.sync="isExport"
        @getAllList-event="getProjectAll"
      ></report-progress>
    </div>

    <!-- ----------------- 审核start --------------------- -->
    <el-dialog
      :title="examineTitle"
      :visible.sync="examineVisible"
      width="1200px"
      class="report-dialog"
    >
      <examine-content
        :examineVisible.sync="examineVisible"
        :examineFileArr.sync="examineFileArr"
        :reportBasic="reportBasic"
        :examineData.sync="examineData"
        :laststate="laststate"
        :itemShow="itemShow"
        :zhihouShow="zhihouShow"
        :noneFile="noneFile"
        :reasonShow="reasonShow"
        ref="examineChild"
      ></examine-content>
      <div slot="footer" class="dialog-footer">
        <div v-if="btnShow">
          <el-button type="primary" size="small" @click="nopass">不通过</el-button>
          <el-button type="primary" size="small" @click="gopass">通 过</el-button>
        </div>
        <el-button v-if="sureShow" type="primary" size="small" @click="examineVisible=false">确定</el-button>
      </div>
      <el-dialog width="400px" title="填写不通过原因" :visible.sync="innerVisible" append-to-body>
        <el-input type="textarea" :rows="3" v-model="nopassReason"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="innerVisible=false">返回</el-button>
          <el-button type="primary" size="small" @click="reasonBtns">确定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <!-- ----------------- 审核end --------------------- -->

    <!-- 区县填报数据报表 -->
    <el-dialog title="指标数据审核" :visible.sync="indexVisible" width="1200px" class="task-dialog">
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
      <div style="margin-top:20px;" v-if="zhihouShow">
        <el-form
          :model="zhihouForm"
          label-width="120px"
          ref="zhihouForm"
          :append-to-body="true"
          size="small"
        >
          <el-form-item
            label="是否滞后："
            prop="orZhiHou"
            :rules="[{ required: true, message: '请选择是否滞后', trigger: 'change' }]"
          >
            <el-radio-group v-model="zhihouForm.orZhiHou">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <div v-if="btnShow">
          <el-button type="primary" size="small" @click="nopassClick">不通过</el-button>
          <el-button type="primary" size="small" @click="areaGopass">通 过</el-button>
        </div>
        <el-button v-if="sureShow" type="primary" size="small" @click="indexVisible=false">确定</el-button>
      </div>
      <el-dialog width="400px" title="填写不通过原因" :visible.sync="innerAreaVisible" append-to-body>
        <el-input type="textarea" :rows="3" v-model="areaNopassReason"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="innerAreaVisible=false">取消</el-button>
          <el-button type="primary" size="small" @click="areaNopass">确定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <!-- 承办单位数据报表 -->
    <el-dialog title="指标数据审核" :visible.sync="indexAreaVisible" width="1200px" class="task-dialog">
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
      <div style="margin-top:20px;" v-if="zhihouShow">
        <el-form
          :model="zhihouForm"
          label-width="120px"
          ref="zhihouForm"
          :append-to-body="true"
          size="small"
        >
          <el-form-item
            label="是否滞后："
            prop="orZhiHou"
            :rules="[{ required: true, message: '请选择是否滞后', trigger: 'change' }]"
          >
            <el-radio-group v-model="zhihouForm.orZhiHou">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <div v-if="btnShow">
          <el-button type="primary" size="small" @click="nopassClick">不通过</el-button>
          <el-button type="primary" size="small" @click="areaGopass">通 过</el-button>
        </div>
        <el-button v-if="sureShow" type="primary" size="small" @click="indexAreaVisible=false">确定</el-button>
      </div>
      <el-dialog width="400px" title="填写不通过原因" :visible.sync="innerAreaVisible" append-to-body>
        <el-input type="textarea" :rows="3" v-model="areaNopassReason"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="innerAreaVisible=false">取消</el-button>
          <el-button type="primary" size="small" @click="areaNopass">确定</el-button>
        </div>
      </el-dialog>
    </el-dialog>

    <!-- 指标详情 -->
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
      <el-row class="index-leader" :gutter="20">
        <el-col :span="12">
          <fieldset>
            <legend>牵头单位</legend>
            <div class="boxcontent">
              <el-table
                border
                :data="leadsData"
                highlight-current-row
                class="tableinfo"
                height="200px"
              >
                <el-table-column prop="deptName" label="牵头单位"></el-table-column>
                <el-table-column prop="leadername" label="责任领导"></el-table-column>
                <el-table-column prop="leaderphone" label="联系方式"></el-table-column>
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
                      <el-tag size="small" v-if="scope.row.status==1">
                        <i class="fa mark" style="background:#364e98;"></i>
                        <span>执行中</span>
                      </el-tag>
                      <el-tag size="small" v-else-if="scope.row.status==2">
                        <i class="fa mark"></i>
                        <span>未执行</span>
                      </el-tag>
                      <el-tag size="small" v-else-if="scope.row.status==0">
                        <i class="fa mark" style="background:#999;"></i>
                        <span>失效</span>
                      </el-tag>
                      <p v-else>/</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="60">
                  <template scope="scope">
                    <el-button
                      class="btn"
                      size="small"
                      @click="detailRuleBtn(scope.$index, scope.row)"
                    >详情</el-button>
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

    <!-- 预警设置详情 -->
    <el-dialog title="规则详情" :visible.sync="detailRuleVisible" class="rule-dialog" width="420px">
      <div>
        <el-form :model="ruledetailForm" label-width="120px" ref="ruledetailForm" size="small">
          <el-form-item label="预警条件：" prop="stagename">
            <el-input readonly v-model="ruledetailForm.stagename"></el-input>
          </el-form-item>
          <el-form-item label="预警条件：" prop="condition">
            <el-input readonly v-model="ruledetailForm.condition"></el-input>
          </el-form-item>
          <el-form-item label="预警日期：" prop="date">
            <el-input readonly v-model="ruledetailForm.date"></el-input>
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
        <el-button @click="detailRuleVisible=false" size="small" type="primary">确定</el-button>
      </div>
    </el-dialog>

    <!-- 数据统计弹窗 -->
    <el-dialog title="详情" :visible.sync="alldataVisible" class="alldata" width="800px">
      <el-table
        class="tableinfo"
        border
        :data="alldatas"
        highlight-current-row
        style="width: 100%;"
        height="500px"
      >
        <el-table-column label="名称" prop="name">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="alldataVisible=false" size="small" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons");
require("echarts/theme/dark");
import reportProgress from "../reportItem"; //进展汇报
import examineContent from "../examine"; //审核详情
import passTable from "../../components/passTable"; //已审核信息table

import { upfile, imgIp } from "../../api/imgUrl";
import {
  getPersonAll,
  getCheckDetail,
  passChange,
  centerGetTargetList,
  updateTargetStatus,
  projectPassStatus,
  assignPassStatus,
  synchFormstate,
  showLasttimeState,
  showLasttimeState3,
  addShowLasttime,
  repeatReport,
  repeatAssignReport,
  repeatThreeReport,
  getCenterNumber
} from "../../api/center";
import {
  addAssignReport,
  assignDetail,
  showAssignLasttime
} from "../../api/assignApi";
import {
  threeUpDetail,
  threePlanDetail2,
  repeatReportDecisionArea,
  repeatReportDecisionUp
} from "../../api/workApi";
import { alldeptList, reportTerm, savereportInfo } from "../../api/api";
import { addProgress, getdetailProject } from "../../api/projectApi";
import { areaViewReport, otherViewReport } from "../../api/targetApi2";
import { indexById, indexByIdDistrict } from "../../api/targetApi";
import {
  showThreeplanLasttime,
  showImportworkLasttime,
  threePlanDetail,
  addPlanReport,
  addImportworkReport,
  importWorkDetailData,
  repeatReportImportwork
} from "../../api/decisionApi";
import {
  keyitemDetail,
  keyAreaDetail,
  keyWorkDetail,
  repeatReportKeywork,
  repeatReportKeyarea,
  repeatItemReport,
  lasttimeKeyworkProgress,
  lasttimeKeyareaProgress,
  lastKeyitemProgress
} from "../../api/threework";

export default {
  name: "personCenter",
  components: {
    reportProgress,
    examineContent,
    passTable
  },
  data() {
    return {
      isExport: {visible:true},
      isLeaderUnit: true,
      passHeight: "400px",
      itemShow: 0,
      reportBasic: {},
      alldataVisible: false, // 数据统计弹窗
      alldatas: [], //数据详情
      laststate: "",
      ruleList: [],
      detailRuleVisible: false,
      ruledetailForm: {},
      isNumshow: true,
      isZengshow: true,
      detailFormVisible: false,
      detailForm: {},
      leadsData: [],
      date2: "",
      dcondition: "",
      zhihouForm: {},
      loginid: JSON.parse(this.$store.getters.userdata).id,
      postUnit: true, //是否显示报送单位，区委办角色显示报送单位，牵头单位角色不需要报送单位--待审核
      overpostUnit: true, //是否显示报送单位，区委办角色显示报送单位，牵头单位角色不需要报送单位--已审核
      selfCommit: [
        { value: 0, name: "正常" },
        { value: 1, name: "滞后" },
        { value: 2, name: "严重滞后" }
      ],
      earlyData: [], //预警信息列表
      tobeCheck: [], //待审核列表
      overCheck: [], //已审核列表
      reportVisible: {visible:false}, //报送弹窗隐藏显示
      receiptVisible: false,
      checkProgressVisible: false,
      checkReceiptVisible: false,
      // 指标填报审核
      innerAreaVisible: false, //不通过弹窗
      areaNopassReason: "", //不通过原因
      preDatas: [], //区县填报数据报表
      viewTitle: "", //区县填报数据报表 表头
      indexVisible: false, //区县报表
      indexAreaVisible: false, //承办单位报表
      areaDatas: [], //承办单位报表数据
      spanArr: [],
      spanPos: 0,
      choosename: "",
      reportData: {},
      receiptData: {},
      isRead: false,
      fileList: [],
      filepath: [],
      reportCheckData: {},
      receiptCheckData: {},
      dtype: "",
      did: "",
      dtype2: "",
      did2: "",
      personCheckList: JSON.parse(this.$store.getters.userdata).personCheckList,
      isCheckShow: false,
      upfile: "",
      imgIp: "",
      innerVisible: false,
      nopassReason: "",
      bigid: "",
      addnum: "",
      reportType: "",
      targetData: [], //目标待审核数据列表
      fileArr: [], //项目上传附件list
      zhihouShow: true,
      sureShow: false,
      btnShow: true,
      reasonShow: false,
      evolveVisible: false,
      evolveData: {}, //报送
      examineData: {}, //审核数据
      examineVisible: false, //审核弹窗是否显示
      examineType: 0, //审核类型（0项目，1批交办，2三年行动集合）
      examineId: 0, //审核id,
      examineTitle: "", //审核弹窗标题
      examineFileArr: [], //审核附件
      noneFile: false, //没有附件显示无
      reportType: 0, //报送类型（1项目、2批交办、3三年行动集合）
      checkid: "", //报送id
      eid: 0,
      reportBtnShow: false, //是否显示报送按钮，只有牵头单位才显示报送
      leadunits: [],
      redetps: [],
      retypes: [
        { value: 1, text: "重点项目" },
        { value: 2, text: "批交办事项" },
        { value: 3, text: "三年行动计划" },
        { value: 4, text: "承办单位指标管理" },
        { value: 5, text: "区级指标管理" },
        { value: 6, text: "现场办公会" },
        { value: 9, text: "片区督查" },
        { value: 12, text: "重点工作" }
      ], //报送类别
      watypes: [
        { value: 1, text: "重点项目" },
        { value: 2, text: "批交办事项" },
        { value: 3, text: "三年行动计划" },
        { value: 4, text: "现场办公会" },
        { value: 7, text: "片区督查" },
        { value: 12, text: "重点工作" },
        { value: 9, text: "区级指标管理" },
        { value: 10, text: "承办单位指标管理" }
      ], //预警类别
      isCenter: 2,
      nopassData: [
        { value: 0, name: "重点项目" },
        { value: 0, name: "批交办事项" },
        { value: 0, name: "三年行动计划" },
        { value: 0, name: "现场办公会" },
        { value: 0, name: "片区督查" },
        { value: 0, text: "重点工作" }
      ],
      zhihouData: [
        { value: 0, name: "重点项目" },
        { value: 0, name: "批交办事项" },
        { value: 0, name: "三年行动计划" },
        { value: 0, name: "现场办公会" },
        { value: 0, name: "片区督查" },
        { value: 0, text: "重点工作" }
      ],
      overdueData: [
        { value: 0, name: "重点项目" },
        { value: 0, name: "批交办事项" },
        { value: 0, name: "三年行动计划" },
        { value: 0, name: "现场办公会" },
        { value: 0, name: "片区督查" },
        { value: 0, text: "重点工作" }
      ]
    };
  },
  mounted: function() {
    this.drawCharts();
  },
  created() {
    this.upfile = upfile;
    this.imgIp = imgIp;
    this.isshowCheck();
    this.getAllList();
    this.getDeptlist();
    this.numberGetlist();
  },
  methods: {
    numberGetlist() {
      getCenterNumber({ userid: this.loginid }, data => {
        var str = data.data.obj;
        this.zhihouData = [
          { value: str.proLater, name: "重点项目" },
          { value: str.checkLater, name: "批交办事项" },
          { value: str.threeLater, name: "三年行动计划" },
          { value: str.liDaoLater, name: "现场办公会" },
          { value: str.qingkuangLater, name: "片区督查" },
          { value: str.pointLater, name: "重点工作" }
        ];
        this.nopassData = [
          { value: str.proValidate, name: "重点项目" },
          { value: str.checkValidate, name: "批交办事项" },
          { value: str.threeValidate, name: "三年行动计划" },
          { value: str.liDaoValidate, name: "现场办公会" },
          { value: str.qingkuangValidate, name: "片区督查" },
          { value: str.pointValidate, name: "重点工作" }
        ];
        this.overdueData = [
          { value: str.proOver, name: "重点项目" },
          { value: str.checkOver, name: "批交办事项" },
          { value: str.threeOver, name: "三年行动计划" },
          { value: str.liDaoOver, name: "现场办公会" },
          { value: str.qingkuangOver, name: "片区督查" },
          { value: str.pointOver, name: "重点工作" }
        ];
        this.drawCharts();
      });
    },
    // 报送规则详情
    detailRuleBtn(index, row) {
      this.detailRuleVisible = true;
      this.ruledetailForm = Object.assign({}, row);
      if (row.cycletype == 4) {
        this.ruledetailForm.condition = "季度";
      } else if (row.cycletype == 3) {
        this.ruledetailForm.condition = "每月";
      } else {
        this.ruledetailForm.condition = "";
      }
      if (row.cycletime == null) {
        this.ruledetailForm.date = "";
      } else {
        this.ruledetailForm.date = row.cycletime + "日";
      }
    },
    //   获取部门列表
    getDeptlist: function() {
      alldeptList("", data => {
        this.leadunits = data.data.obj;
        for (var i = 0; i < this.leadunits.length; i++) {
          var obj = {};
          obj.text = this.leadunits[i].name;
          obj.value = this.leadunits[i].name;
          this.redetps.push(obj);
        }
      });
    },
    filterTag2(value, row) {
      return row.reportdept === value;
    },
    filterTag3(value, row) {
      return row.transTypeSearch === value;
    },
    filterTag4(value, row) {
      return row.warnTypeSearch === value;
    },
    filterFormstatus(value, row) {
      return row.formstatus === value;
    },
    // 积分charts
    integralCharts() {
      let myChart = echarts.init(document.getElementById("mycharts-one"));
      myChart.setOption({
        title: {
          x: "center",
          bottom: 50,
          subtext: "当前积分",
          subtextStyle: {
            color: "#000"
          }
        },
        tooltip: {
          show: true,
          backgroundColor: "#F7F9FB",
          borderColor: "#92DAFF",
          borderWidth: "1px",
          textStyle: {
            color: "black"
          },
          formatter: function(param) {
            return (
              '当前积分：<span style="color:' +
              param.color +
              ';">' +
              param.value +
              "</span> 分"
            );
          }
        },
        series: [
          {
            name: "信用分",
            type: "gauge",
            radius: "85%",
            min: 0,
            max: 100,
            axisLine: {
              show: true,
              lineStyle: {
                width: 30,
                shadowBlur: 0,
                color: [
                  [0.4, "#E43F3D"],
                  [0.6, "#E98E2C"],
                  [0.7, "#DDBD4D"],
                  [0.8, "#7CBB55"],
                  [1, "#999933"]
                ]
              }
            },
            axisTick: {
              show: true,
              splitNumber: 1
            },
            splitLine: {
              show: true,
              length: 30
            },
            axisLabel: {
              formatter: function(e) {
                switch (e + "") {
                  case "40":
                    return "较差";
                  case "60":
                    return "达标";
                  case "70":
                    return "良好";
                  case "80":
                    return "优秀";
                  case "100":
                    return "非常好";
                  default:
                    return e;
                }
              },
              textStyle: {
                fontSize: 12,
                fontWeight: ""
              }
            },
            pointer: {
              show: true
            },
            detail: {
              formatter: "{value}",
              offsetCenter: [0, "50%"],
              textStyle: {
                fontSize: 36
              }
            },
            data: [
              {
                name: "",
                value: 85
              }
            ]
          }
        ]
      });
    },
    // 逾期统计
    overdueCharts() {
      let myChart = echarts.init(document.getElementById("mycharts-two"));
      var _this = this;
      myChart.on("click", function(params) {
        _this.alldataVisible = true;
      });
      myChart.setOption({
        textStyle: {
          fontSize: 20 // 调节字体大小
        },
        title: {
          text: "", // 主标题名称
          subtext: "", // 副标题名称
          x: "center" // 标题的位置
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/>{a} : {c}次"
        },
        legend: {
          x: "center", // 标签的位置
          y: "bottom",
          textStyle: {
            color: "#333",
            fontSize: 12
          },
          data: [
            "重点项目",
            "批交办事项",
            "三年行动计划",
            "现场办公会",
            "片区督查"
          ]
        }, // 标签变量名称
        calculable: true,
        color: ["#336666", "#FF9900", "#663366", "#999900", "#990033"], //自己设置扇形图颜色
        series: [
          {
            name: "逾期次数", // 图表名称
            type: "pie", // 图表类型
            radius: [20, 100], // 图表内外半径大小
            center: ["50%", "50%"], // 图表位置
            roseType: "area",
            label: {
              normal: {
                show: true,
                formatter: "{b}{c}次" // 显示百分比
              }
            },
            data: this.overdueData,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{c}次",
                  textStyle: {
                    fontSize: 12
                  }
                },
                //标线长度，宽度
                labelLine: {
                  show: true,
                  length: 10,
                  lineStyle: {
                    width: 1
                  }
                }
              }
            }
          }
        ]
      });
    },
    // 资料审核未通过
    nopassCharts() {
      let myChart = echarts.init(document.getElementById("mycharts-three"));
      myChart.setOption({
        textStyle: {
          fontSize: 20 // 调节字体大小
        },
        title: {
          text: "", // 主标题名称
          subtext: "", // 副标题名称
          x: "center" // 标题的位置
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/>{a} : {c}个"
        },
        legend: {
          x: "center", // 标签的位置
          y: "bottom",
          textStyle: {
            color: "#333",
            fontSize: 12
          },
          data: [
            "重点项目",
            "批交办事项",
            "三年行动计划",
            "现场办公会",
            "片区督查"
          ]
        }, // 标签变量名称
        calculable: true,
        color: ["#336666", "#FF9900", "#663366", "#999900", "#990033"], //自己设置扇形图颜色
        series: [
          {
            name: "审核未通过", // 图表名称
            type: "pie", // 图表类型
            radius: [20, 100], // 图表内外半径大小
            center: ["50%", "50%"], // 图表位置
            roseType: "area",
            label: {
              normal: {
                show: true,
                formatter: "{b}{c}个" // 显示百分比
              }
            },
            data: this.nopassData,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{c}次",
                  textStyle: {
                    fontSize: 12
                  }
                },
                //标线长度，宽度
                labelLine: {
                  show: true,
                  length: 10,
                  lineStyle: {
                    width: 1
                  }
                }
              }
            }
          }
        ]
      });
    },
    // 工作滞后
    zhihouCharts() {
      let myChart = echarts.init(document.getElementById("mycharts-four"));
      myChart.setOption({
        textStyle: {
          fontSize: 20 // 调节字体大小
        },
        title: {
          text: "", // 主标题名称
          subtext: "", // 副标题名称
          x: "center" // 标题的位置
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/>{a} : {c}个"
        },
        legend: {
          x: "center", // 标签的位置
          y: "bottom",
          textStyle: {
            color: "#333",
            fontSize: 12
          },
          data: [
            "重点项目",
            "批交办事项",
            "三年行动计划",
            "现场办公会",
            "片区督查"
          ]
        }, // 标签变量名称
        calculable: true,
        color: ["#336666", "#FF9900", "#663366", "#999900", "#990033"], //自己设置扇形图颜色
        series: [
          {
            name: "审核未通过", // 图表名称
            type: "pie", // 图表类型
            radius: [20, 100], // 图表内外半径大小
            center: ["50%", "50%"], // 图表位置
            roseType: "area",
            barMinHeight: 10,
            label: {
              normal: {
                show: true,
                formatter: "{b}{c}个" // 显示百分比
              }
            },
            data: this.zhihouData,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{c}次",
                  textStyle: {
                    fontSize: 12
                  }
                },
                //标线长度，宽度
                labelLine: {
                  show: true,
                  length: 10,
                  lineStyle: {
                    width: 1
                  }
                }
              }
            }
          }
        ]
      });
    },
    drawCharts() {
      // this.integralCharts();
      this.overdueCharts();
      this.nopassCharts();
      this.zhihouCharts();
    },
    filterTag(value, row) {
      return row.statsus === value;
    },

    isshowCheck() {
      if (this.personCheckList !== null) {
        for (var i = 0; i < this.personCheckList.length; i++) {
          let value = this.personCheckList[i];
          switch (value) {
            case "E-check":
              this.isCheckShow = true;
              break;
          }
        }
      }
    },
    timestampToTime(row, column) {
      var date = new Date(row.reportTime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate();
      return Y + M + D;
    },
    timestampToTime2(row, column) {
      var date = new Date(row.endTime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate();
      return Y + M + D;
    },
    // 目标审核列表时间转换
    retimestampToTime(row, column) {
      var date = new Date(row.reportDate); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate();
      return Y + M + D;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.formstatus == 0 || row.formstatus == -1) {
        return "nobaosong";
      }
      if (row.warnType == 9 || row.warnType == 10) {
        return "nobaosong";
      }
    },
    shenheRowClassName({ row, rowIndex }) {
      if (row.statsus == 1) {
        return "nopass";
      }
    },
    // 预警信息列表
    getAllList() {
      let para = { userid: this.loginid };
      getPersonAll(para, data => {
        this.earlyData = data.data.obj.warnMessage;
        this.tobeCheck = data.data.obj.stayTransMessage;
        this.overCheck = data.data.obj.accessMessage;
        if (this.overCheck == null) {
          this.overpostUnit = false;
        } else {
          this.overCheck.sort(function(a, b) {
            return a.auditTime > b.auditTime ? 1 : -1;
          });
          for (var i = 0; i < this.overCheck.length; i++) {
            var type = this.overCheck[i].transType;
            this.overCheck[i].transTypeSearch = type;
            if (type == 6 || type == 7 || type == 8) {
              this.overCheck[i].transTypeSearch = 6;
            } else if (type == 9 || type == 10 || type == 11) {
              this.overCheck[i].transTypeSearch = 11;
            }
          }
        }

        if (this.earlyData == null) {
          this.earlyData = [];
        } else {
          // this.earlyData.sort(function(a, b) {
          //   return a.endTime > b.endTime ? 1 : -1;
          // });

          for (var n = 0; n < this.earlyData.length; n++) {
            this.earlyData[n].warnTypeSearch = this.earlyData[n].warnType;
            if (
              this.earlyData[n].warnType == 4 ||
              this.earlyData[n].warnType == 5 ||
              this.earlyData[n].warnType == 6
            ) {
              this.earlyData[n].warnTypeSearch = 4;
            } else if (
              this.earlyData[n].warnType == 7 ||
              this.earlyData[n].warnType == 8 ||
              this.earlyData[n].warnType == 11
            ) {
              this.earlyData[n].warnTypeSearch = 7;
            }
          }
        }
        if (data.data.obj.roleType == 0) {
          this.reportBtnShow = false;
        } else {
          this.reportBtnShow = true;
        }
        if (this.tobeCheck == null) {
          this.postUnit = false;
        } else {
          this.tobeCheck.sort(function(a, b) {
            return a.reportTime > b.reportTime ? 1 : -1;
          });
          let nn = this.tobeCheck[0].checkRoleIsShow;
          if (nn == 0) {
            this.postUnit = true;
          } else {
            this.postUnit = false;
          }
          for (var j = 0; j < this.tobeCheck.length; j++) {
            this.tobeCheck[j].transTypeSearch = this.tobeCheck[j].transType;
            if (
              this.tobeCheck[j].transType == 6 ||
              this.tobeCheck[j].transType == 7 ||
              this.tobeCheck[j].transType == 8
            ) {
              this.tobeCheck[j].transTypeSearch = 6;
            } else if (
              this.tobeCheck[j].transType == 9 ||
              this.tobeCheck[j].transType == 10 ||
              this.tobeCheck[j].transType == 11
            ) {
              this.tobeCheck[j].transTypeSearch = 9;
            } else if (this.tobeCheck[j].transType == 12) {
              this.tobeCheck[j].transTypeSearch = 12;
            }
          }
        }
      });
      let para2 = { userId: this.loginid };
      centerGetTargetList(para2, data => {
        this.targetData = data.data.obj;
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
        case 1:
          return "预警";
          break;
        case null:
          return "/";
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
        case null:
          return "/";
          break;
      }
    },
    indextypeFormat(scope, value) {
      switch (value) {
        case "0":
          return "绝对量";
          break;
        case "1":
          return "增幅";
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
    // 区级指标详情
    handleIndexLook(zid) {
      this.leadsData = [];
      let para = { id: zid };
      this.ruleList = [];
      this.detailForm = {};
      indexById(para, data => {
        this.detailForm = data.data.obj;
        if (data.data.obj.leaderList == null) {
          data.data.obj.leaderList = [];
        }
        this.leadsData = data.data.obj.leaderList;
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
      });
    },
    // 承办单位指标详情
    handleIndexLook2(zid) {
      this.leadsData = [];
      let para = { id: zid };
      this.ruleList = [];
      this.detailForm = {};
      indexByIdDistrict(para, data => {
        this.detailForm = data.data.obj;
        if (data.data.obj.leaderList == null) {
          data.data.obj.leaderList = [];
        }
        this.leadsData = data.data.obj.leaderList;
        var ruleform = {};
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
      });
    },

    // 预警信息点击详情-进项目详情
    handleDetail(row) {
      if (row.warnType == 1) {
        //项目
        this.$router.push({
          path: "/projectList",
          query: { projectId: row.pid, isCenter: 2 }
        });
      } else if (row.warnType == 2) {
        //批交办
        this.$router.push({
          path: "/assignList",
          query: { checkid: row.pid, isCenter: 2 }
        });
      } else if (row.warnType == 3) {
        // 三年行动计划
        this.$router.push({
          path: "/decision2",
          query: { workid: row.pid, isCenter: 2 }
        });
      } else if (row.warnType == 4) {
        // 领导指示分工
        this.$router.push({
          path: "/working",
          query: {
            workid: row.pid,
            isWorkShow: true,
            isWorkShow2: false,
            isWorkShow3: false,
            activeClass: 0,
            isCenter: 2,
            sortnum: 0
          }
        });
      } else if (row.warnType == 9) {
        // 区级指标
        var zid = row.pid;
        this.detailFormVisible = true;
        this.handleIndexLook(zid);
      } else if (row.warnType == 10) {
        // 承办单位指标
        var zid = row.pid;
        this.detailFormVisible = true;
        this.handleIndexLook2(zid);
      } else if (row.warnType == 5) {
        // 向上指示分工
        this.$router.push({
          path: "/working",
          query: {
            workid: row.pid,
            isWorkShow: false,
            isWorkShow2: true,
            isWorkShow3: false,
            activeClass: 1,
            isCenter: 2,
            sortnum: 1
          }
        });
      } else if (row.warnType == 6) {
        // 需我区协调工作
        this.$router.push({
          path: "/working",
          query: {
            workid: row.pid,
            isWorkShow: false,
            isWorkShow2: false,
            isWorkShow3: true,
            activeClass: 2,
            isCenter: 2,
            sortnum: 2
          }
        });
      } else if (row.warnType == 7) {
        // 重点工作
        this.$router.push({
          path: "/threework",
          query: {
            workid: row.pid,
            isWorkShow: true,
            isWorkShow2: false,
            isWorkShow3: false,
            activeClass: 0,
            isCenter: 2,
            sortnum: 0
          }
        });
      } else if (row.warnType == 8) {
        // 重要片区
        this.$router.push({
          path: "/threework",
          query: {
            workid: row.pid,
            isWorkShow: false,
            isWorkShow2: true,
            isWorkShow3: false,
            activeClass: 1,
            isCenter: 2,
            sortnum: 1
          }
        });
      } else if (row.warnType == 11) {
        // 重大项目
        this.$router.push({
          path: "/threework",
          query: {
            workid: row.pid,
            isWorkShow: false,
            isWorkShow2: false,
            isWorkShow3: true,
            activeClass: 2,
            isCenter: 2,
            sortnum: 2
          }
        });
      }
    },
    // 审核点击标题进详情
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
    // 审核详情
    handleVerifyDetail(index, row) {
      if (row.transType == 4) {
        this.indexAreaVisible = true;
        this.sureShow = true;
        this.btnShow = false;
        this.zhihouShow = false;
        this.areaDatas = [];
        this.reportType = row.transType;
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
        this.sureShow = true;
        this.btnShow = false;
        this.preDatas = [];
        this.zhihouShow = false;
        this.reportType = row.transType;
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
        if (row.statsus == 1) {
          this.reasonShow = true;
        } else {
          this.reasonShow = false;
        }
        this.zhihouShow = false;
        this.sureShow = true;
        this.btnShow = false;
        this.examineFileArr = [];
        this.bigid = row.bigid;
        this.examineId = row.reportid;
        this.examineType = row.transType;
        let para = { type: row.transType, detailId: row.reportid };
        this.examineTitle = "进展汇报详情";
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
            this.itemShow = 1;
            showLasttimeState(
              { projectid: row.bigid, reportDept: row.reportdept },
              sdata => {
                this.laststate = sdata.data.obj;
              }
            );
            this.projectDetailFuc(this.bigid);
          } else if (row.transType == 2) {
            this.itemShow = 2;
            this.assignDetailFuc(this.bigid);
          } else if (row.transType == 3) {
            this.itemShow = 3;
            showLasttimeState3(
              { typemodel: 1, workid: row.bigid, reportDept: row.reportdept },
              sdata => {
                this.laststate = sdata.data.obj;
              }
            );
            var type = 1;
            this.threeDetailFuc(this.bigid, type);
          } else if (row.transType == 6) {
            this.itemShow = 4;
            showLasttimeState3(
              { typemodel: 2, workid: row.bigid, reportDept: row.reportdept },
              sdata => {
                this.laststate = sdata.data.obj;
              }
            );
          } else if (row.transType == 7) {
            // 向上
            this.itemShow = 5;
            this.threeUpdetailFuc(this.bigid);
          } else if (row.transType == 8) {
            // 我区
            this.itemShow = 6;
            this.threeAreadetailFuc(this.bigid);
          } else if (row.transType == 9) {
            // 重点工作
            this.itemShow = 7;
            this.keyWorkdetailFuc(this.bigid);
          } else if (row.transType == 10) {
            // 重要片区
            this.itemShow = 8;
            this.keyAreadetailFuc(this.bigid);
          } else if (row.transType == 11) {
            // 重大项目
            this.itemShow = 9;
            this.keyItemdetailFuc(this.bigid);
          } else {
            this.laststate = "";
          }
          this.examineVisible = true;
        });
      }
    },
    removeArr(arr, value) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === value) {
          return i;
        }
      }
      return false;
    },
    // 上传附件
    // 添加附件 移除
    handleRemove(file, fileList) {
      let name = file.name;
      this.fileArr.splice(this.removeArr(this.fileArr, name), 1);
    },
    // 添加附件 移除前提示
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 添加附件 上传成功
    handleSuccess(file, fileList) {
      let name = file.obj;
      this.fileArr.push(name);
    },

    // 项目重复报送提示
    repeatSubmit(repa) {
      repeatReport(repa, data => {
        if (data.data.obj == null) {
          // 是否有保存内容
          let repara = {
            userid: this.loginid,
            termid: this.checkid,
            modeltype: 1
          };
          reportTerm(repara, data => {
            var reobj = data.data.obj;
            if (reobj == null) {
              this.reportData = { userid: this.loginid };
              this.reportid = -1;
            } else {
              this.isExport.visible = false;
              this.reportid = reobj.id;
              this.reportData = {
                userid: this.loginid,
                question: reobj.question,
                measure: reobj.plan,
                wenti: reobj.problem,
                remark: reobj.remark
              };
              var str = reobj.filepath;
              var obj = {};
              if (str == null || str == "") {
                this.fileList = [];
                this.fileArr = [];
              } else {
                var reg = /,$/gi;
                var arr = [];
                str = str.replace(reg, "");
                arr = str.split(",");
                for (var i = 0; i < arr.length; i++) {
                  obj.name = arr[i];
                  obj.url = this.imgIp + arr[i];
                  this.fileList.push(obj);
                  this.fileArr.push(obj.name);
                }
              }
            }
            this.reportVisible.visible = true;
          });
        } else {
          this.isExport.visible = false;
          this.$confirm(
            "<span style='color:#f00;'>已重复报送</span>，确定继续报送吗？",
            "提示",
            {
              dangerouslyUseHTMLString: true,
              type: "warning",
              center: true,
              modal: false,
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          )
            .then(() => {
              this.reportVisible.visible = true;
              this.reportData.question = data.data.obj.question;
              this.reportData.measure = data.data.obj.measure;
              this.reportData.wenti = data.data.obj.wenti;
              this.reportData.remark = data.data.obj.remark;
              var str = data.data.obj.filepath;
              var obj = {};
              if (str == null || str == "") {
                this.fileList = [];
                this.fileArr = [];
              } else {
                var reg = /,$/gi;
                var arr = [];
                str = str.replace(reg, "");
                arr = str.split(",");
                for (var i = 0; i < arr.length; i++) {
                  obj.name = arr[i];
                  obj.url = this.imgIp + arr[i];
                  this.fileList.push(obj);
                  this.fileArr.push(obj.name);
                }
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消报送"
              });
            });
        }
      });
    },
    // 批交办事项-重复报送
    repeatSubmit3(repa) {
      this.fileList = [];
      this.fileArr = [];
      repeatAssignReport(repa, data => {
        if (data.data.obj == null) {
          // 是否有保存内容
          let repara = {
            userid: this.loginid,
            termid: this.checkid,
            modeltype: 2
          };
          reportTerm(repara, data => {
            var reobj = data.data.obj;
            if (reobj == null) {
              this.reportData = { userid: this.loginid };
              this.reportid = -1;
            } else {
              this.isExport.visible = false;
              this.reportid = reobj.id;
              this.reportData = {
                userid: this.loginid,
                question: reobj.question,
                measure: reobj.plan,
                wenti: reobj.problem,
                remark: reobj.remark
              };
              var str = reobj.filepath;
              var obj = {};
              if (str == null || str == "") {
                this.fileList = [];
                this.fileArr = [];
              } else {
                var reg = /,$/gi;
                var arr = [];
                str = str.replace(reg, "");
                arr = str.split(",");
                for (var i = 0; i < arr.length; i++) {
                  obj.name = arr[i];
                  obj.url = this.imgIp + arr[i];
                  this.fileList.push(obj);
                  this.fileArr.push(obj.name);
                }
              }
            }
            this.reportVisible.visible = true;
          });
        } else {
          this.isExport.visible = false;
          this.$confirm(
            "<span style='color:#f00;'>已重复报送</span>，确定继续报送吗？",
            "提示",
            {
              dangerouslyUseHTMLString: true,
              type: "warning",
              center: true,
              modal: false,
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          )
            .then(() => {
              this.reportVisible.visible = true;
              this.reportData.question = data.data.obj.question;
              this.reportData.measure = data.data.obj.measure;
              this.reportData.wenti = data.data.obj.wenti;
              this.reportData.remark = data.data.obj.remark;
              var str = data.data.obj.filepath;
              var obj = {};
              if (str == null || str == "") {
                this.fileList = [];
                this.fileArr = [];
              } else {
                var reg = /,$/gi;
                var arr = [];
                str = str.replace(reg, "");
                arr = str.split(",");
                for (var i = 0; i < arr.length; i++) {
                  obj.name = arr[i];
                  obj.url = this.imgIp + arr[i];
                  this.fileList.push(obj);
                  this.fileArr.push(obj.name);
                }
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消报送"
              });
            });
        }
      });
    },
    // 三年行动计划/现场领导指示重复报送提示
    repeatSubmit2(repa) {
      this.fileList = [];
      this.fileArr = [];
      repeatThreeReport(repa, data => {
        if (data.data.obj == null) {
          this.reportVisible.visible = true;
          // 是否有保存内容
          let repara = {
            userid: this.loginid,
            termid: this.checkid,
            modeltype: repa.type
          };
          reportTerm(repara, data => {
            var reobj = data.data.obj;
            if (reobj == null) {
              this.reportData = { userid: this.loginid };
              this.reportid = -1;
            } else {
              this.isExport.visible = false;
              this.reportid = reobj.id;
              this.reportData = {
                userid: this.loginid,
                question: reobj.question,
                measure: reobj.plan,
                wenti: reobj.problem,
                remark: reobj.remark
              };
              var str = reobj.filepath;
              var obj = {};
              if (str == null || str == "") {
                this.fileList = [];
                this.fileArr = [];
              } else {
                var reg = /,$/gi;
                var arr = [];
                str = str.replace(reg, "");
                arr = str.split(",");
                for (var i = 0; i < arr.length; i++) {
                  obj.name = arr[i];
                  obj.url = this.imgIp + arr[i];
                  this.fileList.push(obj);
                  this.fileArr.push(obj.name);
                }
              }
            }
          });
        } else {
          this.isExport.visible = false;
          this.$confirm(
            "<span style='color:#f00;'>已重复报送</span>，确定继续报送吗？",
            "提示",
            {
              dangerouslyUseHTMLString: true,
              type: "warning",
              center: true,
              modal: false,
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          )
            .then(() => {
              this.reportVisible.visible = true;
              this.reportData.userid = this.loginid;
              this.reportData.question = data.data.obj.question;
              this.reportData.measure = data.data.obj.measure;
              this.reportData.wenti = data.data.obj.wenti;
              this.reportData.remark = data.data.obj.remark;
              this.reportData.agentname = data.data.obj.agentname;
              this.reportData.agentphone = data.data.obj.agentphone;
              var str = data.data.obj.filepath;
              var obj = {};
              if (str == null || str == "") {
                this.fileList = [];
                this.fileArr = [];
              } else {
                var reg = /,$/gi;
                var arr = [];
                str = str.replace(reg, "");
                arr = str.split(",");
                for (var i = 0; i < arr.length; i++) {
                  obj.name = arr[i];
                  obj.url = this.imgIp + arr[i];
                  this.fileList.push(obj);
                  this.fileArr.push(obj.name);
                }
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消报送"
              });
              this.reportVisible = false;
            });
        }
      });
    },
    // 重点工作新增 重复报送
    importworkRepeatSubmit(repa) {
      this.fileList = [];
      this.fileArr = [];
      // 判断是否重复报送
      repeatReportImportwork(repa, data => {
        if (data.data.obj == null) {
          this.isExport.visible = true;
          this.reportVisible.visible = true;
          // 是否有保存内容
          let repara = {
            userid: this.loginid,
            termid: repa.pointid,
            modeltype: 12
          };
          reportTerm(repara, data => {
            var reobj = data.data.obj;
            if (reobj == null) {
              this.reportData = { userid: this.loginid };
              this.reportid = -1;
            } else {
              this.isExport.visible = false;
              this.reportid = reobj.id;
              this.reportData = {
                userid: this.loginid,
                question: reobj.question,
                measure: reobj.plan,
                wenti: reobj.problem,
                remark: reobj.remark
              };
              var str = reobj.filepath;
              var obj = {};
              if (str == null || str == "") {
                this.fileList = [];
                this.fileArr = [];
              } else {
                var reg = /,$/gi;
                var arr = [];
                str = str.replace(reg, "");
                arr = str.split(",");
                for (var i = 0; i < arr.length; i++) {
                  obj.name = arr[i];
                  obj.url = this.imgIp + arr[i];
                  this.fileList.push(obj);
                  this.fileArr.push(obj.name);
                }
              }
            }
          });
        } else {
          this.$confirm(
            "<span style='color:#f00;'>已重复报送</span>，确定继续报送吗？",
            "提示",
            {
              dangerouslyUseHTMLString: true,
              type: "warning",
              center: true,
              modal: false,
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          )
            .then(() => {
              this.isExport.visible = false;
              this.reportVisible.visible = true;
              this.reportData.userid = this.loginid;
              this.reportData.question = data.data.obj.question;
              this.reportData.measure = data.data.obj.measure;
              this.reportData.wenti = data.data.obj.wenti;
              this.reportData.remark = data.data.obj.remark;
              var str = data.data.obj.filepath;
              var obj = {};
              if (str == null || str == "") {
                this.fileList = [];
                this.fileArr = [];
              } else {
                var reg = /,$/gi;
                var arr = [];
                str = str.replace(reg, "");
                arr = str.split(",");
                for (var i = 0; i < arr.length; i++) {
                  obj.name = arr[i];
                  obj.url = this.imgIp + arr[i];
                  this.fileList.push(obj);
                  this.fileArr.push(obj.name);
                }
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消报送"
              });
              this.reportVisible = false;
            });
        }
      });
    },
    repeatDatas() {
      this.filepath = [];
      this.fileList = [];
      this.fileArr = [];
      this.reportData = {};
      this.reportBasic = {};
      this.laststate = "";
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
    // 报送
    handleSubmit(index, row) {
      this.repeatDatas();
      this.checkid = row.pid;
      this.reportType = row.warnType;
      if (this.reportType == 1) {
        this.itemShow = 1;
        // 获取上一次进展情况
        addShowLasttime(
          { userid: this.loginid, projectid: this.checkid },
          data => {
            this.laststate = data.data.obj.question;
          }
        );
        // 项目基本信息
        this.projectDetailFuc(this.checkid);
        // 重复报送验证
        let repa = {};
        repa.projectid = this.checkid;
        repa.userid = this.loginid;
        this.repeatSubmit(repa);
      } else if (this.reportType == 2) {
        this.itemShow = 2;
        // 批交办事项
        showAssignLasttime(
          { userid: this.loginid, checkid: this.checkid },
          data => {
            this.laststate = data.data.obj.question;
          }
        );
        // 基本信息
        this.assignDetailFuc(this.checkid);
        // 重复报送验证
        let repa = {};
        repa.checkid = this.checkid;
        repa.userid = this.loginid;
        this.repeatSubmit3(repa);
      } else if (this.reportType == 3) {
        this.itemShow = 3;
        // 三年行动计划
        showThreeplanLasttime(
          { userid: this.loginid, workid: this.checkid, typemodel: 1 },
          data => {
            this.laststate = data.data.obj.question;
          }
        );
        var type = 1;
        // 基本信息
        this.threeDetailFuc(this.checkid, type);
        let repa = {};
        repa.workid = this.checkid;
        repa.userid = this.loginid;
        repa.typemodel = 1;
        repa.type = 3;
        this.repeatSubmit2(repa);
      } else if (this.reportType == 4) {
        this.itemShow = 4;
        // 获取上一次进展情况
        showThreeplanLasttime(
          { userid: this.loginid, workid: this.checkid, typemodel: 2 },
          data => {
            this.laststate = data.data.obj.question;
          }
        );
        var type = 2;
        // 基本信息
        this.threeDetailFuc(this.checkid, type);
        let repa = {};
        repa.workid = this.checkid;
        repa.userid = this.loginid;
        repa.typemodel = 2;
        repa.type = 4;
        this.repeatSubmit2(repa);
      }else if (this.reportType == 7) {
        // 重点工作
        this.itemShow = 7;
        lasttimeKeyworkProgress({ workid: this.checkid }, data => {
          if (data.data.obj == null) {
            this.laststate = "";
          } else {
            this.laststate = data.data.obj.question;
          }
        });
        this.keyWorkdetailFuc(this.checkid);
        let repa = {};
        repa.workid = this.checkid;
        repa.userid = this.loginid;
        this.repeatKeywork(repa);
      } else if (this.reportType == 8) {
        // 重要片区
        this.itemShow = 8;
        lasttimeKeyareaProgress({ workid: this.checkid }, data => {
          if (data.data.obj == null) {
            this.laststate = "";
          } else {
            this.laststate = data.data.obj.question;
          }
        });
        this.keyAreadetailFuc(this.checkid);
        let repa = {};
        repa.workid = this.checkid;
        repa.userid = this.loginid;
        this.repeatKeyarea(repa);
      } else if (this.reportType == 11) {
        // 重大项目
        this.itemShow = 9;
        lastKeyitemProgress({ sid: this.checkid, userid: this.loginid }, data => {
          this.laststate = data.data.obj.question;
        });
        this.keyItemdetailFuc(this.checkid);
        let repa = {};
        repa.situationid = this.checkid;
        repa.userid = this.loginid;
        this.repeatKeyitem(repa);
      } else if (this.reportType == 12) {
        this.itemShow = 10;
        // 获取上一次进展情况
        showImportworkLasttime(
          { userid: this.loginid, pointid: this.checkid },
          data => {
            this.laststate = data.data.obj.question;
          }
        );
        // 基本信息
        this.importworkDetailFuc(this.checkid);
        let repa = {};
        repa.pointid = this.checkid;
        repa.userid = this.loginid;
        this.importworkRepeatSubmit(repa);
      }
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
    // 重点工作重复报送
    repeatKeywork(repa) {
      this.fileList = [];
      this.fileArr = [];
      repeatReportKeywork(repa, data => {
        this.isExport.visible = true;
        if (data.data.obj == true) {
          this.$confirm(
            "<span style='color:#f00;'>已重复报送</span>，确定继续报送吗？",
            "提示",
            {
              dangerouslyUseHTMLString: true,
              type: "warning",
              center: true,
              modal: false,
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          )
            .then(() => {
              this.reportVisible.visible = true;
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消报送"
              });
              this.reportVisible.visible = false;
            });
        } else {
          // 是否有保存内容
          let repara = {
            userid: this.loginid,
            termid: this.workid,
            modeltype: 7
          };
          reportTerm(repara, data => {
            var reobj = data.data.obj;
            if (reobj == null) {
              this.reportData = { userid: this.loginid };
              this.reportid = -1;
            } else {
              this.isExport.visible = false;
              this.reportid = reobj.id;
              this.reportData = {
                userid: this.loginid,
                question: reobj.question,
                measure: reobj.plan,
                wenti: reobj.problem,
                remark: reobj.remark
              };
              var str = reobj.filepath;
              var obj = {};
              if (str == null || str == "") {
                this.fileList = [];
                this.fileArr = [];
              } else {
                var reg = /,$/gi;
                var arr = [];
                str = str.replace(reg, "");
                arr = str.split(",");
                for (var i = 0; i < arr.length; i++) {
                  obj.name = arr[i];
                  obj.url = this.imgIp + arr[i];
                  this.fileList.push(obj);
                  this.fileArr.push(obj.name);
                }
              }
            }
            this.reportVisible.visible = true;
          });
        }
      });
    },
    // 重要片区重复报送
    repeatKeyarea(repa) {
      this.fileList = [];
      this.fileArr = [];
      repeatReportKeyarea(repa, data => {
        if (data.data.obj == true) {
          this.$confirm(
            "<span style='color:#f00;'>已重复报送</span>，确定继续报送吗？",
            "提示",
            {
              dangerouslyUseHTMLString: true,
              type: "warning",
              center: true,
              modal: false,
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          )
            .then(() => {
              this.reportVisible.visible = true;
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消报送"
              });
              this.reportVisible.visible = false;
            });
        } else {
          // 是否有保存内容
          let repara = {
            userid: this.loginid,
            termid: this.workid,
            modeltype: 8
          };
          reportTerm(repara, data => {
            var reobj = data.data.obj;
            this.isExport.visible = true;
            if (reobj == null) {
              this.reportData = { userid: this.loginid };
              this.reportid = -1;
            } else {
              this.isExport.visible = false;
              this.workid = false;
              this.reportid = reobj.id;
              this.reportData = {
                userid: this.loginid,
                question: reobj.question,
                measure: reobj.plan,
                wenti: reobj.problem,
                remark: reobj.remark
              };
              var str = reobj.filepath;
              var obj = {};
              if (str == null || str == "") {
                this.fileList = [];
                this.fileArr = [];
              } else {
                var reg = /,$/gi;
                var arr = [];
                str = str.replace(reg, "");
                arr = str.split(",");
                for (var i = 0; i < arr.length; i++) {
                  obj.name = arr[i];
                  obj.url = this.imgIp + arr[i];
                  this.fileList.push(obj);
                  this.fileArr.push(obj.name);
                }
              }
            }
            this.reportVisible.visible = true;
          });
        }
      });
    },
    // 重大项目重复报送
    repeatKeyitem(repa) {
      this.fileList = [];
      this.fileArr = [];
      repeatItemReport(repa, data => {
        if (data.data.obj == null || data.data.obj == false) {
          this.reportVisible.visible = true;
          // 是否有保存内容
          let repara = {
            userid: this.loginid,
            termid: this.workid,
            modeltype: 9
          };
          reportTerm(repara, data => {
            var reobj = data.data.obj;
            if (reobj == null) {
              this.reportData = { userid: this.loginid };
              this.reportid = -1;
            } else {
              this.isExport.visible = false;
              this.reportid = reobj.id;
              this.reportData = {
                userid: this.loginid,
                question: reobj.question,
                measure: reobj.plan,
                wenti: reobj.problem,
                remark: reobj.remark
              };
              var str = reobj.filepath;
              var obj = {};
              if (str == null || str == "") {
                this.fileList = [];
                this.fileArr = [];
              } else {
                var reg = /,$/gi;
                var arr = [];
                str = str.replace(reg, "");
                arr = str.split(",");
                for (var i = 0; i < arr.length; i++) {
                  obj.name = arr[i];
                  obj.url = this.imgIp + arr[i];
                  this.fileList.push(obj);
                  this.fileArr.push(obj.name);
                }
              }
            }
          });
        } else {
          this.$confirm(
            "<span style='color:#f00;'>已重复报送</span>，确定继续报送吗？",
            "提示",
            {
              dangerouslyUseHTMLString: true,
              type: "warning",
              center: true,
              modal: false,
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          )
            .then(() => {
              this.reportVisible.visible = true;
              this.reportData.userid = this.loginid;
              this.reportData.question = data.data.obj.question;
              this.reportData.measure = data.data.obj.measure;
              this.reportData.wenti = data.data.obj.wenti;
              this.reportData.remark = data.data.obj.remark;
              var str = data.data.obj.filepath;
              var obj = {};
              if (str == null || str == "") {
                this.fileList = [];
                this.fileArr = [];
              } else {
                var reg = /,$/gi;
                var arr = [];
                str = str.replace(reg, "");
                arr = str.split(",");
                for (var i = 0; i < arr.length; i++) {
                  obj.name = arr[i];
                  obj.url = this.imgIp + arr[i];
                  this.fileList.push(obj);
                  this.fileArr.push(obj.name);
                }
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消报送"
              });
              this.reportVisible.visible = false;
            });
        }
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
    // 保存报送
    saveReport() {
      let files = "";
      if (this.fileArr.length == 0) {
        files = "";
      } else {
        let len = this.fileArr.length;
        if (len == 1) {
          files += this.fileArr[0] + ",";
        } else {
          files = this.fileArr.join(",");
        }
      }
      let para = this.reportData;
      para.problem = this.reportData.wenti;
      para.plan = this.reportData.measure;
      if (this.reportid == -1) {
      } else {
        para.id = this.reportid;
      }
      para.modeltype = this.itemShow;
      para.filepath = "";
      para.termid = this.checkid;
      savereportInfo(para, data => {
        this.$message({
          type: "success",
          message: "保存成功"
        });
        this.isExport.visible = false;
        // this.reportVisible = false;
      });
    },
    // 进展汇报提交
    submitReport() {
      if (this.reportType == 1) {
        // 项目
        this.submitProjectReport();
      } else if (this.reportType == 2) {
        //皮交办事项
        this.receiptSubmit();
      } else if (this.reportType == 3) {
        //三年行动计划
        this.submitEvolveForm();
      } else {
        // 现场领导指示分工
        this.submitEvolveForm2();
      }
    },
    // 项目进展提交
    submitProjectReport() {
      var child = this.$refs.reportChild;
      child.$refs.reportData.validate(valid => {
        if (valid) {
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
          var para = this.reportData;
          para.userid = this.loginid;
          para.projectid = this.checkid;
          para.validate = 0;
          addProgress(para, data => {
            this.reportVisible = false;
            this.$alert(
              "<span style='color:#f00;'>报送成功</span>，请等待上级部门审核通过",
              "提示",
              {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "我知道了",
                type: "success",
                center: true,
                modal: false
              }
            );
            this.getAllList();
          });
        } else {
          return false;
        }
      });
    },
    // 批交办报送-提交
    receiptSubmit() {
      var child = this.$refs.reportChild;
      child.$refs.reportData.validate(valid => {
        if (valid) {
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
          var para = this.reportData;
          para.userid = this.loginid;
          para.checkid = this.checkid;
          para.validate = 0;
          addReceipt(para, data => {
            this.reportVisible = false;
            this.$alert(
              "<span style='color:#f00;'>报送成功</span>，请等待上级部门审核通过",
              "提示",
              {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "我知道了",
                type: "success",
                center: true,
                modal: false
              }
            );
            this.getAllList();
          });
        } else {
          return false;
        }
      });
    },
    // 三年行动计划报送提交
    submitEvolveForm: function() {
      var child = this.$refs.reportChild;
      child.$refs.reportData.validate(valid => {
        if (valid) {
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
          var para = this.reportData;
          para.userid = this.loginid;
          para.workid = this.checkid;
          para.validate = 0;
          para.typemodel = 1;
          addPlanReport(para, data => {
            this.reportVisible = false;
            this.$alert(
              "<span style='color:#f00;'>报送成功</span>，请等待上级部门审核通过",
              "提示",
              {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "我知道了",
                type: "success",
                center: true,
                modal: false
              }
            );
            this.getAllList();
          });
        } else {
          return;
        }
      });
    },
    // 现场办公报送提交
    submitEvolveForm2: function() {
      var child = this.$refs.reportChild;
      child.$refs.reportData.validate(valid => {
        if (valid) {
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
          var para = this.reportData;
          para.userid = this.loginid;
          para.workid = this.checkid;
          para.typemodel = 2;
          para.validate = 0;
          addPlanReport(para, data => {
            this.reportVisible = false;
            this.$alert(
              "<span style='color:#f00;'>报送成功</span>，请等待上级部门审核通过",
              "提示",
              {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "我知道了",
                type: "success",
                center: true,
                modal: false
              }
            );
            this.getAllList();
          });
        } else {
          return;
        }
      });
    },
    selectChange() {
      this.$forceUpdate();
    },
    // 不通过提交
    areaNopass() {
      this.$confirm("确定不通过吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let para = {
            audit: 2,
            addnum: this.addnum
          };
          if (this.reportType == 5) {
            para.reportType = "区级指标管理";
          } else {
            para.reportType = "承办单位指标管理";
          }
          para.reason = this.areaNopassReason;
          para.economicId = this.eid;
          para.isZhiHou = this.zhihouForm.orZhiHou;
          updateTargetStatus(para, data => {
            this.$message({
              message: "通过审核",
              type: "success"
            });
            this.innerAreaVisible = false;
            this.indexVisible = false;
            this.indexAreaVisible = false;
            this.getAllList();
            this.reportType = "";
            this.addnum = "";
            this.zhihouForm = {};
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作"
          });
        });
    },
    nopassClick() {
      this.$refs.zhihouForm.validate(valid => {
        if (valid) {
          this.innerAreaVisible = true;
        } else {
          return false;
        }
      });
    },
    // 通过提交
    areaGopass() {
      this.$refs.zhihouForm.validate(valid => {
        if (valid) {
          this.$confirm("此操作将通过审核, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let para = {
                audit: 1,
                addnum: this.addnum
              };
              if (this.reportType == 5) {
                para.reportType = "区级指标管理";
              } else if (this.reportType == 4) {
                para.reportType = "承办单位指标管理";
              }
              para.economicId = this.eid;
              para.isZhiHou = this.zhihouForm.orZhiHou;
              updateTargetStatus(para, data => {
                this.$message({
                  message: "通过审核",
                  type: "success"
                });
                this.innerAreaVisible = false;
                this.indexVisible = false;
                this.indexAreaVisible = false;
                this.getAllList();
                this.reportType = "";
                this.addnum = "";
                this.eid = "";
                this.zhihouForm = {};
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消操作"
              });
            });
        } else {
          return false;
        }
      });
    },
    // 审核弹窗
    handleVerifySubmit(index, row) {
      if (row.transType == 4) {
        //各街道填报
        this.indexAreaVisible = true;
        this.sureShow = false;
        this.zhihouShow = true;
        this.btnShow = true;
        this.areaDatas = [];
        this.reportType = row.transType;
        this.addnum = row.reportid;
        this.choosename = row.transName;
        this.eid = row.bigid;
        let para = { economicid: row.bigid, addnum: row.reportid };
        this.zhihouForm = { orZhiHou: 0 };
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
        this.sureShow = false;
        this.zhihouShow = true;
        this.btnShow = true;
        this.preDatas = [];
        this.reportType = row.transType;
        this.addnum = row.reportid;
        this.viewTitle = row.transName;
        this.eid = row.bigid;
        this.zhihouForm = { orZhiHou: 0 };
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
        this.examineData = { isZhiHou: 0 };
        this.zhihouShow = true;
        this.sureShow = false;
        this.btnShow = true;
        this.reasonShow = false;
        this.examineFileArr = [];
        this.bigid = row.bigid;
        this.examineId = row.reportid;
        this.examineType = row.transType;
        let para = { type: row.transType, detailId: row.reportid };
        this.examineTitle = "审核进展汇报";
        this.examineVisible = true;
        getCheckDetail(para, data => {
          if (data.data.obj == "") {
            this.examineData = { isZhiHou: 0 };
            this.examineFileArr = [];
          } else {
            this.examineData = data.data.obj;
            this.examineData.isZhiHou = 0;
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
            this.itemShow = 1;
            //项目
            showLasttimeState(
              { projectid: row.bigid, reportDept: row.reportdept },
              sdata => {
                this.laststate = sdata.data.obj;
              }
            );
            this.projectDetailFuc(this.bigid);
          } else if (row.transType == 2) {
            // 批交办
            this.itemShow = 2;
            showAssignLasttime(
              { userid: this.loginid, checkid: row.bigid },
              data => {
                this.laststate = data.data.obj.question;
              }
            );
            this.assignDetailFuc(this.bigid);
          } else if (row.transType == 3) {
            //三年行动计划
            this.itemShow = 3;
            showLasttimeState3(
              { typemodel: 1, workid: row.bigid, reportDept: row.reportdept },
              sdata => {
                this.laststate = sdata.data.obj;
              }
            );
            var type = 1;
            this.threeDetailFuc(this.bigid, type);
          } else if (row.transType == 6) {
            //领导指示分工
            this.itemShow = 4;
            showLasttimeState3(
              { typemodel: 2, workid: row.bigid, reportDept: row.reportdept },
              sdata => {
                this.laststate = sdata.data.obj;
              }
            );
            var ltype = 2;
            this.threeDetailFuc(this.bigid, ltype);
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
              { sid: this.bigid, userid: this.bigid },
              data => {
                this.laststate = data.data.obj.question;
              }
            );
            this.keyItemdetailFuc(this.bigid);
          } else if (row.transType == 12) {
            //新加的重点工作模块
            this.itemShow = 10;
            showImportworkLasttime(
              {
                pointid: row.bigid,
                reportDept: row.reportdept,
                userid: this.loginid
              },
              sdata => {
                this.laststate = sdata.data.obj.question;
              }
            );
            this.importworkDetailFuc(this.bigid);
          }
        });
      }
    },
    // 通过审核提交
    gopass() {
      var child = this.$refs.examineChild;
      child.$refs.examineData.validate(valid => {
        if (valid) {
          this.$confirm("此操作将通过审核, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let para = {
                type: this.examineType,
                detailId: this.examineId,
                status: 2,
                bigid: this.bigid,
                isZhiHou: this.examineData.isZhiHou
              };
              passChange(para, data => {
                this.$message({
                  message: "通过审核",
                  type: "success"
                });
                this.examineVisible = false;
                this.examineData = {};
                this.getAllList();
                if (this.examineType == 1) {
                  projectPassStatus({ pid: this.bigid }, data => {});
                } else if (this.examineType == 2) {
                  assignPassStatus({ cid: this.bigid }, data => {});
                } else if (this.examineType == 3) {
                  synchFormstate(
                    { workid: this.workid, typemodel: 1 },
                    data => {}
                  );
                } else if (this.examineType == 6) {
                  synchFormstate(
                    { workid: this.workid, typemodel: 2 },
                    data => {}
                  );
                } else if (this.examineType == 7) {
                } else if (this.examineType == 8) {
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消操作"
              });
              this.examineData = {};
            });
        } else {
          return false;
        }
      });
    },
    // 不通过-填写不通过原因弹窗
    nopass() {
      var child = this.$refs.examineChild;
      child.$refs.examineData.validate(valid => {
        if (valid) {
          this.innerVisible = true;
        } else {
          return false;
        }
      });
    },
    // 确定不通过提交
    reasonBtns() {
      this.$confirm("确定不通过审核吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.innerVisible = false;
          let para = {
            type: this.examineType,
            detailId: this.examineId,
            status: 1,
            bigid: this.bigid,
            reason: this.nopassReason,
            isZhiHou: this.examineData.isZhiHou
          };
          passChange(para, data => {
            this.$message({
              message: "审核成功",
              type: "success"
            });
            this.examineVisible = false;
            this.getAllList();
            this.examineData = {};
            this.nopassReason = "";
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作"
          });
          this.examineData = {};
          this.nopassReason = "";
        });
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
    isfinishFormat(scope, value) {
      switch (value) {
        case 0:
          return "是";
          break;
        case 1:
          return "否";
          break;
      }
    },
    fscheduleFormat(scope, value) {
      if (value < 0) {
        return "<span style='color:#f00;'>" + value + "</span>";
      } else {
        return "<span>" + value + "</span>";
      }
    },
    amountFormat(scope, value) {
      if (value < 0) {
        return "<span style='color:#f00;'>" + value + "</span>";
      } else {
        return "<span>" + value + "</span>";
      }
    },
    overtargetFormat(scope, value) {
      if (value == null) {
        return "<span>/</span>";
      } else {
        if (value < 0) {
          return "<span style='color:#f00;'>" + value + "</span>";
        } else {
          return "<span>" + value + "</span>";
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
    },
    // 指标填报审核
    targetVerifySubmit(index, row) {
      this.reportType = row.reportType;
      // if(this.reportType=="承办单位填报"){
      //   this.reportType = "承办单位指标管理"
      // }else{
      //   this.reportType = "区级指标管理"
      // }
      this.addnum = row.addnum;
      if (row.reportType == "区级指标管理") {
        this.viewTitle = row.economicName;
        let para = { economicid: row.economicId, addnum: row.addnum };
        areaViewReport(para, data => {
          this.preDatas = data.data.obj;
          this.indexVisible = true;
        });
      } else {
        this.choosename = row.economicName;
        let para = { economicid: row.economicId, addnum: row.addnum };
        otherViewReport(para, data => {
          this.indexAreaVisible = true;
          this.areaDatas = data.data.obj;
          this.merage();
        });
      }
    },
    // 通过
    gopass3() {
      this.$confirm("此操作将通过审核, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let para = {
            audit: 1,
            addnum: this.addnum
          };
          if (this.reportType == "区级指标管理") {
            para.reportType = "区级指标管理";
          } else {
            para.reportType = "承办单位指标管理";
          }
          updateTargetStatus(para, data => {
            this.$message({
              message: "通过审核",
              type: "success"
            });
            this.addnum = "";
            this.indexVisible = false;
            this.indexAreaVisible = false;
            this.getAllList();
            this.reportType = "";
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作"
          });
        });
    },
    // 不通过-不通过原因填写
    nopass3() {
      this.innerVisible3 = true;
    },
    // 不通过原因填写后提交
    reasonBtns3() {
      this.$confirm("确定不通过吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let para = {
            audit: 2,
            addnum: this.addnum
          };
          if (this.reportType == "区级指标管理") {
            para.reportType = "区级指标管理";
          } else {
            para.reportType = "承办单位指标管理";
          }
          updateTargetStatus(para, data => {
            this.$message({
              message: "通过审核",
              type: "success"
            });
            this.innerVisible3 = false;
            this.indexAreaVisible = false;
            this.addnum = "";
            this.indexVisible = false;
            this.getAllList();
            this.reportType = "";
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作"
          });
        });
    }
  }
};
</script>

<style lang="scss">
.managebox {
  .index-leader {
    margin-top: 20px;
    .addbtn {
      margin-bottom: 15px;
    }
    .boxcontent {
      padding: 20px;
    }
  }
  .addrow {
    display: flex;
    align-items: stretch;
    fieldset {
      height: 100%;
    }
  }
  .boxcontent {
    padding: 20px 0;
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

.mycenter-wrap {
  margin-top: 30px;
  .leftbox {
    width: 500px;
    float: left;
  }
  .rightbox {
    overflow: hidden;
    padding-left: 30px;
    padding-right: 8px;
  }
  .clear {
    clear: both;
  }
  .numbox {
    height: 400px;
    padding: 10px;
  }
}
.center {
  .el-table {
    .nopass {
      .nobtn {
        display: none;
      }
    }
    .el-table__column-filter-trigger i {
      color: #fff;
    }
    th > .cell.highlight {
      color: #fff;
    }
  }
  .el-card.is-always-shadow,
  .el-card.is-hover-shadow:focus,
  .el-card.is-hover-shadow:hover {
    -webkit-box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.2);
    box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.2);
  }
  .cbox {
    margin: 40px 0;
  }
  .box-card {
    margin-top: 20px;
    .el-card__header {
      padding: 10px 15px;
      background: #eee;
    }
    .card-title {
      color: #222;
      font-size: 16px;
      font-weight: bold;
    }
    .img {
      height: 320px;
      width: 100%;
    }
  }
  .box-card1 {
    .el-card__body {
      padding: 0;
    }
  }
  .upwrap {
    margin-top: -10px;
    fieldset {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      .upbox {
        padding: 20px;
        p {
          color: #1890ff;
        }
      }
    }
  }
  .flexbox {
    display: flex;
    align-items: stretch;
    fieldset {
      height: 100%;
    }
    .el-form-item.lastitem {
      margin-bottom: 0;
    }
  }
  .task-dialog {
    .item-select {
      display: block;
    }
    .upbox {
      padding: 0 36px;
      color: #1890ff;
      p {
        color: #333;
        font-size: 14px;
        font-weight: bold;
      }
      .t2 {
        font-weight: normal;
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
  }
  .report-dialog {
    .upbox {
      padding: 0 36px;
      color: #1890ff;
      p {
        color: #333;
        font-size: 14px;
        font-weight: bold;
      }
      .t2 {
        font-weight: normal;
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
  .shlist {
    display: flex;
    align-items: stretch;
    .el-card {
      height: 100%;
    }
  }
}

.disabled-radio {
  .el-radio__input.is-disabled .el-radio__inner,
  .el-radio__input.is-disabled .el-radio__inner {
    border-color: #999;
    cursor: pointer;
  }
  .el-radio__input.is-disabled + span.el-radio__label {
    color: #606266;
    cursor: pointer;
  }
  .el-radio__input.is-disabled.is-checked .el-radio__inner::after {
    cursor: pointer;
    background-color: #f5f7fa;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #409eff;
    background: #409eff;
  }
}
</style>
