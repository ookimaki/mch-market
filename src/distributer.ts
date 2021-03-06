import { ContractAbi, TxData, SupportedProvider } from 'ethereum-types'
import { BigNumber } from '0x.js'
import { BaseContract } from '@0x/base-contract'
import { classUtils } from '@0x/utils'

export class DistributerContract extends BaseContract {
  constructor(abi: ContractAbi, address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>) {
    super('Distributer', abi, address, supportedProvider, txDefaults)
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper'])
  }
  public fillOrder = {
    async sendTransactionAsync(
      order: {
        makerAddress: string
        takerAddress: string
        feeRecipientAddress: string
        senderAddress: string
        makerAssetAmount: BigNumber
        takerAssetAmount: BigNumber
        makerFee: BigNumber
        takerFee: BigNumber
        expirationTimeSeconds: BigNumber
        salt: BigNumber
        makerAssetData: string
        takerAssetData: string
      },
      takerAssetFillAmount: BigNumber,
      salt: BigNumber,
      orderSignature: string,
      takerSignature: string,
      feeRecipientAddresses: string[],
      feeAmountsBigNumber: BigNumber[],
      txData?: Partial<TxData> | undefined
    ): Promise<string> {
      const self = (this as any) as DistributerContract
      const encodedData = self._strictEncodeArguments(
        'fillOrder((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes),uint256,uint256,bytes,bytes,address[],uint256[])',
        [order, takerAssetFillAmount, salt, orderSignature, takerSignature, feeRecipientAddresses, feeAmountsBigNumber]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    }
  }
}
