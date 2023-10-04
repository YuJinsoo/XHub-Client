import { tokenRefresh, navigateToLoginPage } from "../scripts/token.js";

// 페이지가 로드될 때 초기화 작업을 수행합니다.
window.addEventListener('load', function() {
    // 초기 설정 코드 (예: 로그인 상태 확인, UI 초기화 등)
});

function test() {
    console.log('test');
    console.log(document.getElementById('eventTitle').value);
    console.log(document.getElementById('eventDescription').value);
    console.log(document.getElementById('selectCategory').value);
    console.log(document.getElementById('selectGenderLimit').value);
    console.log(document.getElementById('eventAgeLimit').value);
}

// 모임 생성 함수
async function createMeeting() {
    const eventTitle = document.getElementById('eventTitle').value;
    const eventDescription = document.getElementById('eventDescription').value;
    const eventCategory = document.getElementById('selectCategory').value;
    const eventGenderLimit = document.getElementById('selectGenderLimit').
    value;
    const eventAgeLimit = document.getElementById('eventAgeLimit').value;
    const eventLocation = document.getElementById('eventLocation').value;
    const eventMax = document.getElementById('eventMax').value;

    // const data = {
    //     title: eventTitle,
    //     description: eventDescription,
    //     age_limit: eventAgeLimit,
    //     category: eventCategory,
    //     gender_limit: eventGenderLimit,
    //     location: eventLocation,
    //     max_participants: eventMax
    // };
    const data = {
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDescription').value,
        age_limit: document.getElementById('eventAgeLimit').value,
        category: document.getElementById('selectCategory').value,
        gender_limit: document.getElementById('selectGenderLimit').
        value,
        location: document.getElementById('eventLocation').value,
        max_participants: document.getElementById('eventMax').value
    };

    try {
        const formData = new FormData();
        formData.append('title', eventTitle);
        formData.append('description', eventDescription);
        formData.append('age_limit', eventAgeLimit);
        formData.append('category', eventCategory);
        formData.append('gender_limit', eventGenderLimit);
        formData.append('location', eventLocation);
        formData.append('max_participants', eventMax);


        const response = await axios.post('http://54.248.217.183/quickmatch/create/', data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        console.log('wait to get response...');
        
        if (response.status === 200) {
        alert('모임이 성공적으로 생성되었습니다.');
        window.location.href = 'quickmatch-list.html';
        } else {
        console.log(response.error)
        alert('모임 생성에 실패하였습니다.111');
        }
        if (error.response.status == 401){
            // UnAuthorization
            if (localStorage.getItem('userEmail')){
                alert('토큰 재발급...');
                tokenRefresh();
            }
            else{
                alert('로그인이 필요합니다.');
                navigateToLoginPage();
            }
        }
        else{
            console.error('에러발생: ', error)
            return error;
        }
    } catch (error) {
        alert('모임 생성에 실패하였습니다.222');
        error => console.error('Error create meeting:', error)
    }
}

// 모임 삭제 함수
async function deleteEvent() {
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
async function attendEvent() {
const eventName = document.getElementById('eventName').value;

try {
    const response = await axios.post(`/api/events/${eventName}/attend`);

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
