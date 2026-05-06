!pip install ipywidgets
import pandas as pd
import ipywidgets as widgets
from IPython.display import display, HTML

# Function to create input forms using ipywidgets
def create_input_forms():
    # Student form
    student_name = widgets.Text(placeholder='Student Name')
    index_number = widgets.Text(placeholder='Index Number')
    student_form = widgets.VBox([
        widgets.Label("Student Information:"),
        student_name,
        index_number
    ])
    display(student_form)

    # Course form
    course_title = widgets.Text(placeholder='Course Title')
    credit_hours = widgets.FloatText(placeholder='Credit Hours')
    grade = widgets.Text(placeholder='Grade')
    grade_points = widgets.FloatText(placeholder='Grade Points')
    course_form = widgets.VBox([
        widgets.Label("Course Information:"),
        course_title,
        credit_hours,
        grade,
        grade_points
    ])
    display(course_form)

    # Cumulative form
    cumulative_credit_hours = widgets.FloatText(placeholder='Cumulative Credit Hours')
    cumulative_grade_average = widgets.FloatText(placeholder='Cumulative Grade Average')
    sgpa = widgets.FloatText(placeholder='SGPA')
    cgpa = widgets.FloatText(placeholder='CGPA')
    cumulative_form = widgets.VBox([
        widgets.Label("Cumulative Information:"),
        cumulative_credit_hours,
        cumulative_grade_average,
        sgpa,
        cgpa
    ])
    display(cumulative_form)

    return {
        'student_name': student_name,
        'index_number': index_number
    }, {
        'course_title': course_title,
        'credit_hours': credit_hours,
        'grade': grade,
        'grade_points': grade_points
    }, {
        'cumulative_credit_hours': cumulative_credit_hours,
        'cumulative_grade_average': cumulative_grade_average,
        'sgpa': sgpa,
        'cgpa': cgpa
    }

# ... (rest of your code remains the same)

def run_automation():
    student_form_widgets, course_form_widgets, cumulative_form_widgets = create_input_forms()
    
    courses_df = pd.DataFrame(columns=['Course Title', 'Credit Hours', 'Grade', 'Grade Points'])
    
    while True:
        # Get values from ipywidgets
        course_data = {
            'course_title': course_form_widgets['course_title'].value,
            'credit_hours': course_form_widgets['credit_hours'].value,
            'grade': course_form_widgets['grade'].value,
            'grade_points': course_form_widgets['grade_points'].value
        }
        if not course_data['course_title']:
            break
        courses_df = add_course(courses_df, course_data)
        display(HTML("<h3>Course added. Enter another course or leave Course Title blank to finish.</h3>"))
    
    # Get values from ipywidgets
    cumulative_data = {
        'cumulative_credit_hours': cumulative_form_widgets['cumulative_credit_hours'].value,
        'cumulative_grade_average': cumulative_form_widgets['cumulative_grade_average'].value,
        'sgpa': cumulative_form_widgets['sgpa'].value,
        'cgpa': cumulative_form_widgets['cgpa'].value
    }
    
    # ... (rest of your code remains the same)

# Run the automation
run_automation()