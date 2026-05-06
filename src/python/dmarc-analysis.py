import time
import webbrowser
import os
import gzip
import xml.etree.ElementTree as ET
import zipfile

# specify the directory where the xml.gz and zip files are located
directory = "../sample_data"

# initialize the results list and counts
results = []
pass_count = 0
fail_count = 0

# loop through each file in the directory
start_time = time.time()

for filename in sorted(os.listdir(directory)):

    # check if the file is a gzipped xml file or a zip file
    # print(f'filename', filename)
    if filename.endswith(".xml.gz") or filename.endswith(".zip"):
        # open the file using gzip if it is a gzipped xml file
        if filename.endswith(".xml.gz"):
            with gzip.open(os.path.join(directory, filename), "rb") as f:
                file_contents = f.read().decode("utf-8")
        # open the file using zipfile if it is a zip file
        elif filename.endswith(".zip"):
            with zipfile.ZipFile(os.path.join(directory, filename), "r") as zip_ref:
                # assume that the zip file contains only one xml file
                zip_info = zip_ref.infolist()[0]
                with zip_ref.open(zip_info, "r") as f:
                    file_contents = f.read().decode("utf-8")

        # parse the XML string
        root = ET.fromstring(file_contents)

        # get the auth_results element
        auth_results = root.find(".//auth_results")

        # get the dkim and spf elements
        dkim = auth_results.find(".//dkim/result")
        spf = auth_results.find(".//spf/result")

        # check if dkim and spf elements exist and both passed
        if dkim is not None and spf is not None and dkim.text == "pass" and spf.text == "pass":
            results.append((filename, "PASS"))
            pass_count += 1
        else:
            results.append((filename, "FAIL"))
            fail_count += 1
# sort the results by status, with "FAIL" first and then "PASS"
results.sort(key=lambda x: x[1], reverse=False)

# calculate the pass/fail ratio as a percentage
ratio = pass_count / len(results) * 100
ratio_str = "{:.2f}%".format(ratio)

# calculate total time taken
total_time = round(time.time() - start_time, 4)

# get the current date and format it
current_date = time.strftime("%Y-%m-%d %H:%M:%S")

# generate the HTML
html = """
<html>
<head>
 <style>
        body {{
            font-family: Arial, sans-serif;
        }}
        h1 {{
            font-size: 24px;
            font-weight: 700;
            line-height: 1.1;
        }}
        h3 {{
            font-size: 14px;
            font-weight: 700;
            line-height: 1.1;
        }}
        p {{
            font-size: 14px;
            line-height: 1.4;
        }}
        blockquote {{
            font-size: 21px;
            font-style: italic;
            font-weight: 400;
            line-height: 1.4;
        }}
        pre {{
            font-size: 13px;
            line-height: 1.5;
        }}
        table {{
            border-collapse: collapse;
            margin: auto;
            width: 60%;
        }}
        th, td {{
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }}
        th {{
            background-color: #4CAF50;
            color: #fff;
        }}
        tr:nth-child(even) {{
            background-color: #f2f2f2;
        }}
        .pass {{
            color: green;
            font-weight: 400;
        }}
        .fail {{
            color: red;
            font-weight: 600;
        }}
        tr.fail {{
            background-color: #ffe6e6;
        }}
    </style>
    </head>
<body>
<center>
<h1>DMARC Analysis Results</h1>
<table>
<tr><td><p>Current Date and Time:</p></td><td>{}</td></tr>
<tr><td><p>Processed: </td><td><strong>{}</strong> files (<strong>{}</strong> PASS, <strong>{}</strong> FAIL)</p></td></tr>
<tr><td><p>Pass/Fail Ratio: </td><td><strong>{}</strong></p></td></tr>
<tr><td><p>Processing time: </td><td><strong>{} s</strong></p></td></tr>
</table>
</center>
<table>
<tr>
<th>#</th>
<th>File Name</th>
<th>Result</th>
</tr>
""".format(current_date, len(results), pass_count, fail_count, ratio_str, total_time)

for i, result in enumerate(results, 1):
    filename, status = result
    if status == "PASS":
        status_class = "pass"
    else:
        status_class = "fail"
    html += "<tr class='{}'><td>{}</td><td><a href='{}'>{}</a></td><td>{}</td></tr>\n".format(
        status_class, i, os.path.join(directory, filename), filename, status)

html += """
</table>
</body>
</html>
"""

# write the HTML to a file
with open("dmarc_analysis_results.html", "w") as f:
    f.write(html)

# open the HTML file in a web browser
webbrowser.open("file://" + os.path.realpath("dmarc_analysis_results.html"))
