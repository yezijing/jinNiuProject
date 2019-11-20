<template>
  <div class="content-wrap setting setting2">
    <p class="navtitle">
      <span>用户管理</span>
    </p>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters" ref="filters" size="small">
        <el-form-item label="登录名：" prop="logname" class="ld">
          <el-input v-model="filters.logname" placeholder="请输入" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name" class="ld">
          <el-input v-model="filters.name" placeholder="请输入" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门：" prop="deptid" class="ld">
          <el-select v-model="filters.deptid" filterable clearable placeholder="全部">
            <el-option
              v-for="item in departments"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-on:click="getDatas" type="primary">搜索</el-button>
          <el-button @click="resetForm('filters')">重置</el-button>
        </el-form-item>
        <div class="toolbtns">
          <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
          <el-button type="primary" size="small" @click="resetPassword()">批量初始化密码</el-button>
        </div>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      class="tableinfo"
      border
      :data="userLists"
      highlight-current-row
      :cell-class-name="stateClassName"
      :row-class-name="statusClassName"
      style="width: 100%;"
    >
      <el-table-column label="序号" :formatter="numberFormatter" width="100"></el-table-column>
      <el-table-column prop="logname" label="登录名"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="deptName" label="部门"></el-table-column>
      <el-table-column prop="job" label="职务"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <i class="fa yuan"></i>
          <span v-html="stateFormat(scope,scope.row.status)"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button
            class="edits"
            type="primary"
            size="small"
            @click="handleLook(scope.$index, scope.row)"
          >详情</el-button>
          <el-button
            class="edits"
            type="info"
            size="small"
            @click="handleEdit(scope.$index, scope.row, scope.row.deptid)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next, sizes, jumper"
      :total="totals"
    ></el-pagination>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑用户" :visible.sync="editFormVisible" width="700px">
      <el-form
        :inline="true"
        :model="editForm"
        ref="editForm"
        :rules="editFormRules"
        size="small"
        label-width="100px"
      >
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="editForm.name" @change="wordTopy2"></el-input>
        </el-form-item>
        <el-form-item label="登录名：" prop="logname">
          <el-input readonly v-model="editForm.logname"></el-input>
        </el-form-item>
        <el-form-item label="部门：" prop="deptid">
          <el-select v-model="editForm.deptid" filterable placeholder="请选择">
            <el-option
              v-for="item in departments"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务：" prop="job">
          <el-select
            v-model="editForm.job"
            placeholder="请选择"
            allow-create
            filterable
            default-first-option
            clearable
            @change="addPosi"
          >
            <el-option v-for="item in jobs" :key="item.name" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式：" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="初始密码：" prop="password">
          <el-input placeholder="请设置初始密码" type="password" readonly v-model="editForm.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="resetPsw">重置密码</el-button>
        <el-button size="small" type="primary" @click="editSubmit('editForm')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog title="详情" :visible.sync="lookFormVisible" width="700px">
      <el-form size="small" :inline="true" :model="lookForm" label-width="100px">
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="lookForm.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="登录名：" prop="logname">
          <el-input v-model="lookForm.logname" readonly></el-input>
        </el-form-item>
        <el-form-item label="部门：" prop="deptName">
          <el-input v-model="lookForm.deptName" readonly></el-input>
        </el-form-item>
        <el-form-item label="职务：" prop="job">
          <el-input v-model="lookForm.job" readonly></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="phone">
          <el-input v-model="lookForm.phone" readonly></el-input>
        </el-form-item>
        <el-form-item label="初始密码：" prop="password">
          <el-input v-model="lookForm.password" type="password" readonly></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="lookFormVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新增 -->
    <el-dialog title="新增用户" :visible.sync="addFormVisible" width="700px">
      <el-form
        :inline="true"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        ref="addForm"
        size="small"
      >
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="addForm.name" @change="wordTopy"></el-input>
        </el-form-item>
        <el-form-item label="登录名：" prop="logname">
          <el-input v-model="addForm.logname"></el-input>
        </el-form-item>
        <el-form-item label="部门：" prop="deptid">
          <el-select v-model="addForm.deptid" filterable placeholder="请选择">
            <el-option
              v-for="item in departments"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务：" prop="job">
          <el-select
            v-model="addForm.job"
            placeholder="请选择"
            allow-create
            filterable
            default-first-option
            clearable
            @change="addPosi"
          >
            <el-option v-for="item in jobs" :key="item.name" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式：" prop="phone">
          <el-input v-model.number="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="初始密码：" prop="password">
          <el-input placeholder="请设置初始密码" readonly v-model="addForm.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addSubmit('addForm')">新增</el-button>
      </div>
    </el-dialog>

    <!-- 重置密码 -->
    <el-dialog title="重置密码" :visible.sync="passworkVisible" width="700px">
      <div>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <div class="alluser">
          <el-checkbox-group v-model="checkedUsers" @change="handleCheckedUsersChange">
            <el-checkbox v-for="item in userdatas" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="passworkVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="resetSubmit()">重置密码</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import vPinyin from "../../assets/vue-py";
import md5 from "md5";
import {
  userList,
  jobList,
  addUser,
  addJob,
  validUser,
  editUser,
  updateUserStatus,
  alldeptList,
  changeUsername,
  resetPassword,
  getAllusers
} from "../../api/api";

export default {
  name: "userMenagement",
  components: {
    Treeselect
  },
  data() {
    return {
      checkAll: false,
      checkedUsers: [],
      userdatas: [],
      isIndeterminate: true,
      passworkVisible: false,
      // 部门
      departments: [],
      statusList: [{ value: 0, status: "正常" }, { value: 1, status: "停用" }], //状态管理
      jobs: [],
      // 角色管理
      roles: [
        { value: 1, role: "超级管理员" },
        { value: 2, role: "管理员" },
        { value: 3, role: "普通成员" }
      ],
      kkk: false,
      userLists: [], //用户列表
      currentPage: 1,
      pageSize: 10,
      totals: 0,
      // 搜索
      filters: {
        logname: "",
        name: "",
        deptid: "",
        status: ""
      },
      editFormVisible: false, //编辑弹窗是否显示
      addFormVisible: false, //新增弹窗是否显示
      lookFormVisible: false, //详情弹窗是否显示
      addFormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        logname: [
          { required: true, message: "登录名不能为空", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              if (value) {
                changeUsername({ logname: this.addForm.logname }, data => {
                  if (data.data.code == 0) {
                    callback();
                  } else {
                    callback(data.data.msg);
                  }
                });
              } else {
                callback("登录名不能为空");
              }
            }
          }
        ],
        deptid: [{ required: true, message: "请选择部门", trigger: "change" }],
        phone: [
          {
            required: false,
            trigger: "change",
            validator(rule, value, callback) {
              if (value != "") {
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                if (reg.test(value) == false) {
                  callback(new Error("请填写正确的手机号！"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }
        ]
      },
      editFormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        logname: [
          { required: true, message: "登录名不能为空", trigger: "change" }
        ],
        deptid: [{ required: true, message: "请选择部门", trigger: "change" }],
        phone: [
          {
            required: false,
            trigger: "change",
            validator(rule, value, callback) {
              if (value != "") {
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                if (reg.test(value) == false) {
                  callback(new Error("请填写正确的手机号！"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }
        ]
      },
      addForm: {},
      lookForm: {},
      editForm: {}
    };
  },
  mounted() {},
  created() {
    this.getUsers();
    this.getDeptlist();
  },
  methods: {
    // 批量重置密码
    resetPassword() {
      this.checkedUsers = [];
      this.passworkVisible = true;
      getAllusers("", data => {
        this.userdatas = data.data.obj;
      });
    },
    handleCheckAllChange(val) {
      let arr = [];
      for (var i = 0; i < this.userdatas.length; i++) {
        arr.push(this.userdatas[i].id);
      }
      this.checkedUsers = val ? arr : [];
      this.isIndeterminate = false;
    },
    handleCheckedUsersChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.userdatas.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.userdatas.length;
    },
    // 重置提交
    resetSubmit() {
      var arr = [];
      for(var i=0;i<this.checkedUsers.length;i++){
        var uid = this.checkedUsers[i]
        for(var j=0;j<this.userdatas.length;j++){
          if(uid == this.userdatas[j].id){
            var obj = {};
            obj.id = uid;
            obj.logname = this.userdatas[j].logname;
            arr.push(obj)
            break;
          }
        }
      }
      let para = arr;
      para = JSON.stringify(para);
      resetPassword(para, data => {
        this.passworkVisible = false;
      });
    },
    // 序号
    numberFormatter(row, column, cellValue, index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize;
    },
    // 获取用户列表
    getUsers: function() {
      let para = this.filters;
      para.pageSize = this.pageSize;
      para.pageNum = this.currentPage;
      userList(para, data => {
        this.userLists = data.data.obj.datas;
        this.totals = data.data.obj.total;
      });
    },
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getUsers();
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getUsers();
    },
    //   部门列表
    getDeptlist: function() {
      alldeptList("", data => {
        this.departments = data.data.obj;
      });
    },
    // 获取职务数据
    getJobs: function() {
      jobList("", data => {
        this.jobs = data.data.obj;
      });
    },

    // 状态
    stateFormat(scope, value) {
      switch (value) {
        case 0:
          return "正常";
          break;
        case 1:
          return "停用";
          break;
      }
    },
    // 停用、启用按钮
    btnFormat(scope, value) {
      switch (value) {
        case 0:
          return "停用";
          break;
        case 1:
          return "启用";
          break;
      }
    },
    // 不同状态的样式
    stateClassName({ row, column }) {
      let status = row.status;
      if (status == 1) {
        return "red";
      }
      return "";
    },
    statusClassName({ row, column }) {
      let status = row.status;
      if (status == 0) {
        return "stopUse";
      }
      return "";
    },
    //搜索
    getDatas() {
      let para = this.filters;
      userList(para, data => {
        this.userLists = data.data.obj.datas;
        this.totals = data.data.obj.total;
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getUsers();
    },
    changeMenu() {
      this.$refs.addForm.validateField("deptid");
    },
    changeMenu2() {
      this.$refs.editForm.validateField("deptid");
    },
    //新增弹窗
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        logname: "",
        name: "",
        deptid: null,
        job: "",
        role: "",
        phone: "",
        status: 0,
        password: "123456"
      };
      this.getJobs();
    },
    // 汉字转拼音
    wordTopy: function() {
      this.addForm.logname = vPinyin.chineseToPinYin(this.addForm.name);
      let para = { logname: this.addForm.logname };
      // 验证登录名是否存在
      validUser(
        para,
        data => {
          if (data.code == "-1") {
            this.kkk = true;
          } else {
            this.kkk = false;
          }
        },
        () => {}
      );
    },
    // 汉字转拼音 编辑
    wordTopy2: function() {
      this.editForm.logname = vPinyin.chineseToPinYin(this.editForm.name);
      let para = { logname: this.addForm.logname };
      // 验证登录名是否存在
      validUser(
        para,
        res => {
          if (res.code == "0") {
            this.kkk = true;
          } else {
            this.kkk = false;
          }
        },
        () => {}
      );
    },
    // 职务新增
    addPosi: function() {
      let para = { name: this.addForm.job };
      addJob(para, res => {
        this.getJobs();
      });
    },
    //编辑弹窗
    handleEdit: function(index, row, did) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      this.getJobs();
    },
    // 重置密码
    resetPsw: function() {
      this.editForm.password = "123456";
    },
    // 查看详情
    handleLook: function(index, row) {
      this.lookFormVisible = true;
      this.lookForm = Object.assign({}, row);
    },
    // 提交新增表单
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addForm);
          para.password = md5(para.password);
          addUser(
            para,
            res => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getUsers();
            },
            () => {}
          );
        }
      });
    },
    // 编辑表单提交
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.editForm);
          if (para.password !== "123456") {
            let { password, ...others } = para;
            para = others;
          } else {
            para.password = md5(para.password);
          }
          editUser(
            para,
            res => {
              this.$message({
                message: "编辑成功",
                type: "success"
              });
              this.editFormVisible = false;
              this.$refs["editForm"].resetFields();
              this.getUsers();
            },
            () => {
              this.$message({
                message: "提交失败",
                type: "error"
              });
            }
          );
        }
      });
    },
    // 停用启用提示
    handleStop: function(index, row, status) {
      let para = { id: row.id, status: row.userLists.status };
      updateUserStatus(
        para,
        res => {
          if (res.code == "0") {
            this.$confirm(res.msg, "提示", {
              type: "warning",
              dangerouslyUseHTMLString: true
            })
              .then(() => {
                // let para = { id: row.id };
                // removeUser(para).then((res) => {
                this.$message({
                  message: "已停用！",
                  type: "success"
                });
                // });
              })
              .catch(() => {});
          } else {
          }
        },
        () => {}
      );
    }
  }
};
</script>

<style  lang="scss">
.setting {
  .alluser {
    max-height: 400px;
    min-height: 300px;
    overflow-y: auto;
    margin-top: 10px;
    .el-checkbox{
      width: 25%;
      margin-bottom: 5px;
    }
    .el-checkbox+.el-checkbox{margin-left: 0;}
  }
  .el-dialog {
    .el-textarea__inner {
      height: 140px;
    }
  }
  .el-dialog__body {
    padding: 40px 40px 10px;
  }
  .el-dialog__header {
    background: #1890ff;
    padding: 10px 20px;
    text-align: center;
    .el-dialog__title {
      color: #fff;
      font-weight: bold;
      line-height: 34px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
    .el-dialog__headerbtn:focus .el-dialog__close,
    .el-dialog__headerbtn:hover .el-dialog__close {
      color: #fff;
    }
  }
}

.el-form-item {
  margin-bottom: 30px;
}

.setting2 {
  .el-dialog__wrapper {
    .el-input--suffix .el-input__inner {
      width: 185px;
    }
    .treebox2 {
      width: 185px;
    }
  }
}
.vue-treeselect__placeholder,
.vue-treeselect__single-value {
  line-height: 40px;
}
</style>
