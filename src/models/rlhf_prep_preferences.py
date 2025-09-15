import argparse
import json
import os
from typing import List, Dict


def main():
    parser = argparse.ArgumentParser(description="Prepare preference data for RLHF from conversations.")
    parser.add_argument("--input", type=str, default="models/training_data/sample_conversations.jsonl", help="Input JSONL conversations")
    parser.add_argument("--output", type=str, default="models/rlhf/preferences.jsonl", help="Output JSONL preferences path")
    args = parser.parse_args()

    os.makedirs(os.path.dirname(args.output), exist_ok=True)

    preferences: List[Dict] = []
    with open(args.input, "r", encoding="utf-8") as fin:
        for line in fin:
            if not line.strip():
                continue
            conv = json.loads(line)
            messages = conv.get("messages", [])
            # Toy heuristic: mark longer candidate response as preferred over shorter one in same convo if exists
            candidate_replies = [m for m in messages if m.get("role") in ("assistant", "candidate")]
            if len(candidate_replies) >= 2:
                a = candidate_replies[0]["content"]
                b = candidate_replies[1]["content"]
                preferred = a if len(a) >= len(b) else b
                rejected = b if preferred is a else a
                preferences.append({
                    "id": conv.get("id"),
                    "prompt": "\n".join([m["content"] for m in messages if m.get("role") in ("system", "interviewer", "user")]),
                    "chosen": preferred,
                    "rejected": rejected
                })

    with open(args.output, "w", encoding="utf-8") as fout:
        for pref in preferences:
            fout.write(json.dumps(pref, ensure_ascii=False) + "\n")

    print(f"Wrote {len(preferences)} preference pairs to {args.output}")


if __name__ == "__main__":
    main() 