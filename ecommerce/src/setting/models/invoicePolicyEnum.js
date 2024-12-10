class InvoicePolicyEnum {
  static ON_ORDER = 'on_order';
  static ON_DELIVER = 'on_deliver';

  static values() {
    return [InvoicePolicyEnum.ON_ORDER, InvoicePolicyEnum.ON_DELIVER];
  }
}

module.exports = InvoicePolicyEnum;