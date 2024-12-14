class InvoiceStatusEnum {
    static DRAFT = 'draft';
    static PAID = 'paid';
    static values() {
      return [InvoiceStatusEnum.DRAFT, InvoiceStatusEnum.PAID];
    }
  }
  
  module.exports = InvoiceStatusEnum;