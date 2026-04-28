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
    doc.text(`${t('invoice_order_date')}: ${new Date(orderData.orderDate).toLocaleDateString('vi-VN')}`, 15, 57);
    if (orderData.estShippingDate) {
        doc.text(`${t('invoice_est_delivery')}: ${new Date(orderData.estShippingDate).toLocaleDateString('vi-VN')}`, 15, 62);
    }
    doc.text(`${t('invoice_payment')}: ${orderData.paymentMethod}`, 15, 67);

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

    let nextY = 67 + (splitAddress.length * 5) + 10;
    if (nextY < 90) nextY = 90; 

    const tableData = orderData.items.map(item => {
        const originalPrice = item.price || 0;
        const finalPrice = item.promotionPrice || item.price || 0;
        const discountPerItem = originalPrice - finalPrice;

        return [
            item.productVariantName,
            `${originalPrice.toLocaleString("vi-VN")}${t('unit_vnd')}`,
            discountPerItem > 0 ? `-${discountPerItem.toLocaleString("vi-VN")}${t('unit_vnd')}` : `0${t('unit_vnd')}`,
            item.quantity,
            `${(finalPrice * item.quantity).toLocaleString("vi-VN")}${t('unit_vnd')}`
        ];
    });

    autoTable(doc, {
        startY: nextY,
        head: [[
            t('invoice_product'), 
            t('invoice_original_price'), 
            t('invoice_discount_col'), 
            t('invoice_qty'), 
            t('invoice_total')
        ]],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontSize: 9,
            halign: 'center',
            font: 'Roboto',
            fontStyle: 'bold'
        },
        styles: {
            font: 'Roboto',
            fontSize: 8,
            cellPadding: 3
        },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { halign: 'right', cellWidth: 30 },
            2: { halign: 'right', cellWidth: 30, textColor: primaryColor },
            3: { halign: 'center', cellWidth: 15 },
            4: { halign: 'right', cellWidth: 30 }
        }
    });

    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDiscount = orderData.items.reduce((sum, item) => {
        const price = item.price || 0;
        const promoPrice = item.promotionPrice || price;
        return sum + (price > promoPrice ? (price - promoPrice) * item.quantity : 0);
    }, 0);

    const finalY = doc.lastAutoTable.finalY + 10;
    const labelX = 155;
    const valueX = 195;

    let currentY = finalY;
    const lineHeight = 6;

    doc.setFontSize(10);
    doc.text(`${t('invoice_subtotal')}:`, labelX, currentY, { align: "right" });
    doc.text(`${subtotal.toLocaleString("vi-VN")}${t('unit_vnd')}`, valueX, currentY, { align: "right" });

    if (totalDiscount > 0) {
        currentY += lineHeight;
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`${t('invoice_discount')}:`, labelX, currentY, { align: "right" });
        doc.text(`-${totalDiscount.toLocaleString("vi-VN")}${t('unit_vnd')}`, valueX, currentY, { align: "right" });
        doc.setTextColor(0);
    }

    currentY += lineHeight;
    doc.text(`${t('invoice_shipping')}:`, labelX, currentY, { align: "right" });
    doc.text(`+${(orderData.shippingFee || 0).toLocaleString("vi-VN")}${t('unit_vnd')}`, valueX, currentY, { align: "right" });

    currentY += 10;
    doc.setFont("Roboto", "bold");
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${t('invoice_grand_total')}:`, labelX, currentY, { align: "right" });
    doc.text(`${((orderData.total || 0) + (orderData.shippingFee || 0)).toLocaleString("vi-VN")}${t('unit_vnd')}`, valueX, currentY, { align: "right" });

    doc.setFont("Roboto", "normal");
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(t('invoice_thanks'), 105, 280, { align: "center" });

    const invoiceFileName = t('invoice_title').toLowerCase().replace(/\s+/g, '_') + `_${orderData.orderId}.pdf`;
    doc.save(`BKEUTY_${invoiceFileName}`);
};

export default generateInvoice;
