// Sample users data (in a real app, this would be stored in a database)
let users = [
    {
        id: 1,
        firstName: "Admin",
        lastName: "User",
        email: "admin@andersoncvi.edu",
        password: "admin123", // In real app, this would be hashed
        isAdmin: true
    }
];

// Admin emails that automatically get admin privileges (hardcoded for security)
const ADMIN_EMAILS = [
    "admin@andersoncvi.edu",
    "principal@andersoncvi.edu",
    "teacher@andersoncvi.edu"
];

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Check if user is logged in and on admin page
    if (window.location.pathname.includes('admin.html')) {
        checkAdminAccess();
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        showMessage('Login successful!', 'success');
        
        setTimeout(() => {
            if (user.isAdmin) {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1000);
    } else {
        showMessage('Invalid email or password!', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showMessage('Passwords do not match!', 'error');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        showMessage('Email already exists!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        firstName,
        lastName,
        email,
        password, // In real app, hash this password
        isAdmin: ADMIN_EMAILS.includes(email) // Automatically make admin if email is in admin list
    };
    
    users.push(newUser);
    
    showMessage('Account created successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function checkAdminAccess() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    if (!currentUser.isAdmin) {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'index.html';
        return;
    }
}

function getCurrentUser() {
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.error, .success');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    
    const form = document.querySelector('form');
    form.parentNode.insertBefore(messageDiv, form);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Function to get all users (for admin panel)
function getUsers() {
    return users.filter(user => !user.isAdmin); // Don't show admin users in user management
}
