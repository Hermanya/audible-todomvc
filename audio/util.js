export function say (something) {
    return new Promise((resolve) => {
        let utterance = new SpeechSynthesisUtterance(something)
        utterance.addEventListener('end', () => {
            window.removeEventListener('keydown', skip)
            resolve()
        })
        setTimeout(() => speechSynthesis.speak(utterance), 0)
        window.addEventListener('keydown', skip)
        function skip () {
            speechSynthesis.cancel()
        }
    })
}

export function unrecognized (command) {
    return say(`not sure what ${command || 'that'} means`)
}

export function withHelp (commands) {
    commands.help = () => say(`you can ask to ${Object.keys(commands).join('; ')}`).then(doCommand.bind('no context', commands))
    return commands
}

export function doCommand (commands) {
    return listen().then(command => (withHelp(commands)[command] || unrecognized.bind('no context', command))())
}

export function listen () {
    return new Promise((resolve) => {
        let value = ''
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keypress', onKeyPress);
        function onKeyPress (event) {
            let character = String.fromCharCode(event.which)
            if (character === ' ') {
                say(value.split(' ').pop())
            }
            value += character
        }
        function onKeyDown (event) {
            if(event.keyCode == 8){
                event.preventDefault();
                let words = value.trim().split(' ')
                value = words.slice(0, -1).join(' ') + ' '
                say(`${words.pop()} erased`)
            } else if (event.keyCode == 13) {
                window.removeEventListener('keydown', onKeyDown);
                window.removeEventListener('keypress', onKeyPress);
                resolve(value.trim())
            }
        }
    })
}
