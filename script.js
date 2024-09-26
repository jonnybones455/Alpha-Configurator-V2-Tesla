// Decision Tree Data
const stepsData = [
    {
        id: 'deploymentType',
        title: 'Deployment Type',
        options: [
            { value: 'smallCell', label: 'Small Cell Deployment', nextStep: 'siteType' },
            { value: 'macro', label: 'Macro Deployment', nextStep: 'macroNotImplemented' },
        ],
    },
    {
        id: 'siteType',
        title: 'Site Type',
        options: [
            { value: 'newSite', label: 'New Site', nextStep: 'poleTypeNew' },
            { value: 'existingInfrastructure', label: 'Existing Infrastructure', nextStep: 'poleTypeExisting' },
        ],
    },
    {
        id: 'poleTypeNew',
        title: 'Pole Type',
        options: [
            { value: 'compositePole', label: 'Composite Pole', nextStep: 'antennaTypeNew' },
        ],
    },
    {
        id: 'poleTypeExisting',
        title: 'Pole Type',
        options: [
            { value: 'lampPost', label: 'Lamp Post', nextStep: 'antennaTypeExisting' },
            { value: 'steelPole', label: 'Steel Pole', nextStep: 'antennaTypeExisting' },
        ],
    },
    {
        id: 'antennaTypeNew',
        title: 'Antenna Type',
        options: [
            { value: 'cannisterAntenna', label: 'Cannister Antenna', nextStep: 'cabinetType' },
        ],
    },
    {
        id: 'antennaTypeExisting',
        title: 'Antenna Type',
        options: [
            { value: 'fusionMidPole', label: 'Fusion Mid-Pole', nextStep: 'cabinetType' },
            { value: 'fusionTopPole', label: 'Fusion Top-of-Pole', nextStep: 'cabinetType' },
        ],
    },
    {
        id: 'cabinetType',
        title: 'Cabinet Type',
        options: [
            { value: 'streetMicro', label: 'Street Micro', nextStep: 'cabinetConfigStreetMicro' },
            { value: 'telecomEnclosure', label: 'Telecom Enclosure', nextStep: 'cabinetConfigTelecomEnclosure' },
            { value: 'shroud', label: 'Shroud', nextStep: 'end' },
        ],
    },
    {
        id: 'cabinetConfigStreetMicro',
        title: 'Cabinet Configuration',
        options: [
            { value: 'bottomOfPole', label: 'Bottom of Pole', nextStep: 'end' },
            { value: 'midPole', label: 'Mid-Pole', nextStep: 'end' },
        ],
    },
    {
        id: 'cabinetConfigTelecomEnclosure',
        title: 'Cabinet Configuration',
        options: [
            { value: '1unit', label: '1 Unit', nextStep: 'end' },
            { value: '2units', label: '2 Units', nextStep: 'end' },
            { value: '3units', label: '3 Units', nextStep: 'end' },
        ],
    },
    {
        id: 'macroNotImplemented',
        title: 'Macro Deployment',
        message: 'Macro deployment is not yet implemented.',
        options: [],
    },
];

let currentStepIndex = 0;
const selectedOptions = {};

document.addEventListener('DOMContentLoaded', () => {
    renderStep();
    updateNavigationButtons();
});

function renderStep() {
    const configSteps = document.getElementById('config-steps');
    configSteps.innerHTML = '';

    const stepData = stepsData[currentStepIndex];

    if (stepData.id === 'macroNotImplemented') {
        const message = document.createElement('p');
        message.textContent = stepData.message;
        configSteps.appendChild(message);
        document.getElementById('next-button').disabled = true;
        return;
    }

    const stepDiv = document.createElement('div');
    stepDiv.classList.add('step', 'active');
    stepDiv.id = stepData.id;

    const title = document.createElement('h2');
    title.textContent = stepData.title;
    stepDiv.appendChild(title);

    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('options');

    stepData.options.forEach(option => {
        const button = document.createElement('div');
        button.classList.add('option-button');
        button.dataset.value = option.value;

        if (selectedOptions[stepData.id] === option.value) {
            button.classList.add('selected');
        }

        // Optionally add an image
        // const img = document.createElement('img');
        // img.src = `images/icons/${option.value}.png`;
        // button.appendChild(img);

        const span = document.createElement('span');
        span.textContent = option.label;
        button.appendChild(span);

        button.addEventListener('click', () => {
            selectOption(stepData.id, option);
        });

        optionsDiv.appendChild(button);
    });

    stepDiv.appendChild(optionsDiv);
    configSteps.appendChild(stepDiv);
}

function selectOption(stepId, option) {
    selectedOptions[stepId] = option.value;

    // Update UI
    document.querySelectorAll('.option-button').forEach(btn => {
        if (btn.dataset.value === option.value) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });

    // Enable Next button
    document.getElementById('next-button').disabled = false;

    // Update image
    updateImage();
}

function updateImage() {
    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = ''; // Clear existing images

    // For simplicity, we'll just display the image corresponding to the last selected option
    const lastOptionValue = Object.values(selectedOptions).slice(-1)[0];

    if (lastOptionValue) {
        const img = document.createElement('img');
        img.src = `images/${lastOptionValue}.png`;
        imageContainer.appendChild(img);
    }
}

function updateNavigationButtons() {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    prevButton.disabled = currentStepIndex === 0;
    nextButton.disabled = !selectedOptions[stepsData[currentStepIndex].id];
}

document.getElementById('prev-button').addEventListener('click', () => {
    if (currentStepIndex > 0) {
        currentStepIndex--;
        renderStep();
        updateNavigationButtons();
    }
});

document.getElementById('next-button').addEventListener('click', () => {
    const currentStep = stepsData[currentStepIndex];
    const selectedValue = selectedOptions[currentStep.id];
    const selectedOption = currentStep.options.find(opt => opt.value === selectedValue);

    if (selectedOption && selectedOption.nextStep) {
        currentStepIndex = stepsData.findIndex(step => step.id === selectedOption.nextStep);
        renderStep();
        updateNavigationButtons();
    }
});
