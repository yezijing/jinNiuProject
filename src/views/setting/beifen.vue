<template>
  <div class="setting">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters" ref="filters">
        <el-form-item label="部门名称：" prop="name">
          <el-input v-model="filters.name" placeholder="请输入" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-on:click="getDatas" type="primary">搜索</el-button>
          <el-button @click="resetForm('filters')">重置</el-button>
        </el-form-item>
        <div class="toolbtns">
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table class="tableinfo" border :data="tableData" highlight-current-row style="width: 100%;">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="name" label="部门名称"></el-table-column>
      <el-table-column prop="nickname" label="简称" width></el-table-column>
      <el-table-column prop="dept_leader" label="部门主管" width></el-table-column>
      <el-table-column prop="orgid" label="组织机构" width></el-table-column>
      <el-table-column prop="cateid" label="部门类型" width></el-table-column>
      <!-- <el-table-column prop="parent_leader" label="上级部门" width></el-table-column> -->
      <el-table-column label="操作" width="200">
        <template scope="scope">
          <el-button type="primary" size="small" @click="handleLook(scope.$index, scope.row)">详情</el-button>
          <el-button type="info" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑部门类别" :visible.sync="editFormVisible" width="980px">
      <el-form
        :inline="true"
        :model="editForm"
        :rules="addFormRules"
        label-width="120px"
        ref="editForm"
        validate-on-rule-change="true"
      >
        <el-form-item label="部门名称：" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="组织机构：" prop="jigou">
          <el-select v-model="editForm.jigou" placeholder="请选择">
            <el-option
              v-for="item in orangizes"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="上级部门：" prop="higher">
          <treeselect
            v-model="editForm.higher"
            :options="departments"
            placeholder="请选择"
            @input="changeMenu"
            class="treebox2"
          />
        </el-form-item> -->
        <el-form-item label="简称：" prop="shortname">
          <el-input v-model="editForm.shortname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门类别：" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="上级部门领导：" prop="higherleader">
          <el-input v-model="editForm.higherleader" auto-complete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="部门主管：" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.type"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分管领导：" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.type"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话：" prop="phone">
          <el-input v-model="editForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="works" label="工作职责：">
          <el-input type="textarea" placeholder="请输入" v-model="editForm.work"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editFormVisible = false">保存</el-button>
      </div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog title="详情" :visible.sync="lookFormVisible" width="980px">
      <el-form
        :inline="true"
        :model="lookForm"
        :rules="addFormRules"
        label-width="120px"
        ref="lookForm"
        validate-on-rule-change="true"
      >
        <el-form-item label="部门名称：" prop="name">
          <el-input v-model="lookForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="组织机构：" prop="jigou">
          <el-select v-model="lookForm.jigou" placeholder="请选择">
            <el-option
              v-for="item in orangizes"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简称：" prop="shortname">
          <el-input v-model="lookForm.shortname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门类别：" prop="type">
          <el-select v-model="lookForm.type" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门主管：">
          <el-select v-model="lookForm.dept_leader" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.type"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分管领导：" prop="type">
          <el-select v-model="lookForm.type" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.type"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话：" prop="phone">
          <el-input v-model="lookForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="works" label="工作职责：">
          <el-input type="textarea" placeholder="请输入" v-model="lookForm.work"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookFormVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新增部门类别 -->
    <el-dialog title="新增部门类别" class="userbox" :visible.sync="addFormVisible" width="980px">
      <el-form
        :inline="true"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        ref="addForm"
        validate-on-rule-change="true"
      >
        <el-form-item label="部门名称：" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="组织机构：" prop="orgid">
          <el-select v-model="addForm.orgid" placeholder="请选择">
            <el-option
              v-for="item in orangizes"
              :key="item.value"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="上级部门：" prop="higher">
          <treeselect
            v-model="addForm.higher"
            :options="departments"
            placeholder="请选择"
            @input="changeMenu"
            class="treebox2"
          />
        </el-form-item> -->
        <el-form-item label="简称：" prop="shortname">
          <el-input v-model="addForm.shortname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门类别：" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门电话：" prop="phone">
          <el-input v-model="addForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="works" label="工作职责：">
          <el-input type="textarea" :row="8" placeholder="请输入" v-model="addForm.work"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit('addForm')">新增</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { deptList, organizeList, deptypeList, searchDept } from "../../api/api";

export default {
  name: "departmentManage",
  components: {
    Treeselect
  },
  data() {
    return {
      props: {},
      // 部门
      departments: [
        {
          id: 1,
          label: "金牛区",
          parentId: 0,
          children: [
            {
              id: 11,
              label: "目督办",
              parentId: 1,
              children: [
                {
                  id: 111,
                  label: "督查部"
                },
                {
                  id: 112,
                  label: "目标管理部"
                }
              ]
            },
            {
              id: 12,
              label: "工程管理",
              parentId: 1
            }
          ]
        },
        {
          id: 2,
          label: "高新区",
          parentId: 0
        },
        {
          id: 3,
          label: "天府新区",
          parentId: 0
        }
      ],
      // 组织机构
      orangizes: [],
      // 部门类别
      types: [],
      // 表单验证
      addFormRules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        jigou: [
          { required: true, message: "请选择组织机构", trigger: "change" }
        ],
        type: [{ required: true, message: "请选择部门类别", trigger: "change" }]
      },
      // 搜索
      filters: {name: ""},
      // 列表数据
      tableData: [],
      editForm: {},
      addForm: {},
      lookForm: {},
      editFormVisible: false, //编辑界面是否显示
      addFormVisible: false, //新增界面是否显示
      lookFormVisible: false //详情界面是否显示
    };
  },
  mounted() {},
  created() {
    this.getDeptlist();
    this.getDepttype();
    this.getOrganize();
  },
  methods: {
    //   部门列表
    getDeptlist: function() {
      deptList("", data => {
        this.tableData = data.data.obj;
        console.log(this.tableData);
      });
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
      console.log(this.valueId);
    },
    //搜索
    getDatas() {
      let para = { depname: this.filters.name};
      searchDept(para, data => {
        console.log(data.data)
        this.tableData = data.obj;
      })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getDeptlist();
    },
    //新增
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        name: "",
        shortname: "",
        jigou: {},
        higher: null,
        type: "",
        higherleader: "",
        partleader: "",
        leadership: "",
        phone: "",
        work: ""
      };
    },
    changeMenu() {
      this.$refs.addForm.validateField("higher");
      console.log(this.addForm.higher);
    },
    //编辑
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    // 详情
    handleLook: function(index, row) {
      this.lookFormVisible = true;
      this.lookForm = Object.assign({}, row);
    },
    // 新增提交数据
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            console.log("success");
            let para = Object.assign({}, this.addForm);
            this.$message({
              message: "提交成功",
              type: "success"
            });
            // this.$refs['addForm'].resetFields();
            this.addFormVisible = false;
            console.log(para);
          });
        } else {
          console.log("error");
          return false;
        }
      });
    },
    // 编辑提交表单
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            console.log("success");
            let para = Object.assign({}, this.editForm);
            this.$message({
              message: "编辑成功",
              type: "success"
            });
            this.editFormVisible = false;
            console.log(para);
          });
        } else {
          console.log("error");
          return false;
        }
      });
    },

    //删除提示
    handleDel: function(index, row) {
      this.$confirm(
        '<span style="color:#f00;">将删除该信息</span>，确认删除吗?',
        "提示",
        {
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          // let para = { id: row.id };
          // removeUser(para).then((res) => {
          this.$message({
            message: "删除成功！",
            type: "success"
          });
          // });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.setting {
  padding: 0 20px;
  .toolbar {
    margin-bottom: 30px;
  }
  .el-table th {
    background-color: #eef1f6;
    color: #333;
    text-align: center;
  }
  .el-table td {
    text-align: center;
  }
  .el-dialog {
    .works {
      .el-textarea__inner {
        width: 784px;
      }
    }
    .el-input {
      .el-input__inner {
        width: 185px;
      }
      .el-input--suffix .el-input__inner {
        width: 185px;
      }
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
