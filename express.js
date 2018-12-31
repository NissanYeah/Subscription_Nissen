var express = require('express');
var app = express();
var engine = require('ejs-locals');
var bodyParser = require('body-parser');



// 連結firebase
var admin = require("firebase-admin");
var serviceAccount = require("./subscription-nissen-firebase-adminsdk-ozgkx-271c76c19d.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://subscription-nissen.firebaseio.com"
});

var fireData = admin.database();


//獲取已有帳號資訊
var connectTofirebase = fireData.ref("AccountData");
var allSubscribeData={};
var allAccount=[];
connectTofirebase.on("value", function (snapshot) {
    var data = snapshot.val();
    allSubscribeData = data;
    console.log(allSubscribeData);
        for (item in data) {
            allAccount.push(data[item].account);
        }


})

//獲取刪除資訊
var alldeletInfo={};
var connectTofirebaseDeletInfo = fireData.ref("DeleteInfo");
connectTofirebaseDeletInfo.on("value", function (snapshot) {
    var data = snapshot.val();
    alldeletInfo= data;
})
// fireData.ref('AccountData').push()

//設定ejs
app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');
//靜態路徑
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));





app.get('/', function (req, res) {
    res.render('index', {
        'css':'subscription',
        'js':'index',
        'title': ['學習心得', '閱讀筆記', '最新文章']
    })
});

app.get('/cancel', function (req, res) {
    res.render('cancel',{
        'css':'cancel',
        'js':'cancel',
    });
});

app.get('/admin', function (req, res) {
    res.render('admin',{
        'css':'admin' ,
        'js':'none',
        'allSubscribeData':allSubscribeData,
        'alldeletInfo':alldeletInfo,
    });
});





app.post('/newaccount', function (req, res) {
    var content = req.body.content; //note body是一個物件 
    var connectTofirebase = fireData.ref("AccountData").push();
    if(allAccount.indexOf(content) == -1){
        connectTofirebase.set({
            "account": content,
            "date": Date.now()
        }).then(function(){
            fireData.ref('AccountData').once('value',function(snapshot){
                res.send({
                    "success":true,
                    "result":snapshot.val(),
                    "message":"訂閱成功"
                });
            });
        });
    }
    
    else {
            res.send({
                "success":false,
                "message":"已存在該帳號"
            });
    }

})

app.post('/cancelaccount', function (req, res) {
            var content = req.body.content; //note body是一個物件 
            console.log(content)
            if(allAccount.indexOf(content) == -1){
                res.send({
                    "success":false,
                    "message":"不存在該帳號"
                });
            } else {
                for(var item in allSubscribeData){
                        var key=item;
                        if (allSubscribeData[item].account == content) {
                            var connectTofirebase = fireData.ref("DeleteInfo").push();
                            connectTofirebase.set({
                                "account": content,
                                "date": Date.now()
                            })
                            //取消訂閱的要求
                            var del_ref = admin.database().ref("AccountData/"+ key);
                            del_ref.remove().then(function(){
                                res.send({
                                "success":true,
                                "message":"取消訂閱成功"
                                });
                            });
                        }
                }
             }
});



var port = process.env.PORT || 8080; //如果前面是flase就會進入3000
app.listen(port);