<template>
  <v-content>
    <v-container>
      <Loading v-if="loading"></Loading>
      <Assets v-if="assets" :assets="assets"></Assets>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Assets from '~/components/organisms/Assets.vue'
import Loading from '~/components/organisms/Loading.vue'

@Component({
  components: {
    Assets,
    Loading
  }
})
export default class Index extends Vue {
  assets = null
  loading = true
  async mounted() {
    const assets = await this.getAssetDataForOwner(this.$store.state.address as string)
    const refinedOrders = await this.$satellites.getOrders()
    for (const asset of assets) {
      if (refinedOrders[asset.asset_contract.address]) {
        if (refinedOrders[asset.asset_contract.address][asset.token_id]) {
          asset.order = refinedOrders[asset.asset_contract.address][asset.token_id]
        }
      }
    }
    this.assets = assets
    this.loading = false
  }
  async getAssetDataForOwner(owner: string) {
    let assetContractAddressesQuery = ''
    if (this.$config.whitelists) {
      const base = '&asset_contract_addresses='
      for (const assetContractAddress of this.$config.whitelists) {
        assetContractAddressesQuery = assetContractAddressesQuery + base + assetContractAddress
      }
    }
    const assets = await this.$axios.get(
      `${this.$config.api}assets?owner=${owner}&asset_contract_address=${assetContractAddressesQuery}`
    )
    return assets.data.assets
  }
}
</script>
