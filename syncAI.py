
def sync_AI()
    df4 = pd.read_csv("df4.csv")
    print("Syncing AI")
    file_paths_details = []
    Files_to_ignore = open(path+"/.AIIgnore", "r").read().splitlines()
    print("Files and directories to ignore:")
    print(Files_to_ignore)

    for root, directories, files in os.walk(path):
            # Exclude any directories that appear in the ignore list
            directories[:] = [d for d in directories if d not in Files_to_ignore]
            print("Directories:", directories)
            for filename in files:
                if filename not in Files_to_ignore:
                    print(filename)
                    # Append the path to each file to the file_paths list
                    file_paths_details.append(os.path.join(root, filename))

    for i in range(0,len(file_paths_details)):
        if file_paths_details[i] not in df4["filepath"]:
            df4.append(file_paths_details[i])
            df4["last_sync"] = time.time()


    for i in range(0,len(file_paths_details)):