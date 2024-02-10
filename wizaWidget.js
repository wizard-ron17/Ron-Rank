const params = args.widgetParameter ? args.widgetParameter.split(",") : [];

const isDarkTheme = params?.[0] === 'dark';
const padding = 10;

const widget = new ListWidget();
if (isDarkTheme) {
 widget.backgroundColor = new Color('#1C1C1E');
}
widget.setPadding(padding, padding, padding, padding);

widget.url = 'https://rondex.xyz/wiza';

const headerStack = widget.addStack();
headerStack.setPadding(10, 0, 0, 0);
const headerText = headerStack.addText("$WIZA Price");
headerText.font = Font.semiboldSystemFont(18);
if (isDarkTheme) {
    headerText.textColor = new Color('#FFFFFF');
}

async function buildWidget() {
    const ethereumImage = await loadImage('https://raw.githubusercontent.com/wizard-ron17/Ron-Rank/main/wizhat-zoomed.png');
    
    const ethereumPriceInfo = await getTokenPriceInfo();
 
    const roundedEthereumPrice = ethereumPriceInfo.price;
  
    addCrypto(ethereumImage, 'WIZA',`${roundedEthereumPrice} KDA`, ethereumPriceInfo.grow);
}

function addCrypto(image, symbol, price, grow) {
   const rowStack = widget.addStack();
   rowStack.setPadding(0, 0, 10, 0);
   rowStack.layoutVertically();
  
   const imageStack = rowStack.addStack(); 
   const symbolStack = rowStack.addStack(); 
   const priceStack = rowStack.addStack(); 
  
   imageStack.setPadding(0, 0, 5, 0);
  
   const imageNode = imageStack.addImage(image);
   imageNode.imageSize = new Size(50, 50);
   imageNode.leftAlignImage();
  
   const symbolText = symbolStack.addText(symbol);
   symbolText.font = Font.semiboldSystemFont(20);
  
   const kdaPerWiza = 1 / parseFloat(price);
   const roundedKdaPerWiza = kdaPerWiza.toFixed(4); // Adjust the precision as needed
   const priceText = priceStack.addText(`${roundedKdaPerWiza} KDA`);
   priceText.font = Font.semiboldSystemFont(18);
  
  if (isDarkTheme) {
    symbolText.textColor = new Color('#FFFFFF');
  }
  
  if (grow) {
    priceText.textColor = new Color('#4AA956');
  } else {
    priceText.textColor = new Color('#D22E2E');
  }
}

async function getTokenPriceInfo() {
  const url = 'https://backend2.euclabs.net/kadena-indexer/v1/account/zV4AcMr1UcqDswRfSh6tzmpsmx7hWg5o0IYns0ZuN1I'
  const req = new Request(url)
  const apiResult = await req.loadJSON() 
  return { price: apiResult['assets'][1].totalBalance/apiResult['assets'][0].totalBalance, grow: true}; // Adjust the 'grow' property as needed
}

async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
