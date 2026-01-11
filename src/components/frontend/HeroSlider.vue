<script setup>
import { onBeforeMount } from "vue";
import { useProductStore } from "../../stores/productStore";

const store = useProductStore();

onBeforeMount(async () => {
  await store.fetchSlider();
});
</script>

<template>
  <div
    class="banner_section slide_medium shop_banner_slider staggered-animation-wrap"
  >
    <div
      id="carouselExampleControls"
      class="carousel slide carousel-fade light_arrow"
      data-bs-ride="carousel"
    >
      <div class="carousel-inner">
        <!-- Loading -->
        <div v-if="store.sliderLoading" class="carousel-item active">
          <div
            class="d-flex align-items-center justify-content-center"
            style="height: 420px"
          >
            <div class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-3 mb-0">Loading slider...</p>
            </div>
          </div>
        </div>

        <!-- Empty / Error -->
        <div v-else-if="!store.sliderItems.length" class="carousel-item active">
          <div
            class="d-flex align-items-center justify-content-center bg-light"
            style="height: 420px"
          >
            <p class="mb-0 text-muted">
              {{ store.sliderError || "No slides available." }}
            </p>
          </div>
        </div>
        <!-- Slide Example -->
        <div
          v-else
          v-for="(item, i) in store.sliderItems"
          :key="item.id"
          class="carousel-item background_bg"
          :class="{ active: i === 0 }"
          :style="{ backgroundImage: `url(${item.image})` }"
        >
          <div class="banner_slide_content">
            <div class="container">
              <div class="row">
                <div class="col-lg-7 col-9">
                  <div class="banner_content overflow-hidden">
                    <h5
                      class="mb-3 staggered-animation font-weight-light"
                      data-animation="slideInLeft"
                      data-animation-delay="0.5s"
                    >
                      {{ item.price }}
                    </h5>
                    <h2
                      class="staggered-animation"
                      data-animation="slideInLeft"
                      data-animation-delay="1s"
                    >
                      {{ item.title }}
                    </h2>
                    <a
                      class="btn btn-fill-out rounded-0 staggered-animation text-uppercase"
                      href="/details?id=1"
                      data-animation="slideInLeft"
                      data-animation-delay="1.5s"
                    >
                      Shop Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- /slide -->
      </div>

      <!-- Controls -->
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="prev"
      >
        <i class="ion-chevron-left"></i>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="next"
      >
        <i class="ion-chevron-right"></i>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>
