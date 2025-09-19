document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    // Check admin access first
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize form handlers
    const articleForm = document.getElementById('articleForm');
    if (articleForm) {
        articleForm.addEventListener('submit', handleArticleSubmit);
    }

    // Load initial content
    showSection('create');
    loadArticlesList();
    loadUsersList();
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Remove active class from sidebar links
    const sidebarLinks = document.querySelectorAll('.admin-sidebar a');
    sidebarLinks.forEach(link => link.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionName + 'Section').classList.add('active');
    
    // Add active class to clicked link
    event.target.classList.add('active');

    // Load section-specific content
    if (sectionName === 'manage') {
        loadArticlesList();
    } else if (sectionName === 'users') {
        loadUsersList();
    }
}

function handleArticleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const articleData = {
        title: formData.get('title'),
        category: formData.get('category'),
        author: formData.get('author'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        imageUrl: formData.get('imageUrl') || '',
        featured: formData.get('featured') === 'on'
    };

    try {
        addArticle(articleData);
        showAdminMessage('Article published successfully!', 'success');
        e.target.reset();
        loadArticlesList(); // Refresh the articles list
    } catch (error) {
        showAdminMessage('Error publishing article!', 'error');
    }
}

function loadArticlesList() {
    const articlesContainer = document.getElementById('articlesList');
    if (!articlesContainer) return;

    const articles = getArticles();
    
    if (articles.length === 0) {
        articlesContainer.innerHTML = '<p>No articles found.</p>';
        return;
    }

    articlesContainer.innerHTML = articles.map(article => `
        <div class="article-item">
            <div class="article-item-content">
                <h4>${article.title}</h4>
                <p>Category: ${article.category} | Author: ${article.author} | Date: ${formatDate(article.date)}</p>
                <p>${article.excerpt}</p>
                ${article.featured ? '<span class="article-category">FEATURED</span>' : ''}
            </div>
            <div class="article-actions">
                <button class="edit-btn" onclick="editArticle(${article.id})">Edit</button>
                <button class="delete-btn" onclick="deleteArticleConfirm(${article.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function loadUsersList() {
    const usersContainer = document.getElementById('usersList');
    if (!usersContainer) return;

    const users = getUsers();
    
    if (users.length === 0) {
        usersContainer.innerHTML = '<p>No users found.</p>';
        return;
    }

    usersContainer.innerHTML = users.map(user => `
        <div class="article-item">
            <div class="article-item-content">
                <h4>${user.firstName} ${user.lastName}</h4>
                <p>Email: ${user.email}</p>
                <p>Account Type: ${user.isAdmin ? 'Admin' : 'Regular User'}</p>
            </div>
            <div class="article-actions">
                <button class="delete-btn" onclick="deleteUserConfirm(${user.id})">Delete User</button>
            </div>
        </div>
    `).join('');
}

function editArticle(articleId) {
    const articles = getArticles();
    const article = articles.find(a => a.id === articleId);
    
    if (!article) return;

    // Fill the form with article data
    document.getElementById('title').value = article.title;
    document.getElementById('category').value = article.category;
    document.getElementById('author').value = article.author;
    document.getElementById('excerpt').value = article.excerpt;
    document.getElementById('content').value = article.content;
    document.getElementById('imageUrl').value = article.imageUrl || '';
    document.getElementById('featured').checked = article.featured;

    // Switch to create section for editing
    showSection('create');
    
    // Change form submit to update instead of create
    const form = document.getElementById('articleForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        updateArticle(articleId, e);
    };

    showAdminMessage('Article loaded for editing', 'success');
}

function updateArticle(articleId, e) {
    const formData = new FormData(e.target);
    const articles = getArticles();
    const articleIndex = articles.findIndex(a => a.id === articleId);
    
    if (articleIndex === -1) return;

    articles[articleIndex] = {
        ...articles[articleIndex],
        title: formData.get('title'),
        category: formData.get('category'),
        author: formData.get('author'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        imageUrl: formData.get('imageUrl') || '',
        featured: formData.get('featured') === 'on'
    };

    showAdminMessage('Article updated successfully!', 'success');
    
    // Reset form to create mode
    e.target.reset();
    e.target.onsubmit = handleArticleSubmit;
    
    loadArticlesList();
}

function deleteArticleConfirm(articleId) {
    if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
        if (deleteArticle(articleId)) {
            showAdminMessage('Article deleted successfully!', 'success');
            loadArticlesList();
        } else {
            showAdminMessage('Error deleting article!', 'error');
        }
    }
}

function deleteUserConfirm(userId) {
    if (confirm('Are you sure you want to delete this user account? This action cannot be undone.')) {
        // This would delete the user in a real application
        showAdminMessage('User deletion feature would be implemented here', 'success');
    }
}

function showAdminMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.admin-main .error, .admin-main .success');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    
    const adminMain = document.querySelector('.admin-main');
    adminMain.insertBefore(messageDiv, adminMain.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}
