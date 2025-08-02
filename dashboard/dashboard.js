document.addEventListener('DOMContentLoaded', async () => {
    // --- Sample Data ---
    const availableProperties = [
        {
            id: 'prop1',
            title: 'Oceanview Villa',
            location: 'Malibu, California',
            price: '$4,500,000',
            img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60'
        },
        {
            id: 'prop2',
            title: 'Lakeside Retreat',
            location: 'Geneva, Switzerland',
            price: '$3,200,000',
            img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60'
        },
        {
            id: 'prop3',
            title: 'The Grand Suburban',
            location: 'Aspen, Colorado',
            price: '$2,800,000',
            img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60'
        },
        {
            id: 'prop4',
            title: 'Modern City Loft',
            location: 'New York, USA',
            price: '$1,950,000',
            img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60'
        },
        {
            id: 'prop5',
            title: 'Desert Oasis',
            location: 'Scottsdale, Arizona',
            price: '$2,400,000',
            img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60'
        }
    ];

    // --- UI ELEMENT SELECTORS ---
    const welcomeMessage = document.getElementById('welcome-message');
    const savedPropsCountEl = document.getElementById('saved-props-count');
    const savedPropsListEl = document.getElementById('saved-properties-list');
    const userButtonEl = document.getElementById('user-button');

    let currentUser = null;
    let activityChart = null;
    let mortgageChart = null;

    // --- SETUP UI LISTENERS IMMEDIATELY ---
    setupEventListeners();
    feather.replace(); // Render icons immediately

    // --- CLERK AUTHENTICATION ---
    const clerkPublishableKey = "pk_test_dWx0aW1hdGUtbGFyay02MC5jbGVyay5hY2NvdW50cy5kZXYk";
    
    async function startClerk() {
        const Clerk = window.Clerk;
        if (!Clerk) {
            console.error("Clerk.js not loaded.");
            return;
        }
        try {
            await Clerk.load({ publishableKey: clerkPublishableKey });
            Clerk.addListener(({ user }) => {
                if (user) {
                    currentUser = user;
                    initializeUserDashboard(user);
                } else {
                    currentUser = null;
                    window.location.href = '/'; 
                }
            });
        } catch (err) {
            console.error('Clerk Error:', err);
        }
    }
    startClerk();
    
    // --- INITIALIZE USER-SPECIFIC FUNCTIONALITY ---
    function initializeUserDashboard(user) {
        Clerk.mountUserButton(userButtonEl);
        welcomeMessage.textContent = `Welcome Back, ${user.firstName || user.primaryEmailAddress.emailAddress}!`;
        
        const savedProperties = getSavedProperties(user.id);
        renderSavedProperties(savedProperties);

        initActivityChart();
        initializeMortgageCalculator();
        initializeProfile(); // Call profile initialization here
    }

    // --- PROFILE HANDLING CODE ---
    async function initializeProfile() {
        try {
            await window.Clerk.load();
            const user = window.Clerk.user;

            if (user) {
                const profileContainer = document.getElementById('clerk-user-profile');
                const profileHTML = `
                    <div class="profile-info">
                        <div class="profile-header">
                            <img src="${user.imageUrl}" alt="Profile" class="profile-image">
                            <div class="profile-name">
                                <h3>${user.firstName} ${user.lastName}</h3>
                                <p>${user.primaryEmailAddress.emailAddress}</p>
                            </div>
                        </div>
                        <div class="profile-details">
                            <div class="detail-item">
                                <strong>Username:</strong> ${user.username || 'Not set'}
                            </div>
                            <div class="detail-item">
                                <strong>Email verified:</strong> ${user.primaryEmailAddress.verification.status === 'verified' ? 'Yes' : 'No'}
                            </div>
                            <div class="detail-item">
                                <strong>Member since:</strong> ${new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                `;
                profileContainer.innerHTML = profileHTML;
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    // --- LOCAL STORAGE "DATABASE" FUNCTIONS ---
    function getSavedProperties(userId) {
        try {
            const data = localStorage.getItem(`savedProperties_${userId}`);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Could not parse saved properties from localStorage", e);
            return [];
        }
    }
    function saveProperties(userId, properties) {
        localStorage.setItem(`savedProperties_${userId}`, JSON.stringify(properties));
    }
    function addSavedProperty(property) {
        if (!currentUser) return;
        const properties = getSavedProperties(currentUser.id);
        if (!properties.find(p => p.id === property.id)) {
            properties.push(property);
            saveProperties(currentUser.id, properties);
            renderSavedProperties(properties);
        }
    }
    function removeSavedProperty(propertyId) {
        if (!currentUser) return;
        let properties = getSavedProperties(currentUser.id);
        properties = properties.filter(p => p.id !== propertyId);
        saveProperties(currentUser.id, properties);
        renderSavedProperties(properties);
    }

    // --- UI RENDERING (WITH FIX) ---
    function renderSavedProperties(properties) {
        savedPropsListEl.innerHTML = '';
        savedPropsCountEl.textContent = properties.length;

        if (properties.length === 0) {
            savedPropsListEl.innerHTML = `
                <div id="no-saved-props" class="placeholder">
                    <i data-feather="list"></i>
                    <p>You haven't saved any properties yet. Click "Add New Property" to start building your collection.</p>
                </div>
            `;
            feather.replace(); 
        } else {
            properties.forEach(prop => {
                const card = document.createElement('div');
                card.className = 'property-card-saved';
                card.title = "Click to remove this property";
                card.innerHTML = `<img src="${prop.img}" alt="${prop.title}"><div class="property-card-details"><h3>${prop.title}</h3><p>${prop.location}</p></div>`;
                card.addEventListener('click', () => removeSavedProperty(prop.id));
                savedPropsListEl.appendChild(card);
            });
        }
    }
    
    // --- SETUP EVENT LISTENERS (RUNS ON PAGE LOAD) ---
    function setupEventListeners() {
        const navItems = document.querySelectorAll('.nav-item');
        const panels = document.querySelectorAll('.panel');
        const mainTitle = document.getElementById('main-title');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('data-target');
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                panels.forEach(panel => panel.classList.remove('active'));
                document.getElementById(targetId).classList.add('active');
                mainTitle.textContent = item.querySelector('span').textContent;
                if (window.innerWidth <= 992) document.querySelector('.sidebar').classList.remove('is-open');
            });
        });

        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        if (menuToggle && sidebar) menuToggle.addEventListener('click', () => sidebar.classList.toggle('is-open'));

        const modal = document.getElementById('add-property-modal');
        const addBtn = document.getElementById('add-property-btn');
        const closeBtn = modal.querySelector('.modal-close');
        if (addBtn) addBtn.onclick = () => {
            populateAvailableProperties();
            modal.style.display = 'flex';
        };
        if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (event) => {
            if (event.target == modal) modal.style.display = 'none';
        };
    }

    function populateAvailableProperties() {
        const availableList = document.getElementById('available-properties-list');
        const savedProperties = currentUser ? getSavedProperties(currentUser.id) : [];
        
        availableList.innerHTML = '';
        
        availableProperties
            .filter(prop => !savedProperties.some(saved => saved.id === prop.id))
            .forEach(prop => {
                const card = document.createElement('div');
                card.className = 'property-card-available';
                card.innerHTML = `
                    <div class="property-image">
                        <img src="${prop.img}" alt="${prop.title}">
                    </div>
                    <div class="property-card-details">
                        <h3>${prop.title}</h3>
                        <p class="property-location">${prop.location}</p>
                        <p class="property-price">${prop.price}</p>
                        <button class="save-property-btn">Save Property</button>
                    </div>
                `;
                
                card.querySelector('.save-property-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    addSavedProperty(prop);
                    document.getElementById('add-property-modal').style.display = 'none';
                });
                
                availableList.appendChild(card);
            });
    }

    // --- CHARTS & CALCULATORS ---
    function initActivityChart() {
        const ctx = document.getElementById('activityChart').getContext('2d');
        if (activityChart) activityChart.destroy();
        activityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{ label: 'Property Views', data: [12, 19, 15, 25, 22, 28], borderColor: '#B8860B', backgroundColor: 'rgba(184, 134, 11, 0.1)', fill: true, tension: 0.4 }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    function initializeMortgageCalculator() {
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculateMortgage);
        }

        // Initialize mortgage breakdown chart
        const ctx = document.getElementById('mortgage-chart').getContext('2d');
        window.mortgageChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal & Interest', 'Down Payment'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#B8860B', '#E5C07B']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    function calculateMortgage() {
        const homePrice = parseFloat(document.getElementById('loanAmount').value);
        const downPayment = parseFloat(document.getElementById('downPayment').value);
        const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 / 12;
        const loanTerm = parseInt(document.getElementById('loanTerm').value) * 12;
        const principal = homePrice - downPayment;

        const monthlyPayment = (principal * interestRate * Math.pow(1 + interestRate, loanTerm)) / 
                          (Math.pow(1 + interestRate, loanTerm) - 1);

        // Update payment result
        document.getElementById('monthly-payment-result').textContent = 
            `$${monthlyPayment.toFixed(2)}`;

        // Update chart
        window.mortgageChart.data.datasets[0].data = [principal, downPayment];
        window.mortgageChart.update();
    }

    // --- PROPERTY HANDLING CODE ---
    const STORAGE_KEY = 'savedProperties';

    function initializePropertyManager() {
        const savedPropertiesList = document.getElementById('saved-properties-list');
        const addPropertyBtn = document.getElementById('add-property-btn');
        const modal = document.getElementById('add-property-modal');
        const availablePropertiesList = document.getElementById('available-properties-list');
        
        // Load saved properties
        let savedProperties = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        
        // Initialize modal close button
        document.querySelector('.modal-close')?.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Show available properties in modal
        function showAvailableProperties() {
            const unsavedProperties = availableProperties.filter(prop => 
                !savedProperties.some(saved => saved.id === prop.id)
            );
            
            availablePropertiesList.innerHTML = unsavedProperties.map(property => `
                <div class="property-card" data-id="${property.id}">
                    <img src="${property.img}" alt="${property.title}"
                         onerror="this.src='https://via.placeholder.com/400x300?text=Property+Image'">
                    <div class="property-info">
                        <h3>${property.title}</h3>
                        <p class="location">${property.location}</p>
                        <p class="price">${property.price}</p>
                        <button class="add-property-btn" onclick="saveProperty('${property.id}')">
                            <i data-feather="plus"></i> Add to Saved
                        </button>
                    </div>
                </div>
            `).join('');
            
            feather.replace();
            modal.style.display = 'flex';
        }

        // Update saved properties display
        function updateSavedPropertiesDisplay() {
            const savedPropertiesList = document.getElementById('saved-properties-list');
            const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');

            if (savedProperties.length === 0) {
                savedPropertiesList.innerHTML = `
                    <div id="no-saved-props" class="placeholder">
                        <i data-feather="home"></i>
                        <p>No properties saved yet. Click "Add New Property" to start.</p>
                    </div>
                `;
            } else {
                savedPropertiesList.innerHTML = savedProperties.map(property => `
                    <div class="property-card" data-id="${property.id}">
                        <img src="${property.img}" alt="${property.title}" 
                             onerror="this.src='https://via.placeholder.com/400x300?text=Property+Image'">
                        <div class="property-info">
                            <h3>${property.title}</h3>
                            <p class="location">${property.location}</p>
                            <p class="price">${property.price}</p>
                            <button class="remove-property-btn" onclick="removeProperty('${property.id}')">
                                <i data-feather="trash-2"></i> Remove
                            </button>
                        </div>
                    </div>
                `).join('');
                feather.replace();
            }
        }

        // Add property button click handler
        addPropertyBtn.addEventListener('click', () => {
            showAvailableProperties();
            modal.style.display = 'flex';
        });

        // Save property function
        window.saveProperty = function(propertyId) {
            const property = availableProperties.find(p => p.id === propertyId);
            if (property && !savedProperties.some(p => p.id === propertyId)) {
                savedProperties.push(property);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProperties));
                updateSavedPropertiesDisplay();
                modal.style.display = 'none';
            }
        };

        // Remove property function
        window.removeProperty = function(propertyId) {
            savedProperties = savedProperties.filter(p => p.id !== propertyId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProperties));
            updateSavedPropertiesDisplay();
        };

        // Initial display
        updateSavedPropertiesDisplay();
    }

    // Overview Section Functions
    function initializeOverview() {
        updateStats();
        initializeChart();
        loadRecentActivity();
        setupQuickActions();
    }

    function updateStats() {
        const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
        const firstVisit = localStorage.getItem('firstVisit') || new Date().toISOString();
        const lastVisit = localStorage.getItem('lastVisit') || new Date().toISOString();

        // Update stats
        document.getElementById('saved-properties-count').textContent = savedProperties.length;
        document.getElementById('days-active').textContent = getDaysSince(firstVisit);
        document.getElementById('last-visit').textContent = getRelativeTimeString(lastVisit);

        // Update last visit
        localStorage.setItem('lastVisit', new Date().toISOString());
        if (!localStorage.getItem('firstVisit')) {
            localStorage.setItem('firstVisit', new Date().toISOString());
        }
    }

    function initializeChart() {
        const ctx = document.getElementById('price-chart').getContext('2d');
        const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
        
        const prices = savedProperties.map(prop => 
            parseInt(prop.price.replace(/[^0-9]/g, ''))
        );

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['$0-1M', '$1M-2M', '$2M-3M', '$3M+'],
                datasets: [{
                    label: 'Properties by Price Range',
                    data: getPriceRanges(prices),
                    backgroundColor: '#B8860B'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    function loadRecentActivity() {
        const activityList = document.getElementById('activity-list');
        const activities = JSON.parse(localStorage.getItem('activities') || '[]');

        activityList.innerHTML = activities.length ? 
            activities.map(activity => `
                <div class="activity-item">
                    <i data-feather="${activity.icon}"></i>
                    <div>
                        <p>${activity.description}</p>
                        <small>${getRelativeTimeString(activity.timestamp)}</small>
                    </div>
                </div>
            `).join('') :
            '<p class="no-activity">No recent activity</p>';

        feather.replace();
    }

    // Helper Functions
    function getDaysSince(date) {
        const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
        return days;
    }

    function getRelativeTimeString(date) {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        const daysDiff = Math.floor((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) return 'Today';
        if (daysDiff === -1) return 'Yesterday';
        return rtf.format(daysDiff, 'day');
    }

    function getPriceRanges(prices) {
        return [
            prices.filter(p => p <= 1000000).length,
            prices.filter(p => p > 1000000 && p <= 2000000).length,
            prices.filter(p => p > 2000000 && p <= 3000000).length,
            prices.filter(p => p > 3000000).length
        ];
    }

    // Quick Action Functions
    function showMortgageCalculator() {
        document.querySelector('[data-target="mortgage-calculator"]').click();
    }

    function exportSavedProperties() {
        const properties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
        const csv = properties.map(p => 
            `${p.title},${p.location},${p.price}`
        ).join('\n');
        
        const blob = new Blob([`Title,Location,Price\n${csv}`], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'saved-properties.csv';
        a.click();
    }

    // Initialize Overview when DOM is loaded
    document.addEventListener('DOMContentLoaded', initializeOverview);
    
    // Initialize all features
    initializeMortgageCalculator();
    await initializeProfile();
    initializePropertyManager();
    
    // Initialize Feather icons
    feather.replace();
});