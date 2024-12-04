class SalesOrderStatusEnum {
    static DRAFT = 'draft';
    static CONFIRMED = 'confirmed';
    static PAID = 'paid';
    static SHIPPED = 'shipped';
    static DELIVERED = 'delivered';
    static CANCELLED = 'cancelled';
  
    static values() {
      return [SalesOrderStatusEnum.DRAFT, SalesOrderStatusEnum.CONFIRMED, SalesOrderStatusEnum.PAID,
        SalesOrderStatusEnum.SHIPPED, SalesOrderStatusEnum.DELIVERED, SalesOrderStatusEnum.CANCELLED
      ];
    }
  }
  
  module.exports = SalesOrderStatusEnum;