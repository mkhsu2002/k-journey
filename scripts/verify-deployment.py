"""Check Cloudflare production metadata and exact deployed static assets."""
import concurrent.futures
import hashlib
import json
import os
from pathlib import Path
import time
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://k-journey.pages.dev/"


def fetch(url, headers=None):
    request = urllib.request.Request(url, headers={"User-Agent": "k-journey-release-verification", **(headers or {})})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def verify():
    expected = os.environ.get("EXPECTED_COMMIT")
    if expected:
        account = os.environ["CLOUDFLARE_ACCOUNT_ID"]
        token = os.environ["CLOUDFLARE_API_TOKEN"]
        data = json.loads(fetch(
            f"https://api.cloudflare.com/client/v4/accounts/{account}/pages/projects/k-journey",
            {"Authorization": f"Bearer {token}"},
        ))
        if not data.get("success"):
            raise RuntimeError("Cloudflare project readback failed")
        project = data["result"]
        deployment = project["canonical_deployment"]
        metadata = deployment["deployment_trigger"]["metadata"]
        if (project["production_branch"] != "main" or deployment["environment"] != "production"
                or deployment["latest_stage"]["status"] != "success"
                or metadata["branch"] != "main" or metadata["commit_hash"] != expected):
            raise RuntimeError("Production deployment does not match the expected main commit")
        print(f"Production commit verified: {expected}", flush=True)

    files = sorted(path for path in (ROOT / "dist").rglob("*") if path.is_file())
    if not files:
        raise RuntimeError("Build output is empty")

    def check(path):
        relative = path.relative_to(ROOT / "dist").as_posix()
        # urllib follows Pages' extensionless HTML redirects.
        body = fetch(BASE + urllib.parse.quote(relative))
        if hashlib.sha256(body).digest() != hashlib.sha256(path.read_bytes()).digest():
            raise RuntimeError(f"Public file differs: {relative}")

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(check, files))
    print(f"Verified all {len(files)} public files against dist/", flush=True)


if __name__ == "__main__":
    for attempt in range(6):
        try:
            verify()
            break
        except Exception as error:
            # Never print headers or credential-bearing request objects.
            print(f"Verification attempt {attempt + 1} failed: {type(error).__name__}: {error}", flush=True)
            if attempt == 5:
                raise SystemExit(1)
            time.sleep(10)
