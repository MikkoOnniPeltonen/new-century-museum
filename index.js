
import { historicalPersons, Room } from "./roomClass.js"
import { a11y } from "./utils/accessibility.js"
import "./utils/lazyLoad.js"  // Auto-initializes lazy loading

document.addEventListener('DOMContentLoaded', function () {

    // CINEMATIC INTRO ANIMATION
    let introSection = document.querySelector('#intro-animation')
    let mainSection = document.querySelector('#main-section')
    let header = document.querySelector('#main-header')
    let footer = document.querySelector('#footer')

    let currentCenturyIndex = 0
    let centuries = ['1900s', '1800s', '1700s', '1600s']
    let centuryBackgrounds = {
        '1600s': 'linear-gradient(135deg, rgba(107, 15, 26, 0.75) 0%, rgba(255, 215, 0, 0.65) 50%, rgba(10, 31, 68, 0.75) 100%)', // Dramatic deep burgundy, bright gold, midnight blue
        '1700s': 'linear-gradient(135deg, rgba(255, 248, 231, 0.75) 0%, rgba(230, 181, 102, 0.65) 50%, rgba(30, 58, 95, 0.75) 100%)', // Academic pale cream, golden amber, deep navy
        '1800s': 'linear-gradient(135deg, rgba(92, 46, 10, 0.75) 0%, rgba(210, 105, 30, 0.65) 50%, rgba(26, 58, 26, 0.75) 100%)', // Literary dark chocolate, burnt orange, forest green
        '1900s': 'linear-gradient(135deg, rgba(160, 139, 111, 0.75) 0%, rgba(184, 115, 51, 0.65) 50%, rgba(74, 74, 74, 0.75) 100%)'  // Industrial warm sepia, copper bronze, charcoal gray
    }

    // Flag to block mouse interactions during intro
    let introAnimationPlaying = true

    // Allow skipping intro with Enter key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && introAnimationPlaying) {
            skipIntro()
        }
    })

    function skipIntro() {
        introAnimationPlaying = false
        transitionToMainSection()
    }

    // Start intro animation
    setTimeout(() => {
        startIntroAnimation()
    }, 500)

    function startIntroAnimation() {
        let line1 = document.querySelector('#intro-line-1')
        let line2 = document.querySelector('#intro-line-2')

        // Animate line 1: "Welcome to the century museum"
        animateLine1()

        setTimeout(() => {
            // Animate line 2: "Explore with us [centuries]"
            animateLine2()
        }, 4000)
    }

    function animateLine1() {
        let words = document.querySelectorAll('#intro-line-1 .word')

        // Welcome moves left, dragging words
        words.forEach((word, index) => {
            setTimeout(() => {
                word.classList.add('slide-left')

                // Reveal "the" with shadow flash
                if (word.id === 'word-the') {
                    setTimeout(() => {
                        word.classList.add('shadow-reveal')
                    }, 300)
                }
            }, index * 200)
        })

        // Make first line fade out after animation
        setTimeout(() => {
            document.querySelector('#intro-line-1').classList.add('fade-out')
        }, 3500)
    }

    function animateLine2() {
        let exploreLetters = document.querySelectorAll('.explore-letter')
        let glowWords = document.querySelectorAll('.glow-word')
        let centuryDisplay = document.querySelector('#century-display')
        let centuriesWord = document.querySelector('[data-word="centuries"]')

        // "Explore" letters explode from E position with trail effect, then return
        setTimeout(() => {
            exploreLetters.forEach((letter, index) => {
                // Get letter position relative to its parent
                const letterRect = letter.getBoundingClientRect()
                const parentRect = letter.parentElement.getBoundingClientRect()

                // Create trail elements for each letter
                const trailCount = 5
                const trails = []

                for (let i = 0; i < trailCount; i++) {
                    const trail = document.createElement('span')
                    trail.className = 'letter-trail'
                    trail.textContent = letter.textContent
                    trail.style.position = 'absolute'
                    trail.style.left = (letterRect.left - parentRect.left) + 'px'
                    trail.style.top = (letterRect.top - parentRect.top) + 'px'
                    trail.style.fontSize = '5rem'
                    trail.style.fontWeight = 'bold'
                    letter.parentElement.appendChild(trail)
                    trails.push(trail)
                }

                // Initial explosion with trails
                setTimeout(() => {
                    letter.style.opacity = '1'
                    letter.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                    const targetX = index * 80 + 50
                    const targetY = Math.sin(index) * 60
                    letter.style.transform = `translate(${targetX}px, ${targetY}px) rotate(${index * 45}deg) scale(1.2)`
                    letter.style.textShadow = '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)'

                    // Animate trails following the letter
                    trails.forEach((trail, trailIndex) => {
                        setTimeout(() => {
                            trail.style.opacity = '0.4'
                            trail.style.transform = `translate(${targetX * 0.7}px, ${targetY * 0.7}px) rotate(${index * 35}deg) scale(${1 - trailIndex * 0.15})`
                            setTimeout(() => {
                                trail.style.opacity = '0'
                            }, 200)
                        }, trailIndex * 40)
                    })
                }, index * 80)

                // Return to form word with trailing effect
                setTimeout(() => {
                    letter.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    letter.style.transform = 'translate(0, 0) rotate(0deg) scale(1)'
                    letter.style.textShadow = '2px 2px 10px rgba(0,0,0,0.8)'

                    // Trails follow back
                    trails.forEach((trail, trailIndex) => {
                        setTimeout(() => {
                            trail.style.opacity = '0.3'
                            trail.style.transform = 'translate(0, 0) rotate(0deg) scale(0.9)'
                            setTimeout(() => {
                                trail.style.opacity = '0'
                                setTimeout(() => trail.remove(), 300)
                            }, 150)
                        }, trailIndex * 40)
                    })
                }, 1000 + (index * 80))
            })
        }, 100)

        // "with" and "us" glow and flash
        setTimeout(() => {
            glowWords.forEach((word, index) => {
                setTimeout(() => {
                    word.classList.add('glow-flash')
                    setTimeout(() => {
                        word.classList.add('fall-fade')
                    }, 1500)
                }, index * 300)
            })
        }, 2000)

        // Century cycling animation with spark effects
        setTimeout(() => {
            cycleCenturies(centuryDisplay)
        }, 3500)

        // "centuries" word slides in from right after 1600s drops
        setTimeout(() => {
            // Ensure century display is completely gone
            centuryDisplay.style.visibility = 'hidden'
            centuryDisplay.style.position = 'absolute'
            centuryDisplay.style.left = '-9999px'

            // Now bring in centuries word
            centuriesWord.style.transition = 'all 1s ease-out'
            centuriesWord.style.opacity = '1'
            centuriesWord.style.transform = 'translateX(0)'
        }, 8500)

        // Transition to main section
        setTimeout(() => {
            transitionToMainSection()
        }, 10000)
    }

    function cycleCenturies(centuryDisplay) {
        const centuryList = ['1900s', '1800s', '1700s', '1600s']
        let currentIndex = 0

        function showNextCentury() {
            if (currentIndex >= centuryList.length) return

            const century = centuryList[currentIndex]

            // Spark flash in effect
            centuryDisplay.textContent = century
            centuryDisplay.style.display = 'inline-block'
            centuryDisplay.style.opacity = '0'
            centuryDisplay.style.transform = 'scale(0.5)'
            centuryDisplay.style.filter = 'brightness(3) blur(3px)'

            setTimeout(() => {
                centuryDisplay.style.transition = 'all 0.3s ease-out'
                centuryDisplay.style.opacity = '1'
                centuryDisplay.style.transform = 'scale(1)'
                centuryDisplay.style.filter = 'brightness(1) blur(0px)'
                centuryDisplay.style.textShadow = '0 0 30px rgba(255,215,0,1), 0 0 60px rgba(255,215,0,0.8), 0 0 90px rgba(255,215,0,0.6)'
            }, 50)

            // Fall and fade out before next - for 1600s make it permanent
            const isLastCentury = (currentIndex === centuryList.length - 1)

            setTimeout(() => {
                if (isLastCentury) {
                    // For 1600s: fall and fade away permanently
                    centuryDisplay.style.transition = 'all 0.8s ease-in'
                    centuryDisplay.style.opacity = '0'
                    centuryDisplay.style.transform = 'translateY(150px) rotate(15deg)'
                    centuryDisplay.style.textShadow = 'none'

                    // Immediately remove it from the layout
                    setTimeout(() => {
                        centuryDisplay.style.position = 'absolute'
                        centuryDisplay.style.left = '-9999px'
                        centuryDisplay.style.display = 'none'
                    }, 800)
                } else {
                    // For other centuries: temporary fade for transition
                    centuryDisplay.style.transition = 'all 0.6s ease-in'
                    centuryDisplay.style.opacity = '0'
                    centuryDisplay.style.transform = 'translateY(100px) rotate(10deg)'
                    centuryDisplay.style.textShadow = 'none'
                }
            }, 800)

            currentIndex++
            if (currentIndex < centuryList.length) {
                setTimeout(showNextCentury, 1200)
            }
        }

        showNextCentury()
    }

    function transitionToMainSection() {
        introSection.style.opacity = '0'
        setTimeout(() => {
            introSection.style.display = 'none'
            mainSection.style.display = 'block'
            setTimeout(() => {
                mainSection.style.opacity = '1'
                // Enable navbar/footer interactions after intro completes
                introAnimationPlaying = false
            }, 50)
        }, 1000)
    }

    // NAVBAR AND FOOTER - Show on mouse movement (only after intro)
    let mouseMoveTimeout
    document.addEventListener('mousemove', () => {
        // Ignore mouse movement during intro animation
        if (introAnimationPlaying) return

        header.classList.remove('hidden-nav')
        footer.classList.remove('hidden-footer')

        clearTimeout(mouseMoveTimeout)
        mouseMoveTimeout = setTimeout(() => {
            if (!header.matches(':hover') && !footer.matches(':hover')) {
                header.classList.add('hidden-nav')
                footer.classList.add('hidden-footer')
            }
        }, 3000)
    })

    // CUSTOM SCROLLING BEHAVIOR - Centuries replace each other, alternating text
    let currentCenturyDisplay = document.querySelector('#current-century')
    let exploreText = document.querySelector('#explore-text')
    let exploreWith = document.querySelector('#explore-with')
    let scrollTimeout
    let isScrolling = false
    let isExploreMode = true  // Track which text we're showing

    window.addEventListener('wheel', (e) => {
        if (introSection.style.display !== 'none') return

        clearTimeout(scrollTimeout)

        if (!isScrolling) {
            if (e.deltaY > 0) {
                // Scroll down - next century (older)
                currentCenturyIndex = Math.min(currentCenturyIndex + 1, centuries.length - 1)
                // Alternate text on scroll down
                isExploreMode = !isExploreMode
            } else {
                // Scroll up - previous century (newer)
                currentCenturyIndex = Math.max(currentCenturyIndex - 1, 0)
                // Alternate text on scroll up
                isExploreMode = !isExploreMode
            }

            updateCentury()
            isScrolling = true
        }

        scrollTimeout = setTimeout(() => {
            isScrolling = false
        }, 800)
    })

    function updateCentury() {
        let newCentury = centuries[currentCenturyIndex]

        // Update text based on mode
        if (isExploreMode) {
            exploreText.textContent = 'Explore'
            exploreWith.textContent = 'with'
        } else {
            exploreText.textContent = 'Explain'
            exploreWith.textContent = 'to'
        }

        // Update century with swirling effect
        currentCenturyDisplay.textContent = newCentury
        currentCenturyDisplay.dataset.century = newCentury
        currentCenturyDisplay.classList.add('century-change')

        // Update background with image
        document.body.style.background = centuryBackgrounds[newCentury]
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center'
        document.body.style.backgroundAttachment = 'fixed'

        setTimeout(() => {
            currentCenturyDisplay.classList.remove('century-change')
        }, 600)
    }

    // FOOTER SPECIAL EFFECT - Contact Us
    let footerScrollCount = 0
    let footerVibrationLevel = 0

    window.addEventListener('wheel', (e) => {
        if (footer.classList.contains('hidden-footer')) return

        let footerRect = footer.getBoundingClientRect()
        let mouseY = e.clientY

        // Check if near footer
        if (mouseY > window.innerHeight - 200) {
            footerScrollCount++
            footerVibrationLevel = Math.min(footerScrollCount * 2, 20)

            footer.style.transform = `translateY(0) translateX(${Math.sin(footerScrollCount) * footerVibrationLevel}px)`

            // Transform text after enough scrolling
            if (footerScrollCount > 10) {
                transformFooterText()
            }
        }
    })

    function transformFooterText() {
        let exploreLine = document.querySelector('#explore-line')
        let footerTitle = document.querySelector('#footer-title')

        if (!exploreLine.classList.contains('transformed')) {
            // Transform "Explore with us 1900s" to "Explain to us the 2000s"
            document.querySelector('#explore-text').textContent = 'Explain'
            document.querySelector('#explore-with').textContent = 'to'
            document.querySelector('#current-century').textContent = 'the 2000s'
            exploreLine.classList.add('transformed')

            // Footer jumps into view
            footer.classList.add('jump-in')
            footerTitle.textContent = 'Please ?'
        }
    }

    // ROOM BUTTONS FUNCTIONALITY
    let museumRoomsContainer = document.querySelector('#museum-floor-container')

    museumRoomsContainer.addEventListener('click', (event) => {
        let clickedElement = event.target.closest('button')
        if (!clickedElement) return

        let roomDiv = clickedElement.closest('.museum-room')
        let century = roomDiv.dataset.century
        let room = new Room(historicalPersons)

        if (clickedElement.classList.contains('view-button')) {
            room.century = century
            room.loadFromLocalStorage()
            window.location.href = `./room-view/roomViewPage.html?century=${century}`
        }
        else if (clickedElement.classList.contains('persons-button')) {
            window.location.href = `./historical-persons/historicalPersonsPage.html?century=${century}`
        }

        // Set room color
        roomDiv.style.background = room.colors[century]
    })

    // ROOM HOVER AND BUTTON EFFECTS
    let museumRooms = document.querySelectorAll('.museum-room')

    museumRooms.forEach(room => {
        let buttonContainer = room.querySelector('.button-container')
        let buttons = room.querySelectorAll('.museum-button')

        room.addEventListener('mouseenter', () => {
            buttonContainer.classList.add('active')
        })

        room.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!buttonContainer.matches(':hover')) {
                    buttonContainer.classList.remove('active')
                }
            }, 500)
        })

        // Button spotlight effect
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                let rect = button.getBoundingClientRect()
                let x = e.clientX - rect.left
                let y = e.clientY - rect.top

                button.style.setProperty('--mouse-x', x + 'px')
                button.style.setProperty('--mouse-y', y + 'px')
            })
        })
    })

    // Set initial room colors with century-specific themes
    museumRooms.forEach(room => {
        let century = room.dataset.century
        // Use thematic century backgrounds instead of Room class colors
        room.style.background = centuryBackgrounds[century]
        room.style.opacity = '0.9'
        room.style.transition = 'all 0.3s ease'
        room.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 60px rgba(0, 0, 0, 0.2)'

        room.addEventListener('mouseenter', () => {
            room.style.opacity = '1'
            room.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 80px rgba(0, 0, 0, 0.3)'
        })

        room.addEventListener('mouseleave', () => {
            room.style.opacity = '0.9'
            room.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 60px rgba(0, 0, 0, 0.2)'
        })
    })

})
