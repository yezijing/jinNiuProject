<template>
  <div class="content-wrap setting setting2">
    <p class="navtitle">
      <span>部门管理</span>
    </p>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters" ref="filters" size="small">
        <el-form-item label="部门名称：" prop="dname">
          <el-input v-model="filters.dname" placeholder="请输入" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="组织机构：" prop="orgid">
          <el-select v-model="filters.orgid" clearable placeholder="全部" @change="selectChange">
            <el-option v-for="item in orangizes" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-on:click="getDatas" type="primary">搜索</el-button>
          <el-button @click="resetForm('filters')">重置</el-button>
        </el-form-item>
        <div class="toolbtns">
          <el-button type="primary" @click="handleAdd" size="small">新增</el-button>
        </div>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table class="tableinfo" border :data="tableData" highlight-current-row style="width: 100%;">
      <el-table-column label="序号" width="100" :formatter="formatter"></el-table-column>
      <el-table-column prop="name" label="部门名称"></el-table-column>
      <el-table-column prop="nickname" label="简称"></el-table-column>
      <el-table-column prop="orgName" label="组织机构"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="primary" size="small" @click="handleLook(scope.$index, scope.row)">详情</el-button>
          <el-button type="info" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="编辑部门" :visible.sync="editFormVisible" width="780px">
      <el-form
        :inline="true"
        :model="editForm"
        :rules="addFormRules"
        label-width="140px"
        ref="editForm"
        size="small"
      >
        <el-form-item label="部门名称：" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="简称：" prop="nickname">
          <el-input v-model="editForm.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="组织机构：" prop="orgid">
          <el-select v-model="editForm.orgid" filterable placeholder="请选择">
            <el-option v-for="item in orangizes" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门电话：" prop="deptphone">
          <el-input v-model="editForm.deptphone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="重点经济承办单位：" prop="iskey" class="yesno">
          <el-radio v-model="editForm.iskey" label="0">是</el-radio>
          <el-radio v-model="editForm.iskey" label="1">否</el-radio>
        </el-form-item>
        <el-form-item label="承办单位类别：" prop="deptcategory">
          <el-select v-model="editForm.deptcategory" placeholder="请选择">
            <el-option v-for="item in conlist" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="works" label="工作职责：" prop="duty">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3}"
            placeholder="请输入"
            v-model="editForm.duty"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="editSubmit('editForm')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog title="详情" :visible.sync="lookFormVisible" width="780px">
      <el-form size="small" :inline="true" :model="lookForm" label-width="140px" ref="lookForm">
        <el-form-item label="部门名称：">
          <el-input v-model="lookForm.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="简称：">
          <el-input v-model="lookForm.nickname" readonly></el-input>
        </el-form-item>
        <el-form-item label="组织机构：">
          <el-input v-model="lookForm.orgName" readonly></el-input>
        </el-form-item>
        <el-form-item label="部门电话：">
          <el-input v-model="lookForm.deptphone" readonly></el-input>
        </el-form-item>
        <el-form-item label="重点经济承办单位：" prop="iskey" class="yesno">
          <el-radio v-model="lookForm.iskey" label="0" readonly>是</el-radio>
          <el-radio v-model="lookForm.iskey" label="1" readonly>否</el-radio>
        </el-form-item>
        <el-form-item label="承办单位类别：" prop="deptcategory">
          <el-input v-model="lookForm.deptcategory" readonly></el-input>
        </el-form-item>
        <el-form-item class="works" label="工作职责：" prop="duty">
          <el-input type="textarea" :autosize="{ minRows:2}" v-model="lookForm.duty" readonly></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="lookFormVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新增部门类别 -->
    <el-dialog title="新增部门" class="userbox" :visible.sync="addFormVisible" width="780px">
      <el-form
        :inline="true"
        :model="addForm"
        :rules="addFormRules"
        label-width="140px"
        ref="addForm"
        size="small"
      >
        <el-form-item label="部门名称：" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="简称：" prop="nickname">
          <el-input v-model="addForm.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="组织机构：" prop="orgid">
          <el-select v-model="addForm.orgid" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in orangizes"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门电话：" prop="deptphone">
          <el-input v-model="addForm.deptphone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="重点经济承办单位：" prop="iskey" class="yesno">
          <el-radio v-model="addForm.iskey" label="0">是</el-radio>
          <el-radio v-model="addForm.iskey" label="1">否</el-radio>
        </el-form-item>
        <el-form-item label="承办单位类别：" prop="deptcategory">
          <el-select v-model="addForm.deptcategory" placeholder="请选择">
            <el-option v-for="item in conlist" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="works" label="工作职责：" prop="duty">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3}"
            placeholder="请输入"
            v-model="addForm.duty"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addSubmit('addForm')">新增</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  deptList,
  organizeList,
  deptypeList,
  addDept,
  delDept,
  editDept,
  allusers,
  detailDept
} from "../../api/api";

export default {
  name: "departmentManage",
  components: {
    Treeselect
  },
  data() {
    return {
      props: {},
      orangizes: [], //组织机构数据
      types: [],
      users: [],
      currentPage: 1,
      pageSize: 10,
      totals: 0,
      // 表单验证
      addFormRules: {
        name: [
          { required: true, message: "请输入部门名称", trigger: "change" }
        ],
        orgid: [
          { required: true, message: "请选择组织机构", trigger: "change" }
        ]
      },
      // 搜索
      filters: {},
      // 列表数据
      tableData: [],
      editForm: {},
      addForm: {},
      lookForm: {},
      editFormVisible: false, //编辑界面是否显示
      addFormVisible: false, //新增界面是否显示
      lookFormVisible: false, //详情界面是否显示,
      conlist: ["街道经济发展服务中心", "功能区推进办"]
    };
  },
  mounted() {},
  created() {
    this.getDeptlist();
    this.getDepttype();
    this.getOrganize();
    this.getUsers();
  },
  methods: {
    selectChange() {
      this.$forceUpdate();
    },
    formatter(row, column, cellValue, index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize;
    },
    getUsers: function() {
      allusers("", data => {
        this.users = data.data.obj;
      });
    },

    //   部门列表
    getDeptlist: function() {
      let para = this.filters;
      para.pageSize = this.pageSize;
      para.pageNum = this.currentPage;
      // let para = { pageSize: this.pageSize, pageNum: this.currentPage };
      deptList(para, data => {
        this.tableData = data.data.obj.datas;
        this.totals = data.data.obj.total;
      });
    },
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getDeptlist();
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getDeptlist();
    },

    //   部门类别
    getDepttype: function() {
      deptypeList("", data => {
        this.types = data.data.obj;
      });
    },
    // 组织机构
    getOrganize: function() {
      organizeList("", data => {
        this.orangizes = data.data.obj;
      });
    },
    // 树形下拉取值
    getValue(value) {
      this.valueId = value;
    },
    //搜索
    getDatas() {
      let para = this.filters;
      para.pageSize = this.pageSize;
      para.pageNum = this.currentPage;
      deptList(para, data => {
        this.tableData = data.data.obj.datas;
        this.totals = data.data.obj.total;
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getDeptlist();
    },
    //新增
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = { iskey: "1" };
    },
    changeMenu() {
      this.$refs.addForm.validateField("higher");
    },
    //编辑
    handleEdit: function(index, row) {
      let para = { lid: row.id };
      detailDept(para, data => {
        this.editForm = data.data.obj;
        this.editForm.iskey = String(data.data.obj.iskey);
        this.editFormVisible = true;
      });
    },
    // 详情
    handleLook: function(index, row) {
      let para = { lid: row.id };
      detailDept(para, data => {
        console.log(data);
        this.lookForm = data.data.obj;
        this.lookForm.iskey = String(data.data.obj.iskey);
        this.lookFormVisible = true;
      });
    },

    // 新增提交数据
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addForm);
          addDept(
            para,
            res => {
              if (res.data.code == -1) {
                this.$message({
                  message: "部门名字重复，请重新编辑!",
                  type: "error"
                });
              } else {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getDeptlist();
              }
            },
            () => {
              this.$message({
                message: "提交失败",
                type: "error"
              });
            }
          );
        } else {
          return false;
        }
      });
    },
    // 编辑保存
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.editForm);
          para.parent_leader = para.lid;
          editDept(
            para,
            res => {
              if (res.data.code == -1) {
                this.$message({
                  message: "部门名字重复，请重新编辑!",
                  type: "error"
                });
              } else {
                this.$message({
                  message: "编辑成功",
                  type: "success"
                });
                this.editFormVisible = false;
                this.$refs["editForm"].resetFields();
                this.getDeptlist();
              }
            },
            () => {
              this.$message({
                message: "提交失败",
                type: "error"
              });
            }
          );
        } else {
          return false;
        }
      });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm(
        '<span style="color:#f00;">将删除该部门信息</span>，确定删除吗?',
        "提示",
        { type: "warning", dangerouslyUseHTMLString: true }
      )
        .then(() => {
          let para = { lid: row.id };
          delDept(
            para,
            res => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getDeptlist();
            },
            () => {
              this.$message({
                message: "删除失败",
                type: "error"
              });
            }
          );
        })
        .catch(() => {
          this.$message({
            message: "取消删除",
            type: "warning"
          });
        });
    }
  }
};
</script>

<style lang="scss">
.setting {
  .yesno {
    .el-form-item__content {
      width: 197px;
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
.setting2 {
  .el-dialog {
    .works {
      .el-textarea__inner {
        width: 548px;
      }
    }
    .el-input {
      .el-input__inner {
        width: 197px;
      }
      .el-input--suffix .el-input__inner {
        width: 197px;
      }
    }
  }
}
.el-button--primary {
  color: #fff;
  background-color: #1890ff;
  border-color: #1890ff;
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
.userbox {
  .treebox2 {
    width: 160px;
    .vue-treeselect__placeholder,
    .vue-treeselect__single-value {
      line-height: 40px;
    }
  }
  // .el-input--suffix .el-input__inner{width: 160px;}
}
</style>
