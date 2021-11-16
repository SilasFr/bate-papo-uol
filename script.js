let statusOnline = undefined
let userName = undefined
let actualMsg = undefined
let feed = undefined
let loopParticipants = undefined
let count =0 
const telaDeEntrada = document.querySelector('.tela-de-entrada')
const participantsAside = document.querySelector('.participants')
const opacity = document.querySelector('.opacity')
telaDeEntrada.classList.remove('hidden')
requestParticipants()

function asideParticipants(){
    participantsAside.classList.remove('hidden')
    opacity.classList.remove('hidden')

}
function closeParticipants(){
    participantsAside.classList.add('hidden')
    opacity.classList.add('hidden')
}

function entrarNaSala(){
    const inputNome = document.querySelector('.input-usuario')
    userName = inputNome.value
    const loadingScreen = document.querySelector('.info-usuario')
    loadingScreen.innerHTML = `
    <img class="loading-img" src="./img/loading.gif" alt="Carregando">
    <p class="entrando">Entrando...</p>`
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {name:userName})
    promise.then(carregarMsg)
    promise.catch(status400)
    setTimeout(statusUsuario, 5000)
}

function status400(){
    alert("Já existe um usuário online com esse nome, digite outro nome")
    entrarNaSala()
}

function carregarMsg(){
    telaDeEntrada.classList.add('hidden')
    let promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promise.then(addMsg)
    // promise.catch(alertaDesconectado)
}

function addMsg(resposta){
    let liMsg = document.querySelector('.ulMensagens')
    console.log(resposta)
    
    if(resposta.data!==actualMsg || count === 0){
        actualMsg = resposta.data
        
        count = 1
        liMsg.innerHTML = ''
        
        for(let i=0; i<actualMsg.length; i++){
            let msg = actualMsg[i]
            
            if(msg.type==="status"){
                liMsg.innerHTML += `
                <li class="mensagem ${msg.type}" data-identifier="message">
                <p>
                <span class="time">(${msg.time})</span> 
                <span class="from">${msg.from}</span> 
                <span class="text">${msg.text}</span>
                </p>
                </li>`
                
            }else if(msg.type==="message"){
                liMsg.innerHTML += `
                <li class="mensagem ${msg.type}" data-identifier="message">
                <p>
                <span class="time">(${msg.time})</span> 
                <span class="from">${msg.from}:</span> 
                <span class="text">${msg.text}</span>
                </p>
                </li>`
                
            }else if(msg.type==="private_message" && (userName===msg.to || userName===msg.from)){
                liMsg.innerHTML += `
                <li class="mensagem ${msg.type}" data-identifier="message">
                <p>
                <span class="time">(${msg.time})</span> 
                <span class="from">${msg.from} to ${msg.to}:</span> 
                <span class="text">${msg.text}</span>
                </p>
                </li>`
            }
        }
        let ultimaMsg = document.querySelectorAll('.mensagem')
        ultimaMsg[ultimaMsg.length-1].scrollIntoView()
        clearInterval(feed)
        feed = setInterval(carregarMsg, 3000)
    }
}

function enviarMsg(){
    let textoMsg = document.querySelector('.text-input')
    console.dir(textoMsg)
    const promise = axios.post(
        'https://mock-api.driven.com.br/api/v4/uol/messages', 
        {
            from: `${userName}`,
            to: "Todos",
            text: textoMsg.value,
            type: "message" // ou "private_message" para o bônus
        }        
        )
        textoMsg.value = ''
    }
    
    let textoMsg = document.querySelector('.text-input')    
    textoMsg.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.querySelector(".enviar").click();
        }
    })
    
    
    function statusUsuario(){
        const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', {name: `${userName}`})
        promise.then(statusResposta)
        promise.catch(alertaDesconectado)
    }
    
    function alertaDesconectado(resposta){
        alert('Você foi desconectado devido à inatividade, por favor recarregue a página')
        console.log(resposta)
        location.reload()
    }
    
    function statusResposta(resposta){
        clearInterval(statusOnline)
        statusOnline = setInterval(statusUsuario, 5000)
        console.log(resposta)
    }
    
    function requestParticipants(){
        let participants = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants')
        participants.then(carregarParticipants)
        participants.catch(status400)
    
    }

    function carregarParticipants(resposta){
        console.log(resposta)
        let participantsOnline = resposta.data
        let ulParticipants = document.querySelector('.participants-online')
        ulParticipants.innerHTML = 
        `
        <div class="participant-li" onclick="selectUser(this)" data-identifier="participant">
        <ion-icon name="people"></ion-icon>
        <p>Todos</p>
        <ion-icon name="checkmark" class="checkmark selected"></ion-icon>
    </div>
    `
    for(let i =0; i<participantsOnline.length; i++){
        let liParticipants = participantsOnline[i]

        ulParticipants.innerHTML += 
        `
            <div class="participant-li" onclick="selectUser(this)" data-identifier="participant">
                <ion-icon name="person"></ion-icon>
                <p>${liParticipants.name}</p>
                <ion-icon name="checkmark" class="checkmark hidden"></ion-icon>
            </div>
        `
    }

    clearInterval(loopParticipants)
    loopParticipants = setInterval(requestParticipants, 10000)

}

function selectUser(participantSelected){
    let checkmark = participantSelected.querySelector('.checkmark')
    console.log(participantSelected)

    let ulContato = document.querySelectorAll('.participant-li')
    
    for(let i =0; i<ulContato.length;i++){
        let x = ulContato[i].lastElementChild.classList.contains('selected')
        if( x && (ulContato[i].lastChild!==checkmark) ){
            ulContato[i].lastElementChild.classList.toggle('selected')
            checkmark.classList.toggle('selected')
        }        
    }    
}

function selectVisibility(visibilitySelected){
    let checkmark = visibilitySelected.querySelector('.checkmark')

    let ulVisibility = document.querySelectorAll('.visibility')
    
    for(let i =0; i<ulContato.length;i++){
        let x = ulContato[i].lastElementChild.classList.contains('selected')
        if( x && (ulContato[i].lastChild!==checkmark) ){
            ulContato[i].lastElementChild.classList.toggle('selected')
            checkmark.classList.toggle('selected')

        }        
    }
    
}


