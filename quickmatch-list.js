window.onload = function() {
    // 미팅 전체 목록 가져오기
    // localhost
    axios.get('http://localhost/quickmatch/list/')
        .then(response => populateMeetingList(response.data))
        .catch(error => console.error('Error fetching meetings:', error));

    // 검색 버튼에 이벤트 리스너 추가
    document.getElementById('searchBtn').addEventListener('click', function() {
        const searchTerm = document.getElementById('searchInput').value;
        axios.get('http://localhost/quickmatch/search/', { params: { search: searchTerm } })
            .then(response => populateMeetingList(response.data))
            .catch(error => console.error('Error fetching meetings:', error));
    });
}

function populateMeetingList(data) {
    const meetingList = document.getElementById('meetingList');
    meetingList.innerHTML = '';  // 기존 목록을 초기화합니다.
    data.forEach(meeting => {
        const meetingItem = document.createElement('div');
        meetingItem.className = 'meeting-item';

        const title = document.createElement('h2');
        title.textContent = meeting.title;

        const description = document.createElement('p');
        description.textContent = meeting.description;

        const joinBtn = document.createElement('button');
        joinBtn.className = 'join-btn';
        joinBtn.textContent = '참석하기';
        joinBtn.onclick = function() {
            axios.post('http://localhost/quickmatch/join/', { meeting_id: meeting.id })
            .then(response => {
                if(response.data.success) {
                    // 참석 버튼을 "참석중"으로 변경
                    joinBtn.textContent = '참석중';
                    joinBtn.disabled = true;

                    // 모든 다른 "참석하기" 버튼 숨기기
                    const allJoinButtons = document.querySelectorAll('.join-btn');
                    allJoinButtons.forEach(btn => {
                        if (btn !== joinBtn) btn.style.display = 'none';
                    });
                }
            })
            .catch(error => console.error('Error joining meeting:', error));
        }
        const detailBtn = document.createElement('button');
        detailBtn.className = 'detail-btn';
        detailBtn.textContent = '상세보기';
        detailBtn.onclick = function() {
            // 상세보기 로직 구현
            window.location.href = 'quickmatch-detail.html?meeting_id='+ encodeURIComponent(meeting.id)
        }

        meetingItem.appendChild(title);
        meetingItem.appendChild(description);
        meetingItem.appendChild(joinBtn);
        meetingItem.appendChild(detailBtn);

        meetingList.appendChild(meetingItem);
    });
}
