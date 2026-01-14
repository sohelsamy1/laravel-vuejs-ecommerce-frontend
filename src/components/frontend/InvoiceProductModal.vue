<template>
  <div
    class="modal fade"
    tabindex="-1"
    :class="{ show: store.showInvoiceModal }"
    :style="{ display: store.showInvoiceModal ? 'block' : 'none' }"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title fs-6">Products</h6>
          <button
            type="button"
            class="btn-close"
            @click="store.closeInvoiceModal"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Loading -->
          <div v-if="store.invoiceLoading" class="text-center py-3">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <!-- Table -->
          <table v-else class="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in store.invoiceProducts" :key="i">
                <td>{{ item.product?.title }}</td>
                <td>{{ item.qty }}</td>
                <td>$ {{ item.sale_price }}</td>
              </tr>
              <tr v-if="!store.invoiceProducts.length">
                <td colspan="3" class="text-center text-muted">
                  No products found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Backdrop -->
    <!-- <div
      class="modal-backdrop fade show"
      v-if="store.showInvoiceModal"
      @click="store.closeInvoiceModal"
    ></div> -->
  </div>
</template>

<script setup>
import { useProductStore } from "../../stores/productStore";
const store = useProductStore();
</script>
