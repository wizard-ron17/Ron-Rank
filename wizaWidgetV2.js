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
headerStack.setPadding(0, 0, 0, 0);
const headerText = headerStack.addText("$WIZA Price");
headerText.font = Font.semiboldSystemFont(18);
if (isDarkTheme) {
  headerText.textColor = new Color('#FFFFFF');
}

async function buildWidget() {
  const wizaImage = await loadImage('https://raw.githubusercontent.com/wizard-ron17/Ron-Rank/main/wizhat-zoomed.png');

  const wizaPriceInfo = await getTokenPriceInfo();
  const wizaPrice = wizaPriceInfo.price;
  
  const usdRate = await getUSDExchangeRate();
  const wizaPriceUSD = (parseFloat(wizaPrice) * parseFloat(usdRate)).toFixed(3);
  
  addCrypto(wizaImage, `${wizaPrice} KDA`, `$${wizaPriceUSD} USD`);
}

function addCrypto(image, kdaPrice, usdPrice) {
  const rowStack = widget.addStack();
  rowStack.setPadding(0, 0, 0, 0);
  rowStack.layoutVertically();

  const imageStack = rowStack.addStack();
  const priceStack = rowStack.addStack();
  const priceUSDStack = rowStack.addStack();

  imageStack.setPadding(0, 25, 0, 0);

  const imageNode = imageStack.addImage(image);
  imageNode.imageSize = new Size(50, 50);
  imageNode.leftAlignImage();

  const kdaPriceText = priceStack.addText(kdaPrice);
  kdaPriceText.font = Font.semiboldSystemFont(18);
  if (isDarkTheme) {
    kdaPriceText.textColor = new Color('#FFFFFF');
  }

  const usdPriceText = priceUSDStack.addText(usdPrice);
  usdPriceText.font = Font.systemFont(16);
  usdPriceText.textColor = new Color('#888888');
}

async function getTokenPriceInfo() {
  const url = 'https://backend2.euclabs.net/kadena-indexer/v1/account/zV4AcMr1UcqDswRfSh6tzmpsmx7hWg5o0IYns0ZuN1I'
  const req = new Request(url)
  const apiResult = await req.loadJSON();
  return { price: (apiResult['assets'][0].totalBalance / apiResult['assets'][1].totalBalance).toFixed(4) };
}

async function getUSDExchangeRate() {
  const url = 'https://api.coinbase.com/v2/exchange-rates?currency=KDA';
  const req = new Request(url);
  const apiResult = await req.loadJSON();
  return apiResult['data']['rates']['USD'];
}

async function loadImage(imgUrl) {
  const req = new Request(imgUrl);
  return await req.loadImage();
}

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
