import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Roboto-normal.js';
import './Roboto-bold.js';

const generateInvoice = (orderData, t) => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
    });

    doc.setFont("Roboto", "normal");

    const primaryColor = [194, 24, 91];

    doc.setFont("Roboto", "bold");
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(t('invoice_title'), 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("Roboto", "normal");
    doc.text(t('invoice_subtitle'), 105, 28, { align: "center" });
    doc.text("Phone: 1-802-526-2463 | Email: support@bkeuty.com", 105, 33, { align: "center" });

    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(15, 40, 195, 40);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("Roboto", "bold");
    doc.text(`${t('invoice_order')} #${orderData.orderId}`, 15, 50);

    doc.setFont("Roboto", "normal");
    doc.setFontSize(10);
    doc.text(`${t('invoice_date')}: ${orderData.formattedDate}`, 15, 57);
    doc.text(`${t('invoice_payment')}: ${orderData.paymentMethod}`, 15, 62);

    const address = orderData.address;
    const addressStr = typeof address === 'string' ? address : `${address.address}, ${address.ward?.wardName}, ${address.district?.districtName}, ${address.province?.provinceName}`;
    
    const rightColX = 115;
    const addressWidth = 80;

    doc.setFont("Roboto", "bold");
    doc.text(t('invoice_customer'), rightColX, 50);
    
    doc.setFont("Roboto", "normal");
    doc.text(`${orderData.userName || 'Customer'}`, rightColX, 57);
    
    const splitAddress = doc.splitTextToSize(addressStr, addressWidth);
    doc.text(splitAddress, rightColX, 62);

    let nextY = 62 + (splitAddress.length * 5) + 10;
    if (nextY < 85) nextY = 85; 

    const tableData = orderData.items.map(item => [
        item.productVariantName,
        item.quantity,
        `${(item.promotionPrice || item.price || 0).toLocaleString("vi-VN")}d`,
        `${((item.promotionPrice || item.price || 0) * item.quantity).toLocaleString("vi-VN")}d`
    ]);

    autoTable(doc, {
        startY: nextY,
        head: [[t('invoice_product'), t('invoice_qty'), t('invoice_unit_price'), t('invoice_total')]],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontSize: 10,
            halign: 'center',
            font: 'Roboto',
            fontStyle: 'bold'
        },
        styles: {
            font: 'Roboto',
            fontSize: 9,
            cellPadding: 3
        },
        columnStyles: {
            1: { halign: 'center' },
            2: { halign: 'right' },
            3: { halign: 'right' }
        }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    const labelX = 155;
    const valueX = 195;

    doc.setFontSize(10);
    doc.text(`${t('invoice_subtotal')}:`, labelX, finalY, { align: "right" });
    doc.text(`${(orderData.total - (orderData.shippingFee || 0) + (orderData.totalDiscount || 0)).toLocaleString("vi-VN")}d`, valueX, finalY, { align: "right" });

    if (orderData.totalDiscount > 0) {
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`${t('invoice_discount')}:`, labelX, finalY + 7, { align: "right" });
        doc.text(`-${(orderData.totalDiscount).toLocaleString("vi-VN")}d`, valueX, finalY + 7, { align: "right" });
        doc.setTextColor(0);
    }

    doc.text(`${t('invoice_shipping')}:`, labelX, finalY + 14, { align: "right" });
    doc.text(`+${(orderData.shippingFee || 0).toLocaleString("vi-VN")}d`, valueX, finalY + 14, { align: "right" });

    doc.setFont("Roboto", "bold");
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${t('invoice_grand_total')}:`, labelX, finalY + 25, { align: "right" });
    doc.text(`${(orderData.total || 0).toLocaleString("vi-VN")}d`, valueX, finalY + 25, { align: "right" });

    doc.setFont("Roboto", "normal");
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(t('invoice_thanks'), 105, 280, { align: "center" });

    doc.save(`BKEUTY_Invoice_${orderData.orderId}.pdf`);
};

export default generateInvoice;
