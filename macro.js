// Macro Decision Tree Data
const macroSteps = [
    {
        id: 'antenna',
        title: 'Antenna',
        question: 'Select your antenna type:',
        options: [
            { value: 'twoStackTriSector', label: 'Two Stack Tri-Sector', image: 'twoStackTriSector_display.png' },
            { value: 'singleStackTriSectorWithAAUs', label: 'Single Stack Tri-Sector with AAUs', image: 'singleStackTriSectorWithAAUs_display.png' },
        ],
    },
    {
        id: 'foundation',
        title: 'Foundation',
        question: 'Select your foundation type:',
        options: [
            { value: 'anchoredConcrete', label: 'Anchored Concrete', image: 'anchoredConcrete_display.png' },
            { value: 'embeddedPin', label: 'Embedded Pin', image: 'embeddedPin_display.png' },
        ],
    },
    {
        id: 'cabinet',
        title: 'Cabinet',
        question: 'Select your cabinet configuration:',
        options: [
            { value: 'telecomEnclosureSingle', label: 'Telecom Enclosure (Single)', image: 'telecomEnclosureSingle_display.png' },
            { value: 'telecomEnclosureWithJoiners', label: 'Telecom Enclosure and 2x Joiners', image: 'telecomEnclosureWithJoiners_display.png' },
        ],
    },
];

let selectedOptions = {};

document.addEventListener('DOMContentLoaded', () => {
    renderConfigurator();
    updateDisplayImage(); // Initialize the image display
});

function renderConfigurator() {
    renderProgressIndicator();

    const selectionPanel = document.getElementById('selection-panel');
    // Remove previous steps but keep the progress indicator
    const steps = selectionPanel.querySelectorAll('.config-step');
    steps.forEach(step => step.remove());

    // Remove existing action buttons
    const existingActionButtons = selectionPanel.querySelector('.action-buttons');
    if (existingActionButtons) {
        existingActionButtons.remove();
    }

    macroSteps.forEach((stepData, index) => {
        if (isStepActive(index)) {
            const section = createStepSection(stepData, index);
            selectionPanel.appendChild(section);
        }
    });

    // Check if all steps are completed
    if (isConfiguratorComplete()) {
        renderActionButtons(selectionPanel);
    }
}

function createStepSection(stepData, index) {
    const section = document.createElement('div');
    section.classList.add('config-step');
    section.id = stepData.id;

    const title = document.createElement('h2');
    title.textContent = stepData.title;
    section.appendChild(title);

    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('options');

    const options = stepData.options;

    options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option-button');
        button.dataset.stepId = stepData.id;
        button.dataset.value = option.value;

        if (!isStepActive(index)) {
            button.classList.add('disabled');
            button.disabled = true;
        }

        if (selectedOptions[stepData.id] === option.value) {
            button.classList.add('selected');
        }

        button.textContent = option.label;

        // Event Listeners
        button.addEventListener('click', () => {
            if (!button.classList.contains('disabled')) {
                selectOption(stepData.id, option);
                renderConfigurator();
                updateDisplayImage();
            }
        });

        button.addEventListener('mouseenter', () => {
            if (!button.classList.contains('disabled')) {
                // Show preview of new layer
                previewImageLayer(option.image);
            }
        });

        button.addEventListener('mouseleave', () => {
            // Remove preview and show current selection
            updateDisplayImage();
        });

        optionsDiv.appendChild(button);
    });

    section.appendChild(optionsDiv);
    return section;
}

function isStepActive(index) {
    // All previous steps must have a selected option
    for (let i = 0; i < index; i++) {
        const prevStepId = macroSteps[i].id;
        if (!selectedOptions[prevStepId]) {
            return false;
        }
    }
    return true;
}

function selectOption(stepId, option) {
    selectedOptions[stepId] = option.value;

    // Reset dependent selections
    const stepIndex = macroSteps.findIndex(step => step.id === stepId);
    for (let i = stepIndex + 1; i < macroSteps.length; i++) {
        const nextStep = macroSteps[i];
        delete selectedOptions[nextStep.id];
    }
}

function updateDisplayImage() {
    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = ''; // Clear existing images

    // Get the list of images based on selected options
    const imagesToDisplay = getSelectedImages();

    imagesToDisplay.forEach(imageSrc => {
        const img = document.createElement('img');
        img.src = `images/${imageSrc}`;
        img.classList.add('layered-image');
        imageContainer.appendChild(img);
    });
}

function getSelectedImages() {
    const images = [];

    // Add images based on selections in order
    macroSteps.forEach(step => {
        const stepId = step.id;
        const selectedValue = selectedOptions[stepId];
        if (selectedValue) {
            const optionData = step.options.find(opt => opt.value === selectedValue);
            if (optionData && optionData.image) {
                images.push(optionData.image);
            }
        }
    });

    // If no images, return default image
    if (images.length === 0) {
        images.push('default.png');
    }

    return images;
}

function previewImageLayer(previewImageSrc) {
    const imageContainer = document.getElementById('image-container');
    const imagesToDisplay = getSelectedImages();

    // Add the preview image to the end
    imagesToDisplay.push(previewImageSrc);

    imageContainer.innerHTML = ''; // Clear existing images

    imagesToDisplay.forEach(imageSrc => {
        const img = document.createElement('img');
        img.src = `images/${imageSrc}`;
        img.classList.add('layered-image');
        imageContainer.appendChild(img);
    });
}

function renderProgressIndicator() {
    const progressIndicator = document.getElementById('progress-indicator');
    progressIndicator.innerHTML = '';

    macroSteps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.classList.add('progress-step');
        stepDiv.dataset.step = index + 1;

        if (isStepActive(index) && selectedOptions[step.id]) {
            stepDiv.classList.add('active');
        }

        progressIndicator.appendChild(stepDiv);
    });
}

function isConfiguratorComplete() {
    return macroSteps.every(step => selectedOptions[step.id]);
}

function renderActionButtons(container) {
    // Remove existing action buttons if any
    const existingActionButtons = container.querySelector('.action-buttons');
    if (existingActionButtons) {
        existingActionButtons.remove();
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action-buttons');

    const fullscreenButton = document.createElement('button');
    fullscreenButton.textContent = 'View Fullscreen';
    fullscreenButton.classList.add('action-button');
    fullscreenButton.addEventListener('click', openFullscreen);

    const contactButton = document.createElement('button');
    contactButton.textContent = 'Contact Us';
    contactButton.classList.add('action-button');
    contactButton.addEventListener('click', () => {
        window.location.href = 'contact.html';
    });

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.classList.add('action-button');
    resetButton.addEventListener('click', resetConfigurator);

    buttonContainer.appendChild(fullscreenButton);
    buttonContainer.appendChild(contactButton);
    buttonContainer.appendChild(resetButton);
    container.appendChild(buttonContainer);
}

function openFullscreen() {
    const imageDisplay = document.getElementById('image-display');
    if (imageDisplay.requestFullscreen) {
        imageDisplay.requestFullscreen();
    } else if (imageDisplay.webkitRequestFullscreen) { /* Safari */
        imageDisplay.webkitRequestFullscreen();
    } else if (imageDisplay.msRequestFullscreen) { /* IE11 */
        imageDisplay.msRequestFullscreen();
    }
}

function resetConfigurator() {
    selectedOptions = {};
    renderConfigurator();
    updateDisplayImage();
}
