import os
import gitignore_parser

def IgnoreAI(path):
    files2analyse = []
    files2ignore = open(path+"/.AIIgnore", "r").read().splitlines()

    for root, directories, files in os.walk(path):
        # Exclude any directories that appear in the ignore list
        directories[:] = [d for d in directories if d not in files2ignore]
        #print("Directories:", directories)
        for filename in files:
            #print("File : "+filename)
            if os.path.relpath(os.path.join(root, filename), path) not in files2ignore:
                # Append relative path to file to file_paths_details list
                files2analyse.append(os.path.relpath(os.path.join(root, filename), path))

    print("Files to analyse : "+str((files2analyse)))

    print("Files to ignore : "+str((files2ignore)))
    return files2ignore,files2analyse
