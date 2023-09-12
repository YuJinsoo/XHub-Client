
// 페이지 로딩 시 accessToken이 존재하는지 확인하여 isLoggedIn 값을 설정
if (localStorage.getItem('accessToken')) {
    isLoggedIn = true;
} else {
    isLoggedIn = false;
}

window.addEventListener('load', function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const meeting_id = urlParams.get('meeting_id');

    // document.querySelector('#send_input').focus();
    document.querySelector('#send_input').onkeyup = function(e){
        if (e.keyCode === 13){
            document.querySelector('#send_btn').click();
        }
    };

    const customHeaders = {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      };

    const chatSocket = new WebSocket(
        `ws://localhost/ws/quickmatch/${meeting_id}/room/`,
        {headers: customHeaders}
        // [`Authorization: Bearer ${this.localStorage.getItem('accessToken')}`]
        // Object.keys(customHeaders).reduce((headers, key) =>{
        //     headers.push(`${key}: ${customHeaders[key]}`);
        //     return headers;
        // },[])
        );
    
    chatSocket.onopen = function(e) {
        console.log('WebSocket 연결이 열렸습니다.');
      };

    chatSocket.onmessage = function(e) {
        const data =JSON.parse(e.data);
        const message = data['message'];
        const sender_email = data['sender_email'];

        const msg = document.createElement('div');
        msg.textContent = `${sender_email} : ${message}`;
        document.querySelector('#chat_container').append(msg);
    }

    chatSocket.onclose = function(e){
        console.error('Chat socket closed unexpectedly.', e)
    }
})



function leaveChating(){
    console.log("떠나기.")
}

function gotoDetailPage(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const value = urlParams.get('meeting_id');

    window.location = './quickmatch-detail.html?meeting_id='+encodeURIComponent(value);
}

function sendMessage(){
    const messageInput = document.querySelector('#send_input');
    const message = messageInput.value;
    chatSocket.send(JSON.stringify({
        'message': message
    }));
    messageInput.value='';
}