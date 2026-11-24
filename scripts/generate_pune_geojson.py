#!/usr/bin/env python3
"""Generate RFC 7946 compliant GeoJSON FeatureCollection of all 106+ verified destinations in Pune.
Used by search engines, GIS web crawlers, OpenStreetMap, and AI discovery bots for geospatial grounding.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INPUT_JSON = ROOT / "data/pune_places_106.json"
OUTPUT_DIR = ROOT / "public/geo"
OUTPUT_GEOJSON = OUTPUT_DIR / "pune-destinations.geojson"

def generate_geojson():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        places = json.load(f)
        
    features = []
    base_url = "https://explorepune-guide.vercel.app"
    
    for p in places:
        lat = p.get("latitude")
        lng = p.get("longitude")
        if lat is None or lng is None:
            continue
            
        slug = p.get("slug") or p.get("id")
        place_url = f"{base_url}/places/{slug}"
        img_url = p.get("image_url")
        if img_url and not img_url.startswith("http"):
            img_url = f"{base_url}{img_url}"
            
        feature = {
            "type": "Feature",
            "id": slug,
            "geometry": {
                "type": "Point",
                # RFC 7946 GeoJSON specification mandates [longitude, latitude] order
                "coordinates": [round(float(lng), 6), round(float(lat), 6)]
            },
            "properties": {
                "name": p.get("name"),
                "name_mr": p.get("name_mr"),
                "slug": slug,
                "category": p.get("category_slug") or p.get("category"),
                "address": p.get("address"),
                "address_mr": p.get("address_mr"),
                "fee_status": p.get("fee_status", "unknown"),
                "entry_fee_inr": p.get("entry_fee", 0),
                "opening_hours": p.get("opening_hours"),
                "popularity_score": p.get("popularity_score", 50),
                "url": place_url,
                "image_url": img_url,
                "verified": True,
                "locality": "Pune",
                "region": "Maharashtra",
                "country": "India"
            }
        }
        features.append(feature)
        
    geojson = {
        "type": "FeatureCollection",
        "name": "Explore Pune — Verified Heritage & Tourism Destinations",
        "description": "Geospatially grounded catalog of 106+ Maratha forts, Peshwa wadas, ancient temples, museums, and natural sanctuaries across Pune District, Maharashtra, India.",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
        },
        "bbox": [
            round(min(f["geometry"]["coordinates"][0] for f in features), 6),
            round(min(f["geometry"]["coordinates"][1] for f in features), 6),
            round(max(f["geometry"]["coordinates"][0] for f in features), 6),
            round(max(f["geometry"]["coordinates"][1] for f in features), 6)
        ],
        "features": features
    }
    
    with open(OUTPUT_GEOJSON, "w", encoding="utf-8") as f:
        json.dump(geojson, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully generated {OUTPUT_GEOJSON} with {len(features)} geolocated features.")
    print(f"Bounding Box: {geojson['bbox']}")

if __name__ == "__main__":
    generate_geojson()
