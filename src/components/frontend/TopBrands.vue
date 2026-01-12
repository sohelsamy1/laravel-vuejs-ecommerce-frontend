<template>
  <div class="section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="heading_s4 text-center">
            <h2>Top Brands</h2>
          </div>
          <p class="text-center leads">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            blandit massa enim Nullam nunc varius.
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div class="text-center py-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error / Empty -->
      <div class="text-center text-muted py-4">No brands available.</div>

      <!-- List -->
      <div class="row align-items-center">
        <div class="p-2 col-6 col-md-4 col-lg-2">
          <div class="item">
            <div class="categories_box">
              <a href="/by-brand?id=1">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Huawei_Standard_logo.svg/1200px-Huawei_Standard_logo.svg.png"
                  alt="Brand Name"
                />
                <span>Brand Name</span>
              </a>
            </div>
          </div>
        </div>
        <!-- Repeat similar blocks as needed -->
      </div>
    </div>
  </div>
</template>
