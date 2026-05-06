import pandas as pd
import os

# Define the column headers and create an empty DataFrame
column_headers = ["Applicant ID", "Signup", "Personal Details", "Contact Information", "Guardian Particulars", "Programme Selection", "Educational Background", "Examinations Taken", "Examination Subjects", "Financing Your Study", "Referee", "Application Summary"]
df = pd.DataFrame(columns=column_headers)

# Add some sample data to the DataFrame
df.loc[0] = ["001", "Done", "Done", "In Progress", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]
df.loc[1] = ["002", "Done", "Done", "Done", "In Progress", "In Progress", "N/A", "N/A", "N/A", "In Progress", "N/A", "N/A"]
df.loc[2] = ["003", "Done", "Done", "Done", "Done", "Done", "Done", "In Progress", "In Progress", "N/A", "N/A", "N/A"]
df.loc[3] = ["004", "Done", "Done", "Done", "Done", "Done", "Done", "In Progress", "In Progress", "N/A", "N/A", "N/A"]
df.loc[4] = ["005", "Done", "Done", "Done", "Done", "Done", "Done", "In Progress", "In Progress", "N/A", "N/A", "N/A"]
df.loc[5] = ["006", "Done", "Done", "Done", "Done", "Done", "Done", "In Progress", "In Progress", "N/A", "N/A", "N/A"]
df.loc[6] = ["007", "Done", "Done", "Done", "Done", "Done", "Done", "In Progress", "In Progress", "N/A", "N/A", "N/A"]

# Create an Excel writer object and write the DataFrame to a new worksheet
writer = pd.ExcelWriter('applicant_stages.xlsx', engine='xlsxwriter')
df.to_excel(writer, sheet_name='Applicant Stages', index=False)

# Format the Excel file with color coding
workbook = writer.book
worksheet = writer.sheets['Applicant Stages']

# Define a dictionary with the colors and their corresponding formatting
color_format_dict = {
    'Done': {'bg_color': '#00FF00'},
    'In Progress': {'bg_color': '#FFD700'},
    'N/A': {'bg_color': '#FFFFFF'}
}

# Loop through each column and apply the color formatting based on the value
for col_num, header in enumerate(column_headers):
    column_data = df[header]
    for row_num, value in enumerate(column_data):
        if value in color_format_dict:
            color_format = workbook.add_format({'bg_color': color_format_dict[value]['bg_color']})
            worksheet.write(row_num + 1, col_num, value, color_format)

# Save the Excel file
writer.save()

# Open the file using the default application
os.startfile("applicant_stages.xlsx")
