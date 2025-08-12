const nums = document.querySelector('.nums')
const counter = document.querySelector('.counter')
const finalMessage = document.querySelector('.final')
const replay = document.querySelector('#replay')
const setup = document.querySelector('.setup')
const startBtn = document.querySelector('#startBtn')
const countdownInput = document.querySelector('#countdownInput')
const stopBtn = document.querySelector('#stopBtn')

let countdownNumber = 3
let stopRequested = false

// Initially hide counter and final message
counter.style.display = 'none'
finalMessage.style.display = 'none'

function createCountdownSpans(count) {
  nums.innerHTML = ''
  for (let i = count; i >= 0; i--) {
    const span = document.createElement('span')
    span.textContent = i
    if (i === count) span.classList.add('in')
    nums.appendChild(span)
  }
}

function resetDOM() {
  counter.classList.remove('hide')
  finalMessage.classList.remove('show')
  
  const spans = nums.querySelectorAll('span')
  spans.forEach((span) => {
    span.classList.value = ''
  })
  
  if (spans.length > 0) {
    spans[0].classList.add('in')
  }
}

function runAnimation() {
  const spans = nums.querySelectorAll('span')
  spans.forEach((span, idx) => {
    const nextToLast = spans.length - 1

    span.addEventListener('animationend', (e) => {
      if (stopRequested) {
        // Abort progression and return to setup
        counter.classList.remove('hide')
        finalMessage.classList.remove('show')
        counter.style.display = 'none'
        finalMessage.style.display = 'none'
        setup.style.display = 'block'
        return
      }
      if (e.animationName === 'goIn' && idx !== nextToLast) {
        span.classList.remove('in')
        span.classList.add('out')
      } else if (e.animationName === 'goOut' && span.nextElementSibling) {
        span.nextElementSibling.classList.add('in')
      } else {
        counter.classList.add('hide')
        finalMessage.classList.add('show')
      }
    })
  })
}

// Start button event listener
startBtn.addEventListener('click', () => {
  // Read and clamp input
  countdownNumber = parseInt(countdownInput.value, 10)
  if (Number.isNaN(countdownNumber)) countdownNumber = 3
  if (countdownNumber < 1) countdownNumber = 1
  if (countdownNumber > 99) countdownNumber = 99

  // Rebuild the numbers and reset classes
  createCountdownSpans(countdownNumber)
  counter.classList.remove('hide')
  finalMessage.classList.remove('show')
  resetDOM()

  // Switch screens
  setup.style.display = 'none'
  counter.style.display = 'block'
  finalMessage.style.display = 'block'

  // Ensure the browser paints before starting animations
  stopRequested = false
  requestAnimationFrame(() => {
    runAnimation()
  })
})

// Replay button event listener
replay.addEventListener('click', () => {
  // Return to setup to allow a new number
  stopRequested = true
  counter.style.display = 'none'
  finalMessage.style.display = 'none'
  setup.style.display = 'block'
  // Clear any classes so next start is clean
  resetDOM()
})

// Stop button event listener
stopBtn.addEventListener('click', () => {
  stopRequested = true
  counter.classList.remove('hide')
  finalMessage.classList.remove('show')
  counter.style.display = 'none'
  finalMessage.style.display = 'none'
  setup.style.display = 'block'
  resetDOM()
})
