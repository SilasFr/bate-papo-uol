
function carregarMsg(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promise.then(addMsg)
    console.log(promise)
}

function addMsg(resposta){
    let liMsg = document.querySelector('.ulMensagens')
    let actualMsg = resposta.data
    for(let i=0; i<actualMsg.length; i++){
        let msg = actualMsg[i]

        liMsg.innerHTML += `
            <li class="mensagem ${msg.type}">
                <span class="time">${msg.time}</span> 
                <span class="from">${msg.from}:</span> 
                <span class="text"${msg.text}</span>
            </li>`
    }
    
}

carregarMsg()