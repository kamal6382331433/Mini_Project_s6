package com.daed.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daed.model.Marks;
import com.daed.model.Student;
import com.daed.repository.MarksRepository;
import com.daed.repository.StudentRepository;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class ReportService {

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private StudentRepository studentRepository;

    public ByteArrayInputStream generateStudentPerformanceReport(Long studentId) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Fetch Data
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            List<Marks> marksList = marksRepository.findByStudentId(studentId);

            // Title
            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
            Paragraph title = new Paragraph("Student Performance Report", fontTitle);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            // Student Info
            Font fontInfo = FontFactory.getFont(FontFactory.HELVETICA, 12);
            document.add(new Paragraph("Roll Number: " + student.getRollNumber(), fontInfo));
            document.add(new Paragraph("Name: " + student.getUser().getFullName(), fontInfo));
            document.add(new Paragraph("Department: " + student.getDepartment(), fontInfo));
            document.add(Chunk.NEWLINE);

            // Table
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new int[] { 4, 2, 2, 2, 2, 2 });

            // Header
            String[] headers = { "Subject", "Internal", "External", "Total", "Grade", "Status" };
            for (String header : headers) {
                PdfPCell cell = new PdfPCell();
                cell.setPhrase(new Phrase(header));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
                table.addCell(cell);
            }

            // Data
            for (Marks mark : marksList) {
                table.addCell(mark.getSubject().getSubjectName());
                table.addCell(String.valueOf(mark.getInternalMarks()));
                table.addCell(String.valueOf(mark.getExternalMarks()));
                table.addCell(String.valueOf(mark.getTotalMarks()));
                table.addCell(mark.getGrade());
                table.addCell(mark.getStatus());
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
