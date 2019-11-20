<template>
  <div class="keyfill">
    <p class="title">重点经济指标完成情况填报</p>
    <div>
      <div class="toolbar">
        <el-form :inline="true" :model="filters" ref="filters">
          <el-form-item label="时间：" prop="startyear">
            <el-date-picker
              v-model="filters.startyear"
              type="month"
              value-format="yyyy-MM-dd"
              placeholder="开始时间"
              @change="yearChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="--" prop="endyear">
            <el-date-picker
              v-model="filters.endyear"
              type="month"
              value-format="yyyy-MM-dd"
              placeholder="结束时间"
              @change="yearChange"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>

      <div class="list">
        <el-form :inline="true" label-width="250px" :model="fillForm" class="demo-form-inline">
          <el-form-item
            v-for="item in formItemList"
            :key="item.key"
            :label="item.name"
          >
            <el-input :value="item.value" @change="handleInput($event,item.key)" placeholder="请输入">
              <template slot="append">{{item.unit}}</template>
            </el-input>
          </el-form-item>
          <div class="btns">
            <el-form-item>
              <el-button @click="resetForm()">取消</el-button>
              <el-button type="primary" @click="onSubmit('fillForm')">提交</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { keyFill } from "../../api/targetApi2";
import { allIndexlist, yearIndexlist } from "../../api/targetApi";
export default {
  name: "streetRank",
  components: {},
  data() {
    return {
      filters: {},
      fillForm: {},
      formItemList: [],
      indexDatas: [],
      loginid: JSON.parse(this.$store.getters.userdata).id
    };
  },
  mounted() {},
  created() {
    this.getAlldata();
  },
  methods: {
    // 指标列表
    getAlldata() {
      allIndexlist("", data => {
        let datas = data.data.obj;
        this.formItemList = datas;
        for (var i = 0; i < datas.length; i++) {
          this.formItemList[i].key = "value" + i;
          this.formItemList[i].name = datas[i].name + "：";
          this.formItemList[i].value = "";
        }
        console.log(this.formItemList)
      });
    },
    yearChange() {
      console.log(this.filters);
      let para = this.filters;
      yearIndexlist(para, data => {
        let datas = data.data.obj;
        this.formItemList = datas;
        for (var i = 0; i < datas.length; i++) {
          this.formItemList[i].key = "value" + i;
          this.formItemList[i].name = datas[i].name + "：";
          this.formItemList[i].value = "";
        }
      });
    },
    handleInput(val, key) {
      for (var i = 0; i < this.formItemList.length; i++) {
        if (this.formItemList[i].key == key) {
          this.formItemList[i].value = val;
          break;
        }
      }
    },
    // 取消
    resetForm(formName) {
      this.formItemList = [];
      // this.$refs[formName].resetFields();
      this.getAlldata();
    },
    onSubmit() {
      console.log(this.formItemList);
      let obj = {};
      for (var i = 0; i < this.formItemList.length; i++) {
        obj.economicid = this.formItemList[i].id;
        obj.amount = this.formItemList[i].value;
        obj.startdate = this.formItemList[i].startyear;
        obj.enddate = this.formItemList[i].endyear;
        obj.isjnq = 0;
        obj.deptid = this.loginid;
        this.indexDatas.push(obj);
        obj = {};
      }
      console.log(this.indexDatas);

      let para = this.indexDatas;
      para = JSON.stringify(para);
      keyFill(para, data => {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        this.$router.push({ path: "/targetTabs" });
      });
    }
  }
};
</script>

<style lang="scss">
.keyfill {
  padding: 40px 20px;
  .title {
    color: #333;
    font-size: 16px;
    font-weight: bold;
    padding-left: 30px;
    font-family: "微软雅黑";
    margin-bottom: 40px;
  }
  .btns {
    border-top: 1px solid #eee;
    padding-top: 30px;
    margin-top: 100px;
    display: flex;
    justify-content: flex-end;
  }
  .list {
    .el-form--inline {
      .el-form-item {
        margin-right: 100px;
        .el-input-group__append {
          background: #fff;
          border: 0;
          padding: 0 8px;
          color: #222;
        }
      }
    }
  }
}
.keyfill {
  .toolbar {
    padding-left: 196px;
    margin-bottom: 0;
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 150px;
    }
  }
  .el-form--inline .el-form-item {
    margin-right: 5px;
  }
}
</style>
