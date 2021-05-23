const channel = new BroadcastChannel("editor-channel");

channel.addEventListener("message", ({data}) => {
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
            updatePreview(data.payload)
            break
        }
    }
});

function setup({title, html = "", assets = []}){
    updateTitle(title);
    updatePreview({html, assets});
}

function updateTitle(title){
    document.title = `${title} | Preview`;
}

function updateHTML(html){
    document.body.innerHTML = html
}

function updateAssets(assets){
    assets.forEach(({id, link}) => {
        let doesAssetAlreadyExists = document.getElementById(id);

        if(!doesAssetAlreadyExists){
            loadCss(id, link)
        }
    });

    let list = [...document.querySelectorAll(`[id*="editor-asset-link"]`)]

    let assetIdList = assets.map(({id}) => id);

    list.forEach((listElement) => {
        if(!assetIdList.includes(listElement.id)) listElement.remove();
    });
}

function loadCss(id, linkHref){

    const head = document.getElementsByTagName('HEAD')[0]; 

    const link = document.createElement('link');

    link.id = id;

    link.rel = 'stylesheet'; 
  
    link.type = 'text/css';
  
    link.href = linkHref; 

    head.appendChild(link); 

    return link;
}

function updatePreview({html = "", assets = []}){
    updateAssets(assets);
    updateHTML(html);
}

function init(){
    channel.postMessage({action: "INIT"})
}

init()

console.log("Preview 🎨")