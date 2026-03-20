import json
import os
import re
import sys
from pathlib import Path

web_repo = Path(__file__).resolve().parents[1]
out_path = web_repo / 'js' / 'projects-data.js'


def resolve_summary_dir() -> Path:
    configured = os.environ.get('PROJECT_SUMMARY_DIR')
    if configured:
        candidate = Path(configured).expanduser()
    else:
        candidate = web_repo.parent / 'project-portfolio-summaries'

    if not candidate.exists():
        print(
            'Project summaries directory not found. '
            'Set PROJECT_SUMMARY_DIR or clone/link the summaries repo next to this site repo.',
            file=sys.stderr,
        )
        print(f'Expected path: {candidate}', file=sys.stderr)
        raise SystemExit(1)

    return candidate


summary_dir = resolve_summary_dir()

excluded_project_ids = {
    'netai-chat',
    'netai-chat-extension',
    'netai-wrapper',
}

index_text = (summary_dir / 'index.md').read_text()
categories = {}
current = None
for line in index_text.splitlines():
    match = re.match(r'^##\s+(.+)$', line.strip())
    if match:
        current = match.group(1).strip()
        categories[current] = []
        continue

    link_match = re.search(r'\[([^\]]+)\]\(([^)]+\.md)\)', line)
    if link_match and current:
        categories[current].append((link_match.group(1).strip(), link_match.group(2).strip()))

project_to_category = {}
for category, items in categories.items():
    for _, link in items:
        project_to_category[Path(link).name] = category


def extract_year(value: str | None) -> int:
    if not value:
        return 0
    year_match = re.search(r'(19|20)\d{2}', value)
    return int(year_match.group(0)) if year_match else 0


def split_stack_items(value: str) -> list[str]:
    items = []
    current = []
    depth = 0

    for char in value:
        if char == '(':
            depth += 1
            current.append(char)
            continue

        if char == ')':
            depth = max(depth - 1, 0)
            current.append(char)
            continue

        if char == ',' and depth == 0:
            part = ''.join(current).strip()
            if part:
                items.append(part)
            current = []
            continue

        current.append(char)

    tail = ''.join(current).strip()
    if tail:
        items.append(tail)

    return items


projects = []
for markdown_file in sorted(summary_dir.glob('*.md')):
    if markdown_file.name == 'index.md':
        continue

    if markdown_file.stem in excluded_project_ids:
        continue

    text = markdown_file.read_text()
    lines = text.splitlines()

    title = next(
        (
            re.sub(r'^#\s+', '', line).strip()
            for line in lines
            if line.startswith('# ')
        ),
        markdown_file.stem.replace('-', ' ').title(),
    )

    tagline = ''
    for line in lines:
        if line.strip().startswith('>'):
            tagline = line.replace('>', '', 1).strip()
            break

    stack_items = []
    stack_match = re.search(r'##\s+Tech Stack\n(.*?)(?:\n##\s+|\Z)', text, re.S)
    if stack_match:
        for raw_line in stack_match.group(1).splitlines():
            raw_line = raw_line.strip()
            if raw_line.startswith('- '):
                line_content = raw_line[2:].strip()
                line_content = re.sub(r'^\*\*([^*]+)\*\*:\s*', '', line_content).strip()
                line_content = re.sub(r'^[A-Za-z\s/&]+:\s*', '', line_content).strip()
                line_content = line_content.replace('**', '')
                if line_content:
                    stack_items.extend(split_stack_items(line_content))

    deduped_stack = []
    seen_stack = set()
    for item in stack_items:
        if item not in seen_stack:
            seen_stack.add(item)
            deduped_stack.append(item)

    highlights = []
    feature_match = re.search(r'##\s+Key Features\n(.*?)(?:\n##\s+|\Z)', text, re.S)
    if feature_match:
        for raw_line in feature_match.group(1).splitlines():
            raw_line = raw_line.strip()
            if raw_line.startswith('- '):
                highlights.append(raw_line[2:].strip())

    metrics = []
    metrics_match = re.search(r'##\s+Metrics\n(.*?)(?:\n##\s+|\Z)', text, re.S)
    if metrics_match:
        for raw_line in metrics_match.group(1).splitlines():
            raw_line = raw_line.strip()
            if raw_line.startswith('- '):
                metrics.append(raw_line[2:].strip())

    started_match = re.search(r'\*\*Started:\*\*\s*([^\n]+)', text)
    updated_match = re.search(r'\*\*Last Updated:\*\*\s*([^\n]+)', text)
    started = started_match.group(1).strip() if started_match else 'Unknown'
    updated = updated_match.group(1).strip() if updated_match else 'Unknown'

    projects.append(
        {
            'id': markdown_file.stem,
            'title': title,
            'tagline': tagline,
            'category': project_to_category.get(markdown_file.name, 'Other Projects'),
            'started': started,
            'lastUpdated': updated,
            'startedYear': extract_year(started),
            'updatedYear': extract_year(updated),
            'stack': deduped_stack,
            'highlights': highlights,
            'metrics': metrics,
        }
    )

projects.sort(key=lambda project: (project['startedYear'], project['updatedYear'], project['title']))

output = "// Auto-generated from project-portfolio-summaries markdown files\n"
output += "window.PROJECTS_DATA = " + json.dumps(projects, indent=2) + ";\n"
out_path.write_text(output)

print(f'Wrote {len(projects)} projects to {out_path}')
