let statusOnline = undefined
let userName = undefined
let actualMsg = undefined
let feed = undefined

function entrarNaSala(){
    userName = prompt('Digite seu nome')
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {name:userName})
    promise.then(carregarMsg)
    promise.catch(status400)
    statusUsuario()
}

function carregarMsg(){
    let promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promise.then(addMsg)
    promise.catch(alertaDesconectado)
}

function addMsg(resposta){
    let liMsg = document.querySelector('.ulMensagens')
    console.log(resposta)
    if(resposta.data!==actualMsg){

        actualMsg = resposta.data
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
    
            }else if(msg.type==="private_message"){
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
    promise.catch(alertaDesconectado)
}

function status400(){
    alert("Já existe um usuário online com esse nome, digite outro nome")
    entrarNaSala()
}

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

entrarNaSala()