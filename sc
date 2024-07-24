<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shadow Clan Algo Calculator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #333;
            color: white;
        }
        h1 {
            color: white;
        }
        input, button {
            margin: 5px 0;
            padding: 5px;
            background-color: #444;
            color: white;
        }
        #result {
            font-weight: bold;
            margin-top: 10px;
        }
        #progressBar {
            width: 100%;
            background-color: #f0f0f0;
            margin-top: 10px;
        }
        #progressBarFill {
            height: 20px;
            background-color: #4CAF50;
            width: 0%;
            transition: width 0.5s ease-in-out;
        }
        #chartContainer {
            margin-top: 20px;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@1.0.2"></script>
</head>
<body>
    <h1>Shadow Clan Algo Calculator</h1>
    <div>
        <label for="attack">Attack:</label>
        <input type="number" id="attack" min="0" value="0">
    </div>
    <div>
        <label for="defense">Defense:</label>
        <input type="number" id="defense" min="0" value="0">
    </div>
    <div>
        <label for="missTimes">Miss Times:</label>
        <input type="number" id="missTimes" min="0" value="0">
    </div>
    <div>
        <label for="algoRatio">Algo Ratio:</label>
        <input type="number" id="algoRatio" step="0.1" value="2.1">
    </div>
    <button onclick="calculate()">Calculate</button>
    <button onclick="updateChart()">Update Chart</button>
    <div id="result"></div>
    <div id="progressBar">
        <div id="progressBarFill"></div>
    </div>
    <div id="chartContainer">
        <canvas id="myChart"></canvas>
    </div>

    <script>
        let myChart;

        function calculate() {
            const attack = parseInt(document.getElementById('attack').value);
            const defense = parseInt(document.getElementById('defense').value);
            const missTimes = parseInt(document.getElementById('missTimes').value);
            const algoRatio = parseFloat(document.getElementById('algoRatio').value);

            const finalPct = calcHitFight(attack, defense, missTimes, algoRatio);
            const resultElement = document.getElementById('result');
            const progressBarFill = document.getElementById('progressBarFill');

            resultElement.textContent = `Hit Chance: ${finalPct}%`;
            progressBarFill.style.width = `${finalPct}%`;
        }

        function calcHitFight(attack, defense, missTimes, algoRatio) {
            const baseAtk = 50;
            let diff = Math.round((attack - defense) * algoRatio);
            let finalPct = diff + baseAtk + missTimes;
            
            if (finalPct < 2) {
                finalPct = 2;
            }
            if (finalPct > 98) {
                finalPct = 98;
            }

            return finalPct;
        }

        function generateData(algoRatio) {
            const data = [];
            for (let diff = -50; diff <= 50; diff++) {
                data.push({
                    x: diff,
                    y: calcHitFight(diff + 50, 50, 0, algoRatio)  // Using base attack 50 and varying difference
                });
            }
            return data;
        }

        function updateChart() {
            const algoRatio = parseFloat(document.getElementById('algoRatio').value);
            const data = generateData(algoRatio);

            const ctx = document.getElementById('myChart').getContext('2d');
            if (myChart) {
                myChart.data.datasets[0].data = data;
                myChart.update();
            } else {
                myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Hit Chance',
                            data: data,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            pointRadius: 2,
                            pointHoverRadius: 5,
                            fill: false
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                type: 'linear',
                                position: 'bottom',
                                title: {
                                    display: true,
                                    text: 'Attack Minus Defense'
                                },
                                min: -50,
                                max: 50
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Hit Chance (%)'
                                },
                                min: 0,
                                max: 100
                            }
                        },
                        plugins: {
                            annotation: {
                                annotations: {
                                    line1: {
                                        type: 'line',
                                        yMin: 50,
                                        yMax: 50,
                                        borderColor: 'grey',
                                        borderWidth: 2,
                                        label: {
                                            enabled: true,
                                            position: 'left'
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            updateChart();
        });
    </script>
</body>
</html>
