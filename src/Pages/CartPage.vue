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

          <!-- Empty / Error -->
          <div v-else-if="cartItems.length === 0" class="text-center py-5">
            <p class="text-muted mb-0">
              {{ store.cartError || "Your cart is empty." }}
            </p>
          </div>

          <!-- Table -->
          <div v-else class="table-responsive shop_cart_table">
            <table class="table align-middle cart-table">
              <thead>
                <tr>
                  <th class="text-center" style="width: 110px">Image</th>
                  <th>Product</th>

                  <!-- ✅ Qty left -->
                  <th class="text-start" style="width: 120px">Qty</th>

                  <!-- ✅ Total left -->
                  <th class="text-start" style="width: 160px">Total</th>

                  <th class="text-center" style="width: 150px">Action</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="row in cartItems" :key="rowKey(row)">
                  <td class="text-center">
                    <img
                      class="cart-img"
                      :src="row.product?.image || '/placeholder.png'"
                      alt="product"
                    />
                  </td>

                  <td>
                    <div class="fw-semibold">
                      {{ row.product?.title || row.product?.name || "N/A" }}
                    </div>
                    <small class="text-muted" v-if="row.size || row.color">
                      <span v-if="row.size">Size: {{ row.size }}</span>
                      <span v-if="row.size && row.color"> • </span>
                      <span v-if="row.color">Color: {{ row.color }}</span>
                    </small>
                  </td>

                  <td class="text-start">
                    {{ row.qty ?? 0 }}
                  </td>

                  <td class="text-start">
                    $ {{ getRowTotal(row) }}
                  </td>

                  <td class="text-center">
                    <button
                      class="btn btn-sm btn-danger px-3"
                      type="button"
                      :disabled="removingPid === getPid(row) || store.cartLoading"
                      @click="onRemoveRow(row)"
                    >
                      <span v-if="removingPid === getPid(row)">Removing...</span>
                      <span v-else>Remove</span>
                    </button>
                  </td>
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <td colspan="3" class="text-start">
                    <div class="fw-semibold">
                      Total: $ <span class="fw-bold">{{ cartTotal }}</span>
                    </div>
                  </td>

                  <td colspan="2" class="text-end">
                    <button
                      class="btn btn-line-fill btn-sm px-4"
                      type="button"
                      @click="onCheckout"
                      :disabled="store.invoiceLoading || cartItems.length === 0"
                    >
                      {{ store.invoiceLoading ? "Processing..." : "Check Out" }}
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Optional fallback modal -->
  <PaymentMethodList
    ref="modalRef"
    :methods="store.paymentMethods"
    :loading="store.invoiceLoading"
    :error="store.invoiceError"
  />
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import cogoToast from "cogo-toast";
import { useProductStore } from "../stores/productStore";
import PaymentMethodList from "../components/frontend/PaymentMethodList.vue";

const store = useProductStore();
const modalRef = ref(null);
const removingPid = ref(null);

const cartItems = computed(() =>
  Array.isArray(store.cartItems) ? store.cartItems : []
);

/**
 * ✅ IMPORTANT:
 * Backend route: GET /DeleteCartList/{product_id}
 * তাই remove করার জন্য product_id লাগবেই।
 */
const getPid = (row) => row?.product_id ?? row?.product?.id ?? null;

// stable key
const rowKey = (row) => getPid(row) ?? JSON.stringify(row);

// row total
const getRowTotal = (row) => {
  const qty = Number(row?.qty || 0);
  const price = Number(row?.price ?? row?.product?.price ?? 0);
  const total = qty * price;
  return Number.isFinite(total) ? total.toFixed(2) : "0.00";
};

// cart total
const cartTotal = computed(() => {
  const sum = cartItems.value.reduce((acc, row) => {
    const qty = Number(row?.qty || 0);
    const price = Number(row?.price ?? row?.product?.price ?? 0);
    return acc + qty * price;
  }, 0);
  return Number.isFinite(sum) ? sum.toFixed(2) : "0.00";
});

const onRemoveRow = async (row) => {
  const pid = getPid(row);

  if (!pid) {
    cogoToast.error("product_id not found in row!");
    console.log("Row debug:", row);
    return;
  }

  const ok = window.confirm("Remove this item from cart?");
  if (!ok) return;

  try {
    removingPid.value = pid;

    // ✅ store.removeFromCart expects product_id (because backend uses DeleteCartList/{product_id})
    await store.removeFromCart(pid);

    // store.removeFromCart already calls fetchCart(), but safe to call again if you want:
    // await store.fetchCart();

    cogoToast.success("Removed from cart");
  } catch (e) {
    console.error(e);
    cogoToast.error("Failed to remove item");
  } finally {
    removingPid.value = null;
  }
};

const onCheckout = async () => {
  if (cartItems.value.length === 0 || store.invoiceLoading) return;

  try {
    const res = await store.createInvoice();
    const payUrl = res?.data?.data?.paymentMethod || store.paymentUrl || "";

    if (payUrl) {
      window.location.href = payUrl;
      return;
    }

    // fallback modal
    modalRef.value?.show?.();
  } catch (e) {
    modalRef.value?.show?.();
  }
};

onMounted(async () => {
  await store.fetchCart();
});
</script>

<style scoped>
.cart-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
}

/* Qty/Total একটু left spacing */
.cart-table th.text-start,
.cart-table td.text-start {
  padding-left: 18px;
}
</style>
