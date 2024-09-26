/* Global Styles */
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #ffffff;
    color: #000000;
}

header {
    position: relative;
    height: 80px;
}

#logo {
    position: absolute;
    top: 10px;
    right: 20px;
    height: 60px; /* Adjust as needed */
}

#landing-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 80px);
    text-align: center;
}

#landing-page h1 {
    font-size: 36px;
    margin-bottom: 20px;
}

#landing-page p {
    font-size: 18px;
    margin-bottom: 40px;
}

.options {
    display: flex;
    gap: 20px;
}

.options button {
    padding: 15px 30px;
    font-size: 18px;
    background-color: #0099cc;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.options button:hover {
    background-color: #007ea6;
}

.options button:active {
    background-color: #006494;
}
