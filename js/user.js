$(function() {
  var currentPage = 1;
  var pageSize = 5;
  var currentId;
  var isDelete;
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        var htmlStr = template("tpl", info);
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
  $("tbody").on("click", ".btn", function() {
    $("#userModal").modal("show");
    currentId = $(this)
      .parent()
      .data("id");
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
  });
  $("#submitBtn").click(function() {
    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: "json",
      success: function(info) {
        if (info.success) {
          $("#userModal").modal("hide");
          render();
        }
      }
    });
  });
});
