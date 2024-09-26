// Small Cell Decision Tree Data
const smallCellSteps = [
    {
        id: 'siteType',
        title: 'Site Type',
        question: 'Will your deployment be a...',
        options: [
            { value: 'newSite', label: 'New Site', image: 'newSite_display.png' },
            { value: 'existingInfrastructure', label: 'Existing Infrastructure', image: 'existingInfrastructure_display.png' },
        ],
    },
    {
        id: 'poleType',
        title: 'Pole Type',
        question: 'Select your pole type:',
        dependency: 'siteType',
        options: {
            newSite: [
                { value: 'compositePole', label: 'Composite Pole', image: 'compositePole_display.png' },
            ],
            existingInfrastructure: [
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
        ],
    },
    {
        id: 'cabinetConfiguration',
        title: 'Cabinet Configuration',
        question: 'Select your cabinet configuration:',
        dependency: 'cabinetType',
        options: {
            streetMicro: [
                { value: 'bottomOfPole', label: 'Bottom of Pole', image: 'bottomOfPole_display.png' },
                { value: 'midPole', label: 'Mid-Pole', image: 'midPole_display.png' },
            ],
            telecomEnclosure: [
                { value: '1unit', label: '1 Unit', image: '1unit_display.png' },
                { value: '2units', label: '2 Units', image: '2units_display.png' },
                { value: '3units', label: '3 Units', image: '3units_display.png' },
            ],
            shroud: [],
        },
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
        const prevStepId = smallCellSteps[i].id;
        if (!selectedOptions[prevStepId]) {
            return false;
        }
    }
    return true;
}

function shouldDisplayStep(stepData, index) {
    // Display the step if all previous steps are completed
    return isStepActive(index);
}

function selectOption(stepId, option) {
    selectedOptions[stepId] = option.value;

    // Reset dependent selections
    const stepIndex = smallCellSteps.findIndex(step => step.id === stepId);
    for (let i = stepIndex + 1; i < smallCellSteps.length; i++) {
        const nextStep = smallCellSteps[i];
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

    smallCellSteps.forEach((step, index) => {
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
    return smallCellSteps.every(step => selectedOptions[step.id]);
}

function renderActionButtons(container) {
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

    buttonContainer.appendChild(fullscreenButton);
    buttonContainer.appendChild(contactButton);
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
