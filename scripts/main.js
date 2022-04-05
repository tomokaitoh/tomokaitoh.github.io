var articlePath = "./datas/articles/";
var parameters = {
    table : "index",
    page : 0,
    maxArticlesNum: 10
};


function openUrl(url){
    window.location.href = url;
}

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
    queryVariables = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        parameters[pair[0]] = parameters[pair[0]].constructor(pair[1]);
    }
}

function openArticle(id){
    alert(id);
}
function gotoPage(page){
    window.location.href = "http://" + window.location.host +"/?page=" + page;
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
    var contentFormat = 
        "<div class='articleDisplay' onclick=\"openArticle({id})\">"+
        "<b class='title'>{title}</b>"+
        "<p class='article'>{content}</p>"+
        "</div>";
    $.getJSON(articlePath + "summarize.json",function(data){
        var start = Math.min(data.length-1,parameters.page*parameters.maxArticlesNum);
        var end = Math.min(start+parameters.maxArticlesNum,data.length);
        for(var i= start;i<end;++i){
            container.innerHTML += formatString(contentFormat,data[i]);
        }
        separateArticlePages(data);
    });
}

