import ccxt from "ccxt";
import { config } from "dotenv";
config();

const apiKey = process.env.API_KEY;
const secretKey = process.env.SECRET_KEY;
const symbol = "BTC/USDT"; // Thay đổi dựa trên cặp giao dịch bạn muốn giao dịch
const interval = "1h"; // Thời kỳ nến (1 giờ trong trường hợp này)
const buyThreshold = 1.02; // Giá giảm 2% so với mức thấp nhất gần đây
const sellThreshold = 1.02; // Giá tăng 2% so với mức cao nhất gần đây

const exchange = new ccxt.okx({
  apiKey,
  secret: secretKey,
  enableRateLimit: true,
});

const calculateGridLevels = (startPrice, spacing, levels) => {
  const gridLevels = [];
  for (let i = 0; i < levels; i++) {
    const price = startPrice + i * spacing;
    gridLevels.push(price);
  }
  return gridLevels;
};

const runBot = async () => {
  while (true) {
    try {
      // Lấy lịch sử giá nến
      const gridSpacing = 10; // Khoảng cách giữa các grid
      const gridLevelsPrice = 10;
      const candles = await exchange.fetchOHLCV(symbol, interval);
      const lastCandle = candles[candles.length - 1];
      const [timestamp, open, high, low, close, volume] = lastCandle;
      const ticker = await exchange.fetchTicker(symbol);
      const currentPrice = ticker.last;

      const gridLevels = calculateGridLevels(
        currentPrice,
        gridSpacing,
        gridLevelsPrice
      );
      console.log("ticker last price", ticker.last);

      console.log("gridLevels", gridLevels);

      // for (const price of gridLevels) {
      //   const amount = 1; // Số lượng muốn mua cho mỗi cấp độ
      //   const order = await exchange.createLimitBuyOrder(symbol, amount, price);
      //   console.log(`Đặt lệnh mua tại giá ${price}:`, order);
      // }

      // Kiểm tra điều kiện mua
      if (close / low > buyThreshold) {
        console.log("Điều kiện mua được đáp ứng. Thực hiện lệnh mua.");
        // Thực hiện lệnh mua ở đây
      }

      // Kiểm tra điều kiện bán
      if (close / high > sellThreshold) {
        console.log("Điều kiện bán được đáp ứng. Thực hiện lệnh bán.");
        // Thực hiện lệnh bán ở đây
      }

      // Chờ một khoảng thời gian trước khi kiểm tra lại
      await sleep(30000);
    } catch (error) {
      console.error("Lỗi trong quá trình kiểm tra điều kiện:", error.message);
    }
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

runBot();
