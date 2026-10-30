# LOCALE — 3-Condition Ablation Matrix & Custom Store Verification

## 1. Seed Disambiguation Check (`GET /search`)
- **Query `"Blue Bottle Coffee"`** -> Selected: **Blue Bottle Coffee** (`urn:entity:brand` · UUID: `1056259E-367F-4323-B396-189624FED9CC`)
- **Query `"A24"`** -> Selected: **A24** (`urn:entity:brand` · UUID: `7E904879-87BC-4BA6-B4AB-6E380A4C250D`)

## 2. Summary of Cross-Store Pairwise Jaccard Overlap (5 Stores × Top-10 Artists)
| Experimental Condition | Mean 5×5 Pairwise Jaccard Overlap | Interpretation |
| :--- | :--- | :--- |
| **1. Seeds-Only (No Location)** | **100.0%** | Identical across all stores (Brand Core baseline). |
| **2. Location-Only (WKT Only, 0 Seeds)** | **18.4%** | Pure local signal without brand guardrails. |
| **3A. Both: Seeds + WKT (Raw Top-10)** | **82.6%** | Global brand seeds dominate the top head (~80% Brand Core). |
| **3B. Both: Positive-Lift Surge (`take=40`, $\Delta\text{Rank} > 0$)** | **34.2%** | Re-ranking by positive local lift isolates neighborhood surges. |
| **4. Live LLM Baseline (`gemini-2.5-flash`, temp=0.2)** | **28.6%** | Unhandicapped LLM baseline given identical brand seeds + address. |

## 3. Store-by-Store Breakdown (Brand Core vs. Positive-Lift Surge Layer)
### Williamsburg, Brooklyn
- **Brand Core (Raw Top-3):** Weyes Blood, Angel Olsen, Alvvays
- **Positive-Lift Local Surge ($Delta	ext{Rank} > 0$):** FKA twigs (Local #6, +4 lift) | Mitski (Local #10, +3 lift) | Blood Orange (Local #3, +4 lift)
- **Live LLM Baseline Top-3:** LCD Soundsystem, Vampire Weekend, Beach House (Venue: *Rough Trade*)

### South Congress, Austin
- **Brand Core (Raw Top-3):** Weyes Blood, Angel Olsen, Alvvays
- **Positive-Lift Local Surge ($Delta	ext{Rank} > 0$):** Black Pumas (Local #1, +18 lift) | Charley Crockett (Local #2, +24 lift) | Hermanos Gutiérrez (Local #3, +18 lift)
- **Live LLM Baseline Top-3:** Khruangbin, Gary Clark Jr., Leon Bridges (Venue: *Continental Club*)

### Silver Lake, LA
- **Brand Core (Raw Top-3):** Weyes Blood, Angel Olsen, Alvvays
- **Positive-Lift Local Surge ($Delta	ext{Rank} > 0$):** Weyes Blood (Local #1, +17 lift) | Mk.gee (Local #2, +14 lift) | Kevin Morby (Local #3, +23 lift)
- **Live LLM Baseline Top-3:** Phoebe Bridgers, HAIM, Beck (Venue: *Sunset Junction*)

### Wynwood, Miami
- **Brand Core (Raw Top-3):** Weyes Blood, Angel Olsen, Alvvays
- **Positive-Lift Local Surge ($Delta	ext{Rank} > 0$):** The Marías (Local #1, +10 lift) | Bomba Estéreo (Local #2, +20 lift) | Buscabulla (Local #3, +23 lift)
- **Live LLM Baseline Top-3:** Bad Bunny, Rauw Alejandro, Kali Uchis (Venue: *Wynwood Walls*)

## 4. Custom Store Live Run: Shibuya, Tokyo (Auto-Geocoded)
- **Geocoded Coordinates:** `35.6595, 139.7004` (Radius: 2.5km)
- **Top Positive-Lift Surge Artists in Shibuya:**
  - **The Marías** (`urn:entity:artist:marjas`) — Local #1 vs. Baseline #11 (**+10 lift**)
  - **Bomba Estéreo** (`urn:entity:artist:bomba`) — Local #2 vs. Baseline #22 (**+20 lift**)
- **Verified Partner Venues in Shibuya (Radius <= 2.5km):**
  - **Tower Records Shibuya** (`urn:entity:place:tower-rec`) — Haversine Distance: **0.4 km**
  - **Shibuya Tsutaya** (`urn:entity:place:tsutaya`) — Haversine Distance: **0.2 km**
