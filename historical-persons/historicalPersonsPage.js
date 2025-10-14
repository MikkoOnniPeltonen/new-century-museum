
import { historicalPersons, Room } from "../roomClass.js"
import { Modal } from "../components/modal.js"
import { a11y } from "../utils/accessibility.js"
import "../utils/lazyLoad.js"  // Auto-initializes lazy loading

document.addEventListener('DOMContentLoaded', function () {

    let urlParams = new URLSearchParams(window.location.search)
    let selectedCentury = urlParams.get('century')

    let room = new Room(historicalPersons)
    room.century = selectedCentury
    room.loadFromLocalStorage()

    let navbarElement = document.querySelector('.navbar')
    navbarElement.style.background = room.color

    // Set page background to match century theme with image
    document.body.style.background = room.color
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundAttachment = 'fixed'

    let personsOfHistory = room.showCenturyPersons(selectedCentury)

    let displayingCentury = document.querySelector('#changing-century-text')
    let changingCenturyText = ''

    // Convert century string (e.g., "1900s") to ordinal (e.g., "20th")
    let centuryNumber = parseInt(room.century);
    if (!isNaN(centuryNumber)) {
        let ordinal = Math.floor(centuryNumber / 100) + 1;
        changingCenturyText = ordinal + 'th';
    }

    displayingCentury.innerHTML = `<a href="../room-view/roomViewPage.html?century=${selectedCentury}">${changingCenturyText}</a>`

    // OLD notification system removed - now using professional toast notifications

    let addBtn = document.querySelector('#add-person-btn')
    let removeBtn = document.querySelector('#remove-person-btn')
    let clearBtn = document.querySelector('#clear-persons-btn')


    let carouselIndicators = document.querySelector('.carousel-indicators')
    let carouselInner = document.querySelector('.carousel-inner')
    let myCarousel = document.querySelector('#myCarousel')

    personsOfHistory.forEach((person, index) => {

        // Create carousel indicator button
        let indicatorButton = document.createElement('button')
        indicatorButton.setAttribute('type', 'button')
        indicatorButton.setAttribute('data-bs-target', '#myCarousel')
        indicatorButton.setAttribute('data-bs-slide-to', index.toString())
        if (index === 0) {
            indicatorButton.classList.add('active')
            indicatorButton.setAttribute('aria-current', 'true')
        }
        indicatorButton.setAttribute('aria-label', `Slide ${index + 1}`)
        carouselIndicators.appendChild(indicatorButton)

        // Create carousel item
        let carouselItem = document.createElement('div')
        carouselItem.classList.add('carousel-item')
        if (index === 0) {
            carouselItem.classList.add('active')
        }

        // Create carousel image with lazy loading
        let imageElement = document.createElement('img')
        imageElement.setAttribute('data-src', person.image)  // Lazy load
        imageElement.classList.add('d-block', 'w-100', 'img-fluid', 'lazy-image')
        imageElement.alt = person.name
        carouselItem.appendChild(imageElement)

        // Create carousel caption
        let carouselCaption = document.createElement('div')
        carouselCaption.classList.add('carousel-caption')
        
        let nameElement = document.createElement('h5')
        nameElement.textContent = person.name
        carouselCaption.appendChild(nameElement)
        
        let lifespanElement = document.createElement('p')
        lifespanElement.textContent = person.lifespan
        carouselCaption.appendChild(lifespanElement)

        let personSelectedStatus = document.createElement('span')
        personSelectedStatus.className = 'person-chosen'
        personSelectedStatus.textContent = 'chosen'

        carouselItem.appendChild(personSelectedStatus)
        carouselItem.appendChild(carouselCaption)
        
        carouselInner.appendChild(carouselItem)

    })


    myCarousel.addEventListener('slid.bs.carousel', function (event) {
        let currentSlide = event.relatedTarget
        let currentPersonName = currentSlide.querySelector('.carousel-caption h5').textContent

        updateUI(currentPersonName)
        updatePeekItems()
    })

    // Function to show prev/next items for peek effect
    function updatePeekItems() {
        const allItems = Array.from(document.querySelectorAll('.carousel-item'))
        const activeIndex = allItems.findIndex(item => item.classList.contains('active'))

        // Clear all peek classes
        allItems.forEach(item => {
            item.classList.remove('carousel-item-prev', 'carousel-item-next')
        })

        // Add prev class to previous item
        if (activeIndex > 0) {
            allItems[activeIndex - 1].classList.add('carousel-item-prev')
        } else {
            // Wrap around to last item
            allItems[allItems.length - 1].classList.add('carousel-item-prev')
        }

        // Add next class to next item
        if (activeIndex < allItems.length - 1) {
            allItems[activeIndex + 1].classList.add('carousel-item-next')
        } else {
            // Wrap around to first item
            allItems[0].classList.add('carousel-item-next')
        }
    }

    // Initialize peek items on load
    updatePeekItems()

    // Manually load all carousel images immediately (don't wait for lazy loader)
    // Lazy loader doesn't work well with carousel absolute positioning
    const carouselImages = document.querySelectorAll('#myCarousel img[data-src]')
    carouselImages.forEach(img => {
        const src = img.getAttribute('data-src')
        img.src = src
        img.removeAttribute('data-src')
    })

    // Explicitly initialize Bootstrap carousel to ensure manual control
    const bsCarousel = new bootstrap.Carousel(myCarousel, {
        interval: false,  // Disable auto-play
        ride: false,      // Don't auto-start
        wrap: true,       // Allow wrapping
        touch: true       // Enable touch support
    })

    // Simple notification function
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification-container')
        const notificationMessage = document.getElementById('notification-message')

        notificationMessage.textContent = message
        notification.classList.remove('hidden')

        // Change background based on type
        if (type === 'success') {
            notification.style.background = 'linear-gradient(to right, #10b981, #059669)'
        } else if (type === 'info') {
            notification.style.background = 'linear-gradient(to right, #3b82f6, #2563eb)'
        }

        setTimeout(() => {
            notification.classList.add('hidden')
        }, 3000)
    }

    // EVENT LISTENERS TO BUTTONS
    addBtn.addEventListener('click', () => {
        let activePersonName = document.querySelector('.carousel-item.active .carousel-caption h5').textContent
        let activePerson = personsOfHistory.find(person => person.name === activePersonName)
        room.selectPerson(activePerson)

        showNotification(`${activePersonName} added to your room!`, 'success')
        a11y.announce(`${activePersonName} has been added to the room`)

        let selectedPersonName = activePersonName
        updateUI(selectedPersonName)
    })

    removeBtn.addEventListener('click', () => {
        let activePersonName = document.querySelector('.carousel-item.active .carousel-caption h5').textContent
        let activePerson = personsOfHistory.find(person => person.name === activePersonName)
        room.removeSelectedPerson(activePerson)

        showNotification(`${activePersonName} removed from your room`, 'info')
        a11y.announce(`${activePersonName} has been removed from the room`)

        let selectedPersonName = activePersonName
        updateUI(selectedPersonName)
    })

    clearBtn.addEventListener('click', async () => {
        console.log('Clear All button clicked')

        const confirmed = await Modal.confirm(
            'You are about to remove all selected persons from this room. This action cannot be undone.',
            'Clear All Persons',
            {
                icon: 'warning',
                confirmText: 'Yes, Clear All',
                cancelText: 'Cancel'
            }
        )

        console.log('Modal confirmed:', confirmed)

        if (confirmed) {
            console.log('Clearing selected persons...')
            room.clearSelectedPersons()

            // Update all carousel items to hide "chosen" badges
            document.querySelectorAll('.carousel-item .person-chosen').forEach(badge => {
                badge.style.display = 'none'
            })

            // Update button states
            updateUI()

            showNotification('All persons have been removed from the room', 'success')
            a11y.announce('All persons removed from room')
            console.log('Clear completed')
        } else {
            console.log('User cancelled clear action')
        }
    })
    

    // UPDATE UI TO KNOW WHICH PERSON IS ALREADY SELECTED AND WHO IS NOT
    // ADD, REMOVE AND CLEAR BUTTONS ARE DISABLED ACCORDINGLY

    function updateUI(personName = null) {

        let activeSlide = document.querySelector('.carousel-item.active')
        if (!activeSlide) {
            return
        }

        let activePersonName = personName || activeSlide.querySelector('.carousel-caption h5')?.textContent || ''
        // Check if person is selected by comparing names
        let isPersonSelected = room.getSelectedPersons().some(p => p.name === activePersonName)

        let selectedPersonStatus = activeSlide.querySelector('.person-chosen')
        if (selectedPersonStatus) {
            selectedPersonStatus.style.display = isPersonSelected ? 'block' : 'none'
        }

        if (isPersonSelected || room.getSelectedPersons().length === personsOfHistory.length) {
            addBtn.disabled = true
        }
        else {
            addBtn.disabled = false
        }

        if (!isPersonSelected) {
            removeBtn.disabled = true
        }
        else {
            removeBtn.disabled = false
        }

        if (room.getSelectedPersons().length === 0) {
            clearBtn.disabled = true
        }
        else {
            clearBtn.disabled = false
        }


        activeSlide.classList.toggle('selected-person', isPersonSelected)
    }

    updateUI()

})