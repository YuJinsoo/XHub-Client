import { tokenRefresh } from "../scripts/token.js";

// 페이지 로딩 시 accessToken이 존재하는지 확인하여 isLoggedIn 값을 설정
let isLoggedIn= false;
if (localStorage.getItem('accessToken')) {
    isLoggedIn = true;
} else {
    isLoggedIn = false;
}


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const meeting_id = urlParams.get('meeting_id');
const jwttoken = localStorage.getItem('accessToken');
const login_email = localStorage.getItem('userEmail');
const reconnectInterval = 1000; // millisecond
let reconnectCounter = 0;

// document.querySelector('#send_input').focus();
document.querySelector('#send_input').onkeyup = function(e){
    if (e.keyCode === 13){
        document.querySelector('#send_btn').click();
    }
};

document.querySelector('#todetail_btn').addEventListener('click', function(e){
    window.location = './quickmatch-detail.html?meeting_id='+encodeURIComponent(meeting_id);
})

//웹소켓 연결 시도.
connectWebSocket();

function connectWebSocket(){
    const chatSocket = new WebSocket(`ws://exercisehub.xyz/ws/quickmatch/${meeting_id}/room/?token=${jwttoken}&rcc=${reconnectCounter}`);

    document.querySelector('#send_btn').addEventListener('click', sendMessage);
    document.querySelector('#leave_btn').addEventListener('click', function(){
        chatSocket.close();
        console.log('client close.');
        leaveChating();
    });
    
    chatSocket.onopen = function(e) {
        console.log('WebSocket 연결이 열렸습니다.');
        reconnectCounter += 1;
    };
    
    chatSocket.onmessage = function(e) {
        const data =JSON.parse(e.data);
    
        if (Array.isArray(data)){
            for(let m of data){
                const message = m['content'];
                const sender = m['user'];
                const msg = document.createElement('div');
                if (login_email === sender){
                    msg.classList.add('chat_style_me');
                }
                else {
                    msg.classList.add('chat_style');
                }
                msg.textContent = `${sender} : ${message}`;
                document.querySelector('#chat_container').append(msg);
            }
        }
        else{
            renderChat(data);
        }
    };
    
    chatSocket.onclose = function(e){
        console.error('Chat socket closed unexpectedly.', e)
        
        if (e.code !== 1000){
            setTimeout(()=>{
                connectWebSocket();
            }, reconnectInterval);
        }
    };
    
    chatSocket.onerror = function(e){
        console.error('error : ', e);
    };

    async function sendMessage(){
        const messageInput = document.querySelector('#send_input');
        const message = messageInput.value;
    
        await axios.get(`https://exercisehub.xyz/player/check/email`, {
            headers:{
                'Authorization': `Bearer ${jwttoken}`
            }
        })
        .then(res => {
            chatSocket.send(JSON.stringify({
                'message': message,
                'sender_email': res.data.email,
                'sender_id': res.data.id,
            }));
        })
        .catch(error =>{
            console.error('error : ', error);
        })
        
        messageInput.value='';
    }
}


function renderChat(data){
    const message = data['message'];
    const sender_email = data['sender_email'];

    const msg = document.createElement('div');
    if (login_email === sender_email){
        msg.classList.add('chat_style_me');
    }
    else if ('system' === sender_email){
        msg.classList.add('chat_style_system');
    }
    else{
        msg.classList.add('chat_style');
    }
    msg.textContent = `${sender_email} : ${message}`;
    document.querySelector('#chat_container').append(msg);
}


async function leaveChating(){
    console.log("떠나기 반영.");

    await axios.post(`https://localhost/quickmatch/${meeting_id}/detail/leavechat/`, {}, { headers :{
        'Authorization': `Bearer ${jwttoken}`,
    }}).then(res => {
        console.log('leave metting chat');
        console.log(res);
    }).catch(error =>{
        console.error('에러발생: ', error);
        if (error.response.status == 401){
            console.log('herher')
        }
    }).finally(
        //finally
    );

}

function gotoDetailPage(){
    
}

async function getemail(){
    axios.get('https://exercisehub.xyz/player/check/email/',{
    headers:{
            "Authorization": `Bearer ${jwttoken}`
        }
    })
    .then(res => {
        console.log(res);
    })
    .catch(e =>{
        console.error('error:', e);
        return null;
    }) 
}