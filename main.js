// Sample articles data (in a real app, this would come from a database)
let articles = [
    {
        id: 1,
        title: "Anderson CVI Wins Regional Basketball Championship",
        category: "sports",
        author: "Sports Staff",
        date: "2025-09-15",
        excerpt: "Our basketball team secured a thrilling victory in the regional championship game last Friday.",
        content: "In an exciting match that went into overtime, Anderson CVI's basketball team defeated Central High 78-76 to claim the regional championship. The team showed incredible determination and skill throughout the tournament. Senior captain Mike Johnson led the team with 25 points and 8 rebounds. The victory qualifies the team for the state championships next month.",
        imageUrl: "",
        featured: true
    },
    {
        id: 2,
        title: "Science Fair Showcases Student Innovation",
        category: "academics",
        author: "Academic Staff",
        date: "2025-09-12",
        excerpt: "Students presented remarkable projects at this year's annual science fair.",
        content: "The annual Anderson CVI Science Fair took place last week, featuring over 50 innovative projects from students across all grade levels. This year's theme was 'Sustainable Solutions for Tomorrow.' Projects ranged from renewable energy solutions to environmental conservation methods. First place went to senior Sarah Chen for her project on solar-powered water purification systems.",
        imageUrl: "",
        featured: false
    },
    {
        id: 3,
        title: "Fall Dance Registration Now Open",
        category: "events",
        author: "Student Council",
        date: "2025-09-10",
        excerpt: "Don't miss out on the biggest social event of the semester!",
        content: "Registration for the Fall Formal Dance is now open! The event will take place on October 15th in the school gymnasium, which will be transformed into an autumn wonderland. Tickets are $25 per person or $45 per couple. The theme this year is 'Autumn Elegance.' Registration forms are available in the main office or online through the student portal.",
        imageUrl: "",
        featured: true
    }
];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadPageContent();
});

// Initialize Navigation
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Update account button based on login status
    updateAccountButton();
}

// Load Page Content
function loadPageContent() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
        case '':
            loadHomePage();
            break;
        case 'article.html':
            loadArticlePage();
            break;
        case 'category.html':
            loadCategoryPage();
            break;
    }
}

// Load Home Page Content
function loadHomePage() {
    loadFeaturedNews();
    loadLatestArticles();
}

// Load Featured News
function loadFeaturedNews() {
    const featuredContainer = document.getElementById('featuredNews');
    if (!featuredContainer) return;

    const featuredArticles = articles.filter(article => article.featured);
    
    featuredContainer.innerHTML = featuredArticles.map(article => 
        createArticleCard(article)
    ).join('');
}

// Load Latest Articles
function loadLatestArticles() {
    const articlesContainer = document.getElementById('latestArticles');
    if (!articlesContainer) return;

    const latestArticles = articles
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);
    
    articlesContainer.innerHTML = latestArticles.map(article => 
        createArticleCard(article)
    ).join('');
}

// Create Article Card HTML
function createArticleCard(article) {
    return `
        <div class="article-card" onclick="viewArticle(${article.id})">
            <div class="article-image">
                ${article.imageUrl ? 
                    `<img src="${article.imageUrl}" alt="${article.title}" style="width:100%;height:100%;object-fit:cover;">` : 
                    `<i class="fas fa-newspaper" style="font-size: 3rem;"></i>`
                }
            </div>
            <div class="article-content">
                <span class="article-category">${article.category.toUpperCase()}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-meta">
                    <span>By ${article.author}</span>
                    <span>${formatDate(article.date)}</span>
                </div>
            </div>
        </div>
    `;
}

// Load Article Page
function loadArticlePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = parseInt(urlParams.get('id'));
    
    const article = articles.find(a => a.id === articleId);
    
    if (!article) {
        document.getElementById('articleContent').innerHTML = '<h2>Article not found</h2>';
        return;
    }

    document.title = `${article.title} - Anderson CVI News`;
    
    document.getElementById('articleContent').innerHTML = `
        <div class="article-header">
            <span class="article-category">${article.category.toUpperCase()}</span>
            <h1 class="article-title">${article.title}</h1>
            <div class="article-meta">
                <span><i class="fas fa-user"></i> ${article.author}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(article.date)}</span>
                <span><i class="fas fa-folder"></i> ${article.category}</span>
            </div>
        </div>
        <div class="article-body">
            ${article.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
        </div>
    `;

    loadRelatedArticles(article.category, article.id);
}

// Load Related Articles
function loadRelatedArticles(category, currentId) {
    const relatedContainer = document.getElementById('relatedArticles');
    if (!relatedContainer) return;

    const relatedArticles = articles
        .filter(article => article.category === category && article.id !== currentId)
        .slice(0, 3);

    if (relatedArticles.length === 0) {
        relatedContainer.innerHTML = '<p>No related articles found.</p>';
        return;
    }

    relatedContainer.innerHTML = relatedArticles.map(article => `
        <div class="article-card" onclick="viewArticle(${article.id})">
            <h4>${article.title}</h4>
            <p>${article.excerpt}</p>
            <small>By ${article.author} • ${formatDate(article.date)}</small>
        </div>
    `).join('');
}

// Load Category Page
function loadCategoryPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat');
    
    if (!category) {
        document.getElementById('categoryTitle').textContent = 'All Articles';
        document.getElementById('categoryDescription').textContent = 'Browse all articles';
        loadCategoryArticles();
        return;
    }

    document.getElementById('categoryTitle').textContent = category.charAt(0).toUpperCase() + category.slice(1);
    document.getElementById('categoryDescription').textContent = `Browse articles in the ${category} category`;
    document.title = `${category.charAt(0).toUpperCase() + category.slice(1)} - Anderson CVI News`;
    
    loadCategoryArticles(category);
}

// Load Category Articles
function loadCategoryArticles(category = null) {
    const articlesContainer = document.getElementById('categoryArticles');
    if (!articlesContainer) return;

    const filteredArticles = category 
        ? articles.filter(article => article.category === category)
        : articles;

    if (filteredArticles.length === 0) {
        articlesContainer.innerHTML = '<p class="text-center">No articles found in this category.</p>';
        return;
    }

    articlesContainer.innerHTML = filteredArticles.map(article => 
        createArticleCard(article)
    ).join('');
}

// View Article Function
function viewArticle(articleId) {
    window.location.href = `article.html?id=${articleId}`;
}

// Format Date Function
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Update Account Button
function updateAccountButton() {
    const accountBtn = document.getElementById('accountBtn');
    if (!accountBtn) return;

    const currentUser = getCurrentUser();
    
    if (currentUser) {
        accountBtn.innerHTML = `${currentUser.firstName} <i class="fas fa-chevron-down"></i>`;
        accountBtn.onclick = showAccountMenu;
    } else {
        accountBtn.textContent = 'Login';
        accountBtn.onclick = () => window.location.href = 'login.html';
    }
}

// Show Account Menu
function showAccountMenu() {
    const currentUser = getCurrentUser();
    let menuHTML = `
        <div class="account-menu">
            <a href="#" onclick="logout()">Logout</a>
    `;
    
    if (currentUser && currentUser.isAdmin) {
        menuHTML += '<a href="admin.html">Admin Panel</a>';
    }
    
    menuHTML += '</div>';
    
    // This is a simplified version - in a real app you'd create a proper dropdown
    if (confirm('Account Menu:\n1. Logout' + (currentUser.isAdmin ? '\n2. Admin Panel' : ''))) {
        if (currentUser.isAdmin && confirm('Go to Admin Panel?')) {
            window.location.href = 'admin.html';
        } else {
            logout();
        }
    }
}

// Get Current User
function getCurrentUser() {
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Logout Function
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Add Article Function (used by admin)
function addArticle(articleData) {
    const newId = Math.max(...articles.map(a => a.id)) + 1;
    articles.push({
        ...articleData,
        id: newId,
        date: new Date().toISOString().split('T')[0]
    });
    return newId;
}

// Get Articles Function (used by admin)
function getArticles() {
    return articles;
}

// Delete Article Function (used by admin)
function deleteArticle(articleId) {
    const index = articles.findIndex(a => a.id === articleId);
    if (index > -1) {
        articles.splice(index, 1);
        return true;
    }
    return false;
}
