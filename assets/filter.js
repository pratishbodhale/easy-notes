var activeTagsSet = new Set();
var allChecked = true;

function registerSelectors(){
    $("#checkbox-container input").each(function(){
        $(this).change(function(){
            checkbox_tag = $(this).attr("data-filter");
            if($(this).is(":checked") === true){
                checkbox_tag === "all_elements" ? displayAll() : displayNotesForTag(checkbox_tag);
            }else{
                checkbox_tag === "all_elements" ? displaySelected() : hideNotesForTag(checkbox_tag);
            }
        })
    });
}

function hideNotesForTag(tag){
    activeTagsSet.delete(tag);

    if(allChecked === true) return;
    $("#notes-container div[data-filter~="+tag+"]").each(function(){
        group_tags = $(this).attr("data-filter").split(" ");
        var skip_action = false;
        group_tags.forEach((grp_tag) => {
            if(activeTagsSet.has(grp_tag)){
                skip_action = true;
                return;
            }
        })

        if(skip_action === false) $(this).addClass("hide");
    });
}

function displayNotesForTag(tag){
    activeTagsSet.add(tag);
    if(allChecked === true){
        displaySelected();
        $("#checkbox-container input[data-filter=all_elements]").prop("checked", false);
        return;
    } 
    
    $("#notes-container div[data-filter~="+tag+"]").each(function(){
        $(this).removeClass("hide");
    });
}

function displayAll(){
    allChecked = true;
    $("#notes-container div").each(function(){
        $(this).removeClass("hide");
    });
}

function hideAll(){
    $("#notes-container div.note-area").each(function(){
        $(this).addClass("hide");
    });
}

function displaySelected(){
    hideAll();
    allChecked = false;
    for (let activeTag of activeTagsSet){
        $("#notes-container div[data-filter~="+activeTag+"]").each(function(){
            $(this).removeClass("hide");
        });
    } 
}

$( document ).ready(function() {
    registerSelectors();
});

