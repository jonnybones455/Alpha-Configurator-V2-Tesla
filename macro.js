// Macro Decision Tree Data
const macroSteps = [
    {
        id: 'height',
        title: 'Height',
        question: 'Select the pole height:',
        options: [
            { value: '10mPole', label: '10 Meter Pole', image: '10mPole_display.png' },
            { value: '20mPole', label: '20 Meter Pole', image: '20mPole_display.png' },
        ],
    },
    {
        id: 'stack',
        title: 'Stack',
        question: 'Select the stack type:',
        options: [
            { value: 'singleStack', label: 'Single Stack', image: 'singleStack_display.png' },
            { value: 'twoStack', label: 'Two Stack', image: 'twoStack_display.png' },
        ],
    },
    {
        id: 'aaus',
        title: 'AAUs',
        question: 'Are there AAUs?',
        options: [
            { value: 'yes', label: 'Yes', image: 'aausYes_display.png' },
            { value: 'no', label: 'No', image: 'aausNo_display.png' },
        ],
    },
    {
        id: 'cabinet',
        title: 'Cabinet',
        question: 'Select your cabinet configuration:',
        options: [
            { value: 'singleTelecomEnclosure', label: 'Single Telecom Enclosure', image: 'singleTelecomEnclosure_display.png' },
            { value: 'telecomEnclosureWith2Joiners', label: 'Telecom Enclosure with 2 Joiners', image: 'telecomEnclosureWith2Joiners_display.png' },
            { value: 'telecomEnclosureWith3Joiners', label: 'Telecom Enclosure with 3 Joiners', image: 'telecomEnclosureWith3Joiners_display.png' },
        ],
    },
];

let selectedOptions = {}; // Stores the user's selections

// This function runs when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    renderConfigurator(); // Builds the configurator UI
    updateDisplayImage(); // Initializes the image display
});

// Renders the configurator UI based on the current state
function renderConfigurator() {
    renderProgressIndicator(); // Updates the progress bar

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

// Creates a section for each step with options
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

// Checks if a step is active based on previous selections
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

// Stores the user's selection and resets dependent selections
function selectOption(stepId, option) {
    selectedOptions[stepId] = option.value;

    // Reset dependent selections
    const stepIndex = macroSteps.findIndex(step => step.id === stepId);
    for (let i = stepIndex + 1; i < macroSteps.length; i++) {
        const nextStep = macroSteps[i];
        delete selectedOptions[nextStep.id];
    }
}

// Updates the layered image display based on selections
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

// Retrieves the list of images to display based on selections
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

// Previews the image layer when hovering over an option
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

// Renders the progress indicator at the top
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

// Checks if the configurator is complete
function isConfiguratorComplete() {
    return macroSteps.every(step => selectedOptions[step.id]);
}

// Renders the action buttons when the configurator is complete
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

// Opens the image display in fullscreen mode
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

// Resets the configurator to start over
function resetConfigurator() {
    selectedOptions = {};
    renderConfigurator();
    updateDisplayImage();
}
