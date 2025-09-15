import argparse
import json
import os
import time
from typing import List

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM


def load_prompts(path: str) -> List[str]:
    prompts: List[str] = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            obj = json.loads(line)
            parts = [m["content"] for m in obj.get("messages", []) if m.get("role") in ("system", "interviewer", "user")]
            if parts:
                prompts.append("\n".join(parts))
    return prompts


def main():
    parser = argparse.ArgumentParser(description="Minimal PPO RLHF scaffold (non-functional stub).")
    parser.add_argument("--data", type=str, default="models/training_data/sample_conversations.jsonl")
    parser.add_argument("--policy", type=str, default="distilgpt2")
    parser.add_argument("--reward_model_dir", type=str, default="models/rlhf")
    parser.add_argument("--out_dir", type=str, default="models/rlhf")
    args = parser.parse_args()

    os.makedirs(args.out_dir, exist_ok=True)
    run_dir = os.path.join(args.out_dir, f"ppo-{int(time.time())}")
    os.makedirs(run_dir, exist_ok=True)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    tokenizer = AutoTokenizer.from_pretrained(args.policy)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    policy = AutoModelForCausalLM.from_pretrained(args.policy).to(device)

    prompts = load_prompts(args.data)

    # Stub loop: generate one response per prompt and "score" using a dummy constant
    policy.eval()
    generations: List[str] = []
    for prompt in prompts[:4]:
        inputs = tokenizer(prompt, return_tensors="pt").to(device)
        with torch.no_grad():
            out = policy.generate(**inputs, max_new_tokens=64)
        text = tokenizer.decode(out[0], skip_special_tokens=True)
        generations.append(text)

    # Save stub checkpoint artifacts
    with open(os.path.join(run_dir, "generations.txt"), "w", encoding="utf-8") as f:
        for g in generations:
            f.write(g + "\n\n---\n\n")

    policy.save_pretrained(run_dir)
    tokenizer.save_pretrained(run_dir)

    print(f"Saved PPO scaffold artifacts to: {run_dir}")


if __name__ == "__main__":
    main() 