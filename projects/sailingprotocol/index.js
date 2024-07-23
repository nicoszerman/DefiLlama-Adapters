const ADDRESSES = require('../helper/coreAssets.json')
const sdk = require('@defillama/sdk');
const axios = require('axios');

const tokens = [
  {
    "address-kava": "0x75B5DACEc8DACcb260eA47549aE882513A21CE01",
    "address-rsk": "0x91B26F71D8b6F78b7BdaDd557c20727232C4bF2c",
    "ticker": "SPY",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0x2E4763AdBEe00D5eB3089ec25973599c0e62dD07",
    // "address-rsk": "0x0000000000000000000000000000000000000000",
    "ticker": "ARKK",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0xf69eadAd0A7cE0aD62ac7AdB16338f55Fa5aEdbD",
    "address-rsk": "0xd9474AAa1DE26e2F2F6891e33C860C99E9D4c8A8",
    "ticker": "DLO",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0xD07dd056c2C2073565C992B4aC2321b6A2e4a112",
    "address-rsk": "0xDC661977F72973601621247B1F3c5E9eA624Fd38",
    "ticker": "SUPV",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0x57c1e6001519D2C7FcEE64a8e03e1bDba7A1716F",
    "address-rsk": "0x0837f2C7763B77d7b3D1DE8616edFC42a05d3aC6",
    "ticker": "AAPL",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0xfb7a9dea566381c912aC3a221595F6559bFCDEc6",
    "address-rsk": "0x6cEED18bCEdB2e29cA8dD59C7874d98eaEC5ab3b",
    "ticker": "TSLA",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0x81B841D336D984233353420d172309f321EfBc02",
    "address-rsk": "0xdE35d352E479643Dff75E2291144076Ce76497FB",
    "ticker": "META",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0xC777b949c0889094BC9A241BCFE8e9492b18824f",
    "address-rsk": "0xDf12A17abf91C225e8074D2C38e9459A109DB82E",
    "ticker": "AMZN",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0xD9aEA8D7712aA5F54EDA0982211f38ecDDa22BA1",
    "address-rsk": "0xDEde6fa58829D1d7cf03a2D32F4317588a6a7683",
    "ticker": "GME",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0xA265653185Ed26a27e93092c458b5C6a6aEF078a",
    "address-rsk": "0x4e630f665A5e911EbA14b4e850375613D6A05C06",
    "ticker": "AMC",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0x7f6b23782DC290C6758E6014e6F512E1b46f07e6",
    "address-rsk": "0x1BA24aFC90d41E86F7F722659F68F4b176e3116B",
    "ticker": "DIS",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0x7d0e7d4617B7B1a4D335e7E6Fef2f0F98Fb8D6D9",
    "address-rsk": "0x5b0c93ED5e3Ab653CC5d1dD850c4bF8C0A1260c5",
    "ticker": "MSTR",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0x019293eDC7A277F8879EC51A59E0Ffe415f6120e",
    "address-rsk": "0xB314095f4Efd9cb0e800Fc72a85878d9E3a4109B",
    "ticker": "QQQ",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0xBa5c32915e2303EA41d1986f5B3AAd0a98B4Fd80",
    "address-rsk": "0x7CF796f24e5EDE0E2bB08F1563E5ca82d07Df4ce",
    "ticker": "ETHE",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0xA78Fb2b64Ce2Fb8bBe46968cf961C5Be6eB12924",
    "address-rsk": "0xdB5A8DA127B061b3f4244F1C34EaFfFff951E1Ce",
    "ticker": "AAAU",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0x79E2174f64286Bb92c8BD00d0D8A126eAc664c27",
    "address-rsk": "0xb880773D2a4B2b2cD49E23AE3633d18644448C5D",
    "ticker": "ABNB",
    "isIndexedByDefiLlama": false,
  },
  {
    "address-kava": "0x1e01aE049Bcb76ec91aa59e11b84a01375cB19b0",
    "address-rsk": "0xDF9A2DD609334a9c4a5E7abD6c333e6C8a724875",
    "ticker": "DNA",
    "isIndexedByDefiLlama": false,
  },
];

async function tvl(api) {
  const addTokenTVL = async (token) => {
    const tokenAddress = token[`address-${api.chain}`];
    if (!tokenAddress) {
      console.error(`No address found for token ${token.ticker} on chain ${api.chain}`);
      return;
    }
    const tokenTotalSupply = await api.call({ target: tokenAddress, abi: 'erc20:totalSupply' });
    // if (api.chain === 'rsk') {
    //   console.log(tokenAddress, tokenTotalSupply);
    // }
    if (token.isIndexedByDefiLlama) {
      api.add(tokenAddress, tokenTotalSupply);
    } else {
      const tickerPricing = await axios.post(
        'https://sailingprotocol.org/api/sailingprotocol/market_data/historical_intraday',
        {
          ticker: token.ticker
        }
      );
      const tickerPrice = Object.values(tickerPricing.data).pop(); // latest price
      const decimalsOfUsdt = api.chain === 'kava' ? 1e6 : 1e18;
      api.add(
        api.chain === 'kava' ? ADDRESSES.kava.USDt : ADDRESSES.rsk.rUSDT,
        tokenTotalSupply * tickerPrice * (decimalsOfUsdt / 1e18)
      );
    }
  };
  const promises = [];
  for (const token of tokens) {
    promises.push(addTokenTVL(token));
  }
  await Promise.all(promises);
}

module.exports = {
  misrepresentedTokens: true, // false, // until all tokens are indexed by defillama
  timetravel: false, // true, // until there is enough dex liquidity for the main tokens
  kava: { tvl, },
  rsk: { tvl, },
  methodology: 'The total supply of their circulating stocks is extracted from their stock token contracts.'
}
