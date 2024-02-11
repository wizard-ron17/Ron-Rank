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
  const wizaPriceUSD = wizaPriceInfo.priceUSD;
  
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
  const url = 'https://kdswap-fd-prod-cpeabrdfgdg9hzen.z01.azurefd.net/graphql?query={price(token:"free.wiza",period:1){id,timestamp,token,price,priceInKda,intervalStamp}}';
  const req = new Request(url);
  const apiResult = await req.loadJSON();
  const recentPrice = apiResult['data']['price'][0];
  return { price: recentPrice.priceInKda.toFixed(4), priceUSD: recentPrice.price.toFixed(3) };
}

async function loadImage(imgUrl) {
  const req = new Request(imgUrl);
  return await req.loadImage();
}

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
