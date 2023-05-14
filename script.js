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