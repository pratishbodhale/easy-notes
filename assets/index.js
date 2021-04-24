function classForTag(tag){
    return tag.toLowerCase().replace(" ", "_")
}

function displayTagsIndex(tags){
    checkbox_container = $("#checkbox-container");
    
    all_checkbox = $('<div class="form-check form-check-inline">\
        <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" data-filter="all_elements" checked="true">\
        <label class="form-check-label" for="inlineCheckbox1">all</label>\
    </div>')
    checkbox_container.append(all_checkbox);

    tags.forEach(tag => {
        var checkbox = $('<div class="form-check form-check-inline">\
        <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" data-filter="'+classForTag(tag)+'">\
        <label class="form-check-label" for="inlineCheckbox1">'+tag+'</label>\
    </div>');
        checkbox_container.append(checkbox);
    });
}

// TODO: Needs to be optimised for larger number of notes; Lazy loading
function displayNotesIndex(notes){
    notes_container = $("#notes-container");

    var idx = 0;
    for(title in notes){
        var note_id = "note-"+idx.toString();
        var note_data = "";
        var title_tags = [];

        notes[title].forEach((note) => {
            note_data += '<div class="card" style="width: 100%">\
            <div class="card-body">\
              <p class="card-text">'+note.dataString+' <span class="badge bg-warning text-dark note-tag">'+note.tag+'</span> </p>\
            </div>\
          </div>';

          title_tags.indexOf(classForTag(note.tag)) === -1 ? title_tags.push(classForTag(note.tag)): nil;
        })
        var note_elem = $('<div class="note-area mb-2" data-filter="'+title_tags.join(" ")+'">\
        <div>\
          <button class="btn btn-light collapsible-button" type="button" data-bs-toggle="collapse" data-bs-target="#'+note_id+'" aria-expanded="false" aria-controls="'+note_id+'" >\
            '+title+' <a href="'+notes[title][0].url+'"><i class="bi bi-arrow-up-right"></i></a>\
          </button>\
        </div>\
        <div class="collapse" id="'+note_id+'">\
          <div class="card card-body">\
            '+note_data+'\
          </div>\
        </div>\
      </div>'
        );

        notes_container.append(note_elem);
        idx++;
    }
    
}

function getTags(callback) {
    chrome.storage.local.get(['easy-note-data'], function (result) {
        callback(Object.keys(result['easy-note-data']));
    });
}

// Deletes the data saved in chrome storage for key being used
function clearExtensionData(){
    chrome.storage.local.set({'easy-note-data': {}}, function (result) {
        console.log('Value is set to {}');
    });
}

// Used for debugging; Logs the current data saved with extension
function clogExtensionData(){
    chrome.storage.local.get(['easy-note-data'], function (result) {
        console.log(result['easy-note-data']);
    });
}

// Used for debugging
function logCallback(data){
    console.log(data);
}

function getNotes(callback){
    chrome.storage.local.get(['easy-note-data'], function (result) {
        var storage_notes = result['easy-note-data'];
        var ungrouped_notes = [];
        for (var note_tag in storage_notes) {
            if (storage_notes.hasOwnProperty(note_tag)) {
                storage_notes[note_tag].forEach( note => {
                    note.tag = note_tag;
                    ungrouped_notes.push(note);
                });
            }
        }

        ungrouped_notes.sort((a,b) => (a.timeStamp > b.timeStamp) ? -1 : ((a.timeStamp < b.timeStamp) ? 1 : 0));
        
        console.log(ungrouped_notes);

        var notes = {};
        ungrouped_notes.forEach(note => {
            if(notes[note.title] === undefined){
                notes[note.title] = [note];
            }else{
                notes[note.title].push(note);
            }
        });
        callback(notes);
    });
}

getTags(displayTagsIndex);
getNotes(displayNotesIndex);