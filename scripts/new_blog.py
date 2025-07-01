import os
import sys
import re
from datetime import datetime, timezone, timedelta

# Helper function for sanitizing title to slug/filename base
def sanitize_title(title):
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug, flags=re.UNICODE)
    slug = slug.strip()
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug

# Helper function to format date locally with timezone offset
def get_formatted_local_date():
    now = datetime.now().astimezone()
    # Format like: 2025-04-03T06:55:46-07:00
    return now.strftime('%Y-%m-%dT%H:%M:%S%z')[:-2] + ':' + now.strftime('%z')[-2:]

args = sys.argv[1:]

if len(args) != 1:
    print("Usage: python scripts/new_blog.py <filename.md | Blog Post Title>", file=sys.stderr)
    sys.exit(1)

input_arg = args[0]
filename = None
slug = None
title = ''

# Determine if input is filename or title, derive slug/filename/title
if input_arg.endswith('.md'):
    filename = input_arg
    slug = os.path.splitext(os.path.basename(filename))[0]
    if not slug or '/' in slug or '\\' in slug or '..' in slug:
        print(f"Error: Invalid filename or slug derived from filename: '{input_arg}'", file=sys.stderr)
        sys.exit(1)
else:
    title = input_arg.strip()
    if not title:
        print("Error: Blog post title cannot be empty.", file=sys.stderr)
        sys.exit(1)
    slug = sanitize_title(title)
    if not slug:
        print(f"Error: Could not generate a valid slug from the title: '{title}'", file=sys.stderr)
        sys.exit(1)
    filename = f"{slug}.md"
    print(f"Generated filename: '{filename}'")

target_dir = os.path.join('src', 'content', 'blog')
target_path = os.path.join(target_dir, filename)
template_path = os.path.join('src', 'templates', 'blog.md')

# 1. Ensure target directory exists
try:
    os.makedirs(target_dir, exist_ok=True)
except Exception as err:
    print(f"Error creating directory {target_dir}: {err}", file=sys.stderr)
    sys.exit(1)

# 2. Check if file already exists
if os.path.exists(target_path):
    print(f"Error: File already exists at {target_path}", file=sys.stderr)
    sys.exit(1)

# 3. Read the template file
try:
    with open(template_path, 'r', encoding='utf-8') as f:
        template_content = f.read()
except Exception as err:
    print(f"Error reading template file {template_path}: {err}", file=sys.stderr)
    sys.exit(1)

# 4. Get local date and replace placeholders
local_date = get_formatted_local_date()

import re
template_content = re.sub(r'^slug:.*$', f'slug: "{slug}"', template_content, flags=re.MULTILINE)
template_content = re.sub(r'^date:.*$', f'date: {local_date}', template_content, flags=re.MULTILINE)
template_content = re.sub(r'^lastmod:.*$', f'lastmod: {local_date}', template_content, flags=re.MULTILINE)

if title:
    template_content = re.sub(r'^title:.*$', f'title: {title}', template_content, flags=re.MULTILINE)

# 5. Write the new file
try:
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(template_content)
    print(f"Successfully created blog post at {target_path}")
except Exception as err:
    print(f"Error writing file {target_path}: {err}", file=sys.stderr)
    sys.exit(1)
