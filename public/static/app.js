// CYB Guide Frontend JavaScript
class CYBGuide {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.currentLanguage = 'professional'; // default to professional mode
        this.responsibilityAccepted = false;
        this.konamiSequence = [];
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA', 'Enter'];
        this.secretClickCount = 0;
        this.userPathway = null;
        this.quizData = [
            {
                question: "Do you know what an IP address is?",
                options: ["Yes, I can explain it", "Sort of, I've heard of it", "Not really"],
                casual: "Do you know what an IP address is?",
                professional: "What is your understanding of IP addressing?"
            },
            {
                question: "Have you used Linux or command line before?",
                options: ["Daily - I'm comfortable with terminals", "Sometimes - I know basic commands", "Rarely - GUIs are more my thing"],
                casual: "Ever messed around with Linux or command line?",
                professional: "What is your experience with Linux/Unix command line interfaces?"
            },
            {
                question: "What about network security tools?",
                options: ["I've used Nmap, Wireshark, etc.", "I know the names but haven't used them", "What are those?"],
                casual: "Ever played with hacking tools like Nmap?",
                professional: "What is your experience with network security assessment tools?"
            },
            {
                question: "Programming/scripting experience?",
                options: ["I can write scripts and programs", "I understand code but don't write much", "Programming is not my strong suit"],
                casual: "Can you code at all?",
                professional: "What is your programming and scripting proficiency?"
            },
            {
                question: "Why are you interested in cybersecurity?",
                options: ["Career change/advancement", "Personal curiosity and learning", "Academic requirements"],
                casual: "What got you interested in this hacking stuff?",
                professional: "What motivates your interest in cybersecurity?"
            }
        ];
        this.currentQuestionIndex = 0;
        this.quizAnswers = [];
        
        this.init();
    }
    
    async init() {
        // Check if user has already accepted responsibility
        const accepted = localStorage.getItem('responsibility_accepted');
        if (accepted) {
            this.responsibilityAccepted = true;
            this.showMainApp();
        } else {
            this.showResponsibilityModal();
        }
        
        // Load language preference
        const savedLanguage = localStorage.getItem('language_preference');
        if (savedLanguage) {
            this.currentLanguage = savedLanguage;
            this.updateLanguageToggle();
        }
        
        // Initialize event listeners
        this.setupEventListeners();
        
        // Setup Konami code listener
        this.setupKonamiCode();
        
        // Check authentication status
        this.checkAuthStatus();
        
        // Load initial data
        this.loadInitialData();
        
        // Check if user has taken assessment
        const savedPathway = localStorage.getItem('user_pathway');
        if (savedPathway) {
            this.userPathway = JSON.parse(savedPathway);
            this.displayUserPathway();
        }
    }
    
    setupEventListeners() {
        // Responsibility modal
        const acceptCheckbox = document.getElementById('responsibility-accept');
        const proceedBtn = document.getElementById('proceed-btn');
        
        if (acceptCheckbox && proceedBtn) {
            acceptCheckbox.addEventListener('change', (e) => {
                proceedBtn.disabled = !e.target.checked;
            });
            
            proceedBtn.addEventListener('click', () => this.acceptResponsibility());
        }
        
        // Language toggle
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.addEventListener('change', (e) => {
                this.currentLanguage = e.target.checked ? 'casual' : 'professional';
                this.saveLanguagePreference();
                this.updateLanguageDisplay();
            });
        }
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                if (href) {
                    this.navigateToSection(href.substring(1)); // remove #
                    this.logAction('navigation_click', { section: href });
                }
            });
        });
        
        // AI Assistant
        const aiInput = document.getElementById('ai-input');
        const aiSend = document.getElementById('ai-send');
        
        if (aiInput && aiSend) {
            aiSend.addEventListener('click', () => this.sendAIQuery());
            aiInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendAIQuery();
                }
            });
        }
        
        // User menu
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.addEventListener('click', () => this.toggleUserMenu());
        }
        
        // Assessment quiz
        const retakeBtn = document.getElementById('retake-assessment');
        if (retakeBtn) {
            retakeBtn.addEventListener('click', () => this.startAssessment());
        }
        
        // Terminal input
        const terminalInput = document.getElementById('terminal-input');
        const terminalSend = document.getElementById('terminal-send');
        
        if (terminalInput && terminalSend) {
            terminalSend.addEventListener('click', () => this.sendTerminalQuery());
            terminalInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendTerminalQuery();
                }
            });
        }
        
        // Quick terminal buttons
        document.querySelectorAll('.terminal-quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const query = e.target.dataset.query;
                if (query) {
                    document.getElementById('terminal-input').value = query;
                    this.sendTerminalQuery();
                }
            });
        });
        
        // Event filter tabs
        document.querySelectorAll('.event-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.dataset.tab;
                this.filterEvents(category);
                
                // Update active tab
                document.querySelectorAll('.event-tab').forEach(t => {
                    t.classList.remove('active', 'bg-green-600', 'text-white');
                    t.classList.add('bg-gray-700', 'text-gray-300');
                });
                e.target.classList.add('active', 'bg-green-600', 'text-white');
                e.target.classList.remove('bg-gray-700', 'text-gray-300');
            });
        });
        
        // Secret admin button
        const secretBtn = document.getElementById('secret-admin-btn');
        if (secretBtn) {
            secretBtn.addEventListener('click', () => {
                window.location.href = '/admin';
            });
        }
    }
    
    showResponsibilityModal() {
        const modal = document.getElementById('responsibility-modal');
        const mainApp = document.getElementById('main-app');
        
        if (modal && mainApp) {
            modal.classList.remove('hidden');
            mainApp.classList.add('hidden');
        }
    }
    
    showMainApp() {
        const modal = document.getElementById('responsibility-modal');
        const mainApp = document.getElementById('main-app');
        
        if (modal && mainApp) {
            modal.classList.add('hidden');
            mainApp.classList.remove('hidden');
        }
    }
    
    async acceptResponsibility() {
        try {
            // Log the acceptance
            await this.logAction('responsibility_accepted', {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            });
            
            // Store acceptance locally
            localStorage.setItem('responsibility_accepted', 'true');
            this.responsibilityAccepted = true;
            
            // Show success notification
            this.showNotification('Responsibility accepted. Welcome to CYB Guide!', 'success');
            
            // Show main application
            this.showMainApp();
            
        } catch (error) {
            console.error('Failed to log acceptance:', error);
            this.showNotification('Failed to log acceptance. Please try again.', 'error');
        }
    }
    
    saveLanguagePreference() {
        localStorage.setItem('language_preference', this.currentLanguage);
    }
    
    updateLanguageToggle() {
        const toggle = document.getElementById('language-toggle');
        if (toggle) {
            toggle.checked = this.currentLanguage === 'casual';
        }
    }
    
    updateLanguageDisplay() {
        // Update all elements with language data attributes
        document.querySelectorAll('[data-casual][data-professional]').forEach(element => {
            const casualText = element.getAttribute('data-casual');
            const professionalText = element.getAttribute('data-professional');
            
            if (casualText && professionalText) {
                element.textContent = this.currentLanguage === 'casual' ? casualText : professionalText;
            }
        });
        
        // Add fade animation
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 150);
        
        // Log language change
        this.logAction('language_changed', { language: this.currentLanguage });
    }
    
    navigateToSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('fade-in');
            
            // Update URL hash
            window.location.hash = sectionId;
        }
    }
    
    async sendAIQuery() {
        const aiInput = document.getElementById('ai-input');
        const aiResponse = document.getElementById('ai-response');
        
        if (!aiInput || !aiResponse) return;
        
        const query = aiInput.value.trim();
        if (!query) {
            this.showNotification('Please enter a question', 'warning');
            return;
        }
        
        try {
            // Show loading state
            aiResponse.classList.remove('hidden');
            aiResponse.innerHTML = `
                <div class="flex items-center space-x-2 mb-4">
                    <div class="spinner"></div>
                    <span class="text-green-400">DEKE-AI is analyzing your query...</span>
                </div>
            `;
            
            // Send query to backend
            const response = await fetch('/api/ai-assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    userEmail: this.currentUser?.email || 'anonymous'
                }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Display AI response with typing effect
                this.displayAIResponse(data.response, data.disclaimer);
                
                // Clear input
                aiInput.value = '';
                
            } else {
                throw new Error(data.error || 'AI Assistant unavailable');
            }
            
        } catch (error) {
            console.error('AI query failed:', error);
            aiResponse.innerHTML = `
                <div class="bg-red-900 border border-red-700 rounded-lg p-4 text-red-300">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    AI Assistant is currently unavailable. Please try again later.
                </div>
            `;
        }
    }
    
    displayAIResponse(response, disclaimer) {
        const aiResponse = document.getElementById('ai-response');
        
        // Format the response with proper styling
        const formattedResponse = this.formatAIResponse(response);
        
        aiResponse.innerHTML = `
            <div class="bg-gray-700 rounded-lg p-4">
                <div class="flex items-center space-x-3 mb-4">
                    <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center status-online">
                        <i class="fas fa-robot text-white"></i>
                    </div>
                    <div>
                        <h4 class="text-green-400 font-semibold">DEKE-AI</h4>
                        <p class="text-gray-400 text-xs">Ethical Hacking Assistant</p>
                    </div>
                </div>
                
                <div class="prose prose-green max-w-none">
                    ${formattedResponse}
                </div>
                
                ${disclaimer ? `
                    <div class="mt-4 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
                        <p class="text-yellow-300 text-sm">
                            <i class="fas fa-shield-alt mr-2"></i>
                            ${disclaimer}
                        </p>
                    </div>
                ` : ''}
                
                <div class="flex justify-between items-center mt-4 text-xs text-gray-500">
                    <span>Response generated at ${new Date().toLocaleTimeString()}</span>
                    <div class="flex space-x-2">
                        <button class="hover:text-green-400 transition-colors" onclick="cybGuide.copyToClipboard(this)" data-content="${encodeURIComponent(response)}">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                        <button class="hover:text-green-400 transition-colors" onclick="cybGuide.shareResponse(this)" data-content="${encodeURIComponent(response)}">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    formatAIResponse(response) {
        // Basic markdown-like formatting
        let formatted = response
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-green-300">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="text-green-200">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-900 text-green-400 px-2 py-1 rounded text-sm">$1</code>')
            .replace(/```([\s\S]*?)```/g, '<div class="code-block mt-4 mb-4"><code class="text-green-400">$1</code></div>')
            .replace(/\n\n/g, '</p><p class="text-gray-300 mb-3">')
            .replace(/\n/g, '<br>');
        
        return `<p class="text-gray-300 mb-3">${formatted}</p>`;
    }
    
    async copyToClipboard(button) {
        const content = decodeURIComponent(button.dataset.content);
        try {
            await navigator.clipboard.writeText(content);
            button.innerHTML = '<i class="fas fa-check text-green-400"></i> Copied';
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i> Copy';
            }, 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
            this.showNotification('Failed to copy to clipboard', 'error');
        }
    }
    
    shareResponse(button) {
        const content = decodeURIComponent(button.dataset.content);
        if (navigator.share) {
            navigator.share({
                title: 'CYB Guide AI Response',
                text: content,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            this.copyToClipboard(button);
        }
    }
    
    toggleUserMenu() {
        // Simple user menu toggle (implement dropdown)
        if (this.isLoggedIn) {
            // Show user menu with logout option
            console.log('Show user menu');
        } else {
            // Redirect to login
            window.location.href = '/login';
        }
    }
    
    async checkAuthStatus() {
        // Check if user is authenticated (simplified)
        // In a real implementation, verify JWT token
        const token = this.getCookie('auth_token');
        if (token) {
            try {
                const userData = JSON.parse(atob(token));
                this.currentUser = userData;
                this.isLoggedIn = true;
                this.updateUserInterface();
            } catch (error) {
                console.error('Invalid auth token:', error);
                this.isLoggedIn = false;
            }
        }
    }
    
    updateUserInterface() {
        const userMenu = document.getElementById('user-menu');
        if (userMenu && this.isLoggedIn) {
            userMenu.innerHTML = `
                <img src="${this.currentUser.picture || this.currentUser.avatar || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">👤</text></svg>'}" 
                     alt="User Avatar" 
                     class="w-8 h-8 rounded-full border border-green-500">
            `;
        }
    }
    
    async loadInitialData() {
        try {
            // Load learning guide data
            const guideResponse = await fetch('/api/learning-guide');
            if (guideResponse.ok) {
                const guideData = await guideResponse.json();
                this.updateLearningGuide(guideData);
            }
            
            // Load events data
            const eventsResponse = await fetch('/api/events');
            if (eventsResponse.ok) {
                const eventsData = await eventsResponse.json();
                this.updateEvents(eventsData);
            }
            
            // Load announcements data
            const announcementsResponse = await fetch('/api/announcements');
            if (announcementsResponse.ok) {
                const announcementsData = await announcementsResponse.json();
                this.updateAnnouncements(announcementsData);
            }
            
        } catch (error) {
            console.error('Failed to load initial data:', error);
        }
    }
    
    updateLearningGuide(data) {
        // Update learning guide content dynamically
        console.log('Learning guide data loaded:', data);
    }
    
    updateEvents(data) {
        // Update events content dynamically
        console.log('Events data loaded:', data);
    }
    
    updateAnnouncements(data) {
        // Update announcements content dynamically
        console.log('Announcements data loaded:', data);
    }
    
    async logAction(action, extraInfo = {}) {
        try {
            await fetch('/api/log-action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: this.currentUser?.email || 'anonymous',
                    action,
                    extraInfo
                }),
            });
        } catch (error) {
            console.error('Failed to log action:', error);
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
    
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    
    // ===== NEW FUNCTIONALITY =====
    
    setupKonamiCode() {
        document.addEventListener('keydown', (e) => {
            this.konamiSequence.push(e.code);
            
            // Keep only the last 11 keys
            if (this.konamiSequence.length > 11) {
                this.konamiSequence.shift();
            }
            
            // Check if sequence matches
            if (this.konamiSequence.length === 11) {
                const matches = this.konamiSequence.every((key, index) => key === this.konamiCode[index]);
                if (matches) {
                    this.triggerKonamiUnlock();
                    this.konamiSequence = []; // Reset
                }
            }
        });
        
        // Alternative: Secret click sequence on terminal icon in nav
        const navTerminal = document.querySelector('.fas.fa-terminal');
        if (navTerminal) {
            navTerminal.addEventListener('click', () => {
                this.secretClickCount++;
                if (this.secretClickCount >= 5) {
                    this.triggerKonamiUnlock();
                    this.secretClickCount = 0;
                }
                
                // Reset counter after 3 seconds
                setTimeout(() => {
                    this.secretClickCount = 0;
                }, 3000);
            });
        }
    }
    
    triggerKonamiUnlock() {
        const notification = document.getElementById('konami-notification');
        const secretBtn = document.getElementById('secret-admin-btn');
        
        if (notification) {
            notification.classList.remove('translate-x-full');
            notification.classList.add('translate-x-0');
            
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                notification.classList.remove('translate-x-0');
            }, 5000);
        }
        
        if (secretBtn) {
            secretBtn.classList.remove('hidden');
        }
        
        this.logAction('konami_code_activated', { timestamp: new Date().toISOString() });
        
        // Add some visual flair
        document.body.classList.add('konami-activated');
        setTimeout(() => {
            document.body.classList.remove('konami-activated');
        }, 2000);
    }
    
    startAssessment() {
        this.currentQuestionIndex = 0;
        this.quizAnswers = [];
        
        const overlay = document.getElementById('assessment-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            this.displayQuizQuestion();
        }
    }
    
    displayQuizQuestion() {
        const container = document.getElementById('quiz-container');
        const prevBtn = document.getElementById('quiz-prev');
        const nextBtn = document.getElementById('quiz-next');
        const finishBtn = document.getElementById('quiz-finish');
        
        if (!container) return;
        
        const question = this.quizData[this.currentQuestionIndex];
        const questionText = this.currentLanguage === 'casual' ? question.casual : question.professional;
        
        container.innerHTML = `
            <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div class="mb-4">
                    <div class="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Question ${this.currentQuestionIndex + 1} of ${this.quizData.length}</span>
                        <span>${Math.round(((this.currentQuestionIndex + 1) / this.quizData.length) * 100)}% Complete</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2 mb-4">
                        <div class="bg-green-500 h-2 rounded-full transition-all duration-300" style="width: ${((this.currentQuestionIndex + 1) / this.quizData.length) * 100}%"></div>
                    </div>
                </div>
                
                <h3 class="text-xl font-semibold text-green-400 mb-6">${questionText}</h3>
                
                <div class="space-y-3">
                    ${question.options.map((option, index) => `
                        <label class="quiz-option flex items-center p-4 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                            <input type="radio" name="question-${this.currentQuestionIndex}" value="${index}" class="mr-3 text-green-500">
                            <span class="text-gray-300">${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Button visibility
        prevBtn.classList.toggle('hidden', this.currentQuestionIndex === 0);
        nextBtn.classList.toggle('hidden', this.currentQuestionIndex === this.quizData.length - 1);
        finishBtn.classList.toggle('hidden', this.currentQuestionIndex !== this.quizData.length - 1);
        
        // Event listeners for quiz navigation
        nextBtn.onclick = () => this.nextQuestion();
        prevBtn.onclick = () => this.prevQuestion();
        finishBtn.onclick = () => this.finishAssessment();
    }
    
    nextQuestion() {
        const selected = document.querySelector(`input[name="question-${this.currentQuestionIndex}"]:checked`);
        if (!selected) {
            this.showNotification('Please select an answer', 'warning');
            return;
        }
        
        this.quizAnswers[this.currentQuestionIndex] = parseInt(selected.value);
        this.currentQuestionIndex++;
        this.displayQuizQuestion();
    }
    
    prevQuestion() {
        this.currentQuestionIndex--;
        this.displayQuizQuestion();
        
        // Restore previous answer if exists
        if (this.quizAnswers[this.currentQuestionIndex] !== undefined) {
            const radio = document.querySelector(`input[name="question-${this.currentQuestionIndex}"][value="${this.quizAnswers[this.currentQuestionIndex]}"]`);
            if (radio) radio.checked = true;
        }
    }
    
    finishAssessment() {
        const selected = document.querySelector(`input[name="question-${this.currentQuestionIndex}"]:checked`);
        if (!selected) {
            this.showNotification('Please select an answer', 'warning');
            return;
        }
        
        this.quizAnswers[this.currentQuestionIndex] = parseInt(selected.value);
        
        // Calculate pathway
        const pathway = this.calculatePathway(this.quizAnswers);
        this.userPathway = pathway;
        
        // Save to localStorage
        localStorage.setItem('user_pathway', JSON.stringify(pathway));
        
        // Log assessment completion
        this.logAction('assessment_completed', { 
            answers: this.quizAnswers, 
            pathway: pathway.type,
            timestamp: new Date().toISOString()
        });
        
        // Hide assessment overlay
        document.getElementById('assessment-overlay').classList.add('hidden');
        
        // Display results
        this.displayUserPathway();
        this.generateLearningCards();
        
        this.showNotification(`Assessment complete! You've been assigned to the ${pathway.title} pathway.`, 'success');
    }
    
    calculatePathway(answers) {
        // Simple scoring algorithm
        const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
        const avgScore = totalScore / answers.length;
        
        if (avgScore <= 1) {
            return {
                type: 'skilled',
                title: 'Skilled Practitioner',
                icon: '🔵',
                description: 'You have solid foundational knowledge and are ready for advanced topics.',
                tone: 'professional',
                progress: 25
            };
        } else {
            return {
                type: 'casual',
                title: 'Casual Explorer', 
                icon: '🟢',
                description: 'Perfect starting point! We\'ll guide you through the basics with a friendly approach.',
                tone: 'casual',
                progress: 10
            };
        }
    }
    
    displayUserPathway() {
        const container = document.getElementById('user-pathway');
        if (!container || !this.userPathway) return;
        
        container.classList.remove('hidden');
        
        document.getElementById('pathway-icon').textContent = this.userPathway.icon;
        document.getElementById('pathway-title').textContent = this.userPathway.title;
        document.getElementById('pathway-description').textContent = this.userPathway.description;
        document.getElementById('progress-text').textContent = `${this.userPathway.progress}% Complete`;
        document.getElementById('progress-bar').style.width = `${this.userPathway.progress}%`;
    }
    
    generateLearningCards() {
        const container = document.getElementById('learning-cards');
        if (!container) return;
        
        const cards = this.userPathway.type === 'casual' ? this.getCasualCards() : this.getProfessionalCards();
        
        container.innerHTML = cards.map(card => `
            <div class="learning-card bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-colors cursor-pointer" data-completed="${card.completed}">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">${card.icon}</div>
                        <h3 class="text-lg font-semibold text-green-400">${card.title}</h3>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${card.completed ? '<i class="fas fa-check-circle text-green-400"></i>' : '<i class="fas fa-circle text-gray-600"></i>'}
                        <span class="text-xs px-2 py-1 rounded ${card.difficulty === 'easy' ? 'bg-green-900 text-green-300' : card.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}">${card.difficulty}</span>
                    </div>
                </div>
                
                <p class="text-gray-300 text-sm mb-4">${card.problem}</p>
                
                <div class="bg-gray-900 border border-gray-700 rounded p-4 mb-4">
                    <h4 class="text-green-400 font-semibold text-sm mb-2">💡 Solution:</h4>
                    <p class="text-gray-300 text-sm">${card.solution}</p>
                </div>
                
                <div class="flex flex-wrap gap-2 mb-4">
                    ${card.tags.map(tag => `<span class="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded">${tag}</span>`).join('')}
                </div>
                
                <div class="flex justify-between items-center">
                    <div class="flex space-x-3 text-sm">
                        ${card.resources.map(resource => `<a href="${resource.url}" class="text-blue-400 hover:text-blue-300"><i class="fas fa-external-link-alt mr-1"></i>${resource.name}</a>`).join('')}
                    </div>
                    <div class="text-xs text-gray-400">
                        <i class="fas fa-users mr-1"></i>${card.completedBy} completed
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers for cards
        container.querySelectorAll('.learning-card').forEach(card => {
            card.addEventListener('click', () => {
                this.logAction('learning_card_clicked', { cardTitle: card.querySelector('h3').textContent });
                
                // Toggle completion status
                const completed = card.dataset.completed === 'true';
                card.dataset.completed = !completed;
                
                const icon = card.querySelector('.fa-check-circle, .fa-circle');
                if (icon) {
                    icon.className = !completed ? 'fas fa-check-circle text-green-400' : 'fas fa-circle text-gray-600';
                }
                
                // Update progress
                this.updateProgress();
            });
        });
    }
    
    getCasualCards() {
        return [
            {
                title: "Getting Started",
                icon: "🚀",
                difficulty: "easy",
                problem: "I don't know where to start with cybersecurity.",
                solution: "Begin with IT basics → Networking fundamentals → Linux basics. Try free resources like Professor Messer videos + OverTheWire Bandit challenges.",
                tags: ["Beginner", "Foundations", "Free"],
                resources: [
                    { name: "Professor Messer", url: "https://professormesser.com" },
                    { name: "OverTheWire", url: "https://overthewire.org/wargames/bandit/" }
                ],
                completed: false,
                completedBy: "3,247"
            },
            {
                title: "Linux Terminal Basics",
                icon: "💻",
                difficulty: "easy",
                problem: "Command line looks scary and I don't know basic commands.",
                solution: "Start with ls, cd, pwd, cat, grep. Practice on a virtual machine or use online terminals. Don't worry if you mess up - that's how you learn!",
                tags: ["Linux", "Terminal", "Commands"],
                resources: [
                    { name: "Linux Journey", url: "https://linuxjourney.com" },
                    { name: "Bandit Wargame", url: "https://overthewire.org/wargames/bandit/" }
                ],
                completed: false,
                completedBy: "2,891"
            },
            {
                title: "Your First Nmap Scan",
                icon: "🔍",
                difficulty: "medium",
                problem: "I want to learn network scanning but don't know where to start.",
                solution: "Set up a home lab with virtual machines. Start with 'nmap -sn' for network discovery, then try 'nmap -sV' for service detection. Only scan your own network!",
                tags: ["Nmap", "Scanning", "Home Lab"],
                resources: [
                    { name: "Nmap Tutorial", url: "https://nmap.org/book/" },
                    { name: "TryHackMe Nmap", url: "https://tryhackme.com/room/furthernmap" }
                ],
                completed: false,
                completedBy: "1,756"
            }
        ];
    }
    
    getProfessionalCards() {
        return [
            {
                title: "Advanced Network Analysis",
                icon: "🛡️",
                difficulty: "medium",
                problem: "Need to enhance network traffic analysis capabilities for security assessment.",
                solution: "Implement comprehensive packet analysis using Wireshark with custom filters. Study protocol-specific attack vectors and develop detection signatures.",
                tags: ["Wireshark", "Traffic Analysis", "IDS"],
                resources: [
                    { name: "SANS Wireshark", url: "https://www.sans.org/white-papers/" },
                    { name: "Malware Traffic", url: "https://malware-traffic-analysis.net" }
                ],
                completed: false,
                completedBy: "987"
            },
            {
                title: "Vulnerability Assessment Framework",
                icon: "⚡",
                difficulty: "hard",
                problem: "Require structured approach for enterprise vulnerability management.",
                solution: "Implement NIST Cybersecurity Framework with automated scanning (Nessus/OpenVAS), vulnerability correlation, and risk-based prioritization matrices.",
                tags: ["NIST", "Vulnerability Management", "Enterprise"],
                resources: [
                    { name: "NIST Framework", url: "https://www.nist.gov/cyberframework" },
                    { name: "OWASP Testing", url: "https://owasp.org/www-project-web-security-testing-guide/" }
                ],
                completed: false,
                completedBy: "543"
            },
            {
                title: "Incident Response Playbook",
                icon: "🚨",
                difficulty: "hard",
                problem: "Need systematic incident response procedures for security breaches.",
                solution: "Develop SANS-based incident response framework with containment procedures, forensic evidence collection, and stakeholder communication protocols.",
                tags: ["Incident Response", "Forensics", "SANS"],
                resources: [
                    { name: "SANS IR Guide", url: "https://www.sans.org/white-papers/incident-handlers-handbook/" },
                    { name: "NIST SP 800-61", url: "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final" }
                ],
                completed: false,
                completedBy: "321"
            }
        ];
    }
    
    updateProgress() {
        const cards = document.querySelectorAll('.learning-card');
        const completedCards = document.querySelectorAll('.learning-card[data-completed="true"]');
        const progress = Math.round((completedCards.length / cards.length) * 100);
        
        document.getElementById('progress-text').textContent = `${progress}% Complete`;
        document.getElementById('progress-bar').style.width = `${progress}%`;
        
        // Update user pathway progress
        if (this.userPathway) {
            this.userPathway.progress = Math.max(this.userPathway.progress, progress);
            localStorage.setItem('user_pathway', JSON.stringify(this.userPathway));
        }
    }
    
    async sendTerminalQuery() {
        const input = document.getElementById('terminal-input');
        const history = document.getElementById('terminal-history');
        const loading = document.getElementById('terminal-loading');
        
        if (!input || !history) return;
        
        const query = input.value.trim();
        if (!query) return;
        
        // Add user query to history
        const userCommand = document.createElement('div');
        userCommand.innerHTML = `
            <div class="text-green-500 mb-1">
                <span class="text-gray-500">user@cybguide</span>:<span class="text-blue-400">~</span>$ ${query}
            </div>
        `;
        history.appendChild(userCommand);
        
        // Clear input and show loading
        input.value = '';
        loading.classList.remove('hidden');
        
        // Scroll to bottom
        history.scrollTop = history.scrollHeight;
        
        try {
            const response = await fetch('/api/ai-assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    userEmail: this.currentUser?.email || 'anonymous',
                    interface: 'terminal'
                }),
            });
            
            const data = await response.json();
            
            loading.classList.add('hidden');
            
            if (response.ok) {
                const aiResponse = document.createElement('div');
                aiResponse.innerHTML = `
                    <div class="text-white mb-2">
                        <span class="text-green-400">[DEKE-AI]</span> ${this.formatTerminalResponse(data.response)}
                    </div>
                    ${data.sources ? `
                        <div class="text-blue-400 text-sm mb-2">
                            <span class="text-gray-400">[SOURCES]</span> ${data.sources.map(s => `<a href="${s.url}" class="hover:underline">${s.title}</a>`).join(', ')}
                        </div>
                    ` : ''}
                    <div class="text-gray-500 text-xs mb-4">
                        ${new Date().toLocaleTimeString()} | Response time: ${data.responseTime || 'N/A'}ms
                    </div>
                `;
                history.appendChild(aiResponse);
            } else {
                const errorResponse = document.createElement('div');
                errorResponse.innerHTML = `
                    <div class="text-red-400 mb-4">
                        <span class="text-red-500">[ERROR]</span> ${data.error || 'AI Assistant unavailable'}
                    </div>
                `;
                history.appendChild(errorResponse);
            }
            
        } catch (error) {
            loading.classList.add('hidden');
            const errorResponse = document.createElement('div');
            errorResponse.innerHTML = `
                <div class="text-red-400 mb-4">
                    <span class="text-red-500">[ERROR]</span> Connection failed. Check your network.
                </div>
            `;
            history.appendChild(errorResponse);
        }
        
        // Scroll to bottom
        history.scrollTop = history.scrollHeight;
    }
    
    formatTerminalResponse(response) {
        // Format response for terminal display
        return response
            .replace(/\*\*(.*?)\*\*/g, '<span class="text-green-300 font-bold">$1</span>')
            .replace(/`(.*?)`/g, '<span class="text-yellow-400">$1</span>')
            .replace(/\n/g, '<br>');
    }
    
    filterEvents(category) {
        const items = document.querySelectorAll('.timeline-item');
        
        items.forEach(item => {
            if (category === 'all') {
                item.style.display = 'flex';
            } else {
                const itemCategory = item.dataset.category;
                item.style.display = itemCategory === category ? 'flex' : 'none';
            }
        });
    }
}

// Initialize the application
const cybGuide = new CYBGuide();

// Global utility functions
window.cybGuide = cybGuide;

// Handle browser navigation
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        cybGuide.navigateToSection(hash);
    }
});

// Handle initial hash navigation
document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        cybGuide.navigateToSection(hash);
    }
});

// Handle page visibility changes for logging
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        cybGuide.logAction('page_focus', { timestamp: new Date().toISOString() });
    } else {
        cybGuide.logAction('page_blur', { timestamp: new Date().toISOString() });
    }
});

// Track time spent on page
let pageStartTime = Date.now();
window.addEventListener('beforeunload', () => {
    const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000);
    cybGuide.logAction('page_exit', { 
        timeSpentSeconds: timeSpent,
        timestamp: new Date().toISOString() 
    });
});

console.log('🛡️ CYB Guide initialized - Welcome to ethical hacking education!');