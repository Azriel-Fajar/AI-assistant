import json
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak
from reportlab.lib.enums import TA_CENTER

OUTPUT = r"C:\Users\afw14\OneDrive\Documents\Kuliah S1 TI\JARKOM\Jawaban JarKom 5-7.pdf"

MODULES = [
    {
        "number": "5",
        "title": "Configuring Routing and Advanced Switching",
        "file": r"C:\Users\afw14\OneDrive\Documents\JARVIS\.claude\skills\quiz-auto\cache\answers_module5.json"
    },
    {
        "number": "6",
        "title": "Implementing Network Services",
        "file": r"C:\Users\afw14\OneDrive\Documents\JARVIS\.claude\skills\quiz-auto\cache\answers_module6.json"
    },
    {
        "number": "7",
        "title": "Explaining Application Services",
        "file": r"C:\Users\afw14\OneDrive\Documents\JARVIS\.claude\skills\quiz-auto\cache\answers_module07.json"
    },
]

PAGE_SIZE = 10  # answers per page group

def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        leftMargin=2.5*cm, rightMargin=2.5*cm,
        topMargin=2.5*cm, bottomMargin=2.5*cm
    )

    styles = getSampleStyleSheet()

    style_module_header = ParagraphStyle(
        "ModuleHeader",
        parent=styles["Normal"],
        fontSize=14,
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#1a1a2e"),
        spaceBefore=14,
        spaceAfter=4,
    )
    style_page_label = ParagraphStyle(
        "PageLabel",
        parent=styles["Normal"],
        fontSize=10,
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#2e4a7a"),
        spaceBefore=10,
        spaceAfter=4,
    )
    style_q = ParagraphStyle(
        "Q",
        parent=styles["Normal"],
        fontSize=9,
        fontName="Helvetica",
        textColor=colors.HexColor("#333333"),
        leftIndent=0,
    )
    style_a = ParagraphStyle(
        "A",
        parent=styles["Normal"],
        fontSize=9,
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#1a6b3a"),
        leftIndent=0,
    )

    story = []

    for idx, mod in enumerate(MODULES):
        if idx > 0:
            story.append(PageBreak())
        answers = load(mod["file"])

        story.append(Paragraph(f"Module {mod['number']}: {mod['title']}", style_module_header))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1a1a2e"), spaceAfter=8))

        # group into pages of PAGE_SIZE
        pages = [answers[i:i+PAGE_SIZE] for i in range(0, len(answers), PAGE_SIZE)]

        for page_idx, page_answers in enumerate(pages):
            story.append(Paragraph(f"Page {page_idx + 1}", style_page_label))

            table_data = [["#", "Question Keyword", "Answer"]]
            for row_idx, item in enumerate(page_answers):
                n = page_idx * PAGE_SIZE + row_idx + 1
                table_data.append([
                    str(n),
                    Paragraph(item["keyword"], style_q),
                    Paragraph(item["answer"], style_a),
                ])

            col_widths = [1*cm, 8.5*cm, 6.5*cm]
            t = Table(table_data, colWidths=col_widths, repeatRows=1)
            t.setStyle(TableStyle([
                # Header row
                ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#1a1a2e")),
                ("TEXTCOLOR", (0,0), (-1,0), colors.white),
                ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
                ("FONTSIZE", (0,0), (-1,0), 9),
                ("ALIGN", (0,0), (-1,0), "CENTER"),
                ("BOTTOMPADDING", (0,0), (-1,0), 6),
                ("TOPPADDING", (0,0), (-1,0), 6),
                # Body rows
                ("FONTNAME", (0,1), (-1,-1), "Helvetica"),
                ("FONTSIZE", (0,1), (-1,-1), 9),
                ("ALIGN", (0,1), (0,-1), "CENTER"),
                ("VALIGN", (0,0), (-1,-1), "TOP"),
                ("TOPPADDING", (0,1), (-1,-1), 5),
                ("BOTTOMPADDING", (0,1), (-1,-1), 5),
                # Alternating rows
                *[("BACKGROUND", (0,i), (-1,i), colors.HexColor("#f2f6ff")) for i in range(2, len(table_data), 2)],
                *[("BACKGROUND", (0,i), (-1,i), colors.white) for i in range(1, len(table_data), 2)],
                # Grid
                ("GRID", (0,0), (-1,-1), 0.5, colors.HexColor("#cccccc")),
                ("LINEBELOW", (0,0), (-1,0), 1.5, colors.HexColor("#1a1a2e")),
            ]))
            story.append(t)
            story.append(Spacer(1, 0.4*cm))

    doc.build(story)
    print(f"PDF written: {OUTPUT}")

if __name__ == "__main__":
    build_pdf()
