<template>
  <div>
    <el-dialog
      title="导入文件"
      :visible.sync="importdataVisible.visible"
      width="800px"
      @close="resetBtnFuc"
    >
      <div v-if="firstShow">
        <div class="importbox">
          <span class="num">1</span>
          <div class="con">
            <p class="tt">下载对应文件类型的模板</p>
            <div class="ts">
              <p>请下载【导入模板】，并按照模板填写后再上传</p>
            </div>
            <el-button type="primary" size="small" @click="downMoudle">下载模板</el-button>
          </div>
        </div>
        <div class="importbox">
          <span class="num">2</span>
          <div class="con">
            <p class="tt">导入文件</p>
            <div class="ts">
              <p>
                <i>·</i> 支持文件类型：xlsx
              </p>
              <p>
                <i>·</i> 支持所有基础字段的导入，不限制数据条数
              </p>
              <p>
                <i>·</i> 文件内字段不符合规则，整条数据不予导入
              </p>
              <p v-if="showYearbox">
                <i>·</i> 请选择年度后再上传文件
              </p>
            </div>
            <div class="yearbox" v-if="showYearbox">
              <p>
                <i>*</i> 年度：
              </p>
              <el-date-picker
                v-model="year"
                value-format="yyyy"
                type="year"
                placeholder="请选择年度"
                @change="hasYear"
                size="small"
              ></el-date-picker>
            </div>
            <el-upload
              v-if="upfileBtn"
              class="upload-demo"
              :action="importFileList"
              :on-success="dataSuccess"
              :file-list="fileList"
              :show-file-list="false"
              accept=".xls, .xlsx"
              :data="{year:year}"
              :before-upload="beforeUpload"
              :multiple="false"
              :limit="1"
              :auto-upload="true"
              ref="uploaddata"
            >
              <el-button size="small" type="primary" :disabled="updisabled">上传文件</el-button>
            </el-upload>
            <div class="filename" v-if="showFilename">
              <a class="name" href="javascript:;">{{filename}}</a>
              <el-upload
                class="re-upload"
                :action="importFileList"
                :show-file-list="false"
                accept=".xls, .xlsx"
                :data="{year:year}"
                :on-success="dataTwoSuccess"
                :before-upload="beforeUpload"
              >
                <a href="javascript:;">更新文件</a>
              </el-upload>
            </div>
            <p class="error" v-if="errorShow" :style="errorBg">文件解析失败，请查看导入规则并更新文件</p>
            <p class="success" v-if="successShow" :style="successBg">文件解析成功,3s后跳转到下一步</p>
          </div>
        </div>
      </div>
      <div class="nopassbox" v-if="nopassShow">
        <p class="tt1">
          文件上传成功。共
          <span>{{allNumber}}</span> 条数据，其中
          <span>{{successNumber}}</span> 条可成功导入。
        </p>
        <p class="tt2">
          发现以下
          <span>{{errorNumber}}</span> 条数据不符合要求，数据不会被导入
        </p>
        <el-table border :data="nopassList" highlight-current-row style="width: 100%;" height="400px">
          <el-table-column prop="rowNum" label="行号" width="80px"></el-table-column>
          <el-table-column prop="columnHead" label="列标题" width="160px"></el-table-column>
          <el-table-column prop="cellMessage" label="单元格内容"></el-table-column>
          <el-table-column prop="errorMessage" label="错误原因"></el-table-column>
        </el-table>
        <p class="error" v-if="errorReShow" :style="errorBg">文件解析失败，请更新文件</p>
        <p class="success" v-if="successReShow" :style="successBg">文件解析成功</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-upload
          v-if="updateBtnShow"
          class="re-upload"
          :data="{year:year}"
          :action="importFileList"
          :show-file-list="false"
          accept=".xls, .xlsx"
          :on-success="handleSigleSuccess"
          :before-upload="beforeUpload"
        >
          <a href="javascript:;">更新文件</a>
        </el-upload>

        <!-- <el-button
          size="small"
          type="primary"
          :disabled="sureImport"
          @click="showMessagePage"
          v-if="oneSure"
        >下一步</el-button>-->
        <el-button
          v-if="lastSure"
          size="small"
          type="primary"
          :disabled="sureImportLast"
          @click="sureImportData"
        >确定导入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { upfile, imgIp, importProjectList } from "../api/imgUrl";
import { defaturl } from "../api/apiUrl";
import {
  projectImportFileData,
  threePlanImportFileData,
  keyWorkImportFileData,
  keyAreaImportFileData,
  keyItemImportFileData,
  zhongWorkImportFileData
} from "../api/api";
export default {
  components: {},
  props: [
    "importdataVisible",
    "itemShow",
    "showYearbox",
    "upbtnDisabled",
    "importFileList"
  ],
  data() {
    return {
      userid: JSON.parse(this.$store.getters.userdata).id,
      updisabled: this.upbtnDisabled,
      fileList: [],
      errorBg: {
        backgroundImage: "url(" + require("../assets/jg.png") + ")"
      },
      successBg: {
        backgroundImage: "url(" + require("../assets/suc.png") + ")"
      },
      allNumber: 0, //总条数
      successNumber: 0, //成功的条数
      errorNumber: 0, //错误条数
      errorShow: false, //文件解析错误
      successShow: false, //文件解析成功
      upfile: "",
      imgIp: "",
      defaturl: "",
      importProjectList: "",
      // 首次导入显示提示模块
      firstShow: true,
      // 文件解析成功后显示
      nopassShow: false,
      // 更新文件按钮
      updateBtnShow: false,
      oneSure: true, //第一页面确定导入按钮显示
      lastSure: false, //第二页面确定导入按钮隐藏
      sureImport: true, //禁用状态，
      sureImportLast: true, //禁用状态
      haspassList: [], //成功数据列表
      nopassList: [], //错误数据列表
      errorReShow: false,
      successReShow: false,
      // 文件上传按钮
      upfileBtn: true,
      // 上传后显示文件名
      showFilename: false,
      filename: "",
      year: ""
    };
  },
  created() {
    this.upfile = upfile;
    this.imgIp = imgIp;
    this.defaturl = defaturl;
    this.importProjectList = importProjectList;
  },
  watch: {
    importdataVisible: function(newValue, oldValue) {
      this.$emit("update:importdataVisible", newValue);
    },
    upbtnDisabled: function(newValue, oldValue) {
      this.$emit("update:upbtnDisabled", newValue);
    }
  },
  methods: {
    // 点击确定导入，显示导入的数据信息
    showMessagePage() {
      this.firstShow = false;
      this.nopassShow = true;
      this.lastSure = true;
      this.oneSure = false;
      this.updateBtnShow = true;
      if (this.successNumber == 0) {
        this.sureImportLast = true;
      } else {
        this.sureImportLast = false;
      }
    },
    // 确定导入数据
    sureImportData() {
      this.importdataVisible.visible = false;
      // 重点项目
      if (this.itemShow == 1) {
        let para = {
          passList: this.haspassList,
          noPassList: this.nopassList
        };
        para = JSON.stringify(para);
        projectImportFileData(para, data => {
          this.$message({
            type: "success",
            message: "导入成功!"
          });
          this.$emit("getAllList-event");
          this.resetBtnFuc();
        });
      } else if (this.itemShow == 3) {
        //   三年行动计划
        let para = {
          passThreeList: this.haspassList,
          noPassList: this.nopassList,
          passList: [],
          year: this.year,
          typemodel: 1
        };
        para = JSON.stringify(para);
        threePlanImportFileData(para, data => {
          this.$message({
            type: "success",
            message: "导入成功!"
          });
          this.$emit("getAllList-event");
          this.resetBtnFuc();
        });
      } else if (this.itemShow == 4) {
        //   现场办公
        let para = {
          passThreeList: this.haspassList,
          noPassList: this.nopassList,
          passList: [],
          year: this.year,
          typemodel: 2
        };
        para = JSON.stringify(para);
        threePlanImportFileData(para, data => {
          this.$message({
            type: "success",
            message: "导入成功!"
          });
          this.$emit("getAllList-event");
          this.resetBtnFuc();
        });
      } else if (this.itemShow == 7) {
        //   重要工作
        let para = {
          passTripleWorkList: this.haspassList,
          noPassList: this.nopassList,
          year: this.year,
          userid: this.userid
        };
        para = JSON.stringify(para);
        keyWorkImportFileData(para, data => {
          this.$message({
            type: "success",
            message: "导入成功!"
          });
          this.$emit("getAllList-event");
          this.resetBtnFuc();
        });
      } else if (this.itemShow == 8) {
        //   重要片区
        let para = {
          passTripleAreaList: this.haspassList,
          noPassList: this.nopassList,
          year: this.year,
          userid: this.userid
        };
        para = JSON.stringify(para);
        keyAreaImportFileData(para, data => {
          this.$message({
            type: "success",
            message: "导入成功!"
          });
          this.$emit("getAllList-event");
          this.resetBtnFuc();
        });
      } else if (this.itemShow == 9) {
        //   重大项目
        let para = {
          importSituationList: this.haspassList,
          noPassList: this.nopassList,
          year: this.year,
          userid: this.userid
        };
        para = JSON.stringify(para);
        keyItemImportFileData(para, data => {
          this.$message({
            type: "success",
            message: "导入成功!"
          });
          this.$emit("getAllList-event");
          this.resetBtnFuc();
        });
      } else if (this.itemShow == 10) {
        //   重点工作
        let para = {
          passPointList: this.haspassList,
          noPassList: this.nopassList,
          year: this.year
        };
        para = JSON.stringify(para);
        zhongWorkImportFileData(para, data => {
          this.$message({
            type: "success",
            message: "导入成功!"
          });
          this.$emit("getAllList-event");
          this.resetBtnFuc();
        });
      }
    },
    // 下载模板
    downMoudle() {
      if (this.itemShow == 1) {
        window.open(this.defaturl + "/templateDownload/projectTemplateDown");
      } else if (this.itemShow == 3) {
        window.open(this.defaturl + "/templateDownload/threeTemplateDown");
      } else if (this.itemShow == 4) {
        window.open(this.defaturl + "/templateDownload/leaderTemplateDown");
      } else if (this.itemShow == 10) {
        window.open(this.defaturl + "/templateDownload/pointTemplateDown");
      } else if (this.itemShow == 7) {
        window.open(
          this.defaturl + "/templateDownload/tripleWorkImportTemplate"
        );
      } else if (this.itemShow == 8) {
        window.open(
          this.defaturl + "/templateDownload/tripleAreaImportTemplate"
        );
      } else if (this.itemShow == 9) {
        window.open(this.defaturl + "/templateDownload/importSituationDown");
      }
    },
    // 更新文件上传成功
    handleSigleSuccess(file) {
      if (file.code == -1) {
        this.errorReShow = true;
        this.successReShow = false;
        this.errorNumber = 0;
        this.successNumber = 0;
        this.sureImportLast = true;
        this.allNumber = 0;
        this.haspassList = [];
        this.nopassList = [];
      } else {
        this.errorReShow = false;
        this.successReShow = true;
        if (this.itemShow == 1) {
          this.haspassList = file.obj.passList;
        } else if (this.itemShow == 3 || this.itemShow == 4) {
          this.haspassList = file.obj.passThreeList;
        } else if (this.itemShow == 7) {
          this.haspassList = file.obj.passTripleWorkList;
        } else if (this.itemShow == 8) {
          this.haspassList = file.obj.passTripleAreaList;
        } else if (this.itemShow == 9) {
          this.haspassList = file.obj.importSituationList;
        } else if (this.itemShow == 10) {
          this.haspassList = file.obj.passPointList;
        }
        if (this.haspassList == null) {
          this.haspassList = [];
        }
        this.successNumber = this.haspassList.length;
        this.errorNumber = file.obj.noPassList.length;
        this.allNumber = this.errorNumber + this.successNumber;
        if (this.errorNumber == 0) {
          this.nopassList = [];
        } else {
          this.nopassList = file.obj.noPassList;
        }
        if (this.successNumber == 0) {
          this.sureImportLast = true;
        } else {
          this.sureImportLast = false;
        }
      }
    },
    // 第一个页面更新文件
    dataTwoSuccess(file, fileList) {
      this.filename = fileList.name;
      if (file.code == -1) {
        this.errorShow = true;
        this.successShow = false;
        this.sureImport = true;
        this.nopassList = [];
        this.haspassList = [];
        this.sureImportLast = true;
      } else {
        this.errorShow = false;
        this.successShow = true;
        this.sureImport = false;
        if (this.itemShow == 1) {
          this.haspassList = file.obj.passList;
        } else if (this.itemShow == 3 || this.itemShow == 4) {
          this.haspassList = file.obj.passThreeList;
        } else if (this.itemShow == 7) {
          this.haspassList = file.obj.passTripleWorkList;
        } else if (this.itemShow == 8) {
          this.haspassList = file.obj.passTripleAreaList;
        } else if (this.itemShow == 9) {
          this.haspassList = file.obj.importSituationList;
        } else if (this.itemShow == 10) {
          this.haspassList = file.obj.passPointList;
        }
        if (this.haspassList == null) {
          this.haspassList = [];
        }
        this.successNumber = this.haspassList.length;
        this.errorNumber = file.obj.noPassList.length;
        this.allNumber = this.errorNumber + this.successNumber;
        if (this.errorNumber == 0) {
          this.nopassList = [];
        } else {
          this.nopassList = file.obj.noPassList;
        }
        if (this.successNumber == 0) {
          this.sureImportLast = true;
        } else {
          this.sureImportLast = false;
        }
        setTimeout(() => {
          this.showMessagePage();
        }, 2000);
      }
    },
    // 文件上传成功
    dataSuccess(file, fileList) {
      this.filename = fileList.name;
      this.upfileBtn = false;
      this.showFilename = true;
      if (file.code == -1) {
        this.errorShow = true;
        this.successShow = false;
        this.sureImport = true;
        this.nopassList = [];
        this.haspassList = [];
      } else {
        this.errorShow = false;
        this.successShow = true;
        this.sureImport = false;
        if (this.itemShow == 1) {
          this.haspassList = file.obj.passList;
        } else if (this.itemShow == 3 || this.itemShow == 4) {
          this.haspassList = file.obj.passThreeList;
        } else if (this.itemShow == 7) {
          this.haspassList = file.obj.passTripleWorkList;
        } else if (this.itemShow == 8) {
          this.haspassList = file.obj.passTripleAreaList;
        } else if (this.itemShow == 9) {
          this.haspassList = file.obj.importSituationList;
        } else if (this.itemShow == 10) {
          this.haspassList = file.obj.passPointList;
        }
        if (this.haspassList == null) {
          this.haspassList = [];
        }
        this.successNumber = this.haspassList.length;
        this.errorNumber = file.obj.noPassList.length;
        this.allNumber = this.errorNumber + this.successNumber;
        if (this.errorNumber == 0) {
          this.nopassList = [];
        } else {
          this.nopassList = file.obj.noPassList;
        }
        setTimeout(() => {
          this.showMessagePage();
        }, 2000);
      }
    },
    // 上传之前判断文件类型
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      if (!extension && !extension2) {
        this.$message({
          message: "上传文件只能是 xls、xlsx格式!",
          type: "warning"
        });
      }
      return extension || extension2;
    },
    resetBtnFuc() {
      this.allNumber = 0;
      this.successNumber = 0;
      this.errorNumber = 0;
      this.errorShow = false;
      this.successShow = false;
      this.firstShow = true;
      this.nopassShow = false;
      this.updateBtnShow = false;
      this.oneSure = true;
      this.lastSure = false;
      this.sureImport = true;
      this.sureImportLast = true;
      this.haspassList = [];
      this.nopassList = [];
      this.errorReShow = false;
      this.successReShow = false;
      this.upfileBtn = true;
      this.showFilename = false;
    },
    hasYear() {
      this.updisabled = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.importbox {
  display: flex;
  margin-bottom: 15px;
  .yearbox {
    display: flex;
    align-items: center;
    margin-top: 15px;
    p {
      color: #333;
      font-size: 14px;
      i {
        color: #f00;
        font-style: normal;
        font-weight: bold;
        display: inline-block;
        margin-right: 2px;
      }
    }
  }
  .error {
    color: #f00;
    font-size: 14px;
    margin-top: 8px;
    padding-left: 24px;
    background-size: 20px auto;
    background-position: left center;
    background-repeat: no-repeat;
  }
  .success {
    color: #91d466;
    font-size: 14px;
    margin-top: 8px;
    padding-left: 24px;
    background-size: 20px auto;
    background-position: left center;
    background-repeat: no-repeat;
  }
  .num {
    display: block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #afd7fe;
    color: #333;
    font-size: 14px;
    text-align: center;
    line-height: 24px;
    flex-shrink: 0;
  }
  .con {
    padding-left: 6px;
    flex: 1;
    .el-form {
      margin-top: 15px;
      .el-form-item--mini.el-form-item,
      .el-form-item--small.el-form-item {
        margin-bottom: 5px;
      }
    }
    .el-button {
      margin-top: 10px;
    }
    .tt {
      color: #333;
      font-size: 14px;
      line-height: 24px;
      margin-bottom: 5px;
    }
    .ts {
      color: #999;
      font-size: 14px;
      line-height: 1.8;
      i {
        color: #99ccff;
        display: inline-block;
        margin-right: 2px;
      }
    }
  }
  .filename {
    display: flex;
    justify-content: space-between;
    background: #f4f4f4;
    padding: 5px 15px;
    margin-top: 10px;
    .name {
      color: #555;
      font-size: 14px;
    }
  }
}
.nopassbox {
  .error {
    color: #f00;
    font-size: 14px;
    margin-top: 8px;
    padding-left: 24px;
    background-size: 20px auto;
    background-position: left center;
    background-repeat: no-repeat;
  }
  .success {
    color: #91d466;
    font-size: 14px;
    margin-top: 8px;
    padding-left: 24px;
    background-size: 20px auto;
    background-position: left center;
    background-repeat: no-repeat;
  }
  .tt1 {
    color: #333;
    font-size: 14px;
    margin-bottom: 6px;
    span {
      font-weight: bold;
    }
  }
  .tt2 {
    color: #999;
    font-size: 14px;
    margin-bottom: 15px;
    span {
      font-weight: bold;
      color: #f00;
    }
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .re-upload {
    margin-right: 20px;
  }
}
</style>
