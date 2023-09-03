// 페이지가 로드될 때 초기화 작업을 수행합니다.
window.addEventListener('load', function() {
    // 초기 설정 코드 (예: 로그인 상태 확인, UI 초기화 등)
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const value = urlParams.get('meeting_id');

    console.log('전달된 값:', value);

    // 이제 'value' 변수에 저장된 값을 사용할 수 있습니다.
    // 예: HTML 요소에 표시하기

    axios.get(`http://localhost/quickmatch/${value}/detail/`)
    .then(response =>{
        console.log(response);
        console.log(response.data);
        render_details(response.data);
    })
    .catch(error =>{
        console.error('에러가 발생했습니다', error);
    })

});

function render_details(data){
    const detail_container = document.getElementById('meeting_container');
    const unordered_li = document.createElement('ul');

    // List of data you want to express
    const list = ['id', 'title', 'description', 'age_limit', 'created_at', 'category', 'gender_limit', 'status', 'location', 'current_participants', 'max_participants', 'meeting_member']

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
const eventName = document.getElementById('eventName').value;

try {
    const response = await axios.delete(`/api/events/${eventName}`);

    if (response.status === 200) {
    alert('모임이 성공적으로 삭제되었습니다.');
    // UI 업데이트 또는 추가 작업
    } else {
    alert('모임 삭제에 실패하였습니다.');
    }
} catch (error) {
    alert('모임 삭제에 실패하였습니다.');
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
