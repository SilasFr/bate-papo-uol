let statusOnline = false
let userName

while(statusOnline){
    setInterval(statusUsuario, 5000)
}

function entrarNaSala(){
    userName = prompt('Digite seu nome')
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {name:userName})
    promise.then(carregarMsg)
    promise.catch(status400)
}


function carregarMsg(){
    statusOnline = true
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promise.then(addMsg)
    console.log(promise)
}

function addMsg(resposta){
    let liMsg = document.querySelector('.ulMensagens')
    let actualMsg = resposta.data
    for(let i=0; i<actualMsg.length; i++){
        let msg = actualMsg[i]

        if(msg.type==="status"){
            liMsg.innerHTML += `
                <li class="mensagem ${msg.type}" data-identifier="message">
                    <span class="time">(${msg.time})</span> 
                    <span class="from">${msg.from}</span> 
                    <span class="text">${msg.text}</span>
                </li>`

        }else if(msg.type==="message"){
            liMsg.innerHTML += `
                <li class="mensagem ${msg.type}" data-identifier="message">
                    <span class="time">(${msg.time})</span> 
                    <span class="from">${msg.from}:</span> 
                    <span class="text">${msg.text}</span>
                </li>`

        }else if(msg.type==="private_message"){
            liMsg.innerHTML += `
                <li class="mensagem ${msg.type}" data-identifier="message">
                    <span class="time">(${msg.time})</span> 
                    <span class="from">${msg.from} to ${msg.to}:</span> 
                    <span class="text">${msg.text}</span>
                </li>`
        }
    }    
}

function status400(){
    alert("Já existe um usuário online com esse nome")
    entrarNaSala()
}

function statusUsuario(){
    axios.post('https://mock-api.driven.com.br/api/v4/uol/status', {name:userName})
}

entrarNaSala()