import os

# Extensions to skip (lowercase, with dot)
SKIP_EXTENSIONS = {
    ".json",
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg",
    ".pdf",
    ".zip", ".tar", ".gz", ".7z",
    ".exe", ".dll", ".so",
    ".mp3", ".mp4", ".mov", ".avi",".py"
}

# Folders to skip
SKIP_DIRS = {
    ".git",
    "__pycache__",
    "node_modules",
    ".venv",
    "venv",
}

def should_skip_file(filename: str) -> bool:
    _, ext = os.path.splitext(filename.lower())
    return ext in SKIP_EXTENSIONS

def main():
    root_dir = os.getcwd()

    for current_dir, dirnames, filenames in os.walk(root_dir):
        # Modify dirnames in-place to skip folders
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]

        for filename in filenames:
            if should_skip_file(filename):
                continue

            file_path = os.path.join(current_dir, filename)
            rel_path = os.path.relpath(file_path, root_dir)

            print(f"\n--- {rel_path} ---")

            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    print(f.read())
            except UnicodeDecodeError:
                print("[Skipped: non-text file]")
            except Exception as e:
                print(f"[Error reading file: {e}]")

if __name__ == "__main__":
    main()
