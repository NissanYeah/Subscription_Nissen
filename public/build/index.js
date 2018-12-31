toastr.options = {
    positionClass: 'toast-top-right',
};


//呼叫QA效果
$(document).ready(function () {
    //隱藏要呼叫的div
    $('.hiring-detail').hide();
    //呼叫被隱藏的div
    $('.hiring-title').on('click', function () {
        $(this).next('.hiring-detail').slideToggle(400);
        $(this).find('.icon').toggleClass("transform-active");
        return false;
    });

});


//Client AJAX
$('#subscriptionButton').on('click', function () {
        var subscriptionAccount = $('#subscriptionAccount').val();
        if (subscriptionAccount == '') {
            toastr.info("請輸入帳號")
        }
        else{
            $.ajax({
                url: "/newaccount",
                dataType: "json",
                data:{"content":subscriptionAccount},
                method:"post",
                success:function(res){
                    console.log(res)
                    if(res.success){
                        toastr.info("訂閱成功");
                    }else{
                        toastr.info("帳號已存在");
                    }
                }
            });
        }
});





