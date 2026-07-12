"""Benchmark e5-large encode throughput on MPS: fp32 vs fp16 x batch sizes.

Uses real corpus segments so length distribution matches the backfill.
Run: uv run --project .. python bench_encode.py
"""

import time

import psycopg2
import torch
from sentence_transformers import SentenceTransformer

MODEL_NAME = "intfloat/multilingual-e5-large"
N_TEXTS = 1024

conn = psycopg2.connect(host="localhost", port=5432, dbname="oda", user="postgres", password="root")
cur = conn.cursor()
cur.execute(
    """SELECT content FROM "taleSegmentRaw"
       WHERE char_length(content) > 20 ORDER BY id LIMIT %s""",
    (N_TEXTS,),
)
texts = [f"passage: {r[0]}" for r in cur.fetchall()]
conn.close()
print(f"{len(texts)} real segments, avg {sum(map(len, texts)) // len(texts)} chars")

results = {}
baseline = None

for dtype_name, dtype in [("fp32", torch.float32), ("fp16", torch.float16)]:
    model = SentenceTransformer(MODEL_NAME, model_kwargs={"torch_dtype": dtype})
    model.encode(texts[:64], batch_size=32)  # warmup

    for batch_size in [32, 64, 128]:
        start = time.perf_counter()
        emb = model.encode(texts, batch_size=batch_size, normalize_embeddings=True)
        rate = len(texts) / (time.perf_counter() - start)
        results[(dtype_name, batch_size)] = rate
        print(f"{dtype_name} batch={batch_size}: {rate:.1f} texts/s")

    if dtype_name == "fp32":
        baseline = model.encode(texts[:128], batch_size=32, normalize_embeddings=True)
    else:
        check = model.encode(texts[:128], batch_size=32, normalize_embeddings=True)
        cos = (baseline * check).sum(axis=1)
        print(f"fp16 vs fp32 cosine: min {cos.min():.5f}, mean {cos.mean():.5f}")

    del model
    torch.mps.empty_cache()

best = max(results, key=results.get)
print(f"\nBest: {best[0]} batch={best[1]} at {results[best]:.1f} texts/s "
      f"({results[best] / results[('fp32', 32)]:.2f}x vs fp32/32)")
