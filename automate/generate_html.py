import json
import sys
from pathlib import Path


def load_json(json_path: Path) -> dict:
    with json_path.open("r", encoding="utf-8") as f:
        return json.load(f)


def render_template(template_path: Path, data: dict) -> str:
    template = template_path.read_text(encoding="utf-8")
    for key, value in data.items():
        template = template.replace("{{" + key + "}}", str(value))
    return template


def main() -> None:
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    template_path = script_dir / "template.html"
    
    if not template_path.exists():
        print(f"Error: template not found: {template_path}")
        sys.exit(1)

    json_files = list(script_dir.glob("*.json"))
    
    if not json_files:
        print("No JSON files found in the automate directory")
        sys.exit(1)

    for json_path in json_files:
        data = load_json(json_path)
        html = render_template(template_path, data)
        output_path = project_root / "problems" / (json_path.stem + ".html")
        output_path.write_text(html, encoding="utf-8")
        print(f"✓ Generated: {output_path}")


if __name__ == "__main__":
    main()
