$(function() {
  var currentPage = 1;
  var pageSize = 3;
  var picArr = [];
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("productTpl", info);
        $("tbody").html(htmlStr);
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),

          onPageClicked: function(a, b, c, page) {
            currentPage = page;

            render();
          }
        });
      }
    });
  }
  $("#addBtn").click(function() {
    $("#addModal").modal("show");
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("dropdownTpl", info);
        $(".dropdown-menu").html(htmlStr);
      }
    });
  });
  $(".dropdown-menu").on("click", "a", function() {
    var txt = $(this).text();
    $("#dropdownText").text(txt);
    var id = $(this).data("id");
    $('[name="brandId"]').val(id);
    $("#form")
      .data("bootstrapValidator")
      .updateStatus("brandId", "VALID");
  });
  $("#fileupload").fileupload({
    dataType: "json",

    done: function(e, data) {
      console.log(data);
      var picObj = data.result;
      picArr.unshift(picObj);
      var picUrl = picObj.picAddr;
      $("#imgBox").prepend(
        '<img src="' + picUrl + '" style="width: 100px" alt="">'
      );

      if (picArr.length > 3) {
        picArr.pop();
        $("#imgBox img:last-of-type").remove();
      }
      if (picArr.length === 3) {
        $("#form")
          .data("bootstrapValidator")
          .updateStatus("picStatus", "VALID");
      }
      console.log(picArr);
    }
  });
  $("#form").bootstrapValidator({
    excluded: [],
    feedbackIcons: {
      valid: "glyphicon glyphicon-ok",
      invalid: "glyphicon glyphicon-remove",
      validating: "glyphicon glyphicon-refresh"
    },

    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },

          regexp: {
            regexp: /^[1-9]\d*$/, // 1   11    121
            message: "商品库存必须是非零开头的数字"
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: "尺码要求必须是 xx-xx 的格式, xx为两位数字"
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传 3 张图片"
          }
        }
      }
    }
  });
  $("#form").on("success.form.bv", function(e) {
    e.preventDefault();
    var paramsStr = $("#form").serialize();
    paramsStr += "&picArr=" + JSON.stringify(picArr);
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: paramsStr,
      dataType: "json",
      success: function(info) {
        if (info.success) {
          $("#addModal").modal("hide");
          currentPage = 1;
          render();
          $("#form")
            .data("bootstrapValidator")
            .resetForm(true);
          $("#dropdownText").text("请选择二级分类");
          $("#imgBox img").remove();
          picArr = [];
        }
      }
    });
  });
});
