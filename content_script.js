// initMakeNoteHandler handles all the calls from background
// All the handlers needs to be registered here
function initMakeNoteHandler(){
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if(message.action === "make_note"){
            handleMakeNote()
        }else{
            console.log("No handlers registered for this action")
        }
    });
}

function handleMakeNote(){
    const selection = window.getSelection().toString();

}

// TODO:: Give option to take note on text selection
function textSelectEvent(){
    console.log("Event loaded")
    const p = document.body
    p.addEventListener('mouseup', (e) => {
        const selection = window.getSelection().toString();

        if (selection === '') {
            console.log('click');
        } else {
            console.log('selection', selection);
        }
    });
}

// textSelectEvent()
initMakeNoteHandler()