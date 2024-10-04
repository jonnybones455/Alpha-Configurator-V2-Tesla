// Small Cell Decision Tree Data
const smallCellSteps = [
    {
        id: 'siteType',
        title: 'Site Type',
        question: 'Will your deployment be a...',
        options: [
            { value: 'greenfieldSite', label: 'Greenfield Site', image: 'greenfieldSite_display.png' },
            { value: 'brownfieldSite', label: 'Brownfield Site', image: 'brownfieldSite_display.png' },
        ],
    },
    {
        id: 'poleType',
        title: 'Pole Type',
        question: 'Select your pole type:',
        dependency: 'siteType',
        options: {
            greenfieldSite: [
                { value: 'compositePole', label: 'Composite Pole', image: 'compositePole_display.png' },
            ],
            brownfieldSite: [
                { value: 'lampPost', label: 'Lamp Post', image: 'lampPost_display.png' },
                { value: 'steelPole', label: 'Steel Pole', image: 'steelPole_display.png' },
            ],
        },
    },
    {
        id: 'antennaType',
        title: 'Antenna Type',
        question: 'Select your antenna type:',
        dependency: 'poleType',
        options: {
            compositePole: [
                { value: 'cannisterAntenna', label: 'Cannister Antenna', image: 'cannisterAntenna_display.png' },
            ],
            lampPost: [
                { value: 'fusionMidPole', label: 'Fusion Mid-Pole', image: 'fusionMidPole_display.png' },
                { value: 'fusionTopPole', label: 'Fusion Top-of-Pole', image: 'fusionTopPole_display.png' },
            ],
            steelPole: [
                { value: 'fusionMidPole', label: 'Fusion Mid-Pole', image: 'fusionMidPole_display.png' },
                { value: 'fusionTopPole', label: 'Fusion Top-of-Pole', image: 'fusionTopPole_display.png' },
            ],
        },
    },
    {
        id: 'cabinetType',
        title: 'Cabinet Type',
        question: 'Select your cabinet type:',
        options: [
            { value: 'streetMicro', label: 'Street Micro', image: 'streetMicro_display.png' },
            { value: 'telecomEnclosure', label: 'Telecom Enclosure', image: 'telecomEnclosure_display.png' },
            { value: 'shroud', label: 'Shroud', image: 'shroud_display.png' },
            { value: 'standAloneEnclosure', label: 'Stand Alone Enclosure', image: 'standAloneEnclosure_display.png' },
        ],
    },
    {
        id: 'cabinetConfiguration',
        title: 'Cabinet Configuration',
        question: 'Select your cabinet configuration:',
        dependency: 'cabinetType',
        options: {
            telecomEnclosure: [
                { value: '1unit', label: '1 Unit', image: '1unit_display.png' },
                { value: '2units', label: '2 Units', image: '2units_display.png' },
                { value: '3units', label: '3 Units', image: '3units_display.png' },
            ],
            shroud: [], // No options for shroud
            // For 'streetMicro' and 'standAloneEnclosure', we will skip this step
        },
    },
];

let selectedOptions = {}; // Stores the user's selections
let imagesToRemove = []; // Stores images to be removed from the layered display

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

    smallCellSteps.forEach((stepData, index) => {
        if (shouldDisplayStep(stepData, index)) {
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

    let options = [];

    if (stepData.dependency) {
        const dependencyValue = selectedOptions[stepData.dependency];
        options = stepData.options[dependencyValue] || [];
    } else {
        options = stepData.options;
    }

    // If there are no options (e.g., shroud selected), skip rendering options
    if (options.length === 0 && stepData.id === 'cabinetConfiguration') {
        // Skip rendering this step
        return section;
    }

    options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option-button');
        button.dataset.stepId = stepData.id;
        button.dataset.value = option.value;

        // Disable the button if previous steps are not selected
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
                previewImageLayer(option.image, option.removeImage);
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
        const prevStepId = smallCellSteps[i].id;
        if (!selectedOptions[prevStepId]) {
            return false;
        }
    }
    return true;
}

// Determines whether to display a step
function shouldDisplayStep(stepData, index) {
    // Skip the 'cabinetConfiguration' step if certain cabinet types are selected
    if (stepData.id === 'cabinetConfiguration') {
        const cabinetType = selectedOptions['cabinetType'];
        if (cabinetType === 'shroud' || cabinetType === 'streetMicro' || cabinetType === 'standAloneEnclosure') {
            return false;
        }
    }
    return isStepActive(index);
}

// Stores the user's selection and resets dependent selections
function selectOption(stepId, option) {
    selectedOptions[stepId] = option.value;

    // Handle images to remove (if applicable)
    if (option.removeImage) {
        imagesToRemove.push(option.removeImage);
    } else {
        // If the option doesn't specify images to remove, clear any previous removals for this step
        const stepIndex = smallCellSteps.findIndex(step => step.id === stepId);
        const options = smallCellSteps[stepIndex].options;
        Object.values(options).flat().forEach(opt => {
            if (opt.removeImage) {
                imagesToRemove = imagesToRemove.filter(img => img !== opt.removeImage);
            }
        });
    }

    // Reset dependent selections
    const stepIndex = smallCellSteps.findIndex(step => step.id === stepId);
    for (let i = stepIndex + 1; i < smallCellSteps.length; i++) {
        const nextStep = smallCellSteps[i];
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
    smallCellSteps.forEach(step => {
        const stepId = step.id;
        const selectedValue = selectedOptions[stepId];
        if (selectedValue) {
            let optionData = null;
            if (step.dependency) {
                const dependencyValue = selectedOptions[step.dependency];
                const options = step.options[dependencyValue] || [];
                optionData = options.find(opt => opt.value === selectedValue);
            } else {
                optionData = step.options.find(opt => opt.value === selectedValue);
            }
            if (optionData && optionData.image && !imagesToRemove.includes(optionData.image)) {
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
function previewImageLayer(previewImageSrc, previewRemoveImage) {
    const imageContainer = document.getElementById('image-container');
    let imagesToDisplay = getSelectedImages();

    // Handle image removal in preview
    if (previewRemoveImage) {
        imagesToDisplay = imagesToDisplay.filter(img => img !== previewRemoveImage);
    }

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

    smallCellSteps.forEach((step, index) => {
        // Skip the 'cabinetConfiguration' step if certain cabinet types are selected
        if (step.id === 'cabinetConfiguration') {
            const cabinetType = selectedOptions['cabinetType'];
            if (cabinetType === 'shroud' || cabinetType === 'streetMicro' || cabinetType === 'standAloneEnclosure') {
                return;
            }
        }

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
    // If certain cabinet types are selected, consider the configurator complete after 'cabinetType' step
    const cabinetType = selectedOptions['cabinetType'];
    if (cabinetType === 'shroud' || cabinetType === 'streetMicro' || cabinetType === 'standAloneEnclosure') {
        return smallCellSteps.slice(0, 4).every(step => selectedOptions[step.id]);
    }

    // Otherwise, check if all steps are completed
    return smallCellSteps.every(step => selectedOptions[step.id] || (step.id === 'cabinetConfiguration' && (cabinetType === 'shroud' || cabinetType === 'streetMicro' || cabinetType === 'standAloneEnclosure')));
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
    imagesToRemove = [];
    renderConfigurator();
    updateDisplayImage();
}
