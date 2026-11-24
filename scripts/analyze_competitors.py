import urllib.request
import re
import json

urls = [
    ('TripAdvisor', 'https://www.tripadvisor.in/Attractions-g297654-Activities-Pune_Pune_District_Maharashtra.html'),
    ('PuneGov', 'https://pune.gov.in/en/tourist-places/'),
    ('IncredibleIndia', 'https://www.incredibleindia.gov.in/en/maharashtra/pune/enjoy-natures-bounty-in-pune')
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}

for name, url in urls:
    print(f'=== {name} ({url}) ===')
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as response:
            html = response.read().decode('utf-8', errors='ignore')
            title = re.search(r'<title>(.*?)</title>', html, re.I | re.S)
            print('Title:', title.group(1).strip() if title else 'None')
            
            meta_desc = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']', html, re.I)
            if not meta_desc:
                meta_desc = re.search(r'<meta[^>]*content=["\']([^"\']*)["\'][^>]*name=["\']description["\']', html, re.I)
            print('Meta Description:', meta_desc.group(1).strip() if meta_desc else 'None')

            canonical = re.search(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']*)["\']', html, re.I)
            print('Canonical:', canonical.group(1) if canonical else 'None')
            
            # Find schemas
            schemas = re.findall(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.I | re.S)
            print(f'JSON-LD schemas count: {len(schemas)}')
            for i, s in enumerate(schemas[:4]):
                try:
                    data = json.loads(s.strip())
                    if isinstance(data, dict):
                        print(f"  Schema {i+1}: @type={data.get('@type')} keys={list(data.keys())[:6]}")
                        if data.get('@type') in ['ItemList', 'TouristAttraction', 'Place']:
                            print(f"    Details: {json.dumps(data)[:200]}...")
                    elif isinstance(data, list):
                        types = [d.get('@type') for d in data if isinstance(d, dict)]
                        print(f"  Schema {i+1}: List of types: {types}")
                except Exception as e:
                    print(f'  Schema {i+1} parse error: {e}')
            
            # Check og:tags
            og_title = re.search(r'<meta[^>]*property=["\']og:title["\'][^>]*content=["\']([^"\']*)["\']', html, re.I)
            print('OG Title:', og_title.group(1) if og_title else 'None')
    except Exception as e:
        print('Error fetching:', e)
    print()
