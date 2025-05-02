

// Mock database for local testing (when no server is available)
const mockUsers = [
    // Pre-populate with some test users if needed
];


// Check if we're running from the file system
const isLocalFile = window.location.protocol === 'file:';


// Handle the login form submission
function handleLogin(event) {
    event.preventDefault();
   
    const form = document.getElementById('loginForm');
    const username = form.querySelector('input[name="username"]').value;
    const password = form.querySelector('input[name="password"]').value;
   
    // Basic validation
    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }
   
    if (isLocalFile) {
        // Local mock authentication
        const user = mockUsers.find(u => (u.email === username || u.username === username) && u.password === password);
       
        if (user) {
            alert('Login successful!');
            localStorage.setItem('user', JSON.stringify({
                id: user.id,
                username: user.username,
                email: user.email,
                status: user.status || 'active',
                image: user.image || null
            }));
            document.getElementById('loginModal').style.display = 'none';
            updateUIAfterLogin(user);
        } else {
            alert('Invalid username or password');
        }
    } else {
        // Server authentication
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: username, // Using username field for email
                password: password
            }),
            credentials: 'include' // Important: includes cookies in the request
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert('Login successful!');
                localStorage.setItem('user', JSON.stringify(data.user));
                document.getElementById('loginModal').style.display = 'none';
                updateUIAfterLogin(data.user);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    }
}


// Handle the signup form submission
function handleSignup(event) {
    event.preventDefault();
   
    const form = document.getElementById('signupForm');
    const username = form.querySelector('input[name="username"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const password = form.querySelector('input[name="password"]').value;
    const confirmPassword = form.querySelector('input[name="confirmPassword"]').value;
   
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
   
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
   
    // Password strength validation
    if (password.length < 10 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        alert('Password must be at least 10 characters and contain special characters');
        return;
    }
   
    if (isLocalFile) {
        // Local mock signup
        if (mockUsers.some(u => u.username === username)) {
            alert('Username already exists');
            return;
        }
       
        if (mockUsers.some(u => u.email === email)) {
            alert('Email already exists');
            return;
        }
       
        // Add new user to mock database
        const newUser = {
            id: Date.now(), // Generate a unique ID
            username: username,
            email: email,
            password: password, // In real app, this would be hashed
            status: 'active',
            image: null
        };
       
        mockUsers.push(newUser);
       
        alert('Account created successfully! Please log in.');
        switchModal('signupModal', 'loginModal');
    } else {
        // Server signup - FIXED for proper database storage
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                confirm_password: confirmPassword
            }),
            credentials: 'include' // Important: includes cookies in the request
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                console.error('Signup error:', data.error);
            } else {
                alert('Account created successfully! Please log in.');
                console.log('Signup success:', data.message);
                switchModal('signupModal', 'loginModal');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    }
}


// Toggle password visibility
function togglePassword(element) {
    const passwordInput = element.parentElement.querySelector('input');
   
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        element.setAttribute('data-lucide', 'eye-off');
    } else {
        passwordInput.type = 'password';
        element.setAttribute('data-lucide', 'eye');
    }
   
    // If using Lucide icons, refresh the icon
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}


// Switch between modals
function switchModal(fromModalId, toModalId) {
    const fromModal = document.getElementById(fromModalId);
    const toModal = document.getElementById(toModalId);
   
    if (fromModal) fromModal.style.display = 'none';
    if (toModal) toModal.style.display = 'flex';
}


// Show a modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
}


// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
        if (event.target === modals[i]) {
            modals[i].style.display = 'none';
        }
    }
};


// Update UI after login
function updateUIAfterLogin(user) {
    const loginBtn = document.querySelector('.login-btn');
    if (!loginBtn) return;
   
    // Change login button to username
    loginBtn.textContent = user.username;
    loginBtn.onclick = function() {
        showUserMenu();
    };
}


// Show user dropdown menu
function showUserMenu() {
    // Check if menu already exists and remove it if it does
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
   
    // Create menu
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.style.position = 'absolute';
    menu.style.top = '60px';
    menu.style.left = '20px';
    menu.style.background = 'transparent'; 
    menu.style.border = 'none';
    menu.style.boxShadow = 'none'; 
    menu.style.padding = '0'; 
    menu.style.zIndex = '1000';


   
    menu.innerHTML = `
    <button onclick="logout()" 
        style="
            background: linear-gradient(135deg,rgb(61, 125, 214),rgb(157, 169, 193));
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 9999px;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            font-family: 'Segoe UI', sans-serif;
            transition: transform 0.2s ease;
        "
        onmouseover="this.style.transform='scale(1.05)'"
        onmouseout="this.style.transform='scale(1)'"
    >
          Logout
    </button>
`;



   
    document.body.appendChild(menu);
   
    // Close menu when clicking elsewhere
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !document.querySelector('.login-btn').contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 0);
}


// Logout function
function logout() {
    if (!isLocalFile) {
        // Server logout - send request to clear server-side session if applicable
        fetch('/logout', {
            method: 'POST',
            credentials: 'include'
        }).catch(error => {
            console.error('Logout error:', error);
        });
    }
   
    // Clear user data from localStorage
    localStorage.removeItem('user');
   
    // Update UI to show logged out state
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.textContent = 'LOGIN';
        loginBtn.onclick = function() {
            showModal('loginModal');
        };
    }
   
    // Remove user menu if open
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) userMenu.remove();
}


// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    try {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            updateUIAfterLogin(user);
        }
       
        // Add debugging to monitor the network requests
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            console.log('Fetch request:', args);
            return originalFetch.apply(this, args)
                .then(response => {
                    console.log('Fetch response:', response.clone());
                    return response;
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    throw error;
                });
        };
    } catch (e) {
        console.error('Error checking login status:', e);
        localStorage.removeItem('user'); // Clear potentially corrupted data
    }
});

// Handle the image upload
document.addEventListener("DOMContentLoaded", function () {
    const imageUpload = document.getElementById("image-upload");
    const predictionResult = document.getElementById("prediction-result");
    const imagePreview = document.getElementById("uploaded-image");
    const loadingSpinner = document.getElementById("loading-spinner");


    imageUpload.addEventListener("change", handlePhotoUpload);


    function handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;


        // Afficher l'image téléchargée
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);


        // Afficher le spinner de chargement
        loadingSpinner.style.display = 'flex';
        predictionResult.innerHTML = '';


        const formData = new FormData();
        formData.append("image", file);


        fetch("/upload_image", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                predictionResult.innerHTML = `<p>Prediction: <strong>${data.prediction}</strong></p>`;
            } else {
                predictionResult.innerHTML = `<p style='color: red;'>Error: ${data.error}</p>`;
            }
        })
        .catch(error => {
            console.error("Error uploading image:", error);
            predictionResult.innerHTML = `<p style='color: red;'>Failed to process image.</p>`;
        })
        .finally(() => {
            // Masquer le spinner de chargement une fois le traitement terminé
            loadingSpinner.style.display = 'none';
        });
    }
});

