<template>
  <!-- Breadcrumb Section -->
  <div class="breadcrumb_section bg_gray page-title-mini">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6">
          <div class="page-title">
            <h1>Orders</h1>
          </div>
        </div>
        <div class="col-md-6">
          <ol class="breadcrumb justify-content-md-end">
            <li class="breadcrumb-item">
              <router-link to="/">Home</router-link>
            </li>
            <li class="breadcrumb-item active">Orders</li>
          </ol>
        </div>
      </div>
    </div>
  </div>

  <!-- Navigation Tabs -->
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <ul class="nav nav-tabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              @click="navigateToProfile"
              class="nav-link"
              :class="{ active: $route.path === '/profile' }"
              type="button"
            >
              Profile
            </button>
          </li>

          <li class="nav-item" role="presentation">
            <button
              @click="navigateToOrders"
              class="nav-link"
              :class="{ active: $route.path === '/orders' }"
              type="button"
            >
              Orders
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Orders Content -->
  <div class="mt-5">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-12 col-lg-12">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Payable</th>
                  <th>Shipping</th>
                  <th>Delivery</th>
                  <th>Payment</th>
                  <th>More</th>
                </tr>
              </thead>

              <!-- ✅ Loading (FIXED) -->
              <tbody v-if="store.ordersLoading">
                <tr>
                  <td colspan="6" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status"></div>
                  </td>
                </tr>
              </tbody>

              <!-- ✅ Error -->
              <tbody v-else-if="store.ordersError">
                <tr>
                  <td colspan="6" class="text-center text-danger py-4">
                    {{ store.ordersError }}
                  </td>
                </tr>
              </tbody>

              <!-- ✅ Empty -->
              <tbody v-else-if="!orders.length">
                <tr>
                  <td colspan="6" class="text-center text-muted py-4">
                    No orders found
                  </td>
                </tr>
              </tbody>

              <!-- ✅ Rows -->
              <tbody v-else>
                <tr v-for="(order, i) in orders" :key="order.id || i">
                  <td>{{ i + 1 }}</td>

                  <!-- Payable -->
                  <td>
                    $ {{ formatMoney(order.total ?? order.payable ?? order.grand_total ?? 0) }}
                  </td>

                  <!-- Shipping -->
                  <td>{{ order.ship_details || order.shipping_address || "N/A" }}</td>

                  <!-- Delivery -->
                  <td>{{ order.delivery_status || order.delivery || "N/A" }}</td>

                  <!-- Payment -->
                  <td>{{ order.payment_status || order.payment || "N/A" }}</td>

                  <td>
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="openProducts(order)"
                      :disabled="store.invoiceLoader"
                    >
                      {{ store.invoiceLoader ? "Loading..." : "View Products" }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ✅ Optional: small hint -->
          <p v-if="!store.ordersLoading && orders.length" class="text-muted small mb-0">
            Showing {{ orders.length }} order(s)
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <InvoiceProductModal />

  <TopBrands />
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "../stores/productStore";
import InvoiceProductModal from "../components/frontend/InvoiceProductModal.vue";
import TopBrands from "../components/frontend/TopBrands.vue";

const router = useRouter();
const store = useProductStore();

const navigateToProfile = () => router.push("/profile");
const navigateToOrders = () => router.push("/orders");

// ✅ safe orders
const orders = computed(() => (Array.isArray(store.orders) ? store.orders : []));

const formatMoney = (n) => {
  const num = Number(n || 0);
  return Number.isFinite(num) ? num.toFixed(2) : "0.00";
};

const openProducts = async (order) => {
  const orderId = order?.id || order?.invoice_id;
  if (!orderId) return;
  await store.loadInvoiceProducts(orderId);
};

onMounted(() => {
  store.loadOrders();
});
</script>

<style scoped></style>
