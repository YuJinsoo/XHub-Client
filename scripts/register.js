// 회원가입 함수
async function signup() {
    var email = document.getElementById('signupEmail').value;
    var password = document.getElementById('signupPassword').value;

    try {
        // Axios를 사용하여 서버에 회원가입 요청을 보냅니다.
        const response = await axios.post('http://localhost/player/register/', {
            email: email,
            password: password
        });

        // 회원가입 성공
        if (response.status === 201) {
            alert('회원가입 성공');
            document.location.href = 'login.html';
        }
    } catch (error) {
        // 회원가입 실패
        console.log(error.response.data);
        alert('회원가입 실패');
    }
}
