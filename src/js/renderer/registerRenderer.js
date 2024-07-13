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

    function checkPasswordMatch() {
        if (password.value === confirmPassword.value) {
            message.style.color = "green";
            message.textContent = "Passwords match.";
        } else {
            message.style.color = "red";
            message.textContent = "Passwords do not match.";
        }
    }

    password.addEventListener("input", checkPasswordMatch);
    confirmPassword.addEventListener("input", checkPasswordMatch);

    showPassword.addEventListener("change", function () {
        const type = showPassword.checked ? "text" : "password";
        password.setAttribute("type", type);
        confirmPassword.setAttribute("type", type);
    });


    registerBtn.addEventListener("click", async () => {
        if (password.value !== confirmPassword.value) {
            Swal.fire({
                title: "Error",
                text: "Passwords do not match!",
                icon: "error",
                backdrop: false
            });
            return;
        }

        const usernameValue = username.value;
        const passwordValue = password.value;

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
                // message.innerText = 'User registered successfully!';
                Swal.fire({
                    title: "Success",
                    text: "User registered successfully!",
                    icon: "success",
                    backdrop: false
                }).then(() => {
                    window.location.href = '../pages/login.html';
                });
            } else {
                message.innerText = data.message;
                Swal.fire({
                    title: "Error",
                    text: data.message,
                    icon: "error",
                    backdrop: false
                });
            }
        } catch (err) {
            console.error(err);
            message.innerText = `Error: ${err.message}`;
            Swal.fire({
                title: "Error",
                text: err.message,
                icon: "error",
                backdrop: false
            });
        }
    });
});
