function chat() {
    if (!prompt("Posez n'importe quelle question :")){
        return
    }
    if (confirm("NegOmegaChatBot : Non.") === true) {
        chat()
    }
}

window.onload = function () {
    document.getElementById("NegOmegaChatBot").addEventListener(
        "mouseup",
        chat,
    );
}

// function executeCode(){
//     code = document.getElementsByTag("pre")[0].innerText
//     pyscript_element = document.createElement("py-script")
//     pyscript_element.innerText = code
//     document.getElementById("kruskal").append(pyscript_element)
// }