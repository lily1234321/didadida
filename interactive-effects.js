// Interactive Effects System
class InteractiveEffects {
  constructor() {
    this.cursor = null
    this.fallingObjects = []
    this.mousePosition = { x: 0, y: 0 }
    this.lastMousePosition = { x: 0, y: 0 }
    this.isMouseMoving = false
    this.objects = ["⚈", "⚉", "⚆", "☻", "♘", "☺︎", "⚽︎", "🎲", "⚽︎", "☂︎", "♠︎", "♔", "⚇", "⚾︎", "☯︎"]
    this.pathbotIcons = ["🤖", "🂢", "🃇", "🂱", "🀖", "🀥", "🀧", "🀤", "🀚", "⚆", "🀅", "🀐", "🃚", "🀙", "⚇", "🁸", "🃃", "🁢"]
    this.pathbotColors = [
      "#ffffff",
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#f9ca24",
      "#f0932b",
      "#eb4d4b",
      "#6c5ce7",
      "#a29bfe",
      "#fd79a8",
      "#fdcb6e",
      "#e17055",
      "#00b894",
      "#00cec9",
      "#0984e3",
      "#74b9ff",
      "#e84393",
      "#fd79a8",
    ]

    this.init()
  }

  init() {
    this.createCustomCursor()
    this.setupEventListeners()
    this.initBounceText()
    this.startFallingObjects()
    this.initPathbotCustomization()
  }

  createCustomCursor() {
    this.cursor = document.createElement("div")
    this.cursor.className = "custom-cursor"
    document.body.appendChild(this.cursor)
  }

  setupEventListeners() {
    // Mouse movement
    document.addEventListener("mousemove", (e) => {
      this.lastMousePosition = { ...this.mousePosition }
      this.mousePosition = { x: e.clientX, y: e.clientY }
      this.isMouseMoving = true

      if (this.cursor) {
        this.cursor.style.left = e.clientX + "px"
        this.cursor.style.top = e.clientY + "px"
      }

      this.checkCollisions()
      this.createMouseTrail()

      clearTimeout(this.mouseStopTimeout)
      this.mouseStopTimeout = setTimeout(() => {
        this.isMouseMoving = false
      }, 100)
    })

    // Mouse click effects
    document.addEventListener("mousedown", () => {
      if (this.cursor) {
        this.cursor.classList.add("clicking")
      }
    })

    document.addEventListener("mouseup", () => {
      if (this.cursor) {
        this.cursor.classList.remove("clicking")
      }
    })

    // Prevent context menu
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault()
    })
  }

  createMouseTrail() {
    if (!this.isMouseMoving) return

    const trail = document.createElement("div")
    trail.className = "mouse-trail"
    trail.style.left = this.mousePosition.x + "px"
    trail.style.top = this.mousePosition.y + "px"
    document.body.appendChild(trail)

    setTimeout(() => {
      document.body.removeChild(trail)
    }, 800)
  }

  initBounceText() {
    const textElements = document.querySelectorAll("h1, h2, h3, h4, p, a, span, button")

    textElements.forEach((element) => {
      if (
        element.closest(".pathbot-header") ||
        element.closest("#pathbot-messages") ||
        element.closest(".custom-cursor") ||
        element.classList.contains("bounce-text")
      ) {
        return
      }

      const text = element.textContent
      if (text.trim().length === 0) return

      element.classList.add("bounce-text")
      element.innerHTML = text
        .split("")
        .map((char) => {
          if (char === " ") return " "
          return `<span class="bounce-letter">${char}</span>`
        })
        .join("")
    })
  }

  startFallingObjects() {
    // Increased quantity: more frequent creation
    setInterval(
      () => {
        this.createFallingObject()
      },
      1000 + Math.random() * 2000, // Faster interval
    )

    // Create initial objects
    for (let i = 0; i < 5; i++) {
      // More initial objects
      setTimeout(() => {
        this.createFallingObject()
      }, i * 500)
    }
  }

  createFallingObject() {
    const object = document.createElement("div")
    object.className = "falling-object"
    object.textContent = this.objects[Math.floor(Math.random() * this.objects.length)]

    const startX = Math.random() * window.innerWidth
    object.style.left = startX + "px"
    object.style.top = "-50px"

    const velocity = {
      x: (Math.random() - 0.5) * 2,
      y: 2 + Math.random() * 3,
    }

    const objectData = {
      element: object,
      x: startX,
      y: -50,
      velocity: velocity,
      size: 36, // Matches CSS font-size
      landed: false, // New property to track if it has landed
    }

    this.fallingObjects.push(objectData)
    document.body.appendChild(object)

    this.animateFallingObject(objectData)
  }

  animateFallingObject(objectData) {
    const animate = () => {
      if (objectData.landed) {
        // If landed, stop animating its position
        return
      }

      objectData.x += objectData.velocity.x
      objectData.y += objectData.velocity.y

      // Bounce off walls
      if (objectData.x <= 0 || objectData.x >= window.innerWidth - objectData.size) {
        objectData.velocity.x *= -0.8
        objectData.x = Math.max(0, Math.min(window.innerWidth - objectData.size, objectData.x))
      }

      // Check for landing at the bottom of the viewport
      if (objectData.y + objectData.size >= window.innerHeight) {
        objectData.y = window.innerHeight - objectData.size // Snap to bottom
        objectData.landed = true // Mark as landed
        objectData.element.style.top = objectData.y + "px" // Update final position
        objectData.element.style.left = objectData.x + "px"
        // No need to remove from fallingObjects, just stop its animation loop
        return
      }

      objectData.element.style.left = objectData.x + "px"
      objectData.element.style.top = objectData.y + "px"

      requestAnimationFrame(animate)
    }

    animate()
  }

  checkCollisions() {
    this.fallingObjects.forEach((objectData) => {
      const distance = Math.sqrt(
        Math.pow(objectData.x - this.mousePosition.x, 2) + Math.pow(objectData.y - this.mousePosition.y, 2),
      )

      if (distance < 30) {
        this.handleCollision(objectData)
      }
    })
  }

  handleCollision(objectData) {
    // Create collision effect
    const effect = document.createElement("div")
    effect.className = "collision-effect"
    effect.style.left = objectData.x + "px"
    effect.style.top = objectData.y + "px"
    document.body.appendChild(effect)

    setTimeout(() => {
      document.body.removeChild(effect)
    }, 500)

    // Bounce object away from cursor
    const dx = objectData.x - this.mousePosition.x
    const dy = objectData.y - this.mousePosition.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 0) {
      objectData.velocity.x = (dx / distance) * 8
      objectData.velocity.y = (dy / distance) * 8
    }

    objectData.element.classList.add("bouncing")
    setTimeout(() => {
      objectData.element.classList.remove("bouncing")
    }, 300)
  }

  // removeFallingObject is no longer needed as objects now land and stay
  // but keeping it for reference if needed for other logic
  removeFallingObject(objectData) {
    const index = this.fallingObjects.indexOf(objectData)
    if (index > -1) {
      this.fallingObjects.splice(index, 1)
      if (objectData.element.parentNode) {
        objectData.element.parentNode.removeChild(objectData.element)
      }
    }
  }

  initPathbotCustomization() {
    // Add customization panel
    const panel = document.createElement("div")
    panel.className = "pathbot-customization"
    panel.innerHTML = `
    <div class="customization-header">
      <h3>Customize PathBot</h3>
      <button class="customization-close" onclick="closePathbotCustomization()">×</button>
    </div>
    <div class="icon-section">
      <h4>Choose Icon</h4>
      <div class="icon-grid">
        ${this.pathbotIcons.map((icon) => `<div class="icon-option" data-icon="${icon}">${icon}</div>`).join("")}
      </div>
    </div>
    <div class="color-options">
      <h4>Choose Color</h4>
      <div class="color-grid">
        ${this.pathbotColors
          .map((color) => `<div class="color-option" data-color="${color}" style="background-color: ${color}"></div>`)
          .join("")}
      </div>
    </div>
  `

    document.body.appendChild(panel)

    // Setup customization events
    this.setupPathbotCustomization(panel)

    // Add right-click to PathBot for customization
    const pathbotFab = document.getElementById("pathbot-fab")
    if (pathbotFab) {
      pathbotFab.classList.add("customizable")
      pathbotFab.addEventListener("contextmenu", (e) => {
        e.preventDefault()
        panel.classList.add("active")
      })
    }
  }

  setupPathbotCustomization(panel) {
    const iconOptions = panel.querySelectorAll(".icon-option")
    const colorOptions = panel.querySelectorAll(".color-option")
    const pathbotFab = document.getElementById("pathbot-fab")

    // Load saved customization
    const savedIcon = localStorage.getItem("pathbot-icon") || "🤖"
    const savedColor = localStorage.getItem("pathbot-color") || "#ffffff"

    if (pathbotFab) {
      pathbotFab.textContent = savedIcon
      pathbotFab.style.background = savedColor
    }

    // Mark current selections
    iconOptions.forEach((option) => {
      if (option.dataset.icon === savedIcon) {
        option.classList.add("selected")
      }
      option.addEventListener("click", () => {
        iconOptions.forEach((opt) => opt.classList.remove("selected"))
        option.classList.add("selected")

        const newIcon = option.dataset.icon
        if (pathbotFab) {
          pathbotFab.textContent = newIcon
        }
        localStorage.setItem("pathbot-icon", newIcon)
      })
    })

    colorOptions.forEach((option) => {
      if (option.dataset.color === savedColor) {
        option.classList.add("selected")
      }
      option.addEventListener("click", () => {
        colorOptions.forEach((opt) => opt.classList.remove("selected"))
        option.classList.add("selected")

        const newColor = option.dataset.color
        if (pathbotFab) {
          pathbotFab.style.background = newColor
        }
        localStorage.setItem("pathbot-color", newColor)
      })
    })
  }
}

// Global functions for customization
function closePathbotCustomization() {
  const panel = document.querySelector(".pathbot-customization")
  if (panel) {
    panel.classList.remove("active")
  }
}

// Initialize interactive effects when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Wait a bit to ensure all other scripts are loaded
  setTimeout(() => {
    window.interactiveEffects = new InteractiveEffects()
  }, 500)
})

// Close customization panel when clicking outside
document.addEventListener("click", (e) => {
  const panel = document.querySelector(".pathbot-customization")
  const pathbotFab = document.getElementById("pathbot-fab")

  // Check if the click is outside the panel AND not on the fab button itself
  if (
    panel &&
    panel.classList.contains("active") &&
    !panel.contains(e.target) &&
    (!pathbotFab || !pathbotFab.contains(e.target))
  ) {
    closePathbotCustomization()
  }
})
