chrome.commands.onCommand.addListener(function (command, tab) {
    if (command === "make-note") {
        console.log(tab)
        console.log("Take note event triggered")

        chrome.tabs.sendMessage(tab.id, {action: "make_note"}, function(response) {
            console.log(response)
            if (response === true) {
                console.log("Event: make_note triggered successfully")
            }else{
                console.log("Unable to trigger Event: make_note")
            }
        });
    } else {
        console.log("Command event not found")
    }
});