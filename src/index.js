require('dotenv').config()
require('console.table')
const express = require('express')
const path = require('path')
const player = require('play-sound')(opts = {})
const http = require('http')
const cors = require('cors')
const Web3 = require('web3')
const axios = require('axios')
const moment = require('moment-timezone')
const numeral = require('numeral')
const _ = require('lodash')

// SERVER CONFIG
const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors({credentials: true, origin: '*'}))

// WEB3 CONFIG
const web3 = new Web3(process.env.RPC_URL)
web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY)

// SMART CONTRACTS
const ONE_SPLIT_ABI = [{"inputs":[{"internalType":"contract IOneSplit","name":"impl","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newImpl","type":"address"}],"name":"ImplementationUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_AAVE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_BANCOR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_BDAI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_CHAI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_COMPOUND","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_CURVE_BINANCE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_CURVE_COMPOUND","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_CURVE_SYNTHETIX","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_CURVE_USDT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_CURVE_Y","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_FULCRUM","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_IEARN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_KYBER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_OASIS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_SMART_TOKEN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_UNISWAP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_WETH","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_ENABLE_KYBER_BANCOR_RESERVE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_ENABLE_KYBER_OASIS_RESERVE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_ENABLE_KYBER_UNISWAP_RESERVE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_ENABLE_MULTI_PATH_DAI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_ENABLE_MULTI_PATH_ETH","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_ENABLE_MULTI_PATH_USDC","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_ENABLE_UNISWAP_COMPOUND","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IERC20","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimAsset","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"contract IERC20","name":"fromToken","type":"address"},{"internalType":"contract IERC20","name":"toToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"parts","type":"uint256"},{"internalType":"uint256","name":"featureFlags","type":"uint256"}],"name":"getExpectedReturn","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"},{"internalType":"uint256[]","name":"distribution","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"oneSplitImpl","outputs":[{"internalType":"contract IOneSplit","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IOneSplit","name":"impl","type":"address"}],"name":"setNewImpl","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IERC20","name":"fromToken","type":"address"},{"internalType":"contract IERC20","name":"toToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturn","type":"uint256"},{"internalType":"uint256[]","name":"distribution","type":"uint256[]"},{"internalType":"uint256","name":"featureFlags","type":"uint256"}],"name":"swap","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
const ONE_SPLIT_ADDRESS = "0xC586BeF4a0992C495Cf22e1aeEE4E446CECDee0E"
const oneSplitContract = new web3.eth.Contract(ONE_SPLIT_ABI, ONE_SPLIT_ADDRESS);

const ERC_20_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]

const ZRX_EXCHANGE_ADDRESS = '0x61935CbDd02287B511119DDb11Aeb42F1593b7Ef'
const ZRX_EXCHANGE_ABI = [{"inputs":[{"internalType":"uint256","name":"chainId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes4","name":"id","type":"bytes4"},{"indexed":false,"internalType":"address","name":"assetProxy","type":"address"}],"name":"AssetProxyRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"makerAddress","type":"address"},{"indexed":true,"internalType":"address","name":"feeRecipientAddress","type":"address"},{"indexed":false,"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"indexed":false,"internalType":"address","name":"senderAddress","type":"address"},{"indexed":true,"internalType":"bytes32","name":"orderHash","type":"bytes32"}],"name":"Cancel","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"makerAddress","type":"address"},{"indexed":true,"internalType":"address","name":"orderSenderAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"orderEpoch","type":"uint256"}],"name":"CancelUpTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"makerAddress","type":"address"},{"indexed":true,"internalType":"address","name":"feeRecipientAddress","type":"address"},{"indexed":false,"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"},{"indexed":true,"internalType":"bytes32","name":"orderHash","type":"bytes32"},{"indexed":false,"internalType":"address","name":"takerAddress","type":"address"},{"indexed":false,"internalType":"address","name":"senderAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"name":"Fill","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldProtocolFeeCollector","type":"address"},{"indexed":false,"internalType":"address","name":"updatedProtocolFeeCollector","type":"address"}],"name":"ProtocolFeeCollectorAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldProtocolFeeMultiplier","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"updatedProtocolFeeMultiplier","type":"uint256"}],"name":"ProtocolFeeMultiplier","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"signerAddress","type":"address"},{"indexed":true,"internalType":"address","name":"validatorAddress","type":"address"},{"indexed":false,"internalType":"bool","name":"isApproved","type":"bool"}],"name":"SignatureValidatorApproval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"transactionHash","type":"bytes32"}],"name":"TransactionExecution","type":"event"},{"constant":true,"inputs":[],"name":"EIP1271_MAGIC_VALUE","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"EIP712_EXCHANGE_DOMAIN_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowedValidators","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"}],"name":"batchCancelOrders","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"signerAddress","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct LibZeroExTransaction.ZeroExTransaction[]","name":"transactions","type":"tuple[]"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"batchExecuteTransactions","outputs":[{"internalType":"bytes[]","name":"","type":"bytes[]"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"},{"internalType":"uint256[]","name":"takerAssetFillAmounts","type":"uint256[]"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"batchFillOrKillOrders","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults[]","name":"fillResults","type":"tuple[]"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"},{"internalType":"uint256[]","name":"takerAssetFillAmounts","type":"uint256[]"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"batchFillOrders","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults[]","name":"fillResults","type":"tuple[]"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"},{"internalType":"uint256[]","name":"takerAssetFillAmounts","type":"uint256[]"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"batchFillOrdersNoThrow","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults[]","name":"fillResults","type":"tuple[]"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"leftOrders","type":"tuple[]"},{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"rightOrders","type":"tuple[]"},{"internalType":"bytes[]","name":"leftSignatures","type":"bytes[]"},{"internalType":"bytes[]","name":"rightSignatures","type":"bytes[]"}],"name":"batchMatchOrders","outputs":[{"components":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults[]","name":"left","type":"tuple[]"},{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults[]","name":"right","type":"tuple[]"},{"internalType":"uint256","name":"profitInLeftMakerAsset","type":"uint256"},{"internalType":"uint256","name":"profitInRightMakerAsset","type":"uint256"}],"internalType":"struct LibFillResults.BatchMatchedFillResults","name":"batchMatchedFillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"leftOrders","type":"tuple[]"},{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"rightOrders","type":"tuple[]"},{"internalType":"bytes[]","name":"leftSignatures","type":"bytes[]"},{"internalType":"bytes[]","name":"rightSignatures","type":"bytes[]"}],"name":"batchMatchOrdersWithMaximalFill","outputs":[{"components":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults[]","name":"left","type":"tuple[]"},{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults[]","name":"right","type":"tuple[]"},{"internalType":"uint256","name":"profitInLeftMakerAsset","type":"uint256"},{"internalType":"uint256","name":"profitInRightMakerAsset","type":"uint256"}],"internalType":"struct LibFillResults.BatchMatchedFillResults","name":"batchMatchedFillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"order","type":"tuple"}],"name":"cancelOrder","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"targetOrderEpoch","type":"uint256"}],"name":"cancelOrdersUpTo","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"cancelled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentContextAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"detachProtocolFeeCollector","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"signerAddress","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct LibZeroExTransaction.ZeroExTransaction","name":"transaction","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"executeTransaction","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"order","type":"tuple"},{"internalType":"uint256","name":"takerAssetFillAmount","type":"uint256"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"fillOrKillOrder","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"fillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"order","type":"tuple"},{"internalType":"uint256","name":"takerAssetFillAmount","type":"uint256"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"fillOrder","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"fillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"filled","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"assetProxyId","type":"bytes4"}],"name":"getAssetProxy","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"order","type":"tuple"}],"name":"getOrderInfo","outputs":[{"components":[{"internalType":"uint8","name":"orderStatus","type":"uint8"},{"internalType":"bytes32","name":"orderHash","type":"bytes32"},{"internalType":"uint256","name":"orderTakerAssetFilledAmount","type":"uint256"}],"internalType":"struct LibOrder.OrderInfo","name":"orderInfo","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"},{"internalType":"address","name":"signerAddress","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"isValidHashSignature","outputs":[{"internalType":"bool","name":"isValid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"order","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"isValidOrderSignature","outputs":[{"internalType":"bool","name":"isValid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"components":[{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"signerAddress","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct LibZeroExTransaction.ZeroExTransaction","name":"transaction","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"isValidTransactionSignature","outputs":[{"internalType":"bool","name":"isValid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"},{"internalType":"uint256","name":"makerAssetFillAmount","type":"uint256"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"marketBuyOrdersFillOrKill","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"fillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"},{"internalType":"uint256","name":"makerAssetFillAmount","type":"uint256"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"marketBuyOrdersNoThrow","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"fillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"},{"internalType":"uint256","name":"takerAssetFillAmount","type":"uint256"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"marketSellOrdersFillOrKill","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"fillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"},{"internalType":"uint256","name":"takerAssetFillAmount","type":"uint256"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"marketSellOrdersNoThrow","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"fillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"leftOrder","type":"tuple"},{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"rightOrder","type":"tuple"},{"internalType":"bytes","name":"leftSignature","type":"bytes"},{"internalType":"bytes","name":"rightSignature","type":"bytes"}],"name":"matchOrders","outputs":[{"components":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"left","type":"tuple"},{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"right","type":"tuple"},{"internalType":"uint256","name":"profitInLeftMakerAsset","type":"uint256"},{"internalType":"uint256","name":"profitInRightMakerAsset","type":"uint256"}],"internalType":"struct LibFillResults.MatchedFillResults","name":"matchedFillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"leftOrder","type":"tuple"},{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"rightOrder","type":"tuple"},{"internalType":"bytes","name":"leftSignature","type":"bytes"},{"internalType":"bytes","name":"rightSignature","type":"bytes"}],"name":"matchOrdersWithMaximalFill","outputs":[{"components":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"left","type":"tuple"},{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"right","type":"tuple"},{"internalType":"uint256","name":"profitInLeftMakerAsset","type":"uint256"},{"internalType":"uint256","name":"profitInRightMakerAsset","type":"uint256"}],"internalType":"struct LibFillResults.MatchedFillResults","name":"matchedFillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"orderEpoch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"preSign","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"address","name":"","type":"address"}],"name":"preSigned","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"protocolFeeCollector","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"protocolFeeMultiplier","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"assetProxy","type":"address"}],"name":"registerAssetProxy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"updatedProtocolFeeCollector","type":"address"}],"name":"setProtocolFeeCollectorAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"updatedProtocolFeeMultiplier","type":"uint256"}],"name":"setProtocolFeeMultiplier","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"validatorAddress","type":"address"},{"internalType":"bool","name":"approval","type":"bool"}],"name":"setSignatureValidatorApproval","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes[]","name":"assetData","type":"bytes[]"},{"internalType":"address[]","name":"fromAddresses","type":"address[]"},{"internalType":"address[]","name":"toAddresses","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"simulateDispatchTransferFromCalls","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"transactionsExecuted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
const zrxExchangeContract = new web3.eth.Contract(ZRX_EXCHANGE_ABI, ZRX_EXCHANGE_ADDRESS)

const TRADER_ABI = [{"constant":false,"inputs":[],"name":"getWeth","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_distribution","type":"uint256[]"}],"name":"oneSplitSwap","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"SAI","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"currencies","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_fromToken","type":"address"},{"name":"_toToken","type":"address"},{"name":"_fromAmount","type":"uint256"},{"name":"_0xData","type":"bytes"},{"name":"_1SplitMinReturn","type":"uint256"},{"name":"_1SplitDistribution","type":"uint256[]"}],"name":"trade","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"}],"name":"withdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"USDC","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"","type":"address"},{"components":[{"name":"owner","type":"address"},{"name":"number","type":"uint256"}],"name":"","type":"tuple"},{"name":"data","type":"bytes"}],"name":"callFunction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"WETH","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"}],"name":"tokenToMarketId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_calldataHexString","type":"bytes"}],"name":"zrxSwap","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"loan","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"flashToken","type":"address"},{"name":"flashAmount","type":"uint256"},{"name":"arbToken","type":"address"},{"name":"zrxData","type":"bytes"},{"name":"oneSplitMinReturn","type":"uint256"},{"name":"oneSplitDistribution","type":"uint256[]"}],"name":"getFlashloan","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"approveWeth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_fromToken","type":"address"},{"name":"_toToken","type":"address"},{"name":"_fromAmount","type":"uint256"},{"name":"_0xData","type":"bytes"},{"name":"_1SplitMinReturn","type":"uint256"},{"name":"_1SplitDistribution","type":"uint256[]"}],"name":"arb","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"DAI","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]
const TRADER_ADDRESS = process.env.CONTRACT_ADDRESS

const traderContract = new web3.eth.Contract(TRADER_ABI, TRADER_ADDRESS);
const FILL_ORDER_ABI = {"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"order","type":"tuple"},{"internalType":"uint256","name":"takerAssetFillAmount","type":"uint256"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"fillOrder","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"fillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"}


// ESCHANGE NAMES
const ZERO_X = '0x'
const ONE_SPLIT = '1Split'


// ASSET SYMBOLS
const DAI = 'DAI'
const WETH = 'WETH'
const AMPL = 'AMPL'
const NEXO = 'NEXO'
const ZRX = 'ZRX'
const WCELO = 'WCELO'
const OXT = 'OXT'
const KEEP = 'KEEP'
const WBTC = 'WBTC'
const TBTC = 'TBCT'
const MKR = 'MKR'
const COMP = 'COMP'
const INCH = 'INCH'
const LRC = 'LRC'

// ASSET ADDRESSES
const ASSET_ADDRESSES = {
  DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
  WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  AMPL: '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
  NEXO: '0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206',
  ZRX: '0xe41d2489571d322189246dafa5ebde1f4699f498',
  WCELO: '0xe452e6ea2ddeb012e20db73bf5d3863a3ac8d77a',
  KEEP: '0x85eee30c52b0b379b046fb0f85f4f3dc3009afec',
  OXT: '0x4575f41308EC1483f3d399aa9a2826d74Da13Deb',
  WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  TBTC: '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa',
  MKR: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
  COMP: '0xc00e94cb662c3520282e6f5717214004a7f26888',
  INCH: '0x111111111117dc0aa78b770fa6a738034120c302',
  LRC: '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd'
}


// DISPLAY LOGIC
tokensWithDecimalPlaces = (amount, symbol) => {
  amount = amount.toString()
  switch (symbol) {
    case DAI: // 18 decimals
      return web3.utils.fromWei(amount, 'Ether')
    default:
      return web3.utils.fromWei(amount, 'Ether')
  }
}

const TOKEN_DISPLAY_DECIMALS = 2 // Show 2 decimal places
const displayTokens = (amount, symbol) => {
  let tokens
  tokens = tokensWithDecimalPlaces(amount, symbol)
  return(tokens)
}


// UTILITIES
const now = () => (moment().tz('America/Chicago').format())

const SOUND_FILE = 'ding.mp3'
const playSound = () => {
  player.play(SOUND_FILE, function(err){
    if(err) {
      console.log("Error playing sound!")
    }
  })
}


// FORMATTERS
const toTokens = (tokenAmount, symbol) => {
  switch (symbol) {
    case DAI: // 18 decimals
      return web3.utils.toWei(tokenAmount, 'Ether')
    case WETH: // 18 decimals
      return web3.utils.toWei(tokenAmount, 'Ether')
    case USDC: // 6 decimals
      return web3.utils.fromWei(web3.utils.toWei(tokenAmount), 'Szabo')
  }
}


// TRADING FUNCTIONS
const ONE_SPLIT_PARTS = 10
const ONE_SPLIT_FLAGS = 0
async function fetchOneSplitData(args) {
  const { fromToken, toToken, amount } = args
  const data = await oneSplitContract.methods.getExpectedReturn(fromToken, toToken, amount, ONE_SPLIT_PARTS, ONE_SPLIT_FLAGS).call()
  return(data)
}

// CHECK TO SEE IF ORDER CAN BE ARBITRAGED
const checkedOrders = []
let profitableArbFound = false
async function checkArb(args) {
  const { zrxOrder, assetOrder } = args

  // Track order
  const tempOrderID = JSON.stringify(zrxOrder)

  // Skip if order checked
  if(checkedOrders.includes(tempOrderID)) {
    // console.log('Order already checked')
    return // Don't log
  }

  // Add to checked orders
  checkedOrders.push(tempOrderID)

  // Skip if Maker Fee
  if(zrxOrder.makerFee.toString() !== '0') {
    console.log('Order has maker fee')
    return
  }

  // Skip if Taker Fee
  if(zrxOrder.takerFee.toString() !== '0') {
    console.log('Order has taker fee')
    return
  }

  // This becomes the input amount
  const inputAssetAmount = zrxOrder.takerAssetAmount

  // Build order tuple
  const orderTuple = [
    zrxOrder.makerAddress,
    zrxOrder.takerAddress,
    zrxOrder.feeRecipientAddress,
    zrxOrder.senderAddress,
    zrxOrder.makerAssetAmount,
    zrxOrder.takerAssetAmount,
    zrxOrder.makerFee,
    zrxOrder.takerFee,
    zrxOrder.expirationTimeSeconds,
    zrxOrder.salt,
    zrxOrder.makerAssetData,
    zrxOrder.takerAssetData,
    zrxOrder.makerFeeAssetData,
    zrxOrder.takerFeeAssetData
  ]

  // Fetch order status
  const orderInfo = await zrxExchangeContract.methods.getOrderInfo(orderTuple).call()

  // Skip order if it's been partially filled
  if(orderInfo.orderTakerAssetFilledAmount.toString() !== '0') {
    console.log('Order partially filled')
    return
  }

  // Fetch 1Split Data
  const oneSplitData = await fetchOneSplitData({
    fromToken: ASSET_ADDRESSES[assetOrder[1]],
    toToken: ASSET_ADDRESSES[assetOrder[2]],
    amount: zrxOrder.makerAssetAmount,
  })

  // This becomes the outputAssetAmount
  const outputAssetAmount = oneSplitData.returnAmount

  // Calculate estimated gas cost
  let estimatedGasFee = process.env.ESTIMATED_GAS.toString() * web3.utils.toWei(process.env.GAS_PRICE.toString(), 'Gwei')
  estimatedGasFee = web3.utils.fromWei(estimatedGasFee.toString(), 'Ether')

  // Calculate net profit
  let netProfit = outputAssetAmount - inputAssetAmount - estimatedGasFee
  netProfit = Math.floor(netProfit) // Round down

  // Determine if profitable
  const profitable = netProfit.toString() > '0'

  // If profitable, then stop looking and trade!
  if(profitable) {
    // Skip if another profitable arb has already been found
    if(profitableArbFound) {
      return
    }

    // Tell the app that a profitable arb has been found
    profitableArbFound = true

    // Log the arb
    console.table([{
      'Profitable?': profitable,
      'Asset Order': assetOrder.join(', '),
      'Exchange Order': 'ZRX, 1Split',
      'Input':  displayTokens(inputAssetAmount, assetOrder[0]).padEnd(22, ' '),
      'Output': displayTokens(outputAssetAmount, assetOrder[0]).padEnd(22, ' '),
      'Profit': displayTokens(netProfit.toString(), assetOrder[0]).padEnd(22, ' '),
      'Timestamp': now(),
    }])

    // Play alert tone
    playSound()

    // Call arb contract
    await trade(assetOrder[0], ASSET_ADDRESSES[assetOrder[0]], ASSET_ADDRESSES[assetOrder[1]], zrxOrder, inputAssetAmount, oneSplitData)
  }
}


// TRADE EXECUTION
async function trade(flashTokenSymbol, flashTokenAddress, arbTokenAddress, orderJson, fillAmount, oneSplitData) {
  const FLASH_AMOUNT = toTokens('10000', flashTokenSymbol) // 10,000 WETH
  const FROM_TOKEN = flashTokenAddress // WETH
  const FROM_AMOUNT = fillAmount // '1000000'
  const TO_TOKEN = arbTokenAddress

  const ONE_SPLIT_SLIPPAGE = '0.995'

  const orderTuple = [
    orderJson.makerAddress,
    orderJson.takerAddress,
    orderJson.feeRecipientAddress ,
    orderJson.senderAddress ,
    orderJson.makerAssetAmount ,
    orderJson.takerAssetAmount ,
    orderJson.makerFee ,
    orderJson.takerFee ,
    orderJson.expirationTimeSeconds ,
    orderJson.salt ,
    orderJson.makerAssetData ,
    orderJson.takerAssetData ,
    orderJson.makerFeeAssetData ,
    orderJson.takerFeeAssetData
  ]

  // Format ZRX function call data
  const takerAssetFillAmount = FROM_AMOUNT
  const signature = orderJson.signature
  const data = web3.eth.abi.encodeFunctionCall(FILL_ORDER_ABI, [orderTuple, takerAssetFillAmount, signature])

  const minReturn = oneSplitData.returnAmount
  const distribution = oneSplitData.distribution

  // Calculate slippage
  const minReturnWtihSplippage = minReturnWithSlippage = (new web3.utils.BN(minReturn)).mul(new web3.utils.BN('995')).div(new web3.utils.BN('1000')).toString()

  // Perform Trade
  receipt = await traderContract.methods.getFlashloan(
    flashTokenAddress, // address flashToken,
    FLASH_AMOUNT, // uint256 flashAmount,
    arbTokenAddress, // address arbToken,
    data, // bytes calldata zrxData,
    minReturnWtihSplippage.toString(), // uint256 oneSplitMinReturn,
    distribution, // uint256[] calldata oneSplitDistribution
  ).send({
    from: process.env.ADDRESS,
    gas: process.env.GAS_LIMIT,
    gasPrice: web3.utils.toWei(process.env.GAS_PRICE, 'Gwei')
  })
  console.log(receipt)
}

// FETCH ORDERBOOK
// https://0x.org/docs/api#get-srav3orderbook
// Bids will be sorted in descending order by price
async function checkOrderBook(baseAssetSymbol, quoteAssetSymbol) {
  const baseAssetAddress = ASSET_ADDRESSES[baseAssetSymbol].substring(2,42)
  const quoteAssetAddress = ASSET_ADDRESSES[quoteAssetSymbol].substring(2,42)
  const zrxResponse = await axios.get(`https://api.0x.org/sra/v3/orderbook?baseAssetData=0xf47261b0000000000000000000000000${baseAssetAddress}&quoteAssetData=0xf47261b0000000000000000000000000${quoteAssetAddress}&perPage=1000`)
  const zrxData = zrxResponse.data

  const bids = zrxData.bids.records
  bids.map((o) => {
    checkArb({ zrxOrder: o.order, assetOrder: [baseAssetSymbol, quoteAssetSymbol, baseAssetSymbol] }) // E.G. WETH, DAI, WETH
  })
}

// CHECK MARKETS
let checkingMarkets = false
async function checkMarkets() {
  if(checkingMarkets) {
    return
  }

  // Stop checking markets if already found
  if(profitableArbFound) {
    clearInterval(marketChecker)
  }

  console.log(`Fetching market data @ ${now()} ...\n`)
  checkingMarkets = true
  try {
    await checkOrderBook(WETH, DAI)
    await checkOrderBook(WETH, AMPL)
    await checkOrderBook(WETH, NEXO)
    await checkOrderBook(WETH, ZRX)
    await checkOrderBook(WETH, WCELO)
    await checkOrderBook(WETH, KEEP)
    await checkOrderBook(WETH, OXT)
    await checkOrderBook(WETH, WBTC)
    await checkOrderBook(WETH, TBTC)
    await checkOrderBook(WETH, MKR)
    await checkOrderBook(WETH, COMP)
    await checkOrderBook(WETH, INCH)
    await checkOrderBook(WETH, LRC)
    await checkOrderBook(DAI, WETH)
    await checkOrderBook(DAI, AMPL)
    await checkOrderBook(DAI, NEXO)
    await checkOrderBook(DAI, WCELO)
  } catch (error) {
    console.error(error)
    checkingMarkets = false
    return
  }

  checkingMarkets = false
}

// RUN APP
playSound()

// Check markets every n seconds
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 3000 // 3 seconds
const marketChecker = setInterval(async () => { await checkMarkets() }, POLLING_INTERVAL)
