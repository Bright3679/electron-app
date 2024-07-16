function fetchData() {
    const token = localStorage.getItem('token')
    fetch('http://localhost:3000/api/getUserDetails', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        // .then(data => {
        //     console.log('User data:', data);
        //     // Example: Display user data in the console
        //     // alert(`username : ${data.name}, password: ${data.password}`); // Modify as per your data structure
        // })
        .catch(error => {
            console.error('Error fetching user data:', error);
            alert('Failed to fetch user data. Please try again later.');
        });
}


