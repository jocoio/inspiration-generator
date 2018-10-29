// var image = null;
var pixels = null;
var image = null;
var DIMENSION_MAX = 256;

// Main function
function getImage() {

  image = new Image();
  image.onload = function () {
    run();
    runHistogram();
  };
  image.src = document.getElementById("original-image").src + '?' + new Date().getTime();
  image.setAttribute('crossOrigin', '');
}

// 2. Map image to collection of pixels
function run() {
  var imgWidth = image.width;
  var imgHeight = image.height;
  var maxDimension = imgWidth > imgHeight ? imgWidth : imgHeight;

  var scale = maxDimension / 100;
  var canvasHeight = parseInt(imgHeight / scale);
  var canvasWidth = parseInt(imgWidth / scale);

  var canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.getContext('2d').drawImage(image, 0, 0, canvasWidth, canvasHeight);

  pixels = [];
  for (var x = 0; x < canvas.width; x++) {
    for (var y = 0; y < canvas.height; y++) {
      var pixel = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
      pixels.push({
        red: pixel[0],
        green: pixel[1],
        blue: pixel[2]
      });
    }
  }
}

// 3. run historgram and create palette with pixel data
function runHistogram() {
  removePaletteTable("#histogram-palette");
  $("#histogram-output").hide();
  var histogramInputValue = 3;

  let histogramPaletteBuilder = new HistogramPaletteBuilder();
  bucketedPixelInfos = histogramPaletteBuilder.binPixels(pixels, histogramInputValue);

  var bucketsInPalette = _.take(bucketedPixelInfos.buckets, 10);
  PaletteTableWriter.drawPaletteTable("#histogram-palette", bucketsInPalette);

  $("#histogram-output").show();
}

function removePaletteTable(containerId) {
  $(containerId).empty();
}

class ImageUtil {
  static rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h, s, l];
  }


  static getPixelLuminance(pixel) {
    return (pixel.red * 0.2126) + (pixel.green * 0.7152) + (pixel.blue * 0.0722);
  }

  static pixelToString(pixel) {
    return "r: " + pixel.red + ", g: " + pixel.green + ", b: " + pixel.blue;
  }

  static numberToPaddedHexString(number) {
    var hexString = parseInt(number).toString(16);
    if (hexString.length == 1) {
      return "0" + hexString;
    }
    return hexString
  }

  static pixelToHexString(pixel) {
    var hexString = "#" +
      ImageUtil.numberToPaddedHexString(pixel.red) +
      ImageUtil.numberToPaddedHexString(pixel.green) +
      ImageUtil.numberToPaddedHexString(pixel.blue);
    return hexString;
  }

  static getColorPreviewHtmlString(color) {
    var color = ImageUtil.pixelToHexString(color);
    return "<div class=\"colorPreview\" style=\"background:" +
      color +
      ";height:40px;color:white;padding:10px" + "\">" +
      color +
      "</div>";
  }

  static computeAverageColor(pixels) {
    var totalRed = _.chain(pixels)
      .map(function (p) { return p.red; })
      .sum()
      .value();
    var totalGreen = _.chain(pixels)
      .map(function (p) { return p.green; })
      .sum()
      .value();
    var totalBlue = _.chain(pixels)
      .map(function (p) { return p.blue; })
      .sum()
      .value();
    return {
      red: (totalRed / pixels.length),
      green: (totalGreen / pixels.length),
      blue: (totalBlue / pixels.length)
    };
  }

}

class HistogramPaletteBuilder {

  getKeyForPixel(pixel, bucketsPerDimension) {
    var bucketSize = DIMENSION_MAX / bucketsPerDimension;
    var redBucket = Math.floor(pixel.red / bucketSize);
    var greenBucket = Math.floor(pixel.green / bucketSize);
    var blueBucket = Math.floor(pixel.blue / bucketSize);
    var key = redBucket + ":" + greenBucket + ":" + blueBucket;
    return key;
  }

  binPixels(pixels, bucketsPerDimension) {
    let bucketMap = {};
    _.each(pixels, (pixel) => {
      let key = this.getKeyForPixel(pixel, bucketsPerDimension);
      if (key in bucketMap) {
        bucketMap[key].push(pixel);
      } else {
        bucketMap[key] = [pixel];
      }
    });

    // sort buckets
    let buckets = _.values(bucketMap);
    let sortedBuckets = _.sortBy(buckets, (bucket) => { return bucket.length; }).reverse();

    let bucketColors = _.map(pixels, (p, index) => {
      let key = this.getKeyForPixel(p, bucketsPerDimension);
      let pixelsInBucket = bucketMap[key];
      let averageColor = ImageUtil.computeAverageColor(pixelsInBucket);
      return averageColor;
    });

    return {
      buckets: sortedBuckets,
      colors: bucketColors
    };
  }
}

class PaletteTableWriter {

  static drawPaletteTable(containerId, pixelGroups) {
    var paletteTableString = "";

    // Table Header
    paletteTableString += "<tr>";
    paletteTableString += "<th>Color Code</th>";
    paletteTableString += "<th>Percent</th>";
    paletteTableString += "</tr>";

    var totalPixels = _.chain(pixelGroups)
      .map(function (b) { return b.length; })
      .sum()
      .value();

    pixelGroups = _.sortBy(pixelGroups, function (pg) {
      var averageColor = ImageUtil.computeAverageColor(pg);
      var hsl = ImageUtil.rgbToHsl(averageColor.red, averageColor.green, averageColor.blue);
      return hsl[0];
    }).reverse();

    _.each(pixelGroups, function (group) {
      var averageColor = ImageUtil.computeAverageColor(group);
      var percent = group.length / totalPixels;
      paletteTableString += "<tr>";
      paletteTableString += "<td>";
      paletteTableString += ImageUtil.getColorPreviewHtmlString(averageColor);
      paletteTableString += "</td>";
      paletteTableString += "<td>";
      paletteTableString += (percent * 100).toFixed(2);
      paletteTableString += "</td>";
      paletteTableString += "</tr>";
    });
    $(containerId).append("<table class=\"table\">" + paletteTableString + "</table");
    $(containerId).show();
  }
}