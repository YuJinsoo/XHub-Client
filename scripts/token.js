async function tokenRefresh(){
    let RT_value = localStorage.getItem('refreshToken');
    let AC_value = localStorage.getItem('accessToken');
    
    const response = await axios.post('https://exercisehub.xyz/player/token/refresh/', {
        refresh: RT_value,
    },
    {
        headers:{
            // 'Authorization': `Bearer ${AC_value}`,
            'Content-Type': 'application/json'
        }
    }
    ).then(res => {
        console.log('hihihihihihihi');
        console.log(res);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.setItem('accessToken') = res.data.access;
        localStorage.setItem('refreshToken') = res.data.refresh;
    }).catch(error =>{
        console.log(error);
        if (error.response.data.code == 'token_not_valid'){
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userEmail');
            navigateToLoginPage();
        }
    })

}

function navigateToLoginPage(){
    console.log('로그인안됨!');
    // 기존 접속 페이지 url
    let nowUrl = window.location.href;
    // console.log(nowUrl);
    window.location.href = 'https://exercisehub.xyz/auth/login.html';
}


export {tokenRefresh, navigateToLoginPage};
