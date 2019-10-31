/*!
 * we-validator
 * version: 2.1.10
 * address: https://github.com/ChanceYu/we-validator#readme
 * author:  ChanceYu <i.fish@foxmail.com>
 * license: MIT
 */
! function(root, factory) {
  "object" == typeof exports && "object" == typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define("WeValidator", [], factory) : "object" == typeof exports ? exports.WeValidator = factory() : root.WeValidator = factory()
}("undefined" != typeof self ? self : this, function() {
  return function(modules) {
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) return installedModules[moduleId].exports;
      var module = installedModules[moduleId] = {
        i: moduleId,
        l: !1,
        exports: {}
      };
      return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), module.l = !0, module.exports
    }
    var installedModules = {};
    return __webpack_require__.m = modules, __webpack_require__.c = installedModules, __webpack_require__.d = function(exports, name, getter) {
      __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
        configurable: !1,
        enumerable: !0,
        get: getter
      })
    }, __webpack_require__.n = function(module) {
      var getter = module && module.__esModule ? function() {
        return module.default
      } : function() {
        return module
      };
      return __webpack_require__.d(getter, "a", getter), getter
    }, __webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property)
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 0)
  }([function(module, exports, __webpack_require__) {
    "use strict";

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function")
    }
    var _createClass = function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor)
          }
        }
        return function(Constructor, protoProps, staticProps) {
          return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor
        }
      }(),
      _rules = __webpack_require__(1),
      _rules2 = function(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        }
      }(_rules),
      requiredFn = _rules2.default.required.rule,
      isWx = "undefined" != typeof wx && !!wx.showToast,
      isMy = "undefined" != typeof my && !!my.showToast,
      isSwan = "undefined" != typeof swan && !!swan.showToast,
      isTt = "undefined" != typeof tt && !!tt.showToast,
      isBrowser = "undefined" != typeof window && !!window.alert,
      objString = Object.prototype.toString,
      isArray = Array.isArray || function(v) {
        return "[object Array]" === objString.call(v)
      },
      isFunction = function(v) {
        return "[object Function]" === objString.call(v)
      },
      isRegExp = function(v) {
        return "[object RegExp]" === objString.call(v)
      },
      WeValidator = function() {
        function WeValidator() {
          var options = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          _classCallCheck(this, WeValidator), this.options = options, this.required = requiredFn, this._checkAllRules()
        }
        return _createClass(WeValidator, [{
          key: "_showErrorMessage",
          value: function(params, onMessage) {
            return isFunction(onMessage) ? onMessage(params) : isFunction(this.options.onMessage) ? this.options.onMessage(params) : isFunction(WeValidator.onMessage) ? WeValidator.onMessage(params) : isWx ? wx.showToast({
              title: params.msg,
              icon: "none"
            }) : isMy ? my.showToast({
              content: params.msg,
              type: "none"
            }) : isSwan ? swan.showToast({
              title: params.msg,
              icon: "none"
            }) : isTt ? tt.showToast({
              title: params.msg,
              icon: "none"
            }) : void(isBrowser && alert(params.msg))
          }
        }, {
          key: "_getErrorMessage",
          value: function(ruleName, attr, param) {
            var messages = this.options.messages,
              defaultMessage = WeValidator.RULES[ruleName].message;
            if (messages.hasOwnProperty(attr) && messages[attr][ruleName] && (defaultMessage = messages[attr][ruleName]), defaultMessage) return defaultMessage = defaultMessage.replace(/\{(\d)\}/g, function($0, $1) {
              return isArray(param) ? param[$1] : param
            })
          }
        }, {
          key: "_isRuleInvalid",
          value: function(ruleName, attr) {
            if (!WeValidator.RULES.hasOwnProperty(ruleName)) return console.warn && console.warn("没有此验证规则：" + ruleName + "，字段：" + attr), !0
          }
        }, {
          key: "_checkAllRules",
          value: function() {
            var _rules_ = this.options.rules;
            for (var attr in _rules_)
              for (var ruleName in _rules_[attr]) this._isRuleInvalid(ruleName, attr)
          }
        }, {
          key: "checkData",
          value: function(data, onMessage) {
            var showMessage = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
              fieldMap = arguments[3],
              _rules_ = this.options.rules,
              multiCheck = this.options.multiCheck,
              hasError = !1,
              errorData = {};
            this.data = data;
            for (var attr in _rules_)
              if (!fieldMap || fieldMap.hasOwnProperty(attr))
                for (var ruleName in _rules_[attr])
                  if (!this._isRuleInvalid(ruleName, attr)) {
                    if (fieldMap) {
                      var res = fieldMap[attr];
                      if (isArray(res) && -1 === res.indexOf(ruleName)) continue
                    }
                    var ruleParam = _rules_[attr][ruleName],
                      value = "";
                    data.hasOwnProperty(attr) && (value = data[attr]), isFunction(ruleParam) && (ruleParam = ruleParam.call(this, value));
                    var isFieldValid = WeValidator.checkValue.call(this, ruleName, value, ruleParam, !0);
                    if (!isFieldValid) {
                      hasError = !0;
                      var msg = this._getErrorMessage(ruleName, attr, ruleParam),
                        errorParam = null;
                      if (showMessage && msg && (errorParam = {
                          name: attr,
                          value: value,
                          param: ruleParam,
                          rule: ruleName,
                          msg: msg
                        }, errorData[attr] = errorParam), !multiCheck) return errorParam && this._showErrorMessage(errorParam, onMessage), !1
                    }
                  }
            return !hasError || (multiCheck && showMessage && this._showErrorMessage(errorData, onMessage), !1)
          }
        }, {
          key: "checkFields",
          value: function(data, fields, onMessage) {
            var showMessage = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3];
            if (!isArray(fields)) throw new Error("第二个参数须为数组");
            var fieldMap = {};
            return fields.forEach(function(item) {
              var arr = item.split(":"),
                field = arr[0],
                rules = arr[1];
              rules ? (rules = rules.split(","), fieldMap[field] = rules) : fieldMap[field] = !0
            }), this.checkData(data, onMessage, showMessage, fieldMap)
          }
        }, {
          key: "isValid",
          value: function(data, fields) {
            return isArray(fields) ? this.checkFields(data, fields, null, !1) : this.checkData(data, null, !1)
          }
        }, {
          key: "addRules",
          value: function() {
            var options = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            Object.assign(this.options.rules, options.rules || {}), Object.assign(this.options.messages, options.messages || {}), this._checkAllRules()
          }
        }, {
          key: "removeRules",
          value: function(fields) {
            if (!isArray(fields)) throw new Error("参数须为数组");
            for (var i = 0; i < fields.length; i++) {
              var key = fields[i];
              delete this.options.rules[key]
            }
          }
        }]), WeValidator
      }();
    WeValidator.RULES = {}, WeValidator.addRule = function(ruleName, ruleOption) {
      WeValidator.RULES[ruleName] = ruleOption
    }, WeValidator.checkValue = function(ruleName, value, param, skip) {
      var rule = WeValidator.RULES[ruleName].rule;
      return isRegExp(rule) ? skip ? !requiredFn(value) || rule.test(value) : rule.test(value) : isFunction(rule) ? "required" === ruleName ? requiredFn(value) : skip ? !requiredFn(value) || rule.call(this, value, param) : rule.call(this, value, param) : void 0
    }, WeValidator.RULES = _rules2.default, WeValidator.required = requiredFn, module.exports = WeValidator
  }, function(module, exports, __webpack_require__) {
    "use strict";
    module.exports = {
      required: {
        message: "此字段必填",
        rule: function(value) {
          if ("number" == typeof value) value = value.toString();
          else if ("boolean" == typeof value) return !0;
          return !!(value && value.length > 0)
        }
      },
      pattern: {
        message: "不符合此验证规则",
        rule: function(value, param) {
          return param.test(value)
        }
      },
      email: {
        message: "请输入有效的电子邮件地址",
        rule: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      },
      mobile: {
        message: "请输入11位的手机号码",
        rule: /^1[345789]\d{9}$/
      },
      tel: {
        message: "请输入座机号",
        rule: /^(\d{3,4}-)?\d{7,8}$/
      },
      url: {
        message: "请输入有效的网址",
        rule: /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i
      },
      idcard: {
        message: "请输入18位的有效身份证",
        rule: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
      },
      equalTo: {
        message: "输入值必须和字段 {0} 相同",
        rule: function(value, param) {
          return value === this.data[param]
        }
      },
      notEqualTo: {
        message: "输入值不能和字段 {0} 相同",
        rule: function(value, param) {
          return value !== this.data[param]
        }
      },
      contains: {
        message: "输入值必须包含 {0}",
        rule: function(value, param) {
          return value.indexOf(param) > -1
        }
      },
      notContains: {
        message: "输入值不能包含 {0}",
        rule: function(value, param) {
          return -1 === value.indexOf(param)
        }
      },
      length: {
        message: "请输入 {0} 个字符",
        rule: function(value, param) {
          return value.length == param
        }
      },
      minlength: {
        message: "最少要输入 {0} 个字符",
        rule: function(value, param) {
          return value.length >= param
        }
      },
      maxlength: {
        message: "最多可以输入 {0} 个字符",
        rule: function(value, param) {
          return value.length <= param
        }
      },
      rangelength: {
        message: "请输入长度在 {0} 到 {1} 之间的字符",
        rule: function(value, param) {
          return value.length >= param[0] && value.length <= param[1]
        }
      },
      number: {
        message: "请输入有效的数字",
        rule: /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
      },
      digits: {
        message: "只能输入正整数数字",
        rule: /^\d+$/
      },
      integer: {
        message: "只能输入整数数字",
        rule: /^-?\d+$/
      },
      min: {
        message: "请输入大于 {0} 的数字",
        rule: function(value, param) {
          return "string" == typeof param && (param = this.data[param]), value >= param
        }
      },
      max: {
        message: "请输入小于 {0} 的数字",
        rule: function(value, param) {
          return "string" == typeof param && (param = this.data[param]), value <= param
        }
      },
      range: {
        message: "请输入大于 {0} 且小于 {1} 的数字",
        rule: function(value, param) {
          return value >= param[0] && value <= param[1]
        }
      },
      chinese: {
        message: "只能输入中文字符",
        rule: /^[\u4e00-\u9fa5]+$/
      },
      minChinese: {
        message: "最少输入 {0} 个中文字符",
        rule: function(value, param) {
          return new RegExp("^[一-龥]{" + param + ",}$").test(value)
        }
      },
      maxChinese: {
        message: "最多输入 {0} 个中文字符",
        rule: function(value, param) {
          return new RegExp("^[一-龥]{1," + param + "}$").test(value)
        }
      },
      rangeChinese: {
        message: "只能输入 {0} 到 {1} 个中文字符",
        rule: function(value, param) {
          return new RegExp("^[一-龥]{" + param[0] + "," + param[1] + "}$").test(value)
        }
      },
      date: {
        message: "请输入有效的日期",
        rule: function(value) {
          return !/Invalid|NaN/.test(new Date(value).toString())
        }
      },
      dateISO: {
        message: "请输入有效的日期（ISO标准格式）",
        rule: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
      },
      ipv4: {
        message: "请输入有效的IPv4地址",
        rule: /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i
      },
      ipv6: {
        message: "请输入有效的IPv6地址",
        rule: /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i
      }
    }
  }])
});