
import { historicalPersons, Room } from "../roomClass.js"

document.addEventListener('DOMContentLoaded', function () {

    // GET CENTURY FROM URL
    let urlParams = new URLSearchParams(window.location.search)
    let selectedCentury = urlParams.get('century')

    let room = new Room(historicalPersons)
    room.century = selectedCentury
    room.loadFromLocalStorage()

    // SET NAVBAR COLOR
    let navbarElement = document.querySelector('.navbar')
    if (navbarElement) {
        navbarElement.style.background = room.color
    }

    // Set page background to match century theme with image
    document.body.style.background = room.color
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundAttachment = 'fixed'

    // SET BACK TO ROOM LINK
    let backToRoomLink = document.querySelector('#back-to-room-link')
    backToRoomLink.href = `../room-view/roomViewPage.html?century=${selectedCentury}`

    let backToRoomBtn = document.querySelector('#back-to-room-btn')
    backToRoomBtn.addEventListener('click', () => {
        window.location.href = `../room-view/roomViewPage.html?century=${selectedCentury}`
    })

    // GAME STATE
    let gameState = {
        currentMode: null,
        score: 0,
        round: 1,
        totalRounds: 5,
        selectedCards: [],
        currentRoundData: null,
        correctAnswer: null
    }

    // DOM ELEMENTS
    let gameModeSelection = document.querySelector('#game-mode-selection')
    let gamePlayArea = document.querySelector('#game-play-area')
    let gameOverScreen = document.querySelector('#game-over-screen')
    let gameCardsContainer = document.querySelector('#game-cards-container')
    let currentModeTitle = document.querySelector('#current-mode-title')
    let gameInstructions = document.querySelector('#game-instructions')
    let scoreDisplay = document.querySelector('#score')
    let roundDisplay = document.querySelector('#round')
    let submitAnswerBtn = document.querySelector('#submit-answer')
    let nextRoundBtn = document.querySelector('#next-round')
    let feedbackMessage = document.querySelector('#feedback-message')
    let backToModesBtn = document.querySelector('#back-to-modes')
    let playAgainBtn = document.querySelector('#play-again')

    // UTILITY FUNCTIONS
    function shuffleArray(array) {
        let shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    }

    function getRandomPersons(count, filterCentury = null) {
        let availablePersons = filterCentury
            ? historicalPersons.filter(p => p.century === filterCentury)
            : historicalPersons

        let shuffled = shuffleArray(availablePersons)
        return shuffled.slice(0, count)
    }

    function showFeedback(message, isCorrect) {
        feedbackMessage.textContent = message
        feedbackMessage.className = isCorrect ? 'feedback-correct' : 'feedback-incorrect'
        feedbackMessage.style.display = 'block'

        setTimeout(() => {
            feedbackMessage.style.display = 'none'
        }, 3000)
    }

    function updateScore(points) {
        gameState.score += points
        scoreDisplay.textContent = gameState.score
    }

    function updateRound() {
        gameState.round++
        roundDisplay.textContent = gameState.round
    }

    // GAME MODE SELECTION
    let gameModeCards = document.querySelectorAll('.game-mode-card')
    gameModeCards.forEach(card => {
        card.addEventListener('click', (e) => {
            let mode = card.dataset.mode
            startGame(mode)
        })
    })

    // START GAME
    function startGame(mode) {
        gameState.currentMode = mode
        gameState.score = 0
        gameState.round = 1
        gameState.selectedCards = []

        scoreDisplay.textContent = '0'
        roundDisplay.textContent = '1'

        gameModeSelection.style.display = 'none'
        gamePlayArea.style.display = 'block'

        switch(mode) {
            case 'trait-match':
                currentModeTitle.textContent = 'Trait Matcher'
                gameInstructions.innerHTML = '<p>Select all people who share the same trait (e.g., writers, activists, heads of state)</p>'
                loadTraitMatchRound()
                break
            case 'century-match':
                currentModeTitle.textContent = 'Century Pairing'
                gameInstructions.innerHTML = '<p>Match each person to their correct century</p>'
                loadCenturyMatchRound()
                break
            case 'time-jumpers':
                currentModeTitle.textContent = 'Time Jumpers'
                gameInstructions.innerHTML = '<p>Find the people who belong to a different century than the rest</p>'
                loadTimeJumpersRound()
                break
        }
    }

    // GAME MODE 1: TRAIT MATCH
    function loadTraitMatchRound() {
        gameCardsContainer.innerHTML = ''
        gameState.selectedCards = []

        // Get all unique traits
        let allTraits = []
        historicalPersons.forEach(person => {
            if (person.traits) {
                allTraits.push(...person.traits)
            }
        })
        let uniqueTraits = [...new Set(allTraits)]

        // Select a random trait
        let targetTrait = uniqueTraits[Math.floor(Math.random() * uniqueTraits.length)]

        // Get people with this trait
        let peopleWithTrait = historicalPersons.filter(p =>
            p.traits && p.traits.includes(targetTrait)
        )

        // Get people without this trait
        let peopleWithoutTrait = historicalPersons.filter(p =>
            !p.traits || !p.traits.includes(targetTrait)
        )

        // Select 3 with trait and 3 without - ensure no duplicates by using names
        let correctPeople = shuffleArray(peopleWithTrait).slice(0, 3)
        let usedPersonNames = new Set(correctPeople.map(p => p.name))

        // Filter out already selected people from incorrect pool
        let availableIncorrectPeople = peopleWithoutTrait.filter(p => !usedPersonNames.has(p.name))
        let incorrectPeople = shuffleArray(availableIncorrectPeople).slice(0, 3)

        let allPeople = shuffleArray([...correctPeople, ...incorrectPeople])

        // Store correct answer
        gameState.correctAnswer = correctPeople.map(p => p.name)
        gameState.currentRoundData = { targetTrait, allPeople }

        // Display instruction with trait
        gameInstructions.innerHTML = `<p>Select all people who are <strong>${targetTrait}s</strong></p>`

        // Create cards
        allPeople.forEach(person => {
            let card = createPersonCard(person, 'selectable')
            gameCardsContainer.appendChild(card)
        })
    }

    // GAME MODE 2: CENTURY MATCH
    function loadCenturyMatchRound() {
        gameCardsContainer.innerHTML = ''
        gameState.selectedCards = []

        // Get 4 random people from different centuries
        let centuries = ['1600s', '1700s', '1800s', '1900s']
        let selectedPeople = []

        centuries.forEach(century => {
            let personsFromCentury = historicalPersons.filter(p => p.century === century)
            if (personsFromCentury.length > 0) {
                let randomPerson = personsFromCentury[Math.floor(Math.random() * personsFromCentury.length)]
                selectedPeople.push(randomPerson)
            }
        })

        selectedPeople = shuffleArray(selectedPeople).slice(0, 4)
        gameState.currentRoundData = { selectedPeople }
        gameState.correctAnswer = {}

        selectedPeople.forEach(person => {
            gameState.correctAnswer[person.name] = person.century
        })

        gameInstructions.innerHTML = '<p>Click on a person, then click on their century to match them</p>'

        // Create person cards
        let personsContainer = document.createElement('div')
        personsContainer.className = 'century-match-persons'

        selectedPeople.forEach(person => {
            let card = createPersonCard(person, 'century-person')
            personsContainer.appendChild(card)
        })

        // Create century cards
        let centuriesContainer = document.createElement('div')
        centuriesContainer.className = 'century-match-centuries'

        centuries.forEach(century => {
            let centuryCard = document.createElement('div')
            centuryCard.className = 'century-card'
            centuryCard.dataset.century = century

            let centuryNumber = parseInt(century.slice(0, 2))
            let displayCentury = (centuryNumber + 1) + 'th Century'

            centuryCard.innerHTML = `
                <h3>${displayCentury}</h3>
                <div class="matched-persons"></div>
            `
            centuriesContainer.appendChild(centuryCard)
        })

        gameCardsContainer.appendChild(personsContainer)
        gameCardsContainer.appendChild(centuriesContainer)

        // Add click handlers for century matching
        setupCenturyMatchHandlers()
    }

    function setupCenturyMatchHandlers() {
        let selectedPerson = null

        document.querySelectorAll('.century-person').forEach(card => {
            card.addEventListener('click', () => {
                // If already matched, allow re-selection to change match
                if (card.classList.contains('matched')) {
                    // Remove previous match
                    let personName = card.dataset.personName
                    gameState.selectedCards = gameState.selectedCards.filter(m => m.person !== personName)

                    // Remove badge from all century cards
                    document.querySelectorAll('.match-badge').forEach(badge => {
                        if (badge.textContent === personName) {
                            badge.remove()
                        }
                    })

                    card.classList.remove('matched')
                }

                // Deselect previous
                document.querySelectorAll('.century-person').forEach(c => c.classList.remove('selected'))
                // Select current
                card.classList.add('selected')
                selectedPerson = card.dataset.personName
            })
        })

        document.querySelectorAll('.century-card').forEach(card => {
            card.addEventListener('click', () => {
                if (selectedPerson) {
                    let century = card.dataset.century

                    // Remove any existing match for this person
                    gameState.selectedCards = gameState.selectedCards.filter(m => m.person !== selectedPerson)

                    // Remove old badges for this person
                    document.querySelectorAll('.match-badge').forEach(badge => {
                        if (badge.textContent === selectedPerson) {
                            badge.remove()
                        }
                    })

                    // Add new match
                    gameState.selectedCards.push({
                        person: selectedPerson,
                        century: century
                    })

                    // Visual feedback
                    let personCard = document.querySelector(`[data-person-name="${selectedPerson}"]`)
                    personCard.classList.add('matched')
                    personCard.classList.remove('selected')

                    let matchedContainer = card.querySelector('.matched-persons')
                    let matchBadge = document.createElement('span')
                    matchBadge.className = 'match-badge'
                    matchBadge.textContent = selectedPerson
                    matchBadge.style.cursor = 'pointer'
                    matchedContainer.appendChild(matchBadge)

                    selectedPerson = null
                }
            })
        })
    }

    // GAME MODE 3: TIME JUMPERS
    function loadTimeJumpersRound() {
        gameCardsContainer.innerHTML = ''
        gameState.selectedCards = []

        let centuries = ['1600s', '1700s', '1800s', '1900s']
        let mainCentury = centuries[Math.floor(Math.random() * centuries.length)]
        let otherCenturies = centuries.filter(c => c !== mainCentury)

        // Get 3 people from main century (to have 5 total)
        let mainCenturyPeople = historicalPersons.filter(p => p.century === mainCentury)
        let selectedMainPeople = shuffleArray(mainCenturyPeople).slice(0, 3)

        // Get 2 "jumpers" from other centuries - ensure no duplicates
        let jumpers = []
        let usedPersonNames = new Set(selectedMainPeople.map(p => p.name))

        let availableOtherPeople = historicalPersons.filter(p =>
            otherCenturies.includes(p.century) && !usedPersonNames.has(p.name)
        )

        let shuffledOtherPeople = shuffleArray(availableOtherPeople)
        jumpers = shuffledOtherPeople.slice(0, 2)

        // Total: 3 from main century + 2 jumpers = 5 persons
        let allPeople = shuffleArray([...selectedMainPeople, ...jumpers])

        gameState.correctAnswer = jumpers.map(p => p.name)
        gameState.currentRoundData = { mainCentury, allPeople, jumpers }

        let centuryNumber = parseInt(mainCentury.slice(0, 2))
        let displayCentury = (centuryNumber + 1) + 'th Century'

        gameInstructions.innerHTML = `<p>Most people are from the <strong>${displayCentury}</strong>. Find the time jumpers from other centuries!</p>`

        allPeople.forEach(person => {
            let card = createPersonCard(person, 'time-jumper')
            gameCardsContainer.appendChild(card)
        })
    }

    // CREATE PERSON CARD
    function createPersonCard(person, cardType) {
        let card = document.createElement('div')
        card.className = `person-game-card ${cardType}`
        card.dataset.personName = person.name
        card.dataset.century = person.century

        // Hide lifespan for century matching and time jumpers games to make it challenging
        let lifespanDisplay = (cardType === 'century-person' || cardType === 'time-jumper') ? '' : `<p>${person.lifespan}</p>`

        card.innerHTML = `
            <div class="card-image">
                <img src="${person.image}" alt="${person.name}">
            </div>
            <div class="card-info">
                <h4>${person.name}</h4>
                ${lifespanDisplay}
            </div>
        `

        if (cardType === 'selectable' || cardType === 'time-jumper') {
            card.addEventListener('click', () => {
                card.classList.toggle('selected')

                if (card.classList.contains('selected')) {
                    if (!gameState.selectedCards.includes(person.name)) {
                        gameState.selectedCards.push(person.name)
                    }
                } else {
                    gameState.selectedCards = gameState.selectedCards.filter(name => name !== person.name)
                }
            })
        }

        return card
    }

    // SUBMIT ANSWER
    submitAnswerBtn.addEventListener('click', () => {
        checkAnswer()
    })

    function checkAnswer() {
        let isCorrect = false
        let points = 0

        switch(gameState.currentMode) {
            case 'trait-match':
            case 'time-jumpers':
                // Check if selected cards match correct answer
                let correctSet = new Set(gameState.correctAnswer)
                let selectedSet = new Set(gameState.selectedCards)

                isCorrect = correctSet.size === selectedSet.size &&
                           [...correctSet].every(name => selectedSet.has(name))

                points = isCorrect ? 20 : 0

                if (isCorrect) {
                    showFeedback('Correct! Well done!', true)
                    // Disable cards and show next button
                    submitAnswerBtn.style.display = 'none'
                    nextRoundBtn.style.display = 'block'
                    nextRoundBtn.textContent = 'Next Round'  // Reset button text to Next Round

                    // Disable all cards
                    document.querySelectorAll('.person-game-card').forEach(card => {
                        card.style.pointerEvents = 'none'
                    })
                } else {
                    showFeedback(`Incorrect. Try again or skip to next round!`, false)
                    // Show both try again and next round buttons
                    submitAnswerBtn.textContent = 'Try Again'
                    nextRoundBtn.style.display = 'inline-block'
                    nextRoundBtn.textContent = 'Skip Round'

                    // Clear selections to allow retry
                    gameState.selectedCards = []
                    document.querySelectorAll('.person-game-card.selected').forEach(card => {
                        card.classList.remove('selected')
                    })
                }
                break

            case 'century-match':
                let allCorrect = true
                let correctCount = 0

                gameState.selectedCards.forEach(match => {
                    if (gameState.correctAnswer[match.person] === match.century) {
                        correctCount++
                    } else {
                        allCorrect = false
                    }
                })

                isCorrect = allCorrect && gameState.selectedCards.length === Object.keys(gameState.correctAnswer).length
                points = correctCount * 5

                if (isCorrect) {
                    showFeedback('Perfect! All matches correct!', true)
                } else {
                    showFeedback(`You got ${correctCount} out of ${Object.keys(gameState.correctAnswer).length} correct`, false)
                }

                // Disable cards and show next button
                submitAnswerBtn.style.display = 'none'
                nextRoundBtn.style.display = 'block'

                // Disable all cards
                document.querySelectorAll('.person-game-card').forEach(card => {
                    card.style.pointerEvents = 'none'
                })
                break
        }

        updateScore(points)
    }

    // NEXT ROUND
    nextRoundBtn.addEventListener('click', () => {
        if (gameState.round >= gameState.totalRounds) {
            endGame()
        } else {
            updateRound()
            submitAnswerBtn.style.display = 'block'
            submitAnswerBtn.textContent = 'Submit Answer'  // Reset button text
            nextRoundBtn.style.display = 'none'
            nextRoundBtn.textContent = 'Next Round'  // Reset button text

            // Load next round based on mode
            switch(gameState.currentMode) {
                case 'trait-match':
                    loadTraitMatchRound()
                    break
                case 'century-match':
                    loadCenturyMatchRound()
                    break
                case 'time-jumpers':
                    loadTimeJumpersRound()
                    break
            }
        }
    })

    // END GAME
    function endGame() {
        gamePlayArea.style.display = 'none'

        let maxScore = gameState.totalRounds * 20

        // Check for perfect score
        if (gameState.score === maxScore) {
            showPerfectScoreModal()
        } else {
            gameOverScreen.style.display = 'block'

            document.querySelector('#final-score').textContent = gameState.score

            let percentage = (gameState.score / maxScore) * 100

            let performanceMessage = ''
            if (percentage >= 80) {
                performanceMessage = 'Outstanding! You are a true historian!'
            } else if (percentage >= 60) {
                performanceMessage = 'Great work! You know your history well!'
            } else if (percentage >= 40) {
                performanceMessage = 'Good effort! Keep exploring the centuries!'
            } else {
                performanceMessage = 'Nice try! Visit the museum rooms to learn more!'
            }

            document.querySelector('#performance-message').textContent = performanceMessage
        }
    }

    // PERFECT SCORE MODAL
    function showPerfectScoreModal() {
        // Create modal overlay
        let modalOverlay = document.createElement('div')
        modalOverlay.id = 'perfect-score-modal'
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        `

        let modalContent = document.createElement('div')
        modalContent.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 30px;
            padding: 3rem;
            max-width: 600px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: bounceIn 0.6s ease;
            position: relative;
        `

        modalContent.innerHTML = `
            <div style="font-size: 5rem; margin-bottom: 1rem; animation: bounce 1s infinite;">🏆</div>
            <h1 style="font-size: 3rem; font-weight: bold; color: #FFD700; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); margin-bottom: 1rem;">
                HURRAY! YOU WON!
            </h1>
            <p style="font-size: 1.5rem; color: white; margin-bottom: 2rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                Perfect Score: ${gameState.score} / ${gameState.totalRounds * 20}! 🎉
            </p>
            <p style="font-size: 1.2rem; color: rgba(255,255,255,0.9); margin-bottom: 3rem;">
                You are a true master of history!
            </p>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <button id="play-another-mode" style="
                    padding: 1rem 2rem;
                    background: linear-gradient(to right, #10b981, #059669);
                    color: white;
                    border: none;
                    border-radius: 50px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
                    transition: all 0.3s ease;
                ">
                    🎮 Play Another Game Mode
                </button>
                <button id="select-another-century" style="
                    padding: 1rem 2rem;
                    background: linear-gradient(to right, #3b82f6, #2563eb);
                    color: white;
                    border: none;
                    border-radius: 50px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
                    transition: all 0.3s ease;
                ">
                    🕰️ Select Another Century
                </button>
            </div>
        `

        // Add CSS animations
        let styleSheet = document.createElement('style')
        styleSheet.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes bounceIn {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
            #perfect-score-modal button:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            }
        `
        document.head.appendChild(styleSheet)

        modalOverlay.appendChild(modalContent)
        document.body.appendChild(modalOverlay)

        // Add event listeners
        document.querySelector('#play-another-mode').addEventListener('click', () => {
            modalOverlay.remove()
            gameOverScreen.style.display = 'none'
            gameModeSelection.style.display = 'block'
            // Reset game state
            gameState.score = 0
            gameState.round = 1
            scoreDisplay.textContent = '0'
            roundDisplay.textContent = '1'
        })

        document.querySelector('#select-another-century').addEventListener('click', () => {
            window.location.href = '../index.html'
        })
    }

    // BACK TO MODES
    backToModesBtn.addEventListener('click', () => {
        gamePlayArea.style.display = 'none'
        gameModeSelection.style.display = 'block'
        submitAnswerBtn.style.display = 'block'
        nextRoundBtn.style.display = 'none'
    })

    // PLAY AGAIN
    playAgainBtn.addEventListener('click', () => {
        gameOverScreen.style.display = 'none'
        gameModeSelection.style.display = 'block'
    })

})
