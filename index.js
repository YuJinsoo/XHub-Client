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
