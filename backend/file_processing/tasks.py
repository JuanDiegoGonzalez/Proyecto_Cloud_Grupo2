from celery import Celery
from fpdf import FPDF
from docx import Document
from pptx import Presentation
from openpyxl import load_workbook
from odf import text, teletype
from odf.opendocument import load

app = Celery('tasks_copy', broker = 'redis://localhost:6379/0')

@app.task
def docx_a_pdf(docx_file, pdf_file):
    document = Document(docx_file)
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size = 12)
    for para in document.paragraphs:
        pdf.cell(200, 10, txt=para.text, ln=True, align='L')
    pdf.output(pdf_file)

@app.task
def pptx_a_pdf(pptx_file, pdf_file):
    presentation = Presentation(pptx_file)
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size = 12)
    for slide in presentation.slides:
        for shape in slide.shapes:
            if hasattr(shape, "text"):
                pdf.cell(200, 10, txt=shape.text, ln=True, align='L')
    pdf.output(pdf_file)

@app.task
def xlsx_a_pdf(xlsx_file, pdf_file):
    wb = load_workbook(xlsx_file)
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size = 12)

    for sheet_name in wb.sheetnames:
        sheet = wb[sheet_name]
        for row in sheet.iter_rows():
            for cell in row:
                pdf.cell(40, 10, txt=str(cell.value), ln=True)
    pdf.output(pdf_file)

@app.task
def odt_a_pdf(odt_file, pdf_file):
    doc = load(odt_file)
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size = 12)
    for para in doc.getElementsByType(text.P):
        pdf.cell(200, 10, txt=teletype.extractText(para), ln=True, align='L')
    pdf.output(pdf_file)