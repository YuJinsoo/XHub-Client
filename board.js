// 페이지가 로드될 때 초기화 작업을 수행합니다.
window.addEventListener('load', function() {
    // 초기 설정 코드 (예: 로그인 상태 확인, UI 초기화 등)
  });
  
// 그룹 생성 함수
async function createGroup() {
  const groupName = document.getElementById('groupName').value;

  try {
    const response = await axios.post('http://54.248.217.183/board/write/', {
      name: groupName
    });

    if (response.status === 200) {
      alert('그룹이 성공적으로 생성되었습니다.');
      // UI 업데이트 또는 추가 작업
    } else {
      alert('그룹 생성에 실패하였습니다.');
    }
  } catch (error) {
    alert('그룹 생성에 실패하였습니다.');
  }
}

// 그룹 삭제 함수
async function deleteGroup() {
  const groupName = document.getElementById('groupName').value;

  try {
    const response = await axios.delete(`http://54.248.217.183/board/${groupName}/delete/`);

    if (response.status === 200) {
      alert('그룹이 성공적으로 삭제되었습니다.');
      // UI 업데이트 또는 추가 작업
    } else {
      alert('그룹 삭제에 실패하였습니다.');
    }
  } catch (error) {
    alert('그룹 삭제에 실패하였습니다.');
  }
}
