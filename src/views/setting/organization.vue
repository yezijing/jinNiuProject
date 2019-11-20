<template>
  <div class="content-wrap setting setting2">
    <p class="navtitle">
      <span>组织机构</span>
    </p>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
    </el-col>
    <!--列表-->
    <el-table
      class="tableinfo"
      border
      :data="organizeData"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="name" label="机构名称"></el-table-column>
      <el-table-column prop="remark" label="备注" width></el-table-column>
      <el-table-column label="操作" >
        <template scope="scope">
          <el-button type="primary" size="small" @click="handleLook(scope.$index, scope.row)">详情</el-button>
          <el-button type="info" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDel(scope.$index, scope.row, scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑组织机构" :visible.sync="editFormVisible" width="500px">
      <el-form size="small" :model="editForm" :rules="addFormRules" label-width="100px" ref="editForm">
        <el-form-item label="机构名称：" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="editSubmit('editForm')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog title="详情" :visible.sync="lookFormVisible" width="500px">
      <el-form size="small" :model="lookForm" label-width="100px" :rules="addFormRules">
        <el-form-item label="机构名称：" prop="name">
          <el-input v-model="lookForm.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="lookForm.remark" readonly></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  size="small" type="primary" @click="lookFormVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新增组织机构 -->
    <el-dialog title="新增组织机构" :visible.sync="addFormVisible" width="500px">
      <el-form size="small" :model="addForm" :rules="addFormRules" label-width="100px" ref="addForm">
        <el-form-item label="机构名称：" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addSubmit('addForm')">新增</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  organizeList,
  addOrganize,
  editOrganize,
  delOrganize
} from "../../api/api";
export default {
  name: "organization",
  data() {
    return {
      organizeData: [],
      currentPage: 1,
      pageSize: 5,
      totals: 0,
      editFormVisible: false, //编辑界面是否显示
      addFormVisible: false, //新增界面是否显示
      lookFormVisible: false, //详情界面是否显示
      addFormRules: {
        name: [
          { required: true, message: "请输入机构名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ]
      },
      addForm: {},
      lookForm: {},
      editForm: {}
    };
  },
  mounted() {},
  created() {
    this.getOrganize();
  },
  methods: {
    //   组织
    getOrganize: function() {
      organizeList("", data => {
        this.organizeData = data.data.obj;
      });
    },

    //新增
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        name: "",
        remark: ""
      };
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
    // 新增提交
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addForm);
          addOrganize(
            para,
            res => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getOrganize();
            },
            () => {
              console.log("error");
              this.$message({
                message: "提交失败",
                type: "error"
              });
            }
          );
        } else {
          console.log("error");
          return false;
        }
      });
    },
    // 编辑保存
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.editForm);
          editOrganize(
            para,
            res => {
              this.$message({
                message: "编辑成功",
                type: "success"
              });
              this.editFormVisible = false;
              this.$refs["editForm"].resetFields();
              this.getOrganize();
            },
            () => {
              console.log("error");
              this.$message({
                message: "提交失败",
                type: "error"
              });
            }
          );
        } else {
          console.log("error");
          return false;
        }
      });
    },

    //删除
    handleDel: function(index, row, id) {
      let para = { lid: id };
      console.log(para);
      delOrganize(para, res => {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.getOrganize();
      });
    }
  }
};
</script>

<style lang="scss">
.setting {
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
</style>
