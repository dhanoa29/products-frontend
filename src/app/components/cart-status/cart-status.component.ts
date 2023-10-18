import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css'],
})
export class CartStatusComponent implements OnInit {
  price: number = 0;
  quantity: number = 0;
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.updateCartStatus();
  }

  private updateCartStatus() {
    this.cartService.totalPrice.subscribe((data: number) => {
      this.price = +data.toFixed(2);
    });
    this.cartService.totalQuantity.subscribe((data) => {
      this.quantity = +data.toFixed(2);
    });
  }
}
