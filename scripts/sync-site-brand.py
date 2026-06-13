import json
import re
import sys
from pathlib import Path

web_repo = Path(__file__).resolve().parents[1]
brand_path = web_repo / 'data' / 'site-brand.json'
site_config_path = web_repo / 'js' / 'site-config.js'

META_START = '<!-- site-brand:meta-start -->'
META_END = '<!-- site-brand:meta-end -->'
NAV_START = '<!-- site-brand:nav-subtitles-start -->'
NAV_END = '<!-- site-brand:nav-subtitles-end -->'
BRAND_START = '// site-brand:generated-start'
BRAND_END = '// site-brand:generated-end'


def load_brand() -> dict:
    return json.loads(brand_path.read_text(encoding='utf-8'))


def page_keywords(brand: dict, page: dict) -> str:
    if page.get('keywords'):
        return page['keywords']

    keywords = brand['metaKeywords']
    suffix = page.get('keywordsSuffix')
    if suffix:
        keywords = keywords.replace('Kyle Mathias, ', f'Kyle Mathias, {suffix}', 1)
    return keywords


def page_description(brand: dict, page: dict) -> str:
    if page.get('description'):
        return page['description']
    return f"{page.get('descriptionPrefix', '')}{brand['metaDescription']}"


def build_standard_meta(brand: dict, page: dict) -> str:
    description = page_description(brand, page)
    keywords = page_keywords(brand, page)
    title = page['title']
    og_title = page.get('ogTitle', title)
    og_url = page.get('ogUrl', brand['siteUrl'])
    twitter_url = page.get('twitterUrl', og_url)
    share_image = brand['shareImage']
    share_image_alt = page.get('shareImageAlt', brand['shareImageAlt'])
    og_description = page.get('ogDescription', description)
    twitter_description = page.get('twitterDescription', og_description)
    twitter_title = page.get('twitterTitle', og_title)

    lines = [
        f'    <meta name="description" content="{description}">',
        f'    <meta name="keywords" content="{keywords}">',
        f'    <title>{title}</title>',
        '    <!-- Standard Image Meta Tag -->',
        f'    <meta name="image" content="{share_image}">',
        '',
        '    <!-- Facebook Meta Tags -->',
        f'    <meta property="og:url" content="{og_url}">',
        '    <meta property="og:type" content="website">',
        f'    <meta property="og:title" content="{og_title}">',
        f'    <meta property="og:description" content="{og_description}">',
        f'    <meta property="og:image" content="{share_image}">',
        '    <meta property="og:image:width" content="1200">',
        '    <meta property="og:image:height" content="630">',
        f'    <meta property="og:image:alt" content="{share_image_alt}">',
        '',
        '    <!-- Twitter Meta Tags -->',
        '    <meta name="twitter:card" content="summary_large_image">',
        '    <meta property="twitter:domain" content="kylemathias.com">',
        f'    <meta property="twitter:url" content="{twitter_url}">',
        f'    <meta name="twitter:title" content="{twitter_title}">',
        f'    <meta name="twitter:description" content="{twitter_description}">',
        f'    <meta name="twitter:image" content="{share_image}">',
        f'    <meta name="twitter:image:alt" content="{share_image_alt}">',
    ]
    return '\n'.join(lines)


def build_projects_meta(brand: dict, page: dict) -> str:
    description = page['description']
    keywords = page['keywords']
    title = page['title']
    og_url = page['ogUrl']
    twitter_url = page['twitterUrl']
    share_image = brand['shareImage']
    share_image_alt = page['shareImageAlt']
    og_description = page['ogDescription']
    og_title = page['ogTitle']

    lines = [
        f'    <meta name="description" content="{description}">',
        f'    <meta name="keywords" content="{keywords}">',
        f'    <title>{title}</title>',
        '',
        f'    <meta name="image" content="{share_image}">',
        f'    <meta property="og:url" content="{og_url}">',
        '    <meta property="og:type" content="website">',
        f'    <meta property="og:title" content="{og_title}">',
        f'    <meta property="og:description" content="{og_description}">',
        f'    <meta property="og:image" content="{share_image}">',
        '    <meta property="og:image:width" content="1200">',
        '    <meta property="og:image:height" content="630">',
        f'    <meta property="og:image:alt" content="{share_image_alt}">',
        '',
        '    <meta name="twitter:card" content="summary_large_image">',
        '    <meta property="twitter:domain" content="kylemathias.com">',
        f'    <meta property="twitter:url" content="{twitter_url}">',
        f'    <meta name="twitter:title" content="{og_title}">',
        f'    <meta name="twitter:description" content="{og_description}">',
        f'    <meta name="twitter:image" content="{share_image}">',
    ]
    return '\n'.join(lines)


def build_nav_subtitles(brand: dict) -> str:
    return (
        f'          <p class="subtitle">{brand["titleLine"]}</p>\n'
        f'          <p class="subtitle-skills">{brand["taglineLine"]}</p>'
    )


def build_index_nav_subtitles(brand: dict) -> str:
    return (
        f'            <p class="subtitle">{brand["titleLine"]}</p>\n'
        f'            <p class="subtitle-skills">{brand["taglineLine"]}</p>'
    )


def replace_region(content: str, start_marker: str, end_marker: str, replacement: str) -> str:
    pattern = re.compile(
        re.escape(start_marker) + r'[\s\S]*?' + re.escape(end_marker),
        re.MULTILINE,
    )
    indent_match = re.search(r'^(\s*)' + re.escape(start_marker), content, re.MULTILINE)
    indent = indent_match.group(1) if indent_match else '    '
    if not pattern.search(content):
        raise ValueError(f'Missing markers: {start_marker} ... {end_marker}')

    wrapped = f'{start_marker}\n{replacement}\n{indent}{end_marker}'
    return pattern.sub(wrapped, content, count=1)


def build_site_config_brand(brand: dict) -> str:
    fields = [
        ('name', brand['name']),
        ('titleLine', brand['titleLine']),
        ('taglineLine', brand['taglineLine']),
        ('titleFull', brand['titleFull']),
        ('metaDescription', brand['metaDescription']),
        ('metaKeywords', brand['metaKeywords']),
        ('shareImageAlt', brand['shareImageAlt']),
        ('siteUrl', brand['siteUrl']),
        ('shareImage', brand['shareImage']),
    ]
    lines = ['    brand: {']
    for key, value in fields:
        lines.append(f'        {key}: {json.dumps(value)},')
    lines[-1] = lines[-1].rstrip(',')
    lines.append('    }')
    return '\n'.join(lines)


def sync_site_config(brand: dict) -> None:
    content = site_config_path.read_text(encoding='utf-8')
    brand_block = build_site_config_brand(brand)

    if BRAND_START in content and BRAND_END in content:
        content = replace_region(content, BRAND_START, BRAND_END, brand_block)
    else:
        insert_at = content.find('    // Get all pages that should appear in navigation')
        if insert_at == -1:
            raise ValueError('Could not find insertion point in site-config.js')
        wrapped = f'    {BRAND_START}\n{brand_block},\n    {BRAND_END}\n\n'
        content = content[:insert_at] + wrapped + content[insert_at:]

    site_config_path.write_text(content, encoding='utf-8', newline='\n')


def sync_html_page(page_id: str, brand: dict, page: dict) -> None:
    html_path = web_repo / page['file']
    content = html_path.read_text(encoding='utf-8')

    if page_id == 'projects':
        meta_block = build_projects_meta(brand, page)
    else:
        meta_block = build_standard_meta(brand, page)

    nav_block = build_index_nav_subtitles(brand) if page_id == 'index' else build_nav_subtitles(brand)

    content = replace_region(content, META_START, META_END, meta_block)
    content = replace_region(content, NAV_START, NAV_END, nav_block)
    html_path.write_text(content, encoding='utf-8', newline='\n')


def main() -> None:
    brand = load_brand()
    pages = brand['pages']

    for page_id, page in pages.items():
        sync_html_page(page_id, brand, page)
        print(f'Updated {page["file"]}')

    sync_site_config(brand)
    print(f'Updated {site_config_path.relative_to(web_repo)}')


if __name__ == '__main__':
    try:
        main()
    except ValueError as error:
        print(error, file=sys.stderr)
        raise SystemExit(1) from error
