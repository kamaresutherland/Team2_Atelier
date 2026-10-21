### 1. Embedding-based compatibility

Each item photo becomes a vector, and outfits are scored by how well the vectors fit together. Open-source examples use CLIP-family models.

- One project uses **FashionCLIP**, a contrastive image-text model that maps visual properties of products into a shared latent space as 512-dimensional vectors, with **Qdrant** for vector search.
- Another combines image and text queries using **CLIP** embeddings with **FAISS** for search, and uses segmentation masks to isolate garments for cleaner embeddings.

Segmentation or background removal before embedding makes a real difference.

*Sources: [AURA (GitHub)](https://github.com/SHXZ7/ML-TASK), [MyWardrobe (GitHub)](https://github.com/rahul370139/CLIP)*

### 2. LLM-based reasoning over text descriptions

Instead of vectors, you convert each item to structured text (type, color, fit, style, season, occasion) and ask an LLM to compose or rank outfits.

- Berkeley's **DressSense** capstone used this approach, with two main models: one for clothing feature recognition and one for outfit recommendation.
- Their evaluation found that LLM accuracy was near perfect for attributes like fit, pattern, primary color, and style, but lower for functional features (0.82) and brand (0.32).

**Takeaway:** vision-based auto-tagging is reliable for visual attributes but weaker for things the photo doesn't show, so let users edit tags.

*Source: [DressSense, Berkeley MIDS Capstone](https://www.ischool.berkeley.edu/projects/2025/dresssense)*

### 3. Hybrid with collaborative filtering

The research frontier is combining LLMs with learned user preferences.

- A June 2026 paper, **CFALR**, describes user-outfit interactions in natural language and uses LLMs to capture fashion semantics, with collaborative-filtering embeddings bridging the semantic and interaction spaces.
- It was evaluated on the **Polyvore** and **IQON** benchmarks.

This approach needs large amounts of interaction data across many users, so it's likely overkill for an early version, but it shows where personalization can go.

*Sources: [CFALR (ChatPaper)](https://chatpaper.com/paper/298909), [CFALR (SMU)](https://ink.library.smu.edu.sg/sis_research/11268)*
