webpackJsonp([22],{lvPl:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});a("XLwt");var r=a("P9l9"),n=a("Kww8"),s=a.n(n);a("tcAE"),a("SwK5");var o={name:"changePwd",data:function(){var e=this;return{loginname:JSON.parse(this.$store.getters.userdata).logname,userid:JSON.parse(this.$store.getters.userdata).id,userinfo:JSON.parse(this.$store.getters.userdata),changeForm:{},addFormRules:{oldpwd:[{required:!0,message:"请输入旧密码",trigger:"change"}],newpwd:[{required:!0,message:"请输入新密码",trigger:"change"},{validator:function(t,a,r){a?a!==e.changeForm.oldpwd?r():r("不能与旧密码一样"):r("请输入新密码")}}],renewpwd:[{required:!0,message:"确认新密码",trigger:"change"},{validator:function(t,a,r){a?a!==e.changeForm.newpwd?r("两次输入密码不一致"):r():r("请确认新密码")}}]}}},created:function(){this.changeForm.username=this.loginname},methods:{submit:function(){var e=this;this.$refs.changeForm.validate(function(t){t&&e.$confirm("<span style='color:#f00;'>修改密码后需重新登录，</span>确认修改吗？","提示",{dangerouslyUseHTMLString:!0,type:"warning",center:!0,modal:!0,confirmButtonText:"确定",cancelButtonText:"取消"}).then(function(){var t={id:e.userid,logname:e.changeForm.username};t.oldPassword=s()(e.changeForm.oldpwd),t.newPassword=s()(e.changeForm.newpwd),Object(r.S)(t,function(t){"0"===t.data.code?(e.$message({message:"修改成功，请重新登录！",type:"success"}),Object(r.I)("",function(e){var t=e.data,a=t.code;t.msg;"0"===a&&(sessionStorage.removeItem("token"),location.reload())})):e.$message({message:t.data.msg,type:"error"})},function(){e.$message({message:"修改失败",type:"error"})})})})}}},c={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content-wrap changepsw"},[e._m(0),e._v(" "),a("div",{staticClass:"change"},[a("el-form",{ref:"changeForm",attrs:{"label-width":"120px",rules:e.addFormRules,model:e.changeForm}},[a("el-form-item",{attrs:{label:"用户名",prop:"username"}},[a("el-input",{model:{value:e.changeForm.username,callback:function(t){e.$set(e.changeForm,"username",t)},expression:"changeForm.username"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"旧密码",prop:"oldpwd"}},[a("el-input",{attrs:{type:"password"},model:{value:e.changeForm.oldpwd,callback:function(t){e.$set(e.changeForm,"oldpwd",t)},expression:"changeForm.oldpwd"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"新密码",prop:"newpwd"}},[a("el-input",{attrs:{type:"password"},model:{value:e.changeForm.newpwd,callback:function(t){e.$set(e.changeForm,"newpwd",t)},expression:"changeForm.newpwd"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"确认新密码",prop:"renewpwd"}},[a("el-input",{attrs:{type:"password"},model:{value:e.changeForm.renewpwd,callback:function(t){e.$set(e.changeForm,"renewpwd",t)},expression:"changeForm.renewpwd"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.submit("changeForm")}}},[e._v("确认修改")])],1)],1)],1)])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("p",{staticClass:"navtitle"},[t("span",[this._v("修改密码")])])}]};var i=a("VU/8")(o,c,!1,function(e){a("q7Qm")},"data-v-24b8f062",null);t.default=i.exports},q7Qm:function(e,t){}});
//# sourceMappingURL=22.2b845593120d9810d4fd.js.map