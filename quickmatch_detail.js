// 페이지가 로드될 때 초기화 작업을 수행합니다.
window.addEventListener('load', function() {
    // 초기 설정 코드 (예: 로그인 상태 확인, UI 초기화 등)
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const value = urlParams.get('meeting_id');

    axios.get(`http://localhost/quickmatch/${value}/detail/`)
    .then(response =>{
        // console.log(response);
        // console.log(response.data);
        render_details(response.data);
    })
    .catch(error =>{
        console.error('에러가 발생했습니다', error);
    })

    axios.get(`http://localhost/player/check/email/`, {
        headers : {
            'Authorization' : `Bearer ${this.localStorage.getItem('accessToken')}`
        }
    })
    .then(response =>{
        const responsedata = response.data;
        const mc = document.getElementById('meeting_container')
        const mcul = mc.querySelector('ul');
        const liel = mcul.querySelectorAll('li');
        console.log('my user id: ', responsedata.id);

        liel.forEach(function(li){
            // console.log(li.textContent);
            let id_number = ''
            if (li.textContent.includes('organizer')){
                id_number = li.textContent.split(' : ')[1];
                console.log('author id: ', id_number);
            }

            // 로그인유저와 작성가 같을 때만 삭제버튼 보이도록
            if (id_number === String(responsedata.id)){
                
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '미팅 삭제';
                deleteBtn.type = 'button';
                deleteBtn.onclick = deleteMeeting;
                document.querySelector('#button_group').append(deleteBtn);
            }
        });
        // if (response.data.id === ){

        // }
    })
    .catch(error =>{
        console.error('에러가 발생했습니다', error);
    })

});

function render_details(data){
    const detail_container = document.getElementById('meeting_container');
    const unordered_li = document.createElement('ul');


    // 표현하고싶은 데이터 리스트
    const list = ['title', 'organizer', 'description', 'age_limit', 'created_at', 'category', 'gender_limit', 'status', 'location', 'current_participants ', 'max_participants','meeting_member']

    for (let key of list){
        let add = document.createElement('li');
        add.classList.add('group')

        if(data.hasOwnProperty(key)){

            let value = data[key];
            
            // key === meeting_member
            if (key === 'meeting_member') {
                let temp = '';
                for (let tmp of value){
                    temp += tmp.email + ', ';
                }
                temp = temp.slice(0, -2); // remove last comma and space
                add.textContent = `${key} : ${temp}`;
            }
            // If current_participants is an array, then display its length
            else if (key === 'current_participants' && Array.isArray(value)) {
                add.textContent = `${key} : ${value.length}`;
            }
            else {
                add.textContent = `${key} : ${value}`;
            }
        }

        unordered_li.append(add);
    }

    detail_container.append(unordered_li);
}


// 모임 삭제 함수
async function deleteMeeting() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const value = urlParams.get('meeting_id');
    console.log('delete로 들어왔다! meeting_id : ', value);

    // 삭제 요청
    try {
        const response = await axios.post(`http://localhost/quickmatch/${value}/delete/`, {}, {
            headers : {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.status === 200) {
        alert('모임이 성공적으로 삭제되었습니다.');
        window.location.href='meeting-list.html';
        // UI 업데이트 또는 추가 작업
        } else {
        alert('모임 삭제에 실패하였습니다.');
        }
    } catch (error) {
        alert('모임 삭제에 실패하였습니다.');
        console.error('에러발생했습니다.', error)
    }
}

// 모임 참석 함수
async function attendMeeting() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const eventName = urlParams.get('meeting_id'); // Get the meeting_id value from the URL

    if (!eventName) {
        alert('Failed to retrieve meeting ID from the URL.');
        return;
    }

    try {
        const response = await axios.post(`http://localhost/quickmatch/join/${eventName}/`, {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.status === 200) {
        alert('모임 참석에 성공하였습니다.');
        // UI 업데이트 또는 추가 작업
        } else {
        alert('모임 참석에 실패하였습니다.');
        }
    } catch (error) {
        alert('모임 참석에 실패하였습니다.');
    }
}
