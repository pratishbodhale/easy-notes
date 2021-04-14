// initMakeNoteHandler handles all the calls from background
// All the handlers needs to be registered here
function initMakeNoteHandler() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "make_note") {
            handleMakeNote()
            sendResponse(true)
        } else {
            console.log("No handlers registered for this action")
            sendResponse(false)
        }
    });
}

function persistNoteInStorage(tag, note, callback) {
    chrome.storage.local.get(['easy-note-data'], function (results) {
        notesData = results['easy-note-data']

        if(notesData[tag] === undefined){
            notesData[tag] = [note]
        }else{
            notesData[tag].push(note)
        }

        chrome.storage.local.set({'easy-note-data': notesData}, function () {
            if(callback !== undefined) {
                callback();
            }
        });
    });
}

// TODO: Save tags under another key in storage to optimise computation each time new note needs to be saved
function getTags(callback) {
    // TODO: Change local -> sync for accross devies sync
    chrome.storage.local.get(['easy-note-data'], function (result) {
        callback(Object.keys(result['easy-note-data']));
    });
}

function displayExistingTags(tags){
    var datalist = document.createElement('datalist');
    datalist.setAttribute("id", "en-tags-list");

    tags.forEach(tag => {
        var optionT = document.createElement('option');
        optionT.setAttribute("value", tag);
        datalist.appendChild(optionT);
    });

    container = document.getElementById("en-input-tag-container");
    container.appendChild(datalist);
}

function handleMakeNote() {
    const selection = window.getSelection();
    if (selection.toString() !== "") {
        
        var dateTimeNow = new Date();
        note = {
            dataString: selection.toString(),
            url: window.location.href,
            title: document.title,
            timeStamp: dateTimeNow.getTime()
        }

        //Get a the selected content, in a range object
        var range = selection.getRangeAt(0);

        //If the range spans some text, and inside a tag, set its css class.
        if (range && !selection.isCollapsed) {
            var input = document.createElement('input');
            input.setAttribute("id", "en-input-tag");
            input.setAttribute("list", "en-tags-list");
            
            var container = document.createElement('div');
            container.setAttribute("id", "en-input-tag-container");
            container.setAttribute("style", "position: absolute;margin-left: -30px;margin-top: -30px;");
            container.appendChild(input);
            range.insertNode(container);
            
            getTags(displayExistingTags);
            input.focus();

            input.addEventListener("keydown", function (event) {

                if (event.key === "Enter") {
                    // Cancel the default action, if needed
                    event.preventDefault();
                    persistNoteInStorage(input.value, note);
                    container.remove();
                }

                if (event.key === "Alt") {
                    event.preventDefault();
                    container.remove();
                }
            });
        }
    }
}

// TODO:: Give option to take note on text selection
function textSelectEvent() {
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