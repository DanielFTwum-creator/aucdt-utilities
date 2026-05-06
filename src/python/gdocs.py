from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

def generate_google_doc_survey(file_contents, spreadsheet_id):
    try:
        print('Getting credentials spreadsheet with survey fields...')
        # Build the credentials object
        credentials = service_account.Credentials.from_service_account_file(
            filename='./service_account.json',
            scopes=['https://www.googleapis.com/auth/spreadsheets']
        )
        
        # Build the API client
        service = build('sheets', 'v4', credentials=credentials)

        spreadsheet_id = ''
        
        # Define the survey fields to collect
        survey_fields = ['title', 'body']
        
        # Use the Google Sheets API to generate the survey form
        print('Updating spreadsheet with survey fields...')
        results = service.spreadsheets().values().update(
            spreadsheetId=spreadsheet_id,
            range='A1:B1',
            values=[survey_fields]
        ).execute()
        print('Spreadsheet updated!')

        # Build the survey form HTML
        print('Building survey form HTML...')
        survey_name = file_contents['title']
        survey_body = file_contents['body']
        survey_options = ['<select name="survey">', '</select>', '</br>']
        survey_select = '<input type="checkbox" name="survey"> Choose from: <select name="survey"></select>'
        survey_form = f'<html><h1>{survey_name}</h1><p>{survey_body}</p>{survey_options}{survey_select}</html>'
        print('Survey form HTML generated!')

        # Write the survey results to a file
        print('Writing survey form HTML to file...')
        with open(f'{survey_name}_results.html', 'w') as file:
            file.write(survey_form)
        print('Survey results saved to file')
        
    except HttpError as error:
        print(f'An error occurred: {error}')
        return None

file_contents = {
    'title': 'Customer Satisfaction Survey',
    'body': 'Please take a few minutes to answer the following questions about your recent experience with our company.'
}

spreadsheet_id = '1m2ETqqJO0X_AZBloOFnvHAwvVhrElH7mke9w0FhwX-E'
generate_google_doc_survey(file_contents, spreadsheet_id)
