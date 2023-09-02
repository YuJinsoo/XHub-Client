document.getElementById('passwordChangeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    try {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;

        const response = await axios.put('http://54.248.217.183/player/update/ps/', {
            current_password: currentPassword,
            new_password: newPassword
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.status === 200) {
            alert('비밀번호가 성공적으로 변경되었습니다.');
            document.location.href = "profile_edit.html"
        } else {
            alert('비밀번호 변경에 실패하였습니다.');
        }
    } catch (error) {
        console.error('Failed to change password:', error);
    }
});
