"""Manually notify IndexNow after the production site has been deployed.

The published key proves control of this host; it is not a Google verification
token or a Bing Webmaster account credential. Never run this from the build.
"""

import json
import re
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit


ORIGIN = "https://www.beautynails.com.tr"
ENDPOINT = "https://api.indexnow.org/indexnow"


def main():
    root = Path(__file__).resolve().parent.parent
    files = [p for p in (root / "public").glob("*.txt") if re.fullmatch(r"[a-f0-9]{32}\.txt", p.name)]
    if len(files) != 1:
        raise ValueError("Expected exactly one BeautyNails IndexNow key file")
    key = files[0].read_text(encoding="utf-8")
    if key != files[0].stem:
        raise ValueError("The key must exactly match the published filename")
    key_location = f"{ORIGIN}/{files[0].name}"
    with urllib.request.urlopen(key_location, timeout=25) as response:
        if response.status != 200 or response.url != key_location or response.read().decode("utf-8") != key:
            raise ValueError("Production key file is not published correctly; nothing submitted")
    with urllib.request.urlopen(f"{ORIGIN}/sitemap.xml", timeout=25) as response:
        if response.status != 200 or response.url != f"{ORIGIN}/sitemap.xml":
            raise ValueError("Production sitemap is not available")
        xml = response.read(1_000_001)
    if len(xml) > 1_000_000:
        raise ValueError("Sitemap exceeds this client's size limit")
    urls = [element.text for element in ET.fromstring(xml).findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
    if not 1 <= len(urls) <= 10_000 or len(set(urls)) != len(urls):
        raise ValueError("Sitemap must contain 1–10,000 unique URLs")
    for url in urls:
        parsed = urlsplit(url or "")
        if parsed.scheme != "https" or parsed.netloc != "www.beautynails.com.tr" or parsed.query or parsed.fragment:
            raise ValueError("Only this site's canonical production URLs may be submitted")
    payload = {"host": "www.beautynails.com.tr", "key": key, "keyLocation": key_location, "urlList": urls}
    request = urllib.request.Request(ENDPOINT, data=json.dumps(payload).encode("utf-8"), headers={
        "Content-Type": "application/json; charset=utf-8", "User-Agent": "BeautyNails-IndexNow/1.0",
    }, method="POST")
    try:
        response = urllib.request.urlopen(request, timeout=30)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        status = response.status
        body = response.read(1000).decode("utf-8", errors="replace")
    print(json.dumps({
        "submitted_at_utc": datetime.now(timezone.utc).isoformat(),
        "endpoint": ENDPOINT, "key_file_verified": True,
        "url_count": len(urls), "urls": urls, "http_status": status,
        "result": "received" if status == 200 else "key_validation_pending" if status == 202 else "failed",
        "response_body": body,
    }, ensure_ascii=False, indent=2))
    return 0 if status in (200, 202) else 1


if __name__ == "__main__":
    sys.exit(main())
