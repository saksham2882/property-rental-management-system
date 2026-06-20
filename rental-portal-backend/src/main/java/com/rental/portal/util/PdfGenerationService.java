package com.rental.portal.util;

import org.openpdf.text.*;
import org.openpdf.text.pdf.PdfPCell;
import org.openpdf.text.pdf.PdfPTable;
import org.openpdf.text.pdf.PdfWriter;
import com.rental.portal.model.Lease;
import com.rental.portal.model.Property;
import com.rental.portal.model.Rent;
import com.rental.portal.model.User;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.NumberFormat;
import java.util.Locale;

@Service
public class PdfGenerationService {

    public byte[] generateRentInvoice(Rent rent, User tenant, Lease lease, Property property) throws DocumentException, IOException {

        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        PdfWriter.getInstance(document, out);
        document.open();

        Color primaryTeal = new Color(13, 148, 136);
        Color textDark = new Color(30, 41, 59); 
        Color borderLight = new Color(226, 232, 240); 
        Color bgLight = new Color(248, 250, 252); 

        // Fonts 
        Font companyFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, primaryTeal);
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, textDark);
        Font sectionTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, primaryTeal);
        Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 9, textDark);
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, textDark);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
        Font footerFont = FontFactory.getFont(FontFactory.HELVETICA, 8, Color.GRAY);

        // Header Table
        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[]{60f, 40f});
        headerTable.setSpacingAfter(15);

        // Company branding
        PdfPCell logoCell = new PdfPCell();
        logoCell.setBorder(Rectangle.NO_BORDER);
        logoCell.addElement(new Paragraph("RentEase Portal", companyFont));
        logoCell.addElement(new Paragraph("Premium Property Rental & Tenant Management Services", FontFactory.getFont(FontFactory.HELVETICA, 8, Color.GRAY)));
        headerTable.addCell(logoCell);

        // Invoice metadata
        PdfPCell metaCell = new PdfPCell();
        metaCell.setBorder(Rectangle.NO_BORDER);
        metaCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        Paragraph invTitle = new Paragraph("PAYMENT RECEIPT", titleFont);
        invTitle.setAlignment(Element.ALIGN_RIGHT);
        metaCell.addElement(invTitle);

        Paragraph invRef = new Paragraph("Receipt Ref: #" + rent.getId(), boldFont);
        invRef.setAlignment(Element.ALIGN_RIGHT);
        metaCell.addElement(invRef);
        
        Paragraph invDate = new Paragraph("Date: " + (rent.getPaidDate() != null ? rent.getPaidDate() : "N/A"), bodyFont);
        invDate.setAlignment(Element.ALIGN_RIGHT);
        metaCell.addElement(invDate);
        headerTable.addCell(metaCell);

        document.add(headerTable);

        
        // Separator
        Paragraph separator = new Paragraph("______________________________________________________________________________", FontFactory.getFont(FontFactory.HELVETICA, 10, borderLight));
        separator.setSpacingAfter(15);
        document.add(separator);

        // Billing Information Table
        PdfPTable billingTable = new PdfPTable(2);
        billingTable.setWidthPercentage(100);
        billingTable.setWidths(new float[]{50f, 50f});
        billingTable.setSpacingAfter(20);

        // Tenant Details
        PdfPCell tenantCell = new PdfPCell();
        tenantCell.setBorder(Rectangle.NO_BORDER);
        tenantCell.addElement(new Paragraph("TENANT DETAILS", sectionTitleFont));
        tenantCell.addElement(new Paragraph("Name: " + (tenant != null ? tenant.getName() : "Valued Tenant"), bodyFont));
        tenantCell.addElement(new Paragraph("Email: " + (tenant != null ? tenant.getEmail() : "N/A"), bodyFont));
        tenantCell.addElement(new Paragraph("Phone: " + (tenant != null ? tenant.getPhone() : "N/A"), bodyFont));
        billingTable.addCell(tenantCell);

        // Landlord Details
        PdfPCell landlordCell = new PdfPCell();
        landlordCell.setBorder(Rectangle.NO_BORDER);
        landlordCell.addElement(new Paragraph("LANDLORD / ISSUER", sectionTitleFont));
        landlordCell.addElement(new Paragraph("Issued By: RentEase", bodyFont));
        landlordCell.addElement(new Paragraph("Support: support@rentease.com", bodyFont));
        landlordCell.addElement(new Paragraph("Status: " + rent.getStatus().toUpperCase(), boldFont));
        billingTable.addCell(landlordCell);

        document.add(billingTable);


        // Property & Lease Information
        Paragraph propHeader = new Paragraph("PROPERTY & LEASE DETAILS", sectionTitleFont);
        propHeader.setSpacingAfter(6);
        document.add(propHeader);

        PdfPTable propTable = new PdfPTable(2);
        propTable.setWidthPercentage(100);
        propTable.setWidths(new float[]{30f, 70f});
        propTable.setSpacingAfter(20);

        addTableRow(propTable, "Property Title:", property != null ? property.getTitle() : "Rental Property", bodyFont, boldFont, borderLight);
        addTableRow(propTable, "Location Locality:", property != null ? (property.getLocality() + ", " + property.getCity()) : "N/A", bodyFont, boldFont, borderLight);
        addTableRow(propTable, "Lease Period:", lease != null ? (lease.getStartDate() + " to " + lease.getEndDate()) : "N/A", bodyFont, boldFont, borderLight);
        addTableRow(propTable, "Security Deposit:", lease != null ? formatCurrency(lease.getDeposit()) : "N/A", bodyFont, boldFont, borderLight);
        addTableRow(propTable, "Lease Agreement ID:", rent.getLeaseId(), bodyFont, boldFont, borderLight);

        document.add(propTable);


        // Cost & Payment Summary
        Paragraph payHeader = new Paragraph("PAYMENT SUMMARY", sectionTitleFont);
        payHeader.setSpacingAfter(6);
        document.add(payHeader);

        PdfPTable summaryTable = new PdfPTable(2);
        summaryTable.setWidthPercentage(100);
        summaryTable.setWidths(new float[]{75f, 25f});
        summaryTable.setSpacingAfter(20);

        // Header
        PdfPCell col1 = new PdfPCell(new Paragraph("Description", headerFont));
        col1.setBackgroundColor(primaryTeal);
        col1.setPadding(6);
        col1.setBorderColor(borderLight);
        summaryTable.addCell(col1);

        PdfPCell col2 = new PdfPCell(new Paragraph("Amount", headerFont));
        col2.setBackgroundColor(primaryTeal);
        col2.setPadding(6);
        col2.setHorizontalAlignment(Element.ALIGN_RIGHT);
        col2.setBorderColor(borderLight);
        summaryTable.addCell(col2);

        // Row Item
        PdfPCell descCell = new PdfPCell(new Paragraph("Rent Bill Cycle: " + rent.getMonth(), bodyFont));
        descCell.setPadding(6);
        descCell.setBorderColor(borderLight);
        summaryTable.addCell(descCell);

        PdfPCell valCell = new PdfPCell(new Paragraph(formatCurrency(rent.getAmount()), bodyFont));
        valCell.setPadding(6);
        valCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        valCell.setBorderColor(borderLight);
        summaryTable.addCell(valCell);

        // Subtotal & Tax
        PdfPCell labelTax = new PdfPCell(new Paragraph("Convenience / Gateway Service Fees:", bodyFont));
        labelTax.setPadding(6);
        labelTax.setBorderColor(borderLight);
        summaryTable.addCell(labelTax);

        PdfPCell valTax = new PdfPCell(new Paragraph("₹0.00", bodyFont));
        valTax.setPadding(6);
        valTax.setHorizontalAlignment(Element.ALIGN_RIGHT);
        valTax.setBorderColor(borderLight);
        summaryTable.addCell(valTax);

        // Grand Total
        PdfPCell labelTotal = new PdfPCell(new Paragraph("Total Settled Amount:", boldFont));
        labelTotal.setPadding(8);
        labelTotal.setBackgroundColor(bgLight);
        labelTotal.setBorderColor(borderLight);
        summaryTable.addCell(labelTotal);

        PdfPCell valTotal = new PdfPCell(new Paragraph(formatCurrency(rent.getAmount()), boldFont));
        valTotal.setPadding(8);
        valTotal.setBackgroundColor(bgLight);
        valTotal.setHorizontalAlignment(Element.ALIGN_RIGHT);
        valTotal.setBorderColor(borderLight);
        summaryTable.addCell(valTotal);

        document.add(summaryTable);


        // Transaction Details
        Paragraph txnHeader = new Paragraph("TRANSACTION INFORMATION", sectionTitleFont);
        txnHeader.setSpacingAfter(6);
        document.add(txnHeader);

        PdfPTable txnTable = new PdfPTable(2);
        txnTable.setWidthPercentage(100);
        txnTable.setWidths(new float[]{30f, 70f});
        txnTable.setSpacingAfter(25);

        addTableRow(txnTable, "Payment Gateway:", "Razorpay Online Secure", bodyFont, boldFont, borderLight);
        addTableRow(txnTable, "Razorpay Order ID:", rent.getRazorpayOrderId() != null ? rent.getRazorpayOrderId() : "N/A", bodyFont, boldFont, borderLight);
        addTableRow(txnTable, "Payment ID (Txn ID):", rent.getTransactionId() != null ? rent.getTransactionId() : "Pending", bodyFont, boldFont, borderLight);
        addTableRow(txnTable, "Signature Hash:", rent.getRazorpaySignature() != null ? rent.getRazorpaySignature() : "Pending", bodyFont, boldFont, borderLight);
        addTableRow(txnTable, "Settlement Status:", rent.getStatus().toUpperCase(), boldFont, boldFont, borderLight);

        document.add(txnTable);


        // PAID Graphical Watermark Stamp
        if ("paid".equalsIgnoreCase(rent.getStatus())) {
            PdfPTable stampTable = new PdfPTable(1);
            stampTable.setWidthPercentage(40);
            stampTable.setHorizontalAlignment(Element.ALIGN_CENTER);
            stampTable.setSpacingAfter(20);
            
            PdfPCell stampCell = new PdfPCell();
            stampCell.setBackgroundColor(new Color(20, 184, 166, 30));
            stampCell.setBorderColor(new Color(20, 184, 166, 150));
            stampCell.setBorderWidth(2f);
            stampCell.setPadding(10);
            stampCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            
            Paragraph stampTxt = new Paragraph("SECURELY PAID", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, primaryTeal));
            stampTxt.setAlignment(Element.ALIGN_CENTER);
            stampCell.addElement(stampTxt);
            
            Paragraph systemTxt = new Paragraph("RAZORPAY VERIFIED", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, primaryTeal));
            systemTxt.setAlignment(Element.ALIGN_CENTER);
            stampCell.addElement(systemTxt);
            
            stampTable.addCell(stampCell);
            document.add(stampTable);
        }

        // Footer Note
        Paragraph footer = new Paragraph("This is an electronically generated system document. No physical signature is required.", footerFont);
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(10);
        document.add(footer);

        document.close();
        return out.toByteArray();
    }


    private void addTableRow(PdfPTable table, String label, String value, Font valFont, Font labelFont, Color borderColor) {
        PdfPCell c1 = new PdfPCell(new Paragraph(label, labelFont));
        c1.setPadding(5);
        c1.setBorderColor(borderColor);
        table.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Paragraph(value != null ? value : "—", valFont));
        c2.setPadding(5);
        c2.setBorderColor(borderColor);
        table.addCell(c2);
    }


    private String formatCurrency(Double amount) {
        if (amount == null) return "₹0.00";
        NumberFormat formatter = NumberFormat.getCurrencyInstance(Locale.of("en", "IN"));
        return formatter.format(amount);
    }
}
