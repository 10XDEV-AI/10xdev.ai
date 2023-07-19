import os
from utilities.IgnoreAI import parse_ignore_file

def generate_folder_structure(email, root_folder):
    log = []

    def traverse_folder(root_folder, folder, indent_level):
        indent = " " * indent_level

        # Ignore directories starting with "."
        if os.path.basename(folder).startswith('.'):
            return

        log.append(f"{indent}- {folder.split('/')[-1]}")

        for item in os.listdir(folder):
            item_path = os.path.join(folder, item)

            if os.path.isdir(item_path):
                relpath = os.path.relpath(item_path, root_folder)
                if not AIignore(os.path.normpath(relpath)):
                    traverse_folder(root_folder, item_path, indent_level + 1)
            else:
                log.append(f"{indent} - {item}")

    ignore_file_path = os.path.join("../user", email, '.AIIgnore' + root_folder)
    AIignore = parse_ignore_file(ignore_file_path) if os.path.exists(ignore_file_path) else lambda x: False
    root_folder = os.path.join("../user", email, root_folder)
    traverse_folder(root_folder, root_folder, 0)

    return "\n".join(log)
