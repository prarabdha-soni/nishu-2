import argparse
import json
import os
import time
from typing import List, Dict

import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel


class RewardModel(nn.Module):
    def __init__(self, base_model_name: str = "distilbert-base-uncased"):
        super().__init__()
        self.encoder = AutoModel.from_pretrained(base_model_name)
        hidden_size = self.encoder.config.hidden_size
        self.scorer = nn.Linear(hidden_size, 1)

    def forward(self, input_ids: torch.Tensor, attention_mask: torch.Tensor) -> torch.Tensor:
        out = self.encoder(input_ids=input_ids, attention_mask=attention_mask)
        pooled = out.last_hidden_state[:, 0]  # CLS token embedding
        score = self.scorer(pooled)
        return score.squeeze(-1)


def load_preferences(path: str) -> List[Dict]:
    prefs: List[Dict] = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                prefs.append(json.loads(line))
    return prefs


def main():
    parser = argparse.ArgumentParser(description="Train a simple reward model from preferences.")
    parser.add_argument("--prefs", type=str, default="models/rlhf/preferences.jsonl")
    parser.add_argument("--out_dir", type=str, default="models/rlhf")
    parser.add_argument("--epochs", type=int, default=1)
    parser.add_argument("--lr", type=float, default=2e-5)
    parser.add_argument("--batch_size", type=int, default=4)
    parser.add_argument("--base_encoder", type=str, default="distilbert-base-uncased")
    args = parser.parse_args()

    os.makedirs(args.out_dir, exist_ok=True)
    run_dir = os.path.join(args.out_dir, f"reward_model-{int(time.time())}")
    os.makedirs(run_dir, exist_ok=True)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    tokenizer = AutoTokenizer.from_pretrained(args.base_encoder)
    model = RewardModel(args.base_encoder).to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr)
    loss_fn = nn.BCEWithLogitsLoss()

    prefs = load_preferences(args.prefs)

    def batches(lst: List[Dict], n: int):
        for i in range(0, len(lst), n):
            yield lst[i:i + n]

    model.train()
    for _ in range(args.epochs):
        for batch in batches(prefs, args.batch_size):
            prompts = [b["prompt"] for b in batch]
            chosen = [b["chosen"] for b in batch]
            rejected = [b["rejected"] for b in batch]

            # Build paired inputs: [prompt + response]
            chosen_texts = [p + "\n" + c for p, c in zip(prompts, chosen)]
            rejected_texts = [p + "\n" + r for p, r in zip(prompts, rejected)]

            tok_chosen = tokenizer(chosen_texts, padding=True, truncation=True, return_tensors="pt").to(device)
            tok_rejected = tokenizer(rejected_texts, padding=True, truncation=True, return_tensors="pt").to(device)

            optimizer.zero_grad()
            score_chosen = model(**tok_chosen)
            score_rejected = model(**tok_rejected)

            # Turn pairwise preference into binary labels by margin
            margin = score_chosen - score_rejected
            labels = torch.ones_like(margin)
            loss = loss_fn(margin, labels)
            loss.backward()
            optimizer.step()

    # Save
    model.eval()
    torch.save(model.state_dict(), os.path.join(run_dir, "pytorch_model.bin"))
    with open(os.path.join(run_dir, "config.json"), "w") as f:
        json.dump({"base_encoder": args.base_encoder}, f)

    print(f"Saved reward model to: {run_dir}")


if __name__ == "__main__":
    main() 