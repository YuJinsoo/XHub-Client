import { tokenRefresh, navigateToLoginPage } from "../scripts/token.js";

let UserId;

// 초기 상태 드롭다운 설정
const statusDropdown = document.createElement('select');
const options = ["모집중", "모집완료", "취소"];

options.forEach(optionValue => {
    let option = document.createElement('option');
    option.value = optionValue;
    option.textContent = optionValue;
    statusDropdown.appendChild(option);
});

statusDropdown.onchange = statusChange; 

// 윈도우 로드 시 코드 실행
// window.addEventListener('load', async function() {    
//     const meetingId = new URLSearchParams(window.location.search).get('meeting_id');

//     const userInfo = await getUserInfo();
//     UserId = userInfo.id || null;

//     const meetingDetail = await getMeetingDetail(meetingId);
//     render_details(meetingDetail, UserId);

//     const isMember = await checkMembership(meetingId);
//     toggleUIBasedOnMembership(isMember);
// });
window.addEventListener('load', loadpage);

async function getUserInfo() {
    try {
        const response = await axios.get(`https://exercisehub.xyz/player/check/email/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        return {};
    }
}

async function getMeetingDetail(meetingId) {
    try {
        const response = await axios.get(`https://exercisehub.xyz/quickmatch/${meetingId}/detail/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching meeting detail:', error);
        return {};
    }
}

// function render_details(data, currentUserId) {
//     // Code for rendering the details...
// }

async function checkMembership(meetingId) {
    try {
        const response = await axios.get(`https://exercisehub.xyz/quickmatch/is_member/${meetingId}/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.data.is_member;
    } catch (error) {
        console.error('Error checking membership:', error);
        return false;
    }
}

function toggleUIBasedOnMembership(isMember) {
    const evaluateButton = document.querySelectorAll('.evaluate-btn');
    if (isMember) {
        document.getElementById('attend_btn').style.display = 'none';
        document.getElementById('leave_btn').style.display = 'block';
        document.getElementById('chat_btn').style.display = 'block';
        for (let button of evaluateButton) {
            button.style.display = 'block';
        }
    } else {
        document.getElementById('attend_btn').style.display = 'block';
        document.getElementById('leave_btn').style.display = 'none';
        document.getElementById('chat_btn').style.display = 'none';
        for (let button of evaluateButton) {
            button.style.display = 'none';
        }
    }
}

function render_details(data, currentUserId){
    const detail_container = document.getElementById('meeting_container');

    // status와 created_at
    const statusCreatedAtDiv = document.createElement('div');
    statusCreatedAtDiv.textContent = `${data.status} ${data.created_at.split("T")[0]}`;
    detail_container.appendChild(statusCreatedAtDiv);

    // title, current_participants, max_participants 및 organizer
    const titleParticipantsDiv = document.createElement('div');
    titleParticipantsDiv.textContent = `${data.title} [${data.meeting_member.length || 0}/${data.max_participants}] ${data.organizer}`;
    detail_container.appendChild(titleParticipantsDiv);

    // description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.textContent = data.description;
    detail_container.appendChild(descriptionDiv);

    // category, gender_limit 및 location
    const catGenderLocDiv = document.createElement('div');
    catGenderLocDiv.classList.add('category-location');

    const categorySpan = document.createElement('span');
    categorySpan.className = 'category-btn';
    categorySpan.textContent = data.category;
    catGenderLocDiv.appendChild(categorySpan);

    const genderLimitSpan = document.createElement('span');
    genderLimitSpan.className = 'gender-limit-btn';
    genderLimitSpan.textContent = data.gender_limit;
    catGenderLocDiv.appendChild(genderLimitSpan);

    const locationSpan = document.createElement('span');
    locationSpan.className = 'location-btn';
    locationSpan.textContent = data.location;
    catGenderLocDiv.appendChild(locationSpan);

    const evaluationSpan = document.createElement('span');
    evaluationSpan.className = 'evaluation-btn';
    evaluationSpan.textContent = data.can_evaluate;
    catGenderLocDiv.appendChild(evaluationSpan);

    detail_container.appendChild(catGenderLocDiv);


    // 회의 참석자
    const membersDiv = document.createElement('div');
    membersDiv.classList.add('memberdiv')
    membersDiv.textContent='<퀵매치 멤버 목록>'
    for (let member of data.meeting_member) {
        const memberSpan = document.createElement('span');
        const displayName = member.nickname || member.email;
        memberSpan.textContent = `${displayName} : (${member.position_display}) (${member.activity_point})`;
        
        membersDiv.appendChild(memberSpan);


        // 각 회원에 대한 평가 버튼 추가
        if ((member.id !== currentUserId) && (data.can_evaluate)) {
            const evaluateButton = document.createElement('button');
            evaluateButton.textContent = '평가하기';
            evaluateButton.classList.add('evaluate-btn');
            evaluateButton.addEventListener('click', function() {
                evaluateMember(member.id, data.id);
            });
            membersDiv.appendChild(evaluateButton);
        }
    }
    detail_container.appendChild(membersDiv);
}

async function errorhandle(){
    if (localStorage.getItem('userEmail')){
        await tokenRefresh();
        
        const p = await axios.get(`https://54.248.217.183/player/check/email/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        
        p.URLSearchParamsthen(response=>{
            UserId = response.data.id;
            return response.data;
        })
        .catch(error =>{
            console.error('error occure:', error);
        })
    }
    else{
        navigateToLoginPage();
    }
}


async function loadpage() {    
    const meetingId = new URLSearchParams(window.location.search).get('meeting_id');

    // getUserInfo 함수를 호출하여 사용자 정보를 가져옴
    const userInfo = await getUserInfo();
    UserId = userInfo.id || null;

    const meetingDetail = await getMeetingDetail(meetingId);
    render_details(meetingDetail, UserId);

    const isMember = await checkMembership(meetingId);
    toggleUIBasedOnMembership(isMember);

    // 로그인 한 사용자와 작성자가 동일하면 삭제 버튼 표시.
    if (UserId === meetingDetail.organizer) {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '미팅 삭제';
        deleteBtn.type = 'button';
        deleteBtn.onclick = deleteMeeting;
        document.querySelector('#button_group').append(deleteBtn);

        document.querySelector('#button_group').appendChild(statusDropdown);
    } else {
        // 작성자가 아닐 경우 드롭다운 숨기기
        if(statusDropdown.parentElement) {
            statusDropdown.parentElement.removeChild(statusDropdown);
        }
    }
}


// 모임 삭제 함수
async function deleteMeeting() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const value = urlParams.get('meeting_id');
    console.log('delete로 들어왔다! meeting_id : ', value);

    // 삭제 요청
    try {
        const response = await axios.post(`https://exercisehub.xyz/quickmatch/${value}/delete/`, {}, {
            headers : {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.status === 200) {
            alert('모임이 성공적으로 삭제되었습니다.');
            window.location.href='quickmatch-list.html';
        // UI 업데이트 또는 추가 작업
        } else if(response.status === 401 ){
            // UnAuthorization
            if (localStorage.getItem('userEmail')){
                tokenRefresh();
            }
            else{
                navigateToLoginPage();
            }
        } else {
            alert('모임 삭제에 실패하였습니다.');
        }
    } catch (error) {
        alert('모임 삭제에 실패하였습니다.');
        console.error('에러발생했습니다.', error)
    }
}


// 모임 상태 변경 함수
async function statusChange() {
    const newStatus = this.value;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const value = urlParams.get('meeting_id');

    if (!value) {
        alert('Failed to retrieve meeting ID from the URL.');
        return;
    }

    try {
        const response = await axios.post(`https://exercisehub.xyz/quickmatch/${value}/status/`, {status: newStatus}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.status === 200) {
            alert('모임의 상태가 성공적으로 변경되었습니다.');
            
            // 상태 변경 후 미팅의 세부 정보를 다시 가져옵니다.
            const detailResponse = await axios.get(`https://exercisehub.xyz/quickmatch/${value}/detail/`);
            const responsedata = detailResponse.data;
            render_details(responsedata, UserId);
            location.reload();
        } else {
            alert('상태변경에 실패하였습니다.');
        }
    } catch (error) {
        alert('상태변경에 실패하였습니다.');
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
        const response = await axios.post(`https://exercisehub.xyz/quickmatch/join/${value}/`, {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.status === 200) {
            document.getElementById('attend_btn').style.display = 'none';
            document.getElementById('leave_btn').style.display = 'block';
            alert('모임 참석에 성공하였습니다.');
            location.reload();
            
        } else if(response.status === 401 ){
            // UnAuthorization
            if (localStorage.getItem('userEmail')){
                tokenRefresh();
            }
            else{
                navigateToLoginPage();
            }
        } else {
        alert('모임 참석에 실패하였습니다.');
        }
    } catch (error) {
        alert('모임 참석에 실패하였습니다.');
    }
}

// 모임 떠나기
async function leaveMeeting() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const value = urlParams.get('meeting_id');

    if (!value) {
        alert('URL에서 회의 ID를 가져오는 데 실패했습니다.');
        return;
    }

    try {
        const response = await axios.post(`https://exercisehub.xyz/quickmatch/leave/${value}/`, {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.status === 200) {
            alert('회의를 성공적으로 떠났습니다.');
            // 성공적으로 회의를 떠난 후 참가 버튼을 표시하고 나가기 버튼을 숨깁니다.
            document.getElementById('attend_btn').style.display = 'block';
            document.getElementById('leave_btn').style.display = 'none';

            return axios.get(`https://exercisehub.xyz/quickmatch/${value}/detail/`);
        } else if(response.status === 401 ){
            // UnAuthorization
            if (localStorage.getItem('userEmail')){
                tokenRefresh();
            }
            else{
                navigateToLoginPage();
            }
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


// 회원평가 처리 함수
async function evaluateMember(memberId, meetingId) {
    try {
        const response = await axios.post(`https://exercisehub.xyz/quickmatch/evaluate_member/${memberId}/${meetingId}/`, {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.status === 200) {
            alert('회원 평가에 성공했습니다.');
            location.reload();
        } else if(response.status === 401 ){
            // UnAuthorization
            if (localStorage.getItem('userEmail')){
                tokenRefresh();
            }
            else{
                navigateToLoginPage();
            }
        } else {
            alert(response.data.status);
        }
    } catch (error) {
        alert('회원 평가에 실패했습니다.');
        console.error('오류가 발생했습니다.', error);
    }
}

// 채팅 페이지 접속
function getChat(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const value = urlParams.get('meeting_id');

    console.log('chatting start!');
    window.location = '../quickmatch/quickmatch-chat.html?meeting_id=' + encodeURIComponent(value);
}

document.getElementById('attend_btn').addEventListener('click', attendMeeting);

