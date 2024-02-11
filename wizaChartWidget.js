class LineChart {
  constructor(width, height, values) {
    this.ctx = new DrawContext();
    this.ctx.size = new Size(width, height);
    this.values = values;
  }

  _calculatePath() {
    let maxValue = Math.max(...this.values);
    let minValue = Math.min(...this.values);
    let difference = maxValue - minValue;
    let count = this.values.length;
    let step = this.ctx.size.width / (count - 1);
    let points = this.values.map((current, index) => {
      let x = step * index;
      let y = this.ctx.size.height - (current - minValue) / difference * this.ctx.size.height;
      return new Point(x, y);
    });
    return this._getSmoothPath(points);
  }

  _getSmoothPath(points) {
    let path = new Path();
    path.move(new Point(0, this.ctx.size.height));
    path.addLine(points[0]);
    for (let i = 0; i < points.length - 1; i++) {
      let xAvg = (points[i].x + points[i + 1].x) / 2;
      let yAvg = (points[i].y + points[i + 1].y) / 2;
      let avg = new Point(xAvg, yAvg);
      let cp1 = new Point((xAvg + points[i].x) / 2, points[i].y);
      let next = new Point(points[i + 1].x, points[i + 1].y);
      let cp2 = new Point((xAvg + points[i + 1].x) / 2, points[i + 1].y);
      path.addQuadCurve(avg, cp1);
      path.addQuadCurve(next, cp2);
    }
    path.addLine(new Point(this.ctx.size.width, this.ctx.size.height));
    path.closeSubpath();
    return path;
  }

  configure(fn) {
    let path = this._calculatePath();
    if (fn) {
      fn(this.ctx, path);
    } else {
      this.ctx.addPath(path);
      this.ctx.fillPath(path);
    }
    return this.ctx;
  }

  getImage() {
    return this.ctx.getImage();
  }
}

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
const headerText = headerStack.addText("$WIZA Price Chart");
headerText.font = Font.semiboldSystemFont(18);
if (isDarkTheme) {
  headerText.textColor = new Color('#FFFFFF');
}

async function buildWidget() {
  const data = await getPriceChartData();
  const chart = new LineChart(600, 200, data).configure((ctx, path) => {
    ctx.opaque = false;
    ctx.setFillColor(new Color("22c6e9", .5));
    ctx.addPath(path);
    ctx.fillPath(path);
  }).getImage();

  widget.addSpacer();
  const image = widget.addImage(chart);
}

async function getPriceChartData() {
  const url = 'https://kdswap-fd-prod-cpeabrdfgdg9hzen.z01.azurefd.net/graphql?query={price(token:"free.wiza",period:1){id,timestamp,token,priceInKda,intervalStamp}}';
  const req = new Request(url);
  const apiResult = await req.loadJSON();
  const data = apiResult['data']['price'].map(item => item.priceInKda);

  return data;
}

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentMedium();
