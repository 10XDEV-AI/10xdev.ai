from nbconvert import PythonExporter
import nbformat

def convert_ipynb_to_python(file_path):
  with open(file_path) as f:
    nb = nbformat.read(f, as_version=4)

  python_exporter = PythonExporter()
  (python_code, _) = python_exporter.from_notebook_node(nb)

  return python_code

