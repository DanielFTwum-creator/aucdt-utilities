import pandas as pd
from google.colab import forms
from IPython.display import display, HTML

# Function to create input forms
def create_input_forms():
    student_form = forms.FormBuilder()
    student_form.text('student_name', 'Student Name')
    student_form.text('index_number', 'Index Number')
    display(student_form)
    student_data = student_form.get_state()

    course_form = forms.FormBuilder()
    course_form.text('course_title', 'Course Title')
    course_form.number('credit_hours', 'Credit Hours')
    course_form.text('grade', 'Grade')
    course_form.number('grade_points', 'Grade Points')
    display(course_form)

    cumulative_form = forms.FormBuilder()
    cumulative_form.number('cumulative_credit_hours', 'Cumulative Credit Hours')
    cumulative_form.number('cumulative_grade_average', 'Cumulative Grade Average')
    cumulative_form.number('sgpa', 'SGPA')
    cumulative_form.number('cgpa', 'CGPA')
    display(cumulative_form)

    return student_data, course_form, cumulative_form

# Function to add a course to the DataFrame
def add_course(df, course_data):
    return df.append(course_data, ignore_index=True)

# Function to calculate GPA
def calculate_gpa(df):
    total_credit_hours = df['Credit Hours'].sum()
    total_grade_points = (df['Credit Hours'] * df['Grade Points']).sum()
    return total_grade_points / total_credit_hours if total_credit_hours > 0 else 0

# Main function to run the automation
def run_automation():
    student_data, course_form, cumulative_form = create_input_forms()
    
    courses_df = pd.DataFrame(columns=['Course Title', 'Credit Hours', 'Grade', 'Grade Points'])
    
    while True:
        course_data = course_form.get_state()
        if not course_data['course_title']:
            break
        courses_df = add_course(courses_df, course_data)
        display(HTML("<h3>Course added. Enter another course or leave Course Title blank to finish.</h3>"))
    
    cumulative_data = cumulative_form.get_state()
    
    # Calculate GPA
    gpa = calculate_gpa(courses_df)
    
    # Display results
    display(HTML("<h2>Student Result</h2>"))
    display(HTML(f"<p><strong>Name:</strong> {student_data['student_name']}</p>"))
    display(HTML(f"<p><strong>Index Number:</strong> {student_data['index_number']}</p>"))
    display(HTML("<h3>Courses</h3>"))
    display(courses_df)
    display(HTML(f"<p><strong>GPA:</strong> {gpa:.2f}</p>"))
    display(HTML("<h3>Cumulative Data</h3>"))
    for key, value in cumulative_data.items():
        display(HTML(f"<p><strong>{key.replace('_', ' ').title()}:</strong> {value}</p>"))

# Run the automation
run_automation()