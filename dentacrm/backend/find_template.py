import os

venv_path = "./.venv"
output_path = "./template_content.txt"

found_path = None
for root, dirs, files in os.walk(venv_path):
    if "account_links.html" in files:
        found_path = os.path.join(root, "account_links.html")
        break

if found_path:
    with open(found_path, "r") as f:
        content = f.read()
    with open(output_path, "w") as out:
        out.write(content)
    print("SUCCESS: copied template")
else:
    with open(output_path, "w") as out:
        out.write("Not found")
    print("FAILED: template not found")
