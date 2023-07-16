import os
def generate_folder_structure(root_folder):
    log = []

    def traverse_folder(folder, indent_level):
        indent = "  " * indent_level
        log.append(f"{indent}- {folder}")

        for item in os.listdir(folder):
            item_path = os.path.join(folder, item)

            if os.path.isdir(item_path):
                traverse_folder(item_path, indent_level + 1)
            else:
                log.append(f"{indent}  - {item}")

    traverse_folder(root_folder, 0)
    return "\n".join(log)



if __name__ == "__main__":
    log_output =  generate_folder_structure("/Users/prathameshsutone/Download/10xdev.ai")
    print(log_output)

