const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  //generateFooter(doc);
  generateSignature(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  doc
    .image("routes/logo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .font("C:/Users/Dragon/Downloads/THSarabunNew/THSarabunNew Bold.ttf")
    .text("หจก.ปั้นปั่นแมนเนจเมนต์", 110, 57)
    .fontSize(10)
    .text("หจก.ปั้นปั่นแมนเนจเมนต์", 200, 50, { align: "right" })
    .font("C:/Users/Dragon/Downloads/THSarabunNew/THSarabunNew.ttf")
    .text("123 หมู่ 16 ถนนมิตรภาพ", 200, 65, { align: "right" })
    .font("C:/Users/Dragon/Downloads/THSarabunNew/THSarabunNew.ttf")
    .text("ต.ในเมือง อ.เมือง จ.ขอนแก่น 40002", 200, 80, { align: "right" })
    .font("C:/Users/Dragon/Downloads/THSarabunNew/THSarabunNew.ttf")
    .text("โทร 0-4321-1452", 200, 95, { align: "right" })
    .moveDown()
    ;
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .font('C:/Users/Dragon/Downloads/THSarabunNew/THSarabunNew Bold.ttf')
    .text("ใบวางบิล", 50, 160)

  generateHr(doc, 185);

  const customerInformationTop = 190;

  doc
    .fontSize(10)
    .text("เลขที่:", 50, customerInformationTop)
    .font("C:/Users/Dragon/Downloads/THSarabunNew/THSarabunNew.ttf")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("C:/Users/Dragon/Downloads/THSarabunNew/THSarabunNew.ttf")
    .text("วันที่:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .font("C:/Users/Dragon/Downloads/THSarabunNew/THSarabunNew Bold.ttf")
    .text("ลูกค้า:", 250, customerInformationTop)
    .font("C:/Users/Dragon/Downloads/THSarabunNew/THSarabunNew.ttf")
    .text(invoice.shipping.name, 300, customerInformationTop)
    .font("C:/Users/Dragon/Downloads/THSarabunNew/THSarabunNew.ttf")
    .text(invoice.shipping.address, 300, customerInformationTop + 15)
    .text(
      "ต." + invoice.shipping.sub_district +
        " อ." +
        invoice.shipping.district +
        " จ." +
        invoice.shipping.province + " "+invoice.shipping.zipcode,
      300,
      customerInformationTop + 30
    )
    .text(invoice.shipping.tel,300,customerInformationTop+45)
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("C:/Users/Dragon/Downloads/THSarabunNew/THSarabunNew.ttf");
  generateTableRow(
    doc,
    invoiceTableTop,
    "รายการ",
    "ต้นทาง",
    "ปลายทาง",
    "สินค้า",
    "ทะเบียนรถ",
    "ราคาต่อตัน",
    "น้ำหนัก(ตัน)",
    "รวม"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("C:/Users/Dragon/Downloads/THSarabunNew/THSarabunNew.ttf");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.origin,
      item.destination,
      item.product,
      item.registration,
      item.price,
      item.quantity,
      formatCurrency(item.price*item.quantity)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "",
    "",
    "",
    "รวม",
    "",
    formatCurrency(invoice.subtotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "",
    "",
    "",
    "ภาษี ณ ที่จ่าย 1%",
    "",
    formatCurrency(invoice.subtotal*0.01)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("C:/Users/Dragon/Downloads/THSarabunNew/THSarabunNew.ttf");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "",
    "",
    "",
    "รวมสุทธิ",
    "",
    formatCurrency(invoice.subtotal*1.01)
  );
  doc.font("C:/Users/Dragon/Downloads/THSarabunNew/THSarabunNew.ttf");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateSignature(doc) {
  doc.font("C:/Users/Dragon/Downloads/THSarabunNew/THSarabunNew Bold.ttf")
  doc
    .fontSize(10)
    .text("ผู้วางบิล",100,600)
    .text("ผู้รับวางบิล",350,600)
    .text("(                                      )",150,630)
    .text("(                                      )",400,630);
}

function generateTableRow(
  doc,
  y,
  item,
  origin,
  destination,
  product,
  registration,
  price,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(origin,100,y)
    .text(destination,180,y)
    .text(product,260,y)
    .text(registration, 320, y)
    .text(price, 350, y, { width: 90, align: "right" })
    .text(quantity, 410, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "฿" + (cents).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createInvoice
};
