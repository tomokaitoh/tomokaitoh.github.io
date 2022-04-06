var articlePath = "/datas/articles/";
var dataPath = "/datas/";
var parameters = {
    table : "index",
    page : 0,
    maxArticlesNum: 12,
    article: 0,
    markdown: true
};

function formatString(){
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    if(typeof arguments[1] == "object" && arguments.length == 2){
        var arr = arguments[1];
        for (let key in arr) {
            var re = new RegExp('\\{' + key + '\\}', 'gm');
            str = str.replace(re,arr[key]);
        }
        return str;
    }
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

function getQueryVariables(){
    if(location.search.length <= 1) return;
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] in parameters)
            parameters[pair[0]] = parameters[pair[0]].constructor(pair[1]);
    }
}

function getElementAbsYPos(e) {
    var t = e.offsetTop;
    while(e = e.offsetParent)
        t += e.offsetTop;
    return t;
}


function diffTimeStr(oldTimeStr){
    var nowTime = new Date(); //新建一个日期对象，默认现在的时间
    var oldTime = new Date(oldTimeStr);
	var difftime = (nowTime - oldTime)/1000; //计算时间差,并把毫秒转换成秒
	
	var days = parseInt(difftime/86400); // 天  24*60*60*1000 
   	var hours = parseInt(difftime/3600)-24*days;    // 小时 60*60 总小时数-过去的小时数=现在的小时数 
   	var minutes = parseInt(difftime%3600/60); // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
   	//var seconds = parseInt(difftime%60);  // 以60秒为一整份 取余 剩下秒数
   	
   	return days+"天"+hours+"小时"+minutes+"分钟";		
}


function openArticle(id){
    window.location.href = "http://" + window.location.host +"/?table=article&article=" + id;
}



function getArticle(){
    document.getElementById("article").style.display = "block";
    var path = articlePath + parameters.article + ".md";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var text = this.responseText;
            handleArticle(text);
        }
        else if(this.status == 404){
            document.getElementById("windowTitle").innerHTML = window.location.host + path;
            document.getElementById("article").innerHTML = "404 File Not Found..."
        }
    };
    xhttp.open("GET", path, true);
    xhttp.send();
}



function handleArticle(text){
    var titleEnd = text.indexOf("\n");
    if(titleEnd != -1) 
        document.getElementById("windowTitle").innerHTML = text.substring(0,titleEnd);
    text = text.substring(titleEnd+1);
    if(parameters.markdown)
        text = marked.parse(text);
    else{
        text = text.replace(RegExp("\n","g"),"<br/>");
    }
    document.getElementById("article").innerHTML = text;
    getNavigation();
}



function gotoPage(page){
    window.location.href = "http://" + window.location.host +"/?page=" + page;
}


function navigateTo(id){
    var element = document.getElementById(id);
    window.scrollTo({
        left:0,
        top:getElementAbsYPos(element) -50,
        behavior:"smooth"
    });
    element.style.animation = "twinkleAni 1.5s";
    var deleteAni = function(){
        $(this).css("animation","");
        element.removeEventListener("animationend",deleteAni);
    }
    element.addEventListener("animationend",deleteAni);
}


function separateArticlePages(data){
    var container = document.getElementById("pageSelecter");
    var contentFormat = "<button class=\"page\" onclick=\"gotoPage({0});\">{1}</button>";
    var pageNum = parseInt(data.length / parameters.maxArticlesNum);
    if(pageNum == 0) return;
    if(parameters.page != 0) container.innerHTML += formatString(contentFormat,parameters.page-1,"上一页");
    for(var i=0;i<=pageNum;++i){
        container.innerHTML += formatString(contentFormat,i,i);
        if(i==parameters.page)  container.lastChild.style = "border:none;";
    }
    if(parameters.page != pageNum) container.innerHTML += formatString(contentFormat,parameters.page+1,"下一页");
}


function getArticleSummarize(){
    var container = document.getElementById("articleContainer");
    var navigationContainer = document.getElementById("navigation");
    var contentFormat = 
        "<div class='articleDisplay' onclick=\"openArticle({id});\">"+
        "<b class='articleDisplay title' id=\"title{id}\">{title}</b>"+
        "<p class='article'>{content}</p>"+
        "<p class='article'><b>{time}</b></p>"+
        "</div>";
    //傻逼jquery, 默认异步执行getJson,在这卡了半天...
    $.ajaxSettings.async = false;
    $.getJSON(articlePath + "summarize.json",function(data){
        var start = Math.min(data.length-1,parameters.page*parameters.maxArticlesNum);
        var end = Math.min(start+parameters.maxArticlesNum,data.length);
        for(var i= start;i<end;++i)
            container.innerHTML += formatString(contentFormat,data[i]);
        separateArticlePages(data);
    });
}


function getNavigation(){
    var navigationContainer = document.getElementById("navigation");
    navigationContainer.innerHTML = "";
    var contentFormat = "<b class='title' onclick='navigateTo(\"{0}\");'>{1}</b>";
    if(parameters.table=="index"){
        $(".articleDisplay .title").each(function(){
            navigationContainer.innerHTML += formatString(contentFormat,this.id,this.innerHTML);
        });
    }
    else if(parameters.table=="article"){
        $("h1,h2,h3").each(function(){
            navigationContainer.innerHTML += formatString(contentFormat,this.id,this.innerHTML);
            if(this.tagName == "H2") 
                navigationContainer.lastChild.style = "margin-left:15%;border-width:3px;";
            else if(this.tagName == "H3")
                navigationContainer.lastChild.style = "margin-left:20%;border-width:2px;";
        });
    }
}


function getUserInfo(){
    $.ajaxSettings.async = false;
    var container = document.getElementById("personalIntroduce");
    $.getJSON(dataPath + "userInfo.json",function(data){
        container.children[0].src = data['background'];
        container.children[1].src = data['headIcon'];
        container.children[2].innerHTML = data['name'] + " <b class=\"tag\">"+ data['tag'] +"</b>"
        container.children[3].innerHTML = data['sign'];
        container.children[4].innerHTML = "已注册 " + diffTimeStr(data['registerTime']);
    });
}