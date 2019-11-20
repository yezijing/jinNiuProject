<template>
  <div>
    <!--工具条-->
    <div class="toolbtns0">
      <el-button type="primary" @click="handleAdd" size="small" v-if="isAddShow">新 增</el-button>
    </div>
    <!-- 列表 -->
    <el-row>
      <el-table
        class="tableinfo"
        border
        :data="tableData"
        highlight-current-row
        style="width: 100%;"
        :height="tableHeight"
      >
        <el-table-column prop="name" label="区（市）县"></el-table-column>
        <el-table-column prop="typeName" label="类别"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" width="200">
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
    <el-dialog class="managebox" :title="formTitle" :visible.sync="addFormVisible" width="500px">
      <el-form :inline="true" :model="addForm" label-width="120px" ref="addForm" size="small">
        <el-form-item label="区（市）县：" prop="name" :rules="[{ required: true, message: '名称不能为空'}]">
          <el-input v-model="addForm.name" placeholder="请输入"></el-input>
        </el-form-item>

        <div class="yearbox">
          <el-form-item
            label="类别："
            prop="typeid"
            class="typebox"
            size="small"
            :rules="[{ required: true, message: '请选择类别'}]"
          >
            <el-select v-model="addForm.typeid" filterable clearable placeholder="请选择">
              <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <div class="jiabtn">
            <i class="icon el-icon-circle-plus" @click="typeShow = true"></i>
            <div class="awrap" v-if="typeShow">
              <p>新增类别</p>
              <el-input
                type="textarea"
                :autosize="{ minRows: 1}"
                placeholder="请输入"
                v-model="newtype"
                size="small"
              ></el-input>
              <div class="buttons">
                <el-button size="small" @click="typeShow = false">取消</el-button>
                <el-button size="small" @click="addType" type="primary">确定</el-button>
              </div>
            </div>
          </div>
        </div>
        <el-form-item label="备注：" prop="remark" class="remark2">
          <el-input
            type="textarea"
            placeholder="请输入"
            :autosize="{ minRows: 3}"
            v-model="addForm.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveSubmit('addForm')">{{btnWord}}</el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog class="managebox" title="详情" :visible.sync="detailFormVisible" width="500px">
      <el-form :inline="true" :model="detailForm" label-width="140px" ref="detailForm" size="small">
        <div class="yearbox">
          <el-form-item label="区（市）县：" prop="name">
            <el-input v-model="detailForm.name" readonly></el-input>
          </el-form-item>
        </div>
        <el-form-item label="类别：" prop="typeName">
          <el-input v-model="detailForm.typeName" readonly></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark" class="remark2">
          <el-input type="textarea" :autosize="{ minRows: 3}" readonly v-model="detailForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="detailFormVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addDistrict,
  allArealist,
  areaById,
  typelist,
  editDistrict,
  addTypes,
  getFilterArea
} from "../../api/targetApi";
export default {
  name: "target",
  props: ["leaderList", "deptList"],
  data() {
    return {
      filters: {},
      addFormVisible: false,
      detailFormVisible: false,
      tableData: [],
      addForm: {},
      detailForm: {},
      formTitle: "",
      btnWord: "",
      change: "",
      types: [],
      tableData: [],
      typeShow: false,
      newtype: "",
      pageSize: 20,
      currentPage: 1,
      totals: 0,
      targetCheckList: JSON.parse(this.$store.getters.userdata).targetCheckList,
      isAddShow: false,
      isEditShow: false,
      tableHeight: "500px",
      curyear:""
    };
  },
  mounted() {},
  created() {
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
    this.getTypes();
    this.browerHeight()
  },
  methods: {
    // 获取浏览器高度，计算table高度
    browerHeight() {
      var bheight = document.body.clientHeight;
      var hh = bheight - 330;
      this.tableHeight = hh + "px";
    },
    // 获取列表数据
    getAlldata() {
      let para = { pageSize: this.pageSize, pageNum: this.currentPage };
      getFilterArea(para, data => {
        console.log(data.data.obj);
        this.totals = data.data.obj.total;
        this.tableData = data.data.obj.datas;
      });
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
    // 获取类别
    getTypes() {
      typelist("", data => {
        this.types = data.data.obj;
      });
    },
    // 新增类别
    addType() {
      let para = { name: this.newtype };
      addTypes(para, res => {
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.getTypes();
        this.newtype = "";
      });
    },
    // 新增
    handleAdd() {
      this.addFormVisible = true;
      this.addForm = {};
      this.formTitle = "新增";
      this.btnWord = "新增";
      this.change = "add";
      this.addForm = {};
    },
    // 详情
    handleLook(index, row) {
      this.detailFormVisible = true;
      this.detailForm = Object.assign({}, row);
    },
    // 编辑
    handleEdit(index, row) {
      this.addForm = Object.assign({}, row);
      this.formTitle = "编辑";
      this.btnWord = "保存";
      this.change = "edit";
      this.addFormVisible = true;
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
          let para = Object.assign({}, this.addForm);
          addDistrict(
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
            }
          );
        }
      });
    },
    // 编辑提交
    editSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addForm);
          editDistrict(
            para,
            res => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getAlldata();
            },
            () => {
              this.$message({
                message: "修改失败",
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
.managebox {
  .boxcontent{padding: 20px;}
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
  }
  // .el-date-editor.el-input,
  // .managebox .el-date-editor.el-input__inner {
  //   width: 200px;
  // }
  // .el-input__inner {
  //   width: 200px;
  // }
  .typebox {
    .el-input__inner {
      width: 180px;
    }
  }
  .remark2 {
    display: block;
    .el-textarea__inner {
      width: 330px;
    }
  }
  .yearbox {
    position: relative;
    width: 350px;
    margin-right: 10px;
    display: inline-block;
    .jiabtn {
      height: 32px;
      line-height: 32px;
      position: absolute;
      right: 0;
      top: 0;
      .icon {
        color: #666;
        font-size: 24px;
        display: inline-block;
        height: 32px;
        line-height: 32px;
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
.toolbtns0 {
  margin: 20px 0 30px;
}
.tableinfo .btn {
  color: #1890ff;
  background: transparent;
  border: 0;
  padding: 0 3px;
  margin: 0;
}
</style>