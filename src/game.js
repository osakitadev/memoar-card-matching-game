'use strict'

const DECK_ROWS = 4
const DECK_COLS = 5
const IMAGES = [
  'image01.png',
  'image02.jpg',
  'image03.jpg',
  'image04.jpg',
  'image05.jpg',
  'image06.jpg',
  'image07.jpg',
  'image08.jpg',
  'image09.jpg',
  'image10.jpg',
]

const deck = document.getElementById('card-deck')
const missesLabel = document.getElementById('score-misses')
const movesLabel = document.getElementById('score-moves')
const accuracyLabel = document.getElementById('score-accuracy')
const resetGameBtn = document.getElementById('reset-game')

let selectedPairs = [null, null]
let misses = 0
let moves = 0
let canSelectCards = true

const renderDeckCards = () => {
  for (let _ = 0; _ < DECK_ROWS * DECK_COLS; _++) {
    deck.insertAdjacentHTML(
      'beforeend',
      `
      <button class="card">
        <div class="card-image"></div>
      </button>
    `
    )
  }

  deck.style.gridTemplateColumns = `repeat(${DECK_COLS}, 1fr)`
  deck.style.gridTemplateRows = `repeat(${DECK_ROWS}, 1fr)`
}

const updateScoreboard = () => {
  const accuracy = ((moves - misses) / moves) * 100

  missesLabel.textContent = misses
  movesLabel.textContent = moves
  accuracyLabel.textContent = `${isNaN(accuracy) ? 100 : accuracy}%`
}

const shuffleDeck = () => {
  const cards = Array.from(document.querySelectorAll('.card-image'))

  const totalPairs = cards.length / 2
  const selectedImages = IMAGES.slice(0, totalPairs)
  const imagePool = selectedImages.flatMap(image => [image, image])

  for (let i = imagePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[imagePool[i], imagePool[j]] = [imagePool[j], imagePool[i]]
  }

  cards.forEach((card, index) => {
    const imageName = imagePool[index]

    card.style.backgroundImage = `url(./assets/${imageName})`
    card.style.opacity = '0'
    card.parentElement.style.opacity = '1'
    card.dataset.imageId = imageName // For identification
  })
}

const checkPairs = () => {
  const [firstCard, secondCard] = selectedPairs

  if (!firstCard || !secondCard || firstCard === secondCard) return

  const firstId = firstCard.dataset.imageId
  const secondId = secondCard.dataset.imageId

  canSelectCards = false
  moves++

  const resetCards = () => {
    selectedPairs.fill(null)
    canSelectCards = true
  }

  if (firstId === secondId) {
    setTimeout(() => {
      selectedPairs.forEach(card => {
        card.parentElement.style.opacity = '0'
        card.parentElement.setAttribute('disabled', true)
      })

      resetCards()
    }, 1000)
  } else {
    setTimeout(() => {
      selectedPairs.forEach(card => (card.style.opacity = '0'))
      resetCards()
    }, 1000)

    misses++
  }

  updateScoreboard()
}

renderDeckCards()
shuffleDeck()

document.querySelectorAll('.card').forEach(cardButton => {
  cardButton.addEventListener('click', () => {
    if (!canSelectCards) return

    const cardImage = cardButton.firstElementChild

    cardImage.style.opacity = '1'

    selectedPairs[0]
      ? (selectedPairs[1] = cardImage)
      : (selectedPairs[0] = cardImage)

    checkPairs()
  })
})

resetGameBtn.addEventListener('click', () => {
  misses = 0
  moves = 0

  shuffleDeck()
  updateScoreboard()

  accuracyLabel.textContent = '100%'
})
