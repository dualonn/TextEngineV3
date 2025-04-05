//Page setup
{
    dialogue_window = document.createElement('div')
    dialogue = document.createElement('div')
    dialogue_window.appendChild(dialogue)
    document.body.appendChild(dialogue_window)
    dialogue_window.setAttribute('id', 'dialogue_window')
    dialogue.setAttribute('id', 'dialogue')
    character_icon = document.createElement('img')
    character_icon.setAttribute('id', 'character_icon')
    dialogue_window.appendChild(character_icon)
}
function toggleDialogueWindow(state) {
    switch (state) {
        case true:
            dialogue_window.style.animation = "open_box 0.3s ease-in-out forwards"
            break
        case false:
            dialogue_window.style.animation = "close_box 0.3s ease-in-out forwards"
            break
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForKeyPress(keyboard_key) {
    return new Promise(resolve => {
        const handler = (e) => {
            if (e.key === keyboard_key) {
                document.removeEventListener('keyup', handler);
                resolve();
            }
        };
        document.addEventListener('keyup', handler, { once: true }); // "once" ensures removal
    });
}

async function print_dialogue(speed, image, text, startDialogue, endDialogue){
    if(startDialogue){toggleDialogueWindow(true)}
    if(image){character_icon.setAttribute("src", `${image}.png`)}
    else{character_icon.setAttribute("src", `default.png`)}
    let skip = false
    let skip_dialogue = text.replaceAll(/\/s(1000|[1-9][0-9]{0,2})/g, "")
    function skipText(e) {
        if (e.key === " ") { // Change this to any key you want
            skip = true;
            document.removeEventListener("keydown", skipText);
        }
    }

    document.addEventListener("keydown", skipText);

    const regex = /\/s(1000|[1-9][0-9]{0,2})/g
    let last_idx = 0
    let text_buffer = []
    let match

    while((match = regex.exec(text)) != null) {
        const split = text.slice(last_idx, match.index)
        const number = parseInt(match[1], 10)

        text_buffer.push({ "text": split, "#": parseInt(match[1], 10) })
        last_idx = regex.lastIndex
    }

    if(last_idx < text.length){
        text_buffer.push({"text": text.slice(last_idx), "#": null})
    }

    console.log(text_buffer)

    await wait(500)
    let current_text = ""
    for(let substring of text_buffer){
        for(let char of substring["text"]){
            if(skip){
                dialogue.innerText = skip_dialogue
                await waitForKeyPress(" ")
                break
            }
            current_text += char
            dialogue.innerText = current_text
            await wait(speed)
        }
        await wait(substring["#"])
    }
    await waitForKeyPress(" ").then(() => {
        dialogue.innerText = ""
    })
    if(endDialogue){toggleDialogueWindow(false)}
}

(async () => {
    await print_dialogue(0, "Character001","Lorem ipsum dolor sit amet, /s500 consectetur adipiscing elit. /s800 Integer cursus, ex ut aliquam hendrerit, nisl ipsum venenatis erat, at consequat mi tellus rhoncus metus. Cras in aliquet nibh. Proin vitae pellentesque ante. Vivamus suscipit nibh ut metus euismod vestibulum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec faucibus, mauris finibus faucibus venenatis, velit mi bibendum quam, vitae euismod eros lorem congue felis. In et felis ac diam vulputate facilisis id nec justo.", true, false)
    await print_dialogue(75, "", "H-hello u-user... /s500 Wh-why don't we h-have a little f-f-fun?", false, true)
})()

/* Test toggleDialogueWindow function
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowUp") {
        toggleDialogueWindow(true)
    }
    if (e.key === "ArrowDown") {
        toggleDialogueWindow(false)
    }
}) */