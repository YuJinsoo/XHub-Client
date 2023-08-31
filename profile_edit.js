const emailInput = document.getElementById('email');
const activityPointInput = document.getElementById('activity_point');
const profileImgInput = document.getElementById('profile_img');
// ... Other fields ...

async function fetchProfile() {
    try {
        const response = await axios.get('http://localhost/player/update/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        const data = response.data;
        emailInput.value = data.email;
        activityPointInput.value = data.activity_point;
        // ... Populate other fields ...

    } catch (error) {
        console.error('Failed to fetch profile:', error);
    }
}

async function submitProfile() {
    try {
        const formData = new FormData();
        formData.append('profile_img', profileImgInput.files[0]);
        formData.append('age', document.getElementById('age').value);
        // ... Append other fields ...

        const response = await axios.put('http://localhost/player/update/', formData);

        if (response.status === 200) {
            alert('회원정보가 성공적으로 수정되었습니다.');
        } else {
            alert('회원정보 수정에 실패하였습니다.');
        }
    } catch (error) {
        console.error('Failed to update profile:', error);
    }
}

function goToPasswordChange() {
    // Redirect to password change page
    window.location.href = '/path/to/password/change';
}

// Fetch profile on page load
window.onload = fetchProfile;
