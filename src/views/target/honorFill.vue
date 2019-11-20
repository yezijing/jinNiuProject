<template>
  <div class="content-wrap honor-fill">
    <p class="navtitle">
      <span>表彰奖牌情况填报表</span>
    </p>
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters" ref="filters" size="small">
          <el-form-item label="奖项名称：" prop="prizeName" class="ww2">
            <el-input v-model="filters.prizeName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="颁发时间：" prop="startTime" class="ybox">
            <el-date-picker
              v-model="filters.startTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="--" prop="endTime">
            <el-date-picker
              v-model="filters.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="牵头区领导" prop="headLeaderId" class="ww2">
            <el-select
              v-model="filters.headLeaderId"
              placeholder="全部"
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
          <div class="toolbtns">
            <div>
              <el-button type="primary" size="small" @click="handleAdd" v-if="isAddShow">新 增</el-button>
              <el-button type="primary" size="small" v-if="isDownShow">报表下载</el-button>
            </div>
            <el-form-item>
              <el-button size="small" @click="getDatas('filters')" type="primary">搜 索</el-button>
              <el-button size="small" @click="resetForm('filters')">重 置</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-row>
      <el-table
        class="tableinfo"
        border
        :max-height="tableHeight"
        :data="honorData"
        highlight-current-row
        style="width: 100%;overflow:auto"
      >
        <el-table-column label="序号" width="70" :formatter="formatter"></el-table-column>
        <el-table-column prop="awardname" label="奖项名称"></el-table-column>
        <el-table-column prop="awarddept" label="颁发单位"></el-table-column>
        <el-table-column prop="detail" label="评奖依据和方式"></el-table-column>
        <el-table-column label="目前总体完成情况">
          <el-table-column prop="workremark" label="进展情况"></el-table-column>
          <el-table-column prop="prizecountyNames" label="获奖区县">
            <template slot-scope="scope">
              <p v-for="(item, index) in scope.row.prizecountyNames" :key="index">{{item}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="我区未获奖原因及整改措施"></el-table-column>
        </el-table-column>
        <el-table-column prop="headleaderNames" label="牵头领导">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.headleaderNames" :key="index">{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="headdeptNames" label="牵头单位">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.headdeptNames" :key="index">{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="headduty" label="工作职责"></el-table-column>
        <el-table-column prop="assistleaderNames" label="配合领导">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.assistleaderNames" :key="index">{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="assistdeptNames" label="承办单位">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.assistdeptNames" :key="index">{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="assistduty" label="工作职责"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template scope="scope">
            <el-button class="btn" @click="handleEdit(scope.$index, scope.row)" v-if="isEditShow">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 40]"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next, sizes, jumper"
      :total="totals"
    ></el-pagination>

    <!-- 新增 -->
    <el-dialog class="fillbox" :title="formTitle" :visible.sync="addFormVisible" width="1100px">
      <el-form :model="addForm" label-width="100px" ref="addForm" size="small">
        <el-row :gutter="40">
          <el-col :span="14">
            <fieldset>
              <legend>基本信息</legend>
              <div class="boxwrap">
                <el-form-item
                  label="奖项名称："
                  prop="awardname"
                  :rules="[{ required: true, message: '奖项名称不能为空'}]"
                >
                  <el-input v-model="addForm.awardname" placeholder="请输入"></el-input>
                </el-form-item>
                <div class="blist">
                  <el-form-item label="奖项级别：" prop="prizerank" class="level">
                    <el-select v-model="addForm.prizerank" placeholder="请选择" @change="selectChange">
                      <el-option
                        v-for="item in levels"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="预计颁发时间：" prop="issuetime" class="date">
                    <el-date-picker
                      v-model="addForm.issuetime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="请选择"
                    ></el-date-picker>
                  </el-form-item>
                </div>
                <div class="blist">
                  <el-form-item label="颁发单位：" prop="awarddept">
                    <el-input v-model="addForm.awarddept" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item label="文件名：" prop="filename">
                    <el-input v-model="addForm.filename" placeholder="请输入"></el-input>
                  </el-form-item>
                </div>
                <el-form-item label="评奖依据和方式：" prop="detail" class="linefeed">
                  <el-input type="textarea" placeholder="请输入" :rows="4" v-model="addForm.detail"></el-input>
                </el-form-item>
              </div>
            </fieldset>
            <fieldset style="height:355px;">
              <legend>总体完成情况</legend>
              <div class="boxwrap">
                <el-form-item label="颁发情况：" prop="isaward" class="isno">
                  <el-radio v-model="addForm.isaward" @change="issueChange" label="2">未颁发</el-radio>
                  <el-radio v-model="addForm.isaward" @change="issueChange" label="1">已颁发</el-radio>
                </el-form-item>
                <div class="show-award" v-if="isIssue">
                  <el-form-item label="我区是否获奖：" prop="isprize" class="isno isno2">
                    <el-radio v-model="addForm.isprize" @change="prizeChange" label="2">否</el-radio>
                    <el-radio v-model="addForm.isprize" @change="prizeChange" label="1">是</el-radio>
                  </el-form-item>
                  <el-form-item label="获奖区县：" prop="prizecounty" class="areas">
                    <el-select
                      v-model="addForm.prizecounty"
                      placeholder="请选择"
                      multiple
                      @change="selectChange"
                    >
                      <el-option
                        v-for="item in countrylist"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="工作进展：" prop="workremark" class="remark">
                    <el-input
                      type="textarea"
                      placeholder="请输入"
                      :rows="3"
                      v-model="addForm.workremark"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="我区未获奖原因及整改措施："
                    prop="reason"
                    class="linefeed"
                    v-if="isReason"
                  >
                    <el-input type="textarea" placeholder="请输入" :rows="3" v-model="addForm.reason"></el-input>
                  </el-form-item>
                </div>
              </div>
            </fieldset>
          </el-col>
          <el-col :span="10" class="fright">
            <fieldset>
              <legend>牵头单位</legend>
              <div class="boxwrap">
                <el-form-item label="牵头领导：" prop="headleader">
                  <el-select
                    v-model="addForm.headleader"
                    multiple
                    placeholder="请选择"
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
                <el-form-item label="牵头单位：" prop="headdept">
                  <el-select
                    v-model="addForm.headdept"
                    placeholder="请选择"
                    @change="selectChange"
                    multiple
                  >
                    <el-option
                      v-for="item in deptlist"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="工作职责：" prop="headduty" class="remark">
                  <el-input type="textarea" placeholder="请输入" :rows="2" v-model="addForm.headduty"></el-input>
                </el-form-item>
              </div>
            </fieldset>
            <fieldset>
              <legend>承办单位</legend>
              <div class="boxwrap">
                <el-form-item label="配合领导：" prop="assistleader">
                  <el-select
                    v-model="addForm.assistleader"
                    placeholder="请选择"
                    multiple
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
                <el-form-item label="承办单位：" prop="assistdept">
                  <el-select
                    v-model="addForm.assistdept"
                    placeholder="请选择"
                    multiple
                    @change="selectChange"
                  >
                    <el-option
                      v-for="item in deptlist"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="工作职责：" prop="assistduty" class="remark">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    :rows="2"
                    v-model="addForm.assistduty"
                  ></el-input>
                </el-form-item>
              </div>
            </fieldset>
            <fieldset>
              <legend>上传附件</legend>
              <div class="boxwrap boxwrap0">
                <el-upload
                  class="upload-demo"
                  :action="upfile"
                  :file-list="fileList"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                >
                  <el-button size="small" type="primary">添加附件</el-button>
                </el-upload>
              </div>
              <!-- <a class='download' :href="downloadhttp" download  title="下载">下载</a> -->
            </fieldset>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitForm('addForm')">{{btnWord}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { upfile, imgIp } from "../../api/imgUrl";
import { leaderList, alldeptList } from "../../api/api";
import {
  getAllHonor,
  addFillHonor,
  allArealist,
  editFillHonor
} from "../../api/targetApi";
export default {
  name: "honorAll",
  components: {},
  data() {
    return {
      filters: {}, //搜索
      honorData: [], //列表数据
      targetCheckList: JSON.parse(this.$store.getters.userdata).targetCheckList, //页面按钮权限数据
      loginid: JSON.parse(this.$store.getters.userdata).id,
      isAddShow: false, //新增权限
      isEditShow: false, //编辑权限
      isDownShow: false,
      addFormVisible: false, //弹窗是否显示
      formTitle: "", //弹窗标题
      addForm: {}, //弹窗form
      btnWord: "", //弹窗按钮文字
      upfile: "", //文件上传地址
      imgIp: "",
      fileList: [], //文件列表
      deptlist: [], //部门列表
      leaderList: [], //领导列表
      currentStatus: "", //弹窗是编辑还是新增状态
      currentPage: 1, //当前页
      pageSize: 10, //一页显示多少条
      totals: 0, //总条数
      fileArr: [], //文件上传后名字数组
      countrylist: [], //区县列表
      dateall: "",
      tableHeight: "450px",
      isReason: true, //我区未获奖原因
      isIssue: false, //奖项是否颁发显示隐藏
      levels: [
        { value: 1, name: "市级" },
        { value: 2, name: "省级" },
        { value: 3, name: "国家级" }
      ] //奖项级别
    };
  },
  mounted() {},
  created() {
    this.upfile = upfile;
    this.imgIp = imgIp;
    this.browerHeight();
    this.editLimits();
    this.getDeptlist();
    this.getLeaderList();
    this.getAllHonor();
    this.countryList();
  },
  methods: {
    // 获取浏览器高度，计算table高度
    browerHeight() {
      var bheight = document.body.clientHeight;
      var hh = bheight - 380;
      this.tableHeight = hh + "px";
    },
    editLimits: function() {
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
            case "D-down":
              this.isDownShow = true;
              break;
          }
        }
      }
    },
    formatter(row, column, cellValue, index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize;
    },
    //   获取部门列表
    getDeptlist: function() {
      alldeptList("", data => {
        this.deptlist = data.data.obj;
      });
    },
    // 获取领导列表
    getLeaderList: function() {
      leaderList("", data => {
        this.leaderList = data.data.obj;
      });
    },
    // 获取区县列表
    countryList() {
      allArealist("", data => {
        this.countrylist = data.data.obj;
      });
    },
    selectChange() {
      this.$forceUpdate();
    },
    // 获取数据列表
    getAllHonor() {
      let para = { pageSize: this.pageSize, pageNum: this.currentPage,userid:this.loginid };
      getAllHonor(para, data => {
        this.totals = data.data.obj.total;
        this.honorData = data.data.obj.datas;
        if(this.honorData==null){
          this.honorData = []
        }
        for (var n = 0; n < this.honorData.length; n++) {
          var arr = this.honorData[n].files;
          if (arr == null) {
            arr = [];
          } else {
            arr = arr.split(",");
          }
          Array.prototype.removeEmpty = function() {
            for (var i = 0; i < this.length; i++) {
              if (this[i] == "" || typeof this[i] == "undefind") {
                this.splice(i, 1);
                i--;
              }
            }
            return this;
          };
          var arr2 = arr.removeEmpty();
          var arr3 = [];
          for (var j = 0; j < arr2.length; j++) {
            var obj = {};
            obj.url = this.imgIp + arr2[j];
            obj.name = arr2[j];
            arr3.push(obj);
          }
          this.honorData[n].flist = arr3;
        }
      });
    },
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getAllHonor();
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getAllHonor();
    },
    // 搜索
    getDatas: function() {
      let para = this.filters;
      para.pageSize = this.pageSize;
      para.pageNum = this.currentPage;
      getAllHonor(para, data => {
        this.totals = data.data.obj.total;
        this.honorData = data.data.obj.datas;
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getAllHonor();
    },
    // 编辑
    handleEdit: function(index, row) {
      this.fileList = row.flist;
      console.log(this.fileList);
      this.formTitle = "编辑表彰奖牌情况填报";
      this.btnWord = "保存";
      this.currentStatus = "edit";
      let datas = Object.assign({}, row);
      let {
        assistdept,
        assistleader,
        headdept,
        headleader,
        prizecounty,
        ...others
      } = datas;
      datas = others;
      this.addForm = datas;
      if (row.assistdeptIds == null) {
        row.assistdeptIds = [];
      }
      if (row.assistleaderIds == null) {
        row.assistleaderIds = [];
      }
      if (row.headdeptIds == null) {
        row.headdeptIds = [];
      }
      if (row.headleaderIds == null) {
        row.headleaderIds = [];
      }
      if (row.prizecountyIds == null) {
        row.prizecountyIds = [];
      }
      this.addForm.assistdept = row.assistdeptIds;
      this.addForm.assistleader = row.assistleaderIds;
      this.addForm.headdept = row.headdeptIds;
      this.addForm.headleader = row.headleaderIds;
      this.addForm.prizecounty = row.prizecountyIds;
      this.addForm.isaward = String(row.isaward);
      this.addForm.isprize = String(row.isprize);
      this.timestampToTime(row.issuetime);
      this.addForm.issuetime = this.dateall;
      this.addFormVisible = true;
      if (this.addForm.isaward == 1) {   //已颁发
        this.isIssue = true;
        if (this.addForm.isprize == 1) {  //我区已获奖
          this.isReason = false;
        } else {  //我区未获奖
          this.isReason = true;
        }
      } else {   //未颁发
        this.isIssue = false;
        this.isReason = true;
      }
    },
    timestampToTime(date) {
      var date = new Date(date); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate();
      this.dateall = Y + M + D;
      return this.dateall;
    },

    // 新增
    handleAdd() {
      this.formTitle = "新增表彰奖牌情况填报";
      this.btnWord = "新增";
      this.addFormVisible = true;
      this.currentStatus = "add";
      this.addForm = {
        isaward: "2",
        assistleader: [],
        assistdept: [],
        headleader: [],
        headdept: [],
        prizecounty: [],
        isprize: "2"
      };
      this.isIssue = false;
      this.isReason = true;
      this.fileList = [];
    },
    // 是否已颁发
    issueChange() {
      if (this.addForm.isaward == 1) { // 已颁发
        this.isIssue = true;
      } else { // 未颁发
        this.isIssue = false;
        this.addForm.isaward = "2";
        this.addForm.prizecounty = [];
        this.addForm.isprize = "";
        this.addForm.workremark = "";
      }
    },
    // 我区是否获奖
    prizeChange() {
      if (this.addForm.isprize == 1) {  //已获奖
        this.isReason = false;
      } else {  //未获奖
        this.isReason = true;
        this.addForm.reason = "";
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
    // 添加附件-移除
    handleRemove(file, fileList) {
      let name = file.response.obj;
      this.fileArr.splice(this.removeArr(this.fileArr, name), 1);
      console.log(this.fileArr);
    },
    // 添加附件-成功
    handleSuccess(res, file) {
      this.fileArr.push(res.obj);
      console.log(this.fileArr);
    },
    // 数组转字符串
    changeArrToString() {
      if (this.addForm.assistdept == [] || this.addForm.assistdept == null) {
        this.addForm.assistdept = "";
      } else {
        if (this.addForm.assistdept.length == 1) {
          this.addForm.assistdept = this.addForm.assistdept.join(",");
          this.addForm.assistdept = this.addForm.assistdept + ",";
        } else {
          this.addForm.assistdept = this.addForm.assistdept.join(",");
        }
      }

      if (
        this.addForm.assistleader == [] ||
        this.addForm.assistleader == null
      ) {
        this.addForm.assistleader = "";
      } else {
        if (this.addForm.assistleader.length == 1) {
          this.addForm.assistleader = this.addForm.assistleader.join(",");
          this.addForm.assistleader = this.addForm.assistleader + ",";
        } else {
          this.addForm.assistleader = this.addForm.assistleader.join(",");
        }
      }
      if (this.addForm.headdept == [] || this.addForm.headdept == null) {
        this.addForm.headdept = "";
      } else {
        if (this.addForm.headdept.length == 1) {
          this.addForm.headdept = this.addForm.headdept.join(",");
          this.addForm.headdept = this.addForm.headdept + ",";
        } else {
          this.addForm.headdept = this.addForm.headdept.join(",");
        }
      }
      if (this.addForm.headleader == [] || this.addForm.headleader == null) {
        this.addForm.headleader = "";
      } else {
        if (this.addForm.headleader.length == 1) {
          this.addForm.headleader = this.addForm.headleader.join(",");
          this.addForm.headleader = this.addForm.headleader + ",";
        } else {
          this.addForm.headleader = this.addForm.headleader.join(",");
        }
      }
      if (this.addForm.prizecounty == [] || this.addForm.prizecounty == null) {
        this.addForm.prizecounty = "";
      } else {
        if (this.addForm.prizecounty.length == 1) {
          this.addForm.prizecounty = this.addForm.prizecounty.join(",");
          this.addForm.prizecounty = this.addForm.prizecounty + ",";
        } else {
          this.addForm.prizecounty = this.addForm.prizecounty.join(",");
        }
      }
      console.log(this.addForm);
    },
    // 提交
    submitForm() {
      if (this.currentStatus == "add") {
        this.changeArrToString();
        this.addSubmit();
      } else {
        this.changeArrToString();
        this.editSubmit();
      }
    },
    // 新增提交
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let files = "";
          let para = Object.assign({}, this.addForm);
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
          para.files = files;
          console.log(para);
          addFillHonor(para, data => {
            this.fileArr = [];
            this.getAllHonor();
            this.$message({
              message: "新增成功",
              type: "success"
            });
            this.addFormVisible = false;
            this.currentStatus = "";
            this.$refs["addForm"].resetFields();
          });
        }
      });
    },
    // 编辑提交
    editSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let files = "";
          let para = Object.assign({}, this.addForm);
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
          para.files = files;
          let { createtime, ...others } = para;
          para = others;
          let { updatetime, ...others2 } = para;
          para = others2;
          console.log(para);
          editFillHonor(para, data => {
            this.fileArr = [];
            this.getAllHonor();
            this.$message({
              message: "新增成功",
              type: "success"
            });
            this.addFormVisible = false;
            this.currentStatus = "";
            this.$refs["addForm"].resetFields();
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.honor-fill {
  .toolbtns {
    max-width: 1200px;
  }
  .toolbar {
    .ww2 {
      .el-input {
        width: 136px;
      }
    }
    .el-form--inline .ybox {
      margin-right: 5px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 150px;
    }
  }
  .fillbox {
    .fright {
      .el-select {
        display: block;
      }
    }
    fieldset {
      border: 1px solid #ccc;
      margin-bottom: 20px;
      legend {
        color: #000;
        font-size: 16px;
        padding: 0 8px;
        margin-left: 30px;
        font-weight: bold;
        font-family: "微软雅黑";
      }
    }
    .lastlist {
      margin-bottom: 0;
    }
    .el-form-item.isno {
      margin-bottom: 0;
    }
    .el-form-item.isno2 {
      margin-bottom: 15px;
      .el-form-item__label {
        font-size: 12px;
      }
    }
    .el-form-item.areas {
      .el-select {
        display: block;
      }
    }
    .el-form-item.level {
      .el-select {
        width: 180px;
      }
    }
    .boxwrap {
      padding: 20px;
      .linefeed {
        .el-form-item__label {
          line-height: 1.7;
        }
      }
      .blist {
        display: flex;
        justify-content: space-between;
        .date {
          .el-date-editor.el-input,
          .el-date-editor.el-input__inner {
            width: 150px;
          }
          .el-form-item__label {
            font-size: 12px;
          }
        }
        .el-form-item.remark {
          width: 300px;
        }
      }
    }
    .boxwrap0 {
      height: 133px;
    }
  }
}
</style>
