function chat() {
    prompt("Posez n'importe quelle question :")
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