
class invoiceEventEnum {
    static SALES_ORDER_STATUS_CHANGED = 'salesOrderStatusChanged';
  
    static values() {
      return [invoiceEventEnum.SALES_ORDER_STATUS_CHANGED];
    }
}
  
module.exports = invoiceEventEnum;