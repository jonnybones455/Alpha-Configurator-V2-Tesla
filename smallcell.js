// Small Cell Decision Tree Data
const smallCellSteps = [
    {
        id: 'siteType',
        title: 'Site Type',
        question: 'Will your deployment be a...',
        options: [
            { value: 'newSite', label: 'New Site', image: 'newSite.png' },
            { value: 'existingInfrastructure', label: 'Existing Infrastructure', image: 'existingInfrastructure.png' },
        ],
    },
    {
        id: 'poleType',
        title: 'Pole Type',
        question: 'Select your pole type:',
        dependency: 'siteType',
        options: {
            newSite: [
                { value: 'compositePole', label: 'Composite Pole', image: 'compositePole.png' },
            ],
            existingInfrastructure: [
                { value: 'lampPost', label: 'Lamp Post', image: 'lampPost.png' },
                { value: 'steelPole', label: 'Steel Pole', image: 'steelPole.png' },
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
                { value: 'cannisterAntenna', label: 'Cannister Antenna', image: 'cannisterAntenna.png' },
            ],
            lampPost: [
                { value: 'fusionMidPole', label: 'Fusion Mid-Pole', image: 'fusionMidPole.png' },
                { value: 'fusionTopPole', label: 'Fusion Top-of-Pole', image: 'fusionTopPole.png' },
            ],
            steelPole: [
                { value: 'fusionMidPole', label: 'Fusion Mid-Pole', image: 'fusionMidPole.png' },
                { value: 'fusionTopPole', label: 'Fusion Top-of-Pole', image: 'fusionTopPole.png' },
            ],
        },
    },
    {
        id: 'cabinetType',
        title: 'Cabinet Type',
        question: 'Select your cabinet type:',
        options: [
            { value: 'streetMicro', label: 'Street Micro', image: 'streetMicro.png' },
            { value: 'telecomEnclosure', label: 'Telecom Enclosure', image: 'telecomEnclosure.png' },
            { value: 'shroud', label: 'Shroud', image: 'shroud.png' },
        ],
    },
    {
        id: 'cabinetConfiguration',
        title: 'Cabinet Configuration',
        question: 'Select your cabinet configuration:',
        dependency: 'cabinetType',
        options: {
            streetMicro: [
                { value: 'bottomOfPole', label: 'Bottom of Pole', image: 'bottomOfPole.png' },
                { value: 'midPole', label: 'Mid-Pole', image: 'midPole.png' },
            ],
            telecomEnclosure: [
                { value: '1unit', label: '1 Unit', image: '1unit.png' },
                { value: '2units', label: '2 Units', image: '2units.png' },
                { value: '3units', label: '3 Units', image: '3units.png' },
            ],
            shroud: [],
        },
    },
];

// Initialize Configurator
let selectedOptions = {};
let currentStepIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    renderConfigurator();
});

function renderConfigurator() {
    const configurator = document.getElementById('configurator');
    configurator.innerHTML = '';

    smallCellSteps.forEach((stepData, index) => {
        if (shouldDisplayStep(stepData, index)) {
            const section = createStepSection(stepData);
            configurator.appendChild(section);
        }
    });

    // Add event listeners for options
    document.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', () => {
            const stepId = button.dataset.stepId;
            const value = button.dataset.value;
            selectOption(stepId, value);
            renderConfigurator(); // Re-render to show/hide dependent steps
            updateImageDisplay();
            scrollToNextStep(stepId);
        });
    });
}

function createStepSection(stepData) {
    const section = document.createElement('section');
    section.classList.add('config-step');
    section.id = stepData.id;

    const title = document.createElement('h2');
    title.textContent = stepData.title;
    section.appendChild(title);

    const question = document.createElement('p');
    question.textContent = stepData.question;
    section.appendChild(question);

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
        const button = document.createElement('div');
        button.classList.add('option-button');
        button.dataset.stepId = stepData.id;
        button.dataset.value = option.value;

        if (selectedOptions[stepData.id] === option.value) {
            button.classList.add('selected');
        }

        const img = document.createElement('img');
        img.src = `images/${option.image}`;
        button.appendChild(img);

        const span = document.createElement('span');
        span.textContent = option.label;
        button.appendChild(span);

        optionsDiv.appendChild(button);
    });

    section.appendChild(optionsDiv);

    return section;
}

function selectOption(stepId, value) {
    selectedOptions[stepId] = value;

    // Reset dependent selections
    const stepIndex = smallCellSteps.findIndex(step => step.id === stepId);
    for (let i = stepIndex + 1; i < smallCellSteps.length; i++) {
        const nextStep = smallCellSteps[i];
        if (nextStep.dependency && selectedOptions[nextStep.dependency] !== undefined) {
            delete selectedOptions[nextStep.id];
        }
    }
}

function shouldDisplayStep(stepData, index) {
    if (index === 0) return true; // Always display the first step

    if (stepData.dependency) {
        return selectedOptions[stepData.dependency] !== undefined;
    }

    return true;
}

function updateImageDisplay() {
    // Update the image display based on selected options
    // Implement image layering or selection logic here
}

function scrollToNextStep(currentStepId) {
    const nextStepIndex = smallCellSteps.findIndex(
        (step, index) => index > currentStepIndex && shouldDisplayStep(step, index)
    );

    if (nextStepIndex !== -1) {
        currentStepIndex = nextStepIndex;
        const nextStepId = smallCellSteps[nextStepIndex].id;
        const nextSection = document.getElementById(nextStepId);
        nextSection.scrollIntoView({ behavior: 'smooth' });
    }
}
