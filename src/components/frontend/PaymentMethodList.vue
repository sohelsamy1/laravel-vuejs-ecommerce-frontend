<template>
  <Teleport to="body">
    <div
      class="modal fade"
      id="paymentMethodModal"
      tabindex="-1"
      aria-labelledby="paymentModalTitle"
      aria-hidden="true"
      ref="modalEl"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="paymentModalTitle">Pay Now</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <div v-if="loading" class="text-center py-3">
              <div class="spinner-border" role="status"></div>
            </div>

            <div v-else-if="!methods?.length">
              <p class="text-muted mb-0">
                {{ error || "No payment methods available." }}
              </p>
            </div>

            <table v-else class="table">
              <tbody>
                <tr v-for="(pm, i) in methods" :key="i">
                  <td><img class="w-50" :src="pm.logo" :alt="pm.name" /></td>
                  <td>
                    <p class="mb-0">{{ pm.name }}</p>
                  </td>
                  <td class="text-end">
                    <a
                      class="btn btn-danger btn-sm"
                      :href="pm.redirectGatewayURL"
                      >Pay</a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /modal-body -->
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Modal } from "bootstrap";

// super minimal: only pass what we render
defineProps({
  methods: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: "" },
});

const modalEl = ref(null);
let instance = null;

onMounted(() => {
  if (modalEl.value) {
    instance = Modal.getOrCreateInstance(modalEl.value, { backdrop: "static" });
  }
});

onBeforeUnmount(() => {
  if (instance) {
    instance.hide();
    instance.dispose();
    instance = null;
  }
});

// expose simple API to parent
const show = () => instance?.show();
const hide = () => instance?.hide();
defineExpose({ show, hide });
</script>
