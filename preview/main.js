const channel = new BroadcastChannel("editor-channel");

channel.addEventListener("message", ({data}) => {
    console.log(data.action, data.payload)

    switch(data.action) {
        case "SETUP": {
            setup(data.payload)
            break;
        }
        case "UPDATE_TITLE": {
            updateTitle(data.payload.title)
            break
        }
        case "UPDATE_PREVIEW": {
            updateHTML(data.payload.html)
            break
        }
    }
});

function setup({title, html = ""}){
    updateTitle(title);
    updateHTML(html);
}

function updateTitle(title){
    document.title = `${title} | Preview`;
}

function updateHTML(html){
    document.body.innerHTML = html
}

function init(){
    channel.postMessage({action: "INIT"})
}

init()

console.log("Preview 🎨")