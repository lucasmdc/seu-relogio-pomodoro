(function() {
    const pomodoro = findFirstOcurrenceInDOMElement(document, "#pomodoro")

    const clock = findFirstOcurrenceInDOMElement(document, "#pomodoroClock")
    const controls = findFirstOcurrenceInDOMElement(document, "#pomodoroControls")
    const settings = findFirstOcurrenceInDOMElement(document, "#pomodoroSettings")

    const clockMinutes = findFirstOcurrenceInDOMElement(clock, '#pomodoroMinutes')
    const clockSeconds = findFirstOcurrenceInDOMElement(clock, '#pomodoroSeconds')
    const clockTimeUp = new Audio("./assets/audio/time-up.ogg")

    let clockMinutesTime
    let clockSecondsTime

    const controlsPlayPause = findFirstOcurrenceInDOMElement(controls, '#pomodoroPlayPause')
    const controlsReset = findFirstOcurrenceInDOMElement(controls, '#pomodoroReset')

    const settingsOptions = findFirstOcurrenceInDOMElement(settings, '#pomodoroSettingsOptions')
    const settingsSessionTime = findFirstOcurrenceInDOMElement(settings, '#pomodoroSessionTime')

    const _privateContext = this
    let _privateClock = null    

    function findFirstOcurrenceInDOMElement(context, match) {
        try {
            const reference = context.querySelector(match)
            
            if (reference !== null){
                return reference
            }
            else {
                throw new Error(`Não foi possível encontrar '${match}' em '${document.location.href}'`)
            }
        }
        catch (error){
            throw error
        }
    }

    function createHTMLElement(context, varName, elementName, classNames){
        try {
            context[varName] = document.createElement(elementName)
            context[varName].classList.add(classNames)
        }
        catch(error) {
            throw error
        }
    }

    function activeControlsPlayPauseEvent(){
        try {
            controlsPlayPause.addEventListener('click', controlsPlayPauseSettings)
        }
        catch(error) {
            throw error
        }
    }

    function disableControlsPlayPauseEvent(){
        try {
            controlsPlayPause.removeEventListener('click', controlsPlayPauseSettings)
        }
        catch(error) {
            throw error
        }
    }

    function controlsPlayPauseSettings() {
        if(controlsPlayPause.dataset.playPause === 'false'){
            controlsPlayPause.dataset.playPause = true
            _privateClock = startClock()
        }
        else {
            controlsPlayPause.dataset.playPause = false
            clearInterval(_privateClock)
        }
    }

    function activeControlsResetEvent(){
        try {
            controlsReset.addEventListener('click', () => {
                if (_privateClock !== null) {
                    clearInterval(_privateClock)
                }
                
                updateClockTime(parseInt(settingsSessionTime.value), 0)
                
                controlsPlayPause.dataset.playPause = false
            })
        }
        catch(error) {
            throw error
        }
    }

    function activeSettingsOptionsSendEvent(){
        settingsOptions.addEventListener('submit', (event) => {
            try {
                event.preventDefault()
                const value = parseInt(settingsSessionTime.value)
                

                if (_privateClock !== null) {
                    clearInterval(_privateClock)
                }

                if(testValueIs('number', value) && isNaN(value)){
                    throw new CreateInputError()
                }

                if(value  - 1 < 0 && clockSecondsTime === 0){
                    throw new CreateInputError()
                }

                activeControlsPlayPauseEvent()
                updateClockTime(parseInt(settingsSessionTime.value), 0)
            }
            catch(error) {
                if(error instanceof CreateInputError){
                    settingsOptions.querySelectorAll('input').forEach(elem => {
                        disableControlsPlayPauseEvent()
                        elem.dispatchEvent(new Event('input'))
                    })
                }
                else {
                    throw error 
                }
            }

        })
    }

    function CreateInputError(message=''){
        this.message = message
    }

    function pomodoroSessionTimeRules(event) {
        try {
            removeNodeHtmlInputError(event)
            
            if(!testIsEmptyValue(settingsSessionTime.value)){
                throw new CreateInputError('Valor inválido')
            }

            if(!testMinValueNumber(
                parseInt(settingsSessionTime.value), 1
            )){
                throw new CreateInputError('Mínimo 1') 
            }

            if(!testMaxValueNumber(settingsSessionTime.value, 60)){
                throw new CreateInputError('Máximo 60') 
            }
        }
        catch(error) {
            if(error instanceof CreateInputError) {
                insertNodeHtmlInputError(event, error.message)
            }
            else {
                throw error
            }
        }
    }

    function insertNodeHtmlInputError(event, message){
        const clonedHtmlInputError =  InputError.cloneNode(false)

        event.target.classList.add('error')
        event.target.insertAdjacentElement('afterend', clonedHtmlInputError)

        clonedHtmlInputError.innerHTML = `${message}`
    }

    function removeNodeHtmlInputError(event){ 
        const nextNodeLength = !!String(event.target.nextSibling.nodeValue).trim().length
        
        if(nextNodeLength){
            event.target.classList.remove('error')
            event.target.nextSibling.remove()
        }
    }

    function inputInForm(event){
        try {
            const fields = {
                'pomodoroSessionTime' : () => pomodoroSessionTimeRules(event)
            }

            const idField = event.target.getAttribute('id')

            fields[idField]()
        }
        catch(error) {
            throw error
        }
    }

    function getType(value){
        try {
            return (Object.prototype.toString.apply(value)).slice(8, -1).toLowerCase()
        }
        catch(error) {
            throw error
        }
    }

    function testIsEmptyValue(value) {
        try {
            return String(value).length > 0
        }
        catch(error) {
            throw error
        }
    }

    function testMinValueNumber(value, test) {
        try {
            return value >= test
        }
        catch(error) {
            throw error
        }
    }

    function testMaxValueNumber(value, test) {
        try {
            return value <= test
        }
        catch(error) {
            throw error
        }
    }

    function testValueIs(type, value){
        try{
            return getType(value) === type
        }
        catch(error) {
            throw error
        }
    }

    function activeInputSettingsOptionsFieldsEvent(){
        try {
            settingsOptions.querySelectorAll('input').forEach(elem => {
                elem.addEventListener('input', inputInForm)
            })
        }
        catch(error){
            throw error
        }
    }

    function activeClockTimeUpStartEvent(){
        try {
            clockTimeUp.addEventListener('play', (event) => {
                pomodoro.classList.add('pomodoro--block')
                pomodoro.insertAdjacentElement('afterbegin', ContainerProgressBar)
                pomodoro.insertAdjacentElement('beforeend', ContainerBlock)
            })
        }
        catch(error) {
            throw error
        }
    }

    function activeClockTimeUpUpdateEvent(){
        try {
            clockTimeUp.addEventListener('timeupdate', (event) => {
                const percentToEnded = ((clockTimeUp.currentTime * 100) / clockTimeUp.duration).toFixed(2)
                pomodoro.style.setProperty('--progress-to-restart-clock', `${percentToEnded}%`);
            })
        }
        catch(error) {
            throw error
        }
    }

    function activeClockTimeUpFinishedEvent(){
        try {
            clockTimeUp.addEventListener('ended', (event) => {
                pomodoro.classList.remove('pomodoro--block')
                pomodoro.removeChild(pomodoro.firstChild)
                pomodoro.removeChild(pomodoro.lastChild)
                
                controlsPlayPause.dispatchEvent(new Event('click'))
                settingsOptions.dispatchEvent(new Event('submit'))
            })
        }
        catch(error) {
            throw error
        }
    }

    function startClock() {
        try {
            if(testValueIs('number', clockMinutesTime) && isNaN(clockMinutesTime)){        
                throw new CreateInputError()
            }

            if(clockMinutesTime - 1 < 0 && clockSecondsTime === 0){
                throw new CreateInputError()
            }

            const clock = setInterval(() => {
                
                if (clockSecondsTime === 0) {
                    updateClockTime(--clockMinutesTime, 59)
                }
                else {
                    updateClockTime(clockMinutesTime, --clockSecondsTime)
                }

                if (clockMinutesTime === 0 && clockSecondsTime === 0) {
                    clearInterval(clock)
                    clockTimeUp.play()
                }

            },1000)

            return clock
        }
        catch(error) {     
            if(error instanceof CreateInputError){
                settingsOptions.querySelectorAll('input').forEach(elem => {        
                    elem.dispatchEvent(new Event('input'))
                })
            }
            else {
                throw error
            }
        }
    }

    function updateClockTime(minutes, seconds) {
        try {
            clockMinutesTime = minutes
            clockSecondsTime = seconds

            updateClockMinutes(clockMinutesTime)
            updateClockSeconds(clockSecondsTime)
        }
        catch(error) {
            throw error
        }
    }

    function updateClockMinutes(minutes) {
        try {
            clockMinutes.innerHTML = convertClockTimeInStrings(minutes)
        }
        catch(error) {
            throw error
        }
    }

    function updateClockSeconds(seconds) {
        try {
            clockSeconds.innerHTML = convertClockTimeInStrings(seconds)
        }
        catch(error) {
            throw error
        }
    }
    
    function convertClockTimeInStrings(time){
        try {
            return time.toString().padStart(2,0)
        }
        catch(error) {
            throw error
        }
    }

    function init(){
        try {
            createHTMLElement(_privateContext, 'ContainerProgressBar', 'div', 'pomodoro__progress-bar')
            createHTMLElement(_privateContext, 'ContainerBlock', 'div', 'pomodoro__container--block')
            createHTMLElement(_privateContext, 'InputError', 'p', 'error')

            settingsSessionTime.value = 15
            
            updateClockTime(15, 0)

            controlsPlayPause.setAttribute('data-play-pause', false)

            activeControlsPlayPauseEvent()
            activeControlsResetEvent()
            activeSettingsOptionsSendEvent()

            activeClockTimeUpStartEvent()
            activeClockTimeUpUpdateEvent()
            activeClockTimeUpFinishedEvent()

            activeInputSettingsOptionsFieldsEvent()
            
        }
        catch(error) {
            throw error
        }
    }

    init()
})()