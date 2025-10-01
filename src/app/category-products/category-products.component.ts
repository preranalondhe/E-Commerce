import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { CartService } from 'src/app/service/cart.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css']
})
export class CategoryProductsComponent implements OnInit {
  categoryId!: number;
  categoryName: string = '';
  allProducts: any[] = [];      // normalized original product list
  products: any[] = [];         // currently displayed (after filter)
  loading: boolean = false;
  errorMessage: string = '';

  // => unified filters object (use "color" everywhere)
  filters: any = {
    color: '',
    brand: '',
    discountPercent: null,
    minPrice: null,
    maxPrice: null,
    sort: ''   // 'asc' | 'desc' | ''
  };

  colors: string[] = []; // options for dropdown (populated from products)
  brands: string[] = [];

  // Reviews
  selectedProduct: any = null;
  productReviews: any[] = [];
  reviewLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = Number(params.get('id'));
      this.route.queryParamMap.subscribe(q => this.categoryName = q.get('name') || '');
        this.generateDiscountRanges();

      if (!this.categoryId) {
        this.errorMessage = 'Invalid category';
        return;
      }
      this.loadProducts();
    });
  }

  // ------- Load & normalize products -------
  // ------- Load & normalize products -------
loadProducts(): void {
  this.loading = true;
  this.errorMessage = '';

  this.productService.getProduct()
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (response: any) => {
        console.log(response);

        const arr = Array.isArray(response) ? response : [];

        // filter products by category
        const categoryProducts = arr.filter((e: any) => {
          const catId = e?.category?.id ?? e?.categoryId ?? e?.category;
          return Number(catId) === Number(this.categoryId);
        });

        // normalize products
        this.allProducts = categoryProducts.map(p => this.normalizeProduct(p));
        this.products = [...this.allProducts];

        // populate dropdowns
        this.extractFilterOptions();

        if (this.allProducts.length === 0) {
          this.errorMessage = 'No products found in this category';
        }
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.errorMessage = 'Failed to load products';
      }
    });
}


  // Normalize product fields so UI can rely on a single shape
  private normalizeProduct(p: any): any {
    const copy = { ...p };

    // helper: pick first non-empty value for a list of keys / nested keys
    const pick = (obj: any, ...keys: any[]) => {
      for (const k of keys) {
        try {
          if (typeof k === 'string') {
            if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k];
          } else if (Array.isArray(k)) {
            // e.g. ['attributes','color']
            let val = obj;
            for (const seg of k) {
              val = val?.[seg];
              if (val === undefined) break;
            }
            if (val !== undefined && val !== null && val !== '') return val;
          }
        } catch (e) {}
      }
      return null;
    };

    // possible color keys - adapt to your backend's names:
    const rawColor = pick(copy, 'color', 'colour', 'productColor', ['attributes','color'], 'colourName', 'colour_name');
    copy.color = typeof rawColor === 'string' ? rawColor.trim() : rawColor;

    // possible brand keys:
    const rawBrand = pick(copy, 'brand', 'Brand', 'manufacturer', 'maker');
    copy.brand = typeof rawBrand === 'string' ? rawBrand.trim() : rawBrand;

    // parse price(s) safely (remove currency symbols)
    const parseNumber = (v: any) => {
      if (v === null || v === undefined) return null;
      if (typeof v === 'number') return v;
      const s = String(v);
      const n = parseFloat(s.replace(/[^0-9.]/g, ''));
      return isNaN(n) ? null : n;
    };

      // original price (MRP) comes directly from backend
  copy.originalPrice = Number(p.price) || 0;

  // discount percent is directly available
  copy.offer = Number(p.discountPercent) || 0;

  // final price after discount
  if (copy.originalPrice && copy.offer > 0) {
    copy.finalPrice = Math.round(copy.originalPrice - (copy.originalPrice * copy.offer / 100));
  } else {
    copy.finalPrice = copy.originalPrice; // no discount case
  }

  // color + brand normalization
  copy.color = p.colour || '';
  copy.brand = p.brand || '';

  // image normalization
  copy.imagePaths = p.imagePaths;

  return copy;
}

  // ------- Extract unique options for dropdowns -------
  extractFilterOptions() {
    this.colors = Array.from(new Set(this.allProducts.map(p => (p.color || '').trim()).filter(c => !!c)));
    this.brands = Array.from(new Set(this.allProducts.map(p => (p.brand || '').trim()).filter(b => !!b)));
    console.log('Available Colors:', this.colors);
    console.log('Available Brands:', this.brands);
  }

  // ------- Client-side filtering (fast, reliable) -------
  applyFilters() {
    // start from unfiltered full list
    let filtered = [...this.allProducts];

    // color
    if (this.filters.color) {
      const want = String(this.filters.color).toLowerCase();
      filtered = filtered.filter(p => (p.color || '').toLowerCase() === want);
    }

    // brand
    if (this.filters.brand) {
      const want = String(this.filters.brand).toLowerCase();
      filtered = filtered.filter(p => (p.brand || '').toLowerCase() === want);
    }

    // discountPercent (minimum)
   // discountPercent (range)
   
if (this.filters.discountPercent) {
  const [min, max] = this.filters.discountPercent.split('-').map((n: any) => Number(n));
  filtered = filtered.filter(p => {
    const offer = p.offer || 0;
    return offer >= min && offer < max;
  });
}


    // price range
    if (this.filters.minPrice != null && this.filters.minPrice !== '') {
      const minP = Number(this.filters.minPrice) || 0;
      filtered = filtered.filter(p => (p.price ?? Number.POSITIVE_INFINITY) >= minP);
    }
    if (this.filters.maxPrice != null && this.filters.maxPrice !== '') {
      const maxP = Number(this.filters.maxPrice) || Number.POSITIVE_INFINITY;
      filtered = filtered.filter(p => (p.price ?? 0) <= maxP);
    }

    // sorting
    if (this.filters.sort === 'asc') {
      filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (this.filters.sort === 'desc') {
      filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }

    this.products = filtered;
  }

  // Clear filters and show all
  clearFilters() {
    this.filters = {
      color: '',
      brand: '',
      discountPercent: null,
      minPrice: null,
      maxPrice: null,
      sort: ''
    };
    this.products = [...this.allProducts];
  }

  // ------- Add to cart (unchanged) -------
  addToCart(product: any) {
    const cartItem = { productId: product.id, quantity: 1 };
    this.cartService.addToCart(cartItem).subscribe({
      next: (res) => console.log('Product added', res),
      error: (err) => console.error('Error adding to cart', err)
    });
  }

  // ------- Reviews -------
  loadReviews(product: any) {
    this.selectedProduct = product;
    this.reviewLoading = true;
    this.productService.getProductReviews(product.id)
      .pipe(finalize(() => this.reviewLoading = false))
      .subscribe({
        next: (res) => {
          this.productReviews = Array.isArray(res) ? res : [];
        },
        error: (err) => {
          console.error('Failed to load reviews', err);
          this.productReviews = [];
        }
      });
  }

  closeReviewModal() {
    this.selectedProduct = null;
    this.productReviews = [];
  }

  // ------- Image helper (unchanged) -------
  // getProductImage(product: any): string {
  //   try {
  //     if (product?.imagePaths) {
  //       // ensure URL is absolute if needed
  //       return product.imagePaths.startsWith('http') ? product.imagePaths : ('http://localhost:4040' + product.imagePaths);
  //     }
  //     if (product?.images?.length > 0) {
  //       const img = product.images[0];
  //       if (img.url) return img.url;
  //       if (img.base64) return `data:${img.contentType || 'image/jpeg'};base64,${img.base64}`;
  //     }
  //     if (product?.base64Images?.length > 0) {
  //       return 'data:image/jpeg;base64,' + product.base64Images[0];
  //     }
  //     return 'https://via.placeholder.com/150';
  //   } catch (err) {
  //     console.error('Error in getProductImage:', err);
  //     return 'https://via.placeholder.com/150';
  //   }
  // }

  // optional: fallback calculation if you prefer dynamic
  calculateOffer(product: any): number | null {
    if (product && product.originalPrice && product.price && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  }
  discountRanges: { label: string; value: string }[] = [];

  generateDiscountRanges() {
  this.discountRanges = [];
  for (let i = 0; i < 100; i += 10) {
    const start = i;
    const end = i + 10;
    this.discountRanges.push({
      label: `${start}% - ${end}%`,
      value: `${start}-${end}`
    });
  }}
}
