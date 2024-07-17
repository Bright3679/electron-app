function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}

function checkTokenExpiration() {
    const token = localStorage.getItem('token');
    if (!token) {
        logout();
        return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiration = payload.exp * 1000;

    if (Date.now() >= expiration) {
        alert('Session expired. Logging out.');
        logout();
    }
}

function fetchWithAuth(url, options = {}) {
    checkTokenExpiration();

    const token = localStorage.getItem('token');

    if (!token) {
        return;
    }

    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    fetch(url, options)
        .then(response => {
            if (response.status === 403) {
                alert('Session expired. Logging out.');
                logout();
            } else if (response.status === 401) {
                alert('Unauthorized. Please log in.');
                logout();
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data) {
                console.log(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export { checkTokenExpiration, fetchWithAuth };
