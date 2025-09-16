import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'
import { authRoutes } from './routes/auth'
import { apiRoutes } from './routes/api'
import { adminRoutes } from './routes/admin'

type Bindings = {
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  DISCORD_CLIENT_ID?: string
  DISCORD_CLIENT_SECRET?: string
  ADMIN_PASSWORD?: string
  GOOGLE_SHEETS_API_KEY?: string
  GOOGLE_SHEET_ID?: string
  JWT_SECRET?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for frontend-backend communication
app.use('/api/*', cors())

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }))

// Use renderer for HTML pages
app.use(renderer)

// Mount routes
app.route('/auth', authRoutes)
app.route('/api', apiRoutes)
app.route('/admin', adminRoutes)

// Main application route
app.get('/', (c) => {
  return c.render(
    <div>
      {/* Responsibility Modal */}
      <div id="responsibility-modal" className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center hidden">
        <div className="bg-gray-900 border border-green-500 rounded-lg p-8 max-w-2xl mx-4 shadow-2xl">
          <div className="text-center mb-6">
            <i className="fas fa-shield-alt text-green-500 text-4xl mb-4"></i>
            <h2 className="text-2xl font-bold text-green-400 mb-2">CYB Guide - Ethical Use Policy</h2>
            <div className="w-16 h-0.5 bg-green-500 mx-auto"></div>
          </div>
          
          <div className="text-gray-300 space-y-4 mb-6">
            <p className="text-lg">Welcome, aspiring ethical hacker.</p>
            <p>The knowledge shared here is powerful. Like Deke Shaw would say - "With great power comes great responsibility."</p>
            <div className="bg-gray-800 border-l-4 border-green-500 p-4 rounded">
              <h3 className="text-green-400 font-semibold mb-2">Our Code:</h3>
              <ul className="space-y-2 text-sm">
                <li>• Use this knowledge only in authorized lab environments</li>
                <li>• Never target systems without explicit permission</li>
                <li>• Report vulnerabilities responsibly</li>
                <li>• Help secure the digital world, don't exploit it</li>
              </ul>
            </div>
            <p className="text-sm italic">This action will be logged with timestamp for educational tracking purposes.</p>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" id="responsibility-accept" className="w-5 h-5 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500" />
              <span className="text-green-400 font-medium">I Accept & Will Use Responsibly</span>
            </label>
          </div>
          
          <div className="flex justify-center mt-6">
            <button id="proceed-btn" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              <i className="fas fa-unlock-alt mr-2"></i>Access CYB Guide
            </button>
          </div>
        </div>
      </div>

      {/* Main Application */}
      <div id="main-app" className="hidden min-h-screen bg-black text-green-500">
        {/* Navigation */}
        <nav className="bg-gray-900 border-b border-green-500 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <i className="fas fa-terminal text-2xl text-green-400"></i>
                <h1 className="text-xl font-bold text-green-400">CYB Guide</h1>
              </div>
              
              {/* Language Toggle */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Professional</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="language-toggle" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                  <span className="text-sm text-gray-400">Casual</span>
                </div>
                
                <button id="user-menu" className="text-green-400 hover:text-green-300">
                  <i className="fas fa-user-circle text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-900 border-r border-green-500 min-h-screen p-4">
            <nav className="space-y-2">
              <a href="#learning-guide" className="nav-item flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-green-400 transition-colors">
                <i className="fas fa-route"></i>
                <span data-casual="Learning Path" data-professional="Educational Roadmap">Educational Roadmap</span>
              </a>
              <a href="#ai-assistant" className="nav-item flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-green-400 transition-colors">
                <i className="fas fa-robot"></i>
                <span data-casual="AI Buddy" data-professional="AI Assistant">AI Assistant</span>
              </a>

              <a href="#events" className="nav-item flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-green-400 transition-colors">
                <i className="fas fa-calendar-alt"></i>
                <span data-casual="Events & News" data-professional="Events & Announcements">Events & Announcements</span>
              </a>
              <a href="#community" className="nav-item flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-green-400 transition-colors">
                <i className="fas fa-users"></i>
                <span data-casual="Hangout" data-professional="Community Hub">Community Hub</span>
              </a>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-6">
            {/* Entry Assessment Quiz */}
            <div id="assessment-overlay" className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center hidden">
              <div className="bg-gray-900 border border-green-500 rounded-lg p-8 max-w-4xl mx-4 shadow-2xl">
                <div className="text-center mb-6">
                  <i className="fas fa-brain text-green-500 text-4xl mb-4"></i>
                  <h2 className="text-2xl font-bold text-green-400 mb-2">Knowledge Assessment</h2>
                  <p className="text-gray-300">Let's see where you're at and set your perfect learning path</p>
                </div>
                
                <div id="quiz-container" className="space-y-6">
                  {/* Quiz questions will be inserted here */}
                </div>
                
                <div className="flex justify-between mt-8">
                  <button id="quiz-prev" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors hidden">
                    <i className="fas fa-arrow-left mr-2"></i>Previous
                  </button>
                  <div className="flex space-x-4">
                    <button id="quiz-next" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                      Next<i className="fas fa-arrow-right ml-2"></i>
                    </button>
                    <button id="quiz-finish" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors hidden">
                      <i className="fas fa-flag-checkered mr-2"></i>Get My Path
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Guide Section */}
            <section id="learning-guide" className="content-section">
              <div className="bg-gray-900 border border-green-500 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-green-400 flex items-center">
                    <i className="fas fa-route mr-3"></i>
                    <span data-casual="Your Hacking Journey" data-professional="Educational Roadmap">Educational Roadmap</span>
                  </h2>
                  <button id="retake-assessment" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    <i className="fas fa-redo mr-2"></i>Retake Assessment
                  </button>
                </div>
                
                {/* User Path Display */}
                <div id="user-pathway" className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded-lg hidden">
                  <div className="flex items-center space-x-4">
                    <div id="pathway-icon" className="text-3xl"></div>
                    <div>
                      <h3 id="pathway-title" className="text-lg font-semibold text-green-400"></h3>
                      <p id="pathway-description" className="text-gray-300 text-sm"></p>
                    </div>
                  </div>
                  <div id="pathway-progress" className="mt-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Progress</span>
                      <span id="progress-text">0% Complete</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div id="progress-bar" className="bg-green-500 h-2 rounded-full" style="width: 0%"></div>
                    </div>
                  </div>
                </div>
                
                {/* Learning Cards Grid */}
                <div id="learning-cards" className="grid gap-4">
                  {/* Cards will be populated dynamically */}
                  <div className="text-center py-12 text-gray-400">
                    <i className="fas fa-brain text-4xl mb-4"></i>
                    <p className="text-lg mb-2">Ready to start your cybersecurity journey?</p>
                    <p className="text-sm">Take the assessment above to get your personalized learning path!</p>
                  </div>
                </div>
              </div>
            </section>

            {/* AI Assistant Section - Terminal Style */}
            <section id="ai-assistant" className="content-section hidden">
              <div className="bg-gray-900 border border-green-500 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
                  <i className="fas fa-terminal mr-3"></i>
                  <span data-casual="AI Terminal" data-professional="AI Assistant Terminal">AI Assistant Terminal</span>
                </h2>
                
                {/* Terminal Interface */}
                <div className="bg-black border border-green-500 rounded-lg overflow-hidden">
                  {/* Terminal Header */}
                  <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2 border-b border-green-500">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-green-400 font-mono text-sm ml-4">deke@cybguide:~$</span>
                  </div>
                  
                  {/* Terminal Content */}
                  <div className="p-4 font-mono text-green-400">
                    {/* Welcome Message */}
                    <div className="mb-4">
                      <div className="text-green-500 mb-2">
                        <span className="text-gray-500">user@cybguide</span>:<span className="text-blue-400">~</span>$ ./deke_ai.sh --init
                      </div>
                      <div className="text-green-300 text-sm mb-2">
                        [INFO] DEKE-AI v2.0 Initializing...
                      </div>
                      <div className="text-green-300 text-sm mb-2">
                        [OK] Connection to Reddit/Forum databases established
                      </div>
                      <div className="text-green-300 text-sm mb-2">
                        [OK] AI Models loaded: OpenRouter, Groq, Gemini
                      </div>
                      <div className="text-white mb-4" data-casual="&gt; Yo! I'm DEKE-AI, your terminal-based hacking mentor. Type your questions below and I'll search the web + give you solid answers. Remember - lab environments only!" data-professional="&gt; Greetings. I am DEKE-AI, your terminal-based cybersecurity assistant. I integrate real-time search data with advanced AI models to provide comprehensive, ethical guidance.">&gt; Greetings. I am DEKE-AI, your terminal-based cybersecurity assistant. I integrate real-time search data with advanced AI models to provide comprehensive, ethical guidance.</div>
                    </div>
                    
                    {/* Chat History */}
                    <div id="terminal-history" className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                      {/* Previous conversations will appear here */}
                    </div>
                    
                    {/* Input Line */}
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">user@cybguide</span>:<span className="text-blue-400 mr-2">~</span>$
                      <input 
                        type="text" 
                        id="terminal-input" 
                        className="flex-1 bg-transparent text-green-400 outline-none font-mono"
                        placeholder="Type your cybersecurity question..." 
                        autocomplete="off"
                      />
                      <button id="terminal-send" className="ml-2 text-green-500 hover:text-green-300">
                        <i className="fas fa-play"></i>
                      </button>
                    </div>
                    
                    {/* Loading Indicator */}
                    <div id="terminal-loading" className="hidden mt-2">
                      <div className="text-yellow-400 animate-pulse">
&gt; Searching forums and knowledge bases...<span className="animate-ping">_</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Terminal Options */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <button className="terminal-quick-btn bg-gray-800 hover:bg-gray-700 text-green-400 px-3 py-1 rounded text-sm border border-gray-600" data-query="How do I start learning cybersecurity?">
                    Getting Started
                  </button>
                  <button className="terminal-quick-btn bg-gray-800 hover:bg-gray-700 text-green-400 px-3 py-1 rounded text-sm border border-gray-600" data-query="What is SQL injection and how to prevent it?">
                    SQL Injection
                  </button>
                  <button className="terminal-quick-btn bg-gray-800 hover:bg-gray-700 text-green-400 px-3 py-1 rounded text-sm border border-gray-600" data-query="Best tools for penetration testing?">
                    Pentest Tools
                  </button>
                  <button className="terminal-quick-btn bg-gray-800 hover:bg-gray-700 text-green-400 px-3 py-1 rounded text-sm border border-gray-600" data-query="How to set up a home lab for ethical hacking?">
                    Home Lab Setup
                  </button>
                </div>
              </div>
            </section>

            {/* Events & Announcements Section - Timeline Style */}
            <section id="events" className="content-section hidden">
              <div className="bg-gray-900 border border-green-500 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
                  <i className="fas fa-calendar-alt mr-3"></i>
                  <span data-casual="Cool Events & News" data-professional="Events & Announcements">Events & Announcements</span>
                </h2>
                
                {/* Event Categories */}
                <div className="flex space-x-4 mb-6">
                  <button className="event-tab active bg-green-600 text-white px-4 py-2 rounded-lg text-sm" data-tab="all">
                    All Updates
                  </button>
                  <button className="event-tab bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-600" data-tab="events">
                    <i className="fas fa-calendar mr-1"></i>Events
                  </button>
                  <button className="event-tab bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-600" data-tab="announcements">
                    <i className="fas fa-bullhorn mr-1"></i>News
                  </button>
                  <button className="event-tab bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-600" data-tab="competitions">
                    <i className="fas fa-trophy mr-1"></i>CTFs
                  </button>
                </div>
                
                {/* Timeline */}
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-500"></div>
                  
                  {/* Timeline Items */}
                  <div className="space-y-6">
                    {/* Live Event */}
                    <div className="timeline-item flex items-start space-x-4" data-category="events">
                      <div className="flex-shrink-0 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center border-4 border-red-500 animate-pulse">
                        <i className="fas fa-broadcast-tower text-white"></i>
                      </div>
                      <div className="flex-1 bg-gray-800 border border-red-500 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-red-400">🔴 LIVE: DefCon 32 CTF</h3>
                          <span className="text-xs text-red-300 bg-red-900 px-2 py-1 rounded">LIVE NOW</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3" data-casual="The ultimate hacking showdown is happening RIGHT NOW! Follow along and learn from the masters." data-professional="Premier cybersecurity competition currently in progress. Observe methodologies and techniques from elite practitioners.">Premier cybersecurity competition currently in progress. Observe methodologies and techniques from elite practitioners.</p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                          <span><i className="fas fa-calendar mr-1"></i>Aug 8-11, 2025</span>
                          <span><i className="fas fa-map-marker-alt mr-1"></i>Las Vegas, NV</span>
                          <span><i className="fas fa-users mr-1"></i>2,140 viewers</span>
                        </div>
                        <div className="mt-3">
                          <a href="#" className="text-red-400 hover:text-red-300 text-sm"><i className="fas fa-external-link-alt mr-1"></i>Watch Stream</a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Recent Announcement */}
                    <div className="timeline-item flex items-start space-x-4" data-category="announcements">
                      <div className="flex-shrink-0 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center border-4 border-green-500">
                        <i className="fas fa-rocket text-white"></i>
                      </div>
                      <div className="flex-1 bg-gray-800 border border-green-500 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-green-400">CYB Guide 3.0 Launch!</h3>
                          <span className="text-xs text-gray-400">2 hours ago</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3" data-casual="We've got some sick new features! AI-powered terminal, better labs, Konami codes, and way more interactive stuff." data-professional="Enhanced platform featuring advanced AI integration, interactive laboratories, gamification elements, and improved user experience.">Enhanced platform featuring advanced AI integration, interactive laboratories, gamification elements, and improved user experience.</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded">AI Terminal</span>
                          <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded">Quiz System</span>
                          <span className="px-2 py-1 bg-purple-900 text-purple-300 text-xs rounded">Easter Eggs</span>
                        </div>
                        <div className="text-yellow-400 text-sm">
                          <i className="fas fa-star mr-1"></i>New features unlock as you progress!
                        </div>
                      </div>
                    </div>
                    
                    {/* Upcoming Competition */}
                    <div className="timeline-item flex items-start space-x-4" data-category="competitions">
                      <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center border-4 border-blue-500">
                        <i className="fas fa-trophy text-white"></i>
                      </div>
                      <div className="flex-1 bg-gray-800 border border-blue-500 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-blue-400">PicoCTF 2025</h3>
                          <span className="text-xs text-blue-300 bg-blue-900 px-2 py-1 rounded">Registration Open</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3" data-casual="Perfect for beginners! Great place to test your skills without feeling overwhelmed. Plus, it's free!" data-professional="Educational capture-the-flag competition designed for students and beginners. Excellent learning opportunity with progressive difficulty.">Educational capture-the-flag competition designed for students and beginners. Excellent learning opportunity with progressive difficulty.</p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
                          <span><i className="fas fa-calendar mr-1"></i>March 12-26, 2025</span>
                          <span><i className="fas fa-globe mr-1"></i>Online</span>
                          <span><i className="fas fa-money-bill-wave mr-1"></i>Free</span>
                        </div>
                        <div className="flex space-x-3">
                          <a href="#" className="text-blue-400 hover:text-blue-300 text-sm"><i className="fas fa-user-plus mr-1"></i>Register</a>
                          <a href="#" className="text-green-400 hover:text-green-300 text-sm"><i className="fas fa-info-circle mr-1"></i>Practice Problems</a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Security News */}
                    <div className="timeline-item flex items-start space-x-4" data-category="announcements">
                      <div className="flex-shrink-0 w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center border-4 border-yellow-500">
                        <i className="fas fa-shield-alt text-white"></i>
                      </div>
                      <div className="flex-1 bg-gray-800 border border-yellow-500 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-yellow-400">Critical CVE Alert</h3>
                          <span className="text-xs text-gray-400">1 day ago</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">New critical vulnerability discovered in popular web framework. Study the disclosure for defensive techniques.</p>
                        <div className="flex space-x-3">
                          <a href="#" className="text-yellow-400 hover:text-yellow-300 text-sm"><i className="fas fa-external-link-alt mr-1"></i>CVE Details</a>
                          <a href="#" className="text-green-400 hover:text-green-300 text-sm"><i className="fas fa-shield-alt mr-1"></i>Mitigation Guide</a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Community Achievement */}
                    <div className="timeline-item flex items-start space-x-4" data-category="announcements">
                      <div className="flex-shrink-0 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center border-4 border-purple-500">
                        <i className="fas fa-users text-white"></i>
                      </div>
                      <div className="flex-1 bg-gray-800 border border-purple-500 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-purple-400">🎉 10,000 Ethical Hackers!</h3>
                          <span className="text-xs text-gray-400">3 days ago</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3" data-casual="We hit 10K users! That's 10,000 people learning to hack ethically. Pretty awesome milestone!" data-professional="Community milestone achieved: 10,000 registered ethical hacking practitioners. Collective knowledge strengthens cybersecurity defenses.">Community milestone achieved: 10,000 registered ethical hacking practitioners. Collective knowledge strengthens cybersecurity defenses.</p>
                        <div className="text-purple-400 text-sm">
                          <i className="fas fa-heart mr-1"></i>Thank you for making cybersecurity education accessible!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Announcements Section - Moved to Events & Announcements combined section */}

            {/* Community Section - Discord-like Interface */}
            <section id="community" className="content-section hidden">
              <div className="bg-gray-900 border border-green-500 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
                  <i className="fas fa-users mr-3"></i>
                  <span data-casual="The Hangout" data-professional="Community Hub">Community Hub</span>
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Chat Channels */}
                  <div className="lg:col-span-1 bg-gray-800 border border-gray-700 rounded-lg">
                    <div className="p-4 border-b border-gray-700">
                      <h3 className="text-green-400 font-semibold mb-2">Channels</h3>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="channel-item flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer">
                        <i className="fas fa-hashtag text-gray-400 text-sm"></i>
                        <span className="text-gray-300 text-sm">general</span>
                        <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full">42</span>
                      </div>
                      <div className="channel-item flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer">
                        <i className="fas fa-hashtag text-gray-400 text-sm"></i>
                        <span className="text-gray-300 text-sm">beginners</span>
                        <span className="ml-auto bg-green-600 text-white text-xs px-2 py-1 rounded-full">18</span>
                      </div>
                      <div className="channel-item flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer">
                        <i className="fas fa-hashtag text-gray-400 text-sm"></i>
                        <span className="text-gray-300 text-sm">ctf-discuss</span>
                        <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">7</span>
                      </div>
                      <div className="channel-item flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer">
                        <i className="fas fa-hashtag text-gray-400 text-sm"></i>
                        <span className="text-gray-300 text-sm">tools-sharing</span>
                      </div>
                      <div className="channel-item flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer">
                        <i className="fas fa-hashtag text-gray-400 text-sm"></i>
                        <span className="text-gray-300 text-sm">career-advice</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="channel-item flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer">
                          <i className="fas fa-volume-up text-gray-400 text-sm"></i>
                          <span className="text-gray-300 text-sm">Study Hall</span>
                          <span className="ml-auto text-green-400 text-xs">● 12</span>
                        </div>
                        <div className="channel-item flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer">
                          <i className="fas fa-volume-up text-gray-400 text-sm"></i>
                          <span className="text-gray-300 text-sm">CTF Collab</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chat Area */}
                  <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-lg flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-hashtag text-gray-400"></i>
                        <span className="text-green-400 font-semibold">general</span>
                        <span className="text-gray-400 text-sm">General discussion for ethical hackers</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <i className="fas fa-users"></i>
                        <span className="text-sm">42 online</span>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-4 max-h-80 overflow-y-auto">
                      <div className="message flex items-start space-x-3">
                        <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👨‍💻</text></svg>" className="w-8 h-8 rounded-full"/>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-green-400 font-semibold text-sm">DeKeShaw_42</span>
                            <span className="text-gray-500 text-xs">Today at 2:34 PM</span>
                          </div>
                          <p className="text-gray-300 text-sm">Anyone working on the new TryHackMe room? The SQLi challenges are pretty solid for practice.</p>
                        </div>
                      </div>
                      
                      <div className="message flex items-start space-x-3">
                        <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👩‍💻</text></svg>" className="w-8 h-8 rounded-full"/>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-blue-400 font-semibold text-sm">cyber_queen</span>
                            <span className="text-gray-500 text-xs">Today at 2:36 PM</span>
                          </div>
                          <p className="text-gray-300 text-sm">@DeKeShaw_42 Yeah! I'm stuck on the union-based injection part. Any hints?</p>
                        </div>
                      </div>
                      
                      <div className="message flex items-start space-x-3">
                        <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>" className="w-8 h-8 rounded-full"/>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-purple-400 font-semibold text-sm">DEKE-AI</span>
                            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">BOT</span>
                            <span className="text-gray-500 text-xs">Today at 2:37 PM</span>
                          </div>
                          <p className="text-gray-300 text-sm">For union-based SQL injection, remember to match the number of columns first. Try ORDER BY or use NULL values to balance the query.</p>
                          <div className="mt-2 text-xs text-purple-300">💡 Want deeper help? Ask me in the AI Assistant terminal!</div>
                        </div>
                      </div>
                      
                      <div className="message flex items-start space-x-3">
                        <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" className="w-8 h-8 rounded-full"/>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-yellow-400 font-semibold text-sm">lightning_pen</span>
                            <span className="text-gray-500 text-xs">Today at 2:40 PM</span>
                          </div>
                          <p className="text-gray-300 text-sm">Just finished the DefCon writeup - amazing techniques this year! 🔥</p>
                          <div className="mt-2 flex space-x-2">
                            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">defcon.pdf</span>
                            <i className="fas fa-download text-green-400 text-sm mt-1"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-700">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="text" 
                          placeholder="Message #general" 
                          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-green-500 text-sm"
                          disabled
                        />
                        <button className="text-gray-500 hover:text-green-400" title="Coming Soon">
                          <i className="fas fa-paper-plane"></i>
                        </button>
                      </div>
                      <p className="text-gray-500 text-xs mt-2">🚧 Live chat coming soon! For now, join our Discord server:</p>
                      <button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm transition-colors">
                        <i className="fab fa-discord mr-2"></i>Join Discord Server
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Community Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">10,247</div>
                    <div className="text-gray-400 text-sm">Members</div>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">1,432</div>
                    <div className="text-gray-400 text-sm">Online Now</div>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">256</div>
                    <div className="text-gray-400 text-sm">CTF Teams</div>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">89</div>
                    <div className="text-gray-400 text-sm">Countries</div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
        
        {/* Hidden Admin Access - Triggered by Konami Code */}
        <div id="konami-notification" className="fixed top-4 right-4 bg-green-600 border border-green-400 rounded-lg p-4 text-white shadow-lg transform translate-x-full transition-transform duration-300 z-50">
          <div className="flex items-center space-x-2">
            <i className="fas fa-unlock-alt"></i>
            <span>Secret access unlocked! Click the terminal icon 5 times.</span>
          </div>
        </div>
        
        {/* Secret Admin Button (visible after Konami code) */}
        <button id="secret-admin-btn" className="fixed bottom-4 right-4 w-12 h-12 bg-gray-900 border-2 border-green-500 rounded-full flex items-center justify-center text-green-400 hover:bg-green-600 hover:text-white transition-all duration-300 hidden" title="Admin Dashboard">
          <i className="fas fa-terminal"></i>
        </button>
      </div>
      
      <script src="/static/app.js"></script>
    </div>
  )
})

// Authentication routes
app.get('/login', (c) => {
  return c.render(
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 border border-green-500 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <i className="fas fa-terminal text-4xl text-green-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-green-400">Access CYB Guide</h2>
          <p className="text-gray-400 mt-2">Choose your authentication method</p>
        </div>
        
        <div className="space-y-4">
          <button className="w-full bg-white hover:bg-gray-100 text-gray-900 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
            <i className="fab fa-google"></i>
            <span>Continue with Google</span>
          </button>
          
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
            <i className="fab fa-discord"></i>
            <span>Continue with Discord</span>
          </button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">By continuing, you agree to our ethical use policy</p>
        </div>
      </div>
    </div>
  )
})

// Terms and Privacy routes
app.get('/terms', (c) => {
  return c.render(
    <div className="min-h-screen bg-black text-green-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400 mb-8">Terms & Conditions</h1>
        <div className="bg-gray-900 border border-green-500 rounded-lg p-6 space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">Educational Purpose Only</h2>
            <p>CYB Guide is strictly for educational purposes. All content, tools, and techniques shared are intended for learning cybersecurity in controlled, authorized laboratory environments only.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">Prohibited Activities</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Unauthorized access to any computer systems or networks</li>
              <li>Attacking or testing systems without explicit written permission</li>
              <li>Using learned techniques for malicious purposes</li>
              <li>Sharing vulnerabilities publicly before responsible disclosure</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">User Responsibility</h2>
            <p>Users are solely responsible for ensuring their activities comply with local laws and regulations. CYB Guide is not liable for any misuse of the provided information.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">Activity Logging</h2>
            <p>User activities are logged for educational tracking and security purposes. This includes page visits, resource access, and learning progress.</p>
          </section>
        </div>
      </div>
    </div>
  )
})

app.get('/privacy', (c) => {
  return c.render(
    <div className="min-h-screen bg-black text-green-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400 mb-8">Privacy Policy</h1>
        <div className="bg-gray-900 border border-green-500 rounded-lg p-6 space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">Information Collection</h2>
            <p>We collect information necessary for providing educational services, including email addresses, learning progress, and interaction logs.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">Data Usage</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Tracking educational progress and completion</li>
              <li>Improving platform functionality and user experience</li>
              <li>Ensuring compliance with ethical use policies</li>
              <li>Providing personalized learning recommendations</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">Data Storage</h2>
            <p>Activity data is stored securely using Google Sheets with appropriate access controls. Data is retained for educational analytics and platform improvement purposes.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">Data Sharing</h2>
            <p>We do not sell or share personal information with third parties except as required by law or for platform functionality (e.g., OAuth providers).</p>
          </section>
        </div>
      </div>
    </div>
  )
})

export default app