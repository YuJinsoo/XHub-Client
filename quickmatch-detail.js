// 페이지 로딩 시 accessToken이 존재하는지 확인하여 isLoggedIn 값을 설정
if (localStorage.getItem('accessToken')) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }

window.addEventListener('load', function() {    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const value = urlParams.get('meeting_id');

    axios.get(`http://localhost/quickmatch/${value}/detail/`)
    .then(response => {
        const responsedata = response.data;

        console.log('내 사용자 ID: ', responsedata.id);
        render_details(responsedata); // 데이터를 가져온 후 세부 정보 렌더링

        const mc = document.getElementById('meeting_container');
        const mcul = mc.querySelector('ul');
        const liel = mcul.querySelectorAll('li');
        
        liel.forEach(function(li){
            let id_number = '';
            if (li.textContent.includes('organizer')) {
                id_number = li.textContent.split(' : ')[1];
                console.log('작성자 ID: ', id_number);
            }

            // 로그인 한 사용자와 작성자가 동일하면 삭제 버튼 표시.
            if (id_number === String(responsedata.id)){
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '미팅 삭제';
                deleteBtn.type = 'button';
                deleteBtn.onclick = deleteMeeting;
                document.querySelector('#button_group').append(deleteBtn);
            }
        });

        // 멤버십을 확인하여 어떤 버튼을 표시할지 결정
        return axios.get(`http://localhost/quickmatch/is_member/${value}/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

    })
    .then(response => {
        if(response.data.is_member) {
            document.getElementById('attend_btn').style.display = 'none';
            document.getElementById('leave_btn').style.display = 'block';
        } else {
            document.getElementById('attend_btn').style.display = 'block';
            document.getElementById('leave_btn').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('오류 발생', error);
    });
});

function render_details(data){
    const detail_container = document.getElementById('meeting_container');
    const unordered_li = document.createElement('ul');

    const list = ['title', 'organizer', 'description', 'age_limit', 'created_at', 'category', 'gender_limit', 'status', 'location', 'current_participants', 'max_participants', 'meeting_member']

    for (let key of list){
        const add = document.createElement('li');
        add.classList.add('group');

        if(data.hasOwnProperty(key)){
            let value = data[key];

            // meeting_member의 경우, 이메일 또는 닉네임을 표시합니다.
            if (key === 'meeting_member') {
                let temp = '';
                for (let member of value){
                    temp += member.email || member.nickname;
                    temp += ', ';
                }
                temp = temp.slice(0, -2); // 마지막 쉼표와 공백 제거
                add.textContent = `${key} : ${temp}`;
            } 
            // current_participants의 경우, 참여자 수를 표시합니다.
            else if (key === 'current_participants' && Array.isArray(value)) {
                add.textContent = `${key} : ${value.length}`;
            } 
            else {
                add.textContent = `${key} : ${value}`;
            }
            unordered_li.append(add);
        }
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
    const value = urlParams.get('meeting_id'); // Get the meeting_id value from the URL

    if (!value) {
        alert('Failed to retrieve meeting ID from the URL.');
        return;
    }

    try {
        const response = await axios.post(`http://localhost/quickmatch/join/${value}/`, {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.status === 200) {
            document.getElementById('attend_btn').style.display = 'none';
            document.getElementById('leave_btn').style.display = 'block';
            alert('모임 참석에 성공하였습니다.');
            
            return axios.get(`http://localhost/quickmatch/${value}/detail/`);
        } else {
        alert('모임 참석에 실패하였습니다.');
        }
    } catch (error) {
        alert('모임 참석에 실패하였습니다.');
    }
}


async function leaveMeeting() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const value = urlParams.get('meeting_id');

    if (!value) {
        alert('URL에서 회의 ID를 가져오는 데 실패했습니다.');
        return;
    }

    try {
        const response = await axios.post(`http://localhost/quickmatch/leave/${value}/`, {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.status === 200) {
            alert('회의를 성공적으로 떠났습니다.');
            // 성공적으로 회의를 떠난 후 참가 버튼을 표시하고 나가기 버튼을 숨깁니다.
            document.getElementById('attend_btn').style.display = 'block';
            document.getElementById('leave_btn').style.display = 'none';

            return axios.get(`http://localhost/quickmatch/${value}/detail/`);
        } else {
            alert('회의를 떠나는 데 실패했습니다.');
        }
    } catch (error) {
        alert('회의를 떠나는 데 실패했습니다.');
    }
}


function updateMeetingMembers(memberData) {
    // 'meeting_member'를 포함하는 목록 항목을 찾습니다.
    const liElements = document.querySelectorAll('#meeting_container ul li');
    for (let li of liElements) {
        if (li.textContent.includes('meeting_member')) {
            let updatedMembers = '';
            for (let member of memberData) {
                updatedMembers += member.email || member.nickname;
                updatedMembers += ', ';
            }
            updatedMembers = updatedMembers.slice(0, -2); // 마지막 쉼표와 공백 제거
            li.textContent = `meeting_member : ${updatedMembers}`;
            break;
        }
    }
}
