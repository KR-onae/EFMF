EFMF.settings.css = false
ifUsingnew = ``
ifnoUsingnew = `<h2>`
miniTitle = function(element, text) {
    element.setAttribute("open", element.getAttribute("open") == "true" ? "false" : "true")
    element.innerHTML = element.getAttribute("open") == "true" ? text : "..."
}
