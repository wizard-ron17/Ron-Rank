// Initialize an empty dataPoints array
let dataPoints = [];

async function fetchPriceData(period) {
    // Define your GraphQL query based on the selected period
    const query = period === "1H" ?
        `{
            price(token: "free.wiza", period: 1) {
                id
                timestamp
                priceInKda
                intervalStamp
            }
        }` :
        `{
            price(token: "free.wiza", period: ${calculateDaysSince()}) {
                id
                timestamp
                priceInKda
                intervalStamp
            }
        }`;

    try {
        const response = await fetch('https://kdswap-fd-prod-cpeabrdfgdg9hzen.z01.azurefd.net/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: query
            })
        });

        const responseData = await response.json();
        const prices = responseData.data.price;

        prices.sort((a, b) => a.timestamp - b.timestamp);

        // Initialize variables to store the transformed data
        dataPoints = [];

        // Iterate over the prices and create groups of 4
        for (let i = 0; i < prices.length; i += 4) {
            if (i + 3 < prices.length) {
                // Extract Open, High, Low, and Close values
                const open = parseFloat(prices[i].priceInKda);
                const high = parseFloat(prices[i + 1].priceInKda);
                const low = parseFloat(prices[i + 2].priceInKda);
                const close = parseFloat(prices[i + 3].priceInKda);

                // Extract timestamp
                const intervalStamp = parseFloat(prices[i].intervalStamp);

                // Create a data point with x (timestamp) and y (Open, High, Low, Close)
                const dataPoint = {
                    x: intervalStamp,
                    y: [open, high, low, close]
                };

                // Add the data point to the array
                dataPoints.push(dataPoint);
            }
        }

        // Now you have an array of data points in the desired format
        console.log(dataPoints);

        // Update the chart with the new dataPoints
        chart.updateSeries([{
            name: 'WIZA Price',
            data: dataPoints
        }]);
    } catch (error) {
        console.error('Error fetching price data:', error);
    }
}

// Define a function to calculate the number of days since December 19, 2022
function calculateDaysSince() {
    const currentDate = new Date();
    const referenceDate = new Date('2022-12-19');
    const daysSince = Math.floor((currentDate - referenceDate) / (1000 * 60 * 60 * 24));
    return daysSince;
}

var options = {
    series: [{
        name: 'WIZA Price',
        data: dataPoints,
    }],
    chart: {
        foreColor: 'white',
        type: 'candlestick',
        height: 500
    },
    grid: {
        show: true,
        borderColor: '#373d3f',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
            lines: {
                show: false
            }
        },
        yaxis: {
            lines: {
                show: true
            }
        },
        row: {
            colors: undefined,
            opacity: 0.5
        },
        column: {
            colors: undefined,
            opacity: 0.5
        },
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
    },
    title: {
        text: '$WIZA/$KDA',
        align: 'left',
        style: {
            color: 'white'
        }
    },
    noData: {
        text: 'Loading...'
    },
    tooltip: {
        enabled: true,
        theme: true
    },
    xaxis: {
        type: 'datetime'
    },
    yaxis: {
        tickAmount: 5,
        min: 0.008,
        max: 0.035,
        tooltip: {
            enabled: true
        },
        labels: {
            formatter: function (value) {
                // Use the toFixed method to control decimal places (e.g., 4 decimal places)
                return value.toFixed(4);
            }
        }
    }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);

function initializeChart() {
    chart.render();
    fetchPriceData("1H"); // Fetch data for the initial period (1H)
}

// Attach the function to the "DOMContentLoaded" event
document.addEventListener("DOMContentLoaded", initializeChart);

// Add an event listener for the switch
document.getElementById("periodToggle").addEventListener("change", function () {
    const period = this.checked ? "1D" : "1H";
    fetchPriceData(period);
});

// Call the initial data fetch
fetchPriceData("1H");
