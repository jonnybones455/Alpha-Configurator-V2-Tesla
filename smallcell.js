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
    // Continue with other steps as before...
];

let selectedOptions = {};

document.addEventListener('DOMContentLoaded', () => {
    renderConfigurator();
});

function renderConfigurator() {
    const selectionPanel = document.getElementById('selection-panel');
    selectionPanel.innerHTML = '';

    smallCellSteps.forEach((stepData, index) => {
        const section = createStepSection(stepData, index);
        selectionPanel.appendChild(section);
    });
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
                updateDisplayImage(option.image);
            }
        });

        button.addEventListener('mouseenter', () => {
            if (!button.classList.contains('disabled')) {
                updateDisplayImage(option.image);
            }
        });

        button.addEventListener('mouseleave', () => {
            const currentImage = getCurrentDisplayImage();
            updateDisplayImage(currentImage);
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

function selectOption(stepId, option) {
    selectedOptions[stepId] = option.value;

    // Reset dependent selections
    const stepIndex = smallCellSteps.findIndex(step => step.id === stepId);
    for (let i = stepIndex + 1; i < smallCellSteps.length; i++) {
        const nextStep = smallCellSteps[i];
        delete selectedOptions[nextStep.id];
    }
}

function updateDisplayImage(imageSrc) {
    const displayImage = document.getElementById('display-image');
    displayImage.src = `images/${imageSrc}`;
}

function getCurrentDisplayImage() {
    // Get the image corresponding to the last selected option
    for (let i = smallCellSteps.length -1; i >= 0; i--) {
        const stepId = smallCellSteps[i].id;
        const selectedValue = selectedOptions[stepId];
        if (selectedValue) {
            let options = [];
            if (smallCellSteps[i].dependency) {
                const dependencyValue = selectedOptions[smallCellSteps[i].dependency];
                options = smallCellSteps[i].options[dependencyValue] || [];
            } else {
                options = smallCellSteps[i].options;
            }
            const selectedOption = options.find(opt => opt.value === selectedValue);
            if (selectedOption) {
                return selectedOption.image;
            }
        }
    }
    return 'default.png'; // Default image if no selection
}
