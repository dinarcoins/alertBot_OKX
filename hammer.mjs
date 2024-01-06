import ccxt from 'ccxt';

// Function to detect Hammer pattern
const detectHammer = (pattern) => {
  // Define the characteristics of a Hammer pattern
  const bodyToTotalLengthRatio = 0.2; // Adjust as needed
  const lowerShadowToTotalLengthRatio = 2; // Adjust as needed

  // Get the characteristics of the current candle
  const totalLength = pattern.high - pattern.low;
  const bodyLength = Math.abs(pattern.open - pattern.close);
  const upperShadowLength = pattern.high - Math.max(pattern.open, pattern.close);
  const lowerShadowLength = Math.min(pattern.open, pattern.close) - pattern.low;

  // Check if the pattern matches the criteria for a Hammer
  const isHammer =
    bodyLength <= bodyToTotalLengthRatio * totalLength &&
    lowerShadowLength >= lowerShadowToTotalLengthRatio * bodyLength &&
    upperShadowLength <= 0.1 * totalLength; // You can adjust the upper shadow ratio
    console.log('isHammer', isHammer);
  return isHammer;
};



// Function to fetch historical OHLCV data
const fetchHistoricalData = async (symbol, timeframe, limit) => {
  const exchange = new ccxt.okx(); // Replace with your exchange
  const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
  return ohlcv.map(data => ({
    timestamp: data[0],
    open: data[1],
    high: data[2],
    low: data[3],
    close: data[4],
    volume: data[5],
  }));
};

// Example usage
const main = async () => {
  const symbol = 'BTC/USDT';
  const timeframe = '1h';
  const limit = 100; // Number of candles to fetch

  const historicalData = await fetchHistoricalData(symbol, timeframe, limit);

  // Iterate through historical data and detect Hammer patterns
  historicalData.forEach((currentCandle, index) => {
    const isHammer = detectHammer(currentCandle);

    if (isHammer) {
      console.log(`Hammer pattern detected at timestamp ${currentCandle.timestamp}`);
    }
  });
};

// Run the example
main();
