<template>
  <div class="content-wrap setting setting2">
    <p class="navtitle">
      <span>角色管理</span>
    </p>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <div class="toolbtns">
        <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
      </div>
    </el-col>
    <!--列表-->
    <el-table
      class="tableinfo"
      border
      :data="roleList"
      highlight-current-row
      :cell-class-name="stateClassName"
      :row-class-name="statusClassName"
      style="width: 100%;"
    >
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="name" label="角色名"></el-table-column>
      <el-table-column prop="remark" label="备注" width></el-table-column>
      <el-table-column prop="createtime" :formatter="timestampToTime" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" width="150">
        <template slot-scope="scope">
          <i class="fa yuan"></i>
          <span v-html="stateFormat(scope,scope.row.status)"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template scope="scope">
          <el-button class="btn" @click="handleMember(scope.$index, scope.row)">管理成员</el-button>
          <el-button class="btn" @click="handleEdit(scope.$index, scope.row)">分配权限</el-button>
          <el-button
            class="btn stopbtn"
            @click="handleEnable(scope.$index, scope.row)"
            v-html="btnFormat(scope,scope.row.status)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增 -->
    <el-dialog :title="changeTitle" :visible.sync="addFormVisible" width="800px">
      <el-form :model="addForm" label-width="120px" ref="addForm" size="small">
        <el-form-item
          label="角色名："
          prop="name"
          :rules="[{ required: true, message: '请输入角色名', trigger:'blur'}]"
        >
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" prop="remark">
          <el-input type="textarea" :autosize="{ minRows: 2}" v-model="addForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限分配：">
          <el-tree
            ref="tree"
            :multiple="true"
            :check-strictly="checkStrictly"
            :data="options"
            :props="defaultProps"
            show-checkbox
            :default-checked-keys="defaultCheckedKeys"
            node-key="alias"
            class="permission-tree"
          />
        </el-form-item>
        <el-form-item label="页面按钮权限：">
          <template>
            <div class="pagelist">
              <!-- <p class="tt"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">重点项目</el-checkbox></p> -->
              <p class="tt">重点项目</p>
              <div class="plist">
                <el-checkbox-group v-model="projectCheckList">
                  <el-checkbox
                    v-for="item in projectBtns"
                    :label="item.value"
                    :key="item.value"
                  >{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <p class="tt">批交办事项</p>
              <div class="plist">
                <el-checkbox-group v-model="assignCheckList">
                  <el-checkbox
                    v-for="item in assignBtns"
                    :label="item.value"
                    :key="item.value"
                  >{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <p class="tt">决策督查</p>
              <div class="plist">
                <el-checkbox-group v-model="planCheckList">
                  <el-checkbox
                    v-for="item in planBtns"
                    :label="item.value"
                    :key="item.value"
                  >{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <p class="tt">目标管理</p>
              <div class="plist">
                <el-checkbox-group v-model="targetCheckList">
                  <el-checkbox
                    v-for="item in targetBtns"
                    :label="item.value"
                    :key="item.value"
                  >{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <p class="tt">个人中心</p>
              <div class="plist">
                <el-checkbox-group v-model="personCheckList">
                  <el-checkbox
                    v-for="item in personBtns"
                    :label="item.value"
                    :key="item.value"
                  >{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('addForm')">{{btnTxts}}</el-button>
      </div>
    </el-dialog>
    <!-- 管理成员 -->
    <el-dialog title="成员管理" :visible.sync="memberVisible" width="1200px" class="memberbox">
      <div class="addbox">
        <p class="title">添加成员</p>
        <div class="treelist">
          <el-row :gutter="20">
            <el-col :span="8" class="partlist">
              <p class="tt">选择组织机构</p>
              <ul class="list">
                <li
                  v-for="(item,index) in organizeList"
                  :key="item.id"
                  :class="activeClass == index ? 'active':''"
                >
                  <p @click="chooseOrganize(item.id,index)">{{item.name}}</p>
                </li>
              </ul>
            </el-col>
            <el-col :span="16">
              <div class="memberlist">
                <div class="haslist">
                  <p class="tt">选择用户（共{{allNumber}}人）</p>
                  <el-checkbox
                    :indeterminate="isIndeterminate"
                    v-model="checkAll"
                    @change="handleCheckAllChange"
                  >全选</el-checkbox>
                  <div class="hasbox">
                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                      <el-checkbox
                        v-for="city in cities"
                        :label="city.id"
                        :key="city.id"
                        :disabled="hasitem.includes(city.id)"
                      >{{city.name}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
                <!-- <div class="btns" style="width:80px;">
                  <el-button type="primary" @click="addToHaslist" size="small">添加</el-button>
                  <el-button type="info" @click="removeToHaslist" size="small">移除</el-button>
                </div> -->
                <div class="haslist">
                  <p class="tt">已有成员（{{hasNumber}}人）</p>
                  <div class="hasbox">
                    <el-checkbox-group v-model="hasUsers">
                      <el-checkbox
                        v-for="item in hasList"
                        :label="item.id"
                        :key="item.id"
                      >{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="memberSubmit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { allAddRouter } from "@/router/index";
import {
  addRole,
  rolelist,
  editRole,
  checkStatus,
  memberList,
  addMember,
  deptdataList,
  searchbyDeptId,
  getAllusers
} from "../../api/roleApi";
import { organizeList } from "../../api/api";
const defaultRole = {
  key: "",
  name: "",
  remark: "",
  routes: []
};
export default {
  name: "rolemenagement",
  data() {
    return {
      activeClass: -1,
      allNumber: 0, //该组织机构下所有用户
      hasitem: [],
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: true,
      roleList: [],
      hasNumber: 0, //已有成员数量
      checkStrictly: false,
      memberVisible: false,
      role: Object.assign({}, defaultRole),
      dialogVisible: false,
      dialogType: "new",
      addFormVisible: false, //新增界面是否显示
      addForm: {},
      changeTitle: "",
      btnTxts: "",
      dialogType: "",
      options: [],
      defaultCheckedKeys: [],
      rid: "",
      defaultProps: {
        children: "children",
        label: "name"
      },
      props: {
        label: "name",
        children: [],
        isLeaf: "leaf"
      },
      // checkAll: false,
      checkedUsers: [],
      users: [],
      // isIndeterminate: true,
      hasList: [],
      roleid: -1,
      hasUsers: [],
      projectCheckList: [],
      assignCheckList: [],
      planCheckList: [],
      targetCheckList: [],
      personCheckList: [],
      projectBtns: [
        { value: "A-add", name: "新增" },
        { value: "A-edit", name: "编辑" },
        { value: "A-report", name: "进展汇报" },
        { value: "A-over", name: "完结" },
        { value: "A-down", name: "报表下载" }
      ],
      assignBtns: [
        { value: "B-add", name: "新增" },
        { value: "B-edit", name: "编辑" },
        { value: "B-report", name: "进展汇报" },
        { value: "B-over", name: "完结" },
        { value: "B-down", name: "报表下载" }
      ],
      planBtns: [
        { value: "C-add", name: "新增" },
        { value: "C-edit", name: "编辑" },
        { value: "C-report", name: "进展汇报" },
        { value: "C-process", name: "过程管理" },
        { value: "C-over", name: "完结" },
        { value: "C-down", name: "报表下载" }
      ],
      targetBtns: [
        { value: "D-add", name: "新增" },
        { value: "D-edit", name: "编辑" },
        { value: "D-down", name: "报表下载" },
        { value: "D-report", name: "进展汇报" },
        { value: "D-process", name: "添加承办单位" }
      ],
      personBtns: [{ value: "E-check", name: "审核" }],
      organizeList: [],
      defaultKeys: [],
      chooseList: []
    };
  },
  mounted() {},
  created() {
    this.options = allAddRouter;
    this.getRoleList();
  },
  methods: {
    // 获取所有用户
    getAllOrgUsers(){

    },
    // 移除
    removeToHaslist(){
      for(var i=0;i<this.hasUsers.length;i++){
        var cid = this.hasUsers[i];
        for(var j=0;j<this.hasList.length;j++){
          if(cid == this.hasList[j].id){
            this.hasList.splice(j,1);
            break;
          }
        }
      }
    },
    // 添加到已有成员
    addToHaslist(){
      for(var i=0;i<this.checkedCities.length;i++){
        var obj = {};
        var cid = this.checkedCities[i];
        obj.id = cid;
        var ison =false;
        for(var j=0;j<this.cities.length;j++){
          if(cid==this.cities[j].id){
            obj.name = this.cities[j].name;
            ison = true;
            break;
          }
        }
        if(ison == true){
          // this.hasList.push(obj);
          // this.hasUsers.push(cid);
          // this.hasitem.push(cid);
        }
      }
    },
    // 选择组织机构，获取用户列表
    chooseOrganize(id, index) {
      this.hasitem = [];
      let para = { orgid: id, roleid: this.roleid };
      getAllusers(para, data => {
        var norole = [];
        if (data.data.obj.allUserList == null) {
          this.cities = [];
        } else {
          this.cities = data.data.obj.allUserList;
        }
        this.allNumber = this.cities.length;
        this.activeClass = index;
        if (data.data.obj.noRoleUserList == null) {
          norole = [];
        } else {
          norole = data.data.obj.noRoleUserList;
        }
        // 获取已存在角色的用户
        var array = this.cities;
        var array2 = norole;
        for (var i = 0; i < array.length; i++) {
          var obj = array[i];
          var num = obj.id;
          var isExist = false;
          for (var j = 0; j < array2.length; j++) {
            var aj = array2[j];
            var n = aj.id;
            if (n == num) {
              isExist = true;
              break;
            }
          }
          if (!isExist) {
            this.hasitem.push(obj.id);
          }
        }
      });
    },
    // 全选
    handleCheckAllChange(val) {
      let arr = [];
      for (var i = 0; i < this.cities.length; i++) {
        arr.push(this.cities[i].id);
      }
      this.checkedCities = val ? arr : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },

    handleNodeClick(node, data) {
      if (data.level === 2) {
        let para = { roleid: this.roleid, deptid: node.id };
        searchbyDeptId(para, data => {
          this.isIndeterminate = false;
          this.cities = data.data.obj;
        });
      }
    },
    // 异步加载部门
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.organizeList);
      }
      if (node.level === 1) {
        this.getdeptList(node, resolve);
      }
    },

    // 获取用户列表
    getuserList(node, resolve) {
      let para = { roleid: this.roleid, deptid: node.data.id };
      searchbyDeptId(para, data => {
        this.cities = data.data.obj;
      });
    },
    // 根据组织机构id获取部门列表
    getdeptList(node, resolve) {
      let para = { orgid: node.data.id };
      deptdataList(para, data => {
        const dlist = data.data.obj;
        for (var i = 0; i < dlist.length; i++) {
          dlist[i].leaf = true;
        }
        resolve(dlist);
      });
    },
    // 角色列表
    getRoleList() {
      rolelist("", data => {
        this.roleList = data.data.obj;
      });
    },
    timestampToTime(row, column) {
      var date = new Date(row.createtime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      return Y + M + D;
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
    // 不同状态样式
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
    //新增弹窗
    handleAdd: function() {
      this.changeTitle = "新增角色";
      this.btnTxts = "新增";
      this.dialogType = "add";
      this.addFormVisible = true;
      this.addForm = {
        name: "",
        remark: ""
      };
      this.projectCheckList = [];
      this.assignCheckList = [];
      this.planCheckList = [];
      this.targetCheckList = [];
      this.personCheckList = [];
      this.role = Object.assign({}, defaultRole);
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([]);
      }
    },
    // 停用 启用
    handleEnable(index, row) {
      let para = { roleid: row.id, status: row.status };
      checkStatus(para, data => {
        this.getRoleList();
      });
    },
    //分配权限
    handleEdit: function(index, row) {
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([]);
      }
      this.changeTitle = "编辑角色";
      this.btnTxts = "保存";
      this.dialogType = "edit";
      this.addForm = Object.assign({}, row);
      this.defaultCheckedKeys = row.defaultCheckedKeys;
      this.projectCheckList = row.projectCheckList;
      this.planCheckList = row.planCheckList;
      this.targetCheckList = row.targetCheckList;
      this.personCheckList = row.personCheckList;
      this.assignCheckList = row.assignCheckList;
      if (this.targetCheckList == null) {
        this.targetCheckList = [];
      }
      if (this.projectCheckList == null) {
        this.projectCheckList = [];
      }
      if (this.assignCheckList == null) {
        this.assignCheckList = [];
      }
      if (this.planCheckList == null) {
        this.planCheckList = [];
      }
      if (this.personCheckList == null) {
        this.personCheckList = [];
      }
      this.rid = row.id;
      this.addFormVisible = true;
    },
    // 提交
    submitForm() {
      if (this.dialogType == "add") {
        this.addSubmit();
      } else {
        this.editSubmit();
      }
    },
    // 新增角色提交
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addForm);
          const checkedKeys = this.$refs.tree.getCheckedKeys();
          checkedKeys.push("main");
          checkedKeys.push("mainindex");
          para.defaultCheckedKeys = checkedKeys;
          para.status = 0;
          para.projectCheckList = this.projectCheckList;
          para.assignCheckList = this.assignCheckList;
          para.targetCheckList = this.targetCheckList;
          para.planCheckList = this.planCheckList;
          para.personCheckList = this.personCheckList;
          para = JSON.stringify(para);
          addRole(para, data => {
            this.$message({
              message: "新增成功",
              type: "success"
            });
            this.$refs["addForm"].resetFields();
            if (this.$refs.tree) {
              this.$refs.tree.setCheckedNodes([]);
            }
            this.addFormVisible = false;
            this.getRoleList();
          });
        }
      });
    },
    // 分配权限提交
    editSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addForm);
          const checkedKeys = this.$refs.tree.getCheckedKeys();
          checkedKeys.push("main");
          checkedKeys.push("mainindex");
          para.defaultCheckedKeys = checkedKeys;
          para.id = this.rid;
          para.projectCheckList = this.projectCheckList;
          para.assignCheckList = this.assignCheckList;
          para.targetCheckList = this.targetCheckList;
          para.planCheckList = this.planCheckList;
          para.personCheckList = this.personCheckList;
          para = JSON.stringify(para);
          editRole(para, data => {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.$refs["addForm"].resetFields();
            if (this.$refs.tree) {
              this.$refs.tree.setCheckedNodes([]);
            }
            this.rid = "";
            this.addFormVisible = false;
            this.getRoleList();
          });
        }
      });
    },
    // 管理成员
    handleMember(index, row) {
      this.allNumber = 0;
      this.hasitem = [];
      this.activeClass = -1;
      this.checkedCities = [];
      this.cities = [];
      this.hasNumber = 0;
      this.memberVisible = true;
      this.checkedUsers = [];
      this.hasList = [];
      this.hasUsers = [];
      this.checkAll = false;
      this.isIndeterminate = false;
      this.roleid = row.id;
      let para = { roleid: row.id };
      memberList(para, data => {
        this.hasList = data.data.obj.hasRoleUser;
        this.organizeList = data.data.obj.orgList;
        this.hasNumber = this.hasList.length;
        let arr = [];
        if (this.hasList == null) {
          this.hasUsers = [];
        } else {
          for (var i = 0; i < this.hasList.length; i++) {
            arr.push(this.hasList[i].id);
          }
          this.hasUsers = arr;
        }
      });
    },
    // 管理成员提交
    memberSubmit() {
      let arr2 = this.hasUsers;
      // var arr1 = this.$refs.treelist.getCheckedNodes(true, false);
      // var ids = [];
      // for (var i = 0; i < this.checkedCities.length; i++) {
      //   ids.push(this.checkedCities[i].id);
      // }
      let userids = this.checkedCities.concat(arr2);
      let para = { roleid: this.roleid, userids: userids };
      para = JSON.stringify(para);
      addMember(para, data => {
        this.$message({
          message: "保存成功",
          type: "success"
        });
        this.memberVisible = false;
        this.checkedUsers = [];
        this.checkAll = false;
        this.isIndeterminate = false;
        this.roleid = -1;
        this.hasList = [];
        this.checkedCities = [];
      });
    }
  }
};
</script>

<style lang="scss">
.memberbox {
  .memberlist {
    display: flex;
    align-items: stretch;
    .haslist {
      flex: 1;
      padding: 0 15px;
      .hasbox {
        height: 300px;
        overflow: auto;
      }
    }
    .btns {
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
      width: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .el-button+.el-button{margin-left: 0;margin-top: 15px;}
    }
  }
  .treelist {
    border: 1px solid #ccc;
    padding: 10px 20px;
    .el-checkbox {
      min-width: 100px;
      margin-bottom: 8px;
      width: 50%;
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
    .partlist {
      overflow-y: auto;
      overflow-x: hidden;
      height: 356px;
      border-right: 1px solid #ddd;
      .list {
        height: 304px;
        overflow: auto;
        li {
          padding: 0 10px;
          p {
            color: #333;
            font-size: 14px;
            height: 32px;
            line-height: 32px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
          }
        }
        .active {
          background: #eee;
        }
      }
    }
    .tt {
      font-size: 14px;
      margin-bottom: 10px;
      color: #333;
      font-weight: bold;
    }
    .el-tree-node__content {
      &:hover {
        background: #eee;
      }
    }
  }
  .title {
    color: #222;
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: bold;
    span {
      color: #1890ff;
      font-weight: bold;
    }
  }
  .mlist {
    border: 1px solid #ccc;
    padding: 10px 20px;
    box-sizing: border-box;
    max-height: 150px;
    overflow-y: auto;
    overflow-x: hidden;
    .item {
      display: inline-block;
      width: 25%;
      margin-bottom: 10px;
    }
    .el-checkbox {
      width: 25%;
      margin-bottom: 10px;
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }
  .mlist + .mlist {
    margin-top: 30px;
  }
  .mlist2 {
    height: 220px;
  }
  .mcut {
    height: 10px;
  }
  .addbox {
    margin-bottom: 20px;
  }
}
.setting {
  .el-form-item__label {
    font-weight: bold;
  }
  .el-checkbox__inner {
    border: 1px solid #66b1ff;
  }
  .el-tree-node__content {
    height: 40px;
  }
  .el-tree-node__expand-icon {
    font-size: 16px;
    color: #999;
  }
  .el-tree-node__expand-icon.is-leaf {
    color: transparent;
    cursor: default;
  }
  .toolbar {
    margin-bottom: 30px;
  }
  .el-table {
    td {
      .yuan {
        width: 6px;
        height: 6px;
        background: #00a854;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .red {
      .yuan {
        background: #f00;
      }
    }
    .stopUse {
      .stopbtn {
        color: #f00;
      }
    }
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
  .pagelist {
    .tt {
      color: #333;
    }
  }
}

.el-form-item {
  margin-bottom: 30px;
}
.tableinfo {
  .el-button--primary,
  .el-button--info,
  .el-button--danger {
    color: #1890ff;
    background: transparent;
    border: 0;
  }
  .el-button--small,
  .el-button--small.is-round {
    padding: 8px 0;
  }
}
.toolbtns {
  display: flex;
  justify-content: space-between;
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
