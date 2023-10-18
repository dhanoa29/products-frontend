import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/Country';
import { State } from 'src/app/common/State';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormService } from 'src/app/services/form.service';
import { MyValidators } from 'src/app/validators/MyValidators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;

  totalQuantity: number = 0;
  totalPrice: number = 0;

  creditCardMonths: number[];
  creditCardYears: number[];

  countries: Country[] = [];
  shippingStates: State[] = [];
  billingStates: State[] = [];

  //theEmail: string;
  storage: Storage = sessionStorage;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private formService: FormService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    // if (!this.storage.getItem('userEmail')) {
    //   this.theEmail = this.storage.getItem('userEmail')!;
    // }

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhiteSpace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhiteSpace,
        ]),
        email: new FormControl(theEmail, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),

      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhiteSpace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhiteSpace,
        ]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhiteSpace,
        ]),
      }),

      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhiteSpace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhiteSpace,
        ]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhiteSpace,
        ]),
      }),

      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhiteSpace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: new FormControl(''),
        expirationYear: new FormControl(''),
      }),
    });

    //Populate credit card months and years
    this.getCreditCardMonthsAndYears();

    this.getCountries();

    this.reviewCartDetails();
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName')!;
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName')!;
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email')!;
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country')!;
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state')!;
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street')!;
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city')!;
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode')!;
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country')!;
  }

  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state')!;
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street')!;
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city')!;
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode')!;
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType')!;
  }

  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard')!;
  }

  get creditcardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber')!;
  }

  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode')!;
  }

  private getCountries() {
    this.formService.getCountries().subscribe((data) => {
      console.log(`Retrieved Countries: ${JSON.stringify(data)}`);
      this.countries = data;
    });
  }

  private getCreditCardMonthsAndYears() {
    const startMonth: number = new Date().getMonth() + 1;
    //console.log('startMonth: ' + startMonth);
    this.formService.getCreditCardMonths(startMonth).subscribe((data) => {
      //console.log(`Retrieved Credit Card Months: ${JSON.stringify(data)}`);
      this.creditCardMonths = data;
    });

    this.formService.getCreditCardYears().subscribe((data) => {
      // console.log(`Retrieved Credit Card Years: ${JSON.stringify(data)}`);
      this.creditCardYears = data;
    });
  }

  private reviewCartDetails() {
    this.cartService.totalPrice.subscribe((data: number) => {
      this.totalPrice = +data.toFixed(2);
    });

    this.cartService.totalQuantity.subscribe((data: number) => {
      this.totalQuantity = +data.toFixed(2);
    });
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    console.log(this.checkoutFormGroup);

    //Set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //Get cart items
    const cartItems = this.cartService.cartItems;

    //Create order items for cart items
    let orderItems: OrderItem[] = [];
    for (let cartItem of cartItems) {
      orderItems.push(new OrderItem(cartItem));
    }

    let orderItemShort: OrderItem[] = cartItems.map(
      (tempCartItem) => new OrderItem(tempCartItem)
    );

    //Set up purchase
    let purchase = new Purchase();

    //Populate Purchase - shipping address
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;

    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );

    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );

    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //Populate Purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //Populate Purchase - billing address
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;

    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );

    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );

    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //Populate Purchase - order and order items
    purchase.order = order;
    purchase.orderItems = orderItemShort;

    //Call REST API
    this.checkoutService.placeOrder(purchase).subscribe({
      next: (response) => {
        alert(
          `Your order has been received. \n Order Tracking Number: ${response.orderTrackingNumber}`
        );
        //Reset cart
        this.resetCart();
      },
      error: (err) => {
        alert(`There was an error: ${err.message}`);
      },
    });

    // this.checkoutService
    //   .placeOrder(purchase)
    //   .subscribe((data) => console.log());
  }

  resetCart() {
    //Reset Cart
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //Reset the form
    this.checkoutFormGroup.reset();

    //Navigate to products page
    this.router.navigateByUrl('/products');
  }

  copyShippingAddressToBillingAddress(event: Event) {
    if ((<HTMLInputElement>event.target!).checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );

      this.billingStates = this.shippingStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingStates = [];
    }
  }

  handleMonthsAndYears() {
    let currentYear = new Date().getFullYear();
    let selectedYear =
      this.checkoutFormGroup.controls['creditCard'].value.expirationYear;

    let months: number[] = [];
    let startMonth: number = 1;

    if (selectedYear == currentYear) {
      startMonth = new Date().getMonth() + 1;
    }

    this.formService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => (this.creditCardMonths = data));

    // if (selectedYear > currentYear) {
    //   for (let month = 1; month <= 12; month++) {
    //     months.push(month);
    //   }
    //   this.creditCardMonths = months;
    // } else {
    //   const currentMonth: number = new Date().getMonth() + 1;
    //   for (let month = currentMonth; month <= 12; month++) {
    //     months.push(month);
    //   }
    //   this.creditCardMonths = months;
    // }
  }

  getStates(status: string) {
    if (status === 'shipping') {
      const country = <Country>(
        this.checkoutFormGroup.controls['shippingAddress'].value.country
      );
      const code = country.code;
      this.formService.getStates(code).subscribe((data) => {
        this.shippingStates = data;
        this.checkoutFormGroup.controls['shippingAddress']
          .get('state')!
          .setValue(data[0]);
      });
    } else if (status === 'billing') {
      const country = <Country>(
        this.checkoutFormGroup.controls['billingAddress'].value.country
      );
      const code = country.code;
      this.formService.getStates(code).subscribe((data) => {
        this.billingStates = data;
        this.checkoutFormGroup.controls['billingAddress']
          .get('state')!
          .setValue(data[0]);
      });
    }
  }
}
