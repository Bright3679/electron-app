// document.getElementById('registerBtn').addEventListener('click', async () => {
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     try {
//         const response = await fetch('http://localhost:3000/api/register', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ username, password })
//         });
//         const data = await response.json();

//         if (response.ok) {
//             document.getElementById('message').innerText = 'User registered successfully!';
//             Swal.fire({
//                 title: "Success",
//                 text: "User registered successfully!",
//                 icon: "success",
//                 backdrop: false
//             }).then(() => {
//                 window.location.href = '../pages/login.html';
//             })
//         } else {
//             document.getElementById('message').innerText = data.message;
//             Swal.fire({
//                 title: "Error",
//                 text: data.message,
//                 icon: "error",
//                 backdrop: false
//             });
//         }
//     } catch (err) {
//         console.error(err);
//         document.getElementById('message').innerText = `Error: ${err.message}`;
//         Swal.fire({
//             title: "Error",
//             text: err.message,
//             icon: "error",
//             backdrop: false
//         });
//     }
// });

document.addEventListener("DOMContentLoaded", function () {
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const showPassword = document.getElementById("showPassword");
    const message = document.getElementById("message");
    const registerBtn = document.getElementById("registerBtn");

    username.addEventListener('input', function () {
        if (username.value.length < 3) {
            username.setCustomValidity('Username must be at least 3 characters long.');
            username.reportValidity();
        } else {
            username.setCustomValidity('');
        }
    });

    password.addEventListener('input', function () {
        if (password.value.length < 6) {
            password.setCustomValidity('Password must be at least 6 characters long.');
            password.reportValidity();
        } else {
            password.setCustomValidity('');
        }
    });

    function checkPasswordMatch() {
        if (password.value === confirmPassword.value) {
            message.style.color = "green";
            message.textContent = "Passwords match.";
        } else {
            message.style.color = "red";
            message.textContent = "Passwords do not match.";
        }
    }

    ['copy', 'paste', 'cut'].forEach(event => {
        password.addEventListener(event, function (e) {
            e.preventDefault();
        });
    });

    ['copy', 'paste', 'cut'].forEach(event => {
        confirmPassword.addEventListener(event, function (e) {
            e.preventDefault();
        });
    });

    password.addEventListener("input", checkPasswordMatch);
    confirmPassword.addEventListener("input", checkPasswordMatch);

    showPassword.addEventListener("change", function () {
        const type = showPassword.checked ? "text" : "password";
        password.setAttribute("type", type);
        confirmPassword.setAttribute("type", type);
    });

    registerBtn.addEventListener("click", async () => {
        const usernameValue = username.value;
        const passwordValue = password.value;

        if (usernameValue.length < 3) {
            Swal.fire({
                title: "Error",
                text: "Username must be at least 3 characters long.",
                icon: "error",
                backdrop: false,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        if (passwordValue.length < 6) {
            Swal.fire({
                title: "Error",
                text: "Password must be at least 6 characters long.",
                icon: "error",
                backdrop: false,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        if (passwordValue !== confirmPassword.value) {
            Swal.fire({
                title: "Error",
                text: "Passwords do not match!",
                icon: "error",
                backdrop: false,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: usernameValue, password: passwordValue })
            });
            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "Success",
                    text: "User registered successfully!",
                    icon: "success",
                    backdrop: false,
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = '../pages/login.html';
                });
            } else {
                message.innerText = data.message;
                Swal.fire({
                    title: "Error",
                    text: data.message,
                    icon: "error",
                    backdrop: false,
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        } catch (err) {
            console.error(err);
            message.innerText = `Error: ${err.message}`;
            Swal.fire({
                title: "Error",
                text: err.message,
                icon: "error",
                backdrop: false,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }
    });
});
