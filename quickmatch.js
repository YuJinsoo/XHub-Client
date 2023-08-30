// 페이지가 로드될 때 초기화 작업을 수행합니다.
window.addEventListener('load', function() {
    // 초기 설정 코드 (예: 로그인 상태 확인, UI 초기화 등)
});

// 모임 생성 함수
async function createEvent() {
const eventName = document.getElementById('eventName').value;
const eventDate = document.getElementById('eventDate').value;

try {
    const response = await axios.post('/api/events', {
    name: eventName,
    date: eventDate
    });

    if (response.status === 200) {
    alert('모임이 성공적으로 생성되었습니다.');
    // UI 업데이트 또는 추가 작업
    } else {
    alert('모임 생성에 실패하였습니다.');
    }
} catch (error) {
    alert('모임 생성에 실패하였습니다.');
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
