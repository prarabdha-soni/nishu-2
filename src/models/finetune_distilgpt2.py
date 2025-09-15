import argparse
import json
import os
import time
from dataclasses import dataclass
from typing import List, Dict

import torch
from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    Trainer,
    TrainingArguments,
    DataCollatorForLanguageModeling,
)


@dataclass
class ConversationSample:
    id: str
    messages: List[Dict[str, str]]


def read_jsonl(path: str) -> List[ConversationSample]:
    samples: List[ConversationSample] = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            obj = json.loads(line)
            samples.append(ConversationSample(id=obj["id"], messages=obj["messages"]))
    return samples


def format_conversation(sample: ConversationSample) -> str:
    parts: List[str] = []
    for message in sample.messages:
        role = message.get("role", "user")
        content = message.get("content", "")
        if role in ("assistant", "candidate"):
            parts.append(f"Assistant: {content}")
        elif role in ("interviewer", "user"):
            parts.append(f"User: {content}")
        elif role == "system":
            parts.append(f"System: {content}")
        else:
            parts.append(f"{role.capitalize()}: {content}")
    # Join with newlines and append end of text token implicitly
    return "\n".join(parts)


def build_dataset(samples: List[ConversationSample], tokenizer: AutoTokenizer, max_length: int) -> Dataset:
    texts = [format_conversation(s) for s in samples]

    def tokenize(batch: Dict[str, List[str]]):
        return tokenizer(
            batch["text"],
            truncation=True,
            max_length=max_length,
            padding=False,
        )

    dataset = Dataset.from_dict({"text": texts})
    return dataset.map(tokenize, batched=True, remove_columns=["text"])


def main():
    parser = argparse.ArgumentParser(description="Fine-tune distilgpt2 on conversational JSONL.")
    parser.add_argument("--data", type=str, default="models/training_data/sample_conversations.jsonl", help="Path to JSONL training data")
    parser.add_argument("--model", type=str, default="distilgpt2", help="Base model name or path")
    parser.add_argument("--output_dir", type=str, default="models/fine_tuned", help="Output directory root")
    parser.add_argument("--epochs", type=int, default=1)
    parser.add_argument("--batch_size", type=int, default=2)
    parser.add_argument("--lr", type=float, default=5e-5)
    parser.add_argument("--max_length", type=int, default=512)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    run_dir = os.path.join(args.output_dir, f"distilgpt2-finetuned-{int(time.time())}")
    os.makedirs(run_dir, exist_ok=True)

    tokenizer = AutoTokenizer.from_pretrained(args.model)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    model = AutoModelForCausalLM.from_pretrained(args.model)

    samples = read_jsonl(args.data)
    dataset = build_dataset(samples, tokenizer, args.max_length)

    data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

    training_args = TrainingArguments(
        output_dir=run_dir,
        overwrite_output_dir=True,
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        learning_rate=args.lr,
        warmup_steps=0,
        weight_decay=0.0,
        logging_steps=10,
        save_steps=50,
        save_total_limit=2,
        evaluation_strategy="no",
        fp16=torch.cuda.is_available(),
        seed=args.seed,
        push_to_hub=False,
        report_to=[],
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset,
        data_collator=data_collator,
    )

    trainer.train()
    trainer.save_model(run_dir)
    tokenizer.save_pretrained(run_dir)

    print(f"Saved fine-tuned model to: {run_dir}")


if __name__ == "__main__":
    main() 