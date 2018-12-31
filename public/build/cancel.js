
toastr.options = {
    positionClass: 'toast-top-right',
};

//Client AJAX

$('#cancelSubscriptionButton').on('click', function () {
    var cancelSubscriptionAccount = $('#cancelSubscriptionAccount').val();
    if (cancelSubscriptionAccount == '') {
        toastr.info("請輸入帳號");
    }
    else{
        $.ajax({
            url: "/cancelaccount",
            dataType: "json",
            data:{"content":cancelSubscriptionAccount},
            method:"post",
            success:function(res){
                console.log(res);
                if(res.success){
                    toastr.info("取消訂閱成功");
                }else{
                    toastr.info("不存在此帳號");
                }
            }
            });
    }
});





