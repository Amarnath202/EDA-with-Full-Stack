// Analytics Page JavaScript

// Tab switching functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializePredictionForm();
    initializePowerBI();
});

// Initialize Power BI reports
async function initializePowerBI() {
    try {
        // Get the embed token from your backend
        const response = await fetch('http://localhost:5000/api/powerbi/embedinfo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get Power BI embed info');
        }

        const embedInfo = await response.json();
        
        // Initialize each Power BI iframe with proper configuration
        const iframes = document.querySelectorAll('.powerbi-frame');
        iframes.forEach(iframe => {
            const reportConfig = embedInfo.reports[iframe.id];
            if (reportConfig) {
                const embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportConfig.reportId}&groupId=${reportConfig.groupId}&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUlORElBLUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZX19`;
                iframe.src = embedUrl;
                
                // Add event listener for iframe load
                iframe.onload = () => {
                    // Post the access token to the iframe
                    iframe.contentWindow.postMessage({
                        action: 'setAccessToken',
                        accessToken: embedInfo.accessToken
                    }, '*');
                };
            }
        });
    } catch (error) {
        console.error('Error initializing Power BI:', error);
        // Show error message to user
        displayError('Unable to load Power BI reports. Please try refreshing the page.');
    }
}

// Initialize tab switching
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Initialize prediction form
function initializePredictionForm() {
    const form = document.getElementById('predictionForm');
    
    if (form) {
        form.addEventListener('submit', handlePredictionSubmit);
    }
}

// Handle prediction form submission
async function handlePredictionSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        state: document.getElementById('state').value.trim(),
        district: document.getElementById('district').value.trim(),
        season: document.getElementById('season').value.trim(),
        crop: document.getElementById('crop').value.trim(),
        production: parseFloat(document.getElementById('production').value),
        zn: parseFloat(document.getElementById('zn').value),
        fe: parseFloat(document.getElementById('fe').value)
    };

    // Hide previous results/errors
    hideResultCard();
    hideErrorCard();

    // Show loading spinner
    showLoadingSpinner();

    try {
        // Make API call to ML prediction endpoint through backend
        const response = await fetch('http://localhost:5000/api/ml/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        // Hide loading spinner
        hideLoadingSpinner();

        if (response.ok) {
            // Display prediction results
            displayPredictionResults(data);
        } else {
            // Display error message
            displayError(data.error || 'Failed to get prediction. Please try again.');
        }
    } catch (error) {
        // Hide loading spinner
        hideLoadingSpinner();

        // Display error message
        console.error('Prediction error:', error);
        displayError('Unable to connect to the prediction service. Please ensure both the backend server (port 5000) and ML server (port 5001) are running.');
    }
}

// Display prediction results
function displayPredictionResults(data) {
    const resultCard = document.getElementById('resultCard');
    const priceQuintal = document.getElementById('priceQuintal');
    const priceTonne = document.getElementById('priceTonne');
    const priceKg = document.getElementById('priceKg');

    // Update values
    priceQuintal.textContent = `₹${data.predicted_price_quintal.toFixed(2)}`;
    priceTonne.textContent = `₹${data.predicted_price_tonne.toFixed(2)}`;
    priceKg.textContent = `₹${data.predicted_price_kg.toFixed(2)}`;

    // Show result card
    resultCard.style.display = 'block';

    // Scroll to results
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Display error message
function displayError(message) {
    const errorCard = document.getElementById('errorCard');
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.textContent = message;
    errorCard.style.display = 'block';

    // Scroll to error
    errorCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Hide result card
function hideResultCard() {
    const resultCard = document.getElementById('resultCard');
    resultCard.style.display = 'none';
}

// Hide error card
function hideErrorCard() {
    const errorCard = document.getElementById('errorCard');
    errorCard.style.display = 'none';
}

// Show loading spinner
function showLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'flex';
    }
}

// Hide loading spinner
function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTabs,
        initializePredictionForm,
        handlePredictionSubmit,
        displayPredictionResults,
        displayError
    };
}
