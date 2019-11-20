<template>
  <div class="decision">
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters" ref="filters">
          <el-form-item label="年度：" prop="year" class="ww1">
            <el-select v-model="filters.year" clearable placeholder="全部">
              <el-option v-for="item in years" :key="item.id" :label="item.year" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目任务：" prop="task" class="ww2">
            <el-input v-model="filters.task" placeholder="请输入" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="牵头区领导：" prop="name" class="ww1">
            <el-select v-model="filters.name" clearable placeholder="全部">
              <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="status" class="ww1">
            <el-select v-model="filters.status" clearable placeholder="全部">
              <el-option
                v-for="item in statuss"
                :key="item.id"
                :label="item.status"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDatas('filters')" type="primary">搜 索</el-button>
            <el-button @click="resetForm('filters')">重 置</el-button>
          </el-form-item>
          <div class="toolbtns">
            <el-button type="primary" @click="handleAdd">新 增</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <el-table
      class="tableinfo"
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
      :cell-class-name="cellClassName"
    >
      <el-table-column prop="grade" label="等级" width="80"></el-table-column>
      <el-table-column prop="bigitem" label="大项" width="150"></el-table-column>
      <el-table-column prop="sitem" label="小项" width="150"></el-table-column>
      <el-table-column prop="task" label="目标任务"></el-table-column>
      <el-table-column prop="leadername" label="牵头区领导" width="120"></el-table-column>
      <el-table-column prop="unit1" label="牵头单位" width="120"></el-table-column>
      <el-table-column prop="unit2" label="承办单位" width="120"></el-table-column>
      <el-table-column prop="unit3" label="市级考评牵头单位" width="120"></el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
          <i class="fa mark"></i>
          <span v-html="statusFormat(scope,scope.row.status)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="edit" label="操作" width="120">
        <template scope="scope">
          <el-button class="btn" size="small" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
          <el-button class="btn" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 40, 50]"
      :page-size="10"
      layout="prev, pager, next, total, sizes, jumper"
      :total="400"
    ></el-pagination>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      filters: { year: 1 },
      currentPage: 2,
      years: [
        { id: 1, year: "2019" },
        { id: 2, year: "2018" },
        { id: 3, year: "2017" }
      ],
      users: [
        { id: 1, name: "刘磊" },
        { id: 2, name: "王珊" },
        { id: 3, name: "张三" }
      ],
      statuss: [
        { id: 1, status: "延期" },
        { id: 2, status: "正常" },
        { id: 3, status: "预警" }
      ],
      tableData: [
        {
          grade: "省",
          bigitem: "就业促进工程",
          sitem: "促进城乡劳动者就业创业",
          task: "城镇新增就业14829人",
          leadername: "张三",
          unit1: "区人社局",
          unit2: "各街道",
          unit3: "市人社局",
          status: 0
        },
        {
          grade: "省",
          bigitem: "就业促进工程",
          sitem: "促进城乡劳动者就业创业",
          task: "城镇视野人员再就业6816人",
          leadername: "张三",
          unit1: "区人社局",
          unit2: "各街道",
          unit3: "市人社局",
          status: 0
        },
        {
          grade: "省",
          bigitem: "就业促进工程",
          sitem: "促进城乡劳动者就业创业",
          task: "劳务品牌培训180人",
          leadername: "张三",
          unit1: "区人社局",
          unit2: "各街道",
          unit3: "市人社局",
          status: 0
        },
        {
          grade: "省",
          bigitem: "扶贫解困工程",
          sitem: "帮扶下岗失业人员再就业",
          task: "下岗失业人员再就业155人",
          leadername: "张三",
          unit1: "区总工会",
          unit2: "各街道",
          unit3: "市总工会",
          status: 0
        },
        {
          grade: "省",
          bigitem: "就业促进工程",
          sitem: "帮扶下岗失业人员再就业",
          task: "青年劳动者技能培训1530人",
          leadername: "张三",
          unit1: "区总工会",
          unit2: "各街道",
          unit3: "市总工会",
          status: 1
        },
        {
          grade: "省",
          bigitem: "就业促进工程",
          sitem: "扶持城乡残疾人居家灵活就业",
          task: "城乡残疾人居家灵活就业700人",
          leadername: "张三",
          unit1: "区残联",
          unit2: "各街道",
          unit3: "市残联",
          status: 1
        },
        {
          grade: "市",
          bigitem: "扶贫解困工程",
          sitem: "法律援助",
          task: "办理法律援助案件170人",
          leadername: "张三",
          unit1: "区司法局",
          unit2: "各街道",
          unit3: "市残联",
          status: 2
        },
        {
          grade: "市",
          bigitem: "扶贫解困工程",
          sitem: "法律援助",
          task: "办理法律援助案件170人",
          leadername: "张三",
          unit1: "工程部",
          unit2: "各街道",
          unit3: "市人社局",
          status: 2
        }
      ],
      column_row_offset: {
        grade: [6, 2],
        bigitem: [6, 2],
        sitem: [3, 2, 1, 1, 1],
        task: [1, 1, 1, 1, 1, 1, 1, 1],
        leadername: [1, 1, 1, 1, 1, 1, 1, 1],
        unit1: [3, 2, 1, 1, 1],
        unit2: [1, 1, 1, 1, 1, 1, 1, 1],
        unit3: [3, 2, 1, 1, 1],
        status: [1, 1, 1, 1, 1, 1, 1, 1],
        edit: [1, 1, 1, 1, 1, 1, 1, 1]
      },
      now_col_row_num: {},
      now_col_offset: {}
    };
  },
  methods: {
    // 状态
    statusFormat(scope, value) {
      switch (value) {
        case 0:
          return "正常";
          break;
        case 1:
          return "预警";
          break;
        case 2:
          return "延期";
          break;
        case 3:
          return "完结";
          break;
      }
    },
    // 不同状态标识
    cellClassName({ row, column, rowIndex }) {
      let status = row.status;
      switch (status) {
        case 1:
          return "yellow";
          break;
        case 2:
          return "red";
          break;
        case 3:
          return "gray";
          break;
          return "";
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!this.now_col_row_num[column.property]) {
        this.now_col_row_num[column.property] = Object.assign(
          [],
          this.column_row_offset[column.property]
        );
        let a = this.now_col_row_num[column.property].shift();
        this.now_col_offset[column.property] = a;
        return {
          rowspan: a,
          colspan: 1
        };
      } else if (rowIndex >= this.now_col_offset[column.property]) {
        let a = this.now_col_row_num[column.property].shift();
        this.now_col_offset[column.property] += a;
        return {
          rowspan: a,
          colspan: 1
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    },
    // 搜索
    getDatas: function() {
      let para = this.filters;
      console.log(para);
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.filters.year = "";
    },
    // 详情
    handleDetail: function(index, row) {},
    // 编辑
    handleEdit: function(index, row) {},
    // 新增
    handleAdd: function() {}
  }
};
</script>

<style lang="scss">
.tableinfo {
  td {
    .mark {
      width: 6px;
      height: 6px;
      background: #00a854;
      border-radius: 50%;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .red {
    .mark {
      background: #f00;
    }
  }
  .yellow {
    .mark {
      background: #f7d007;
    }
  }
  .gray {
    .mark {
      background: #aaa;
    }
  }
  .unit-item {
    p {
      color: #1890ff;
      cursor: pointer;
    }
  }
}
</style>

