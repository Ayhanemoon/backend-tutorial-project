const EventEmitter = require('events');
const invoiceEventEmitter = new EventEmitter();
const InvoicePolicyEnum = require('../models/invoicePolicyEnum');
const {createInvoice} = require('../../sales/controllers/invoiceController');
const {invoiceEventEnum} = require('./invoiceEventEnum');

exports.updateInvoiceEvent = async(invoiceSetting) => {
  updateSalesOrderStatusEvent(invoiceSetting);
};

function updateSalesOrderStatusEvent(invoiceSetting) {
  const eventName = invoiceEventEnum.SALES_ORDER_STATUS_CHANGED;

  invoiceEventEmitter.removeAllListeners(eventName);

  switch (invoiceSetting.invoicingPolicy) {
  case InvoicePolicyEnum.ON_ORDER:
    invoiceEventEmitter.on(eventName, async(salesOrder)=>{
      if (salesOrder.status === 'confirmed') {
        salesOrder.invoiceable = true;
        if (invoiceSetting.automatic) {
          createInvoice(salesOrder);
        }
      }
    });
    break;
  case InvoicePolicyEnum.ON_DELIVER:
    invoiceEventEmitter.on(eventName, async(salesOrder)=>{
      if (salesOrder.status === 'delivered') {
        salesOrder.invoiceable = true;
        if (invoiceSetting.automatic) {
          createInvoice(salesOrder);
        }
      }
    });
    break;
  }
};

module.exports = invoiceEventEmitter;