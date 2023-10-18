import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  storage: Storage = localStorage;

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data != null) {
      this.cartItems = data;

      //Compute totals based on the data that is read from storage
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem): void {
    let alreadyExists = false;
    let exisitingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      // for (let tempCartItem of this.cartItems) {
      //   if (tempCartItem.id === theCartItem.id) {
      //     exisitingCartItem = tempCartItem;
      //     alreadyExists = true;
      //     break;
      //   }
      // }
      exisitingCartItem = this.cartItems.find(
        (item) => item.id === theCartItem.id
      );

      alreadyExists = exisitingCartItem !== undefined;
    }

    if (alreadyExists) {
      exisitingCartItem!.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals() {
    let price = 0;
    let quantity = 0;

    for (let cartItem of this.cartItems) {
      price += cartItem.unitPrice * cartItem.quantity;
      quantity += cartItem.quantity;
    }

    this.totalPrice.next(price);
    this.totalQuantity.next(quantity);

    this.logCartData(price, quantity);

    //Persist cart items
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartData(price: number, quantity: number) {
    console.log('Contents of  the cart:');
    for (let tempCartItem of this.cartItems) {
      let subTotal = tempCartItem.unitPrice * tempCartItem.quantity;
      console.log(
        `Name: ${tempCartItem.name}, Unit Price: ${tempCartItem.unitPrice}, 
        Quantity: ${tempCartItem.quantity}, Sub Total: ${subTotal}`
      );

      console.log(`Total Price: ${price.toFixed(2)}`);
      console.log('----');
    }
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    if (cartItem.quantity === 0) {
      this.removeItem(cartItem);
    } else {
      this.computeCartTotals();
    }
  }

  removeItem(cartItem: CartItem) {
    const index: number = this.cartItems.indexOf(cartItem, 0);
    this.cartItems.splice(index, 1);
    this.computeCartTotals();
  }
}
