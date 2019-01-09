Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">

      <div class="product-image">
        <img :src="image" alt="">
      </div>

      <div class="product-info">
        <h1>{{ title }}</h1>
        <p v-if="inStock">In Stock</p>
        <p v-else
          :class="{ addLineThrough: !inStock }"
        >Out of Stock</p>
        <p>{{ sale }}</p>
        <p>Shipping: {{ shipping }} </p>

        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>

        <div v-for="(variant, index) in variants" 
             :key="variant.variantId"
             class="color-box"
             :style="{ backgroundColor: variant.variantColor }"
             @mouseover="updateProduct(index)"
             >
        </div>

        <button @click="addToCart" 
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
                >Add To Cart</button>
        <button @click="removeFromCart">Remove Item</button>
      </div>

      <product-review @review-submitted="addReview"></product-review>
    </div>
  `,
  data() { 
    return {
      product: 'Catherine Socks',
      brand: 'Vue Mastery',
      selectedVariant: 0,
      details: ['80% cotton', '20% polyester', 'Gender-neutral'],
      variants: [
        {
          variantId: 2334,
          variantColor: 'green',
          variantImage: './assets/vmSocks-green.jpg',
          variantQuantity: 10
        },
        {
          variantId: 2335, 
          variantColor: 'blue',
          variantImage: './assets/vmSocks-blue.jpg',
          variantQuantity: 0
        }
      ],
      onSale: false,
      reviews: []
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    updateProduct(index) {
      this.selectedVariant = index
    },
    removeFromCart() {
      this.cart -= 1
    },
    addReview(productReview) {
      this.reviews.push(productReview)
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    sale() {
      if (this.onSale) {
        return this.brand + ' ' + this.product + ' are on sale!'
      }
      return this.brand + ' ' + this.product + ' are not on sale!'
    },
    shipping() {
      if (this.premium) {
        return 'Free'
      }
      return 2.99
    }
  }
})

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>

      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5<option>
          <option>4<option>
          <option>3<option>
          <option>2<option>
          <option>1<option>
        </select>
      </p>

      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
  `,
  data() {
    return {
      name: null,
      rating: null,
      review: null
    }
  },
  methods: {
    onSubmit() {
      let productReview = {
        name: this.name,
        review: this.review,
        rating: this.rating
      }
      this.$emit('review-submitted', productReview)
      this.name = null
      this.review = null
      this.rating = null
    }
  }
})

let app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    },
    removeItem(id) {
      return this.cart.filter(item !== id)
    }
  }
})