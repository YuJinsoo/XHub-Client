import { tokenRefresh, navigateToLoginPage } from "./token.js";

// 초기에 모든 섹션을 숨깁니다.
document.querySelectorAll('.section').forEach(function(section) {
    section.style.display = 'none';
});

// 특정 섹션만 표시하는 함수
function showSection(id) {
    // 모든 섹션을 숨깁니다.
    document.querySelectorAll('.section').forEach(function(section) {
        section.style.display = 'none';
    });
    // 선택한 섹션만 표시합니다.
    document.getElementById(id).style.display = 'block';
}

// 알림을 가져오는 함수
function fetchNotifications() {
    axios.get('http://54.248.217.183/quickmatch/notifications/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    .then(response => {
        const notifications = response.data;
        const notificationContent = document.getElementById('notificationContent');
        const notificationCount = document.getElementById('notificationCount');

        // 알림 내용 초기화
        notificationContent.innerHTML = '';

        // 각 알림에 대해 DOM 요소 추가
        notifications.forEach(notification => {
            const div = document.createElement('div');
            div.textContent = notification.message;
            
            // (선택적) 알림 클릭 시 읽음 처리
            div.addEventListener('click', () => {
                markNotificationAsRead(notification.id);
            });
            
            notificationContent.appendChild(div);
        });

        // 알림 개수 업데이트
        notificationCount.textContent = notifications.length;
    })
    .catch(error => {
        console.error('Error fetching notifications:', error);
        if (error.response.status == 401){
            // UnAuthorization
            if (localStorage.getItem('userEmail')){
                tokenRefresh();
            }
            else{
                navigateToLoginPage();
            }
        }
    });
}

// 특정 알림을 읽음으로 표시하는 함수
async function markNotificationAsRead(notificationId) {
    try {
        await axios.patch(`http://54.248.217.183/quickmatch/notifications/${notificationId}/`, {
            read: true
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        // 알림을 읽음으로 표시한 후 알림 목록을 다시 로드
        fetchNotifications();
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// 알림 드롭다운을 토글하는 함수
function toggleNotificationDropdown() {
    const content = document.getElementById('notificationContent');
    if(content.style.display === 'block') {
        content.style.display = 'none';
    } else {
        content.style.display = 'block';
    }
}

// 페이지 로드 시 알림을 가져옵니다.
window.addEventListener('load', fetchNotifications);
