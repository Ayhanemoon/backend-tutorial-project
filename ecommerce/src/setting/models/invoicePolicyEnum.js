class invoicePolicyEnum {
  static ON_ORDER = 'on_order';
  static ON_DELIVER = 'on_deliver';

  static values() {
    return [InvoicePolicy.ON_ORDER, InvoicePolicy.ON_DELIVER];
  }
}

module.exports = InvoicePolicyEnum;