function openTab(evt, tabName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("sideBtn");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length+1; i++) {
        tablinks[i].className = tablinks[i].className.replace(" tab-selected", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " tab-selected";
}
function openFuncs(evt, tabName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("functsBtn");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("funcBtnLink");
    for (i = 0; i < x.length+1; i++) {
        tablinks[i].className = tablinks[i].className.replace(" button-selected", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " button-selected";
}

function clearChat() {
    document.getElementById('chatBox').innerHTML = ""
}