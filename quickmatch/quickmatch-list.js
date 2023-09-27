window.onload = function() {
    // 미팅 전체 목록 가져오기
    // 54.248.217.183
    axios.get('http://54.248.217.183/quickmatch/list/')
        .then(response => populateMeetingList(response.data))
        .catch(error => console.error('Error fetching meetings:', error));

    // 검색 버튼에 이벤트 리스너 추가
    document.getElementById('searchBtn').addEventListener('click', function() {
        const searchTerm = document.getElementById('searchInput').value;
        axios.get('http://54.248.217.183/quickmatch/search/', { params: { search: searchTerm } })
            .then(response => populateMeetingList(response.data))
            .catch(error => console.error('Error fetching meetings:', error));
    });
}

function populateMeetingList(data) {
    const meetingList = document.getElementById('meetingList');
    meetingList.innerHTML = ''; 
    data.forEach(meeting => {
        const meetingItem = document.createElement('div');
        meetingItem.className = 'meeting-item';

        // Header: Created_at과 Status
        const meetingHeader = document.createElement('div');
        meetingHeader.className = 'meeting-header';
        const createdAt = document.createElement('span');
        createdAt.className = 'careated'
        createdAt.textContent = meeting.created_at.split("T")[0];  
        const status = document.createElement('span');
        status.className = 'status'
        status.textContent = meeting.status;  
        meetingHeader.appendChild(createdAt);
        meetingHeader.appendChild(status);

        // 제목
        const title = document.createElement('h2');
        title.textContent = meeting.title;

        // 태그: Category, Location 및 Details 버튼
        const meetingTags = document.createElement('div');
        meetingTags.className = 'meeting-tags';
        const category = document.createElement('span');
        category.className = 'category';
        category.textContent = meeting.category;

        const location = document.createElement('span');
        location.className = 'location';
        location.textContent = meeting.location;

        const detailBtn = document.createElement('button');
        detailBtn.className = 'detail-btn';
        detailBtn.textContent = '세부 사항 보기';
        detailBtn.onclick = function() {
            window.location.href = 'quickmatch-detail.html?meeting_id='+ encodeURIComponent(meeting.id);
        }
        meetingTags.appendChild(category);
        meetingTags.appendChild(location);
        meetingTags.appendChild(detailBtn);

        // // 참가 버튼
        // const joinBtn = document.createElement('button');
        // joinBtn.className = 'join-btn';
        // joinBtn.textContent = '참석하기';
        // joinBtn.onclick = function() {
        //     axios.post('http://54.248.217.183/quickmatch/join/', { meeting_id: meeting.id })
        //     .then(response => {
        //         if(response.data.success) {
        //             joinBtn.textContent = '참석 중';
        //             joinBtn.disabled = true;

        //             const allJoinButtons = document.querySelectorAll('.join-btn');
        //             allJoinButtons.forEach(btn => {
        //                 if (btn !== joinBtn) btn.style.display = 'none';
        //             });
        //         }
        //     })
        //     .catch(error => console.error('미팅 참석 오류:', error));
        // }
        // meetingItem.appendChild(joinBtn);

        meetingItem.appendChild(meetingHeader);
        meetingItem.appendChild(title);
        meetingItem.appendChild(meetingTags);

        meetingList.appendChild(meetingItem);
    });
}
