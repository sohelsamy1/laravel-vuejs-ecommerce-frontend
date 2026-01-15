<template>
  <!-- Breadcrumb -->
  <div class="breadcrumb_section bg_gray page-title-mini">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6">
          <div class="page-title">
            <h1>Cart List</h1>
          </div>
        </div>
        <div class="col-md-6">
          <ol class="breadcrumb justify-content-md-end">
            <li class="breadcrumb-item">
              <router-link to="/">Home</router-link>
            </li>
            <li class="breadcrumb-item active">This Page</li>
          </ol>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-5">
    <div class="container my-5">
      <div class="row">
        <div class="col-12">

          <!-- Loading -->
          <div v-if="store.cartLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading cart...</p>
          </div>

          <!-- Error / Empty -->
          <div v-else-if="cartItems.length === 0" class="text-center py-5">
            <p class="text-muted mb-0">
              {{ store.cartError || "Your cart is empty." }}
            </p>
          </div>

          <!-- Table -->
          <div v-else class="table-responsive shop_cart_table">
            <table class="table">
              <thead>
                <tr>
                  <th class="product-thumbnail">&nbsp;</th>
                  <th class="product-name">Product</th>
                  <th class="product-quantity">Quantity</th>
                  <th class="product-subtotal">Total</th>
                  <th class="product-remove">Remove</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="row in cartItems" :key="row.product_id">
                  <td class="product-thumbnail">
                    <img
                      :src="row.product?.image || '/placeholder.png'"
                      alt="product"
                    />
                  </td>

                  <td class="product-name">
                    {{ row.product?.title || "N/A" }}
                  </td>

                  <td class="product-quantity">
                    {{ row.qty ?? 0 }}
                  </td>

                  <td class="product-subtotal">
                    $ {{ getRowTotal(row) }}
                  </td>

                  <td class="product-remove">
                    <button
                      class="btn btn-sm btn-link text-danger"
                      @click="onRemove(row.product_id)"
                    >
                      <i class="ti-close"></i>
                    </button>
                  </td>
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <td colspan="5" class="px-0">
                    <div class="row g-0 align-items-center">
                      <div class="col-lg-4 col-md-6 mb-3 mb-md-0">
                        Total: $
                        <span>{{ cartTotal }}</span>
                      </div>
                      <div class="col-lg-8 col-md-6 text-start text-md-end">
                        <button class="btn btn-line-fill btn-sm" @click="onCheckout">
                          Check Out
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import cogoToast from "cogo-toast";
import { useProductStore } from "../stores/productStore";

const store = useProductStore();

/**
 *  Safe cartItems
 */
const cartItems = computed(() => Array.isArray(store.cartItems) ? store.cartItems : []);

/**
  Safe total
 */
const cartTotal = computed(() => {
  if (store.cartTotal !== undefined && store.cartTotal !== null) {
    const t = Number(store.cartTotal || 0);
    return Number.isFinite(t) ? t.toFixed(2) : "0.00";
  }

  const sum = cartItems.value.reduce((acc, row) => {
    const qty = Number(row?.qty || 0);
     const price = Number(row?.price ?? row?.product?.price ?? 0);
    return acc + qty * price;
  }, 0);

  return sum.toFixed(2);
});

const getRowTotal = (row) => {
  const qty = Number(row?.qty || 0);
  const price = Number(row?.price ?? row?.product?.price ?? 0);
  const total = qty * price;
  return Number.isFinite(total) ? total.toFixed(2) : "0.00";
};

const onRemove = async (productId) => {
  try {
    await store.removeFromCart(productId);
    await store.fetchCart();
    cogoToast.success("Removed from cart");
  } catch (e) {
    cogoToast.error("Failed to remove item");
  }
};

const onCheckout = () => {
  cogoToast.info("Payment method page will be added later.");
};

onMounted(async () => {
  try {
    await store.fetchCart();
  } catch (e) {
      console.error(e);
  }
});
</script>
