// Global variables
let currentPlan = null
const userHistory = JSON.parse(localStorage.getItem("userHistory") || "[]")
const userInterests = JSON.parse(localStorage.getItem("userInterests") || "{}")

// Plan data
const planData = {
  "digital-art": {
    title: "Digital Art Exploration",
    icon: "🎨",
    steps: [
      {
        title: "Watch Tutorial Video",
        description: "Watch a 5-minute digital illustration tutorial to understand basic concepts and tools",
      },
      {
        title: "Try Simple Line Art",
        description: "Use your phone or computer to draw a simple line sketch of anything you want",
      },
      {
        title: "Record Your Feelings",
        description: "Think about how you felt during this process - which parts did you find interesting?",
      },
    ],
    category: "art",
  },
  expression: {
    title: "Expression Skills Enhancement",
    icon: "🎤",
    steps: [
      {
        title: "Choose a Topic",
        description: "Think of something happy that happened to you recently",
      },
      {
        title: "Record Video",
        description: "Use your phone to record a 1-minute video naturally sharing this happy moment",
      },
      {
        title: "Review and Reflect",
        description: "Watch the video back and notice your expression style and emotional delivery",
      },
    ],
    category: "communication",
  },
  emotion: {
    title: "Emotional Awareness",
    icon: "🧠",
    steps: [
      {
        title: "Identify Emotion",
        description: "Use an Emoji to represent your main emotion today",
      },
      {
        title: "Describe Emotion",
        description: "Write one sentence explaining why you feel this way",
      },
      {
        title: "Accept Emotion",
        description: "Tell yourself: This emotion is normal, and I accept it",
      },
    ],
    category: "psychology",
  },
  creation: {
    title: "Creative Exploration",
    icon: "🎬",
    steps: [
      {
        title: "Choose a Scene",
        description: "Find a scene or moment that you find interesting",
      },
      {
        title: "Film Vlog",
        description: "Record a 10-second short clip capturing your current feelings",
      },
      {
        title: "Creative Thinking",
        description: "Think about how to make this clip more creative or expressive",
      },
    ],
    category: "creation",
  },
  writing: {
    title: "Written Expression",
    icon: "✍️",
    steps: [
      {
        title: "Find Inspiration",
        description: "Think back to any small discoveries or insights you had today",
      },
      {
        title: "Free Writing",
        description: 'Write a 100-word short story with the theme "A small discovery today"',
      },
      {
        title: "Polish and Perfect",
        description: "Read through what you wrote and see if it expresses what you wanted to say",
      },
    ],
    category: "writing",
  },
}

// Recommendation content data
const recommendationData = {
  love: {
    title: "Awesome! You really enjoyed this direction",
    subtitle: "We've prepared deeper exploration suggestions for you",
    suggestions: [
      {
        title: "Deep Learning",
        description: "Watch more related tutorial videos or articles",
      },
      {
        title: "Join Community",
        description: "Find related online or offline learning groups",
      },
      {
        title: "Practice Regularly",
        description: "Set a small goal to practice 15 minutes daily",
      },
      {
        title: "Find a Mentor",
        description: "Chat with someone experienced in this field",
      },
    ],
  },
  neutral: {
    title: "That's okay, exploration is like this",
    subtitle: "Maybe you like this way of exploring? Let's try a different angle",
    suggestions: [
      {
        title: "Try Different Approach",
        description: "Try similar activities but in different formats",
      },
      {
        title: "Lower the Difficulty",
        description: "Start with simpler versions of the experience",
      },
      {
        title: "Combine Interests",
        description: "Combine this activity with your known interests",
      },
      {
        title: "Find a Partner",
        description: "Try it with friends - it might be more fun",
      },
    ],
  },
  dislike: {
    title: "The meaning of exploration is trial and error",
    subtitle: "Discovering what you don't like is also a gain! You can try these directions",
    suggestions: [
      {
        title: "Sports & Fitness",
        description: "Try a new sport or fitness routine",
      },
      {
        title: "Music Exploration",
        description: "Learn an instrument or try music creation",
      },
      {
        title: "Photography Practice",
        description: "Take 10 photos from different angles with your phone",
        icon: "📸",
      },
      {
        title: "Cooking Experience",
        description: "Try making a simple new dish",
        icon: "👨‍🍳",
      },
    ],
  },
}

// Function to scroll to a section and manage visibility of dynamic sections
function scrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    // Hide dynamic sections before scrolling
    document.getElementById("plan-execution-section").classList.remove("active")
    document.getElementById("recommendations-section").classList.remove("active")
    document.getElementById("plan-execution-section").classList.add("hidden")
    document.getElementById("recommendations-section").classList.add("hidden")

    targetSection.scrollIntoView({ behavior: "smooth" })
  }
  closeMobileMenu() // Close sidebar after navigation
}

// Function to show dynamic sections (Plan Execution, Recommendations)
function showDynamicSection(sectionId) {
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    // Hide other dynamic sections first
    document.getElementById("plan-execution-section").classList.remove("active")
    document.getElementById("recommendations-section").classList.remove("active")
    document.getElementById("plan-execution-section").classList.add("hidden")
    document.getElementById("recommendations-section").classList.add("hidden")

    // Show the target dynamic section
    targetSection.classList.remove("hidden")
    setTimeout(() => {
      targetSection.classList.add("active")
      targetSection.scrollIntoView({ behavior: "smooth" })
    }, 10) // Small delay for transition to apply

    // Apply theme for dynamic sections (they are all light theme in this setup)
    document.body.classList.remove("theme-dark")
    document.body.classList.add("theme-light")
  }
  closeMobileMenu() // Close sidebar after navigation
}

// Select plan
function selectPlan(planId) {
  currentPlan = planId
  const plan = planData[planId]

  if (!plan) return

  // Update execution page content
  document.getElementById("execution-title").textContent = `Start your ${plan.title}`
  document.getElementById("execution-subtitle").textContent = "Follow the guide to complete this simple exploration"
  document.getElementById("detail-icon").textContent = plan.icon
  document.getElementById("detail-title").textContent = plan.title

  // Generate steps
  const stepsContainer = document.getElementById("plan-steps")
  stepsContainer.innerHTML = plan.steps
    .map(
      (step, index) => `
      <div class="step-item">
          <div class="step-number">${index + 1}</div>
          <div class="step-content">
              <h4>${step.title}</h4>
              <p>${step.description}</p>
          </div>
      </div>
  `,
    )
    .join("")

  // Reset feedback area
  document.getElementById("feedback-section").style.display = "none"

  showDynamicSection("plan-execution-section")
}

// Mark completion status
function markCompleted(completed) {
  if (completed) {
    document.getElementById("feedback-section").style.display = "block"
    document.getElementById("feedback-section").scrollIntoView({ behavior: "smooth" })
  } else {
    // Allow skip, go directly to recommendation page
    showRecommendations("neutral")
  }
}

// Submit feedback
function submitFeedback(feedbackType) {
  const feedbackText = document.getElementById("feedback-text").value
  const plan = planData[currentPlan]

  // Save to history
  const historyItem = {
    id: Date.now(),
    date: new Date().toISOString(),
    planId: currentPlan,
    planTitle: plan.title,
    planIcon: plan.icon,
    feedback: feedbackType,
    feedbackText: feedbackText,
    completed: true,
  }

  userHistory.unshift(historyItem)
  localStorage.setItem("userHistory", JSON.stringify(userHistory))

  // Update interest data
  updateInterestData(plan.category, feedbackType)

  // Show recommendations
  showRecommendations(feedbackType)
}

// Update interest data
function updateInterestData(category, feedback) {
  if (!userInterests[category]) {
    userInterests[category] = { count: 0, score: 0 }
  }

  userInterests[category].count++

  switch (feedback) {
    case "love":
      userInterests[category].score += 2
      break
    case "neutral":
      userInterests[category].score += 0.5
      break
    case "dislike":
      userInterests[category].score -= 1
      break
  }

  localStorage.setItem("userInterests", JSON.stringify(userInterests))
}

// Show recommendations
function showRecommendations(feedbackType) {
  const recommendation = recommendationData[feedbackType]

  document.getElementById("recommendation-title").textContent = recommendation.title
  document.getElementById("recommendation-subtitle").textContent = recommendation.subtitle

  const contentContainer = document.getElementById("recommendation-content")
  contentContainer.innerHTML = `
      <div class="recommendation-section">
          <h3>Recommended for You</h3>
          <div class="recommendation-grid">
              ${recommendation.suggestions
                .map(
                  (suggestion) => `
                  <div class="recommendation-item" onclick="handleRecommendationClick('${suggestion.title}')">
                      <h4>${suggestion.title}</h4>
                      <p>${suggestion.description}</p>
                  </div>
              `,
                )
                .join("")}
          </div>
          <div style="text-align: center; margin-top: 40px;">
              <button class="cta-button" onclick="scrollToSection('plans-section')">
                  <span>Continue exploring new plans</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4.16667 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
              </button>
          </div>
      </div>
  `

  showDynamicSection("recommendations-section")
}

// Handle recommendation click
function handleRecommendationClick(recommendationType) {
  alert(`Great choice! "${recommendationType}" feature is under development, stay tuned!`)
}

// Initialize history page
function initializeHistoryPage() {
  updateInterestBubbles()
  updateTimeline()
  updateSavedPlans()
}

// Update interest bubbles
function updateInterestBubbles() {
  const bubblesContainer = document.getElementById("interest-bubbles")

  if (Object.keys(userInterests).length === 0) {
    bubblesContainer.innerHTML = `
          <div class="empty-state">
              <div class="empty-state-icon">🌱</div>
              <h3>No interest data yet</h3>
              <p>Complete some small plans and your interest map will appear here</p>
          </div>
      `
    return
  }

  const categoryNames = {
    art: "Art & Creation",
    communication: "Expression & Communication",
    psychology: "Psychology & Awareness",
    creation: "Creative Making",
    writing: "Writing & Creation",
  }

  const bubbles = Object.entries(userInterests)
    .map(([category, data]) => {
      const strength = data.score > 3 ? "strong" : data.score < 0 ? "weak" : ""
      return `
          <div class="interest-bubble ${strength}" style="animation-delay: ${Math.random() * 2}s">
              ${categoryNames[category] || category}
          </div>
      `
    })
    .join("")

  bubblesContainer.innerHTML = bubbles
}

// Update timeline
function updateTimeline() {
  const timelineContainer = document.getElementById("timeline")

  if (userHistory.length === 0) {
    timelineContainer.innerHTML = `
          <div class="empty-state">
              <div class="empty-state-icon">📝</div>
              <h3>No exploration records yet</h3>
              <p>Start your first small plan to record your exploration journey</p>
          </div>
      `
    return
  }

  const timelineItems = userHistory
    .slice(0, 10)
    .map((item) => {
      const date = new Date(item.date).toLocaleDateString("en-US")
      const feedbackEmoji = {
        love: "😍",
        neutral: "🤔",
        dislike: "🙁",
      }

      return `
          <div class="timeline-item">
              <div class="timeline-date">${date}</div>
              <div class="timeline-content">
                  <h4>${item.planIcon} ${item.planTitle}</h4>
                  <p>Feedback: ${feedbackEmoji[item.feedback]} ${item.feedbackText || "No additional comments"}</p>
              </div>
          </div>
      `
    })
    .join("")

  timelineContainer.innerHTML = timelineItems
}

// Update saved plans
function updateSavedPlans() {
  const savedPlansContainer = document.getElementById("saved-plans")

  // Here you can implement save functionality, for now showing recommended plans
  const recommendedPlans = [
    {
      title: "Music Exploration",
      description: "Try learning a simple song",
      icon: "🎵",
    },
    {
      title: "Photography Practice",
      description: "Take 10 photos from different angles with your phone",
      icon: "📸",
    },
    {
      title: "Cooking Experience",
      description: "Try making a simple new dish",
      icon: "👨‍🍳",
    },
  ]

  const savedPlansHTML = recommendedPlans
    .map(
      (plan) => `
      <div class="saved-plan-item">
          <h4>${plan.icon} ${plan.title}</h4>
          <p>${plan.description}</p>
          <button class="saved-plan-btn" onclick="alert('Feature under development, stay tuned!')">
              Start exploring
          </button>
      </div>
  `,
    )
    .join("")

  savedPlansContainer.innerHTML = savedPlansHTML
}

// Mobile sidebar toggle
function toggleMobileMenu() {
  const sidebar = document.getElementById("main-sidebar")
  const hamburger = document.getElementById("sidebar-toggle")

  sidebar.classList.toggle("active")
  hamburger.classList.toggle("active")
}

function closeMobileMenu() {
  const sidebar = document.getElementById("main-sidebar")
  const hamburger = document.getElementById("sidebar-toggle")

  sidebar.classList.remove("active")
  hamburger.classList.remove("active")
}

// Floating action button
function toggleFabMenu() {
  const fabMenu = document.querySelector(".fab-menu")
  fabMenu.classList.toggle("active")
}

// Help function
function openHelp() {
  alert(`Pass Finder User Guide:

🌱 Our Philosophy:
• Low barrier to entry - Each plan takes just a few minutes
• Feedback after experience - You can adjust direction anytime  
• Gradually clarify interests - Discover true interests through exploration
• Non-performance oriented - No "you should", only "why don't you try"

📝 How to use:
1. Choose a small plan that interests you
2. Follow the steps to complete the exploration
3. Provide honest feedback
4. View personalized recommendations
5. Review your growth in "My Journey"

Remember: Exploration isn't about getting it right, it's about allowing yourself to try and learn. Let's walk together!`)
}

// Intersection Observer for fade-in animations, active nav links, and theme switching
const sections = document.querySelectorAll(".page-section")
const navLinks = document.querySelectorAll(".nav-link")

const observerOptions = {
  root: null, // viewport
  rootMargin: "0px",
  threshold: 0.5, // Trigger when 50% of the section is visible
}

const sectionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible")

      // Update active navigation link
      const currentSectionId = entry.target.id
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.dataset.section === currentSectionId) {
          link.classList.add("active")
        }
      })

      // Apply theme based on section's data-theme attribute
      const theme = entry.target.classList.contains("theme-dark") ? "dark" : "light"
      document.body.classList.remove("theme-dark", "theme-light")
      document.body.classList.add(`theme-${theme}`)

      // Special initialization for journey section
      if (currentSectionId === "journey-section") {
        initializeHistoryPage()
      }
    } else {
      // Optional: remove is-visible when out of view, if you want re-animation on scroll back
      // entry.target.classList.remove('is-visible');
    }
  })
}, observerOptions)

// Observe each section
sections.forEach((section) => {
  sectionObserver.observe(section)
})

// Wave Ripple Effect for Buttons and Icons
function createRipple(event) {
  const button = event.currentTarget
  const ripple = document.createElement("span")
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2

  ripple.style.width = ripple.style.height = `${diameter}px`
  ripple.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`
  ripple.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`
  ripple.classList.add("ripple-effect")

  // Remove any existing ripples to prevent stacking visual issues
  const existingRipple = button.querySelector(".ripple-effect")
  if (existingRipple) {
    existingRipple.remove()
  }

  button.appendChild(ripple)

  // Remove ripple after animation
  ripple.addEventListener("animationend", () => {
    ripple.remove()
  })
}

// Attach ripple effect to all buttons and fab items
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button, .fab-item, .nav-link, .icon-option, .color-option") // Also apply to nav links and customization options for consistency
  buttons.forEach((button) => {
    // Ensure button has position: relative and overflow: hidden in CSS
    button.addEventListener("click", createRipple)
  })
})

// Page load initialization
document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar toggle events
  const sidebarToggle = document.getElementById("sidebar-toggle")
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleMobileMenu)
  }

  // Click elsewhere to close sidebar and fab menu
  document.addEventListener("click", (event) => {
    const sidebar = document.getElementById("main-sidebar")
    const sidebarToggle = document.getElementById("sidebar-toggle")

    if (sidebar && sidebarToggle && !sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
      closeMobileMenu()
    }

    // Close floating menu
    const fabMenu = document.querySelector(".fab-menu")
    const fabMain = document.querySelector(".fab-main")

    if (fabMenu && fabMain && !fabMenu.contains(event.target) && !fabMain.contains(event.target)) {
      fabMenu.classList.remove("active")
    }
  })

  // Keyboard shortcut support
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu()
      const fabMenu = document.querySelector(".fab-menu")
      if (fabMenu) fabMenu.classList.remove("active")
      // Also close Pathbot customization panel
      closePathbotCustomization()
    }
  })

  // Initial check for visible sections on load
  // This ensures the first section is visible and animated if it's in view
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top < window.innerHeight && section.getBoundingClientRect().bottom > 0) {
      section.classList.add("is-visible")
      // Set initial theme based on the first visible section
      const theme = section.classList.contains("theme-dark") ? "dark" : "light"
      document.body.classList.add(`theme-${theme}`)
    }
  })
})

// Function to close Pathbot customization panel
function closePathbotCustomization() {
  // Implementation for closing Pathbot customization panel
  const customizationPanel = document.getElementById("pathbot-customization")
  if (customizationPanel) {
    customizationPanel.style.opacity = "0"
    customizationPanel.style.visibility = "hidden"
    customizationPanel.style.transform = "translateY(20px)"

    setTimeout(() => {
      customizationPanel.classList.add("pathbot-hidden")
    }, 300)
  }
}
// PathBot AI advisor functionality (preserved from original)
;(() => {
  const fab = document.getElementById("pathbot-fab")
  const chat = document.getElementById("pathbot-chat")
  const closeBtn = document.getElementById("pathbot-close")
  const sendBtn = document.getElementById("pathbot-send")
  const input = document.getElementById("pathbot-input")
  const messages = document.getElementById("pathbot-messages")

  const HISTORY_KEY = "pathbot_history"
  let currentRequest = null

  // Drag-related variables
  let isDragging = false
  let dragStartX = 0
  let dragStartY = 0
  let fabStartX = 0
  let fabStartY = 0

  function loadHistory() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]")
    messages.innerHTML = ""
    history.forEach((msg) => addMessage(msg.role, msg.content))
    messages.scrollTop = messages.scrollHeight
  }

  function saveHistory(role, content) {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]")
    history.push({ role, content })
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }

  function addMessage(role, content) {
    const div = document.createElement("div")
    div.className = role === "user" ? "pathbot-msg-user" : "pathbot-msg-ai"
    div.innerHTML = `<span>${content.replace(/\n/g, "<br>")}</span>`
    messages.appendChild(div)
    messages.scrollTop = messages.scrollHeight
  }

  async function sendMessage() {
    const text = input.value.trim()
    if (!text) return

    addMessage("user", text)
    saveHistory("user", text)
    input.value = ""
    addMessage("ai", "Thinking...")
    messages.scrollTop = messages.scrollHeight

    // Get user data for personalized responses
    const userHistoryData = JSON.stringify(userHistory.slice(-5))
    const userInterestsData = JSON.stringify(userInterests)

    // Simulate AI response (replace with real API in actual project)
    setTimeout(() => {
      messages.removeChild(messages.lastChild)

      // Simple response logic
      let reply = ""
      if (text.includes("recommend") || text.includes("suggest")) {
        reply =
          "Based on your exploration history, I suggest you could try some new directions. Which field are you most interested in recently?"
      } else if (text.includes("confused") || text.includes("lost")) {
        reply =
          "Feeling confused is very normal - it shows you're thinking seriously. Remember our philosophy: exploration isn't about getting it right, it's about allowing yourself to try and learn. Want to try a simple small plan?"
      } else if (text.includes("interest") || text.includes("like")) {
        reply =
          "Discovering interests is a gradual process. By continuously trying small plans, you'll slowly clarify what you truly like. Every experience is valuable!"
      } else {
        reply =
          "I understand your thoughts. As your exploration buddy, I suggest keeping an open mind - each small plan is an opportunity to understand yourself. Is there anything specific you'd like to chat about?"
      }

      addMessage("ai", reply)
      saveHistory("ai", reply)
    }, 1000)
  }

  // Event binding
  if (fab) {
    fab.onclick = () => {
      chat.classList.remove("pathbot-hidden")
      setTimeout(() => {
        chat.style.opacity = "1"
        chat.style.visibility = "visible"
        chat.style.transform = "translateY(0)"
      }, 10)

      if (messages.children.length === 0) {
        addMessage(
          "ai",
          "Hello! I'm PathBot, your exploration buddy. I can help you think about interest directions, answer questions, or simply chat about your exploration experiences. What would you like to talk about?",
        )
      } else {
        loadHistory()
      }
      setTimeout(() => input.focus(), 200)
    }
  }

  function closeChat() {
    chat.style.opacity = "0"
    chat.style.visibility = "hidden"
    chat.style.transform = "translateY(20px)"

    setTimeout(() => {
      chat.classList.add("pathbot-hidden")
      input.value = ""
      if (currentRequest) {
        currentRequest.abort()
        currentRequest = null
      }
    }, 300)
  }

  if (closeBtn) {
    closeBtn.onclick = closeChat
  }

  // Drag functionality
  function initDragAndDrop() {
    fab.addEventListener("mousedown", (e) => {
      isDragging = true
      dragStartX = e.clientX
      dragStartY = e.clientY

      const rect = fab.getBoundingClientRect()
      fabStartX = rect.left
      fabStartY = rect.top

      fab.style.cursor = "grabbing"
      e.preventDefault()
    })

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return

      const deltaX = e.clientX - dragStartX
      const deltaY = e.clientY - dragStartY

      const newX = fabStartX + deltaX
      const newY = fabStartY + deltaY

      const maxX = window.innerWidth - fab.offsetWidth
      const maxY = window.innerHeight - fab.offsetHeight

      const boundedX = Math.max(0, Math.min(newX, maxX))
      const boundedY = Math.max(0, Math.min(newY, maxY))

      fab.style.left = boundedX + "px"
      fab.style.top = boundedY + "px"
      fab.style.right = "auto"
      fab.style.bottom = "auto"

      const chatX = boundedX + 30 - chat.offsetWidth
      const chatY = boundedY - 70 - chat.offsetHeight

      const chatMaxX = window.innerWidth - chat.offsetWidth
      const chatMaxY = window.innerHeight - chat.offsetHeight

      const chatBoundedX = Math.max(0, Math.min(chatX, chatMaxX))
      const chatBoundedY = Math.max(0, Math.min(chatY, chatMaxY))

      chat.style.left = chatBoundedX + "px"
      chat.style.top = chatBoundedY + "px"
      chat.style.right = "auto"
      chat.style.bottom = "auto"
    })

    document.addEventListener("mouseup", () => {
      if (!isDragging) return

      isDragging = false
      fab.style.cursor = "grab"

      const rect = fab.getBoundingClientRect()
      localStorage.setItem(
        "pathbot_fab_position",
        JSON.stringify({
          x: rect.left,
          y: rect.top,
        }),
      )
    })

    fab.addEventListener("dblclick", () => {
      fab.style.left = "auto"
      fab.style.top = "auto"
      fab.style.right = "calc(var(--spacing-lg) + var(--sidebar-width))" // Reset to default with sidebar offset
      fab.style.bottom = "140px"

      chat.style.left = "auto"
      chat.style.top = "auto"
      chat.style.right = "calc(var(--spacing-lg) + var(--sidebar-width))" // Reset to default with sidebar offset
      chat.style.bottom = "210px"

      localStorage.removeItem("pathbot_fab_position")
    })
  }

  if (sendBtn) {
    sendBtn.onclick = sendMessage
  }

  if (input) {
    input.onkeydown = (e) => {
      if (e.key === "Enter") sendMessage()
    }
  }

  // Restore position
  function restorePosition() {
    const savedPosition = localStorage.getItem("pathbot_fab_position")
    if (savedPosition && fab && chat) {
      try {
        const position = JSON.parse(savedPosition)

        fab.style.left = position.x + "px"
        fab.style.top = position.y + "px"
        fab.style.right = "auto"
        fab.style.bottom = "auto"

        const chatX = position.x + 30 - chat.offsetWidth
        const chatY = position.y - 70 - chat.offsetHeight

        const chatMaxX = window.innerWidth - chat.offsetWidth
        const chatMaxY = window.innerHeight - chat.offsetHeight

        const chatBoundedX = Math.max(0, Math.min(chatX, chatMaxX))
        const chatBoundedY = Math.max(0, Math.min(chatY, chatMaxY))

        chat.style.left = chatBoundedX + "px"
        chat.style.top = chatBoundedY + "px"
        chat.style.right = "auto"
        chat.style.bottom = "auto"
      } catch (e) {
        console.log("Position restore failed, using default position")
      }
    }
  }

  // Initialize
  document.addEventListener("DOMContentLoaded", () => {
    if (fab) {
      fab.style.display = "flex"
      restorePosition()
      initDragAndDrop()
    }
    if (chat) {
      chat.classList.add("pathbot-hidden")
    }
    if (messages) {
      messages.innerHTML = ""
    }
  })
})()
