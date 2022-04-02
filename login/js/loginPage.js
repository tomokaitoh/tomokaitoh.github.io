function login(){
    alert("hello! " + document.getElementById("userName_input").value);
}

function register(){
    alert("hello! " + document.getElementById("userName_input").value);
}

function toRegister(){
    document.getElementById("window_title").innerHTML = "注册";
    document.getElementById("password2_lable").style.display = "inline-block";
    document.getElementById("password2_input").style.display = "inline-block";
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("registerButton").style.display = "block";
    document.getElementById("loginTip").style.display = "none";
    document.getElementById("registerTip").style.display = ""; 
}

function toLogin(){
    document.getElementById("window_title").innerHTML = "登录";
    document.getElementById("password2_lable").style.display = "none";
    document.getElementById("password2_input").style.display = "none";
    document.getElementById("registerButton").style.display = "none";
    document.getElementById("loginButton").style.display = "block";
    document.getElementById("loginTip").style.display = "";
    document.getElementById("registerTip").style.display = "none"; 
}

function toFindPassword(){

}