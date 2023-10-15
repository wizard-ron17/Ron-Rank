// Initialize an empty dataPoints array
let dataPoints = [];

async function fetchPriceData() {
  try {
    const response = await fetch('https://kdswap-fd-prod-cpeabrdfgdg9hzen.z01.azurefd.net/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          price(token: "free.wiza", period: 1) {
            id
            timestamp
            priceInKda
            intervalStamp
          }
        }`
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

// Call the function with your desired 'period'
fetchPriceData();

function initializeChart() {
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
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          tickAmount: 5,
          min: 0.005,
          max: 0.04,
          tooltip: {
            enabled: true
          },
        }
        }};

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();

        // Attach the function to the "DOMContentLoaded" event
        document.addEventListener("DOMContentLoaded", initializeChart);

        $.getJSON('https://kdswap-fd-prod-cpeabrdfgdg9hzen.z01.azurefd.net/graphql', function(dataPoints) {
        chart.updateSeries([{
        name: 'WIZA Price',
        data: dataPoints
      }])
    });
